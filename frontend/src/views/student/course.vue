<template>
  <div class="student-layout">
    <!-- 侧边栏 -->
    <Sidebar :menuItems="studentMenuItems" />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="课程服务">
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
        <div class="course-dashboard">
          <h1>我的课程</h1>

          <!-- 课程筛选 -->
          <div class="filter-section">
            <div class="filter-group">
              <label>搜索课程：</label>
              <input
                  type="text"
                  v-model="searchKeyword"
                  placeholder="输入课程名称..."
                  @input="filterCourses"
              />
            </div>
            <div class="filter-group">
              <label>课程状态：</label>
              <select v-model="statusFilter" @change="filterCourses">
                <option value="">全部</option>
                <option value="active">进行中</option>
                <option value="completed">已结束</option>
                <option value="upcoming">即将开始</option>
              </select>
            </div>
          </div>

          <!-- 课程列表 -->
          <div class="course-grid">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="error" class="error-state">
              {{ error }}
              <button @click="loadCourses" class="retry-btn">重新加载</button>
            </div>
            <div v-else-if="filteredCourses.length === 0" class="empty-state">
              暂无课程数据
            </div>
            <div
                v-else
                v-for="course in filteredCourses"
                :key="course.id"
                class="course-card"
                @click="enterCourse(course)"
            >
              <div class="course-header">
                <h3>{{ course.name }}</h3>
                <span class="course-status" :class="getCourseStatus(course)">
                  {{ getStatusText(getCourseStatus(course)) }}
                </span>
              </div>
              <div class="course-info">
                <p class="teacher">授课教师：{{ course.teacher_name }}</p>
                <p class="description">{{ course.description }}</p>
                <div class="course-meta">
                  <span>开始时间：{{ formatDate(course.start_date) }}</span>
                  <span>结束时间：{{ formatDate(course.end_date) }}</span>
                  <span>学分：{{ course.credit }}</span>
                  <span>学期：{{ course.semester }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getStudentCourses,
  getCourseStatus,
  getStatusText,
  formatDate,
  type Course
} from '@/api/student/course'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '学生')

const studentMenuItems = [
  { path: '/student/course', label: '我的课程' },
  { path: '/student/chat', label: '学习助手' },
  { path: '/student/exercise_generate', label: '习题生成' },
  { path: '/student/profile', label: '个人信息' },
]

const loading = ref(false)
const error = ref('')
const searchKeyword = ref('')
const statusFilter = ref('')
const courses = ref<Course[]>([])
const filteredCourses = ref<Course[]>([])

// 获取课程数据
const loadCourses = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getStudentCourses()
    courses.value = response.courses
    filteredCourses.value = response.courses
  } catch (err: any) {
    console.error('获取课程失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

const filterCourses = () => {
  filteredCourses.value = courses.value.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        course.teacher_name.toLowerCase().includes(searchKeyword.value.toLowerCase())

    let matchesStatus = true
    if (statusFilter.value) {
      const courseStatus = getCourseStatus(course)
      matchesStatus = courseStatus === statusFilter.value
    }

    return matchesSearch && matchesStatus
  })
}

const enterCourse = (course: Course) => {
  router.push(`/student/course/${course.id}`)
}

onMounted(() => {
  loadCourses()
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

.course-dashboard {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  min-height: 400px;
}

.filter-section {
  margin: 24px 0;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  min-width: 80px;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.course-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.course-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 18px;
}

.course-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.course-status.active {
  background: #d4edda;
  color: #155724;
}

.course-status.completed {
  background: #cce5f0;
  color: #0c5460;
}

.course-status.upcoming {
  background: #fff3cd;
  color: #856404;
}

.course-info {
  margin-bottom: 16px;
}

.teacher {
  color: #4a5568;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.description {
  color: #718096;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #a0aec0;
}

.loading,
.empty-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  font-size: 16px;
  grid-column: 1 / -1;
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

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }
  .content {
    padding: 12px;
  }
  .course-dashboard {
    padding: 12px;
  }
  .course-grid {
    grid-template-columns: 1fr;
  }
  .course-meta {
    grid-template-columns: 1fr;
  }
}
</style>