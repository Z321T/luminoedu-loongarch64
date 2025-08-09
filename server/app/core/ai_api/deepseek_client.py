"""
DeepSeek AI 模型客户端
"""

from typing import List, Dict, Any, Optional
from .base import AIModelBase, AIModelResponse


class DeepSeekClient(AIModelBase):
    """DeepSeek AI 模型客户端"""

    def __init__(self, api_key: str, model_name: str = "deepseek-chat"):
        super().__init__(
            api_key=api_key,
            base_url="https://api.deepseek.com",
            model_name=model_name
        )

    def _get_display_name(self) -> str:
        """获取模型显示名称"""
        return "DeepSeek"

    def _prepare_headers(self) -> Dict[str, str]:
        """准备请求头"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

    def _prepare_payload(self, messages: List[Dict[str, str]], stream: bool = False, **kwargs) -> Dict[str, Any]:
        """准备请求负载"""
        payload = {
            "model": self.model_name,
            "messages": messages,
            "stream": stream
        }

        # 添加可选参数
        if "temperature" in kwargs:
            payload["temperature"] = kwargs["temperature"]
        if "max_tokens" in kwargs:
            payload["max_tokens"] = kwargs["max_tokens"]
        if "top_p" in kwargs:
            payload["top_p"] = kwargs["top_p"]

        return payload

    def _parse_stream_chunk(self, chunk_data: Dict[str, Any]) -> Optional[str]:
        """解析流式响应数据块"""
        try:
            if "choices" in chunk_data and chunk_data["choices"]:
                delta = chunk_data["choices"][0].get("delta", {})
                return delta.get("content", "")
        except (KeyError, IndexError):
            pass
        return None

    def _parse_response(self, response_data: Dict[str, Any]) -> AIModelResponse:
        """解析响应数据"""
        try:
            content = response_data["choices"][0]["message"]["content"]
            usage = response_data.get("usage")
            finish_reason = response_data["choices"][0].get("finish_reason")

            return AIModelResponse(
                content=content,
                model=self.display_name,
                usage=usage,
                finish_reason=finish_reason
            )
        except (KeyError, IndexError) as e:
            raise Exception(f"DeepSeek API响应格式错误: {str(e)}")