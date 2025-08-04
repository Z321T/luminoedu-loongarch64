from enum import IntEnum
from tortoise import fields, models


class NotificationPriority(IntEnum):
    """通知优先级"""
    NORMAL = 1  # 普通
    HIGH = 2  # 重要
    URGENT = 3  # 紧急


class CourseNotification(models.Model):
    """课程通知模型"""
    id = fields.IntField(pk=True)

    # 关联信息
    course = fields.ForeignKeyField(
        "models.Course",
        related_name="notifications",
        on_delete=fields.CASCADE,
        description="所属课程"
    )
    teacher = fields.ForeignKeyField(
        "models.Teacher",
        related_name="sent_notifications",
        on_delete=fields.CASCADE,
        description="发布教师"
    )

    # 通知内容
    title = fields.CharField(max_length=200, description="通知标题")
    content = fields.TextField(description="通知内容")
    priority = fields.IntEnumField(
        NotificationPriority,
        default=NotificationPriority.NORMAL,
        description="通知优先级"
    )

    # 是否需要确认
    require_confirmation = fields.BooleanField(
        default=False,
        description="是否需要学生确认"
    )

    # 时间信息
    publish_time = fields.DatetimeField(auto_now_add=True, description="发布时间")

    # 状态管理
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")

    class Meta:
        table = "course_notification"
        table_description = "课程通知表"
        ordering = ["-publish_time"]


class NotificationConfirmation(models.Model):
    """通知确认记录模型"""
    id = fields.IntField(pk=True)

    # 关联信息
    notification = fields.ForeignKeyField(
        "models.CourseNotification",
        related_name="confirmations",
        on_delete=fields.CASCADE,
        description="通知"
    )
    student = fields.ForeignKeyField(
        "models.Student",
        related_name="notification_confirmations",
        on_delete=fields.CASCADE,
        description="确认学生"
    )

    # 确认信息
    confirmed_at = fields.DatetimeField(auto_now_add=True, description="确认时间")

    class Meta:
        table = "notification_confirmation"
        table_description = "通知确认记录表"
        unique_together = (("notification", "student"),)