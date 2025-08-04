import hashlib
import os
import re
import tempfile
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

import chromadb
from app.config import MEDIA_ROOT
from app.core.logger import setup_logger
from chromadb.utils import embedding_functions
from docx import Document
from fastapi import HTTPException, UploadFile
from langchain.text_splitter import RecursiveCharacterTextSplitter

logger = setup_logger("document_vectorization_service")

# 常量配置
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB
ALLOWED_EXTENSIONS = {'.txt', '.docx'}
VECTOR_DB_PATH = Path(MEDIA_ROOT) / "vector_db" # 向量数据库存储路径
METADATA_PATH = Path(MEDIA_ROOT) / "documents" / "metadata" # 文档元数据存储路径
MODELS_PATH = Path(MEDIA_ROOT) / "models"  # 本地模型存储路径

# 初始化必要目录
VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)
METADATA_PATH.mkdir(parents=True, exist_ok=True)
MODELS_PATH.mkdir(parents=True, exist_ok=True)


def _initialize_embedding_function():
    """初始化嵌入函数，支持本地模型"""
    try:
        # 尝试使用本地模型
        local_model_path = MODELS_PATH / "sentence-transformer"

        if local_model_path.exists():
            logger.info(f"使用本地模型: {local_model_path}")
            return embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=str(local_model_path)
            )
        else:
            # 如果本地模型不存在，使用在线模型并缓存到本地
            logger.info("本地模型不存在，使用在线模型")
            import sentence_transformers

            # 设置模型缓存目录
            os.environ['SENTENCE_TRANSFORMERS_HOME'] = str(MODELS_PATH)

            return embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="paraphrase-multilingual-MiniLM-L12-v2"
            )
    except Exception as e:
        logger.warning(f"SentenceTransformer初始化失败: {str(e)}")
        # 回退到ChromaDB默认嵌入函数（本地处理）
        return embedding_functions.DefaultEmbeddingFunction()


# 全局嵌入函数和文本分割器
embedding_function = _initialize_embedding_function()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,  # 增加块大小，适合教学内容
    chunk_overlap=100,  # 增加重叠，保持语义连贯
    length_function=len,
    separators=[
        "\n\n\n",  # 章节分隔
        "\n\n",  # 段落分隔
        "\n",  # 行分隔
        "。",  # 句号
        "！",  # 感叹号
        "？",  # 问号
        "；",  # 分号
        "，",  # 逗号
        " ",  # 空格
        ""  # 字符级别（最后选择）
    ]
)


def _generate_content_hash(content: str) -> str:
    """生成文档内容的哈希值"""
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def _get_chromadb_client() -> chromadb.PersistentClient:
    """获取ChromaDB客户端"""
    return chromadb.PersistentClient(path=str(VECTOR_DB_PATH))


def _extract_text_from_file(file_path: str, file_extension: str) -> str:
    """从文件中提取文本内容"""
    try:
        if file_extension == '.txt':
            return _extract_txt_content(file_path)
        elif file_extension == '.docx':
            return _extract_docx_content(file_path)
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

        # 提取所有段落文本
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text:  # 只保留非空段落
                content_parts.append(text)

        if not content_parts:
            raise ValueError("DOCX文件中没有找到文本内容")

        content = '\n\n'.join(content_parts)
        logger.info(f"成功提取DOCX文件内容，共{len(content_parts)}个段落")
        return _preprocess_text_content(content)

    except Exception as e:
        logger.error(f"DOCX文件处理失败: {str(e)}")
        raise ValueError(f"无法处理DOCX文件: {str(e)}")


def _preprocess_text_content(content: str) -> str:
    """预处理文本内容，优化向量化效果"""
    if not content or not content.strip():
        raise ValueError("文件内容为空")

    # 标准化换行符
    content = content.replace('\r\n', '\n').replace('\r', '\n')

    # 移除多余的空白行（保留段落结构）
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

    # 移除行首行尾空白，但保留段落间距
    lines = content.split('\n')
    processed_lines = []
    for line in lines:
        stripped_line = line.strip()
        processed_lines.append(stripped_line)

    content = '\n'.join(processed_lines)

    # 移除多余空格
    content = re.sub(r' +', ' ', content)

    # 移除常见的页眉页脚模式
    content = re.sub(r'第\s*\d+\s*页.*?\n', '', content)
    content = re.sub(r'共\s*\d+\s*页.*?\n', '', content)
    content = re.sub(r'页码.*?\n', '', content)

    # 标准化标点符号
    content = content.replace('，，', '，')
    content = content.replace('。。', '。')
    content = content.replace('？？', '？')
    content = content.replace('！！', '！')

    result = content.strip()
    if not result:
        raise ValueError("预处理后文件内容为空")

    return result


def _load_teacher_metadata(staff_id: str) -> List[Dict[str, Any]]:
    """加载教师的文档元数据"""
    metadata_file = METADATA_PATH / f"{staff_id}_documents.json"
    if metadata_file.exists():
        try:
            import json
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
        import json
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(documents, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"保存元数据失败: {str(e)}")
        raise


async def validate_uploaded_file(file: UploadFile) -> bytes:
    """
    验证上传的文件
    """
    # 检查文件扩展名
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件名不能为空")

    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件类型，仅支持: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 读取并检查文件大小
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"文件大小超过 {MAX_FILE_SIZE // 1024 // 1024}MB 限制"
        )

    # 检查文件是否为空
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="文件内容为空")

    return content


async def process_and_store_document(
    file: UploadFile,
    staff_id: str,
    title: str
) -> Dict[str, Any]:
    """
    处理并存储文档到向量数据库
    """
    logger.info(f"开始处理教师{staff_id}的文档: {title}")

    # 验证文件
    content_bytes = await validate_uploaded_file(file)
    file_extension = Path(file.filename).suffix.lower()

    # 创建临时文件进行处理
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp:
            temp_file_path = temp.name
            temp.write(content_bytes)

        # 提取文本内容
        content = _extract_text_from_file(temp_file_path, file_extension)

        # 检查提取的文本是否为空
        if not content.strip():
            raise HTTPException(status_code=400, detail="无法从文件中提取有效文本内容")

        # 生成内容哈希
        content_hash = _generate_content_hash(content)
        document_id = f"doc_{staff_id}_{content_hash[:12]}"
        collection_id = f"teacher_{staff_id}_docs"

        # 检查是否已存在相同内容的文档
        existing_docs = _load_teacher_metadata(staff_id)
        for doc in existing_docs:
            if doc["content_hash"] == content_hash:
                logger.info(f"发现已存在的文档: {doc['title']} (ID: {doc['document_id']})")
                return {
                    "document_id": doc["document_id"],
                    "title": doc["title"],
                    "is_new": False,
                    "message": "文档已存在，无需重复处理"
                }

        # 获取ChromaDB客户端
        client = _get_chromadb_client()

        # 获取或创建集合
        try:
            collection = client.get_collection(
                name=collection_id,
                embedding_function=embedding_function
            )
        except:
            collection = client.create_collection(
                name=collection_id,
                embedding_function=embedding_function
            )

        # 分割文本
        chunks = text_splitter.split_text(content)
        if not chunks:
            raise HTTPException(status_code=400, detail="文档内容过短，无法生成有效的文本块")

        # 添加到向量数据库
        chunk_ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
        collection.add(
            documents=chunks,
            ids=chunk_ids,
            metadatas=[{
                "document_id": document_id,
                "title": title,
                "chunk_index": i,
                "staff_id": staff_id
            } for i in range(len(chunks))]
        )

        # 保存文档元数据
        doc_metadata = {
            "document_id": document_id,
            "title": title,
            "filename": file.filename,
            "content_hash": content_hash,
            "created_at": datetime.now().isoformat(),
            "chunk_count": len(chunks),
            "file_size": len(content_bytes),
            "collection_id": collection_id
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
        # 清理临时文件
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


async def list_teacher_documents(staff_id: str) -> List[Dict[str, Any]]:
    """
    列出教师的所有文档
    """
    documents = _load_teacher_metadata(staff_id)
    # 按创建时间倒序排列
    return sorted(documents, key=lambda x: x["created_at"], reverse=True)


async def retrieve_document_context(
    staff_id: str,
    document_id: str,
    query: str,
    n_results: int = 5
) -> List[str]:
    """
    从指定文档中检索相关上下文

    Args:
        staff_id: 教师工号
        document_id: 文档ID
        query: 查询内容
        n_results: 返回结果数量

    Returns:
        相关上下文列表
    """
    collection_id = f"teacher_{staff_id}_docs"

    try:
        client = _get_chromadb_client()
        collection = client.get_collection(
            name=collection_id,
            embedding_function=embedding_function
        )

        # 检索指定文档的相关内容
        results = collection.query(
            query_texts=[query],
            n_results=n_results * 2,  # 获取更多结果用于过滤
            where={"document_id": document_id}
        )

        if results and "documents" in results and results["documents"]:
            contexts = results["documents"][0][:n_results]
            logger.info(f"从文档{document_id}检索到{len(contexts)}个相关上下文")
            return contexts

        logger.warning(f"未从文档{document_id}找到相关上下文")
        return []

    except Exception as e:
        logger.error(f"检索文档上下文失败: {str(e)}")
        return []


async def delete_document(staff_id: str, document_id: str) -> bool:
    """
    删除指定文档

    Args:
        staff_id: 教师工号
        document_id: 文档ID

    Returns:
        删除是否成功
    """
    try:
        collection_id = f"teacher_{staff_id}_docs"
        client = _get_chromadb_client()

        # 从向量数据库中删除文档块
        try:
            collection = client.get_collection(
                name=collection_id,
                embedding_function=embedding_function
            )

            # 查找并删除属于该文档的所有块
            results = collection.get(where={"document_id": document_id})
            if results and "ids" in results and results["ids"]:
                collection.delete(ids=results["ids"])
                logger.info(f"已从向量数据库删除文档{document_id}的{len(results['ids'])}个文本块")
        except Exception as e:
            logger.warning(f"从向量数据库删除文档块时出错: {str(e)}")

        # 从元数据中删除文档记录
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
    """
    获取文档详细信息

    Args:
        staff_id: 教师工号
        document_id: 文档ID

    Returns:
        文档信息或None
    """
    documents = _load_teacher_metadata(staff_id)
    for doc in documents:
        if doc["document_id"] == document_id:
            return doc
    return None


async def search_documents(
    staff_id: str,
    keyword: str = None,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """
    搜索教师的文档

    Args:
        staff_id: 教师工号
        keyword: 搜索关键词
        limit: 返回数量限制

    Returns:
        符合条件的文档列表
    """
    documents = _load_teacher_metadata(staff_id)

    if keyword:
        keyword_lower = keyword.lower()
        documents = [
            doc for doc in documents
            if keyword_lower in doc["title"].lower() or keyword_lower in doc["filename"].lower()
        ]

    # 按创建时间倒序排列并限制数量
    return sorted(documents, key=lambda x: x["created_at"], reverse=True)[:limit]