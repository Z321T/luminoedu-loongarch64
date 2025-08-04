from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import auth_teacher_user
from app.models.teacher import Teacher
from app.schemas.teacher.course_notification_th_sch import (
    NotificationCreateRequest, NotificationUpdateRequest,
    NotificationOperationResponse, NotificationDetailResponse
)
from app.services.teacher.course_notification_th_svc import (
    create_course_notification, get_course_notifications,
    get_notification_detail, update_notification, delete_notification
)

router = APIRouter(tags=["教师端-课程通知管理"])


@router.post("/{course_id}/notifications", response_model=NotificationOperationResponse)
async def create_notification_api(
        course_id: int,
        request: NotificationCreateRequest,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """
    创建课程通知

    支持的通知优先级：
    - 1: 普通（默认）
    - 2: 重要
    - 3: 紧急
    """
    try:
        notification_id = await create_course_notification(
            current_user.id, course_id, request
        )
        return NotificationOperationResponse(
            success=True,
            message="通知创建成功",
            notification_id=notification_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建通知失败: {str(e)}")


@router.get("/{course_id}/notifications", response_model=dict)
async def get_notifications_api(
        course_id: int,
        page: int = Query(1, ge=1, description="页码"),
        page_size: int = Query(20, ge=1, le=100, description="每页数量"),
        current_user: Teacher = Depends(auth_teacher_user)
):
    """获取课程通知列表"""
    try:
        notifications, total_count = await get_course_notifications(
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


@router.get("/{course_id}/notifications/{notification_id}", response_model=NotificationDetailResponse)
async def get_notification_detail_api(
        course_id: int,
        notification_id: int,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """获取通知详情和确认统计"""
    try:
        return await get_notification_detail(
            current_user.id, course_id, notification_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{course_id}/notifications/{notification_id}", response_model=NotificationOperationResponse)
async def update_notification_api(
        course_id: int,
        notification_id: int,
        request: NotificationUpdateRequest,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """更新通知"""
    try:
        await update_notification(
            current_user.id, course_id, notification_id, request
        )
        return NotificationOperationResponse(
            success=True,
            message="通知更新成功",
            notification_id=notification_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{course_id}/notifications/{notification_id}", response_model=NotificationOperationResponse)
async def delete_notification_api(
        course_id: int,
        notification_id: int,
        current_user: Teacher = Depends(auth_teacher_user)
):
    """删除通知"""
    try:
        await delete_notification(
            current_user.id, course_id, notification_id
        )
        return NotificationOperationResponse(
            success=True,
            message="通知删除成功",
            notification_id=notification_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))