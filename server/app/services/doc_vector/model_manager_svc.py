import os
import shutil
from pathlib import Path

from app.config import MEDIA_ROOT
from app.core.logger import setup_logger

logger = setup_logger("model_management_service")

MODELS_PATH = Path(MEDIA_ROOT) / "models"

async def download_model_for_offline_use(model_name: str = "paraphrase-multilingual-MiniLM-L12-v2") -> bool:
    """
    下载模型到本地，供离线使用

    Args:
        model_name: 模型名称

    Returns:
        下载是否成功
    """
    try:
        import sentence_transformers

        # 设置模型缓存目录
        cache_dir = MODELS_PATH / "sentence-transformer"
        cache_dir.mkdir(parents=True, exist_ok=True)

        os.environ['SENTENCE_TRANSFORMERS_HOME'] = str(MODELS_PATH)

        logger.info(f"开始下载模型: {model_name}")

        # 下载并加载模型
        model = sentence_transformers.SentenceTransformer(model_name)

        # 保存模型到指定目录
        model.save(str(cache_dir))

        logger.info(f"模型下载完成，保存至: {cache_dir}")
        return True

    except Exception as e:
        logger.error(f"模型下载失败: {str(e)}")
        return False

async def check_model_availability() -> dict:
    """检查模型可用性"""
    local_model_path = MODELS_PATH / "sentence-transformer"

    return {
        "has_local_model": local_model_path.exists(),
        "local_model_path": str(local_model_path),
        "can_use_offline": local_model_path.exists(),
        "fallback_available": True  # DefaultEmbeddingFunction 总是可用
    }

async def delete_local_model() -> bool:
    """删除本地模型以释放空间"""
    try:
        local_model_path = MODELS_PATH / "sentence-transformer"
        if local_model_path.exists():
            shutil.rmtree(local_model_path)
            logger.info("本地模型已删除")
            return True
        return False
    except Exception as e:
        logger.error(f"删除本地模型失败: {str(e)}")
        return False