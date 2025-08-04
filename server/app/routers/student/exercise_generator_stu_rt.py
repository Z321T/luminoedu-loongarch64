from fastapi import APIRouter, HTTPException, Request, Depends, Query
from fastapi.responses import FileResponse
from typing import Optional

from app.schemas.student.exercise_generator_stu_sch import StudentExerciseGenerateRequest
from app.services.student.exercise_generator_stu_svc import (
    generate_student_exercises,
    get_student_exercise_file_content_service,
    download_student_exercise_file_service,
    list_student_generated_exercises_service,
    delete_student_exercise_file_service
)
from app.core.logger import setup_logger
from app.core.dependencies import auth_student_user
from app.models.student import Student

logger = setup_logger("student_exercise_generator_api")

router = APIRouter(tags=["学生端-习题生成"])


@router.post("/generate")
async def generate_student_exercises_endpoint(
    request: StudentExerciseGenerateRequest,
    current_user: Student = Depends(auth_student_user)
):
    """
    学生生成习题

    支持两种生成模式：
    1. **基于文档生成**：使用document_id参数，基于已向量化的文档内容生成习题
    2. **基于自定义内容生成**：使用content参数，基于用户提供的内容生成习题

    习题类型枚举(types):
    - 1 = 选择题
    - 2 = 填空题
    - 3 = 简答题
    """
    logger.info(f"学生 {current_user.username}(学号:{current_user.student_id}) 请求生成习题: {request.title}")

    # 验证参数
    if not request.document_id and not request.content:
        raise HTTPException(
            status_code=400,
            detail="请提供文档ID或自定义内容中的至少一项"
        )

    try:
        result = await generate_student_exercises(
            content=request.content,
            student_id=current_user.student_id,
            title=request.title,
            count=request.count,
            types=request.types,
            document_id=request.document_id,
            use_knowledge_matching=request.use_knowledge_matching
        )

        logger.info(
            f"学生习题生成成功: 标题='{request.title}', "
            f"生成数量={result['exercises_count']}, "
            f"学号={current_user.student_id}"
        )

        return {
            "md_filename": result["md_filename"],
            "json_filename": result["json_filename"],
            "exercise_count": result["exercises_count"],
            "document_id": result.get("document_id"),
            "used_knowledge_matching": result.get("used_knowledge_matching", False),
            "message": "习题生成成功" + (
                "，已整合文档知识点" if result.get("used_knowledge_matching") else ""
            )
        }
    except Exception as e:
        logger.error(f"学生习题生成失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"习题生成失败: {str(e)}")


@router.get("/file_md_content/{file_name}")
async def get_student_exercise_file_content(
    file_name: str,
    current_user: Student = Depends(auth_student_user)
):
    """
    获取学生习题文件的Markdown内容
    """
    try:
        logger.info(f"学生 {current_user.username}(学号:{current_user.student_id}) 请求查看习题文件内容: {file_name}")
        content = await get_student_exercise_file_content_service(file_name, current_user.student_id)
        return {"content": content}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"读取学生习题文件失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"读取文件失败: {str(e)}")


@router.get("/download/{file_name}")
async def download_student_exercise_file(
    file_name: str,
    req: Request,
    current_user: Student = Depends(auth_student_user)
):
    """下载学生生成的习题文件"""
    try:
        client_ip = req.client.host
        logger.info(f"学生{current_user.student_id}文件下载请求: 文件='{file_name}', 请求IP={client_ip}")

        file_path = await download_student_exercise_file_service(file_name, current_user.student_id)

        logger.info(f"学生 {current_user.username}(学号:{current_user.student_id}) 下载习题文件: {file_name}")
        return FileResponse(
            path=str(file_path),
            filename=file_name,
            media_type="application/octet-stream"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"下载学生习题文件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"下载习题文件失败: {str(e)}")


@router.get("/list")
async def list_student_generated_exercises(
    limit: int = Query(default=50, description="返回的最大文件数量"),
    title_filter: Optional[str] = Query(default=None, description="可选的标题过滤条件"),
    current_user: Student = Depends(auth_student_user)
):
    """
    列出学生最近生成的习题文件
    """
    try:
        logger.info(f"学生(学号:{current_user.student_id})查询习题文件列表")
        result = await list_student_generated_exercises_service(current_user.student_id, limit, title_filter)
        logger.info(f"学生(学号:{current_user.student_id})已查询到习题文件 {len(result['exercises'])} 个")
        return result
    except Exception as e:
        logger.error(f"查询学生习题文件列表失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"查询习题文件列表失败: {str(e)}")


@router.delete("/delete/{file_name}")
async def delete_student_exercise_file(
    file_name: str,
    current_user: Student = Depends(auth_student_user)
):
    """删除学生习题文件"""
    try:
        logger.info(f"学生(学号:{current_user.student_id})请求删除文件: {file_name}")
        await delete_student_exercise_file_service(file_name, current_user.student_id)
        logger.info(f"学生(学号:{current_user.student_id})删除文件成功: {file_name}")
        return {"message": "文件已成功删除"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除学生文件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"删除文件失败: {str(e)}")