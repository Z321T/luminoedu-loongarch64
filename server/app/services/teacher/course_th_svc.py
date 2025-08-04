import pandas as pd
import io

from fastapi import UploadFile
from tortoise.exceptions import IntegrityError
from typing import List, Tuple

from app.core.logger import setup_logger
from app.models.student import Student
from app.models.course import Course, CourseStudent
from app.schemas.teacher.course_th_sch import CourseCreateRequest, CourseBaseResponse, CourseDetailResponse, StudentBaseInfo

# 创建课程服务的日志记录器
logger = setup_logger("course_management_service")


async def create_course(teacher_id: int, data: CourseCreateRequest) -> Course:
    """
    创建课程
    """
    logger.info(f"教师 {teacher_id} 正在创建课程: {data.name}")
    try:
        course = await Course.create(
            name=data.name,
            description=data.description,
            semester=data.semester,
            credit=data.credit,
            start_date=data.start_date,
            end_date=data.end_date,
            teacher_id=teacher_id
        )
        logger.info(f"课程创建成功: id={course.id}, name={course.name}, 教师={teacher_id}")
        return course
    except IntegrityError:
        logger.warning(f"课程创建失败，课程代码已存在: {data.course_code}")
        raise ValueError("课程代码已存在")
    except Exception as e:
        logger.error(f"课程创建失败: {str(e)}", exc_info=True)
        raise ValueError(f"课程创建失败: {str(e)}")


async def delete_course(teacher_id: int, course_id: int) -> bool:
    """
    删除课程
    """
    logger.info(f"教师 {teacher_id} 正在删除课程: 课程ID={course_id}")

    # 检查课程是否存在且属于该教师
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"课程删除失败: 课程ID={course_id} 不存在或不属于教师ID={teacher_id}")
        raise ValueError("课程不存在或无权限删除")

    # 删除课程前，先删除所有相关的学生关联
    await CourseStudent.filter(course_id=course_id).delete()

    # 删除课程
    deleted_count = await Course.filter(id=course_id, teacher_id=teacher_id).delete()
    if deleted_count:
        logger.info(f"课程删除成功: 课程ID={course_id}")
        return True
    else:
        logger.warning(f"课程删除失败: 课程ID={course_id}")
        return False



async def list_courses(teacher_id: int) -> List[CourseBaseResponse]:
    logger.info(f"教师 {teacher_id} 正在获取课程列表")
    courses = await Course.filter(teacher_id=teacher_id).all()
    return [CourseBaseResponse.model_validate(course, from_attributes=True) for course in courses]



async def get_course_detail(teacher_id: int, course_id: int) -> CourseDetailResponse:
    logger.info(f"教师 {teacher_id} 正在获取课程详情: 课程ID={course_id}")
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"教师{teacher_id}课程详情获取失败: 课程ID={course_id} 不存在或无权限访问")
        raise ValueError("课程不存在或无权限访问")

    # 获取课程学生列表
    course_students = await CourseStudent.filter(course_id=course_id).values("student_id")
    student_ids = [cs["student_id"] for cs in course_students]
    students_data = []
    if student_ids:
        students = await Student.filter(id__in=student_ids).all()
        students_data = [
            StudentBaseInfo(
                name=student.username,
                student_id=student.student_id,
                college=student.college,
                grade=student.grade,
            ) for student in students
        ]
    logger.info(f"课程 {course_id} 学生列表获取成功: 学生数量={len(students_data)}")
    # 构建课程详情响应
    course_dict = {
        "id": course.id,
        "name": course.name,
        "description": course.description,
        "semester": course.semester,
        "credit": course.credit,
        "start_date": course.start_date,
        "end_date": course.end_date,
    }

    detail = CourseDetailResponse.model_validate(course_dict)
    detail.students = students_data
    return detail



async def add_students_to_course(teacher_id: int, course_id: int, file: UploadFile) -> Tuple[int, int, List[str]]:
    """从Excel文件导入学生到课程"""
    logger.info(f"教师 {teacher_id} 正在为课程 {course_id} 导入学生")

    # 检查课程是否存在并属于该教师
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"课程不存在或不属于该教师: 教师ID={teacher_id}, 课程ID={course_id}")
        raise ValueError("课程不存在或无权限访问")

    try:
        # 读取Excel文件
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        # 检查必要列
        required_columns = ["姓名", "学号"]
        if not all(col in df.columns for col in required_columns):
            missing = [col for col in required_columns if col not in df.columns]
            logger.error(f"Excel格式错误，缺少必要列: {missing}")
            raise ValueError(f"Excel格式错误，缺少列: {', '.join(missing)}")

        # 获取所有学号
        student_ids = df["学号"].astype(str).tolist()

        # 查询数据库中已存在的学生
        existing_students = await Student.filter(student_id__in=student_ids).all()
        existing_student_map = {s.student_id: s for s in existing_students}

        # 找出不存在的学生
        non_existing_ids = [sid for sid in student_ids if sid not in existing_student_map]

        # 获取已添加到课程的学生
        course_students = await CourseStudent.filter(course_id=course_id).prefetch_related("student")
        enrolled_student_ids = [cs.student.student_id for cs in course_students]

        # 需要添加的学生
        to_add = []
        for sid in student_ids:
            if sid in existing_student_map and sid not in enrolled_student_ids:
                to_add.append(existing_student_map[sid])

        # 批量添加学生到课程
        for student in to_add:
            await CourseStudent.create(course_id=course_id, student_id=student.id)

        return len(student_ids), len(to_add), non_existing_ids
    except Exception as e:
        logger.error(f"导入学生失败: {str(e)}", exc_info=True)
        raise ValueError(f"导入学生失败: {str(e)}")


async def remove_students_from_course(teacher_id: int, course_id: int, student_numbers: List[str]) -> int:
    """
    从课程中批量删除学生
    """
    logger.info(f"教师 {teacher_id} 正在从课程 {course_id} 批量删除学生: {student_numbers}")

    # 检查课程是否存在且属于该教师
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"课程不存在或不属于该教师: 教师ID={teacher_id}, 课程ID={course_id}")
        raise ValueError("课程不存在或无权限访问")

    # 查询这些学号对应的内部ID
    students = await Student.filter(student_id__in=student_numbers).values("id", "student_id")
    student_id_map = {s["student_id"]: s["id"] for s in students}

    internal_ids = [student_id_map.get(sid) for sid in student_numbers if sid in student_id_map]

    if not internal_ids:
        logger.warning(f"未找到任何有效的学生学号: {student_numbers}")
        return 0

    # 删除课程学生关联
    deleted_count = await CourseStudent.filter(
        course_id=course_id,
        student_id__in=internal_ids
    ).delete()

    logger.info(f"从课程 {course_id} 成功删除 {deleted_count} 名学生")
    return deleted_count