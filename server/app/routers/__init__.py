from fastapi import APIRouter, Depends
from app.routers import auth_rt, user_rt, teacher, admin, student, chat_rt
from app.core.dependencies import auth_current_user, auth_teacher_user, auth_student_user, auth_admin_user


# 主路由
api_router = APIRouter()

# 子路由
# 登录认证路由
api_router.include_router(
    auth_rt.router,
    prefix="/auth"
)

# 用户个人中心路由
api_router.include_router(
    user_rt.router,
    prefix="/user",
    dependencies=[Depends(auth_current_user)]
)

# AI-Chat相关路由
api_router.include_router(
    chat_rt.router,
    prefix="/chat",
    dependencies=[Depends(auth_current_user)]
)

# 管理员端路由
api_router.include_router(
    admin.router,
    prefix="/admin",
    dependencies=[Depends(auth_admin_user)]
)

# 教师端路由
api_router.include_router(
    teacher.router,
    prefix="/teacher",
    dependencies=[Depends(auth_teacher_user)]
)

# 学生端路由
api_router.include_router(
    student.router,
    prefix="/student",
    dependencies=[Depends(auth_student_user)]
)