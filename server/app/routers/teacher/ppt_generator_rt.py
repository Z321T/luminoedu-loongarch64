from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.responses import FileResponse

from app.core.dependencies import auth_teacher_user
from app.core.logger import setup_logger
from app.models.teacher import Teacher
from app.schemas.teacher.ppt_generator_sch import (
    PPTGenerationRequest, PPTGenerationResponse,
    PPTOutlineResponse, PPTGenerationFromOutlineRequest
)
from app.services.teacher.ppt_generator_svc import (
    generate_ppt_outline, generate_ppt_from_outline,
    download_ppt_service, list_ppt_files_service, list_ppt_outlines_service, delete_ppt_outline_service,
    delete_ppt_file_service, download_ppt_outline_service
)

router = APIRouter(tags=["教师端-PPT生成"])

logger = setup_logger("ppt_generator_api")


@router.post("/generate_outline", response_model=PPTOutlineResponse)
async def generate_ppt_outline_endpoint(
        request: PPTGenerationRequest,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    生成PPT的md格式大纲(第一步)
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求生成PPT大纲: {request.title}")
        response = await generate_ppt_outline(request, current_user.staff_id)
        return response
    except Exception as e:
        logger.error(f"PPT大纲生成失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PPT大纲生成失败: {str(e)}")


@router.get("/outlines")
async def list_ppt_outlines(current_user: Teacher = Depends(auth_teacher_user)):
    """
    列出当前教师的所有PPT大纲
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求查看所有PPT大纲")
        return await list_ppt_outlines_service(current_user.staff_id)
    except Exception as e:
        logger.error(f"获取PPT大纲列表失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"获取PPT大纲列表失败: {str(e)}")


@router.get("/download_outline/{file_name}")
async def download_ppt_outline(
        file_name: str,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    下载PPT大纲文件
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求下载PPT大纲文件: {file_name}")
        file_path = await download_ppt_outline_service(file_name, current_user.staff_id)

        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 下载PPT大纲文件: {file_name}")
        return FileResponse(
            path=str(file_path),
            filename=file_name,
            media_type="text/markdown"
        )
    except HTTPException:
        # 直接传递服务层抛出的HTTP异常
        raise
    except Exception as e:
        logger.error(f"下载PPT大纲文件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"下载PPT大纲文件失败: {str(e)}")


@router.delete("/outline/{file_name}")
async def delete_ppt_outline(
        file_name: str,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    删除PPT大纲文件
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求删除PPT大纲: {file_name}")
        await delete_ppt_outline_service(file_name, current_user.staff_id)
        return {"message": "大纲文件已成功删除"}
    except HTTPException:
        # 直接传递服务层抛出的HTTP异常
        raise
    except Exception as e:
        logger.error(f"删除PPT大纲失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"删除PPT大纲失败: {str(e)}")


@router.post("/generate_from_outline", response_model=PPTGenerationResponse)
async def generate_ppt_from_outline_endpoint(
        title: str,
        file: UploadFile = File(...),
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    从md格式大纲生成PPT (第二步)
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 从大纲生成PPT")
        # 读取上传的md文件内容
        outline_md = (await file.read()).decode("utf-8")
        # 构造请求对象
        request = PPTGenerationFromOutlineRequest(
            title=title,
            outline_md=outline_md
        )
        response = await generate_ppt_from_outline(request, current_user.staff_id)
        return response
    except Exception as e:
        logger.error(f"从大纲生成PPT失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"从大纲生成PPT失败: {str(e)}")


@router.get("/list_ppt")
async def list_ppt_files(current_user: Teacher = Depends(auth_teacher_user)):
    """
    列出当前用户可用的PPT文件
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求查看所有PPT文件")
        return await list_ppt_files_service(current_user.staff_id)
    except Exception as e:
        logger.error(f"获取PPT文件列表失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"获取PPT文件列表失败: {str(e)}")


@router.get("/download_ppt/{file_name}")
async def download_ppt(
        file_name: str,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    下载生成的PPT文件
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求下载PPT文件: {file_name}")
        file_path = await download_ppt_service(file_name, current_user.staff_id)

        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 下载PPT文件: {file_name}")
        return FileResponse(
            path=str(file_path),
            filename=file_name,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
    except HTTPException:
        # 直接传递服务层抛出的HTTP异常
        raise
    except Exception as e:
        logger.error(f"下载PPT文件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"下载PPT文件失败: {str(e)}")


@router.delete("/file/{file_name}")
async def delete_ppt_file(
        file_name: str,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    删除PPT文件
    """
    try:
        logger.info(f"教师 {current_user.username}(教工号:{current_user.staff_id}) 请求删除PPT文件: {file_name}")
        await delete_ppt_file_service(file_name, current_user.staff_id)
        return {"message": "PPT文件已成功删除"}
    except HTTPException:
        # 直接传递服务层抛出的HTTP异常
        raise
    except Exception as e:
        logger.error(f"删除PPT文件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"删除PPT文件失败: {str(e)}")