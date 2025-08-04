from datetime import datetime

from fastapi.responses import FileResponse
from tortoise.exceptions import DoesNotExist

from app.config import COURSE_MATERIALS_DIR
from app.core.logger import setup_logger
from app.models.course import Course, CourseStudent
from app.models.student import Student
from app.schemas.student.course_stu_sch import (
    CourseResponse, StudentCoursesResponse,
    CourseMaterialResponse, CourseMaterialsResponse
)

logger = setup_logger("student_course_service")


async def get_student_courses(student_id: str) -> StudentCoursesResponse:
    """
    获取学生所属课程列表
    """
    logger.info(f"学生 {student_id} 正在获取所属课程列表")
    try:
        # 验证学生是否存在
        student = await Student.get(student_id=student_id)
    except DoesNotExist:
        logger.warning(f"获取课程列表失败: 学生学号 {student_id} 不存在")
        raise ValueError("学生不存在")

    # 获取学生选修的所有课程
    courses = await Course.filter(
        students__student_id=student_id
    ).select_related('teacher').all()

    logger.info(f"学生 {student_id} 的课程列表获取成功: 共 {len(courses)} 门课程")

    course_responses = []
    for course in courses:
        # 获取该学生在此课程的成绩
        course_student = await CourseStudent.get_or_none(
            course=course,
            student__student_id=student_id
        )

        course_response = CourseResponse(
            id=course.id,
            name=course.name,
            description=course.description,
            semester=course.semester,
            credit=course.credit,
            start_date=course.start_date,
            end_date=course.end_date,
            teacher_name=course.teacher.username,
        )
        course_responses.append(course_response)

    return StudentCoursesResponse(
        total=len(course_responses),
        courses=course_responses
    )



async def get_course_detail(student_id: str, course_id: int) -> CourseResponse:
    """
    获取学生特定课程详情
    """
    logger.info(f"学生 {student_id} 正在获取课程详情: 课程ID={course_id}")
    try:
        # 验证学生是否选修了该课程
        course = await Course.get(
            id=course_id,
            students__student_id=student_id
        ).select_related('teacher')

        logger.info(f"课程详情获取成功: 学生={student_id}, 课程ID={course_id}, 课程名={course.name}")
        return CourseResponse(
            id=course.id,
            name=course.name,
            description=course.description,
            semester=course.semester,
            credit=course.credit,
            start_date=course.start_date,
            end_date=course.end_date,
            teacher_name=course.teacher.username,
        )
    except DoesNotExist:
        logger.warning(f"课程详情获取失败: 学生={student_id}, 课程ID={course_id}, 原因=课程不存在或未选修")
        raise ValueError("课程不存在或未选修该课程")
    except Exception as e:
        logger.error(f"获取课程详情失败: 学生={student_id}, 课程ID={course_id}, 错误={str(e)}")
        raise ValueError(f"获取课程详情失败: {str(e)}") from e



async def get_course_materials(student_id: str, course_id: int) -> CourseMaterialsResponse:
    """
    获取特定课程的所有资料列表
    """
    logger.info(f"学生 {student_id} 正在获取课程ID={course_id}的资料列表")

    try:
        # 验证学生是否选修了该课程
        course = await Course.filter(
            id=course_id,
            students__student_id=student_id
        ).select_related('teacher').first()

        if not course:
            logger.warning(f"获取资料列表失败: 学生={student_id}, 课程ID={course_id}, 原因=课程不存在或未选修")
            raise ValueError("课程不存在或未选修该课程")

        # 获取课程所有资料
        material_dir = COURSE_MATERIALS_DIR / f"teacher_{course.teacher.id}" / f"course_{course_id}"
        materials_list = []

        if material_dir.exists():
            for file_path in material_dir.iterdir():
                if file_path.is_file():
                    stat = file_path.stat()
                    material = CourseMaterialResponse(
                        file_name=file_path.name,
                        upload_time=datetime.fromtimestamp(stat.st_mtime),
                        uploader_name=course.teacher.username
                    )
                    materials_list.append(material)

        # 按上传时间倒序排序
        materials_list.sort(key=lambda x: x.upload_time, reverse=True)

        logger.info(f"课程资料获取成功: 学生={student_id}, 课程ID={course_id}, 资料数量={len(materials_list)}")

        return CourseMaterialsResponse(
            total=len(materials_list),
            materials=materials_list
        )

    except ValueError as e:
        raise e
    except Exception as e:
        logger.error(f"获取课程资料列表失败: 学生={student_id}, 课程ID={course_id}, 错误={str(e)}", exc_info=True)
        raise ValueError(f"获取课程资料列表失败: {str(e)}")



async def download_course_material(student_id: str, course_id: int, filename: str) -> FileResponse:
    """
    下载课程资料文件
    """
    logger.info(f"学生 {student_id} 正在下载课程 {course_id} 的资料: {filename}")

    try:
        # 验证学生是否选修了该课程
        course = await Course.filter(
            id=course_id,
            students__student_id=student_id
        ).select_related('teacher').first()

        if not course:
            logger.warning(f"资料下载失败: 学生={student_id}, 课程ID={course_id}, 原因=课程不存在或未选修")
            raise ValueError("课程不存在或未选修该课程")

        # 获取文件路径
        material_dir = COURSE_MATERIALS_DIR / f"teacher_{course.teacher.id}" / f"course_{course_id}"
        file_path = material_dir / filename

        # 检查文件是否存在
        if not file_path.exists():
            logger.error(f"资料下载失败: 文件不存在, 路径={file_path}")
            raise ValueError("文件不存在或已被删除")

        logger.info(f"资料下载成功: 学生={student_id}, 课程ID={course_id}, 文件名={filename}")

        # 返回文件下载响应
        return FileResponse(
            path=str(file_path),
            filename=filename,
            media_type='application/octet-stream'
        )

    except ValueError as e:
        raise e
    except Exception as e:
        logger.error(f"资料下载失败: 学生={student_id}, 课程ID={course_id}, 文件名={filename}, 错误={str(e)}",
                     exc_info=True)
        raise ValueError(f"下载资料失败: {str(e)}")