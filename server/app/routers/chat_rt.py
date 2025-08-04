import json
from typing import Dict, Any, Optional

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.core.auth import auth_current_user
from app.models.user_common import UserBase
from app.schemas.chat_sch import ChatRequest
from app.services.chat_svc import process_chat_request, get_chat_history


router = APIRouter(tags=["AI-Chat"])


@router.post("/stream")
async def stream_message(
        request: ChatRequest,
        user: UserBase = Depends(auth_current_user)
):
    """统一的AI问答接口 - 流式响应 - 面向教师与学生用户"""
    # 强制设置为流式请求
    request.stream = True

    async def event_generator():
        try:
            async for chunk in process_chat_request(request, str(user.id), user.role):
                yield f"data: {json.dumps(chunk.model_dump(), ensure_ascii=False)}\n\n"

                if chunk.is_complete:
                    break

            yield "data: [DONE]\n\n"
        except Exception as e:
            error_json = json.dumps({"error": str(e)}, ensure_ascii=False)
            yield f"data: {error_json}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


@router.get("/history", response_model=Dict[str, Any])
async def chat_history(
        chat_id: Optional[str] = None,
        limit: int = 20,
        user: UserBase = Depends(auth_current_user)
):
    """获取聊天历史记录"""
    # 传递用户角色信息
    history = await get_chat_history(str(user.id), user.role, chat_id, limit)
    return history