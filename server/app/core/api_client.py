from openai import OpenAI
from app.config import DEEPSEEK_API_KEY, KIMI_API_KEY
from app.schemas.chat_sch import AIModel

# API 客户端
kimi_client = OpenAI(
    api_key=KIMI_API_KEY,
    base_url="https://api.moonshot.cn/v1"
)

deepseek_client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
)

# 模型配置
MODEL_CONFIGS = {
    AIModel.KIMI: {
        "client": kimi_client,
        "model_name": "kimi-k2-0711-preview",
        "display_name": "Kimi"
    },
    AIModel.DEEPSEEK: {
        "client": deepseek_client,
        "model_name": "deepseek-chat",
        "display_name": "DeepSeek"
    },
}