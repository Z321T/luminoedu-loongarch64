from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class LogService(BaseModel):
    """日志服务信息"""
    name: str
    description: str

class LogServiceList(BaseModel):
    """日志服务列表"""
    services: List[LogService]

class LogFile(BaseModel):
    """日志文件信息"""
    name: str
    date: Optional[datetime] = None
    size: str

class LogFileList(BaseModel):
    """日志文件列表"""
    files: List[LogFile]
    service_name: str
    service_description: str

class LogContent(BaseModel):
    """日志内容"""
    content: List[str]
    file_name: str
    service_name: str