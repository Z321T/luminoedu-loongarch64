import json
import os
import re
import hashlib
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pdfminer.high_level import extract_text
from docx import Document
from fastapi import HTTPException, UploadFile

from app.config import MEDIA_ROOT
from app.core.logger import setup_logger

logger = setup_logger("document_vectorization_service")

# 常量配置
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB
ALLOWED_EXTENSIONS = {'.txt', '.docx', '.pdf'}
VECTOR_DB_PATH = Path(MEDIA_ROOT) / "vector_db"
METADATA_PATH = Path(MEDIA_ROOT) / "documents" / "metadata"

# 初始化必要目录
VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)
METADATA_PATH.mkdir(parents=True, exist_ok=True)

# 文本分割器配置
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    length_function=len,
    separators=["\n\n\n", "\n\n", "\n", "。", "！", "？", "；", "，", " ", ""]
)


class TfidfVectorDatabase:
    """基于TF-IDF的向量数据库实现"""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

        # 文件路径
        self.vectors_file = self.base_path / "tfidf_vectors.npz"
        self.chunks_file = self.base_path / "chunks.json"
        self.vectorizer_file = self.base_path / "vectorizer.pkl"

        # 初始化组件
        self.vectorizer = TfidfVectorizer(
            max_features=5000,  # 限制特征数量
            stop_words=None,  # 不使用停用词（中文处理）
            ngram_range=(1, 2),  # 使用1-2gram
            min_df=1,  # 最小文档频率
            max_df=0.95,  # 最大文档频率
            token_pattern=r'[\u4e00-\u9fff]+|[a-zA-Z]+\w*'  # 中英文tokenizer
        )

        self.tfidf_matrix = None
        self.chunks_data = {"chunks": [], "next_id": 0}

        self._load_data()

    def _load_data(self):
        """加载现有数据"""
        if self.vectors_file.exists() and self.chunks_file.exists():
            try:
                # 加载向量矩阵
                npz_file = np.load(str(self.vectors_file))
                self.tfidf_matrix = npz_file['matrix']

                # 加载chunks数据
                self.chunks_data = self._load_chunks()

                # 重建vectorizer
                if self.chunks_data["chunks"]:
                    texts = [chunk["text"] for chunk in self.chunks_data["chunks"]]
                    self.vectorizer.fit(texts)

                logger.info(f"已加载{len(self.chunks_data['chunks'])}个文档块")
            except Exception as e:
                logger.error(f"加载数据失败: {str(e)}")
                self._create_new_data()
        else:
            self._create_new_data()

    def _create_new_data(self):
        """创建新的数据结构"""
        self.tfidf_matrix = None
        self.chunks_data = {"chunks": [], "next_id": 0}
        logger.info("创建新的TF-IDF向量数据库")

    def _load_chunks(self) -> Dict[str, Any]:
        """加载文本块数据"""
        if self.chunks_file.exists():
            try:
                with open(self.chunks_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"加载chunks失败: {str(e)}")
        return {"chunks": [], "next_id": 0}

    def _save_chunks(self, chunks_data: Dict[str, Any]):
        """保存文本块数据"""
        try:
            with open(self.chunks_file, 'w', encoding='utf-8') as f:
                json.dump(chunks_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"保存chunks失败: {str(e)}")

    def add_documents(self, texts: List[str], chunk_ids: List[str], document_id: str, metadatas: List[Dict]):
        """添加文档到向量数据库"""
        try:
            # 加载现有数据
            chunks_data = self._load_chunks()

            # 添加新文本块
            for text, chunk_id, metadata in zip(texts, chunk_ids, metadatas):
                chunk_data = {
                    "id": chunks_data["next_id"],
                    "chunk_id": chunk_id,
                    "text": text,
                    "document_id": document_id,
                    "metadata": metadata
                }
                chunks_data["chunks"].append(chunk_data)
                chunks_data["next_id"] += 1

            # 重新计算所有文档的TF-IDF矩阵
            all_texts = [chunk["text"] for chunk in chunks_data["chunks"]]
            self.tfidf_matrix = self.vectorizer.fit_transform(all_texts)

            # 保存数据
            np.savez_compressed(str(self.vectors_file), matrix=self.tfidf_matrix.toarray())
            self._save_chunks(chunks_data)
            self.chunks_data = chunks_data

            logger.info(f"成功添加{len(texts)}个文档块")

        except Exception as e:
            logger.error(f"添加文档失败: {str(e)}")
            raise

    def query(self, query_text: str, n_results: int = 5, document_id: str = None, staff_id: str = None) -> List[str]:
        """查询相似文档"""
        try:
            if not self.chunks_data["chunks"] or self.tfidf_matrix is None:
                return []

            # 将查询文本转换为TF-IDF向量
            query_vector = self.vectorizer.transform([query_text])

            # 计算余弦相似度
            similarities = cosine_similarity(query_vector, self.tfidf_matrix)[0]

            # 获取最相似的结果索引
            similar_indices = np.argsort(similarities)[::-1]

            results = []
            for idx in similar_indices:
                if len(results) >= n_results:
                    break

                if idx < len(self.chunks_data["chunks"]):
                    chunk = self.chunks_data["chunks"][idx]

                    # 过滤条件
                    if document_id and chunk["document_id"] != document_id:
                        continue
                    if staff_id and chunk["metadata"].get("staff_id") != staff_id:
                        continue

                    # 只返回相似度大于阈值的结果
                    if similarities[idx] > 0.1:
                        results.append(chunk["text"])

            return results

        except Exception as e:
            logger.error(f"查询失败: {str(e)}")
            return []

    def delete_document(self, document_id: str) -> List[int]:
        """删除文档"""
        try:
            chunks_data = self._load_chunks()
            deleted_ids = []

            # 找到要删除的块
            new_chunks = []
            for chunk in chunks_data["chunks"]:
                if chunk["document_id"] == document_id:
                    deleted_ids.append(chunk["id"])
                else:
                    new_chunks.append(chunk)

            if deleted_ids:
                chunks_data["chunks"] = new_chunks

                # 重新计算TF-IDF矩阵
                if new_chunks:
                    all_texts = [chunk["text"] for chunk in new_chunks]
                    self.tfidf_matrix = self.vectorizer.fit_transform(all_texts)
                    np.savez_compressed(str(self.vectors_file), matrix=self.tfidf_matrix.toarray())
                else:
                    self.tfidf_matrix = None
                    if self.vectors_file.exists():
                        self.vectors_file.unlink()

                self._save_chunks(chunks_data)
                self.chunks_data = chunks_data

            return deleted_ids

        except Exception as e:
            logger.error(f"删除文档失败: {str(e)}")
            return []


# 全局向量数据库实例
vector_db = TfidfVectorDatabase(str(VECTOR_DB_PATH))


# 其余函数保持不变，只需要更新依赖项...
def _generate_content_hash(content: str) -> str:
    """生成文档内容的哈希值"""
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def _extract_text_from_file(file_path: str, file_extension: str) -> str:
    """从文件中提取文本内容"""
    try:
        if file_extension == '.txt':
            return _extract_txt_content(file_path)
        elif file_extension == '.docx':
            return _extract_docx_content(file_path)
        elif file_extension == '.pdf':
            return _extract_pdf_content(file_path)
        else:
            raise ValueError(f"不支持的文件格式: {file_extension}")
    except Exception as e:
        logger.error(f"文本提取失败: {str(e)}")
        raise


def _extract_txt_content(file_path: str) -> str:
    """提取TXT文件内容，支持多种编码"""
    encodings = ['utf-8', 'utf-8-sig', 'gbk', 'gb2312', 'gb18030', 'big5', 'utf-16']

    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                content = f.read()
            logger.info(f"成功使用{encoding}编码读取TXT文件")
            return _preprocess_text_content(content)
        except (UnicodeDecodeError, UnicodeError):
            continue

    raise ValueError("无法识别文件编码格式，请确保文件是有效的文本文件")


def _extract_docx_content(file_path: str) -> str:
    """提取DOCX文件的纯文本内容"""
    try:
        doc = Document(file_path)
        content_parts = []

        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text:
                content_parts.append(text)

        if not content_parts:
            raise ValueError("DOCX文件中没有找到文本内容")

        content = '\n\n'.join(content_parts)
        logger.info(f"成功提取DOCX文件内容，共{len(content_parts)}个段落")
        return _preprocess_text_content(content)

    except Exception as e:
        logger.error(f"DOCX文件处理失败: {str(e)}")
        raise ValueError(f"无法处理DOCX文件: {str(e)}")


def _extract_pdf_content(file_path: str) -> str:
    """提取PDF文件的文本内容"""
    try:
        content = extract_text(file_path)
        if not content.strip():
            raise ValueError("PDF文件中没有找到文本内容")

        logger.info("成功提取PDF文件内容")
        return _preprocess_text_content(content)
    except Exception as e:
        logger.error(f"PDF文件处理失败: {str(e)}")
        raise ValueError(f"无法处理PDF文件: {str(e)}")


def _preprocess_text_content(content: str) -> str:
    """预处理文本内容"""
    if not content or not content.strip():
        raise ValueError("文件内容为空")

    # 标准化换行符
    content = content.replace('\r\n', '\n').replace('\r', '\n')
    # 移除多余的空白行
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    # 移除多余空格
    content = re.sub(r' +', ' ', content)

    result = content.strip()
    if not result:
        raise ValueError("预处理后文件内容为空")

    return result


# 继续之前的所有业务逻辑函数...
def _load_teacher_metadata(staff_id: str) -> List[Dict[str, Any]]:
    """加载教师的文档元数据"""
    metadata_file = METADATA_PATH / f"{staff_id}_documents.json"
    if metadata_file.exists():
        try:
            with open(metadata_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"加载元数据失败: {str(e)}")
            return []
    return []


def _save_teacher_metadata(staff_id: str, documents: List[Dict[str, Any]]) -> None:
    """保存教师的文档元数据"""
    metadata_file = METADATA_PATH / f"{staff_id}_documents.json"
    try:
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(documents, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"保存元数据失败: {str(e)}")
        raise


# 继续实现所有路由需要的函数...
async def validate_uploaded_file(file: UploadFile) -> bytes:
    """验证上传的文件"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件名不能为空")

    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件类型，仅支持: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"文件大小超过 {MAX_FILE_SIZE // 1024 // 1024}MB 限制"
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="文件内容为空")

    return content


async def process_and_store_document(file: UploadFile, staff_id: str, title: str) -> Dict[str, Any]:
    """处理并存储文档到向量数据库"""
    logger.info(f"开始处理教师{staff_id}的文档: {title}")

    content_bytes = await validate_uploaded_file(file)
    file_extension = Path(file.filename).suffix.lower()

    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp:
            temp_file_path = temp.name
            temp.write(content_bytes)

        content = _extract_text_from_file(temp_file_path, file_extension)

        if not content.strip():
            raise HTTPException(status_code=400, detail="无法从文件中提取有效文本内容")

        content_hash = _generate_content_hash(content)
        document_id = f"doc_{staff_id}_{content_hash[:12]}"

        # 检查是否已存在相同内容的文档
        existing_docs = _load_teacher_metadata(staff_id)
        for doc in existing_docs:
            if doc["content_hash"] == content_hash:
                logger.info(f"发现已存在的文档: {doc['title']}")
                return {
                    "document_id": doc["document_id"],
                    "title": doc["title"],
                    "is_new": False,
                    "message": "文档已存在，无需重复处理"
                }

        # 分割文本
        chunks = text_splitter.split_text(content)
        if not chunks:
            raise HTTPException(status_code=400, detail="文档内容过短，无法生成有效的文本块")

        # 添加到向量数据库
        chunk_ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{
            "document_id": document_id,
            "title": title,
            "chunk_index": i,
            "staff_id": staff_id
        } for i in range(len(chunks))]

        vector_db.add_documents(
            texts=chunks,
            chunk_ids=chunk_ids,
            document_id=document_id,
            metadatas=metadatas
        )

        # 保存文档元数据
        doc_metadata = {
            "document_id": document_id,
            "title": title,
            "filename": file.filename,
            "content_hash": content_hash,
            "created_at": datetime.now().isoformat(),
            "chunk_count": len(chunks),
            "file_size": len(content_bytes)
        }

        existing_docs.append(doc_metadata)
        _save_teacher_metadata(staff_id, existing_docs)

        logger.info(f"文档处理完成: {title}, 生成{len(chunks)}个文本块")

        return {
            "document_id": document_id,
            "title": title,
            "is_new": True,
            "chunk_count": len(chunks),
            "message": "文档处理并存储成功"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"处理文档失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"处理文档失败: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


async def list_teacher_documents(staff_id: str) -> List[Dict[str, Any]]:
    """列出教师的所有文档"""
    documents = _load_teacher_metadata(staff_id)
    return sorted(documents, key=lambda x: x["created_at"], reverse=True)


async def retrieve_document_context(staff_id: str, document_id: str, query: str, n_results: int = 5) -> List[str]:
    """从指定文档中检索相关上下文"""
    try:
        contexts = vector_db.query(
            query_text=query,
            n_results=n_results,
            document_id=document_id,
            staff_id=staff_id
        )
        logger.info(f"从文档{document_id}检索到{len(contexts)}个相关上下文")
        return contexts

    except Exception as e:
        logger.error(f"检索文档上下文失败: {str(e)}")
        return []


async def delete_document(staff_id: str, document_id: str) -> bool:
    """删除指定文档"""
    try:
        deleted_ids = vector_db.delete_document(document_id)
        if deleted_ids:
            logger.info(f"已从向量数据库删除文档{document_id}的{len(deleted_ids)}个文本块")

        existing_docs = _load_teacher_metadata(staff_id)
        updated_docs = [doc for doc in existing_docs if doc["document_id"] != document_id]

        if len(updated_docs) == len(existing_docs):
            logger.warning(f"未找到要删除的文档: {document_id}")
            return False

        _save_teacher_metadata(staff_id, updated_docs)
        logger.info(f"文档删除成功: {document_id}")
        return True

    except Exception as e:
        logger.error(f"删除文档失败: {str(e)}")
        return False


async def get_document_info(staff_id: str, document_id: str) -> Optional[Dict[str, Any]]:
    """获取文档详细信息"""
    documents = _load_teacher_metadata(staff_id)
    for doc in documents:
        if doc["document_id"] == document_id:
            return doc
    return None


async def search_documents(staff_id: str, keyword: str = None, limit: int = 20) -> List[Dict[str, Any]]:
    """搜索教师的文档"""
    documents = _load_teacher_metadata(staff_id)

    if keyword:
        keyword_lower = keyword.lower()
        documents = [
            doc for doc in documents
            if keyword_lower in doc["title"].lower() or keyword_lower in doc["filename"].lower()
        ]

    return sorted(documents, key=lambda x: x["created_at"], reverse=True)[:limit]


# 兼容性函数
def add_document_to_vector_db(texts: List[str], chunk_ids: List[str], document_id: str,
                              metadatas: List[Dict] = None) -> bool:
    """添加文档到向量数据库（兼容性函数）"""
    try:
        if metadatas is None:
            metadatas = [{"document_id": document_id, "chunk_id": chunk_id} for chunk_id in chunk_ids]

        vector_db.add_documents(
            texts=texts,
            chunk_ids=chunk_ids,
            document_id=document_id,
            metadatas=metadatas
        )
        return True
    except Exception as e:
        logger.error(f"添加文档到向量数据库失败: {str(e)}")
        return False


def delete_document_from_vector_db(document_id: str) -> List[int]:
    """从向量数据库删除文档（兼容性函数）"""
    try:
        return vector_db.delete_document(document_id)
    except Exception as e:
        logger.error(f"从向量数据库删除文档失败: {str(e)}")
        return []


def initialize_vector_database() -> bool:
    """初始化向量数据库"""
    try:
        VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)
        METADATA_PATH.mkdir(parents=True, exist_ok=True)
        logger.info("向量数据库初始化完成")
        return True
    except Exception as e:
        logger.error(f"向量数据库初始化失败: {str(e)}")
        return False


# 导出列表
__all__ = [
    'TfidfVectorDatabase',
    'vector_db',
    'process_and_store_document',
    'list_teacher_documents',
    'retrieve_document_context',
    'delete_document',
    'get_document_info',
    'search_documents',
    'validate_uploaded_file',
    'add_document_to_vector_db',
    'delete_document_from_vector_db',
    'initialize_vector_database',
    'VECTOR_DB_PATH',
    'METADATA_PATH'
]