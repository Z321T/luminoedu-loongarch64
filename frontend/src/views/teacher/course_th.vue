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
      <PageHeader title="课程管理">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <section class="content">
        <div class="course-dashboard">
          <div class="dashboard-header">
            <h1>课程管理</h1>
            <button
                class="create-course-btn"
                @click="navigateToCreate"
            >
              <span class="plus-icon">+</span>
              创建课程
            </button>
          </div>

          <!-- 课程筛选 -->
          <div class="filter-section">
            <div class="filter-group">
              <label>搜索课程：</label>
              <input
                  v-model="searchQuery"
                  @input="filterCourses"
                  type="text"
                  placeholder="输入课程名称..."
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
              {{ searchQuery || statusFilter ? '没有找到符合条件的课程' : '暂无课程数据' }}
            </div>
            <div
                v-else
                v-for="course in filteredCourses"
                :key="course.id"
                class="course-card"
                @click="navigateToCourseDetail(course.id)"
            >
              <div class="course-header">
                <h3>{{ course.name }}</h3>
                <div class="course-meta">
                  <span class="semester-badge">{{ course.semester }}</span>
                  <span class="credit-badge">{{ course.credit }} 学分</span>
                  <span :class="['status-badge', getStatusClass(course)]">
                    {{ getStatusText(getCourseStatus(course)) }}
                  </span>
                </div>
              </div>

              <div class="course-info">
                <p class="description">{{ course.description || '暂无描述' }}</p>
                <div class="course-dates">
                  <span>开始时间：{{ formatDateTime(course.start_date) }}</span>
                  <span>结束时间：{{ formatDateTime(course.end_date) }}</span>
                </div>
              </div>

              <div class="course-actions">
                <button
                    class="delete-btn"
                    @click.stop="confirmDelete(course.id)"
                >
                  删除课程
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getAllCourses,
  deleteCourse,
  formatDateTime,
  type Course_th
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

const loading = ref(false)
const error = ref('')
const courses = ref<Course_th[]>([])
const searchQuery = ref('')
const statusFilter = ref('')

// 根据日期判断课程状态
const getCourseStatus = (course: Course_th): string => {
  const today = new Date()
  const startDate = new Date(course.start_date)
  const endDate = new Date(course.end_date)

  if (today < startDate) {
    return 'upcoming'
  } else if (today > endDate) {
    return 'completed'
  } else {
    return 'active'
  }
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '进行中',
    completed: '已结束',
    upcoming: '即将开始'
  }
  return statusMap[status] || status
}

// 获取状态样式类名
const getStatusClass = (course: Course_th): string => {
  return getCourseStatus(course)
}

// 筛选后的课程列表
const filteredCourses = computed(() => {
  let result = courses.value

  // 按名称搜索
  if (searchQuery.value) {
    result = result.filter(course =>
        course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 按状态筛选
  if (statusFilter.value) {
    result = result.filter(course => getCourseStatus(course) === statusFilter.value)
  }

  return result
})

// 筛选课程
const filterCourses = () => {
  // 由于使用了computed，这里不需要手动处理筛选逻辑
}

// 获取课程数据
const loadCourses = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getAllCourses()
    courses.value = response
    console.log('成功加载课程列表:', response)
  } catch (err: any) {
    console.error('获取课程失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 删除课程
const confirmDelete = async (id: number) => {
  try {
    if (confirm('确定要删除这个课程吗？此操作不可恢复！')) {
      const result = await deleteCourse(id)
      if (result.success) {
        alert('课程删除成功')
        await loadCourses() // 重新加载课程列表
      }
    }
  } catch (error: any) {
    alert(error.message || '删除失败，请稍后重试')
  }
}

// 跳转
const navigateToCreate = () => {
  router.push('/teacher/course/create')
}
const navigateToCourseDetail = (courseId: number) => {
  router.push(`/teacher/course/detail/${courseId}`)
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

const handleMenuClick = (item: any) => {
  router.push(item.path)  // 使用传入的路径，而不是固定路径
}

onMounted(() => {
  loadCourses()
})

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

.course-dashboard {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  min-height: 400px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  margin: 0;
  color: #2d3748;
  font-size: 24px;
}

.create-course-btn {
  background: #3182ce;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-course-btn:hover {
  background: #2c5aa0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.plus-icon {
  font-size: 16px;
  font-weight: bold;
}

.filter-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #4a5568;
  white-space: nowrap;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-width: 200px;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #3182ce;
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #3182ce;
}

.course-header {
  margin-bottom: 12px;
}

.course-header h3 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 18px;
}

.course-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.semester-badge,
.credit-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.semester-badge {
  background: #ebf8ff;
  color: #3182ce;
}

.credit-badge {
  background: #f0fff4;
  color: #38a169;
}

.course-info {
  margin-bottom: 16px;
}

.description {
  color: #718096;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.course-dates {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #a0aec0;
}

.course-actions {
  border-top: 1px solid #f7fafc;
  padding-top: 16px;
  display: flex;
  justify-content: center;
}

.delete-btn {
  background: #fff5f5;
  color: #e53e3e;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fed7d7;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  .filter-section {
    flex-direction: column;
    gap: 16px;
  }

  .filter-group input,
  .filter-group select {
    min-width: 150px;
  }

  .course-grid {
    grid-template-columns: 1fr;
  }

  .course-dates {
    flex-direction: column;
    gap: 4px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-user {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 16px;
  }
}
</style>