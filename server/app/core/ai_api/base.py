"""
AI 模型调用基础类
"""
import json
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, AsyncGenerator
from dataclasses import dataclass
from httpx import AsyncClient
import asyncio


@dataclass
class AIModelResponse:
    """AI 模型响应数据类"""
    content: str
    model: str
    usage: Optional[Dict[str, Any]] = None
    finish_reason: Optional[str] = None


class AIModelBase(ABC):
    """AI 模型调用基础抽象类"""

    def __init__(self, api_key: str, base_url: str, model_name: str):
        self.api_key = api_key
        self.base_url = base_url
        self.model_name = model_name
        self.display_name = self._get_display_name()

    @abstractmethod
    def _get_display_name(self) -> str:
        """获取模型显示名称"""
        pass

    @abstractmethod
    def _prepare_headers(self) -> Dict[str, str]:
        """准备请求头"""
        pass

    @abstractmethod
    def _prepare_payload(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """准备请求负载"""
        pass

    @abstractmethod
    def _parse_response(self, response_data: Dict[str, Any]) -> AIModelResponse:
        """解析响应数据"""
        pass

    async def call_with_retry(
        self,
        messages: List[Dict[str, str]],
        max_retries: int = 3,
        timeout: int = 300,
        **kwargs
    ) -> AIModelResponse:
        """
        带重试机制的 AI 模型调用

        Args:
            messages: 消息列表
            max_retries: 最大重试次数
            timeout: 超时时间（秒）
            **kwargs: 其他参数

        Returns:
            AIModelResponse: AI 模型响应

        Raises:
            Exception: 调用失败时抛出异常
        """
        last_exception = None

        for attempt in range(max_retries + 1):
            try:
                return await self._make_request(messages, timeout, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < max_retries:
                    wait_time = 2 ** attempt  # 指数退避
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    break

        raise Exception(f"{self.display_name} API调用失败: {str(last_exception)}")

    async def _make_request(
        self,
        messages: List[Dict[str, str]],
        timeout: int,
        **kwargs
    ) -> AIModelResponse:
        """
        发起实际的 API 请求

        Args:
            messages: 消息列表
            timeout: 超时时间
            **kwargs: 其他参数

        Returns:
            AIModelResponse: AI 模型响应
        """
        headers = self._prepare_headers()
        payload = self._prepare_payload(messages, **kwargs)

        async with AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                raise Exception(f"HTTP {response.status_code}: {response.text}")

            response_data = response.json()
            return self._parse_response(response_data)

    async def call_with_retry_stream(
            self,
            messages: List[Dict[str, str]],
            max_retries: int = 3,
            timeout: int = 300,
            **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        带重试机制的流式 AI 模型调用

        Args:
            messages: 消息列表
            max_retries: 最大重试次数
            timeout: 超时时间（秒）
            **kwargs: 其他参数

        Yields:
            str: 流式响应的文本块

        Raises:
            Exception: 调用失败时抛出异常
        """
        last_exception = None

        for attempt in range(max_retries + 1):
            try:
                async for chunk in self._make_stream_request(messages, timeout, **kwargs):
                    yield chunk
                return
            except Exception as e:
                last_exception = e
                if attempt < max_retries:
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    break

        raise Exception(f"{self.display_name} 流式API调用失败: {str(last_exception)}")

    async def _make_stream_request(
            self,
            messages: List[Dict[str, str]],
            timeout: int,
            **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        发起流式 API 请求

        Args:
            messages: 消息列表
            timeout: 超时时间
            **kwargs: 其他参数

        Yields:
            str: 响应文本块
        """
        headers = self._prepare_headers()
        payload = self._prepare_payload(messages, stream=True, **kwargs)

        async with AsyncClient(timeout=timeout) as client:
            async with client.stream(
                    "POST",
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
            ) as response:

                if response.status_code != 200:
                    raise Exception(f"HTTP {response.status_code}: {await response.aread()}")

                async for line in response.aiter_lines():
                    if line.strip():
                        if line.startswith("data: "):
                            data_str = line[6:]  # 移除 "data: " 前缀

                            if data_str.strip() == "[DONE]":
                                break

                            try:
                                data = json.loads(data_str)
                                content = self._parse_stream_chunk(data)
                                if content:
                                    yield content
                            except json.JSONDecodeError:
                                continue

    @abstractmethod
    def _parse_stream_chunk(self, chunk_data: Dict[str, Any]) -> Optional[str]:
        """解析流式响应数据块"""
        pass