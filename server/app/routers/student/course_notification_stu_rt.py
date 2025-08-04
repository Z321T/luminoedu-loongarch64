from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.core.dependencies import auth_student_user
from app.models.student import Student
from app.schemas.student.course_notification_stu_sch import (
    NotificationConfirmResponse,
    StudentNotificationDetailResponse
)
from app.services.student.course_notification_stu_svc import (
    get_student_notifications, confirm_notification, get_student_notification_detail
)

router = APIRouter(tags=["学生端-课程通知"])


@router.get("/notifications", response_model=dict)
async def get_student_notifications_api(
        course_id: Optional[int] = Query(None, description="课程ID，为空则获取所有课程通知"),
        page: int = Query(1, ge=1, description="页码"),
        page_size: int = Query(20, ge=1, le=100, description="每页数量"),
        current_user: Student = Depends(auth_student_user)
):
    """获取学生的课程通知列表"""
    try:
        notifications, total_count = await get_student_notifications(
            current_user.id, course_id, page, page_size
        )
        return {
            "notifications": notifications,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/notifications/{notification_id}", response_model=StudentNotificationDetailResponse)
async def get_student_notification_detail_api(
        notification_id: int,
        current_user: Student = Depends(auth_student_user)
):
    """获取学生的通知详情"""
    try:
        notification_detail = await get_student_notification_detail(
            current_user.id, notification_id
        )
        return notification_detail
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/notifications/{notification_id}/confirm", response_model=NotificationConfirmResponse)
async def confirm_notification_api(
        notification_id: int,
        current_user: Student = Depends(auth_student_user)
):
    """确认通知"""
    try:
        await confirm_notification(
            current_user.id, notification_id
        )
        return NotificationConfirmResponse(
            success=True,
            message="通知确认成功"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))