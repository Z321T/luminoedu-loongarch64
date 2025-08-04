import os
from datetime import datetime
from pathlib import Path
from typing import List, Tuple

from app.config import COURSE_MATERIALS_DIR, MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS
from app.core.logger import setup_logger
from app.models.course import Course
from app.schemas.teacher.course_material_th_sch import MaterialInfo
from fastapi import UploadFile

logger = setup_logger("course_material_service")


def get_course_material_dir(teacher_id: int, course_id: int) -> Path:
    """获取课程资料存储目录"""
    material_dir = COURSE_MATERIALS_DIR / f"teacher_{teacher_id}" / f"course_{course_id}"
    material_dir.mkdir(parents=True, exist_ok=True)
    return material_dir


def is_allowed_file(filename: str) -> bool:
    """检查文件扩展名是否允许"""
    return Path(filename).suffix.lower() in ALLOWED_FILE_EXTENSIONS


async def upload_course_material(
        teacher_id: int,
        course_id: int,
        file: UploadFile
) -> Tuple[bool, str, int]:
    """上传课程资料"""
    logger.info(f"教师ID {teacher_id} 正在为课程ID {course_id} 上传资料: {file.filename}")

    # 验证课程权限
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"课程不存在或无权限: 教师ID={teacher_id}, 课程ID={course_id}")
        raise ValueError("课程不存在或无权限访问")

    # 检查文件扩展名
    if not is_allowed_file(file.filename):
        logger.warning(f"不支持的文件类型: {file.filename}")
        raise ValueError(f"不支持的文件类型，仅支持: {', '.join(ALLOWED_FILE_EXTENSIONS)}")

    # 检查文件大小
    file_content = await file.read()
    file_size = len(file_content)

    if file_size > MAX_FILE_SIZE:
        logger.warning(f"文件过大: {file.filename}, 大小: {file_size}")
        raise ValueError(f"文件大小超过限制({MAX_FILE_SIZE // (1024 * 1024)}MB)")

    # 获取存储目录
    material_dir = get_course_material_dir(teacher_id, course_id)

    # 处理文件名冲突
    original_filename = file.filename
    file_path = material_dir / original_filename
    counter = 1

    while file_path.exists():
        name, ext = os.path.splitext(original_filename)
        new_filename = f"{name}_{counter}{ext}"
        file_path = material_dir / new_filename
        counter += 1

    # 保存文件
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        logger.info(f"文件上传成功: {file_path}")
        return True, file_path.name, file_size

    except Exception as e:
        logger.error(f"文件保存失败: {str(e)}")
        raise ValueError(f"文件保存失败: {str(e)}")


async def get_course_materials(teacher_id: int, course_id: int) -> List[MaterialInfo]:
    """获取课程资料列表"""
    logger.info(f"教师ID {teacher_id} 正在获取课程ID {course_id} 的资料列表")

    # 验证课程权限
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"课程不存在或无权限: 教师ID={teacher_id}, 课程ID={course_id}")
        raise ValueError("课程不存在或无权限访问")

    material_dir = get_course_material_dir(teacher_id, course_id)
    materials = []

    if material_dir.exists():
        for file_path in material_dir.iterdir():
            if file_path.is_file():
                stat = file_path.stat()
                materials.append(MaterialInfo(
                    filename=file_path.name,
                    file_size=stat.st_size,
                    upload_time=datetime.fromtimestamp(stat.st_mtime),
                    file_extension=file_path.suffix.lower()
                ))

    # 按上传时间倒序排列
    materials.sort(key=lambda x: x.upload_time, reverse=True)
    logger.info(f"课程 {course_id} 资料列表获取成功: 共 {len(materials)} 个文件")
    return materials


async def delete_course_material(teacher_id: int, course_id: int, filename: str) -> bool:
    """删除课程资料"""
    logger.info(f"教师 {teacher_id} 正在删除课程 {course_id} 的资料: {filename}")

    # 验证课程权限
    course = await Course.filter(id=course_id, teacher_id=teacher_id).first()
    if not course:
        logger.warning(f"课程不存在或无权限: 教师ID={teacher_id}, 课程ID={course_id}")
        raise ValueError("课程不存在或无权限访问")

    material_dir = get_course_material_dir(teacher_id, course_id)
    file_path = material_dir / filename

    if not file_path.exists():
        logger.warning(f"文件不存在: {file_path}")
        raise ValueError("文件不存在")

    try:
        file_path.unlink()
        logger.info(f"文件删除成功: {file_path}")
        return True
    except Exception as e:
        logger.error(f"文件删除失败: {str(e)}")
        raise ValueError(f"文件删除失败: {str(e)}")