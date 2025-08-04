from fastapi import APIRouter
from app.routers.teacher import (
    exercise_generator_rt, ppt_generator_rt,
    course_th_rt, course_material_th_rt , course_notification_th_rt,
    document_vectorization_th_rt
)

# 教师专用路由
teacher_router = APIRouter()

# 教师端文档向量化路由
teacher_router.include_router(
    document_vectorization_th_rt.router,
    prefix="/document_vectorization",
)

# 教师端练习生成器路由
teacher_router.include_router(
    exercise_generator_rt.router,
    prefix="/exercise_generator",
)

# 教师端PPT生成器路由
teacher_router.include_router(
    ppt_generator_rt.router,
    prefix="/ppt",
)

# 教师端课程管理路由
teacher_router.include_router(
    course_th_rt.router,
    prefix="/course",
)

# 教师端课程资料管理路由
teacher_router.include_router(
    course_material_th_rt.router,
    prefix="/course_material",
)

# 教师端课程通知管理路由
teacher_router.include_router(
    course_notification_th_rt.router,
    prefix="/course_notification",
)

# 导出路由供主路由使用
router = teacher_router