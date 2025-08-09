"""
AI 模型工厂类
"""

from typing import Dict, Type, Optional
from .base import AIModelBase
from .deepseek_client import DeepSeekClient
from .kimi_client import KimiClient
from app.config import DEEPSEEK_API_KEY, KIMI_API_KEY


class AIModelFactory:
    """AI 模型工厂类"""

    # 注册可用的模型类
    _model_classes: Dict[str, Type[AIModelBase]] = {
        "deepseek": DeepSeekClient,
        "kimi": KimiClient,
    }

    # 模型配置信息
    _model_configs = {
        "deepseek": {
            "api_key": DEEPSEEK_API_KEY,
            "model_name": "deepseek-chat",
            "display_name": "DeepSeek",
            "description": "deepseek-chat"
        },
        "kimi": {
            "api_key": KIMI_API_KEY,
            "model_name": "kimi-k2-turbo-preview",
            "display_name": "Kimi",
            "description": "kimi-k2-turbo-preview"
        }
    }

    @classmethod
    def create_client(cls, model_id: str) -> AIModelBase:
        """
        创建 AI 模型客户端

        Args:
            model_id: 模型ID

        Returns:
            AIModelBase: AI 模型客户端实例

        Raises:
            ValueError: 不支持的模型ID
            Exception: 创建客户端失败
        """
        if model_id not in cls._model_classes:
            raise ValueError(f"不支持的模型: {model_id}")

        config = cls._model_configs[model_id]
        api_key = config["api_key"]

        if not api_key:
            raise Exception(f"{config['display_name']} API密钥未配置")

        model_class = cls._model_classes[model_id]

        try:
            return model_class(
                api_key=api_key,
                model_name=config["model_name"]
            )
        except Exception as e:
            raise Exception(f"创建{config['display_name']}客户端失败: {str(e)}")

    @classmethod
    def get_available_models(cls) -> Dict[str, Dict[str, str]]:
        """
        获取可用的模型列表

        Returns:
            Dict: 可用模型配置
        """
        available_models = {}

        for model_id, config in cls._model_configs.items():
            if config["api_key"]:  # 只返回已配置API密钥的模型
                available_models[model_id] = {
                    "id": model_id,
                    "name": config["display_name"],
                    "description": config["description"]
                }

        return available_models

    @classmethod
    def get_default_model(cls) -> str:
        """
        获取默认模型ID

        Returns:
            str: 默认模型ID
        """
        # 优先使用 kimi，如果不可用则使用 deepseek
        if "kimi" in cls.get_available_models():
            return "kimi"
        elif "deepseek" in cls.get_available_models():
            return "deepseek"
        else:
            raise Exception("没有可用的AI模型，请检查API密钥配置")

    @classmethod
    def register_model(
        cls,
        model_id: str,
        model_class: Type[AIModelBase],
        config: Dict[str, str]
    ):
        """
        注册新的模型类

        Args:
            model_id: 模型ID
            model_class: 模型类
            config: 模型配置
        """
        cls._model_classes[model_id] = model_class
        cls._model_configs[model_id] = config