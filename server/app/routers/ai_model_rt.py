from fastapi import APIRouter, Depends

from app.core.ai_api.model_factory import AIModelFactory
from app.core.auth import auth_current_user
from app.models.user_common import UserBase

router = APIRouter(tags=["AI-Model"])



@router.get("/models")
async def get_available_models(
        user: UserBase = Depends(auth_current_user)
):
    """获取可用的AI模型列表"""
    available_models = AIModelFactory.get_available_models()

    models = [
        {
            "id": model_data["id"],
            "name": model_data["name"],
            "description": model_data["description"]
        }
        for model_data in available_models.values()
    ]

    return {
        "models": models,
        "default": AIModelFactory.get_default_model()
    }
