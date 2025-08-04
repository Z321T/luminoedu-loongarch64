from datetime import timedelta
from typing import Union, Tuple

from fastapi import HTTPException, status

from app.core.security import create_access_token
from app.models import Admin, Student, Teacher
from app.models.user_common import UserRole

# 用户ID前缀与角色的映射
ID_PREFIX_ROLE_MAP = {
    "S": UserRole.STUDENT,
    "T": UserRole.TEACHER,
    "A": UserRole.ADMIN,
}

# 用户模型及其对应ID字段的映射
USER_MODEL_CONFIG = {
    UserRole.STUDENT: {"model": Student, "id_field": "student_id"},
    UserRole.TEACHER: {"model": Teacher, "id_field": "staff_id"},
    UserRole.ADMIN: {"model": Admin, "id_field": "admin_id"}
}


def parse_user_role_from_id(user_id: str) -> Tuple[UserRole, str]:
    """
    从用户ID解析角色

    Args:
        user_id: 用户ID (如 S12345, T67890, A00001)

    Returns:
        元组: (用户角色, 原始ID)

    Raises:
        HTTPException: 如果ID格式无效
    """
    if not user_id or len(user_id) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户ID格式无效"
        )

    prefix = user_id[0].upper()
    role = ID_PREFIX_ROLE_MAP.get(prefix)

    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"无效的用户ID前缀: {prefix}"
        )

    return role, user_id


async def authenticate_user(user_id: str, password: str) -> Union[Student, Teacher, Admin]:
    """
    根据角色ID和密码验证用户

    Args:
        user_id: 用户ID (自动从前缀识别角色)
        password: 用户密码
    """
    # 从ID解析角色
    role, original_id = parse_user_role_from_id(user_id)

    # 获取角色对应的配置
    role_config = USER_MODEL_CONFIG.get(role)
    if not role_config:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的用户角色"
        )

    user_model = role_config["model"]
    id_field = role_config["id_field"]

    # 构建查询条件
    query_kwargs = {id_field: user_id}

    # 查找用户
    user = await user_model.filter(**query_kwargs).first()

    # 验证用户是否存在
    if not user:
        role_name = {"student": "学生", "teacher": "教师", "admin": "管理员"}[role.value]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"该{role_name}用户不存在",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 验证密码
    if not user.verify_password(password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

async def login_for_access_token(user_id: str, password: str):
    """
    登录并创建访问令牌
    """
    # 验证用户
    user = await authenticate_user(user_id, password)

    # 创建访问令牌
    access_token_expires = timedelta(minutes=60 * 24)  # 24小时
    access_token = create_access_token(
        data={"sub": user.username, "id": user_id, "role": user.role},
        expires_delta=access_token_expires
    )

    # 返回令牌和用户信息
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id,
        "role": user.role,
        "username": user.username
    }

async def auth_user_by_role_and_id(role: str, user_id: str):
    """
    根据角色和ID获取用户
    """
    try:
        role_enum = UserRole(role)
        role_config = USER_MODEL_CONFIG.get(role_enum)
        if not role_config:
            return None

        id_field = role_config["id_field"]
        # 使用角色对应的ID字段查询
        query_kwargs = {id_field: user_id}
        return await role_config["model"].filter(**query_kwargs).first()
    except ValueError:
        return None


