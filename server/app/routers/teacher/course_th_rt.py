from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse

from app.config import MEDIA_ROOT
from app.schemas.teacher.course_th_sch import (
    CourseCreateRequest, CourseCreateResponse, CourseDeleteResponse,
    CourseBaseResponse, CourseDetailResponse,
    CourseAddStudentsResponse, CourseRemoveStudentsResponse,CourseRemoveStudentsRequest)
from app.services.teacher.course_th_svc import (
    create_course, delete_course,
    list_courses, get_course_detail, add_students_to_course, remove_students_from_course
)

from app.core.dependencies import auth_teacher_user
from app.models.teacher import Teacher

from typing import List

router = APIRouter(tags=["教师端-课程管理"])

EXCEL_DIR = MEDIA_ROOT / "excel"


@router.post("/create", response_model=CourseCreateResponse)
async def create_course_api(
    data: CourseCreateRequest,
    current_user: Teacher = Depends(auth_teacher_user)
):
    """
    创建课程接口
    """
    try:
        course = await create_course(current_user.id, data)
        return CourseCreateResponse(id=course.id, name=course.name, description=course.description)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



@router.delete("/{course_id}", response_model=CourseDeleteResponse)
async def delete_course_api(
    course_id: int,
    current_user: Teacher = Depends(auth_teacher_user)
):
    """
    删除课程接口
    """
    try:
        success = await delete_course(current_user.id, course_id)
        return CourseDeleteResponse(
            success=success,
            message="课程删除成功" if success else "课程删除失败"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/list", response_model=List[CourseBaseResponse])
async def list_courses_api(current_user: Teacher = Depends(auth_teacher_user)):
    """
    教师查看自己创建的所有课程
    """
    try:
        return await list_courses(current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/{course_id}", response_model=CourseDetailResponse)
async def course_detail_api(course_id: int, current_user: Teacher = Depends(auth_teacher_user)):
    """
    获取课程详情,包括课程学生列表
    """
    try:
        return await get_course_detail(current_user.id, course_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/template/add_students")
async def download_student_template():
    """
    下载学生批量导入Excel模板
    """
    file_path = EXCEL_DIR / "add_student_to_course.xlsx"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="添加学生模板文件不存在")
    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="add_student_template.xlsx"
    )


@router.post("/{course_id}/add_students", response_model=CourseAddStudentsResponse)
async def add_students_to_course_api(
        course_id: int,
        file: UploadFile = File(...),
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    通过Excel文件导入学生到课程
    """
    try:
        if not file.filename.endswith(('.xls', '.xlsx')):
            raise HTTPException(status_code=400, detail="只支持Excel文件(.xls, .xlsx)")

        total, added, failed = await add_students_to_course(current_user.id, course_id, file)

        if not failed:
            message = f"成功导入{added}名学生"
        else:
            message = f"导入完成，但有{len(failed)}个学号不存在于系统中"

        return CourseAddStudentsResponse(
            success=True,
            total=total,
            added=added,
            failed=failed,
            message=message
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{course_id}/students", response_model=CourseRemoveStudentsResponse)
async def remove_students_from_course_api(
        course_id: int,
        data: CourseRemoveStudentsRequest,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    批量删除课程内学生

    ## 请求体示例:
    ```json
    {
      "student_ids": ["S2025001", "S2025002", "S2025003"]
    }
    ```

    ## 字段说明:
    - student_ids: 要删除的学生学号列表，使用学生的学号字符串，而非系统内部ID
    """
    try:
        removed_count = await remove_students_from_course(
            current_user.id,
            course_id,
            data.student_ids
        )

        return CourseRemoveStudentsResponse(
            success=True,
            removed=removed_count,
            message=f"成功从课程中删除 {removed_count} 名学生"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))