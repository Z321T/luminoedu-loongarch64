import json
from datetime import datetime
from typing import Dict, List, Optional, Any

from fastapi import HTTPException

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

from app.config import SERVER_DIR
from app.core.logger import setup_logger

from app.core.ai_api.kimi.kimi_ppt import generate_ppt_json_with_kimi
from app.core.ai_api.deepseek.deepseek_ppt import generate_ppt_json_with_deepseek
from app.schemas.teacher.ppt_generator_sch import (
    PPTGenerationRequest, PPTGenerationResponse, PPTSlide,
    PPTOutlineResponse, PPTGenerationFromOutlineRequest
)

# 设置日志
logger = setup_logger("ppt_generator_service")

# PPT文件存储目录
PPT_FILES_DIR = SERVER_DIR / "app" / "documents" / "ppt_files"
PPT_OUTLINE_MD_DIR = SERVER_DIR / "app" / "documents" / "ppt_outlines" / "markdown"
PPT_OUTLINE_JSON_DIR = SERVER_DIR / "app" / "documents" / "ppt_outlines" / "json"
PPT_FILES_DIR.mkdir(exist_ok=True, parents=True)
PPT_OUTLINE_MD_DIR.mkdir(exist_ok=True, parents=True)
PPT_OUTLINE_JSON_DIR.mkdir(exist_ok=True, parents=True)



def _convert_json_to_markdown(slides_data: List[Dict[str, Any]]) -> str:
    """将结构化JSON数据转换为Markdown格式"""
    md_lines = []

    for slide in slides_data:
        slide_num = slide.get("slide_number", 1)
        slide_type = slide.get("slide_type", "content")
        title = slide.get("title", "")

        # 幻灯片分隔和标题
        md_lines.append(f"# 幻灯片 {slide_num}")
        md_lines.append(f"## {title}")
        md_lines.append("")

        # 主要内容
        main_content = slide.get("main_content", "")
        if main_content:
            md_lines.append("### 主要内容")
            md_lines.append(main_content)
            md_lines.append("")

        # 要点列表
        bullet_points = slide.get("bullet_points", [])
        if bullet_points:
            md_lines.append("### 要点")
            for point in bullet_points:
                md_lines.append(f"- {point}")
            md_lines.append("")

        # 示例代码
        code_example = slide.get("code_example", "")
        if code_example:
            md_lines.append("### 示例代码")
            md_lines.append("```")
            md_lines.append(code_example)
            md_lines.append("```")
            md_lines.append("")

        # 练习内容
        exercise_content = slide.get("exercise_content", "")
        if exercise_content:
            md_lines.append("### 练习")
            md_lines.append(exercise_content)
            md_lines.append("")

        # 关键要点
        key_takeaways = slide.get("key_takeaways", [])
        if key_takeaways:
            md_lines.append("### 关键要点")
            for takeaway in key_takeaways:
                md_lines.append(f"- **{takeaway}**")
            md_lines.append("")

        # 教师备注
        teacher_notes = slide.get("teacher_notes", "")
        if teacher_notes:
            md_lines.append("## 教师备注")
            md_lines.append(teacher_notes)
            md_lines.append("")

        md_lines.append("---")
        md_lines.append("")

    return "\n".join(md_lines)



async def generate_ppt_outline(request: PPTGenerationRequest, staff_id: str) -> PPTOutlineResponse:
    """
    生成PPT的结构化JSON数据，然后转换为Markdown格式大纲
    """
    logger.info(f"开始生成PPT大纲: 标题={request.title}, 模型={request.model.value}")

    try:
        # 将AIModel枚举转换为字符串用于模型工厂
        model_id = request.model.value.lower()  # 如 "KIMI" -> "kimi"

        if model_id == "kimi":
            logger.info("检测到Kimi模型，使用专用生成器")
            # 使用专用的Kimi生成器获取JSON数据
            slides_data = await generate_ppt_json_with_kimi(request, staff_id)
            model_display_name = "Kimi"

        elif model_id == "deepseek":
            logger.info("检测到DeepSeek模型，使用专用生成器")
            slides_data = await generate_ppt_json_with_deepseek(request, staff_id)
            model_display_name = "DeepSeek"

        else:
            # 不支持的模型，抛出错误
            supported_models = ["kimi", "deepseek"]
            raise Exception(f"不支持的模型: {model_id}。当前支持的模型: {', '.join(supported_models)}")

        # 统一的后续处理逻辑
        # 使用服务层的转换函数将JSON转换为Markdown
        md_content = _convert_json_to_markdown(slides_data)

        # 保存文件（使用现有的保存逻辑）
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 保存JSON文件
        json_path = PPT_OUTLINE_JSON_DIR / f"outline_json_{staff_id}_{timestamp}_{request.title}.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(slides_data, f, ensure_ascii=False, indent=2)
        logger.info(f"结构化数据已保存到: {json_path}")

        # 保存Markdown文件
        outline_path = PPT_OUTLINE_MD_DIR / f"outline_md_{staff_id}_{timestamp}_{request.title}.md"
        with open(outline_path, "w", encoding="utf-8") as f:
            f.write(md_content)
        logger.info(f"大纲已保存到: {outline_path}")

        return PPTOutlineResponse(
            title=request.title,
            outline_md=md_content,
            model=model_display_name
        )

    except Exception as e:
        logger.error(f"生成PPT大纲失败: {str(e)}")
        raise Exception(f"生成PPT大纲失败: {str(e)}")



def _try_load_corresponding_json(staff_id: str, title: str) -> Optional[List[Dict[str, Any]]]:
    """尝试加载对应的JSON文件"""
    try:
        # 查找匹配的JSON文件
        pattern = f"outline_json_{staff_id}_*_{title}.json"
        json_files = list(PPT_OUTLINE_JSON_DIR.glob(pattern))

        if json_files:
            # 使用最新的文件
            latest_file = max(json_files, key=lambda f: f.stat().st_mtime)
            with open(latest_file, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        logger.warning(f"加载JSON文件失败: {str(e)}")

    return None



def _convert_json_to_slide_data(json_data: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """将JSON结构化数据转换为幻灯片数据"""
    slides_data = []

    for slide_json in json_data:
        slide_data = {
            "title": slide_json.get("title", ""),
            "content": "",
            "note": slide_json.get("teacher_notes", "")
        }

        # 构建内容
        content_parts = []

        # 主要内容
        main_content = slide_json.get("main_content", "")
        if main_content:
            content_parts.append(main_content)

        # 要点列表
        bullet_points = slide_json.get("bullet_points", [])
        if bullet_points:
            content_parts.append("")  # 空行分隔
            for point in bullet_points:
                content_parts.append(f"• {point}")

        # 示例代码
        code_example = slide_json.get("code_example", "")
        if code_example:
            content_parts.append("")
            content_parts.append("**示例代码：**")
            content_parts.append("```")
            content_parts.append(code_example)
            content_parts.append("```")

        # 练习内容
        exercise_content = slide_json.get("exercise_content", "")
        if exercise_content:
            content_parts.append("")
            content_parts.append("**练习：**")
            content_parts.append(exercise_content)

        # 关键要点
        key_takeaways = slide_json.get("key_takeaways", [])
        if key_takeaways:
            content_parts.append("")
            content_parts.append("**关键要点：**")
            for takeaway in key_takeaways:
                content_parts.append(f"★ {takeaway}")

        slide_data["content"] = "\n".join(content_parts)
        slides_data.append(slide_data)

    return slides_data



async def generate_ppt_from_outline(
        request: PPTGenerationFromOutlineRequest,
        staff_id: str
) -> PPTGenerationResponse:
    """从修改后的大纲生成PPT"""
    logger.info(f"从大纲生成PPT: 标题={request.title}, 教师ID={staff_id}")

    try:
        # 尝试找到对应的JSON文件
        json_data = _try_load_corresponding_json(staff_id, request.title)

        if json_data:
            # 使用JSON数据生成PPT
            slides_data = _convert_json_to_slide_data(json_data)
            logger.info("使用JSON结构化数据生成PPT")
        else:
            # 回退到解析Markdown的方式
            slides_data = parse_markdown_outline(request.outline_md)
            logger.info("使用Markdown解析方式生成PPT")

        # 生成文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"ppt_{staff_id}_{timestamp}_{request.title.replace(' ', '_')}.pptx"

        # 创建PPT文件
        file_path = create_pptx_from_structured_data(slides_data, file_name)

        # 构建返回结果
        slides = [
            PPTSlide(
                title=slide["title"],
                content=slide["content"],
                note=slide.get("note", "")
            )
            for slide in slides_data
        ]

        return PPTGenerationResponse(
            title=request.title,
            slides=slides,
            filename=file_name
        )

    except Exception as e:
        logger.error(f"从大纲生成PPT失败: {str(e)}")
        raise Exception(f"从大纲生成PPT失败: {str(e)}")



def create_pptx_from_structured_data(slides_data: List[Dict[str, str]], file_name: str) -> str:
    """
    基于结构化数据创建PPT文件
    """
    try:
        # 创建演示文稿
        prs = Presentation()
        slide_width = prs.slide_width
        slide_height = prs.slide_height

        for slide_data in slides_data:
            # 新建空白幻灯片
            slide = prs.slides.add_slide(prs.slide_layouts[6])

            # 标题文本框
            left = Inches(0.5)
            top = Inches(0.4)
            width = slide_width - Inches(1)
            height = Inches(1.2)
            title_box = slide.shapes.add_textbox(left, top, width, height)
            title_tf = title_box.text_frame
            title_tf.text = slide_data["title"]
            title_p = title_tf.paragraphs[0]
            title_p.font.size = Pt(32)
            title_p.font.bold = True
            title_p.font.name = "微软雅黑"
            title_p.font.color.rgb = RGBColor(31, 56, 100)
            title_p.alignment = PP_ALIGN.LEFT

            # 内容文本框
            content_top = top + height + Inches(0.2)
            content_height = slide_height - content_top - Inches(0.5)
            content_box = slide.shapes.add_textbox(left, content_top, width, content_height)
            content_tf = content_box.text_frame
            content_tf.word_wrap = True

            # 解析并添加内容
            _parse_and_add_content(slide, content_tf, slide_data["content"], left, content_top, width)

            # 添加备注
            if slide_data.get("note"):
                slide.notes_slide.notes_text_frame.text = slide_data["note"]

        # 保存文件
        file_path = PPT_FILES_DIR / file_name
        prs.save(str(file_path))

        logger.info(f"PPT文件已保存: {file_path}")
        return str(file_path)

    except Exception as e:
        logger.error(f"创建PPT失败: {str(e)}")
        raise Exception(f"创建PPT失败: {str(e)}")



def _parse_and_add_content(slide, content_tf, content: str, left, top, width):
    """解析内容并添加到幻灯片"""
    lines = content.split('\n')
    in_code = False
    code_lines = []
    current_y_offset = 0

    for line in lines:
        line = line.strip()

        # 处理代码块
        if line == '```':
            if in_code:
                # 结束代码块
                if code_lines:
                    current_y_offset += _add_code_block_to_slide(
                        slide, code_lines, left, top + Inches(current_y_offset), width
                    )
                code_lines = []
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line:
            continue

        # 处理不同类型的内容
        if line.startswith('• ') or line.startswith('★ '):
            # 列表项
            p = content_tf.add_paragraph()
            p.text = line[2:]  # 移除符号
            p.level = 0
            p.font.size = Pt(20)
            p.font.name = "微软雅黑"
            if line.startswith('★ '):
                p.font.bold = True
                p.font.color.rgb = RGBColor(200, 50, 50)
        elif line.startswith('**') and line.endswith('**'):
            # 加粗标题
            p = content_tf.add_paragraph()
            p.text = line.replace('**', '')
            p.font.size = Pt(24)
            p.font.bold = True
            p.font.name = "微软雅黑"
            p.font.color.rgb = RGBColor(50, 100, 150)
        else:
            # 普通文本
            p = content_tf.add_paragraph()
            p.text = line
            p.font.size = Pt(20)
            p.font.name = "微软雅黑"



def _add_code_block_to_slide(slide, code_lines: List[str], left, top, width) -> float:
    """在幻灯片上添加代码块并返回占用的高度（英寸）"""
    if not code_lines:
        return 0

    code_text = "\n".join(code_lines)
    # 估算高度
    height = Pt(18) * (len(code_lines) + 1) + Inches(0.3)

    code_box = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, left, top, width, height
    )
    code_box.fill.solid()
    code_box.fill.fore_color.rgb = RGBColor(245, 245, 245)
    code_box.line.color.rgb = RGBColor(200, 200, 200)

    code_tf = code_box.text_frame
    code_tf.word_wrap = True
    code_tf.margin_left = Inches(0.1)
    code_tf.margin_top = Inches(0.1)

    p = code_tf.paragraphs[0]
    p.text = code_text
    p.font.size = Pt(16)
    p.font.name = "Consolas"
    p.font.color.rgb = RGBColor(60, 60, 60)

    # 返回占用的高度（转换为英寸）
    return height / 914400  # EMU到英寸的转换



# 保持原有的parse_markdown_outline函数作为备用
def parse_markdown_outline(outline_md: str) -> List[Dict[str, str]]:
    """解析Markdown大纲为幻灯片数据列表"""
    slides = []
    current_slide = None
    lines = outline_md.strip().split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # 处理幻灯片标题（以 "# 幻灯片" 开头的行）
        if line.startswith('# 幻灯片') or line.startswith('## 幻灯片'):
            # 保存之前处理的幻灯片
            if current_slide:
                slides.append(current_slide)

            # 创建新的幻灯片数据
            current_slide = {"title": "", "content": "", "note": ""}

            # 查找下一行作为标题（通常是 ## 标题）
            if i + 1 < len(lines) and lines[i + 1].strip().startswith('##'):
                current_slide["title"] = lines[i + 1].strip().replace('##', '').strip()
                i += 2  # 跳过标题行
            else:
                # 如果没有独立的标题行，则使用当前行的内容作为标题
                title_parts = line.split('：', 1)
                if len(title_parts) > 1:
                    current_slide["title"] = title_parts[1].strip()
                else:
                    current_slide["title"] = line.replace('#', '').strip()
                i += 1

            continue

        # 处理分隔符
        if line == '---':
            i += 1
            continue

        # 处理备注
        if line.startswith('## 教师备注'):
            # 进入教师备注部分
            i += 1
            while i < len(lines) and not (lines[i].startswith('# ') or lines[i].startswith('## 幻灯片')):
                note_line = lines[i].strip()
                if note_line and not note_line == '---':
                    if current_slide:
                        current_slide["note"] += note_line + "\n"
                i += 1
            continue

        # 处理普通内容
        if current_slide is not None and line:
            current_slide["content"] += line + "\n"

        i += 1

    # 添加最后一个幻灯片
    if current_slide:
        slides.append(current_slide)

    logger.info(f"成功解析出 {len(slides)} 张幻灯片")
    return slides



async def list_ppt_outlines_service(staff_id: str):
    """
    列出教师的所有PPT大纲

    Args:
        staff_id: 教师工号

    Returns:
        包含大纲列表的字典
    """
    outlines = []

    for file_path in PPT_OUTLINE_MD_DIR.glob(f"outline_md_{staff_id}_*.md"):
        try:
            filename = file_path.name
            base_name = filename.rsplit('.', 1)[0]
            parts = base_name.split('_')

            # 修正文件名解析逻辑
            # 文件名格式: outline_md_{staff_id}_{timestamp}_{title}.md
            if len(parts) >= 4:
                # parts[0] = "outline", parts[1] = "md", parts[2] = staff_id, parts[3] = timestamp
                title = '_'.join(parts[4:]) if len(parts) > 4 else "未知标题"
            else:
                title = '未知标题'

            # 读取文件内容
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            outlines.append({
                "filename": filename,
                "title": title,
                "created_at": file_path.stat().st_ctime,
                "preview": content[:50] + ("..." if len(content) > 50 else ""),
            })
        except Exception as e:
            logger.error(f"处理大纲文件 {file_path.name} 失败: {str(e)}")
            continue

    return {"outlines": outlines}



async def download_ppt_outline_service(file_name: str, staff_id: str):
    """
    处理PPT大纲下载的权限验证和文件检查

    Args:
        file_name: 要下载的大纲文件名
        staff_id: 教师工号

    Returns:
        文件路径对象

    Raises:
        HTTPException: 当权限验证失败或文件不存在时
    """
    # 验证文件权限
    if not file_name.startswith(f"outline_md_{staff_id}_"):
        logger.warning(f"教师(工号:{staff_id}) 尝试访问非自己的大纲文件: {file_name}")
        raise HTTPException(status_code=403, detail="没有权限访问此文件")

    file_path = PPT_OUTLINE_MD_DIR / file_name
    if not file_path.exists():
        logger.warning(f"教师(工号:{staff_id}) 请求的大纲文件不存在: {file_name}")
        raise HTTPException(status_code=404, detail="文件不存在")

    return file_path



async def list_ppt_files_service(staff_id: str):
    """
    列出教师的所有PPT文件

    Args:
        staff_id: 教师工号

    Returns:
        包含文件列表的字典
    """
    staff_id_pattern = f"ppt_{staff_id}_"
    files = []

    for file_path in PPT_FILES_DIR.glob("*.pptx"):
        # 只返回当前教师的文件
        if file_path.name.startswith(staff_id_pattern):
            files.append({
                "file_name": file_path.name,
                "size": file_path.stat().st_size,
                "created_at": file_path.stat().st_ctime
            })

    return {"files": files}



async def download_ppt_service(file_name: str, staff_id: str):
    """
    处理PPT下载的权限验证和文件检查

    Args:
        file_name: 要下载的文件名
        staff_id: 教师工号

    Returns:
        文件路径对象

    Raises:
        HTTPException: 当权限验证失败或文件不存在时
    """
    # 验证文件权限
    if not file_name.startswith(f"ppt_{staff_id}_"):
        logger.warning(f"教师(工号:{staff_id}) 尝试访问非自己的文件: {file_name}")
        raise HTTPException(status_code=403, detail="没有权限访问此文件")

    file_path = PPT_FILES_DIR / file_name
    if not file_path.exists():
        logger.warning(f"教师(工号:{staff_id}) 请求的文件不存在: {file_name}")
        raise HTTPException(status_code=404, detail="文件不存在")

    return file_path



async def delete_ppt_outline_service(file_name: str, staff_id: str) -> None:
    """
    删除PPT大纲文件，需要同时删除md与json格式的大纲文件

    Args:
        file_name: 要删除的大纲文件名
        staff_id: 教师工号

    Raises:
        HTTPException: 当权限验证失败或文件不存在时
    """
    # 验证文件权限 (格式应为 outline_md_staff_id_*.md)
    if not file_name.startswith(f"outline_md_{staff_id}_"):
        logger.warning(f"权限拒绝: 教师(工号:{staff_id})尝试删除非本人大纲: {file_name}")
        raise HTTPException(status_code=403, detail="您无权删除此大纲")

    # 构建MD文件路径
    md_file_path = PPT_OUTLINE_MD_DIR / file_name
    # 根据MD文件名构建对应的JSON文件名
    # outline_md_staff_id_timestamp_title.md -> outline_json_staff_id_timestamp_title.json
    if file_name.endswith(".md"):
        json_file_name = file_name.replace("outline_md_", "outline_json_").replace(".md", ".json")
        json_file_path = PPT_OUTLINE_JSON_DIR / json_file_name
    else:
        raise HTTPException(status_code=400, detail="不支持的文件类型")

    # 检查MD文件是否存在
    if not md_file_path.exists():
        logger.warning(f"删除大纲失败: 文件不存在 '{md_file_path}'")
        raise HTTPException(status_code=404, detail="大纲文件不存在")

    try:
        # 删除MD文件
        md_file_path.unlink()
        logger.info(f"MD文件已删除: {md_file_path}")

        # 删除对应的JSON文件（如果存在）
        if json_file_path.exists():
            json_file_path.unlink()
            logger.info(f"关联JSON文件已删除: {json_file_path}")
        else:
            logger.info(f"JSON文件不存在，跳过删除: {json_file_path}")

        logger.info(f"教师(工号:{staff_id})成功删除大纲文件: {file_name}")

    except Exception as e:
        logger.error(f"删除大纲文件失败: {str(e)}")
        raise Exception(f"删除大纲文件失败: {str(e)}")



async def delete_ppt_file_service(file_name: str, staff_id: str) -> None:
    """
    删除PPT文件

    Args:
        file_name: 要删除的PPT文件名
        staff_id: 教师工号

    Raises:
        HTTPException: 当权限验证失败或文件不存在时
    """
    # 验证文件权限 (格式应为 ppt_staff_id_*.pptx)
    if not file_name.startswith(f"ppt_{staff_id}_"):
        logger.warning(f"权限拒绝: 教师(工号:{staff_id})尝试删除非本人PPT文件: {file_name}")
        raise HTTPException(status_code=403, detail="您无权删除此文件")

    file_path = PPT_FILES_DIR / file_name
    if not file_path.exists():
        logger.warning(f"删除PPT文件失败: 文件不存在 '{file_path}'")
        raise HTTPException(status_code=404, detail="PPT文件不存在")

    try:
        file_path.unlink()
        logger.info(f"教师(工号:{staff_id})成功删除PPT文件: {file_name}")
    except Exception as e:
        logger.error(f"删除PPT文件失败: {str(e)}")
        raise Exception(f"删除PPT文件失败: {str(e)}")