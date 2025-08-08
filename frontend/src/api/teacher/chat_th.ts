import api from '../../utils/http'



// 定义消息类型
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// 定义AI模型枚举
export enum AIModel {
  DEEPSEEK = 'deepseek',
  KIMI = 'kimi'
}

// 定义模型信息
export interface ModelInfo {
  id: string
  name: string
  description: string
}

// 定义发送消息的请求体
export interface ChatRequest {
    messages: ChatMessage[]
    chat_id?: string | null
    model: AIModel
    max_tokens?: number
    temperature?: number
    stream?: boolean
}

// 定义历史聊天记录预览
export interface ChatHistoryPreview {
  chat_id: string
  created_at: string
  preview: string
  model?: string
  message_count?: number
  last_updated?: string
}

// 定义单个聊天会话的完整历史
export interface ChatHistoryDetail {
  messages: ChatMessage[]
  created_at: string
}

// 获取可用模型列表
export const getAvailableModels = async (): Promise<{ models: ModelInfo[], default: string }> => {
  try {
    const response = await api.get('/chat/models')
    return response.data
  } catch (error) {
    console.error('获取模型列表失败:', error)
    throw error
  }
}

// 获取聊天历史记录列表
export const getChatHistoryList = async (limit: number = 50): Promise<{ chats: ChatHistoryPreview[] }> => {
    const response = await api.get('/chat/history', {
        params: { limit }
    })
    return response.data
}

/**
 * 获取指定 chat_id 的完整聊天内容
 * @param chatId 聊天会话ID
 */
export const getChatSession = async (chatId: string): Promise<ChatHistoryDetail> => {
    const response = await api.get('/chat/history', {
        params: { chat_id: chatId }
    })
    return response.data
}

/**
 * 发送聊天消息（用于流式获取响应）
 * @param data 请求体
 */
export const streamChat = async (
    data: ChatRequest,
    onChunk: (content: string, chatId?: string) => void,
    maxRetries: number = 3
) => {
    let retryCount = 0
    let lastContent = ''

    const attemptStream = async (): Promise<void> => {
        const token = localStorage.getItem('token')

        try {
            // 确保设置足够的 token 限制和合理的参数
            const requestData = {
                ...data,
                max_tokens: data.max_tokens || 4096, // 增加 token 限制
                temperature: data.temperature || 0.6,
                stream: true
            }

            const response = await fetch('http://localhost:8000/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(requestData)
            })

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error')
                throw new Error(`服务器错误: ${response.status} - ${errorText}`)
            }

            if (!response.body) {
                throw new Error('响应体为空')
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder('utf-8')
            let buffer = ''
            let isComplete = false

            while (true) {
                const { done, value } = await reader.read()

                if (done) {
                    // 检查是否正常完成
                    if (!isComplete) {
                        console.warn('流式响应意外结束，可能被截断')
                        throw new Error('响应被意外截断')
                    }
                    break
                }

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6).trim()

                        if (jsonStr === '[DONE]') {
                            isComplete = true
                            return // 正常结束
                        }

                        try {
                            const parsed = JSON.parse(jsonStr)

                            // 检查是否完成
                            if (parsed.is_complete === true) {
                                isComplete = true
                            }

                            if (parsed.content) {
                                const currentContent = parsed.content
                                const incrementalContent = currentContent.substring(lastContent.length)

                                if (incrementalContent) {
                                    onChunk(incrementalContent, parsed.chat_id)
                                }
                                lastContent = currentContent
                            }
                        } catch (e) {
                            console.error('解析SSE数据失败:', jsonStr, e)
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`流式请求失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error)

            if (retryCount < maxRetries) {
                retryCount++
                // 指数退避重试
                await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 5000)))
                return attemptStream()
            } else {
                throw error
            }
        }
    }

    return attemptStream()
}