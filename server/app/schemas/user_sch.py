import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class UserProfileUpdate(BaseModel):
    """用户可修改的基本信息模型"""
    intro: Optional[str] = Field(None, description="个人简介")
    contact_email: Optional[str] = Field(None, description="联系邮箱")


class TeacherProfileUpdate(UserProfileUpdate):
    """教师特有可修改信息模型"""
    expertise: Optional[str] = Field(None, description="专业领域")
    office_location: Optional[str] = Field(None, description="办公室位置")


class ProfileUpdateResponse(BaseModel):
    """个人信息更新响应模型"""
    status: str
    message: str
    data: dict


class PasswordChange(BaseModel):
    """密码修改模型"""
    current_password: str = Field(..., description="当前密码")
    new_password: str = Field(
        ...,
        min_length=6,
        description="新密码（至少6位，必须包含大小写字母、数字和特殊字符）"
    )

    @field_validator('new_password')
    def password_complexity(cls, v):
        # 检查是否包含至少一个大写字母
        if not re.search(r'[A-Z]', v):
            raise ValueError('密码必须包含至少一个大写字母')

        # 检查是否包含至少一个小写字母
        if not re.search(r'[a-z]', v):
            raise ValueError('密码必须包含至少一个小写字母')

        # 检查是否包含至少一个数字
        if not re.search(r'\d', v):
            raise ValueError('密码必须包含至少一个数字')

        # 检查是否包含至少一个特殊字符
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('密码必须包含至少一个特殊字符')

        return v


class PasswordChangeResponse(BaseModel):
    """密码修改响应模型"""
    status: str
    message: str