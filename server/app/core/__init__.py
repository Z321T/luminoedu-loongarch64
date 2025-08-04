import os
import secrets
from pathlib import Path


def ensure_directories_exist(base_dir: Path, directories: list[str]) -> None:
    """
    确保指定的目录结构存在

    参数:
        base_dir: 基础目录
        directories: 相对于基础目录的路径列表
    """
    for dir_path in directories:
        directory = base_dir / dir_path if dir_path else base_dir
        directory.mkdir(parents=True, exist_ok=True)


def create_or_load_secret_key(secret_key_file: Path) -> str:
    """
    获取或创建JWT密钥

    参数:
        secret_key_file: 密钥文件路径

    返回:
        str: 密钥字符串
    """
    # 尝试从文件读取
    try:
        if secret_key_file.exists():
            with open(secret_key_file, "r") as f:
                return f.read().strip()
    except Exception:
        pass

    # 生成新密钥并保存
    new_key = secrets.token_urlsafe(32)
    try:
        # 确保父目录存在
        secret_key_file.parent.mkdir(parents=True, exist_ok=True)
        # 写入文件时设置适当的权限
        with open(secret_key_file, "w") as f:
            f.write(new_key)
        # 设置文件权限为仅所有者可读写
        os.chmod(secret_key_file, 0o600)
    except Exception as e:
        print(f"警告：无法保存密钥到文件: {e}")

    return new_key


def initialize_system_directories(media_root: Path) -> None:
    """
    初始化系统所需的所有目录结构

    参数:
        media_root: 媒体文件根目录
    """
    # 定义需要创建的目录结构（相对于 media_root 的路径）
    directories = [
        "",  # 基础媒体目录
        "exercises",  # 练习目录
        "excel",  # Excel模板目录
        "coursematerial", # 课程资料目录
    ]

    ensure_directories_exist(media_root, directories)