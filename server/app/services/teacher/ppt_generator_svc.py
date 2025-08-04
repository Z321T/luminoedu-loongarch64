import re

from datetime import datetime
from typing import Dict, List

from fastapi import HTTPException
from openai import OpenAI

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

from app.config import DEEPSEEK_API_KEY, SERVER_DIR
from app.core.logger import setup_logger
from app.schemas.teacher.ppt_generator_sch import (
    PPTGenerationRequest, PPTGenerationResponse, PPTSlide,
    PPTOutlineResponse, PPTGenerationFromOutlineRequest
)

# 设置日志
logger = setup_logger("ppt_generator_service")

# PPT文件存储目录
PPT_FILES_DIR = SERVER_DIR / "app" / "documents" / "ppt_files"
PPT_OUTLINE_DIR = SERVER_DIR / "app" / "documents" / "ppt_outlines"
PPT_FILES_DIR.mkdir(exist_ok=True, parents=True)
PPT_OUTLINE_DIR.mkdir(exist_ok=True, parents=True)

# 创建 API 客户端
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
)


async def generate_ppt_outline(request: PPTGenerationRequest, staff_id: str) -> PPTOutlineResponse:
    """
    生成PPT的Markdown格式大纲
    """
    logger.info(f"开始生成PPT大纲: 标题={request.title}")

    prompt = f"""你是一位经验丰富的教师和课件专家，请为以下教学内容设计一个详细且内容丰富的PPT大纲:
    
    标题: {request.title}
    学科: {request.subject}
    目标年级: {request.target_grade}
    教学目标: {request.teaching_target}
    教学重点: {', '.join(request.key_points)}
    幻灯片数量: {request.slide_count}
    {f"其他信息: {request.additional_info}" if request.additional_info else ""}
    
    请生成{request.slide_count}张幻灯片的md格式设计，要求每张幻灯片的内容具体、丰富、实用，避免空洞的表述。内容需要包括:
    1. 封面页(标题+简介)
    2. 学习目标页(详细列出具体可衡量的学习成果)
    3. 内容页(核心知识讲解，包含具体概念、定义、原理和示例代码)
    4. 案例/示例页(真实可执行的代码示例，而非空泛描述)
    5. 练习/活动页(有明确步骤和要求的练习题)
    6. 总结页(具体的知识点总结，不要简单重复前面内容)
    
    对于编程相关内容，请提供实际的代码片段而非仅描述代码功能。
    对于概念解释，请给出明确的定义和具体的例子。
    对于操作步骤，请提供详细的分步骤说明。
    
    请提供一个完整的Markdown格式大纲，包含每张幻灯片的标题和内容。
    
    请确保生成了符合要求的幻灯片数量，字数适中且内容有教学价值。
    """

    try:
        # 使用 OpenAI 客户端调用 API
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专业的教育资源制作助手，擅长生成教学PPT内容。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=8000,
            stream=False
        )

        md_content = response.choices[0].message.content
        logger.info(f"成功从API获取大纲内容")

        # 保存大纲到文件
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        outline_path = PPT_OUTLINE_DIR / f"outline_{staff_id}_{timestamp}_{request.title}.md"
        with open(outline_path, "w", encoding="utf-8") as f:
            f.write(md_content)

        logger.info(f"大纲已保存到文件: {outline_path}")

        return PPTOutlineResponse(
            title=request.title,
            outline_md=md_content,
        )

    except Exception as e:
        logger.error(f"生成PPT大纲失败: {str(e)}")
        raise Exception(f"生成PPT大纲失败: {str(e)}")



async def generate_ppt_from_outline(
        request: PPTGenerationFromOutlineRequest,
        staff_id: str
) -> PPTGenerationResponse:
    """从修改后的大纲生成PPT"""
    logger.info(f"从大纲生成PPT: 标题={request.title}, 教师ID={staff_id}")

    try:
        # 将大纲解析为结构化数据
        slides_data = parse_markdown_outline(request.outline_md)

        # 生成文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"ppt_{staff_id}_{timestamp}_{request.title.replace(' ', '_')}.pptx"

        # 创建PPT文件
        file_path = create_pptx(slides_data, file_name)

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



def create_pptx(slides_data: List[Dict[str, str]], file_name: str) -> str:
    """创建基本的PPT文件"""
    try:
        # 创建演示文稿
        prs = Presentation()
        slide_width = prs.slide_width
        slide_height = prs.slide_height

        for slide_data in slides_data:
            # 新建空白幻灯片
            slide = prs.slides.add_slide(prs.slide_layouts[6])

            # 标题文本框（左上角）
            left = Inches(0.5)
            top = Inches(0.4)
            width = slide_width - Inches(1)
            height = Inches(1)
            title_box = slide.shapes.add_textbox(left, top, width, height)
            title_tf = title_box.text_frame
            title_tf.text = slide_data["title"]
            title_p = title_tf.paragraphs[0]
            title_p.font.size = Pt(32)
            title_p.font.bold = True
            title_p.font.name = "微软雅黑"
            title_p.font.color.rgb = RGBColor(31, 56, 100)
            title_p.alignment = PP_ALIGN.LEFT

            # 内容文本框（标题下方）
            content_top = top + height + Inches(0.1)
            content_height = slide_height - content_top - Inches(0.5)
            content_box = slide.shapes.add_textbox(left, content_top, width, content_height)
            content_tf = content_box.text_frame
            content_tf.word_wrap = True

            # 处理内容，支持列表、加粗、代码块
            lines = slide_data["content"].splitlines()
            in_code = False
            code_buf = []
            for line in lines:
                line = line.rstrip()
                # 代码块处理
                if re.match(r"^```", line):
                    if in_code:
                        # 结束代码块，插入代码
                        _add_code_block(slide, code_buf, left, content_top, width)
                        code_buf = []
                        in_code = False
                    else:
                        in_code = True
                    continue
                if in_code:
                    code_buf.append(line)
                    continue
                if not line.strip():
                    continue
                # 无序列表
                if re.match(r"^[-*+]\s+", line):
                    p = content_tf.add_paragraph()
                    p.text = line[2:].strip()
                    p.level = 0
                    p.font.size = Pt(20)
                    p.font.name = "微软雅黑"
                # 有序列表
                elif re.match(r"^\d+\.\s+", line):
                    p = content_tf.add_paragraph()
                    p.text = line.split(".", 1)[1].strip()
                    p.level = 0
                    p.font.size = Pt(20)
                    p.font.name = "微软雅黑"
                # 加粗
                elif line.startswith("**") and line.endswith("**"):
                    p = content_tf.add_paragraph()
                    p.text = line.replace("**", "")
                    p.font.size = Pt(22)
                    p.font.bold = True
                    p.font.name = "微软雅黑"
                else:
                    p = content_tf.add_paragraph()
                    p.text = line.replace("**", "")
                    p.font.size = Pt(20)
                    p.font.name = "微软雅黑"

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



def _add_code_block(slide, code_lines, left, top, width):
    """在幻灯片上添加代码块文本框（灰色背景，等宽字体）"""
    from pptx.util import Pt, Inches
    from pptx.dml.color import RGBColor
    from pptx.enum.shapes import MSO_SHAPE

    code_text = "\n".join(code_lines)
    # 估算高度
    height = Pt(20) * (len(code_lines) + 1) + Inches(0.2)
    code_box = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, left, top + Inches(1), width, height
    )
    code_box.fill.solid()
    code_box.fill.fore_color.rgb = RGBColor(240, 240, 240)
    code_box.line.color.rgb = RGBColor(200, 200, 200)
    code_tf = code_box.text_frame
    code_tf.word_wrap = True
    p = code_tf.paragraphs[0]
    p.text = code_text
    p.font.size = Pt(16)
    p.font.name = "Consolas"
    p.font.color.rgb = RGBColor(60, 60, 60)




async def list_ppt_outlines_service(staff_id: str):
    """
    列出教师的所有PPT大纲

    Args:
        staff_id: 教师工号

    Returns:
        包含大纲列表的字典
    """
    outlines = []

    for file_path in PPT_OUTLINE_DIR.glob(f"outline_{staff_id}_*.md"):
        try:
            filename = file_path.name
            base_name = filename.rsplit('.', 1)[0]
            parts = base_name.split('_')

            # 提取文件名中的时间戳
            if len(parts) >= 3:
                timestamp = parts[2]
                title = parts[4] if len(parts) > 4 else "未知标题"
            else:
                # 如果文件名格式不符合预期
                timestamp = ""
                title = '未知标题'

            # 读取文件内容
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            outlines.append({
                "filename": filename,
                "title": title,
                "created_at": timestamp,
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
    if not file_name.startswith(f"outline_{staff_id}_"):
        logger.warning(f"教师(工号:{staff_id}) 尝试访问非自己的大纲文件: {file_name}")
        raise HTTPException(status_code=403, detail="没有权限访问此文件")

    file_path = PPT_OUTLINE_DIR / file_name
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
    删除PPT大纲文件

    Args:
        file_name: 要删除的大纲文件名
        staff_id: 教师工号

    Raises:
        HTTPException: 当权限验证失败或文件不存在时
    """
    # 验证文件权限 (格式应为 outline_staff_id_*.md)
    if not file_name.startswith(f"outline_{staff_id}_"):
        logger.warning(f"权限拒绝: 教师(工号:{staff_id})尝试删除非本人大纲: {file_name}")
        raise HTTPException(status_code=403, detail="您无权删除此大纲")

    file_path = PPT_OUTLINE_DIR / file_name
    if not file_path.exists():
        logger.warning(f"删除大纲失败: 文件不存在 '{file_path}'")
        raise HTTPException(status_code=404, detail="大纲文件不存在")

    try:
        file_path.unlink()
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