from tortoise import fields
from app.models.user_common import UserBase, UserRole


class Teacher(UserBase):
    """
    教师模型，继承自UserBase基础用户模型
    """
    # 教师特有字段
    staff_id = fields.CharField(max_length=20, unique=True, description="教工号")
    department = fields.CharField(max_length=100, description="所属院系")
    expertise = fields.CharField(max_length=255, null=True, description="专业领域")
    intro = fields.TextField(null=True, description="个人简介")
    contact_email = fields.CharField(max_length=100, null=True, description="联系邮箱")
    office_location = fields.CharField(max_length=100, null=True, description="办公室位置")

    class Meta:
        table = "teacher"
        table_description = "教师信息表"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 确保教师角色设置正确
        self.role = UserRole.TEACHER

    class PydanticMeta:
        # 定义API文档中要排除的字段
        exclude = ["password_hash"]