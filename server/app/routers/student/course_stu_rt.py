from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.core.dependencies import auth_student_user
from app.models.student import Student
from app.schemas.student.course_stu_sch import (
    StudentCoursesResponse, CourseResponse,
    CourseMaterialResponse, CourseMaterialsResponse
)
from app.services.student.course_stu_svc import (
    get_student_courses, get_course_detail,
    get_course_materials, download_course_material
)

router = APIRouter(tags=["学生端-课程"])


@router.get("/", response_model=StudentCoursesResponse)
async def get_courses(
    current_user: Student = Depends(auth_student_user)
):
    """
    获取学生所属课程列表
    """
    try:
        return await get_student_courses(current_user.student_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="服务器内部错误")


@router.get("/{course_id}", response_model=CourseResponse)
async def course_detail(
    course_id: int,
    current_user: Student = Depends(auth_student_user),
):
    """
    获取学生特定课程详情
    """
    try:
        return await get_course_detail(current_user.student_id, course_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="服务器内部错误")


@router.get("/courses/{course_id}/materials", response_model=CourseMaterialsResponse)
async def list_course_materials(
    course_id: int,
    current_user: Student = Depends(auth_student_user)
):
    """
    获取课程的所有资料列表
    """
    try:
        return await get_course_materials(current_user.student_id, course_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"服务器内部错误: {str(e)}")


@router.get("/courses/{course_id}/download/{filename}")
async def download_material(
    course_id: int,
    filename: str,
    current_user: Student = Depends(auth_student_user)
):
    """
    下载课程资料文件
    """
    try:
        return await download_course_material(current_user.student_id, course_id, filename)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"服务器内部错误: {str(e)}")