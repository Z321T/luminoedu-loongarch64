import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.config import MEDIA_ROOT
from app.core import initialize_system_directories
from app.core.logger import app_logger
from app.core.middleware import log_request_middleware
from app.database import TORTOISE_ORM
from app.routers import api_router

# 将项目根目录添加到 Python 路径
BASE_DIR = Path(__file__).parent
sys.path.append(str(BASE_DIR))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI 应用生命周期管理器
    """
    # 应用启动前的操作
    initialize_system_directories(MEDIA_ROOT)
    print("应用初始化: 目录结构已准备就绪")
    app_logger.info("应用程序启动")

    # 应用运行中
    yield

    # 应用关闭时的操作
    print("应用关闭中: 正在清理资源...")
    app_logger.info("应用程序关闭")


# FastAPI 应用实例
app = FastAPI(
    title="LuminoEdu",
    description="--基于多模态大模型的数字化教学资源制作系统",
    version="1.2.0",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://60.204.202.205"
    ],  # Vue开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加日志请求中间件
app.middleware("http")(log_request_middleware)

# 注册路由
app.include_router(api_router, prefix="/api")

# 注册tortoise-orm
register_tortoise(
    app=app,
    config=TORTOISE_ORM,
)

@app.get("/api")
async def root():
    return {
        "message": "LuminoEdu API Server is running",
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app="main:app", host="127.0.0.1", port=8000, reload=True)