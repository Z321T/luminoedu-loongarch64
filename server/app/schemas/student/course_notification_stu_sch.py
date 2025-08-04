from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import IntEnum


class NotificationPriority(IntEnum):
    """通知优先级"""
    NORMAL = 1
    HIGH = 2
    URGENT = 3


# 学生通知响应
class StudentNotificationResponse(BaseModel):
    id: int = Field(..., description="通知ID")
    title: str = Field(..., description="通知标题")
    content: str = Field(..., description="通知内容")
    priority: NotificationPriority = Field(..., description="通知优先级")
    require_confirmation: bool = Field(..., description="是否需要确认")
    publish_time: datetime = Field(..., description="发布时间")
    course_name: str = Field(..., description="课程名称")
    teacher_name: str = Field(..., description="教师姓名")
    is_confirmed: bool = Field(default=False, description="是否已确认")
    confirmed_at: Optional[datetime] = Field(None, description="确认时间")


# 通知确认相应
class NotificationConfirmResponse(BaseModel):
    success: bool = Field(..., description="确认是否成功")
    message: str = Field(..., description="操作结果消息")


# 学生通知详情响应
class StudentNotificationDetailResponse(BaseModel):
    id: int = Field(..., description="通知ID")
    title: str = Field(..., description="通知标题")
    content: str = Field(..., description="通知内容")
    priority: NotificationPriority = Field(..., description="通知优先级")
    require_confirmation: bool = Field(..., description="是否需要确认")
    publish_time: datetime = Field(..., description="发布时间")
    course_name: str = Field(..., description="课程名称")
    teacher_name: str = Field(..., description="教师姓名")
    is_confirmed: bool = Field(default=False, description="是否已确认")