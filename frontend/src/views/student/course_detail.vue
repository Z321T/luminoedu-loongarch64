<template>
  <div class="student-layout">
    <!-- 侧边栏 -->
    <Sidebar
        :menuItems="studentMenuItems"
        :activeItem="'/student/course'"
    />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="课程详情">
        <template #actions>
          <div class="header-user">
            <button class="back-btn" @click="goBack">返回</button>
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <section class="content">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error-state">
          {{ error }}
          <button @click="loadData" class="retry-btn">重新加载</button>
        </div>
        <div v-else class="course-detail-container">
          <!-- 课程基本信息 -->
          <div class="course-info-card">
            <h1>{{ courseDetail?.name }}</h1>
            <div class="info-grid">
              <div class="info-item">
                <label>授课教师：</label>
                <span>{{ courseDetail?.teacher_name }}</span>
              </div>
              <div class="info-item">
                <label>学期：</label>
                <span>{{ courseDetail?.semester }}</span>
              </div>
              <div class="info-item">
                <label>学分：</label>
                <span>{{ courseDetail?.credit }}</span>
              </div>
              <div class="info-item">
                <label>开始时间：</label>
                <span>{{ formatDate(courseDetail?.start_date) }}</span>
              </div>
              <div class="info-item">
                <label>结束时间：</label>
                <span>{{ formatDate(courseDetail?.end_date) }}</span>
              </div>
            </div>
            <div class="description">
              <label>课程描述：</label>
              <p>{{ courseDetail?.description }}</p>
            </div>
          </div>

          <!-- 课程通知 -->
          <div class="notification-section">
            <div class="section-header">
              <h2>课程通知</h2>
              <div class="notification-stats">
                共 {{ notificationData?.total_count || 0 }} 条通知
              </div>
            </div>
            <div v-if="notificationLoading" class="section-loading">加载通知中...</div>
            <div v-else-if="notificationError" class="section-error">
              {{ notificationError }}
              <button @click="() => loadNotifications()" class="retry-btn">重试</button>
            </div>
            <div v-else-if="notifications.length === 0" class="empty-state">
              暂无通知
            </div>
            <div v-else class="notification-list">
              <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-item"
                  :class="getPriorityClass(notification.priority)"
                  @click="openNotificationDetail(notification.id)"
              >
                <div class="notification-header">
                  <h3>{{ notification.title }}</h3>
                  <div class="notification-meta">
                    <span class="priority">{{ getPriorityText(notification.priority) }}</span>
                    <span class="time">{{ formatDateTime(notification.publish_time) }}</span>
                  </div>
                </div>
                <div class="notification-content">
                  {{ notification.content }}
                </div>
                <div class="notification-footer">
                  <span v-if="notification.require_confirmation" class="confirmation">
                    需要确认
                    <span v-if="notification.is_confirmed" class="confirmed">✓ 已确认</span>
                    <span v-else class="unconfirmed">⚠ 未确认</span>
                  </span>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div v-if="notificationData && notificationData.total_pages > 1" class="pagination">
              <button
                  @click="loadNotifications(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="page-btn"
              >
                上一页
              </button>
              <span class="page-info">
                第 {{ currentPage }} 页，共 {{ notificationData.total_pages }} 页
              </span>
              <button
                  @click="loadNotifications(currentPage + 1)"
                  :disabled="currentPage >= notificationData.total_pages"
                  class="page-btn"
              >
                下一页
              </button>
            </div>
          </div>

          <!-- 课程资料 -->
          <div class="material-section">
            <div class="section-header">
              <h2>课程资料</h2>
              <div class="material-stats">
                共 {{ materialData?.total || 0 }} 个文件
              </div>
            </div>
            <div v-if="materialLoading" class="section-loading">加载资料中...</div>
            <div v-else-if="materialError" class="section-error">
              {{ materialError }}
              <button @click="loadMaterials" class="retry-btn">重试</button>
            </div>
            <div v-else-if="materials.length === 0" class="empty-state">
              暂无课程资料
            </div>
            <div v-else class="material-list">
              <div
                  v-for="material in materials"
                  :key="material.file_name"
                  class="material-item"
              >
                <div class="material-icon">📄</div>
                <div class="material-info">
                  <h4>{{ material.file_name }}</h4>
                  <div class="material-meta">
                    <span>上传者：{{ material.uploader_name }}</span>
                    <span>上传时间：{{ formatDateTime(material.upload_time) }}</span>
                  </div>
                </div>
                <div class="material-actions">
                  <button
                      class="download-btn"
                      :disabled="downloadingFiles.has(material.file_name)"
                      @click="downloadFile(material.file_name)"
                  >
                    {{ downloadingFiles.has(material.file_name) ? '下载中...' : '下载' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 通知详情弹框 -->
    <div v-if="showNotificationModal" class="modal-overlay" @click="closeNotificationDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>通知详情</h3>
          <button class="close-btn" @click="closeNotificationDetail">×</button>
        </div>
        <div class="modal-body">
          <div v-if="notificationDetailLoading" class="modal-loading">
            加载中...
          </div>
          <div v-else-if="notificationDetailError" class="modal-error">
            {{ notificationDetailError }}
            <button @click="loadNotificationDetail(selectedNotificationId!)" class="retry-btn">重试</button>
          </div>
          <div v-else-if="notificationDetail" class="notification-detail">
            <div class="detail-header">
              <h4>{{ notificationDetail.title }}</h4>
              <div class="detail-meta">
                <span class="priority" :class="getPriorityClass(notificationDetail.priority)">
                  {{ getPriorityText(notificationDetail.priority) }}
                </span>
                <span class="course">{{ notificationDetail.course_name }}</span>
                <span class="teacher">{{ notificationDetail.teacher_name }}</span>
                <span class="time">{{ formatDateTime(notificationDetail.publish_time) }}</span>
              </div>
            </div>
            <div class="detail-content">
              <p>{{ notificationDetail.content }}</p>
            </div>
            <div v-if="notificationDetail.require_confirmation" class="confirmation-section">
              <div class="confirmation-status">
                <span v-if="notificationDetail.is_confirmed" class="confirmed">
                  ✓ 已确认
                </span>
                <span v-else class="unconfirmed">
                  ⚠ 未确认
                </span>
              </div>
              <button
                  v-if="!notificationDetail.is_confirmed"
                  class="confirm-btn"
                  :disabled="confirming"
                  @click="handleConfirmNotification"
              >
                {{ confirming ? '确认中...' : '确认通知' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getCourseDetail,
  getCourseNotifications,
  getCourseMaterials,
  downloadCourseMaterial,
  getNotificationDetail,
  confirmNotification,
  formatDateTime,
  getPriorityText,
  getPriorityClass,
  type CourseDetail,
  type Notification,
  type NotificationResponse,
  type CourseMaterial,
  type MaterialResponse,
  type NotificationDetail
} from '@/api/student/course_detail_stu'

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '学生')

const studentMenuItems = [
  { path: '/student/course', label: '我的课程' },
  { path: '/student/chat', label: '学习助手' },
  { path: '/student/exercise_generate', label: '习题生成' },
  { path: '/student/profile', label: '个人信息' },
]

const courseId = computed(() => parseInt(route.params.courseId as string))

// 数据状态
const loading = ref(false)
const error = ref('')
const courseDetail = ref<CourseDetail | null>(null)

// 通知相关状态
const notificationLoading = ref(false)
const notificationError = ref('')
const notificationData = ref<NotificationResponse | null>(null)
const notifications = ref<Notification[]>([])
const currentPage = ref(1)
const pageSize = ref(20)

// 资料相关状态
const materialLoading = ref(false)
const materialError = ref('')
const materialData = ref<MaterialResponse | null>(null)
const materials = ref<CourseMaterial[]>([])

// 下载状态
const downloadingFiles = ref<Set<string>>(new Set())

// 通知详情弹框状态
const showNotificationModal = ref(false)
const selectedNotificationId = ref<number | null>(null)
const notificationDetail = ref<NotificationDetail | null>(null)
const notificationDetailLoading = ref(false)
const notificationDetailError = ref('')
const confirming = ref(false)

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 下载文件
const downloadFile = async (fileName: string) => {
  try {
    downloadingFiles.value.add(fileName)
    await downloadCourseMaterial(courseId.value, fileName)
  } catch (err: any) {
    alert(`下载失败: ${err.message}`)
  } finally {
    downloadingFiles.value.delete(fileName)
  }
}


// 打开通知详情
const openNotificationDetail = async (notificationId: number) => {
  selectedNotificationId.value = notificationId
  showNotificationModal.value = true
  await loadNotificationDetail(notificationId)
}

// 关闭通知详情
const closeNotificationDetail = () => {
  showNotificationModal.value = false
  selectedNotificationId.value = null
  notificationDetail.value = null
  notificationDetailError.value = ''
}

// 加载通知详情
const loadNotificationDetail = async (notificationId: number) => {
  notificationDetailLoading.value = true
  notificationDetailError.value = ''

  try {
    notificationDetail.value = await getNotificationDetail(notificationId)
  } catch (err: any) {
    notificationDetailError.value = err.message
  } finally {
    notificationDetailLoading.value = false
  }
}

// 确认通知
const handleConfirmNotification = async () => {
  if (!notificationDetail.value || confirming.value) return

  confirming.value = true
  try {
    await confirmNotification(notificationDetail.value.id)
    notificationDetail.value.is_confirmed = true

    // 更新通知列表中对应的通知状态
    const notificationIndex = notifications.value.findIndex(n => n.id === notificationDetail.value?.id)
    if (notificationIndex !== -1) {
      notifications.value[notificationIndex].is_confirmed = true
    }

    alert('通知确认成功！')
  } catch (err: any) {
    alert(`确认失败: ${err.message}`)
  } finally {
    confirming.value = false
  }
}

// 加载课程详情
const loadCourseDetail = async () => {
  try {
    courseDetail.value = await getCourseDetail(courseId.value)
  } catch (err: any) {
    throw new Error(`获取课程详情失败: ${err.message}`)
  }
}

// 加载通知
const loadNotifications = async (page: number = 1) => {
  notificationLoading.value = true
  notificationError.value = ''

  try {
    notificationData.value = await getCourseNotifications(courseId.value, page, pageSize.value)
    notifications.value = notificationData.value.notifications
    currentPage.value = page
  } catch (err: any) {
    notificationError.value = err.message
  } finally {
    notificationLoading.value = false
  }
}

// 加载资料
const loadMaterials = async () => {
  materialLoading.value = true
  materialError.value = ''

  try {
    materialData.value = await getCourseMaterials(courseId.value)
    materials.value = materialData.value.materials
  } catch (err: any) {
    materialError.value = err.message
  } finally {
    materialLoading.value = false
  }
}

// 加载所有数据
const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    await Promise.all([
      loadCourseDetail(),
      loadNotifications(),
      loadMaterials()
    ])
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/student/course')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

onMounted(() => {
  loadData()
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
  background: #2c5aa0;
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

.loading, .error-state {
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

.course-detail-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.course-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.course-info-card h1 {
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 28px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  color: #4a5568;
  min-width: 80px;
}

.info-item span {
  color: #2d3748;
}

.description label {
  font-weight: 500;
  color: #4a5568;
  display: block;
  margin-bottom: 8px;
}

.description p {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

.notification-section, .material-section {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 20px;
}

.notification-stats, .material-stats {
  color: #718096;
  font-size: 14px;
}

.section-loading, .section-error, .empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.section-error {
  color: #e53e3e;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s;
}

.notification-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notification-item.urgent {
  border-left: 4px solid #e53e3e;
}

.notification-item.important {
  border-left: 4px solid #ed8936;
}

.notification-item.normal {
  border-left: 4px solid #38a169;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.notification-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 16px;
}

.notification-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.notification-item.urgent .priority {
  background: #fed7d7;
  color: #c53030;
}

.notification-item.important .priority {
  background: #feebc8;
  color: #c05621;
}

.notification-item.normal .priority {
  background: #c6f6d5;
  color: #2f855a;
}

.time {
  color: #a0aec0;
}

.notification-content {
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 12px;
}

.notification-footer {
  display: flex;
  justify-content: flex-end;
}

.confirmation {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirmed {
  color: #38a169;
}

.unconfirmed {
  color: #e53e3e;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.page-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background: #2c5aa0;
}

.page-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.page-info {
  color: #4a5568;
  font-size: 14px;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.material-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.material-icon {
  font-size: 24px;
  color: #4a5568;
}

.material-info {
  flex: 1;
}

.material-info h4 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 16px;
}

.material-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #a0aec0;
}

.download-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.download-btn:hover {
  background: #2f855a;
}

/* 通知项可点击样式 */
.notification-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.notification-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* 弹框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #718096;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.close-btn:hover {
  background: #e2e8f0;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-loading, .modal-error {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.modal-error {
  color: #e53e3e;
}

.notification-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header h4 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 20px;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
}

.detail-meta .priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.detail-meta .priority.urgent {
  background: #fed7d7;
  color: #c53030;
}

.detail-meta .priority.important {
  background: #feebc8;
  color: #c05621;
}

.detail-meta .priority.normal {
  background: #c6f6d5;
  color: #2f855a;
}

.detail-meta .course {
  color: #3182ce;
  font-weight: 500;
}

.detail-meta .teacher {
  color: #4a5568;
}

.detail-meta .time {
  color: #a0aec0;
}

.detail-content {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #e2e8f0;
}

.detail-content p {
  margin: 0;
  line-height: 1.6;
  color: #4a5568;
  white-space: pre-wrap;
}

.confirmation-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.confirmation-status .confirmed {
  color: #38a169;
  font-weight: 500;
}

.confirmation-status .unconfirmed {
  color: #e53e3e;
  font-weight: 500;
}

.confirm-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.confirm-btn:hover:not(:disabled) {
  background: #2f855a;
}

.confirm-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #a0aec0;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }
  .content {
    padding: 12px;
  }
  .course-info-card, .notification-section, .material-section {
    padding: 16px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .notification-header {
    flex-direction: column;
    gap: 8px;
  }
  .material-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>