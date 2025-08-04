from typing import List, Tuple

from app.core.logger import setup_logger
from app.models.course import Course
from app.models.course_notification import CourseNotification, NotificationConfirmation
from app.schemas.teacher.course_notification_th_sch import (
    NotificationCreateRequest, NotificationUpdateRequest,
    NotificationDetailResponse, NotificationListResponse,
    StudentConfirmationInfo
)

logger = setup_logger("course_notification_service")


async def create_course_notification(
        teacher_id: int,
        course_id: int,
        request: NotificationCreateRequest
) -> int:
    """创建课程通知"""
    logger.info(f"教师ID {teacher_id} 正在为课程ID {course_id} 创建通知: {request.title}")

    # 验证课程权限
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        raise ValueError("课程不存在或无权限访问")

    # 创建通知
    notification = await CourseNotification.create(
        course_id=course_id,
        teacher_id=teacher_id,
        title=request.title,
        content=request.content,
        priority=request.priority,
        require_confirmation=request.require_confirmation,
    )

    logger.info(f"通知创建成功: ID={notification.id}")
    return notification.id


async def get_course_notifications(
        teacher_id: int,
        course_id: int,
        page: int = 1,
        page_size: int = 20
) -> Tuple[List[NotificationListResponse], int]:
    """获取课程通知列表"""
    logger.info(f"教师ID {teacher_id} 正在获取课程ID {course_id} 的通知列表")

    # 验证课程权限
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        raise ValueError("课程不存在或无权限访问")

    # 获取课程学生总数
    total_students = await course.students.all().count()

    # 分页查询通知
    offset = (page - 1) * page_size
    notifications = await CourseNotification.filter(
        course_id=course_id
    ).order_by('-publish_time').offset(offset).limit(page_size)

    # 获取总数
    total_count = await CourseNotification.filter(course_id=course_id).count()

    # 构建响应数据
    notification_list = []
    for notification in notifications:
        # 获取确认数量
        confirmed_count = await NotificationConfirmation.filter(
            notification_id=notification.id
        ).count()

        notification_list.append(NotificationListResponse(
            id=notification.id,
            title=notification.title,
            priority=notification.priority,
            require_confirmation=notification.require_confirmation,
            publish_time=notification.publish_time,
            confirmed_students=confirmed_count,
            total_students=total_students
        ))

    return notification_list, total_count


async def get_notification_detail(
        teacher_id: int,
        course_id: int,
        notification_id: int
) -> NotificationDetailResponse:
    """获取通知详情"""
    logger.info(f"教师ID {teacher_id} 正在查看通知ID {notification_id} 详情")

    # 验证权限
    notification = await CourseNotification.filter(
        id=notification_id,
        course_id=course_id,
        teacher_id=teacher_id
    ).first()

    if not notification:
        raise ValueError("通知不存在或无权限访问")

    # 获取课程和学生信息
    course = await Course.get(id=course_id).prefetch_related('students')
    total_students = await course.students.all().count()

    # 获取确认信息
    confirmations = await NotificationConfirmation.filter(
        notification_id=notification_id
    ).prefetch_related('student')

    confirmation_list = []
    for conf in confirmations:
        confirmation_list.append(StudentConfirmationInfo(
            student_id=conf.student.id,
            student_name=conf.student.username,
            student_number=conf.student.student_id,
            confirmed_at=conf.confirmed_at,
        ))

    confirmed_count = len(confirmation_list)
    confirmation_rate = (confirmed_count / total_students * 100) if total_students > 0 else 0.0

    return NotificationDetailResponse(
        id=notification.id,
        title=notification.title,
        content=notification.content,
        priority=notification.priority,
        require_confirmation=notification.require_confirmation,
        publish_time=notification.publish_time,
        total_students=total_students,
        confirmed_students=confirmed_count,
        confirmation_rate=round(confirmation_rate, 2),
        confirmations=confirmation_list
    )


async def update_notification(
        teacher_id: int,
        course_id: int,
        notification_id: int,
        request: NotificationUpdateRequest
) -> bool:
    """更新通知"""
    logger.info(f"教师ID {teacher_id} 正在更新通知ID {notification_id}")

    # 验证权限
    notification = await CourseNotification.filter(
        id=notification_id,
        course_id=course_id,
        teacher_id=teacher_id
    ).first()

    if not notification:
        raise ValueError("通知不存在或无权限访问")

    # 更新字段
    update_data = request.model_dump(exclude_unset=True)

    # 过滤字段：移除 None 值和无效数据
    filtered_data = {}
    for key, value in update_data.items():
        # 跳过 None 值
        if value is None:
            continue

        # 跳过时间相关字段（这些字段不应该被手动更新）
        if key in ['created_at', 'updated_at', 'publish_time']:
            continue

        # 字符串类型：过滤空字符串
        if isinstance(value, str):
            if value.strip() and value.strip().lower() != "string":
                filtered_data[key] = value.strip()
        else:
            # 非字符串类型直接添加
            filtered_data[key] = value

    if filtered_data:
        await CourseNotification.filter(id=notification_id).update(**filtered_data)
        logger.info(f"通知更新成功: ID={notification_id}，更新字段: {list(filtered_data.keys())}")
    else:
        logger.info(f"通知ID {notification_id} 无有效字段需要更新")

    return True


async def delete_notification(
        teacher_id: int,
        course_id: int,
        notification_id: int
) -> bool:
    """删除通知"""
    logger.info(f"教师ID {teacher_id} 正在删除通知ID {notification_id}")

    # 验证权限
    notification = await CourseNotification.filter(
        id=notification_id,
        course_id=course_id,
        teacher_id=teacher_id
    ).first()

    if not notification:
        raise ValueError("通知不存在或无权限访问")

    # 删除通知（级联删除确认记录）
    await notification.delete()
    logger.info(f"通知删除成功: ID={notification_id}")
    return True