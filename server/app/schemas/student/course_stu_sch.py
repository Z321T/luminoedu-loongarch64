from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel


# 课程相关模型
class CourseResponse(BaseModel):
    """课程响应模型"""
    id: int
    name: str
    description: Optional[str]
    semester: str
    credit: float
    start_date: Optional[date]
    end_date: Optional[date]
    teacher_name: str


class StudentCoursesResponse(BaseModel):
    """学生课程列表响应"""
    total: int
    courses: List[CourseResponse]



# 课程资料下载
class CourseMaterialResponse(BaseModel):
    """课程资料响应模型"""
    file_name: str
    upload_time: datetime
    uploader_name: str


class CourseMaterialsResponse(BaseModel):
    """课程资料列表响应"""
    total: int
    materials: List[CourseMaterialResponse]