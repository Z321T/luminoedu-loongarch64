from fastapi import Request
import time
from app.core.logger import setup_logger

# 请求日志记录器
request_logger = setup_logger("request")

async def log_request_middleware(request: Request, call_next):
    """记录请求和响应的中间件"""
    start_time = time.time()
    path = request.url.path
    method = request.method

    # 记录请求
    request_id = f"{int(start_time * 1000)}"
    request_logger.info(f"[{request_id}] 开始 {method} {path}")

    # 处理请求
    response = await call_next(request)

    # 计算处理时间
    process_time = time.time() - start_time

    # 记录响应
    request_logger.info(
        f"[{request_id}] 完成 {method} {path} - 状态码:{response.status_code} - 用时:{process_time:.3f}秒"
    )

    return response