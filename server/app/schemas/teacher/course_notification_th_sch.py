from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from datetime import datetime
from enum import IntEnum


class NotificationPriority(IntEnum):
    """通知优先级"""
    NORMAL = 1
    HIGH = 2
    URGENT = 3


# 通知创建请求
class NotificationCreateRequest(BaseModel):
    title: str = Field(..., max_length=200, description="通知标题")
    content: str = Field(..., description="通知内容")
    priority: NotificationPriority = Field(
        default=NotificationPriority.NORMAL,
        description="通知优先级"
    )
    require_confirmation: bool = Field(default=False, description="是否需要确认")


# 更新通知请求
class NotificationUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200, description="通知标题")
    content: Optional[str] = Field(None, description="通知内容")
    priority: Optional[NotificationPriority] = Field(None, description="通知优先级")
    require_confirmation: Optional[bool] = Field(None, description="是否需要确认")


# 学生确认信息
class StudentConfirmationInfo(BaseModel):
    student_id: int = Field(..., description="学生ID")
    student_name: str = Field(..., description="学生姓名")
    student_number: str = Field(..., description="学号")
    confirmed_at: datetime = Field(..., description="确认时间")


# 通知详情响应
class NotificationDetailResponse(BaseModel):
    id: int = Field(..., description="通知ID")
    title: str = Field(..., description="通知标题")
    content: str = Field(..., description="通知内容")
    priority: NotificationPriority = Field(..., description="通知优先级")
    require_confirmation: bool = Field(..., description="是否需要确认")
    publish_time: datetime = Field(..., description="发布时间")

    # 统计信息
    total_students: int = Field(..., description="课程总学生数")
    confirmed_students: int = Field(default=0, description="已确认学生数")
    confirmation_rate: float = Field(default=0.0, description="确认率")

    # 确认详情
    confirmations: List[StudentConfirmationInfo] = Field(
        default=[],
        description="确认详情列表"
    )


# 通知列表响应
class NotificationListResponse(BaseModel):
    id: int = Field(..., description="通知ID")
    title: str = Field(..., description="通知标题")
    priority: NotificationPriority = Field(..., description="通知优先级")
    require_confirmation: bool = Field(..., description="是否需要确认")
    publish_time: datetime = Field(..., description="发布时间")
    confirmed_students: int = Field(default=0, description="已确认学生数")
    total_students: int = Field(..., description="课程总学生数")


# 通知操作响应
class NotificationOperationResponse(BaseModel):
    success: bool = Field(..., description="操作是否成功")
    message: str = Field(..., description="操作结果消息")
    notification_id: Optional[int] = Field(None, description="通知ID")