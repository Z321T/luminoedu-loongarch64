<template>
  <div class="teacher-layout">
    <SideBar
      :menuItems="teacherMenuItems"
      :activeItem="'/teacher/chat'"
      @menuClick="handleMenuClick"
    />
    <div class="main">
      <PageHeader title="LuminoEdu 教学助手">
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
              <div class="history-date">{{ formatDate(item.created_at) }}</div>
            </li>
          </ul>
        </div>
        <div class="chat-window">
          <div class="messages-area" ref="messagesAreaRef">
            <div v-if="messages.length === 0" class="welcome-message">
              <div class="welcome-icon">🎓</div>
              <h2>欢迎使用 LuminoEdu 教学助手</h2>
              <div>请在下方输入您的教学问题</div>
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
            <textarea
                v-model="userInput"
                :disabled="isReplying"
                placeholder="请输入您的教学问题，按回车发送"
                @keydown.enter.prevent="sendMessage"
            ></textarea>
            <button :disabled="isReplying || !userInput.trim()" @click="sendMessage">发送</button>
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
import SideBar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getChatHistoryList,
  getChatSession,
  streamChat,
  type ChatHistoryPreview,
  type ChatMessage,
} from '@/api/teacher/chat_th'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '教师')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

const chatHistory = ref<ChatHistoryPreview[]>([])
const historyLoading = ref(false)
const messages = ref<ChatMessage[]>([])
const activeChatId = ref<string | null>(null)
const userInput = ref('')
const isReplying = ref(false)
const messagesAreaRef = ref<HTMLElement | null>(null)

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
          max_tokens: 4096,
          temperature: 0.7,
          stream: true,
        },
        (chunk, chatId) => {
          // 将接收到的文本块添加到打字队列
          if (chunk) {
            addToTypewriterQueue(chunk)
          }

          // 如果是新对话且收到了 chat_id，则更新状态并刷新历史列表
          if (isNewChat && chatId && !activeChatId.value) {
            activeChatId.value = chatId
            isNewChat = false
            loadHistory()
          }
        }
    )
  } catch (error) {
    // 停止打字效果并显示错误
    stopTypewriter()
    const errorMessage = error instanceof Error ? error.message : String(error)
    assistantMessage.content = `抱歉，出错了: ${errorMessage}`
    console.error('发送消息失败:', error)
  } finally {
    isReplying.value = false

    // 等待打字效果完成后再清空引用
    const waitForTypewriterComplete = () => {
      if (typewriterQueue.value.length > 0 || typewriterTimer !== null) {
        setTimeout(waitForTypewriterComplete, 50)
      } else {
        currentAssistantMessage.value = null
      }
    }

    // 确保所有文本都已显示
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

const handleMenuClick = (item: any) => {
  router.push({
    path: item.path,
    query: { _t: Date.now() }
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
  loadHistory()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopTypewriter()
})
</script>

<style scoped>
.teacher-layout { display: flex; height: 100vh; width: 100vw; background: #f5f6fa; overflow: hidden; }
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
.history-date { font-size: 12px; color: #a0aec0; }
.history-loading { text-align: center; padding: 20px; color: #718096; }
.chat-window { flex-grow: 1; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow: hidden; }
.messages-area { flex-grow: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
.welcome-message { text-align: center; margin: auto; color: #718096; }
.welcome-icon { font-size: 48px; margin-bottom: 16px; }
.welcome-message h2 { color: #2d3748; }
.message-wrapper { display: flex; max-width: 80%; }

.message-bubble { padding: 12px 16px; border-radius: 18px; line-height: 1.6; position: relative; }
.message-wrapper.user .message-bubble { background-color: #3182ce; color: white; border-bottom-right-radius: 4px; }
.message-wrapper.assistant .message-bubble { background-color: #edf2f7; color: #2d3748; border-bottom-left-radius: 4px; }
.message-content { white-space: pre-wrap; word-break: break-word; }
.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: #3182ce;
  font-weight: bold;
  margin-left: 2px;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.input-area { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; background-color: #fdfdfd; }
.input-area textarea { flex-grow: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none; font-size: 14px; font-family: inherit; height: 50px; transition: border-color 0.2s; }
.input-area textarea:focus { outline: none; border-color: #3182ce; }
.input-area textarea:disabled { background-color: #f7fafc; }
.input-area button { flex-shrink: 0; padding: 0 24px; border: none; background-color: #3182ce; color: white; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s; }
.input-area button:hover:not(:disabled) { background-color: #2b6cb0; }
.input-area button:disabled { background-color: #a0aec0; cursor: not-allowed; }
.typing-indicator { padding: 10px 0; }
.typing-indicator span { height: 8px; width: 8px; background-color: #a0aec0; border-radius: 50%; display: inline-block; animation: wave 1.3s infinite; margin: 0 2px; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes wave { 0%, 60%, 100% { transform: initial; } 30% { transform: translateY(-8px); } }
</style>