"""
Kimi 专用的 PPT 大纲生成模块
直接返回JSON数据，不进行格式转换
"""
import asyncio
import json
from typing import Dict, List, Any

from openai import OpenAI

from app.config import KIMI_API_KEY
from app.core.logger import setup_logger
from app.schemas.teacher.ppt_generator_sch import PPTGenerationRequest

logger = setup_logger("kimi_ppt_generator")


class KimiPPTGenerator:
    """Kimi专用的PPT生成器"""

    def __init__(self):
        self.client = OpenAI(
            api_key=KIMI_API_KEY,
            base_url="https://api.moonshot.cn/v1"
        )
        self.model_name = "kimi-k2-turbo-preview"

    def _build_structured_ppt_prompt(self, request: PPTGenerationRequest) -> str:
        """构建生成结构化PPT内容的提示词"""
        return f"""你是一位经验丰富的教师和课件专家，请为以下教学内容设计一个详细且内容丰富的PPT结构化数据:

标题: {request.title}
学科: {request.subject}
目标年级: {request.target_grade}
教学目标: {request.teaching_target}
教学重点: {', '.join(request.key_points)}
幻灯片数量: {request.slide_count}
{f"其他信息: {request.additional_info}" if request.additional_info else ""}

请生成{request.slide_count}张幻灯片的结构化数据，每张幻灯片包含以下字段：
- slide_number: 幻灯片序号（1开始）
- slide_type: 幻灯片类型（"cover"=封面、"objective"=学习目标、"content"=内容讲解、"example"=示例代码、"exercise"=练习活动、"summary"=总结）
- title: 幻灯片标题
- main_content: 主要内容（**控制在100字以内**）
- bullet_points: 要点列表（数组格式，每项30字以内，最多3个）
- code_example: 示例代码（简洁版本）
- exercise_content: 练习内容（如果是练习类型幻灯片）
- key_takeaways: 关键要点（数组格式，每项30字以内，最多3个）
- teacher_notes: 教师备注（**控制在50字以内**）

**重要要求**：
1. **内容必须精简**：每个字段内容都要简短
2. **确保JSON格式完整**：所有括号和引号都要正确闭合
3. **生成完整的{request.slide_count}张幻灯片**
4. 每个字段都要有内容，如果某字段不适用则填入空字符串或空数组

请以JSON数组格式返回，只返回JSON数据，不要有其他说明文字。

示例格式：
[
  {{
    "slide_number": 1,
    "slide_type": "cover",
    "title": "课程标题",
    "main_content": "简短的课程简介",
    "bullet_points": ["要点1", "要点2"],
    "code_example": "",
    "exercise_content": "",
    "key_takeaways": ["关键点1", "关键点2"],
    "teacher_notes": "简短备注"
  }}
]"""

    async def _call_ai_with_retry(self, messages: List[Dict], max_retries: int = 3, timeout: int = 180) -> str:
        """带重试机制的AI API调用"""
        last_exception = None

        for attempt in range(max_retries):
            try:
                logger.info(f"正在调用Kimi接口... (尝试 {attempt + 1}/{max_retries})")

                # 根据幻灯片数量动态调整token数量
                slide_count = 10  # 默认值
                for msg in messages:
                    if "幻灯片数量:" in msg.get("content", ""):
                        try:
                            content = msg["content"]
                            start = content.find("幻灯片数量:") + len("幻灯片数量:")
                            end = content.find("\n", start)
                            if end == -1:
                                end = len(content)
                            slide_count = int(content[start:end].strip())
                        except:
                            pass

                # 保守的max_tokens设置
                max_tokens = min(max(slide_count * 800, 4096), 16384)

                response = await asyncio.to_thread(
                    self.client.chat.completions.create,
                    model=self.model_name,
                    messages=messages,
                    temperature=0.3,
                    max_tokens=max_tokens,
                    stream=False,
                    timeout=timeout
                )

                content = response.choices[0].message.content.strip()

                if content:
                    logger.info(f"Kimi接口调用成功 (尝试 {attempt + 1})")
                    return content
                else:
                    raise Exception("Kimi返回空内容")

            except Exception as e:
                last_exception = e
                logger.warning(f"第{attempt + 1}次Kimi调用失败: {str(e)}")

                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt
                    logger.info(f"等待{wait_time}秒后重试...")
                    await asyncio.sleep(wait_time)

        raise Exception(f"Kimi调用失败，已重试{max_retries}次。最后错误: {str(last_exception)}")

    async def generate_ppt_json(self, request: PPTGenerationRequest, staff_id: str) -> List[Dict[str, Any]]:
        """
        使用Kimi模型生成PPT的JSON结构化数据

        Args:
            request: PPT生成请求
            staff_id: 教师工号

        Returns:
            List[Dict[str, Any]]: PPT幻灯片的JSON数据列表

        Raises:
            Exception: 当生成失败时
        """
        logger.info(f"开始使用Kimi生成PPT JSON数据: 标题={request.title}, 幻灯片数={request.slide_count}")

        try:
            # 构建提示词
            prompt = self._build_structured_ppt_prompt(request)

            # 准备消息
            messages = [{"role": "user", "content": prompt}]

            # 调用AI接口
            ai_response = await self._call_ai_with_retry(
                messages=messages,
                max_retries=3,
                timeout=180
            )

            # 清理和解析JSON
            cleaned_content = ai_response.strip()
            if cleaned_content.startswith('```json'):
                cleaned_content = cleaned_content[7:]
            if cleaned_content.startswith('```'):
                cleaned_content = cleaned_content[3:]
            if cleaned_content.endswith('```'):
                cleaned_content = cleaned_content[:-3]

            # 解析JSON
            slides_data = json.loads(cleaned_content)

            if not isinstance(slides_data, list):
                raise Exception("返回的数据不是数组格式")

            if len(slides_data) != request.slide_count:
                logger.warning(f"生成的幻灯片数量({len(slides_data)})与请求数量({request.slide_count})不符")

            logger.info(f"成功生成{len(slides_data)}张幻灯片的JSON数据")
            return slides_data

        except json.JSONDecodeError as e:
            logger.error(f"JSON解析失败: {str(e)}")
            logger.error(f"原始响应: {ai_response[:500]}...")
            raise Exception(f"Kimi返回的数据格式错误，无法解析: {str(e)}")
        except Exception as e:
            logger.error(f"Kimi生成PPT JSON失败: {str(e)}")
            raise Exception(f"Kimi生成PPT JSON失败: {str(e)}")


# 创建全局实例
kimi_ppt_generator = KimiPPTGenerator()


# 便捷的调用函数
async def generate_ppt_json_with_kimi(request: PPTGenerationRequest, staff_id: str) -> List[Dict[str, Any]]:
    """使用Kimi模型生成PPT JSON数据的便捷函数"""
    return await kimi_ppt_generator.generate_ppt_json(request, staff_id)