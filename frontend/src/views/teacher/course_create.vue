<template>
  <div class="teacher-layout">
    <!-- 侧边栏 -->
    <SideBar
        :menuItems="teacherMenuItems"
        :activeItem="'/teacher/course'"
        @menuClick="handleMenuClick"
    />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="创建课程">
        <template #actions>
          <div class="header-user">
            <button
                class="back-btn"
                @click="goBack"
            >
              <span class="back-icon">←</span>
              返回
            </button>
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <section class="content">
        <div class="course-create">
          <div class="create-header">

            <h1>创建新课程</h1>
          </div>

          <form @submit.prevent="handleSubmit" class="course-form">
            <!-- 课程名称 -->
            <div class="form-group">
              <label for="name">
                课程名称 <span class="required">*</span>
              </label>
              <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="请输入课程名称"
                  required
              />
            </div>

            <!-- 学期 -->
            <div class="form-group">
              <label for="semester">
                学期 <span class="required">*</span>
              </label>
              <input
                  id="semester"
                  v-model="formData.semester"
                  type="text"
                  placeholder="如：2024春季学期"
                  required
              />
            </div>

            <!-- 学分 -->
            <div class="form-group">
              <label for="credit">
                学分 <span class="required">*</span>
              </label>
              <input
                  id="credit"
                  v-model.number="formData.credit"
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  placeholder="请输入学分数"
                  required
              />
            </div>

            <!-- 日期范围 -->
            <div class="form-row">
              <div class="form-group">
                <label for="start_date">
                  开始日期 <span class="required">*</span>
                </label>
                <input
                    id="start_date"
                    v-model="formData.start_date"
                    type="date"
                    required
                />
              </div>

              <div class="form-group">
                <label for="end_date">
                  结束日期 <span class="required">*</span>
                </label>
                <input
                    id="end_date"
                    v-model="formData.end_date"
                    type="date"
                    required
                />
              </div>
            </div>

            <!-- 课程描述 -->
            <div class="form-group">
              <label for="description">课程描述</label>
              <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  placeholder="请输入课程描述"
              ></textarea>
            </div>

            <!-- 表单操作 -->
            <div class="form-actions">
              <button
                  type="button"
                  class="cancel-btn"
                  @click="goBack"
              >
                取消
              </button>
              <button
                  type="submit"
                  class="submit-btn"
                  :disabled="isSubmitting"
              >
                {{ isSubmitting ? '创建中...' : '创建课程' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  createCourse,
  type CreateCourseRequest
} from '@/api/teacher/course_th'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '教师')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

const isSubmitting = ref(false)

const formData = reactive<CreateCourseRequest>({
  name: '',
  description: '',
  semester: '',
  credit: 0.5,
  start_date: '',
  end_date: ''
})

// 提交表单
const handleSubmit = async () => {
  // 验证日期
  if (formData.start_date && formData.end_date) {
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    if (startDate >= endDate) {
      alert('结束日期必须晚于开始日期')
      return
    }
  }

  isSubmitting.value = true

  try {
    await createCourse(formData)
    alert('课程创建成功！')
    router.push('/teacher/course')
  } catch (error: any) {
    alert(error.message || '创建课程失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/teacher/course')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

const handleMenuClick = (item: any) => {
  router.push(item.path)
}
</script>

<style scoped>
.teacher-layout {
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

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.course-create {
  width: 100%;
  max-width: 1000px; /* 增大最大宽度 */
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 40px; /* 增大内边距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.create-header {
  margin-bottom: 32px;
}

.back-btn {
  background: #3182ce;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.back-btn:hover {
  background: #edf2f7;
  color: #2d3748;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 16px;
}

.create-header h1 {
  margin: 0;
  color: #2d3748;
  font-size: 28px; /* 增大标题字体 */
}

.course-form {
  display: flex;
  flex-direction: column;
  gap: 28px; /* 增大间距 */
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px; /* 增大间距 */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 增大间距 */
}

.form-group label {
  font-weight: 500;
  color: #2d3748;
  font-size: 15px; /* 增大字体 */
}

.required {
  color: #e53e3e;
}

.form-group input,
.form-group textarea {
  padding: 14px 16px; /* 增大内边距 */
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 15px; /* 增大字体 */
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px; /* 增大高度 */
}

.form-actions {
  display: flex;
  gap: 20px; /* 增大间距 */
  justify-content: flex-end;
  padding-top: 32px; /* 增大间距 */
  border-top: 1px solid #f7fafc;
}

.cancel-btn,
.submit-btn {
  padding: 14px 32px; /* 增大按钮 */
  border: none;
  border-radius: 6px;
  font-size: 15px; /* 增大字体 */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.cancel-btn:hover {
  background: #edf2f7;
  transform: translateY(-1px);
}

.submit-btn {
  background: #3182ce;
  color: #fff;
}

.submit-btn:hover:not(:disabled) {
  background: #2c5aa0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }

  .content {
    padding: 16px;
  }

  .course-create {
    padding: 24px;
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .header-user {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 16px;
  }
}
</style>