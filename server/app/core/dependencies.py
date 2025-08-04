from fastapi import Depends, HTTPException, status
from app.models.user_common import UserRole
from app.core.auth import auth_current_user

async def auth_student_user(current_user = Depends(auth_current_user)):
    """
    验证当前用户是否为学生
    """
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，只有学生可以访问此功能"
        )
    return current_user

async def auth_teacher_user(current_user = Depends(auth_current_user)):
    """
    验证当前用户是否为教师
    """
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，只有教师可以访问此功能"
        )
    return current_user

async def auth_admin_user(current_user = Depends(auth_current_user)):
    """
    验证当前用户是否为管理员
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，只有管理员可以访问此功能"
        )
    return current_user