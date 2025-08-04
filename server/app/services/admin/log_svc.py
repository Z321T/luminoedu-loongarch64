import re
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, status

from app.core.logger import LOG_DIR, setup_logger
from app.schemas.admin.log_management_sch import LogService, LogServiceList, LogFile, LogFileList, LogContent

# 设置日志记录器
logger = setup_logger("log_management_service")

# 服务描述映射
SERVICE_DESCRIPTIONS = {
    # 系统服务
    "app": "应用启动日志",
    "request": "应用请求日志",
    # 用户个人中心服务
    "user_center_service": "用户个人中心服务日志",
    # AI-Chat服务
    "chat_service": "AI聊天服务日志",
    # 管理员端服务
    "user_management_service": "用户管理日志",
    "log_management_service": "日志管理服务日志",
    "model_management_service": "模型管理服务日志",
    # 教师端服务
    "exercise_generator_service": "习题生成服务日志",
    "exercise_generator_api": "习题生成服务相关API请求日志",
    "ppt_generator_service": "PPT生成服务日志",
    "ppt_generator_api": "PPT生成服务相关API请求日志",
    "course_management_service": "课程管理服务日志",
    "course_material_service": "课程资料管理服务日志",
    "course_notification_service": "课程通知服务日志",
    "th_document_vectorization_api": "文档向量化服务相关API请求日志-教师",
    # 学生端服务
    "student_notification_service": "学生课程通知服务日志",
    "student_course_service": "学生课程服务日志",
    "student_exercise_generator_api": "学生习题生成服务相关API请求日志",
    "student_ppt_generator_api": "学生PPT生成服务相关API请求日志",
    "stu_document_vectorization_api": "文档向量化服务相关API请求日志-学生",
    # 向量处理服务
    "document_vectorization_service": "文档向量化服务日志",
}

def format_file_size(size_bytes: int) -> str:
    """格式化文件大小"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"

async def get_log_services() -> LogServiceList:
    """获取所有日志服务（文件夹）"""
    logger.info("管理员请求获取日志服务列表")

    # 确保日志目录存在
    if not LOG_DIR.exists():
        logger.warning(f"日志目录不存在，创建目录: {LOG_DIR}")
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        return LogServiceList(services=[])

    log_services = []

    # 获取所有子文件夹
    for item in LOG_DIR.iterdir():
        if item.is_dir():
            service_name = item.name
            # 获取服务描述，如果没有预定义则使用默认描述
            description = SERVICE_DESCRIPTIONS.get(service_name, f"{service_name}服务")
            log_services.append(LogService(name=service_name, description=description))

    # 按名称排序
    log_services.sort(key=lambda x: x.name)
    logger.info(f"成功获取日志服务列表，共{len(log_services)}个服务")
    return LogServiceList(services=log_services)

async def get_log_files(service_name: str, start_date: Optional[str] = None, end_date: Optional[str] = None) -> LogFileList:
    """获取指定服务的日志文件列表"""
    logger.info(f"管理员请求获取日志文件列表 - 服务:{service_name}, 开始日期:{start_date}, 结束日期:{end_date}")

    service_dir = LOG_DIR / service_name

    # 检查服务目录是否存在
    if not service_dir.exists() or not service_dir.is_dir():
        logger.warning(f"请求的日志服务不存在: {service_name}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"日志服务 '{service_name}' 不存在"
        )

    service_description = SERVICE_DESCRIPTIONS.get(service_name, f"{service_name}服务")
    log_files = []

    # 转换日期字符串为日期对象
    start_datetime = None
    end_datetime = None
    try:
        if start_date:
            start_datetime = datetime.strptime(start_date, "%Y-%m-%d").date()
        if end_date:
            end_datetime = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError as e:
        logger.error(f"日期格式转换错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"日期格式错误: {str(e)}"
        )

    # 查找所有日志文件
    for file_path in service_dir.glob("*.log*"):
        # 从文件名提取日期 (格式: name.log.YYYY-MM-DD)
        date_match = re.search(r'\.log\.(\d{4}-\d{2}-\d{2})$', file_path.name)
        date = None

        if date_match:
            try:
                date_str = date_match.group(1)
                date = datetime.strptime(date_str, "%Y-%m-%d")

                # 应用日期筛选
                if start_datetime and date.date() < start_datetime:
                    continue
                if end_datetime and date.date() > end_datetime:
                    continue

            except ValueError:
                pass

        # 获取文件大小并格式化
        size_bytes = file_path.stat().st_size
        formatted_size = format_file_size(size_bytes)

        log_files.append(LogFile(
            name=file_path.name,
            date=date,
            size=formatted_size
        ))

    # 按日期从新到旧排序
    log_files.sort(key=lambda x: x.date if x.date else datetime.min, reverse=True)

    logger.info(f"成功获取{service_name}服务的日志文件列表，共{len(log_files)}个文件")
    return LogFileList(
        files=log_files,
        service_name=service_name,
        service_description=service_description
    )

async def get_log_content(service_name: str, file_name: str) -> LogContent:
    """获取日志文件内容"""
    logger.info(f"管理员请求查看日志文件内容 - 服务:{service_name}, 文件:{file_name}")

    service_dir = LOG_DIR / service_name
    log_file = service_dir / file_name

    # 检查服务目录和文件是否存在
    if not service_dir.exists() or not service_dir.is_dir():
        logger.warning(f"请求的日志服务不存在: {service_name}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"日志服务 '{service_name}' 不存在"
        )

    if not log_file.exists() or not log_file.is_file():
        logger.warning(f"请求的日志文件不存在 - 服务:{service_name}, 文件:{file_name}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"日志文件 '{file_name}' 不存在"
        )

    try:
        # 读取文件内容
        with open(log_file, 'r', encoding='utf-8') as f:
            content = f.readlines()

        # 去除每行末尾的换行符
        content = [line.rstrip('\n') for line in content]

        logger.info(f"成功读取日志文件内容 - 服务:{service_name}, 文件:{file_name}, 行数:{len(content)}")

        return LogContent(
            content=content,
            file_name=file_name,
            service_name=service_name
        )

    except Exception as e:
        logger.error(f"读取日志文件失败 - 服务:{service_name}, 文件:{file_name}, 错误:{str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"读取日志文件失败: {str(e)}"
        )


async def export_log_files(service_name: str, start_date: Optional[str] = None, end_date: Optional[str] = None) -> \
tuple[str, bytes]:
    """导出指定服务的日志文件

    将指定服务在日期范围内的所有日志合并为单个文件并导出
    """
    logger.info(f"管理员请求导出日志文件 - 服务:{service_name}, 开始日期:{start_date}, 结束日期:{end_date}")

    service_dir = LOG_DIR / service_name

    # 检查服务目录是否存在
    if not service_dir.exists() or not service_dir.is_dir():
        logger.warning(f"请求的日志服务不存在: {service_name}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"日志服务 '{service_name}' 不存在"
        )

    # 转换日期字符串为日期对象
    start_datetime = None
    end_datetime = None
    try:
        if start_date:
            start_datetime = datetime.strptime(start_date, "%Y-%m-%d").date()
        if end_date:
            end_datetime = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError as e:
        logger.error(f"日期格式转换错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"日期格式错误: {str(e)}"
        )

    # 查找匹配的日志文件
    matching_files = []
    for file_path in service_dir.glob("*.log*"):
        # 从文件名提取日期 (格式: name.log.YYYY-MM-DD)
        date_match = re.search(r'\.log\.(\d{4}-\d{2}-\d{2})$', file_path.name)

        if date_match:
            try:
                date_str = date_match.group(1)
                file_date = datetime.strptime(date_str, "%Y-%m-%d").date()

                # 应用日期筛选
                if start_datetime and file_date < start_datetime:
                    continue
                if end_datetime and file_date > end_datetime:
                    continue

                matching_files.append((file_date, file_path))
            except ValueError:
                # 如果日期解析失败，将文件添加到列表
                matching_files.append((None, file_path))
        else:
            # 处理当前日志文件（没有日期后缀）
            matching_files.append((datetime.now().date(), file_path))

    # 如果没有匹配的文件
    if not matching_files:
        logger.warning(f"导出日志失败 - 服务:{service_name}, 原因:指定日期范围内没有日志文件")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="指定日期范围内没有日志文件"
        )

    # 按日期排序文件（从旧到新）
    matching_files.sort(key=lambda x: x[0] if x[0] else datetime.min.date())

    # 生成文件名
    date_range = ""
    if start_date and end_date:
        date_range = f"_{start_date}_to_{end_date}"
    elif start_date:
        date_range = f"_{start_date}_to_now"
    elif end_date:
        date_range = f"_until_{end_date}"

    export_filename = f"{service_name}{date_range}_logs.txt"

    # 合并日志内容
    combined_content = []
    for _, file_path in matching_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                file_content = f.read()
                if file_content:  # 确保文件不为空
                    # 添加文件标题作为分隔
                    combined_content.append(f"\n{'=' * 80}\n")
                    combined_content.append(f"日志文件: {file_path.name}\n")
                    combined_content.append(f"{'=' * 80}\n\n")
                    combined_content.append(file_content)
                    combined_content.append("\n\n")
        except Exception as e:
            logger.error(f"读取日志文件失败 - 文件:{file_path}, 错误:{str(e)}")
            # 继续处理其他文件

    # 如果所有文件都读取失败
    if not combined_content:
        logger.error(f"导出日志失败 - 服务:{service_name}, 原因:所有日志文件读取失败")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="所有日志文件读取失败"
        )

    # 生成文本内容
    file_content = "".join(combined_content).encode('utf-8')

    total_files = len(matching_files)
    content_size = format_file_size(len(file_content))
    logger.info(
        f"成功导出日志文件 - 服务:{service_name}, 文件名:{export_filename}, 包含{total_files}个日志文件, 大小:{content_size}")

    return export_filename, file_content