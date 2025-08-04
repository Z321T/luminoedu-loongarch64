import io
from typing import Optional, Dict, Any, List

import pandas as pd
from fastapi import UploadFile, HTTPException, status
from tortoise.exceptions import IntegrityError
from tortoise.expressions import Q

from app.core.logger import setup_logger
from app.models.student import Student
from app.models.teacher import Teacher
from app.schemas.admin.user_management_sch import (
    UserPasswordResetRequest
)
from app.schemas.admin.user_create_sch import BatchUserCreateResponse, UserCreateResult

# 设置日志
logger = setup_logger("user_management_service")

async def create_students(file: UploadFile) -> BatchUserCreateResponse:
    """
    从Excel文件创建学生用户
    """
    logger.info(f"开始批量创建学生用户，文件名: {file.filename}")

    if not file.filename.endswith(('.xls', '.xlsx')):
        logger.warning(f"上传的文件格式错误: {file.filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="上传文件必须是Excel格式(.xls或.xlsx)"
        )

    try:
        # 读取Excel文件
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        logger.info(f"成功读取Excel文件，共{len(df)}条记录")

        # 验证必要的列是否存在
        required_columns = ['姓名', '密码', '学号', '学院', '专业', '年级', '入学年份']
        for column in required_columns:
            if column not in df.columns:
                logger.error(f"Excel文件缺少必要列: {column}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Excel文件缺少必要的列: {column}"
                )

        # 处理结果
        success_count = 0
        failed_records = []

        # 处理每一行数据
        for _, row in df.iterrows():
            try:
                # 创建学生记录
                student = Student(
                    username=row['姓名'],
                    student_id=row['学号'],
                    college=row['学院'],
                    major=row['专业'],
                    grade=row['年级'],
                    enrollment_year=int(row['入学年份'])
                )

                # 设置密码
                student.set_password(str(row['密码']))

                # 保存到数据库
                await student.save()
                success_count += 1
                logger.info(f"成功创建学生用户 - 用户名: {row['姓名']}, 学号: {row['学号']}")

            except IntegrityError as e:
                error_msg = "用户名或学号已存在"
                logger.warning(f"创建学生用户失败 - 用户名: {row['姓名']}, 学号: {row['学号']}, 错误: {error_msg}")
                # 处理数据库完整性错误（如重复的用户名或学号）
                failed_records.append(UserCreateResult(
                    username=row['姓名'],
                    success=False,
                    error="用户名或学号已存在"
                ))
            except Exception as e:
                error_msg = str(e)
                logger.error(f"创建学生用户失败 - 用户名: {row['姓名']}, 学号: {row['学号']}, 错误: {error_msg}")
                # 处理其他错误
                failed_records.append(UserCreateResult(
                    username=row['姓名'],
                    success=False,
                    error=str(e)
                ))

        result = BatchUserCreateResponse(
            total=len(df),
            success_count=success_count,
            failed_count=len(failed_records),
            failed_records=failed_records
        )
        logger.info(f"学生批量创建完成 - 总数: {result.total}, 成功: {result.success_count}, 失败: {result.failed_count}")
        return result

    except Exception as e:
        error_msg = str(e)
        logger.error(f"处理Excel文件失败: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"处理Excel文件失败: {str(e)}"
        )


async def create_teachers(file: UploadFile) -> BatchUserCreateResponse:
    """
    从Excel文件创建教师用户
    """
    logger.info(f"开始批量创建教师用户，文件名: {file.filename}")

    if not file.filename.endswith(('.xls', '.xlsx')):
        logger.warning(f"上传的文件格式错误: {file.filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="上传文件必须是Excel格式(.xls或.xlsx)"
        )

    try:
        # 读取Excel文件
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        logger.info(f"成功读取Excel文件，共{len(df)}条记录")

        # 验证必要的列是否存在
        required_columns = ['姓名', '密码', '教工号', '所属院系']
        for column in required_columns:
            if column not in df.columns:
                logger.error(f"Excel文件缺少必要列: {column}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Excel文件缺少必要的列: {column}"
                )

        # 处理结果
        success_count = 0
        failed_records = []

        # 处理每一行数据
        for _, row in df.iterrows():
            try:
                # 创建教师记录
                teacher = Teacher(
                    username=row['姓名'],
                    staff_id=row['教工号'],
                    department=row['所属院系']
                )

                # 设置密码
                teacher.set_password(str(row['密码']))

                # 保存到数据库
                await teacher.save()
                success_count += 1
                logger.info(f"成功创建教师用户 - 用户名: {row['姓名']}, 教工号: {row['教工号']}")

            except IntegrityError as e:
                error_msg = "用户名或教工号已存在"
                logger.warning(f"创建教师用户失败 - 用户名: {row['姓名']}, 教工号: {row['教工号']}, 错误: {error_msg}")
                # 处理数据库完整性错误（如重复的用户名或教工号）
                failed_records.append(UserCreateResult(
                    username=row['姓名'],
                    success=False,
                    error="用户名或教工号已存在"
                ))
            except Exception as e:
                error_msg = str(e)
                logger.error(f"创建教师用户失败 - 用户名: {row['姓名']}, 教工号: {row['教工号']}, 错误: {error_msg}")
                # 处理其他错误
                failed_records.append(UserCreateResult(
                    username=row['姓名'],
                    success=False,
                    error=str(e)
                ))

        result = BatchUserCreateResponse(
            total=len(df),
            success_count=success_count,
            failed_count=len(failed_records),
            failed_records=failed_records
        )
        logger.info(f"教师批量创建完成 - 总数: {result.total}, 成功: {result.success_count}, 失败: {result.failed_count}")
        return result

    except Exception as e:
        error_msg = str(e)
        logger.error(f"处理Excel文件失败: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"处理Excel文件失败: {str(e)}"
        )


async def get_all_students(
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None
):
    """获取学生列表，支持分页和搜索"""
    logger.info(f"查询学生列表 - 页码:{page}, 每页数量:{page_size}, 搜索关键词:'{search}'")

    offset = (page - 1) * page_size

    # 准备查询条件
    filters = Q()
    if search:
        filters = (
                Q(username__contains=search) |
                Q(student_id__contains=search) |
                Q(college__contains=search) |
                Q(major__contains=search)
        )

    # 查询总数
    total_count = await Student.filter(filters).count()
    logger.info(f"学生列表查询结果 - 总记录数:{total_count}")

    # 获取分页数据
    students = await Student.filter(filters).limit(page_size).offset(offset)

    # 格式化结果
    users = []
    for student in students:
        users.append({
            "id": student.id,
            "username": student.username,
            "student_id": student.student_id,
            "college": student.college,
        })

    logger.info(f"学生列表查询成功 - 返回记录数:{len(users)}, 总记录数:{total_count}")
    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "students": users
    }


async def get_student_detail(student_id: str):
    """获取学生详细信息"""
    logger.info(f"查询学生详细信息 - 学号:{student_id}")

    student = await Student.filter(student_id=student_id).first()
    if not student:
        logger.warning(f"查询学生详细信息失败 - 学号:{student_id}, 原因:学生不存在")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="未找到该学生"
        )

    logger.info(f"查询学生详细信息成功 - 学号:{student_id}, 姓名:{student.username}")
    return {
        "id": student.id,
        "username": student.username,
        "student_id": student.student_id,
        "college": student.college,
        "major": student.major,
        "grade": student.grade,
        "created_at": student.created_at.isoformat() if student.created_at else None,
        "enrollment_year": student.enrollment_year,
        "intro": student.intro,
        "contact_email": student.contact_email
    }


async def update_student_info(student_id: str, student_data: Dict[str, Any]):
    """更新学生信息"""
    logger.info(f"更新学生信息请求 - 学号:{student_id}, 更新字段:{list(student_data.keys())}")

    student = await Student.filter(student_id=student_id).first()
    if not student:
        logger.warning(f"更新学生信息失败 - 学号:{student_id}, 原因:学生不存在")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="未找到该学生"
        )

    # 过滤掉示例值
    example_values = ["string", 0]
    filtered_data = {}
    for field, value in student_data.items():
         # 排除示例值和空值
        if value is None or value in example_values or (isinstance(value, str) and value.strip() == ""):
            logger.debug(f"字段 {field} 的值 '{value}' 被识别为示例值或空值，已忽略")
            continue
        filtered_data[field] = value

    if not filtered_data:
        logger.warning(f"更新学生信息失败 - 学号:{student_id}, 原因:无有效更新字段，所有字段都是示例值")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="没有提供有效的更新数据，请确保不使用示例值"
        )

    # 检查学号是否已存在（如果要更新学号）
    if "student_id" in filtered_data and filtered_data["student_id"] != student.student_id:
        existing = await Student.filter(student_id=filtered_data["student_id"]).first()
        if existing:
            logger.warning(
                f"更新学生信息失败 - 学号:{student_id}, 原因:新学号已被使用 - 新学号:{filtered_data['student_id']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="学号已被使用"
            )

    # 更新可修改的字段
    updated_fields = []
    for field, value in filtered_data.items():
        if value is not None and hasattr(student, field):
            old_value = getattr(student, field)
            setattr(student, field, value)
            updated_fields.append(f"{field}:'{old_value}'->'{{value}}'")

    await student.save()
    logger.info(f"学生信息更新成功 - 学号: {student_id}, 姓名: {student.username}")

    return {
        "status": "success",
        "message": "学生信息更新成功",
        "user_id": student_id
    }


async def reset_student_password(student_id: str, password_data: UserPasswordResetRequest):
    """重置学生密码"""
    logger.info(f"重置学生密码请求 - 学号:{student_id}")

    student = await Student.filter(student_id=student_id).first()
    if not student:
        logger.warning(f"重置学生密码失败 - 学号:{student_id}, 原因:学生不存在")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="未找到该学生"
        )

    student.set_password(password_data.new_password)
    await student.save()
    logger.info(f"学生密码重置成功 - 学号:{student_id}, 姓名:{student.username}")

    return {
        "status": "success",
        "message": "学生密码重置成功",
        "user_id": student_id
    }


async def get_all_teachers(
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None
):
    """获取教师列表，支持分页和搜索"""
    logger.info(f"查询教师列表 - 页码:{page}, 每页数量:{page_size}, 搜索关键词:'{search}'")

    offset = (page - 1) * page_size

    # 准备查询条件
    filters = Q()
    if search:
        filters = (
                Q(username__contains=search) |
                Q(staff_id__contains=search) |
                Q(department__contains=search) |
                Q(title__contains=search)
        )

    # 查询总数
    total_count = await Teacher.filter(filters).count()
    logger.info(f"教师列表查询结果 - 总记录数:{total_count}")

    # 获取分页数据
    teachers = await Teacher.filter(filters).limit(page_size).offset(offset)

    # 格式化结果
    users = []
    for teacher in teachers:
        users.append({
            "id": teacher.id,
            "username": teacher.username,
            "staff_id": teacher.staff_id,
            "department": teacher.department,
        })

    logger.info(f"教师列表查询成功 - 返回记录数:{len(users)}, 总记录数:{total_count}")
    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "teachers": users
    }


async def get_teacher_detail(teacher_id: str):
    """获取教师详细信息"""
    logger.info(f"查询教师详细信息 - 教工号:{teacher_id}")

    teacher = await Teacher.filter(staff_id=teacher_id).first()
    if not teacher:
        logger.warning(f"查询教师详细信息失败 - 教工号:{teacher_id}, 原因:教师不存在")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="未找到该教师"
        )

    logger.info(f"查询教师详细信息成功 - 教工号:{teacher_id}, 姓名:{teacher.username}")
    return {
        "id": teacher.id,
        "username": teacher.username,
        "staff_id": teacher.staff_id,
        "department": teacher.department,
        "created_at": teacher.created_at.isoformat() if teacher.created_at else None,
        "expertise": teacher.expertise,
        "intro": teacher.intro,
        "contact_email": teacher.contact_email,
        "office_location": teacher.office_location
    }


async def update_teacher_info(teacher_id: str, teacher_data: Dict[str, Any]):
    """更新教师信息"""
    logger.info(f"更新教师信息请求 - 教工号:{teacher_id}, 更新字段:{list(teacher_data.keys())}")

    teacher = await Teacher.filter(staff_id=teacher_id).first()
    if not teacher:
        logger.warning(f"更新教师信息失败 - 教工号:{teacher_id}, 原因:教师不存在")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="未找到该教师"
        )
    # 过滤掉示例值
    example_values = ["string", 0]
    filtered_data = {}
    for field, value in teacher_data.items():
        # 排除示例值和空值
        if value is None or value in example_values or (isinstance(value, str) and value.strip() == ""):
            logger.debug(f"字段 {field} 的值 '{value}' 被识别为示例值或空值，已忽略")
            continue
        filtered_data[field] = value

    if not filtered_data:
        logger.warning(f"更新教师信息失败 - 教工号:{teacher_id}, 原因:无有效更新字段，所有字段都是示例值")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="没有提供有效的更新数据，请确保不使用示例值"
        )

    # 检查教工号是否已存在（如果要更新教工号）
    if "staff_id" in filtered_data and filtered_data["staff_id"] != teacher.staff_id:
        existing = await Teacher.filter(staff_id=filtered_data["staff_id"]).first()
        if existing:
            logger.warning(
                f"更新教师信息失败 - 教工号:{teacher_id}, 原因:新教工号已被使用 - 新教工号:{filtered_data['staff_id']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="教工号已被使用"
            )

    # 更新可修改的字段
    updated_fields = []
    for field, value in filtered_data.items():
        if value is not None and hasattr(teacher, field):
            old_value = getattr(teacher, field)
            setattr(teacher, field, value)
            updated_fields.append(f"{field}:'{old_value}'->'{{value}}'")

    await teacher.save()
    logger.info(f"教师信息更新成功 - 教工号: {teacher_id}, 姓名: {teacher.username}")

    return {
        "status": "success",
        "message": "教师信息更新成功",
        "user_id": teacher_id
    }


async def reset_teacher_password(teacher_id: str, password_data: UserPasswordResetRequest):
    """重置教师密码"""
    logger.info(f"重置教师密码请求 - 教工号:{teacher_id}")

    teacher = await Teacher.filter(staff_id=teacher_id).first()
    if not teacher:
        logger.warning(f"重置教师密码失败 - 教工号:{teacher_id}, 原因:教师不存在")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="未找到该教师"
        )

    teacher.set_password(password_data.new_password)
    await teacher.save()
    logger.info(f"教师密码重置成功 - 教工号:{teacher_id}, 姓名:{teacher.username}")

    return {
        "status": "success",
        "message": "教师密码重置成功",
        "user_id": teacher_id
    }



async def batch_delete_students(student_ids: List[str]) -> int:
    """
    批量删除学生
    """
    logger.info(f"管理员正在批量删除学生: {student_ids}")

    # 查询这些学号对应的记录
    deleted_count = await Student.filter(student_id__in=student_ids).delete()

    logger.info(f"成功删除 {deleted_count} 名学生")
    return deleted_count



async def batch_delete_teachers(staff_ids: List[str]) -> int:
    """
    批量删除教师
    """
    logger.info(f"管理员正在批量删除教师: {staff_ids}")

    # 查询这些工号对应的记录
    deleted_count = await Teacher.filter(staff_id__in=staff_ids).delete()

    logger.info(f"成功删除 {deleted_count} 名教师")
    return deleted_count