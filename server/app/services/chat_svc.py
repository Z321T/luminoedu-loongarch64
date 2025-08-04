import uuid
import json
from datetime import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator
from pathlib import Path

from openai import OpenAI

from app.config import DEEPSEEK_API_KEY, MEDIA_ROOT
from app.core.logger import setup_logger
from app.models.user_common import UserRole
from app.schemas.chat_sch import (
    ChatMessage, ChatRequest, ChatStreamResponse, ChatMessageRole
)

# 设置日志
logger = setup_logger("chat_service")

# 聊天历史存储根目录
CHAT_HISTORY_ROOT_DIR = MEDIA_ROOT / "chat_history"
CHAT_HISTORY_ROOT_DIR.mkdir(exist_ok=True, parents=True)

# 创建 API 客户端
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
)

# 内存缓存聊天历史
chat_history_cache = {}


def get_user_chat_directory(user_id: str, user_role: UserRole) -> Path:
    """根据用户角色和ID创建用户专属的聊天历史目录"""
    # 根据角色和用户ID创建目录名：如 student_1, teacher_2, admin_3
    folder_name = f"{user_role.value}_{user_id}"
    user_dir = CHAT_HISTORY_ROOT_DIR / folder_name
    user_dir.mkdir(exist_ok=True, parents=True)
    return user_dir


def get_chat_file_path(user_id: str, user_role: UserRole, chat_id: str) -> Path:
    """获取指定用户角色、用户ID和聊天ID的文件路径"""
    user_dir = get_user_chat_directory(user_id, user_role)
    return user_dir / f"chat_{chat_id}.json"


def get_user_cache_key(user_id: str, user_role: UserRole) -> str:
    """生成用户缓存键"""
    return f"{user_role.value}_{user_id}"


def get_system_prompt(user_role: UserRole) -> str:
    base_prompt = "你是一个教育辅助AI助手，名为Lumino教学助手。"
    if user_role == UserRole.TEACHER:
        return base_prompt + "你将协助教师解答教学问题，提供教学建议和资源。"
    elif user_role == UserRole.STUDENT:
        return base_prompt + "你将帮助学生解答学习问题，提供知识讲解和学习方法指导，但不直接提供作业答案。"
    elif user_role == UserRole.ADMIN:
        return base_prompt + "你将提供全面的教育管理和技术支持服务。"
    else:
        return base_prompt + "你将提供全面的教育服务支持。"


def save_chat_to_file(user_id: str, user_role: UserRole, chat_id: str, chat_data: Dict[str, Any]) -> None:
    """保存聊天数据到用户角色专属文件夹"""
    try:
        chat_file = get_chat_file_path(user_id, user_role, chat_id)

        # 确保目录存在
        chat_file.parent.mkdir(exist_ok=True, parents=True)

        with open(chat_file, "w", encoding="utf-8") as f:
            json.dump(chat_data, f, ensure_ascii=False, indent=2)

        folder_name = f"{user_role.value}_{user_id}"
        logger.debug(f"聊天记录已保存到角色文件夹: {folder_name}/chat_{chat_id}.json")
    except Exception as e:
        logger.error(f"保存聊天历史到文件失败: {str(e)}")


def load_chat_history_from_file(user_id: str, user_role: UserRole, chat_id: str) -> Optional[Dict[str, Any]]:
    """从用户角色专属文件夹加载聊天历史"""
    try:
        chat_file = get_chat_file_path(user_id, user_role, chat_id)
        if chat_file.exists():
            with open(chat_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                logger.debug(f"从角色文件夹加载聊天记录: {user_role.value}_{user_id}/chat_{chat_id}.json")
                return data
    except Exception as e:
        logger.error(f"从文件加载聊天历史失败: {str(e)}")
    return None


def get_chat_messages_history(user_id: str, user_role: UserRole, chat_id: str) -> List[Dict[str, str]]:
    """获取指定对话的历史消息"""
    cache_key = get_user_cache_key(user_id, user_role)

    # 先从缓存中查找
    if cache_key in chat_history_cache and chat_id in chat_history_cache[cache_key]:
        return chat_history_cache[cache_key][chat_id].get("messages", [])

    # 从文件中加载
    history_data = load_chat_history_from_file(user_id, user_role, chat_id)
    if history_data:
        # 加载到缓存
        if cache_key not in chat_history_cache:
            chat_history_cache[cache_key] = {}
        chat_history_cache[cache_key][chat_id] = history_data
        return history_data.get("messages", [])

    return []


def create_initial_chat_history(
        chat_id: str,
        user_id: str,
        user_role: UserRole,
        user_messages: List[ChatMessage]
) -> None:
    """在用户角色专属文件夹中创建初始聊天历史记录"""
    cache_key = get_user_cache_key(user_id, user_role)

    if cache_key not in chat_history_cache:
        chat_history_cache[cache_key] = {}

    # 创建初始历史记录
    chat_data = {
        "messages": [msg.model_dump() for msg in user_messages],
        "created_at": datetime.now().isoformat(),
        "user_id": user_id,
        "user_role": user_role.value,  # 保存用户角色信息
        "last_updated": datetime.now().isoformat()
    }

    chat_history_cache[cache_key][chat_id] = chat_data

    # 立即保存到用户角色专属文件夹
    save_chat_to_file(user_id, user_role, chat_id, chat_data)

    folder_name = f"{user_role.value}_{user_id}"
    logger.info(f"初始聊天历史已创建并保存到角色目录: {folder_name}/chat_{chat_id}.json")


def append_user_messages_to_history(
        chat_id: str,
        user_id: str,
        user_role: UserRole,
        user_messages: List[ChatMessage]
) -> None:
    """向用户角色专属文件夹的聊天历史追加用户消息"""
    cache_key = get_user_cache_key(user_id, user_role)

    if cache_key not in chat_history_cache:
        chat_history_cache[cache_key] = {}

    if chat_id not in chat_history_cache[cache_key]:
        history_data = load_chat_history_from_file(user_id, user_role, chat_id)
        if history_data:
            chat_history_cache[cache_key][chat_id] = history_data
        else:
            chat_history_cache[cache_key][chat_id] = {
                "messages": [],
                "created_at": datetime.now().isoformat(),
                "user_id": user_id,
                "user_role": user_role.value,
                "last_updated": datetime.now().isoformat()
            }

    # 追加用户消息
    new_user_messages = [msg.model_dump() for msg in user_messages]
    chat_history_cache[cache_key][chat_id]["messages"].extend(new_user_messages)

    # 更新最后修改时间
    chat_history_cache[cache_key][chat_id]["last_updated"] = datetime.now().isoformat()

    # 立即保存到用户角色专属文件夹
    save_chat_to_file(user_id, user_role, chat_id, chat_history_cache[cache_key][chat_id])

    folder_name = f"{user_role.value}_{user_id}"
    logger.info(f"用户消息已追加并保存到角色目录: {folder_name}/chat_{chat_id}.json")


def initialize_assistant_response_in_history(
        chat_id: str,
        user_id: str,
        user_role: UserRole
) -> None:
    """在用户角色专属历史记录中初始化AI回复位置"""
    cache_key = get_user_cache_key(user_id, user_role)

    if cache_key in chat_history_cache and chat_id in chat_history_cache[cache_key]:
        # 添加空的AI回复作为占位符
        empty_assistant_message = {
            "role": "assistant",
            "content": ""
        }
        chat_history_cache[cache_key][chat_id]["messages"].append(empty_assistant_message)

        # 更新最后修改时间
        chat_history_cache[cache_key][chat_id]["last_updated"] = datetime.now().isoformat()

        # 立即保存到用户角色专属文件夹
        save_chat_to_file(user_id, user_role, chat_id, chat_history_cache[cache_key][chat_id])

        folder_name = f"{user_role.value}_{user_id}"
        logger.info(f"AI回复位置已在角色目录中初始化: {folder_name}/chat_{chat_id}.json")


def update_assistant_response_in_history(
        chat_id: str,
        user_id: str,
        user_role: UserRole,
        content: str,
        force_save: bool = False
) -> None:
    """实时更新用户角色专属文件夹中的AI回复内容"""
    cache_key = get_user_cache_key(user_id, user_role)

    if cache_key in chat_history_cache and chat_id in chat_history_cache[cache_key]:
        messages = chat_history_cache[cache_key][chat_id]["messages"]

        # 找到最后一条AI回复消息并更新
        for i in reversed(range(len(messages))):
            if messages[i].get("role") == "assistant":
                messages[i]["content"] = content
                break

        # 更新最后修改时间
        chat_history_cache[cache_key][chat_id]["last_updated"] = datetime.now().isoformat()

        # 根据内容长度或强制保存标志决定是否写入文件
        # 每100个字符保存一次，或者强制保存
        if force_save or len(content) % 100 < 10:
            save_chat_to_file(user_id, user_role, chat_id, chat_history_cache[cache_key][chat_id])
            folder_name = f"{user_role.value}_{user_id}"
            logger.debug(
                f"AI回复已实时更新并保存到角色目录: {folder_name}/chat_{chat_id}.json, 内容长度={len(content)}")


def load_user_chat_histories(user_id: str, user_role: UserRole) -> None:
    """从用户角色专属文件夹加载所有聊天历史到缓存"""
    try:
        cache_key = get_user_cache_key(user_id, user_role)

        # 确保用户在缓存中有记录
        if cache_key not in chat_history_cache:
            chat_history_cache[cache_key] = {}

        # 获取用户角色专属目录
        user_dir = get_user_chat_directory(user_id, user_role)

        # 查找用户目录下的所有聊天文件
        pattern = "chat_*.json"
        chat_files = list(user_dir.glob(pattern))

        folder_name = f"{user_role.value}_{user_id}"
        logger.info(f"在角色目录 {folder_name} 中找到 {len(chat_files)} 个聊天历史文件")

        # 重置用户的聊天缓存，重新加载所有文件
        chat_history_cache[cache_key] = {}

        for chat_file in chat_files:
            try:
                # 从文件名提取chat_id (去掉 "chat_" 前缀和 ".json" 后缀)
                filename = chat_file.stem
                if filename.startswith("chat_"):
                    chat_id = filename[5:]  # 去掉 "chat_" 前缀

                    with open(chat_file, "r", encoding="utf-8") as f:
                        chat_data = json.load(f)

                    # 验证数据有效性
                    if isinstance(chat_data, dict) and "created_at" in chat_data:
                        # 确保messages字段存在
                        if "messages" not in chat_data:
                            chat_data["messages"] = []

                        # 确保有用户ID和角色信息
                        if "user_id" not in chat_data:
                            chat_data["user_id"] = user_id
                        if "user_role" not in chat_data:
                            chat_data["user_role"] = user_role.value

                        # 确保有最后更新时间
                        if "last_updated" not in chat_data:
                            chat_data["last_updated"] = chat_data.get("created_at", datetime.now().isoformat())

                        chat_history_cache[cache_key][chat_id] = chat_data
                        logger.debug(
                            f"成功从角色目录加载聊天记录: {folder_name}/chat_{chat_id}.json, 消息数: {len(chat_data.get('messages', []))}")
                    else:
                        logger.warning(f"角色目录中聊天文件数据格式不正确: {chat_file}")

            except Exception as file_error:
                logger.error(f"加载角色目录中单个聊天文件失败 {chat_file}: {str(file_error)}")
                continue

        logger.info(
            f"用户 {folder_name} 聊天历史从角色专属目录加载完成，共 {len(chat_history_cache.get(cache_key, {}))} 条记录")

    except Exception as e:
        logger.error(f"从用户角色专属目录加载聊天历史失败: {str(e)}")


def get_chat_preview(messages: List[Dict[str, str]]) -> str:
    """获取聊天预览文本"""
    if not messages:
        return "新对话"

    # 优先显示用户的第一条消息
    for msg in messages:
        if msg.get("role") == "user":
            content = msg.get("content", "").strip()
            if content:
                return content[:50] + ("..." if len(content) > 50 else "")

    # 如果没有用户消息，找第一条有内容的消息
    for msg in messages:
        content = msg.get("content", "").strip()
        if content:
            return content[:50] + ("..." if len(content) > 50 else "")

    return "新对话"


def get_user_storage_info(user_id: str, user_role: UserRole) -> Dict[str, Any]:
    """获取用户角色存储信息统计"""
    try:
        user_dir = get_user_chat_directory(user_id, user_role)
        chat_files = list(user_dir.glob("chat_*.json"))

        total_size = sum(f.stat().st_size for f in chat_files if f.exists())
        folder_name = f"{user_role.value}_{user_id}"

        return {
            "user_id": user_id,
            "user_role": user_role.value,
            "folder_name": folder_name,
            "chat_count": len(chat_files),
            "storage_path": str(user_dir),
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / 1024 / 1024, 2)
        }
    except Exception as e:
        logger.error(f"获取用户角色存储信息失败: {str(e)}")
        return {
            "user_id": user_id,
            "user_role": user_role.value,
            "folder_name": f"{user_role.value}_{user_id}",
            "chat_count": 0,
            "storage_path": "",
            "total_size_bytes": 0,
            "total_size_mb": 0
        }


async def get_chat_history(user_id: str, user_role: UserRole, chat_id: Optional[str] = None, limit: int = 20) -> Dict[
    str, Any]:
    """从用户角色专属目录获取聊天历史"""
    cache_key = get_user_cache_key(user_id, user_role)
    folder_name = f"{user_role.value}_{user_id}"

    logger.info(f"从角色专属目录获取聊天历史: {folder_name}, chat_id={chat_id}, limit={limit}")

    # 确保缓存中有用户数据
    if cache_key not in chat_history_cache:
        logger.info(f"用户 {folder_name} 不在缓存中，开始从角色专属目录加载历史记录")
        chat_history_cache[cache_key] = {}

    # 总是重新加载用户的所有聊天历史，确保数据最新
    load_user_chat_histories(user_id, user_role)

    # 如果请求特定聊天ID
    if chat_id:
        if chat_id in chat_history_cache[cache_key]:
            logger.info(f"从缓存返回聊天记录: {folder_name}/chat_{chat_id}.json")
            return chat_history_cache[cache_key][chat_id]

        # 从用户角色专属文件夹加载
        history_data = load_chat_history_from_file(user_id, user_role, chat_id)
        if history_data:
            chat_history_cache[cache_key][chat_id] = history_data
            logger.info(f"从角色专属目录加载聊天记录: {folder_name}/chat_{chat_id}.json")
            return history_data

        logger.warning(f"在角色专属目录中未找到聊天记录: {folder_name}/chat_{chat_id}.json")
        return {"messages": [], "created_at": ""}

    # 返回用户的所有对话历史列表
    user_chats = chat_history_cache[cache_key]
    logger.info(f"用户 {folder_name} 角色专属目录缓存中有 {len(user_chats)} 条聊天记录")

    if not user_chats:
        logger.info(f"用户 {folder_name} 角色专属目录中没有聊天历史")
        return {
            "chats": [],
            "storage_info": get_user_storage_info(user_id, user_role)
        }

    # 按创建时间排序，返回最近的聊天记录
    try:
        valid_chats = []
        for cid, data in user_chats.items():
            # 检查数据有效性
            if not isinstance(data, dict):
                continue

            messages = data.get("messages", [])
            created_at = data.get("created_at", "")

            # 只要有created_at就认为是有效对话
            if created_at:
                # 计算有效消息数量（排除空的AI回复）
                valid_message_count = 0
                for msg in messages:
                    if msg.get("role") == "user":
                        valid_message_count += 1
                    elif msg.get("role") == "assistant" and msg.get("content", "").strip():
                        valid_message_count += 1

                valid_chats.append((cid, data, valid_message_count))

        # 按最后更新时间或创建时间排序
        sorted_chats = sorted(
            valid_chats,
            key=lambda x: x[1].get("last_updated", x[1].get("created_at", "")),
            reverse=True
        )[:limit]

        result = {
            "chats": [
                {
                    "chat_id": cid,
                    "created_at": data.get("created_at", ""),
                    "last_updated": data.get("last_updated", data.get("created_at", "")),
                    "preview": get_chat_preview(data.get("messages", [])),
                    "message_count": valid_count,
                    "user_role": data.get("user_role", user_role.value)
                }
                for cid, data, valid_count in sorted_chats
            ],
            "storage_info": get_user_storage_info(user_id, user_role)
        }

        logger.info(f"从角色专属目录返回 {len(result['chats'])} 条聊天历史，总共找到 {len(valid_chats)} 条有效对话")
        return result

    except Exception as e:
        logger.error(f"处理角色专属目录聊天历史时出错: {str(e)}")
        return {
            "chats": [],
            "storage_info": get_user_storage_info(user_id, user_role)
        }


async def process_chat_request(
        request: ChatRequest,
        user_id: str,
        user_role: UserRole
) -> AsyncGenerator[ChatStreamResponse, None]:
    """处理聊天请求并将历史保存到用户角色专属文件夹"""
    folder_name = f"{user_role.value}_{user_id}"
    logger.info(f"处理聊天请求: 用户角色目录={folder_name}")

    # 记录用户角色专属目录信息
    user_dir = get_user_chat_directory(user_id, user_role)
    logger.info(f"用户 {folder_name} 的聊天记录将保存到: {user_dir}")

    # 确定聊天ID：如果请求中有chat_id则使用，否则生成新的
    chat_id = request.chat_id if request.chat_id else str(uuid.uuid4())
    is_new_chat = not request.chat_id

    # 如果是新对话，立即创建初始历史记录到用户角色专属文件夹
    if is_new_chat:
        create_initial_chat_history(chat_id, user_id, user_role, request.messages)
    else:
        # 现有对话：立即追加用户消息到用户角色专属文件夹
        append_user_messages_to_history(chat_id, user_id, user_role, request.messages)

    # 只在没有AI回复占位符时才初始化
    cache_key = get_user_cache_key(user_id, user_role)
    if cache_key in chat_history_cache and chat_id in chat_history_cache[cache_key]:
        messages = chat_history_cache[cache_key][chat_id]["messages"]
        # 检查最后一条消息是否为空的AI回复
        has_empty_assistant = (
                messages and
                messages[-1].get("role") == "assistant" and
                not messages[-1].get("content", "").strip()
        )

        if not has_empty_assistant:
            initialize_assistant_response_in_history(chat_id, user_id, user_role)
    else:
        initialize_assistant_response_in_history(chat_id, user_id, user_role)

    try:
        # 准备系统提示词
        system_prompt = get_system_prompt(user_role)

        # 构建完整消息列表，包括系统提示
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        # 如果是现有对话，加载历史消息（排除刚刚初始化的空AI回复）
        if not is_new_chat:
            history_messages = get_chat_messages_history(user_id, user_role, chat_id)
            # 过滤掉系统消息和空的AI回复，只保留用户和有内容的助手对话
            for msg in history_messages:
                if (msg.get("role") in ["user", "assistant"] and
                        not (msg.get("role") == "assistant" and not msg.get("content", "").strip())):
                    messages.append(msg)

        # 添加当前用户消息
        for msg in request.messages:
            messages.append({
                "role": msg.role.value,
                "content": msg.content
            })

        logger.info(f"发送到AI的消息数量: {len(messages)}")

        # 调用AI服务获取回答
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            stream=True
        )

        # 处理流式响应
        full_content = ""
        chunk_count = 0

        for chunk in response:
            if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content:
                content_chunk = chunk.choices[0].delta.content
                full_content += content_chunk
                chunk_count += 1

                # 实时保存：每5个chunk或者内容长度达到100的倍数时保存一次到用户角色专属文件夹
                should_save = (chunk_count % 5 == 0) or (len(full_content) % 100 < 20)
                update_assistant_response_in_history(
                    chat_id,
                    user_id,
                    user_role,
                    full_content,
                    force_save=should_save
                )

                # 返回当前累积的响应
                yield ChatStreamResponse(
                    chat_id=chat_id,
                    content=full_content,
                    is_complete=False
                )

        # 最终完整响应 - 强制保存最终结果到用户角色专属文件夹
        update_assistant_response_in_history(
            chat_id,
            user_id,
            user_role,
            full_content,
            force_save=True
        )

        yield ChatStreamResponse(
            chat_id=chat_id,
            content=full_content,
            is_complete=True
        )

        # 记录完成信息
        chat_file_path = get_chat_file_path(user_id, user_role, chat_id)
        logger.info(f"聊天请求处理完成: 角色目录={folder_name}, 聊天ID={chat_id}, 最终内容长度={len(full_content)}")
        logger.info(f"聊天记录已保存到: {chat_file_path}")

    except Exception as e:
        logger.error(f"聊天请求处理失败: {str(e)}")

        # 即使出错也要保存错误信息到用户角色专属文件夹
        error_content = f"处理请求时发生错误: {str(e)}"
        update_assistant_response_in_history(
            chat_id,
            user_id,
            user_role,
            error_content,
            force_save=True
        )

        yield ChatStreamResponse(
            chat_id=chat_id,
            content=error_content,
            is_complete=True
        )