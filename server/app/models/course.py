from tortoise import fields, models


class Course(models.Model):
    """课程模型"""
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100, description="课程名称")
    description = fields.TextField(null=True, blank=True, description="课程描述")

    # 课程所属教师
    teacher = fields.ForeignKeyField(
        "models.Teacher", related_name="create_courses",
        on_delete=fields.CASCADE, description="课程教师"
    )

    # 课程学生
    students = fields.ManyToManyField(
        "models.Student", related_name="enrolled_courses",
        through="course_student", description="课程学生"
    )

    # 基础信息
    semester = fields.CharField(max_length=20, description="学期")
    credit = fields.FloatField(default=0, description="学分")
    start_date = fields.DateField(null=True, description="开始日期")
    end_date = fields.DateField(null=True, description="结束日期")

    # 系统字段
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")

    class Meta:
        table = "course"
        table_description = "课程信息表"


class CourseStudent(models.Model):
    """课程-学生关联表"""
    id = fields.IntField(pk=True)
    course = fields.ForeignKeyField("models.Course", on_delete=fields.CASCADE)
    student = fields.ForeignKeyField("models.Student", on_delete=fields.CASCADE)

    class Meta:
        table = "course_student"
        table_description = "课程-学生关联表"
        unique_together = (("course", "student"),)
