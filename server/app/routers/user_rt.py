from fastapi import APIRouter, Depends, HTTPException

from app.core.logger import setup_logger
from app.core.dependencies import auth_current_user
from app.models.user_common import UserRole
from app.schemas.user_sch import (
    UserProfileUpdate,
    TeacherProfileUpdate,
    PasswordChange,
    ProfileUpdateResponse,
    PasswordChangeResponse
)
from app.services.user_svc import update_user_profile, change_user_password

router = APIRouter(tags=["用户个人中心"])

logger = setup_logger("user_center_service")


@router.get("/profile")
async def get_user_profile(current_user = Depends(auth_current_user)):
    """获取当前登录用户信息，根据用户角色返回不同的详细信息"""
    logger.info(f"用户[{current_user.username}]({current_user.role}) 查询个人信息")
    # 基础信息（所有角色共有）
    user_info = {
        "username": current_user.username,
        "role": current_user.role,
    }

    # 根据角色添加额外信息
    if current_user.role == UserRole.STUDENT:
        user_info.update({
            "student_id": current_user.student_id,
            "college": current_user.college,
            "major": current_user.major,
            "grade": current_user.grade,
            "enrollment_year": current_user.enrollment_year,
            "intro": current_user.intro,
            "contact_email": current_user.contact_email
        })
    elif current_user.role == UserRole.TEACHER:
        user_info.update({
            "staff_id": current_user.staff_id,
            "department": current_user.department,
            "expertise": current_user.expertise,
            "intro": current_user.intro,
            "contact_email": current_user.contact_email,
            "office_location": current_user.office_location
        })
    elif current_user.role == UserRole.ADMIN:
        user_info.update({
            "admin_id": current_user.admin_id,
            "permissions": current_user.permissions
        })

    return user_info


@router.put("/profile/student", response_model=ProfileUpdateResponse)
async def update_student_profile(
        profile_data: UserProfileUpdate,
        current_user=Depends(auth_current_user)
):
    """更新学生个人信息"""
    logger.info(f"用户[{current_user.username}]({current_user.role}) 更新学生个人信息")
    if current_user.role != UserRole.STUDENT:
        logger.info(f"用户[{current_user.username}]({current_user.role}) 尝试更新学生个人信息，但权限不足")
        raise HTTPException(status_code=403, detail="权限不足")

    result = await update_user_profile(current_user, profile_data.model_dump(exclude_unset=True))
    return {
        "status": "success",
        "message": "个人信息更新成功",
        "data": result
    }


@router.put("/profile/teacher", response_model=ProfileUpdateResponse)
async def update_teacher_profile(
        profile_data: TeacherProfileUpdate,
        current_user=Depends(auth_current_user)
):
    """更新教师个人信息"""
    logger.info(f"用户[{current_user.username}]({current_user.role}) 更新教师个人信息")
    if current_user.role != UserRole.TEACHER:
        logger.info(f"用户[{current_user.username}]({current_user.role}) 尝试更新教师个人信息，但权限不足")
        raise HTTPException(status_code=403, detail="权限不足")

    result = await update_user_profile(current_user, profile_data.model_dump(exclude_unset=True))
    return {
        "status": "success",
        "message": "个人信息更新成功",
        "data": result
    }

@router.post("/change_password", response_model=PasswordChangeResponse)
async def change_password(
    password_data: PasswordChange,
    current_user = Depends(auth_current_user)
):
    """
    修改当前用户的密码
    """
    logger.info(f"用户[{current_user.username}]({current_user.role}) 修改密码")
    # 验证当前密码
    if not current_user.verify_password(password_data.current_password):
        raise HTTPException(status_code=400, detail="当前密码不正确")

    # 更新密码
    await change_user_password(current_user, password_data.new_password)
    return {
        "status": "success",
        "message": "密码修改成功"
    }