from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from app.schemas.auth_sch import TokenPayload
from pydantic import ValidationError
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    创建JWT访问令牌
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    # 使用TokenPayload模型确保数据结构一致性
    payload = TokenPayload(
        sub=to_encode["sub"],
        id=to_encode["id"],
        role=to_encode["role"],
        exp=int(expire.timestamp())
    )

    encoded_jwt = jwt.encode(payload.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def verify_token(token: str) -> Optional[TokenPayload]:
    """
    验证JWT令牌并返回解码后的载荷
    """
    try:
        payload_dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # 使用TokenPayload模型验证和结构化数据
        token_data = TokenPayload(**payload_dict)
        return token_data
    except (jwt.PyJWTError, ValidationError):
        return None
