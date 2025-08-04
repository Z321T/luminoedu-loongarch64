<template>
  <div class="student-layout">
    <!-- 侧边栏 -->
    <Sidebar :menuItems="studentMenuItems" />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="个人信息">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button
                class="logout-btn"
                @click="handleLogout"
            >退出登录</button>
          </div>
        </template>
      </PageHeader>

      <section class="content">
        <div class="profile-container">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading">加载中...</div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="error-state">
            {{ error }}
            <button @click="loadProfile" class="retry-btn">重新加载</button>
          </div>

          <!-- 个人信息内容 -->
          <div v-else class="profile-content">
            <!-- 基本信息卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h2>基本信息</h2>
              </div>
              <div class="card-body">
                <div class="info-grid">
                  <div class="info-item">
                    <label>姓名：</label>
                    <span>{{ profile?.username }}</span>
                  </div>
                  <div class="info-item">
                    <label>学号：</label>
                    <span>{{ profile?.student_id }}</span>
                  </div>
                  <div class="info-item">
                    <label>学院：</label>
                    <span>{{ profile?.college }}</span>
                  </div>
                  <div class="info-item">
                    <label>专业：</label>
                    <span>{{ profile?.major }}</span>
                  </div>
                  <div class="info-item">
                    <label>年级：</label>
                    <span>{{ profile?.grade }}</span>
                  </div>
                  <div class="info-item">
                    <label>入学年份：</label>
                    <span>{{ profile?.enrollment_year }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 可编辑信息卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h2>个人资料</h2>
                <button
                  class="edit-btn"
                  @click="toggleEditMode"
                  :disabled="updating"
                >
                  {{ editMode ? '取消编辑' : '编辑资料' }}
                </button>
              </div>
              <div class="card-body">
                <form @submit.prevent="updateProfile">
                  <div class="form-group">
                    <label>个人简介：</label>
                    <textarea
                      v-model="editForm.intro"
                      :readonly="!editMode"
                      placeholder="请输入个人简介"
                      rows="4"
                      class="form-input"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>联系邮箱：</label>
                    <input
                      type="email"
                      v-model="editForm.contact_email"
                      :readonly="!editMode"
                      placeholder="请输入联系邮箱"
                      class="form-input"
                    />
                  </div>
                  <div v-if="editMode" class="form-actions">
                    <button
                      type="submit"
                      class="save-btn"
                      :disabled="updating"
                    >
                      {{ updating ? '保存中...' : '保存修改' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 密码修改卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h2>密码管理</h2>
                <button
                    class="edit-btn"
                    @click="togglePasswordMode"
                    :disabled="changingPassword"
                >
                  {{ passwordMode ? '取消修改' : '修改密码' }}
                </button>
              </div>
              <div class="card-body">
                <form v-if="passwordMode" @submit.prevent="changeUserPassword">
                  <div class="form-group">
                    <label>当前密码：</label>
                    <input
                        type="password"
                        v-model="passwordForm.current_password"
                        placeholder="请输入当前密码"
                        class="form-input"
                        required
                    />
                  </div>
                  <div class="form-group">
                    <label>新密码：</label>
                    <input
                        type="password"
                        v-model="passwordForm.new_password"
                        placeholder="请输入新密码"
                        class="form-input"
                        :class="{ 'input-error': passwordValidationErrors.length > 0 }"
                        required
                        @input="validatePassword"
                    />
                    <!-- 密码要求提示 -->
                    <div class="password-requirements">
                      <p class="requirements-title">密码要求：</p>
                      <ul class="requirements-list">
                        <li :class="{ 'valid': passwordChecks.length }">至少6位字符</li>
                        <li :class="{ 'valid': passwordChecks.uppercase }">包含大写字母</li>
                        <li :class="{ 'valid': passwordChecks.lowercase }">包含小写字母</li>
                        <li :class="{ 'valid': passwordChecks.number }">包含数字</li>
                        <li :class="{ 'valid': passwordChecks.special }">包含特殊字符 (!@#$%^&*(),.?":{}|<>)</li>
                      </ul>
                    </div>
                    <!-- 密码验证错误 -->
                    <div v-if="passwordValidationErrors.length > 0" class="validation-errors">
                      <div v-for="error in passwordValidationErrors" :key="error" class="error-item">
                        {{ error }}
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>确认新密码：</label>
                    <input
                        type="password"
                        v-model="confirmPassword"
                        placeholder="请再次输入新密码"
                        class="form-input"
                        :class="{ 'input-error': confirmPasswordError }"
                        required
                    />
                    <div v-if="confirmPasswordError" class="password-error">
                      {{ confirmPasswordError }}
                    </div>
                  </div>
                  <div class="form-actions">
                    <button
                        type="submit"
                        class="save-btn"
                        :disabled="changingPassword || !isPasswordValid"
                    >
                      {{ changingPassword ? '修改中...' : '确认修改' }}
                    </button>
                  </div>
                </form>
                <div v-else class="password-placeholder">
                  <p>点击"修改密码"按钮来更改您的登录密码</p>
                  <div class="password-tip">
                    <p><strong>密码要求：</strong></p>
                    <ul>
                      <li>至少6位字符</li>
                      <li>包含大写字母、小写字母、数字和特殊字符</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  type UserProfile,
  type UpdateProfileRequest,
  type ChangePasswordRequest
} from '@/api/student/profile'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '学生')

const studentMenuItems = [
  { path: '/student/course', label: '我的课程' },
  { path: '/student/chat', label: '学习助手' },
  { path: '/student/exercise_generate', label: '习题生成' },
  { path: '/student/profile', label: '个人信息' },
]

// 数据状态
const loading = ref(false)
const error = ref('')
const profile = ref<UserProfile | null>(null)

// 编辑状态
const editMode = ref(false)
const updating = ref(false)
const editForm = ref<UpdateProfileRequest>({
  intro: '',
  contact_email: ''
})

// 密码修改状态
const passwordMode = ref(false)
const changingPassword = ref(false)
const passwordForm = ref<ChangePasswordRequest>({
  current_password: '',
  new_password: ''
})
const confirmPassword = ref('')

// 密码验证状态
const passwordValidationErrors = ref<string[]>([])

// 密码复杂度检查
const passwordChecks = computed(() => {
  const password = passwordForm.value.new_password
  return {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

// 确认密码错误
const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return ''
  if (passwordForm.value.new_password !== confirmPassword.value) {
    return '两次输入的密码不一致'
  }
  return ''
})

// 密码是否有效
const isPasswordValid = computed(() => {
  const checks = passwordChecks.value
  const isComplexityValid = checks.length && checks.uppercase && checks.lowercase && checks.number && checks.special
  const isConfirmValid = passwordForm.value.new_password === confirmPassword.value && confirmPassword.value.length > 0
  const hasCurrentPassword = passwordForm.value.current_password.length > 0

  return isComplexityValid && isConfirmValid && hasCurrentPassword
})

// 验证密码复杂度
const validatePassword = () => {
  const password = passwordForm.value.new_password
  const errors: string[] = []

  if (password.length > 0) {
    if (password.length < 6) {
      errors.push('密码至少需要6位字符')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('密码必须包含至少一个大写字母')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('密码必须包含至少一个小写字母')
    }
    if (!/\d/.test(password)) {
      errors.push('密码必须包含至少一个数字')
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('密码必须包含至少一个特殊字符')
    }
  }

  passwordValidationErrors.value = errors
}

// 监听密码变化
watch(() => passwordForm.value.new_password, validatePassword)


// 加载用户信息
const loadProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    profile.value = await getUserProfile()
    // 初始化编辑表单
    editForm.value = {
      intro: profile.value.intro || '',
      contact_email: profile.value.contact_email || ''
    }
  } catch (err: any) {
    console.error('获取用户信息失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 切换编辑模式
const toggleEditMode = () => {
  if (editMode.value) {
    // 取消编辑，恢复原始数据
    editForm.value = {
      intro: profile.value?.intro || '',
      contact_email: profile.value?.contact_email || ''
    }
  }
  editMode.value = !editMode.value
}

// 更新个人信息
const updateProfile = async () => {
  if (updating.value) return

  updating.value = true
  try {
    const result = await updateUserProfile(editForm.value)

    if (result.status === 'success') {
      alert('个人信息更新成功！')
      editMode.value = false
      // 重新加载用户信息
      await loadProfile()
    } else {
      throw new Error(result.message || '更新失败')
    }
  } catch (err: any) {
    console.error('更新个人信息失败:', err)
    alert('更新失败：' + err.message)
  } finally {
    updating.value = false
  }
}

// 切换密码修改模式
const togglePasswordMode = () => {
  if (passwordMode.value) {
    // 取消修改，清空表单
    passwordForm.value = {
      current_password: '',
      new_password: ''
    }
    confirmPassword.value = ''
    passwordValidationErrors.value = []
  }
  passwordMode.value = !passwordMode.value
}

// 修改密码
const changeUserPassword = async () => {
  if (changingPassword.value || !isPasswordValid.value) return

  changingPassword.value = true
  try {
    const result = await changePassword(passwordForm.value)

    if (result.status === 'success') {
      alert('密码修改成功！请重新登录。')
      // 清空表单
      passwordForm.value = {
        current_password: '',
        new_password: ''
      }
      confirmPassword.value = ''
      passwordValidationErrors.value = []
      passwordMode.value = false

      // 退出登录
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      router.push('/login')
    } else {
      throw new Error(result.message || '密码修改失败')
    }
  } catch (err: any) {
    console.error('修改密码失败:', err)
    alert('密码修改失败：' + err.message)
  } finally {
    changingPassword.value = false
  }
}

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.header-user {
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.logout-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.logout-btn:hover {
  background: #c0392b;
}

.student-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f5f6fa;
  overflow: hidden;
}

.main {
  position: relative;
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.loading,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  font-size: 16px;
}

.error-state {
  color: #e53e3e;
}

.retry-btn {
  margin-top: 12px;
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #2c5aa0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 18px;
}

.edit-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.edit-btn:hover:not(:disabled) {
  background: #2c5aa0;
}

.edit-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #a0aec0;
}

.card-body {
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  color: #4a5568;
  min-width: 100px;
}

.info-item span {
  color: #2d3748;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-input:read-only {
  background: #f7fafc;
  color: #718096;
}

.form-input textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.save-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: #2f855a;
}

.save-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #a0aec0;
}

.password-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.password-error {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 8px;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }

  .content {
    padding: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>