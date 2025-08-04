from pydantic import BaseModel, Field
from typing import List, Optional


class PPTGenerationRequest(BaseModel):
    """PPT生成请求模型"""
    title: str = Field(..., max_length=30 , description="PPT标题")
    subject: str = Field(..., max_length=30, description="学科主题")
    teaching_target: str = Field(..., max_length=100, description="教学目标")
    key_points: List[str] = Field(..., max_length=100,description="教学重点列表")
    target_grade: str = Field(..., description="目标年级")
    slide_count: int = Field(default=10, ge=5, le=20, description="期望的幻灯片数量")
    additional_info: Optional[str] = None


class PPTSlide(BaseModel):
    """PPT单页模型"""
    title: str
    content: str
    note: Optional[str] = None


class PPTGenerationResponse(BaseModel):
    """PPT生成响应模型"""
    title: str = Field(..., max_length=30, description="PPT标题")
    slides: List[PPTSlide]
    filename: Optional[str] = None


class PPTOutlineResponse(BaseModel):
    """PPT大纲响应模型"""
    title: str
    outline_md: str  # Markdown格式的PPT大纲


class PPTGenerationFromOutlineRequest(BaseModel):
    """基于大纲生成PPT的请求模型"""
    title: str = Field(..., max_length=30, description="PPT标题")
    outline_md: str = Field(..., description="Markdown格式的PPT大纲内容")
    design_preference: Optional[str] = None  # 设计偏好，如"简洁"、"多彩"等
