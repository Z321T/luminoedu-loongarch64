from tortoise import fields
from app.models.user_common import UserBase, UserRole


class Student(UserBase):
    """
    学生模型，继承自UserBase基础用户模型
    """
    # 学生特有字段
    student_id = fields.CharField(max_length=20, unique=True, description="学号")
    college = fields.CharField(max_length=100, description="学院")
    major = fields.CharField(max_length=100, description="专业")
    grade = fields.CharField(max_length=20, description="年级")
    enrollment_year = fields.IntField(description="入学年份")
    intro = fields.TextField(null=True, description="个人简介")
    contact_email = fields.CharField(max_length=100, null=True, description="联系邮箱")

    class Meta:
        table = "student"
        table_description = "学生信息表"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 确保学生角色设置正确
        self.role = UserRole.STUDENT

    class PydanticMeta:
        # 定义API文档中要排除的字段
        exclude = ["password_hash"]
