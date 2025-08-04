from fastapi import APIRouter, HTTPException, Depends

from app.services.doc_vector.model_manager_svc import (
    download_model_for_offline_use,
    check_model_availability,
    delete_local_model
)
from app.core.dependencies import auth_admin_user
from app.models.admin import Admin

router = APIRouter(tags=["管理员端-模型管理"])

@router.post("/download_model")
async def download_embedding_model(
    current_user: Admin = Depends(auth_admin_user)
):
    """下载嵌入模型到本地，支持离线使用"""
    try:
        success = await download_model_for_offline_use()
        if success:
            return {"message": "模型下载成功，现在可以离线使用"}
        else:
            raise HTTPException(status_code=500, detail="模型下载失败")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"模型下载失败: {str(e)}")

@router.get("/model_status")
async def get_model_status():
    """获取模型状态"""
    try:
        status = await check_model_availability()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取模型状态失败: {str(e)}")

@router.delete("/local_model")
async def remove_local_model(
    current_user: Admin = Depends(auth_admin_user)
):
    """删除本地模型"""
    try:
        success = await delete_local_model()
        if success:
            return {"message": "本地模型已删除"}
        else:
            return {"message": "本地模型不存在"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除本地模型失败: {str(e)}")