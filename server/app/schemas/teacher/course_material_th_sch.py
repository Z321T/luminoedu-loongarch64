from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# 课程资料上传
class MaterialUploadResponse(BaseModel):
    success: bool = Field(..., description="是否成功")
    filename: str = Field(..., description="文件名")
    file_size: int = Field(..., description="文件大小(字节)")
    message: str = Field(..., description="结果消息")

# 资料
class MaterialInfo(BaseModel):
    filename: str = Field(..., description="文件名")
    file_size: int = Field(..., description="文件大小(字节)")
    upload_time: datetime = Field(..., description="上传时间")
    file_extension: str = Field(..., description="文件扩展名")

# 资料列表
class MaterialListResponse(BaseModel):
    course_id: int = Field(..., description="课程ID")
    course_name: str = Field(..., description="课程名称")
    materials: List[MaterialInfo] = Field(default_factory=list, description="资料列表")
    total_count: int = Field(..., description="资料总数")

# 资料删除
class MaterialDeleteResponse(BaseModel):
    success: bool = Field(..., description="是否成功")
    message: str = Field(..., description="结果消息")