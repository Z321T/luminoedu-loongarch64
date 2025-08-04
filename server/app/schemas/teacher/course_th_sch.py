from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

## 课程创建
# 课程创建请求模型
class CourseCreateRequest(BaseModel):
    name: str = Field(..., max_length=100, description="课程名称")
    description: Optional[str] = Field(None, description="课程描述")
    semester: str = Field(..., max_length=20, description="学期")
    credit: float = Field(..., description="学分")
    start_date: Optional[date] = Field(None, description="开始日期，格式YYYY-MM-DD")
    end_date: Optional[date] = Field(None, description="结束日期，格式YYYY-MM-DD")

# 课程创建响应模型
class CourseCreateResponse(BaseModel):
    id: int = Field(..., description="课程ID")
    name: str = Field(..., max_length=100, description="课程名称")
    description: Optional[str] = Field(None, description="课程描述")


## 课程删除
# 课程删除响应模型
class CourseDeleteResponse(BaseModel):
    success: bool = Field(..., description="是否成功")
    message: str = Field(..., description="结果消息")


## 课程信息获取
# 课程基础信息响应模型
class CourseBaseResponse(BaseModel):
    id: int = Field(..., description="课程ID")
    name: str = Field(..., description="课程名称")
    description: Optional[str] = Field(None, description="课程描述")
    semester: str = Field(..., description="学期")
    credit: float = Field(..., description="学分")
    start_date: Optional[date] = Field(None, description="开始日期")
    end_date: Optional[date] = Field(None, description="结束日期")

    class Config:
        from_attributes = True

# 学生基础信息模型
class StudentBaseInfo(BaseModel):
    name: str = Field(..., description="学生姓名")
    student_id: str = Field(..., description="学号")
    college: str = Field(..., description="学院")
    grade: str = Field(..., description="年级")

# 课程详情响应模型
class CourseDetailResponse(CourseBaseResponse):
    students: List[StudentBaseInfo] = Field(default_factory=list, description="学生列表")


## 课程学生添加与删除
# 课程添加学生响应模型
class CourseAddStudentsResponse(BaseModel):
    success: bool = Field(..., description="是否成功")
    total: int = Field(..., description="总学生数")
    added: int = Field(..., description="添加成功数量")
    failed: List[str] = Field(default_factory=list, description="添加失败的学号")
    message: str = Field(..., description="结果消息")

# 课程删除学生请求模型
class CourseRemoveStudentsRequest(BaseModel):
    student_ids: List[str] = Field(..., description="要删除的学生学号列表")

# 课程删除学生响应模型
class CourseRemoveStudentsResponse(BaseModel):
    success: bool = Field(..., description="是否成功")
    removed: int = Field(..., description="删除成功数量")
    message: str = Field(..., description="结果消息")