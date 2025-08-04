from enum import Enum
from typing import List, Optional, Dict

from pydantic import BaseModel, Field


class ChatMessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: ChatMessageRole
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    chat_id: Optional[str] = None
    max_tokens: Optional[int] = 4096
    temperature: Optional[float] = 0.7
    stream: bool = True

class ChatStreamResponse(BaseModel):
    chat_id: str
    content: str
    is_complete: bool = False

class ChatResponse(BaseModel):
    id: str
    message: ChatMessage
    usage: Dict[str, int] = Field(default_factory=dict)

class ChatHistoryItem(BaseModel):
    chat_id: str
    created_at: str
    preview: str

class ChatHistoryResponse(BaseModel):
    chats: List[ChatHistoryItem]