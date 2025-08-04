from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File, Form

from app.core.dependencies import auth_teacher_user
from app.core.logger import setup_logger
from app.models.teacher import Teacher
from app.services.doc_vector.document_vectorization_svc import (
    process_and_store_document,
    list_teacher_documents,
    retrieve_document_context,
    delete_document,
    get_document_info,
    search_documents
)

logger = setup_logger("th_document_vectorization_api")

router = APIRouter(tags=["教师端-文档向量化"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    current_user: Teacher = Depends(auth_teacher_user)
):
    """
    上传文档进行向量化处理

    支持格式及特点：
    TXT格式：
    - 纯文本，向量化效果最佳
    - 支持多种编码：UTF-8, GBK, GB2312, UTF-16等
    - 无格式干扰，语义提取最准确

    DOCX格式：
    - Microsoft Word文档
    - 自动提取纯文本内容
    - 忽略图片、表格等复杂格式
    - 保留段落结构

    使用建议：
    - 教学讲义、课程资料推荐使用TXT格式
    - 现有Word文档可直接上传DOCX格式
    - 系统会自动去除格式干扰，专注文本内容

    文件限制：
    - 支持格式：.txt, .docx
    - 文件大小：500MB以内
    - 内容要求：必须包含有效文本
    """
    logger.info(f"教师{current_user.staff_id}上传文档: {title}")

    try:
        result = await process_and_store_document(
            file,
            current_user.staff_id,
            title
        )
        logger.info(f"文档处理完成: {result}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"文档上传处理失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"文档处理失败: {str(e)}")


@router.get("/list")
async def list_documents(
    current_user: Teacher = Depends(auth_teacher_user)
):
    """列出教师的所有已处理文档"""
    try:
        documents = await list_teacher_documents(current_user.staff_id)
        return {
            "documents": documents,
            "count": len(documents)
        }
    except Exception as e:
        logger.error(f"获取文档列表失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"获取文档列表失败: {str(e)}")


@router.get("/search")
async def search_teacher_documents(
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    limit: int = Query(20, description="返回数量限制"),
    current_user: Teacher = Depends(auth_teacher_user)
):
    """搜索教师的文档"""
    try:
        documents = await search_documents(current_user.staff_id, keyword, limit)
        return {
            "documents": documents,
            "count": len(documents),
            "keyword": keyword
        }
    except Exception as e:
        logger.error(f"搜索文档失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"搜索文档失败: {str(e)}")


@router.get("/info/{document_id}")
async def get_document_detail(
    document_id: str,
    current_user: Teacher = Depends(auth_teacher_user)
):
    """获取文档详细信息"""
    try:
        doc_info = await get_document_info(current_user.staff_id, document_id)
        if not doc_info:
            raise HTTPException(status_code=404, detail="文档不存在")
        return doc_info
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取文档信息失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"获取文档信息失败: {str(e)}")


@router.post("/retrieve_context/{document_id}")
async def retrieve_context(
    document_id: str,
    query: str = Query(..., description="检索查询"),
    n_results: int = Query(5, description="返回结果数量"),
    current_user: Teacher = Depends(auth_teacher_user)
):
    """从指定文档检索相关内容"""
    try:
        contexts = await retrieve_document_context(
            current_user.staff_id,
            document_id,
            query,
            n_results
        )
        return {"contexts": contexts, "count": len(contexts)}
    except Exception as e:
        logger.error(f"检索上下文失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"检索上下文失败: {str(e)}")


@router.delete("/delete/{document_id}")
async def delete_teacher_document(
    document_id: str,
    current_user: Teacher = Depends(auth_teacher_user)
):
    """删除指定文档"""
    try:
        success = await delete_document(current_user.staff_id, document_id)
        if success:
            return {"message": "文档删除成功"}
        else:
            raise HTTPException(status_code=404, detail="文档不存在或删除失败")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除文档失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"删除文档失败: {str(e)}")