from typing import Optional
from pydantic import BaseModel


class LoginForm(BaseModel):
    """用户登录表单模型"""
    user_id: str  # 根据角色不同表示学号/工号/管理员编号
    password: str


class Token(BaseModel):
    """登录成功后返回的令牌模型"""
    access_token: str
    token_type: str
    user_id: str
    role: str
    username: str


class TokenPayload(BaseModel):
    """JWT令牌负载数据模型"""
    sub: str
    id: str
    role: str
    exp: Optional[int] = None