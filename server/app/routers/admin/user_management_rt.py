from typing import Optional

from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import FileResponse

from app.config import MEDIA_ROOT
from app.schemas.admin.user_management_sch import (
    StudentListResponse, StudentDetailResponse, StudentUpdateFields,
    TeacherListResponse, TeacherDetailResponse, TeacherUpdateFields,
    UserUpdateResponse, UserPasswordResetRequest,
    BatchDeleteResponse, StudentBatchDeleteRequest, TeacherBatchDeleteRequest
)
from app.schemas.admin.user_create_sch import BatchUserCreateResponse
from app.services.admin.user_svc import (
    create_students as create_students_service,
    create_teachers as create_teachers_service,
    get_all_students, get_student_detail, reset_student_password, update_student_info,
    get_all_teachers, get_teacher_detail, reset_teacher_password, update_teacher_info,
    batch_delete_students, batch_delete_teachers
)

router = APIRouter(tags=["管理员端-用户管理"])

EXCEL_DIR = MEDIA_ROOT / "excel"


@router.get("/download_student_template")
async def download_student_template():
    """
    下载学生批量导入Excel模板
    """
    file_path = EXCEL_DIR / "student_create.xlsx"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="学生模板文件不存在")
    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="student_template.xlsx"
    )



@router.post("/create_students", response_model=BatchUserCreateResponse)
async def create_students(
    file: UploadFile = File(..., description="上传包含学生信息的Excel文件"),
):
    """
    通过Excel表格批量创建学生用户
    """
    return await create_students_service(file)



@router.get("/list_students", response_model=StudentListResponse)
async def list_students(
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页记录数"),
    search: Optional[str] = Query(None, description="搜索关键词")
):
    """
    获取学生列表，支持分页和搜索
    """
    return await get_all_students(page, page_size, search)



@router.get("/student_detail/{student_id}", response_model=StudentDetailResponse)
async def get_student(student_id: str):
    """
    获取单个学生的详细信息
    """
    return await get_student_detail(student_id)



@router.put("/update_student/{student_id}", response_model=UserUpdateResponse)
async def update_student(student_id: str, student_data: StudentUpdateFields):
    """
    更新学生信息
    """
    return await update_student_info(student_id, student_data.model_dump(exclude_unset=True))



@router.post("/reset_password/{student_id}", response_model=UserUpdateResponse)
async def reset_password(student_id: str, password_data: UserPasswordResetRequest):
    """
    重置学生密码
    """
    return await reset_student_password(student_id, password_data)



@router.delete("/batch_delete_students", response_model=BatchDeleteResponse)
async def batch_delete_students_api(
        data: StudentBatchDeleteRequest
):
    """
    批量删除学生

    ## 请求体示例:
    ```json
    {
      "student_ids": ["S2025001", "S2025002", "S2025003"]
    }
    ```

    ## 字段说明:
    - student_ids: 要删除的学生学号列表，使用学生的学号字符串
    """
    try:
        deleted_count = await batch_delete_students(data.student_ids)

        return BatchDeleteResponse(
            success=True,
            deleted=deleted_count,
            message=f"成功删除 {deleted_count} 名学生"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/download_teacher_template")
async def download_teacher_template():
    """
    下载教师批量导入Excel模板
    """
    file_path = EXCEL_DIR / "teacher_create.xlsx"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="教师模板文件不存在")
    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="teacher_template.xlsx"
    )



@router.post("/create_teachers", response_model=BatchUserCreateResponse)
async def create_teachers(
    file: UploadFile = File(..., description="上传包含教师信息的Excel文件"),
):
    """
    通过Excel表格批量创建教师用户
    """
    return await create_teachers_service(file)



@router.get("/list_teachers", response_model=TeacherListResponse)
async def list_teachers(
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页记录数"),
    search: Optional[str] = Query(None, description="搜索关键词")
):
    """
    获取教师列表，支持分页和搜索
    """
    return await get_all_teachers(page, page_size, search)



@router.get("/teacher_detail/{staff_id}", response_model=TeacherDetailResponse)
async def get_teacher(staff_id: str):
    """
    获取单个教师的详细信息
    """
    return await get_teacher_detail(staff_id)



@router.put("/update_teacher/{staff_id}", response_model=UserUpdateResponse)
async def update_teacher(staff_id: str, teacher_data: TeacherUpdateFields):
    """
    更新教师信息
    """
    return await update_teacher_info(staff_id, teacher_data.model_dump(exclude_unset=True))



@router.post("/reset_teacher_password/{staff_id}", response_model=UserUpdateResponse)
async def reset_teacher_password_endpoint(staff_id: str, password_data: UserPasswordResetRequest):
    """
    重置教师密码
    """
    return await reset_teacher_password(staff_id, password_data)



@router.delete("/batch_delete_teachers", response_model=BatchDeleteResponse)
async def batch_delete_teachers_api(
        data: TeacherBatchDeleteRequest
):
    """
    批量删除教师

    ## 请求体示例:
    ```json
    {
      "staff_ids": ["T2025001", "T2025002", "T2025003"]
    }
    ```

    ## 字段说明:
    - staff_ids: 要删除的教师工号列表，使用教师的工号字符串
    """
    try:
        deleted_count = await batch_delete_teachers(data.staff_ids)

        return BatchDeleteResponse(
            success=True,
            deleted=deleted_count,
            message=f"成功删除 {deleted_count} 名教师"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

