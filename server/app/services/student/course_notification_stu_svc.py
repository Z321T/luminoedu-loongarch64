from typing import List, Tuple, Optional

from app.core.logger import setup_logger
from app.models.course import CourseStudent
from app.models.course_notification import CourseNotification, NotificationConfirmation
from app.schemas.student.course_notification_stu_sch import StudentNotificationResponse, StudentNotificationDetailResponse

logger = setup_logger("student_notification_service")


async def get_student_notifications(
        student_id: int,
        course_id: Optional[int] = None,
        page: int = 1,
        page_size: int = 20
) -> Tuple[List[StudentNotificationResponse], int]:
    """获取学生的课程通知列表"""
    logger.info(f"学生ID {student_id} 正在获取通知列表")

    # 构建查询条件
    if course_id:
        # 验证学生是否在该课程中
        course_student = await CourseStudent.filter(
            course_id=course_id,
            student_id=student_id
        ).first()
        if not course_student:
            raise ValueError("课程不存在或未加入该课程")

        query = CourseNotification.filter(course_id=course_id)
    else:
        # 获取学生所有课程ID
        student_course_ids = await CourseStudent.filter(
            student_id=student_id
        ).values_list('course_id', flat=True)

        if not student_course_ids:
            # 学生没有加入任何课程
            return [], 0

        # 查询所有相关课程的通知
        query = CourseNotification.filter(course_id__in=student_course_ids)

    # 分页查询
    offset = (page - 1) * page_size
    notifications = await query.prefetch_related(
        'course', 'teacher'
    ).order_by('-publish_time').offset(offset).limit(page_size)

    total_count = await query.count()

    # 获取学生的确认记录
    notification_ids = [n.id for n in notifications]
    confirmations = await NotificationConfirmation.filter(
        notification_id__in=notification_ids,
        student_id=student_id
    ).all()

    confirmation_dict = {c.notification_id: c for c in confirmations}

    # 构建响应数据
    notification_list = []
    for notification in notifications:
        confirmation = confirmation_dict.get(notification.id)

        notification_list.append(StudentNotificationResponse(
            id=notification.id,
            title=notification.title,
            content=notification.content,
            priority=notification.priority,
            require_confirmation=notification.require_confirmation,
            publish_time=notification.publish_time,
            course_name=notification.course.name,
            teacher_name=notification.teacher.username,
            is_confirmed=confirmation is not None,
            confirmed_at=confirmation.confirmed_at if confirmation else None
        ))

    return notification_list, total_count



async def get_student_notification_detail(
        student_id: int,
        notification_id: int
) -> StudentNotificationDetailResponse:
    """获取学生的通知详情"""
    logger.info(f"学生ID {student_id} 正在获取通知详情，通知ID {notification_id}")

    # 验证通知是否存在
    notification = await CourseNotification.get_or_none(id=notification_id).prefetch_related(
        'course', 'teacher'
    )

    if not notification:
        raise ValueError("通知不存在")

    # 验证学生是否有权限访问该通知（即是否在该课程中）
    course_student = await CourseStudent.filter(
        course_id=notification.course_id,
        student_id=student_id
    ).first()

    if not course_student:
        raise ValueError("无权限访问该通知")

    # 获取学生的确认记录
    confirmation = await NotificationConfirmation.filter(
        notification_id=notification_id,
        student_id=student_id
    ).first()

    # 构建响应数据
    return StudentNotificationDetailResponse(
        id=notification.id,
        title=notification.title,
        content=notification.content,
        priority=notification.priority,
        require_confirmation=notification.require_confirmation,
        publish_time=notification.publish_time,
        course_name=notification.course.name,
        teacher_name=notification.teacher.username,
        is_confirmed=confirmation is not None,
    )



async def confirm_notification(
        student_id: int,
        notification_id: int,
) -> bool:
    """确认通知"""
    logger.info(f"学生ID {student_id} 正在确认通知ID {notification_id}")

    # 验证通知是否存在
    notification = await CourseNotification.get_or_none(id=notification_id)

    if not notification:
        raise ValueError("通知不存在")

    # 验证学生是否有权限访问该通知（即是否在该课程中）
    course_student = await CourseStudent.filter(
        course_id=notification.course_id,
        student_id=student_id
    ).first()

    if not course_student:
        raise ValueError("无权限访问该通知")

    if not notification.require_confirmation:
        raise ValueError("该通知不需要确认")

    # 检查是否已确认
    existing_confirmation = await NotificationConfirmation.filter(
        notification_id=notification_id,
        student_id=student_id
    ).first()

    if existing_confirmation:
        raise ValueError("您已确认过该通知")

    # 创建确认记录
    await NotificationConfirmation.create(
        notification_id=notification_id,
        student_id=student_id,
    )

    logger.info(f"通知确认成功: 学生ID={student_id}, 通知ID={notification_id}")
    return True