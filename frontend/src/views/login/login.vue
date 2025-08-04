<template>
  <div class="login-container">
    <!-- 动态背景 -->
    <div class="login-background">
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
        <div class="floating-shape shape-5"></div>
      </div>
      <!-- 添加渐变光效 -->
      <div class="gradient-overlay"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="login-content">
      <!-- 登录卡片 -->
      <div class="login-card">
        <!-- 品牌标题 -->
        <div class="brand-header">
          <div class="brand-logo">
            <div class="logo-icon">🎓</div>
            <h1 class="brand-title">LuminoEdu</h1>
          </div>
          <p class="brand-subtitle">数字化教学平台</p>
        </div>

        <!-- 登录表单 -->
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">欢迎登录</h2>
            <p class="form-subtitle">请输入您的账户信息</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            class="login-form"
            @keyup.enter="submitForm"
          >
            <el-form-item
              prop="user_id"
              class="form-item"
            >
              <el-input
                v-model="loginForm.user_id"
                placeholder="请输入用户名"
                class="form-input"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item
              prop="password"
              class="form-item"
            >
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                class="form-input"
                size="large"
                :prefix-icon="Lock"
              />
            </el-form-item>

            <el-button
              type="primary"
              @click="submitForm"
              :loading="loading"
              class="login-btn"
              size="large"
            >
              <span class="btn-text">{{ loading ? '登录中...' : '登录' }}</span>
            </el-button>
          </el-form>
        </div>
      </div>

      <!-- 侧边装饰 -->
      <div class="side-decoration">
        <div class="decoration-content">
          <div class="feature-showcase">
            <div class="feature-item">
              <div class="feature-text">
                <h3>AI辅助教学</h3>
                <p>大模型支持的教学助手</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-text">
                <h3>教学资源制作</h3>
                <p>基于大模型的资源制作服务</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-text">
                <h3>课程发布</h3>
                <p>师生之间便捷的资源传递渠道</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, reactive, onMounted } from 'vue'
import type { AxiosInstance } from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/login/login'

const router = useRouter()
const http = inject<AxiosInstance>('axios')

const loading = ref(false)
import type { FormInstance } from 'element-plus'

const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
  user_id: '',
  password: '',
})

const rules = reactive({
  user_id: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' },
  ],
})

const submitForm = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        if (!http) {
          ElMessage.error('网络未初始化')
          return
        }
        const data = await login(loginForm, http)

        console.log('登录响应数据:', data)

        // 保存认证信息
        if (data.access_token) {
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('token_type', data.token_type || 'Bearer')
          localStorage.setItem('user_id', String(data.user_id || loginForm.user_id))
          localStorage.setItem('username', data.username || loginForm.user_id)
          localStorage.setItem('role', data.role || 'student')

          console.log('用户信息已保存:', {
            token: !!data.access_token,
            role: data.role,
            user_id: data.user_id,
          })
        }

        ElMessage.success('登录成功！')

        // 根据角色跳转
        if (data.role === 'student') {
          await router.push('/student/course')
        } else if (data.role === 'teacher') {
          await router.push('/teacher/course')
        } else if (data.role === 'admin') {
          await router.push('/admin/log_management')
        } else {
          ElMessage.error('未知用户角色，无法跳转')
        }
      } catch (error: any) {
        console.error('登录失败:', error)

        // 处理后端返回的 detail 字段
        let msg = '登录失败'
        if (Array.isArray(error.detail)) {
          msg = error.detail.map((d: any) => d.msg || d).join('; ')
        } else if (typeof error.detail === 'string') {
          msg = error.detail
        } else if (error.message) {
          msg = error.message
        }

        ElMessage.error(msg)
      } finally {
        loading.value = false
      }
    }
  })
}

// 检查是否已登录
onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (token && role) {
    console.log('检测到已登录状态，重定向到对应页面')

    // 如果已登录，直接跳转到对应页面
    if (role === 'admin') {
      router.push('/admin/log_management')
    } else if (role === 'teacher') {
      router.push('/teacher/course')
    } else if (role === 'student') {
      router.push('/student/course')
    }
  }
})
</script>

<style scoped>
/* 容器样式 */
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* 背景动画和效果 */
.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.background-animation {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  animation: float 20s infinite ease-in-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 8%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 10%;
  animation-delay: -5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 15%;
  animation-delay: -10s;
}

.shape-4 {
  width: 60px;
  height: 60px;
  top: 30%;
  right: 30%;
  animation-delay: -15s;
}

.shape-5 {
  width: 140px;
  height: 140px;
  bottom: 10%;
  right: 20%;
  animation-delay: -7s;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(240, 147, 251, 0.3) 0%, transparent 50%);
  animation: gradientShift 15s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-30px) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translateY(-15px) rotate(240deg) scale(0.9);
  }
}

@keyframes gradientShift {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

/* 主内容区域 - 毛玻璃效果 */
.login-content {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  width: 90%;
  max-width: 1000px;
  height: auto;
  max-height: 90vh;
  transition: all 0.3s ease;
}

.login-content:hover {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* 登录卡片 */
.login-card {
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 500px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: inherit;
  pointer-events: none;
}

/* 品牌标题 */
.brand-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.brand-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
  color: rgba(45, 55, 72, 0.8);
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

/* 表单容器 */
.form-container {
  flex: 1;
  position: relative;
  z-index: 2;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-subtitle {
  color: rgba(113, 128, 150, 0.9);
  font-size: 0.95rem;
  margin: 0;
}

/* 表单样式 */
.login-form {
  margin-bottom: 25px;
}

.form-item {
  margin-bottom: 24px;
}

/* 表单选项 */


/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.login-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4), 0 5px 15px rgba(0, 0, 0, 0.15);
}

.login-btn:hover:before {
  left: 100%;
}

.login-btn:disabled {
  background: rgba(189, 195, 199, 0.8);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-text {
  position: relative;
  z-index: 2;
}


/* 侧边装饰 */
.side-decoration {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  min-height: 500px;
  position: relative;
  backdrop-filter: blur(20px);
}

.side-decoration::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.decoration-content {
  width: 100%;
  max-width: 320px;
  position: relative;
  z-index: 2;
}

.feature-showcase {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-text h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-text p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-content {
    grid-template-columns: 1fr;
    width: 95%;
    max-width: 480px;
  }

  .side-decoration {
    order: -1;
    padding: 30px 25px;
    min-height: auto;
  }

  .feature-showcase {
    flex-direction: row;
    justify-content: space-around;
    gap: 20px;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 16px;
  }

  .feature-text h3 {
    font-size: 1rem;
  }

  .feature-text p {
    font-size: 0.85rem;
  }

  .login-card {
    padding: 35px 30px;
    min-height: auto;
  }

  .brand-title {
    font-size: 1.8rem;
  }

  .form-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 20px;
  }

  .login-card {
    padding: 30px 25px;
  }

  .brand-logo {
    flex-direction: column;
    gap: 12px;
  }

  .brand-title {
    font-size: 1.6rem;
  }

  .login-btn {
    height: 48px;
    font-size: 1rem;
  }
}

/* 针对小屏幕高度 */
@media (max-height: 700px) {
  .login-container {
    align-items: flex-start;
    padding: 30px 20px;
  }

  .login-content {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .login-card {
    padding: 30px;
    min-height: auto;
  }

  .brand-header {
    margin-bottom: 25px;
  }

  .form-header {
    margin-bottom: 20px;
  }

  .form-item {
    margin-bottom: 18px;
  }
}

/* 确保大屏幕下的显示效果 */
@media (min-width: 1200px) {
  .login-content {
    max-width: 1200px;
  }

  .login-card {
    padding: 60px;
  }

  .side-decoration {
    padding: 60px;
  }
}
</style>