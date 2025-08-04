from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.exercise import ExerciseType

class StudentExerciseGenerateRequest(BaseModel):
    """学生习题生成请求模型"""
    document_id: Optional[str] = Field(None, description="指定文档ID，用于基于文档内容生成习题")
    content: Optional[str] = Field(None, description="自定义内容，用于生成习题")
    title: str = Field(default="我的练习题", description="习题集标题")
    count: int = Field(default=5, le=10, description="需要生成的习题数量（学生限制最多10道）")
    types: Optional[List[ExerciseType]] = Field(default=None, description="习题类型列表")
    use_knowledge_matching: bool = Field(default=True, description="是否使用知识点匹配增强生成效果")

class StudentExerciseData(BaseModel):
    """学生习题数据模型"""
    title: str
    content: str
    type: int
    options: Optional[List[str]] = None
    answer: str
    explanation: Optional[str] = None
    order: int = 0
    score: float = 10.0
    knowledge_source: Optional[str] = Field(None, description="知识点来源文档片段")