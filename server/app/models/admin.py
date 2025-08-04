from tortoise import fields
from app.models.user_common import UserBase, UserRole


class Admin(UserBase):
    """
    管理员模型，继承自UserBase基础用户模型
    """
    # 管理员特有字段
    admin_id = fields.CharField(max_length=20, unique=True, description="管理员编号")
    permissions = fields.TextField(null=True, description="权限描述")

    class Meta:
        table = "admin"
        table_description = "管理员信息表"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 确保管理员角色设置正确
        self.role = UserRole.ADMIN

    class PydanticMeta:
        # 定义API文档中要排除的字段
        exclude = ["password_hash"]
