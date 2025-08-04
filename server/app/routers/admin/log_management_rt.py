from io import BytesIO
from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from app.schemas.admin.log_management_sch import LogServiceList, LogFileList, LogContent
from app.services.admin.log_svc import (
    get_log_services, get_log_files, get_log_content, export_log_files
)

router = APIRouter(tags=["管理员端-系统日志管理"])

@router.get("/services", response_model=LogServiceList)
async def list_log_services():
    """
    获取所有可用的日志服务列表
    """
    return await get_log_services()


@router.get("/files", response_model=LogFileList)
async def list_log_files(
    service_name: str = Query(..., description="日志服务名称"),
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)")
):
    """
    获取指定服务的日志文件列表

    可选参数:
    - start_date: 开始日期，筛选该日期之后的日志文件
    - end_date: 结束日期，筛选该日期之前的日志文件
    """
    return await get_log_files(service_name, start_date, end_date)


@router.get("/content", response_model=LogContent)
async def read_log_content(
    service_name: str = Query(..., description="日志服务名称"),
    file_name: str = Query(..., description="日志文件名称"),
):
    """
    读取日志文件内容
    """
    return await get_log_content(service_name, file_name)


@router.get("/export")
async def export_logs(
        service_name: str = Query(..., description="日志服务名称"),
        start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
        end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)")
):
    """
    导出指定服务的日志文件

    可选参数:
    - start_date: 开始日期，筛选该日期之后的日志
    - end_date: 结束日期，筛选该日期之前的日志

    返回合并后的日志文件
    """
    filename, content = await export_log_files(service_name, start_date, end_date)

    # 创建内存文件
    file_stream = BytesIO(content)

    # 使用StreamingResponse返回文件
    return StreamingResponse(
        content=file_stream,
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )