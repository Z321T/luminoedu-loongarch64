from typing import List, Optional
from pydantic import BaseModel, Field


## 学生列表
# 学生基本信息（列表显示）
class StudentBasicInfo(BaseModel):
    id: int
    username: str
    student_id: str
    college: str

# 学生列表响应
class StudentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    students: List[StudentBasicInfo]


# 学生详细信息
class StudentDetailResponse(StudentBasicInfo):
    created_at: str
    major: Optional[str] = None
    grade: Optional[str] = None
    enrollment_year: Optional[int] = None
    intro: Optional[str] = None
    contact_email: Optional[str] = None

# 学生信息更新字段
class StudentUpdateFields(BaseModel):
    username: Optional[str] = None
    student_id: Optional[str] = None
    college: Optional[str] = None
    major: Optional[str] = None
    grade: Optional[str] = None
    enrollment_year: Optional[int] = None
    intro: Optional[str] = None
    contact_email: Optional[str] = None


## 教师列表
# 教师基本信息（列表显示）
class TeacherBasicInfo(BaseModel):
    id: int
    username: str
    staff_id: str
    department: str

# 教师列表响应
class TeacherListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    teachers: List[TeacherBasicInfo]


# 教师详细信息
class TeacherDetailResponse(TeacherBasicInfo):
    created_at: str
    expertise: Optional[str] = None
    intro: Optional[str] = None
    contact_email: Optional[str] = None
    office_location: Optional[str] = None

# 教师信息更新字段
class TeacherUpdateFields(BaseModel):
    username: Optional[str] = None
    staff_id: Optional[str] = None
    department: Optional[str] = None
    expertise: Optional[str] = None
    intro: Optional[str] = None
    contact_email: Optional[str] = None
    office_location: Optional[str] = None

# 用户操作响应
class UserUpdateResponse(BaseModel):
    status: str
    message: str
    user_id: str

# 密码重置请求
class UserPasswordResetRequest(BaseModel):
    new_password: str = Field(..., min_length=6, description="新密码")


## 批量删除用户
# 批量删除学生请求
class StudentBatchDeleteRequest(BaseModel):
    student_ids: List[str] = Field(..., description="要删除的学生学号列表")

# 批量删除教师请求
class TeacherBatchDeleteRequest(BaseModel):
    staff_ids: List[str] = Field(..., description="要删除的教师工号列表")

# 批量删除响应
class BatchDeleteResponse(BaseModel):
    success: bool = Field(..., description="是否成功")
    deleted: int = Field(..., description="删除成功数量")
    message: str = Field(..., description="结果消息")