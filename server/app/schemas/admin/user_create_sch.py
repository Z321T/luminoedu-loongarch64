from pydantic import BaseModel, Field
from typing import List, Optional

class UserCreateResult(BaseModel):
    """单个用户创建结果"""
    username: str
    success: bool
    error: Optional[str] = None

class BatchUserCreateResponse(BaseModel):
    """批量用户创建响应"""
    total: int
    success_count: int
    failed_count: int
    failed_records: List[UserCreateResult] = Field(default_factory=list)