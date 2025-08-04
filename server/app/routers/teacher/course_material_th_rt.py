from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse

from app.core.dependencies import auth_teacher_user
from app.models.course import Course
from app.models.teacher import Teacher
from app.schemas.teacher.course_material_th_sch import (
    MaterialUploadResponse, MaterialListResponse, MaterialDeleteResponse
)
from app.services.teacher.course_material_th_svc import (
    upload_course_material, get_course_materials, delete_course_material,
    get_course_material_dir
)

router = APIRouter(tags=["教师端-课程资料管理"])


@router.post("/{course_id}/upload", response_model=MaterialUploadResponse)
async def upload_material_api(
        course_id: int,
        file: UploadFile = File(...),
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    上传课程资料

    支持的文件类型：
    - 文档类型：.pdf, .doc, .docx, .txt, .md
    - 表格类型：.xls, .xlsx
    - 演示文稿：.ppt, .pptx
    - 压缩文件：.zip, .rar, .7z, .tar, .gz
    - 图片类型：.jpg, .jpeg, .png, .gif
    - 视频类型：.mp4, .avi, .mov

    文件大小限制：2GB
    """
    try:
        success, filename, file_size = await upload_course_material(
            current_user.id, course_id, file
        )

        return MaterialUploadResponse(
            success=success,
            filename=filename,
            file_size=file_size,
            message="文件上传成功"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件上传失败: {str(e)}")


@router.get("/{course_id}/materials", response_model=MaterialListResponse)
async def get_materials_api(
        course_id: int,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """获取课程资料列表"""
    try:
        # 获取课程信息
        course = await Course.filter(id=course_id, teacher_id=current_user.id).first()
        if not course:
            raise HTTPException(status_code=404, detail="课程不存在或无权限访问")

        materials = await get_course_materials(current_user.id, course_id)

        return MaterialListResponse(
            course_id=course_id,
            course_name=course.name,
            materials=materials,
            total_count=len(materials)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{course_id}/materials/{filename}", response_model=MaterialDeleteResponse)
async def delete_material_api(
        course_id: int,
        filename: str,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """删除课程资料"""
    try:
        success = await delete_course_material(current_user.id, course_id, filename)

        return MaterialDeleteResponse(
            success=success,
            message="文件删除成功"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{course_id}/download/{filename}")
async def download_material_api(
        course_id: int,
        filename: str,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """下载课程资料"""
    try:
        # 验证权限
        course = await Course.filter(id=course_id, teacher_id=current_user.id).first()
        if not course:
            raise HTTPException(status_code=404, detail="课程不存在或无权限访问")

        material_dir = get_course_material_dir(current_user.id, course_id)
        file_path = material_dir / filename

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="文件不存在")

        return FileResponse(
            file_path,
            filename=filename,
            media_type='application/octet-stream'
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))