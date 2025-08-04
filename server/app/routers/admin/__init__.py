from fastapi import APIRouter
from app.routers.admin import user_management_rt, log_management_rt, model_management_rt

# 管理员专用路由
admin_router = APIRouter()

# 用户管理路由
admin_router.include_router(
    user_management_rt.router,
    prefix="/user_management",
)

# 日志管理路由
admin_router.include_router(
    log_management_rt.router,
    prefix="/log_management",
)

# 模型管理路由
admin_router.include_router(
    model_management_rt.router,
    prefix="/model_management",
)

# 导出路由供主路由使用
router = admin_router