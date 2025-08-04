from typing import Dict, Any

from fastapi import HTTPException

from app.models.user_common import UserRole


async def update_user_profile(user, profile_data: Dict[str, Any]):
    """
    更新用户个人信息
    仅允许修改特定字段（null=True的字段）
    """
    allowed_fields = []

    # 根据用户角色确定可修改的字段
    if user.role == UserRole.STUDENT:
        allowed_fields = ["intro", "contact_email"]
    elif user.role == UserRole.TEACHER:
        allowed_fields = ["intro", "contact_email", "expertise", "office_location"]
    elif user.role == UserRole.ADMIN:
        allowed_fields = []  # 管理员没有可修改的个人信息字段

    # 过滤出有效字段
    valid_data = {}
    for field in allowed_fields:
        if field in profile_data and profile_data[field] is not None:
            valid_data[field] = profile_data[field]

    if not valid_data:
        raise HTTPException(status_code=400, detail="没有提供有效的可修改字段")

    # 更新用户信息
    for field, value in valid_data.items():
        setattr(user, field, value)

    await user.save()

    # 返回更新后的字段
    result = {}
    for field in allowed_fields:
        result[field] = getattr(user, field)

    return result

async def change_user_password(user, new_password: str):
    """
    修改用户密码
    """
    user.set_password(new_password)
    await user.save()
    return True