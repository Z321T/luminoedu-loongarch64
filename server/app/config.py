# Description: fastapi配置文件
import os
from pathlib import Path

from app.core import create_or_load_secret_key

# 后端项目基础路径server/
SERVER_DIR = Path(__file__).resolve().parent.parent

# 密钥文件路径
SECRET_KEY_FILE = SERVER_DIR / ".secret_key"

# JWT相关配置
SECRET_KEY = create_or_load_secret_key(SECRET_KEY_FILE)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 0.5小时过期

# 习题生成配置
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-0eda12ea690b402b9f6e7a702504280d")

# 文件存储路径
MEDIA_ROOT = SERVER_DIR / "app" / "documents"

# 课程资料存储路径
COURSE_MATERIALS_DIR = MEDIA_ROOT / "coursematerial"

# 文件上传配置
MAX_FILE_SIZE = 2048 * 1024 * 1024  # 2GB
ALLOWED_FILE_EXTENSIONS = {
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
    '.txt', '.md', '.zip', '.rar', '.7z', '.tar', '.gz',
    '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mov'
}