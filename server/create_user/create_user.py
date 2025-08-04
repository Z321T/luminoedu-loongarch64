import asyncio

from tortoise import Tortoise

from app.database import TORTOISE_ORM
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.admin import Admin


async def init():
    # 初始化数据库连接
    await Tortoise.init(config=TORTOISE_ORM)

async def create_student():
    # 检查学生是否已存在
    student_exists = await Student.filter(student_id="S2025001").exists()
    if student_exists:
        return

    # 创建学生用户实例
    student = Student(
        username="王测试",
        student_id="S2025001",
        college="计算机学院",
        major="软件工程",
        grade="2025级",
        enrollment_year=2025
    )
    student.set_password("mmmm123")  # 使用模型方法设置密码
    await student.save()
    print(f"已创建学生: {student.username}")

async def create_teacher():
    # 检查教师是否已存在
    teacher_exists = await Teacher.filter(staff_id="T2025001").exists()
    if teacher_exists:
        return

    # 创建教师用户实例
    teacher = Teacher(
        username="王教师",
        staff_id="T2025001",
        department="计算机科学系",
        expertise="人工智能"
    )
    teacher.set_password("mmmm123")  # 使用模型方法设置密码
    await teacher.save()
    print(f"已创建教师: {teacher.username}")

async def create_admin():
    # 检查管理员是否已存在
    admin_exists = await Admin.filter(admin_id="A2025001").exists()
    if admin_exists:
        return

    # 创建管理员用户实例
    admin = Admin(
        username="admin",
        admin_id="A2025001",
    )
    admin.set_password("mmmm123")  # 使用模型方法设置密码
    await admin.save()
    print(f"已创建管理员: {admin.username}")

async def main():
    await init()
    await create_student()
    await create_teacher()
    await create_admin()
    await Tortoise.close_connections()

if __name__ == "__main__":
    asyncio.run(main())