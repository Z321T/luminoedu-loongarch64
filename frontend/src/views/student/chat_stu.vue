<template>
  <div class="student-layout">
    <Sidebar :menuItems="studentMenuItems" />
    <div class="main">
      <PageHeader title="LuminoEdu 学习助手">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
      </PageHeader>
      <div class="chat-container">
        <div class="history-panel">
          <div class="history-header">
            <h3>历史对话</h3>
            <button class="new-chat-btn" :disabled="isReplying" @click="startNewChat">新对话</button>
          </div>
          <div v-if="historyLoading" class="history-loading">加载中...</div>
          <ul v-else class="history-list">
            <li v-for="item in chatHistory"
                :key="item.chat_id"
                :class="{ active: item.chat_id === activeChatId }"
                @click="loadChatSession(item.chat_id)">
              <div class="history-preview">{{ item.preview }}</div>
              <div class="history-meta">
                <span class="history-date">{{ formatDate(item.created_at) }}</span>
                <span v-if="item.model" class="history-model">{{ getModelDisplayName(item.model) }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="chat-window">
          <div class="messages-area" ref="messagesAreaRef">
            <div v-if="messages.length === 0" class="welcome-message">
              <div class="welcome-icon">🤖</div>
              <h2>欢迎使用 LuminoEdu 学习助手</h2>
              <div>请选择AI模型并在下方输入您的问题</div>
            </div>
            <div v-else>
              <div v-for="(msg, idx) in messages" :key="idx" :class="['message-wrapper', msg.role]">
                <div class="message-bubble">
                  <div class="message-content">{{ msg.content }}</div>
                  <div v-if="msg.role === 'assistant' && isReplying && idx === messages.length - 1" class="typing-cursor">|</div>
                </div>
              </div>
            </div>
          </div>
          <div class="input-area">
            <!-- 模型选择区域 -->
            <div class="model-selector">
              <label for="model-select">AI模型:</label>
              <select
                  id="model-select"
                  v-model="selectedModel"
                  :disabled="isReplying"
                  @change="onModelChange"
              >
                <option v-for="model in availableModels" :key="model.id" :value="model.id">
                  {{ model.name }}
                </option>
              </select>
            </div>
            <!-- 输入区域 -->
            <div class="message-input">
              <textarea
                  v-model="userInput"
                  :disabled="isReplying"
                  placeholder="请输入您的问题..."
                  @keydown.enter.prevent="sendMessage"
              ></textarea>
              <button :disabled="isReplying || !userInput.trim()" @click="sendMessage">发送</button>
            </div>
            <div v-if="isReplying" class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getChatHistoryList,
  getChatSession,
  streamChat,
  getAvailableModels,
  type ChatHistoryPreview,
  type ChatMessage,
  type ModelInfo,
  AIModel,
} from '@/api/student/chat_stu'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '学生')

const studentMenuItems = [
  { path: '/student/course', label: '我的课程' },
  { path: '/student/chat', label: '学习助手' },
  { path: '/student/exercise_generate', label: '习题生成' },
  { path: '/student/profile', label: '个人信息' },
]

const chatHistory = ref<ChatHistoryPreview[]>([])
const historyLoading = ref(false)
const messages = ref<ChatMessage[]>([])
const activeChatId = ref<string | null>(null)
const userInput = ref('')
const isReplying = ref(false)
const messagesAreaRef = ref<HTMLElement | null>(null)

// 模型相关状态
const availableModels = ref<ModelInfo[]>([])
const selectedModel = ref<AIModel>(AIModel.KIMI)

// 获取模型显示名称
const getModelDisplayName = (modelId: string): string => {
  const model = availableModels.value.find(m => m.id === modelId)
  return model ? model.name : modelId
}

// 加载可用模型
const loadAvailableModels = async () => {
  try {
    const res = await getAvailableModels()
    availableModels.value = res.models
    selectedModel.value = (res.default as AIModel) || AIModel.KIMI
    console.log('可用模型:', availableModels.value)
  } catch (error) {
    console.error('加载模型列表失败:', error)
    // 设置默认模型
    availableModels.value = [
      { id: AIModel.KIMI, name: 'Kimi', description: 'Kimi 模型' },
      { id: AIModel.DEEPSEEK, name: 'DeepSeek', description: 'DeepSeek 模型' }
    ]
    selectedModel.value = AIModel.KIMI
  }
}

// 模型切换处理
const onModelChange = () => {
  console.log('切换到模型:', selectedModel.value)
  // 如果当前有对话，可以考虑提示用户模型切换会影响新消息
}


// 打字效果相关状态
const typewriterQueue = ref<string[]>([])
const currentAssistantMessage = ref<ChatMessage | null>(null)
let typewriterTimer: ReturnType<typeof setInterval> | null = null

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesAreaRef.value) {
      messagesAreaRef.value.scrollTop = messagesAreaRef.value.scrollHeight
    }
  })
}

// 打字效果函数
const startTypewriter = () => {
  if (typewriterTimer) {
    clearInterval(typewriterTimer)
  }

  typewriterTimer = setInterval(() => {
    if (typewriterQueue.value.length === 0) {
      clearInterval(typewriterTimer!)
      typewriterTimer = null
      return
    }

    // 添加安全检查
    if (!currentAssistantMessage.value) {
      console.warn('当前助手消息引用为空，停止打字效果')
      typewriterQueue.value = []
      clearInterval(typewriterTimer!)
      typewriterTimer = null
      return
    }

    const nextChar = typewriterQueue.value.shift()!
    currentAssistantMessage.value.content += nextChar
    scrollToBottom()
  }, 30)
}

// 添加文本到打字队列
const addToTypewriterQueue = (text: string) => {
  typewriterQueue.value.push(...text.split(''))
  if (!typewriterTimer) {
    startTypewriter()
  }
}

// 停止打字效果
const stopTypewriter = () => {
  if (typewriterTimer) {
    clearInterval(typewriterTimer)
    typewriterTimer = null
  }
  // 立即显示剩余的所有文本
  if (currentAssistantMessage.value && typewriterQueue.value.length > 0) {
    currentAssistantMessage.value.content += typewriterQueue.value.join('')
    typewriterQueue.value = []
    scrollToBottom()
  }
  // 如果没有当前消息引用但还有队列，说明可能有问题
  else if (typewriterQueue.value.length > 0) {
    console.warn('打字队列中还有内容，但没有当前消息引用')
    typewriterQueue.value = []
  }
}

const loadHistory = async () => {
  historyLoading.value = true
  try {
    console.log('开始加载聊天历史...')
    const res = await getChatHistoryList()
    console.log('聊天历史响应:', res)

    if (res && Array.isArray(res.chats)) {
      chatHistory.value = res.chats
      console.log(`成功加载 ${res.chats.length} 条历史记录:`, res.chats)
    } else if (res && res.chats) {
      // 如果chats不是数组，尝试转换
      chatHistory.value = []
      console.warn('历史记录格式异常:', res)
    } else {
      console.warn('历史记录响应格式不正确:', res)
      chatHistory.value = []
    }
  } catch (error) {
    console.error('加载聊天历史失败:', error)
    chatHistory.value = []

    // 更详细的错误提示
    if (error instanceof Error) {
      console.error('错误详情:', error.message)
      if (error.message.includes('401')) {
        alert('登录已过期，请重新登录')
        handleLogout()
      } else if (error.message.includes('404')) {
        console.log('暂无历史记录')
      } else {
        console.error(`加载聊天历史失败: ${error.message}`)
      }
    } else {
      console.error('未知错误:', error)
    }
  } finally {
    historyLoading.value = false
  }
}

const loadChatSession = async (chatId: string) => {
  if (isReplying.value) return

  // 停止当前的打字效果
  stopTypewriter()

  activeChatId.value = chatId
  try {
    const res = await getChatSession(chatId)
    messages.value = res.messages
    scrollToBottom()
  } catch (error) {
    console.error('加载对话内容失败:', error)
    alert('加载对话内容失败')
  }
}

const startNewChat = () => {
  if (isReplying.value) return

  // 停止当前的打字效果
  stopTypewriter()

  activeChatId.value = null
  messages.value = []
  userInput.value = ''
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isReplying.value) return

  const userMessage: ChatMessage = { role: 'user', content: userInput.value }
  messages.value.push(userMessage)
  userInput.value = ''
  isReplying.value = true
  scrollToBottom()

  const assistantMessage: ChatMessage = { role: 'assistant', content: '' }
  messages.value.push(assistantMessage)
  currentAssistantMessage.value = assistantMessage
  scrollToBottom()

  let isNewChat = activeChatId.value === null

  try {
    await streamChat(
        {
          messages: messages.value.slice(0, -1),
          chat_id: activeChatId.value,
          model: selectedModel.value,
          max_tokens: 4096,
          temperature: 0.7,
          stream: true,
        },
        (chunk, chatId) => {
          if (chunk) {
            addToTypewriterQueue(chunk)
          }

          if (isNewChat && chatId && !activeChatId.value) {
            activeChatId.value = chatId
            isNewChat = false
            loadHistory()
          }
        }
    )
  } catch (error) {
    stopTypewriter()
    const errorMessage = error instanceof Error ? error.message : String(error)
    assistantMessage.content = `抱歉，出错了: ${errorMessage}`
    console.error('发送消息失败:', error)
  } finally {
    isReplying.value = false

    const waitForTypewriterComplete = () => {
      if (typewriterQueue.value.length > 0 || typewriterTimer !== null) {
        setTimeout(waitForTypewriterComplete, 50)
      } else {
        currentAssistantMessage.value = null
      }
    }

    setTimeout(() => {
      stopTypewriter()
      waitForTypewriterComplete()
    }, 100)

    if (isNewChat && activeChatId.value) {
      await loadHistory()
    }
    scrollToBottom()
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    // 停止打字效果
    stopTypewriter()
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

onMounted(() => {
  loadAvailableModels()
  loadHistory()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopTypewriter()
})
</script>

<style scoped>
.student-layout { display: flex; height: 100vh; width: 100vw; background: #f5f6fa; overflow: hidden; }
.main { position: relative; flex: 1; margin-left: 240px; display: flex; flex-direction: column; overflow: hidden; }
.header-user { position: absolute; top: 24px; right: 48px; display: flex; align-items: center; gap: 16px; z-index: 10; }
.logout-btn { background: #e74c3c; color: #fff; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; transition: background 0.3s; font-weight: 500; }
.logout-btn:hover { background: #c0392b; }
.chat-container { flex-grow: 1; display: flex; padding: 24px; gap: 24px; height: calc(100% - 80px); box-sizing: border-box; }
.history-panel { width: 280px; flex-shrink: 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; }
.history-header { padding: 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.history-header h3 { margin: 0; font-size: 16px; color: #2d3748; }
.new-chat-btn { background: #3182ce; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; }
.new-chat-btn:hover:not(:disabled) { background: #2c5aa0; }
.new-chat-btn:disabled { background-color: #a0aec0; cursor: not-allowed; }
.history-list { list-style: none; margin: 0; padding: 8px; overflow-y: auto; flex-grow: 1; }
.history-list li { padding: 12px; border-radius: 6px; cursor: pointer; transition: background-color 0.2s; border-bottom: 1px solid #f7fafc; }
.history-list li:hover { background-color: #f7fafc; }
.history-list li.active { background-color: #ebf8ff; border-left: 3px solid #3182ce; }
.history-preview { margin: 0 0 4px; color: #4a5568; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.history-meta { display: flex; justify-content: space-between; align-items: center; }
.history-date { font-size: 12px; color: #a0aec0; }
.history-model { font-size: 11px; background: #e2e8f0; color: #4a5568; padding: 2px 6px; border-radius: 4px; }
.history-loading { text-align: center; padding: 20px; color: #718096; }
.chat-window { flex-grow: 1; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow: hidden; }
.messages-area { flex-grow: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
.welcome-message { text-align: center; margin: auto; color: #718096; }
.welcome-icon { font-size: 48px; margin-bottom: 16px; }
.welcome-message h2 { color: #2d3748; }
.message-wrapper { display: flex; max-width: 80%; }
.message-wrapper.user { justify-content: flex-end; margin-left: auto; }
.message-wrapper.assistant { justify-content: flex-start; margin-right: auto; }
.message-bubble { padding: 12px 16px; border-radius: 18px; line-height: 1.6; position: relative; }
.message-wrapper.user .message-bubble { background-color: #3182ce; color: white; border-bottom-right-radius: 4px; }
.message-wrapper.assistant .message-bubble { background-color: #edf2f7; color: #2d3748; border-bottom-left-radius: 4px; }
.message-content { white-space: pre-wrap; word-break: break-word; }

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.input-area { padding: 16px 24px; border-top: 1px solid #e2e8f0; background-color: #fdfdfd; }
.model-selector { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.model-selector label { font-size: 14px; color: #4a5568; font-weight: 500; min-width: 60px; }
.model-selector select { padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: white; cursor: pointer; transition: border-color 0.2s; }
.model-selector select:focus { outline: none; border-color: #3182ce; }
.model-selector select:disabled { background-color: #f7fafc; cursor: not-allowed; }
.message-input { display: flex; gap: 12px; }
.message-input textarea { flex-grow: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none; font-size: 14px; font-family: inherit; height: 50px; transition: border-color 0.2s; }
.message-input textarea:focus { outline: none; border-color: #3182ce; }
.message-input textarea:disabled { background-color: #f7fafc; }
.message-input button { flex-shrink: 0; padding: 0 24px; border: none; background-color: #3182ce; color: white; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s; }
.message-input button:hover:not(:disabled) { background-color: #2b6cb0; }
.message-input button:disabled { background-color: #a0aec0; cursor: not-allowed; }
.typing-indicator { padding: 10px 0; text-align: center; }
.typing-indicator span { height: 8px; width: 8px; background-color: #a0aec0; border-radius: 50%; display: inline-block; animation: wave 1.3s infinite; margin: 0 2px; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes wave { 0%, 60%, 100% { transform: initial; } 30% { transform: translateY(-8px); } }
</style>