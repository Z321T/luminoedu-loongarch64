from tortoise import fields, models
from passlib.hash import bcrypt
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"


class UserBase(models.Model):
    """
    用户基础模型
    """
    id = fields.IntField(pk=True) # 主键
    username = fields.CharField(max_length=50, unique=True) # 用户名
    password_hash = fields.CharField(max_length=128) # 密码哈希
    role = fields.CharEnumField(UserRole, default=UserRole.STUDENT) # 用户角色
    created_at = fields.DatetimeField(auto_now_add=True) # 创建时间
    updated_at = fields.DatetimeField(auto_now=True) # 更新时间

    class Meta:
        abstract = True  # 设为抽象模型，供其他模型继承

    def set_password(self, password: str):
        """
        设置密码（加密）
        """
        self.password_hash = bcrypt.hash(password)

    def verify_password(self, password: str) -> bool:
        """
        验证密码
        """
        return bcrypt.verify(password, self.password_hash)

    def has_permission(self, required_role: UserRole) -> bool:
        """
        检查用户是否具有所需权限
        """
        role_hierarchy = {
            UserRole.STUDENT: 1,
            UserRole.TEACHER: 2,
            UserRole.ADMIN: 3,
        }

        # 确保所有角色都在字典中
        if self.role not in role_hierarchy or required_role not in role_hierarchy:
            return False

        return role_hierarchy[self.role] >= role_hierarchy[required_role]