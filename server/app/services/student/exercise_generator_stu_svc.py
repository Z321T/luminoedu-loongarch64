import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import HTTPException
from openai import OpenAI

from app.config import DEEPSEEK_API_KEY, MEDIA_ROOT
from app.core.logger import setup_logger
from app.models.exercise import ExerciseType
from app.services.doc_vector.document_vectorization_svc import (
    retrieve_document_context,
    get_document_info
)

logger = setup_logger("student_exercise_generator_service")

# 学生文件保存目录
STUDENT_EXERCISES_BASE_DIR = Path(MEDIA_ROOT) / "student_exercises"
STUDENT_JSON_DIR = STUDENT_EXERCISES_BASE_DIR / "json"
STUDENT_MD_DIR = STUDENT_EXERCISES_BASE_DIR / "md"

# 创建必要的目录
STUDENT_JSON_DIR.mkdir(parents=True, exist_ok=True)
STUDENT_MD_DIR.mkdir(parents=True, exist_ok=True)


def _get_ai_client() -> OpenAI:
    """获取AI客户端"""
    return OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com"
    )


async def _extract_knowledge_points_from_student_document(
    student_id: str,
    document_id: str,
    count: int
) -> List[str]:
    """
    从学生文档中提取知识点
    """
    try:
        # 学生文档使用 student_ 前缀
        staff_id = f"student_{student_id}"

        doc_info = await get_document_info(staff_id, document_id)
        if not doc_info:
            logger.warning(f"未找到学生文档: {document_id}")
            return []

        knowledge_queries = [
            "重要概念 定义 原理",
            "关键知识点 要点",
            "核心内容 主要内容",
            "基本概念 基础知识"
        ]

        all_contexts = []
        for query in knowledge_queries:
            contexts = await retrieve_document_context(
                staff_id=staff_id,
                document_id=document_id,
                query=query,
                n_results=max(2, count // len(knowledge_queries))
            )
            all_contexts.extend(contexts)

        unique_contexts = []
        seen = set()
        for context in all_contexts:
            key = context[:50]
            if key not in seen and len(context.strip()) > 20:
                seen.add(key)
                unique_contexts.append(context)
                if len(unique_contexts) >= count * 2:
                    break

        logger.info(f"从学生文档{document_id}提取到{len(unique_contexts)}个知识点片段")
        return unique_contexts[:count * 2]

    except Exception as e:
        logger.error(f"从学生文档提取知识点失败: {str(e)}")
        return []


def _build_student_enhanced_prompt(
    content: str,
    types: List[ExerciseType],
    count: int,
    knowledge_contexts: List[str] = None
) -> str:
    """
    构建学生专用的增强提示词
    """
    types_desc = []
    for t in types:
        if t == ExerciseType.CHOICE:
            types_desc.append("选择题（包含4个选项）")
        elif t == ExerciseType.FILL_BLANK:
            types_desc.append("填空题")
        elif t == ExerciseType.SHORT_ANSWER:
            types_desc.append("简答题")

    type_str = "、".join(types_desc)

    knowledge_section = ""
    if knowledge_contexts:
        knowledge_section = f"""
参考知识点（请基于这些内容生成习题）：
{chr(10).join([f"{i + 1}. {ctx[:200]}..." if len(ctx) > 200 else f"{i + 1}. {ctx}" for i, ctx in enumerate(knowledge_contexts[:5])])}
"""

    base_content_section = ""
    if content:
        base_content_section = f"""
学习内容：
{content}
"""

    return f"""请根据以下学习材料生成{count}道适合学生练习的{type_str}。

{knowledge_section}
{base_content_section}

生成要求：
1. 题目难度适中，适合学生自主练习
2. 选择题的选项要有合理的干扰项，避免过于简单
3. 答案要准确，解析要详细易懂
4. 题目要有助于巩固学习内容
5. 如果有参考知识点，优先基于这些内容生成

每道题目需要包含：
- title: 题目标题（简短概括）
- content: 完整的题目内容
- type: 题目类型（1=选择题, 2=填空题, 3=简答题）
- options: 选择题的选项（A、B、C、D四个选项）
- answer: 正确答案
- explanation: 详细的答案解析，要通俗易懂
- knowledge_source: 基于的知识点内容（如果使用了参考知识点）

请以JSON格式返回，格式如下：
[
  {{
    "title": "题目标题",
    "content": "完整的题目内容",
    "type": 1,
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "answer": "正确答案",
    "explanation": "详细解析",
    "knowledge_source": "基于的知识点内容"
  }}
]

只返回JSON数据，不要有其他说明文字。"""


async def _call_ai_api(prompt: str) -> str:
    """调用AI API生成习题"""
    logger.info("开始调用AI API生成学生习题")
    try:
        client = _get_ai_client()
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": "你是一位专业的教育教学助手，擅长为学生创建适合练习的习题。你会根据学生的学习材料生成难度适中、有助于理解和巩固知识的练习题。"
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            max_tokens=7168,
            stream=False
        )
        logger.info("AI API调用成功")
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"AI API调用失败: {str(e)}")
        raise Exception(f"AI API调用失败: {str(e)}")


def _parse_response(response: str) -> List[Dict[str, Any]]:
    """解析AI响应为习题数据"""
    logger.info("开始解析AI返回的学生习题数据")
    try:
        json_match = re.search(r'\[\s*\{.*\}\s*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            result = json.loads(json_str)

            cleaned_result = []
            for exercise in result:
                if isinstance(exercise, dict) and "content" in exercise and "answer" in exercise:
                    exercise.setdefault("title", "练习题目")
                    exercise.setdefault("type", 1)
                    exercise.setdefault("explanation", "")
                    exercise.setdefault("knowledge_source", "")

                    if exercise.get("type") == 1 and not exercise.get("options"):
                        exercise["options"] = ["选项A", "选项B", "选项C", "选项D"]

                    cleaned_result.append(exercise)

            logger.info(f"成功解析学生习题数据，共 {len(cleaned_result)} 条记录")
            return cleaned_result

        logger.warning("未找到有效的JSON数据格式")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"解析学生习题数据失败: {str(e)}")
        return []



def _generate_student_markdown(exercises_data: List[Dict[str, Any]], title: str) -> str:
    """生成学生专用的Markdown格式习题内容"""
    logger.info(f"开始生成学生Markdown格式习题，标题: {title}")
    md_lines = [
        f"# {title}",
        f"",
        f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"**题目数量**: {len(exercises_data)}",
        f"**练习提示**: 请认真思考每道题目，可以先尝试回答，再查看答案和解析",
        f"",
        "---",
        "",
        "## 练习题目",
        ""
    ]

    for i, exercise in enumerate(exercises_data, 1):
        exercise_type_map = {1: "选择题", 2: "填空题", 3: "简答题"}
        exercise_type = exercise_type_map.get(exercise.get("type"), "未知类型")

        md_lines.append(f"### 第 {i} 题 - {exercise.get('title', f'题目{i}')} ({exercise_type})")
        md_lines.append("")
        md_lines.append(f"**题目**: {exercise.get('content', '')}")
        md_lines.append("")

        if exercise.get("type") == 1 and exercise.get("options"):
            md_lines.append("**选项**:")
            for j, option in enumerate(exercise.get("options", [])):
                option_letter = chr(65 + j)
                md_lines.append(f"- **{option_letter}**. {option}")
            md_lines.append("")

        if exercise.get("knowledge_source"):
            md_lines.append("**相关知识点**:")
            md_lines.append(f"> {exercise['knowledge_source'][:150]}...")
            md_lines.append("")

        md_lines.append("<details>")
        md_lines.append("<summary>点击查看答案和解析 </summary>")
        md_lines.append("")
        md_lines.append(f"**正确答案**: {exercise.get('answer', '')}")
        if exercise.get("explanation"):
            md_lines.append("")
            md_lines.append(f"**详细解析**: {exercise.get('explanation', '')}")
        md_lines.append("")
        md_lines.append("</details>")
        md_lines.append("")
        md_lines.append("---")
        md_lines.append("")

    md_lines.append("## 学习小贴士 ")
    md_lines.append("")
    md_lines.append("- 如果答错了题目，建议重新阅读相关知识点")
    md_lines.append("- 可以尝试用自己的话解释答案")
    md_lines.append("- 遇到不懂的地方，可以寻求老师或同学的帮助")
    md_lines.append("")

    logger.info("学生Markdown格式习题内容生成完成")
    return "\n".join(md_lines)



async def generate_student_exercises(
    content: Optional[str],
    student_id: str,
    title: str = "我的练习题",
    count: int = 5,
    types: List[ExerciseType] = None,
    document_id: Optional[str] = None,
    use_knowledge_matching: bool = True,
) -> Dict[str, Any]:
    """
    学生生成习题主函数
    """
    if not types:
        types = [ExerciseType.CHOICE, ExerciseType.FILL_BLANK]

    # 学生限制最多生成10道题
    if count > 10:
        count = 10

    logger.info(f"学生(学号:{student_id})开始生成习题: 标题={title}, 数量={count}, 文档ID={document_id}")

    knowledge_contexts = []
    if document_id and use_knowledge_matching:
        logger.info(f"开始从学生文档{document_id}提取知识点")
        knowledge_contexts = await _extract_knowledge_points_from_student_document(
            student_id, document_id, count
        )

    if not content and not knowledge_contexts:
        raise HTTPException(
            status_code=400,
            detail="请提供学习内容或选择一个已上传的文档"
        )

    prompt = _build_student_enhanced_prompt(content, types, count, knowledge_contexts)

    try:
        response_text = await _call_ai_api(prompt)
        exercises_data = _parse_response(response_text)

        if not exercises_data:
            raise Exception("AI未能生成有效的习题数据")

        logger.info(f"成功生成 {len(exercises_data)} 道学生习题")

        for i, exercise in enumerate(exercises_data):
            exercise["order"] = (i + 1) * 10
            if exercise.get("knowledge_source") and len(exercise["knowledge_source"]) > 300:
                exercise["knowledge_source"] = exercise["knowledge_source"][:300] + "..."

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_title = re.sub(r'[^\w\s-]', '', title).strip()[:50]
        filename = f"student_{student_id}_{timestamp}_{safe_title}"

        json_path = STUDENT_JSON_DIR / f"{filename}.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(exercises_data, f, ensure_ascii=False, indent=2)
        logger.info(f"学生习题JSON数据已保存: {json_path}")

        md_content = _generate_student_markdown(exercises_data, title)
        md_path = STUDENT_MD_DIR / f"{filename}.md"
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md_content)
        logger.info(f"学生习题Markdown文件已保存: {md_path}")

        return {
            "md_filename": md_path.name,
            "json_filename": json_path.name,
            "timestamp": timestamp,
            "title": title,
            "student_id": student_id,
            "exercises_count": len(exercises_data),
            "document_id": document_id,
            "used_knowledge_matching": use_knowledge_matching and bool(knowledge_contexts)
        }

    except Exception as e:
        logger.error(f"学生习题生成过程中发生错误: {str(e)}")
        raise HTTPException(status_code=500, detail=f"习题生成失败: {str(e)}")



async def get_student_exercise_file_content_service(file_name: str, student_id: str) -> str:
    """获取学生习题文件的Markdown内容"""
    if not file_name.startswith(f"student_{student_id}_"):
        logger.warning(f"权限拒绝: 学生{student_id}尝试访问非本人文件: {file_name}")
        raise HTTPException(status_code=403, detail="您无权访问此文件")

    if not file_name.endswith(".md"):
        logger.warning(f"文件类型错误: 文件不是 Markdown 格式 '{file_name}'")
        raise HTTPException(status_code=400, detail="只支持查看 Markdown 格式的文件")

    file_path = STUDENT_MD_DIR / file_name

    if not file_path.exists():
        logger.warning(f"文件读取失败: 文件不存在 '{file_path}'")
        raise HTTPException(status_code=404, detail="文件不存在")

    try:
        with file_path.open("r", encoding="utf-8") as f:
            content = f.read()
        return content
    except Exception as e:
        logger.error(f"读取学生习题文件失败: {str(e)}", exc_info=True)
        raise Exception(f"读取文件失败: {str(e)}")



async def download_student_exercise_file_service(file_name: str, student_id: str) -> Path:
    """处理学生习题文件下载的权限验证和文件检查"""
    if not file_name.startswith(f"student_{student_id}_"):
        logger.warning(f"权限拒绝: 学生{student_id}尝试下载非本人文件: {file_name}")
        raise HTTPException(status_code=403, detail="您无权下载此文件")

    if file_name.endswith(".md"):
        file_path = STUDENT_MD_DIR / file_name
    elif file_name.endswith(".json"):
        file_path = STUDENT_JSON_DIR / file_name
    else:
        raise HTTPException(status_code=400, detail="不支持的文件类型")

    if not file_path.exists():
        logger.warning(f"文件下载失败: 文件不存在 '{file_path}'")
        raise HTTPException(status_code=404, detail="文件不存在")

    return file_path



async def list_student_generated_exercises_service(
    student_id: str,
    limit: int = 50,
    title_filter: Optional[str] = None
) -> Dict[str, List[Dict[str, Any]]]:
    """列出学生生成的习题文件"""
    if not STUDENT_MD_DIR.exists():
        logger.warning(f"学生(学号:{student_id})查询习题目录不存在: {STUDENT_MD_DIR}")
        return {"exercises": []}

    files = list(STUDENT_MD_DIR.glob(f"student_{student_id}_*.md"))

    if title_filter:
        files = [f for f in files if title_filter.lower() in f.name.lower()]

    files = sorted(files, key=lambda x: x.stat().st_mtime, reverse=True)[:limit]

    result = []
    for file in files:
        result.append({
            "filename": file.name,
            "created_at": datetime.fromtimestamp(file.stat().st_mtime).isoformat(),
            "size_kb": round(file.stat().st_size / 1024, 2)
        })

    return {"exercises": result}



async def delete_student_exercise_file_service(file_name: str, student_id: str) -> None:
    """删除学生习题文件，包含权限验证"""
    if not file_name.startswith(f"student_{student_id}_"):
        logger.warning(f"权限拒绝: 学生{student_id}尝试删除非本人文件: {file_name}")
        raise HTTPException(status_code=403, detail="您无权删除此文件")

    if file_name.endswith(".md"):
        file_path = STUDENT_MD_DIR / file_name
        json_file_name = file_name[:-3] + ".json"
        json_file_path = STUDENT_JSON_DIR / json_file_name
    else:
        raise HTTPException(status_code=400, detail="不支持的文件类型")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="文件不存在")

    try:
        file_path.unlink()
        logger.info(f"学生md文件已删除: {file_path}")
        if json_file_path and json_file_path.exists():
            json_file_path.unlink()
            logger.info(f"学生关联JSON文件已删除: {json_file_path}")
    except Exception as e:
        logger.error(f"删除学生文件失败: {str(e)}")
        raise Exception(f"删除文件失败: {str(e)}")