from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import verify_token
from app.services.auth_svc import auth_user_by_role_and_id

# 创建OAuth2认证方案
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def auth_current_user(token: str = Depends(oauth2_scheme)):
    """
    根据JWT令牌获取当前用户
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = await verify_token(token)
    if token_data is None:
        raise credentials_exception

    # 使用服务层函数获取用户
    user = await auth_user_by_role_and_id(role=token_data.role, user_id=token_data.id)
    if user is None:
        raise credentials_exception

    return user
