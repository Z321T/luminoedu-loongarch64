<template>
  <div>
  <div class="teacher-layout">
    <!-- 侧边栏 -->
    <SideBar
        :menuItems="teacherMenuItems"
        :activeItem="'/teacher/course'"
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
        <div v-else-if="courseDetail" class="course-detail-container">
          <!-- 课程基本信息 -->
          <div class="course-info-card">
            <h1>{{ courseDetail.name }}</h1>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">学期：</span>
                <span class="value">{{ courseDetail.semester }}</span>
              </div>
              <div class="info-item">
                <span class="label">学分：</span>
                <span class="value">{{ courseDetail.credit }}</span>
              </div>
              <div class="info-item">
                <span class="label">开始时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.start_date) }}</span>
              </div>
              <div class="info-item">
                <span class="label">结束时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.end_date) }}</span>
              </div>
            </div>
            <div class="description">
              <span class="label">课程描述：</span>
              <p>{{ courseDetail.description || '暂无描述' }}</p>
            </div>
          </div>

          <!-- 课程资料 -->
          <div class="material-section">
            <div class="section-header">
              <h2>课程资料</h2>
              <div class="material-header-actions">
                <div class="upload-section">
                  <input
                      ref="fileInput"
                      type="file"
                      @change="handleFileUpload"
                      style="display: none"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.md,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.tar,.gz,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                  />
                  <button
                      @click="triggerFileUpload"
                      :disabled="materialUploading"
                      class="upload-btn">
                    {{ materialUploading ? '上传中...' : '+ 上传资料' }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="materialLoading" class="section-loading">加载资料中...</div>
            <div v-else-if="materialError" class="section-error">
              {{ materialError }}
              <button @click="loadMaterials()" class="retry-btn">重试</button>
            </div>
            <div v-else-if="materials.length === 0" class="empty-state">
              暂无课程资料
            </div>
            <div v-else class="material-list">
              <div
                  class="material-item"
                  v-for="material in materials"
                  :key="material.filename">
                <div class="material-icon">📄</div>
                <div class="material-info">
                  <h4>{{ material.filename }}</h4>
                  <div class="material-meta">
                    <span>{{ formatFileSize(material.file_size) }}</span>
                    <span>{{ formatDateTime(material.upload_time) }}</span>
                  </div>
                </div>
                <div class="material-actions">
                  <button
                      @click="handleDownload(material.filename)"
                      :disabled="downloadingFiles.includes(material.filename)"
                      class="download-btn">
                    {{ downloadingFiles.includes(material.filename) ? '下载中...' : '下载' }}
                  </button>
                  <button
                      @click="handleDeleteMaterial(material.filename)"
                      class="delete-material-btn">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 课程通知 -->
          <div class="notification-section">
            <div class="section-header">
              <h2>课程通知</h2>
              <div class="notification-header-actions">
                <div class="notification-stats">
                  共 {{ notificationData?.total_count || 0 }} 条通知
                </div>
                <button @click="showCreateNotificationDialog" class="create-notification-btn">
                  + 创建通知
                </button>
              </div>
            </div>

            <div v-if="notificationLoading" class="section-loading">加载通知中...</div>
            <div v-else-if="notificationError" class="section-error">
              {{ notificationError }}
              <button @click="loadNotifications()" class="retry-btn">重试</button>
            </div>
            <div v-else-if="notifications.length === 0" class="empty-state">
              暂无通知
            </div>
            <div v-else>
              <div class="notification-list">
                <div
                    class="notification-item"
                    :class="getPriorityClass(notification.priority)"
                    v-for="notification in notifications"
                    :key="notification.id">
                  <!-- 通知主体内容 - 点击查看详情 -->
                  <div
                      class="notification-main"
                      @click="viewNotificationDetail(notification)"
                      :style="{ cursor: 'pointer' }">
                    <div class="notification-header">
                      <h3>{{ notification.title }}</h3>
                      <div class="notification-meta">
                        <span class="priority">{{ getPriorityText(notification.priority) }}</span>
                        <span class="time">{{ formatDateTime(notification.publish_time) }}</span>
                      </div>
                    </div>
                    <div class="notification-stats">
                      <span v-if="notification.require_confirmation" class="confirmation-stats">
                        已确认: {{ notification.confirmed_students }}/{{ notification.total_students }}
                      </span>
                      <span v-else class="no-confirmation">无需确认</span>
                    </div>
                  </div>

                  <!-- 编辑按钮 - 独立的操作区域 -->
                  <div class="notification-actions">
                    <button
                        @click.stop="showEditNotificationDialog(notification)"
                        class="edit-notification-btn"
                        title="编辑通知"
                        :disabled="editingNotificationId === notification.id">
                      <span v-if="editingNotificationId === notification.id">...</span>
                      <span v-else>✏️编辑</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 分页 -->
              <div v-if="notificationData && notificationData.total_pages > 1" class="pagination">
                <button
                    @click="loadNotifications(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="page-btn">
                  上一页
                </button>
                <span class="page-info">{{ currentPage }} / {{ notificationData.total_pages }}</span>
                <button
                    @click="loadNotifications(currentPage + 1)"
                    :disabled="currentPage >= notificationData.total_pages"
                    class="page-btn">
                  下一页
                </button>
              </div>
            </div>
          </div>

          <!-- 学生列表 -->
          <div class="students-section">
            <div class="section-header">
              <h2>学生列表</h2>
              <div class="student-actions">
                <span class="student-stats">
                  共 {{ courseDetail.students.length }} 名学生
                  <span v-if="selectedStudents.length > 0">
                    (已选择 {{ selectedStudents.length }} 名)
                  </span>
                </span>

                <!-- 新增：导入学生功能区域 -->
                <div class="import-actions">
                  <button
                      @click="handleDownloadStudentTemplate"
                      class="template-btn"
                      title="下载导入模板">
                    📄 下载模板
                  </button>
                  <button
                      @click="triggerStudentImport"
                      class="import-btn"
                      :disabled="studentImporting"
                      title="导入学生">
                    {{ studentImporting ? '导入中...' : '📁 导入学生' }}
                  </button>
                  <input
                      ref="studentFileInput"
                      type="file"
                      accept=".xlsx,.xls"
                      @change="handleStudentImport"
                      style="display: none"
                  />
                </div>

                <button
                    v-if="selectedStudents.length > 0"
                    @click="handleRemoveStudents"
                    class="remove-students-btn">
                  移除选中学生
                </button>
              </div>
            </div>

            <div v-if="!courseDetail?.students || courseDetail.students.length === 0" class="empty-state">
              暂无学生选课
            </div>
            <div v-else class="student-table">
              <div class="table-header">
                <div class="th checkbox-column">
                  <input
                      type="checkbox"
                      :checked="selectedStudents.length === courseDetail.students.length"
                      :indeterminate="selectedStudents.length > 0 && selectedStudents.length < courseDetail.students.length"
                      @change="toggleSelectAll"
                  />
                </div>
                <div class="th">学号</div>
                <div class="th">姓名</div>
                <div class="th">学院</div>
                <div class="th">年级</div>
              </div>
              <div class="table-body">
                <div
                    class="table-row"
                    v-for="student in courseDetail.students"
                    :key="student.student_id">
                  <div class="td checkbox-column">
                    <input
                        type="checkbox"
                        :value="student.student_id"
                        v-model="selectedStudents"
                    />
                  </div>
                  <div class="td">{{ student.student_id }}</div>
                  <div class="td">{{ student.name }}</div>
                  <div class="td">{{ student.college }}</div>
                  <div class="td">{{ student.grade }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- 创建/编辑通知对话框 -->
  <div v-if="showCreateNotification" class="modal-overlay" @click="closeCreateNotification">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditMode ? '编辑通知' : '创建通知' }}</h3>
        <button @click="closeCreateNotification" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="title">通知标题</label>
          <input
              id="title"
              v-model="notificationForm.title"
              type="text"
              class="form-input"
              placeholder="请输入通知标题"
          />
        </div>
        <div class="form-group">
          <label for="content">通知内容</label>
          <textarea
              id="content"
              v-model="notificationForm.content"
              class="form-textarea"
              rows="6"
              placeholder="请输入通知内容"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="priority">优先级</label>
          <select id="priority" v-model="notificationForm.priority" class="form-select">
            <option :value="1">普通</option>
            <option :value="2">重要</option>
            <option :value="3">紧急</option>
          </select>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input
                type="checkbox"
                v-model="notificationForm.require_confirmation"
            />
            需要学生确认
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeCreateNotification" class="cancel-btn">取消</button>
        <button @click="handleCreateOrUpdateNotification" class="confirm-btn">
          {{ isEditMode ? '更新' : '创建' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 通知详情对话框 -->
  <div v-if="showNotificationDetail && selectedNotification" class="modal-overlay" @click="closeNotificationDetail">
    <div class="modal-content large-modal" @click.stop>
      <div class="modal-header">
        <h3>通知详情</h3>
        <button @click="closeNotificationDetail" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="notification-detail">
          <div class="detail-header">
            <h4>{{ selectedNotification.title }}</h4>
            <div class="detail-meta">
              <span class="priority">{{ getPriorityText(selectedNotification.priority) }}</span>
              <span class="time">{{ formatDateTime(selectedNotification.publish_time) }}</span>
            </div>
          </div>
          <div class="detail-content">
            <p>{{ selectedNotification.content }}</p>
          </div>
          <div v-if="selectedNotification.require_confirmation" class="confirmation-stats">
            <h5>确认统计</h5>
            <div class="stats-summary">
              <p>总学生数：{{ selectedNotification.total_students }}</p>
              <p>已确认：{{ selectedNotification.confirmed_students }}</p>
              <p>确认率：{{ selectedNotification.confirmation_rate.toFixed(1) }}%</p>
            </div>
            <div v-if="selectedNotification.confirmations.length > 0" class="confirmation-list">
              <h6>确认详情：</h6>
              <div
                  class="confirmation-item"
                  v-for="confirmation in selectedNotification.confirmations"
                  :key="confirmation.student_id">
                <div class="student-info">
                  <span class="student-name">{{ confirmation.student_name }}</span>
                  <span class="student-number">({{ confirmation.student_number }})</span>
                </div>
                <div class="confirm-time">{{ formatDateTime(confirmation.confirmed_at) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeNotificationDetail" class="cancel-btn">关闭</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute} from 'vue-router'
import SideBar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  formatDateTime
} from '@/api/teacher/course_th'
import {
  getTeacherCourseDetail,
  getCourseNotifications,
  getCourseMaterials,
  removeStudentsFromCourse,
  deleteMaterial,
  downloadMaterial,
  formatFileSize,
  getPriorityText,
  getPriorityClass,
  uploadMaterial,
  createNotification,
  updateNotification,
  getNotificationDetail,
  validateFileType,
  validateFileSize,
  importStudents,
  downloadStudentTemplate,
  validateExcelFileType,
  type TeacherCourseDetail,
  type TeacherNotification,
  type TeacherNotificationResponse,
  type CourseMaterial,
  type CreateNotificationRequest,
  type NotificationDetail,
} from '@/api/teacher/course_detail_th'

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '教师')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

// 修正：移除 computed 属性中的副作用
const courseId = computed(() => parseInt(route.params.courseId as string))


// 数据状态
const loading = ref(false)
const error = ref('')
const courseDetail = ref<TeacherCourseDetail | null>(null)

// 学生选择状态
const selectedStudents = ref<string[]>([])

// 通知相关状态
const notificationLoading = ref(false)
const notificationError = ref('')
const notificationData = ref<TeacherNotificationResponse | null>(null)
const notifications = ref<TeacherNotification[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const showCreateNotification = ref(false)
const showNotificationDetail = ref(false)
const selectedNotification = ref<NotificationDetail | null>(null)
const notificationForm = ref<CreateNotificationRequest>({
  title: '',
  content: '',
  priority: 1,
  require_confirmation: false
})
const isEditMode = ref(false)
const editNotificationId = ref<number | null>(null)

// 添加防重复点击状态
const editingNotificationId = ref<number | null>(null)
const viewingNotificationId = ref<number | null>(null)

// 资料相关状态
const materialLoading = ref(false)
const materialError = ref('')
const materials = ref<CourseMaterial[]>([])
const materialUploading = ref(false)
const downloadingFiles = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// 新增：导入学生相关状态
const studentImporting = ref(false)
const studentFileInput = ref<HTMLInputElement | null>(null)


// 加载所有数据
const loadData = async () => {
  if (courseId.value === 0) return

  loading.value = true
  error.value = ''

  try {
    await Promise.all([
      loadCourseDetail(),
      loadNotifications(),
      loadMaterials()
    ])
  } catch (err: any) {
    console.error('加载数据失败:', err)
    error.value = err.message || '加载数据失败'
  } finally {
    loading.value = false
  }
}

// 加载课程详情
const loadCourseDetail = async () => {
  try {
    courseDetail.value = await getTeacherCourseDetail(courseId.value)
  } catch (err: any) {
    throw new Error('加载课程详情失败: ' + err.message)
  }
}

// 加载通知列表
const loadNotifications = async (page: number = 1) => {
  notificationLoading.value = true
  notificationError.value = ''

  try {
    const data = await getCourseNotifications(courseId.value, page, pageSize.value)
    notificationData.value = data
    notifications.value = data.notifications
    currentPage.value = page
  } catch (err: any) {
    console.error('加载通知失败:', err)
    notificationError.value = err.message || '加载通知失败'
  } finally {
    notificationLoading.value = false
  }
}

// 加载资料列表
const loadMaterials = async () => {
  materialLoading.value = true
  materialError.value = ''

  try {
    const data = await getCourseMaterials(courseId.value)
    materials.value = data.materials
  } catch (err: any) {
    console.error('加载资料失败:', err)
    materialError.value = err.message || '加载资料失败'
  } finally {
    materialLoading.value = false
  }
}

// 修改查看通知详情方法，添加防重复点击
const viewNotificationDetail = async (notification: TeacherNotification) => {
  // 防止重复点击
  if (viewingNotificationId.value === notification.id) {
    return
  }

  viewingNotificationId.value = notification.id

  try {
    const detail = await getNotificationDetail(courseId.value, notification.id)
    selectedNotification.value = detail
    showNotificationDetail.value = true
  } catch (error: any) {
    console.error('获取通知详情失败:', error)
    alert('获取通知详情失败: ' + error.message)
  } finally {
    // 延迟重置状态，防止快速点击
    setTimeout(() => {
      viewingNotificationId.value = null
    }, 500)
  }
}

// 显示创建通知对话框
const showCreateNotificationDialog = () => {
  isEditMode.value = false
  editNotificationId.value = null
  notificationForm.value = {
    title: '',
    content: '',
    priority: 1,
    require_confirmation: false
  }
  showCreateNotification.value = true
}

// 修改编辑通知对话框方法，添加防重复点击
const showEditNotificationDialog = async (notification: TeacherNotification) => {
  // 防止重复点击
  if (editingNotificationId.value === notification.id) {
    return
  }

  editingNotificationId.value = notification.id
  isEditMode.value = true
  editNotificationId.value = notification.id

  // 先设置基本信息
  notificationForm.value = {
    title: notification.title,
    content: '', // 内容需要通过详情接口获取
    priority: notification.priority,
    require_confirmation: notification.require_confirmation
  }

  try {
    // 获取通知详情以填充完整内容
    const detail = await getNotificationDetail(courseId.value, notification.id)
    notificationForm.value.content = detail.content
    showCreateNotification.value = true
  } catch (error: any) {
    console.error('加载通知详情失败:', error)
    alert('加载通知详情失败: ' + error.message)
  } finally {
    editingNotificationId.value = null
  }
}

// 创建或更新通知
const handleCreateOrUpdateNotification = async () => {
  if (!notificationForm.value.title.trim()) {
    alert('请输入通知标题')
    return
  }
  if (!notificationForm.value.content.trim()) {
    alert('请输入通知内容')
    return
  }

  try {
    if (isEditMode.value && editNotificationId.value) {
      // 更新通知
      const result = await updateNotification(
          courseId.value,
          editNotificationId.value,
          notificationForm.value
      )
      if (result.success) {
        alert('通知更新成功')
        closeCreateNotification()
        await loadNotifications(currentPage.value) // 重新加载当前页
      }
    } else {
      // 创建通知
      const result = await createNotification(courseId.value, notificationForm.value)
      if (result.success) {
        alert('通知创建成功')
        closeCreateNotification()
        await loadNotifications(1) // 加载第一页显示新通知
      }
    }
  } catch (error: any) {
    console.error(isEditMode.value ? '更新通知失败:' : '创建通知失败:', error)
    alert((isEditMode.value ? '更新通知失败: ' : '创建通知失败: ') + error.message)
  }
}

// 关闭对话框
const closeCreateNotification = () => {
  showCreateNotification.value = false
  isEditMode.value = false
  editNotificationId.value = null
  notificationForm.value = {
    title: '',
    content: '',
    priority: 1,
    require_confirmation: false
  }
}

const closeNotificationDetail = () => {
  showNotificationDetail.value = false
  selectedNotification.value = null
}

// 学生管理相关方法
const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedStudents.value = courseDetail.value?.students.map(s => s.student_id) || []
  } else {
    selectedStudents.value = []
  }
}


// 新增：导入学生相关方法
const triggerStudentImport = () => {
  studentFileInput.value?.click()
}

const handleStudentImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const file = files[0]

  // 验证文件类型
  if (!validateExcelFileType(file)) {
    alert('请选择Excel文件(.xlsx 或 .xls)')
    target.value = ''
    return
  }

  // 验证文件大小（10MB限制）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    alert('文件大小不能超过10MB')
    target.value = ''
    return
  }

  studentImporting.value = true
  try {
    const result = await importStudents(courseId.value, file)

    if (result.success) {
      let message = `导入完成！\n总计: ${result.total} 条记录\n成功: ${result.added} 条`

      if (result.failed.length > 0) {
        message += `\n失败: ${result.failed.length} 条\n失败原因:\n${result.failed.join('\n')}`
      }

      alert(message)

      // 重新加载课程详情以更新学生列表
      await loadCourseDetail()
    } else {
      alert(`导入失败: ${result.message}`)
    }
  } catch (error: any) {
    console.error('导入学生失败:', error)
    alert(`导入失败: ${error.message}`)
  } finally {
    studentImporting.value = false
    target.value = ''
  }
}

const handleDownloadStudentTemplate = async () => {
  try {
    await downloadStudentTemplate()
  } catch (error: any) {
    console.error('下载模板失败:', error)
    alert(`下载模板失败: ${error.message}`)
  }
}

const handleRemoveStudents = async () => {
  if (selectedStudents.value.length === 0) return

  if (!confirm(`确定要移除选中的 ${selectedStudents.value.length} 名学生吗？`)) {
    return
  }

  try {
    const result = await removeStudentsFromCourse(courseId.value, selectedStudents.value)
    if (result.success) {
      alert(`成功移除 ${result.removed} 名学生`)
      selectedStudents.value = []
      await loadCourseDetail() // 重新加载学生列表
    }
  } catch (error: any) {
    console.error('移除学生失败:', error)
    alert('移除学生失败: ' + error.message)
  }
}

// 资料管理相关方法
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  // 将 FileList 转换为数组
  const fileArray = Array.from(files)

  for (const file of fileArray) {
    // 验证文件类型
    if (!validateFileType(file)) {
      alert(`文件 ${file.name} 类型不支持`)
      continue
    }

    // 验证文件大小
    if (!validateFileSize(file)) {
      alert(`文件 ${file.name} 大小超过 2GB 限制`)
      continue
    }

    materialUploading.value = true
    try {
      const result = await uploadMaterial(courseId.value, file)
      if (result.success) {
        alert(`文件 ${result.filename} 上传成功`)
        await loadMaterials() // 重新加载资料列表
      }
    } catch (error: any) {
      console.error('上传失败:', error)
      alert(`上传文件 ${file.name} 失败: ${error.message}`)
    } finally {
      materialUploading.value = false
    }
  }

  // 清空文件输入
  target.value = ''
}

const handleDownload = async (filename: string) => {
  if (downloadingFiles.value.includes(filename)) return

  downloadingFiles.value.push(filename)
  try {
    await downloadMaterial(courseId.value, filename)
  } catch (error: any) {
    console.error('下载失败:', error)
    alert(`下载文件失败: ${error.message}`)
  } finally {
    downloadingFiles.value = downloadingFiles.value.filter(f => f !== filename)
  }
}

const handleDeleteMaterial = async (filename: string) => {
  if (!confirm(`确定要删除文件 ${filename} 吗？`)) {
    return
  }

  try {
    const result = await deleteMaterial(courseId.value, filename)
    if (result.success) {
      alert('文件删除成功')
      await loadMaterials() // 重新加载资料列表
    }
  } catch (error: any) {
    console.error('删除失败:', error)
    alert(`删除文件失败: ${error.message}`)
  }
}

// 导航相关方法
const goBack = () => {
  router.push('/teacher/course').then(() => {
  })
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}


// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 保持原有样式不变 */
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
.back-btn {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #cbd5e0;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c53030;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.loading, .error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #4a5568;
}

.error-state {
  flex-direction: column;
  gap: 16px;
}

.retry-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #2c5aa0;
}

.course-detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.course-info-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.course-info-card h1 {
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.students-section, .notification-section, .material-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
}

.student-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-stats, .notification-stats, .material-stats {
  color: #4a5568;
  font-size: 14px;
}

.remove-students-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.remove-students-btn:hover {
  background: #c53030;
}

.section-loading, .section-error, .empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  color: #a0aec0;
  font-size: 14px;
}

.section-error {
  color: #e53e3e;
  flex-direction: column;
  gap: 12px;
}

/* 学生表格样式 */
.student-table {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 50px 1fr 120px 120px 80px;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 50px 1fr 120px 120px 80px;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f7fafc;
}

.th, .td {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.th {
  font-weight: 500;
  color: #4a5568;
  background: #f7fafc;
}

.td {
  color: #2d3748;
}

/* 通知列表样式 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  transition: all 0.3s;
  cursor: pointer;
}

.notification-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-item.urgent {
  border-left: 4px solid #e53e3e;
}

.notification-item.important {
  border-left: 4px solid #ed8936;
}

.notification-item.normal {
  border-left: 4px solid #4299e1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.notification-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 16px;
  font-weight: 500;
}

.notification-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
}

.notification-item.urgent .priority {
  background: #fed7d7;
  color: #c53030;
}

.notification-item.important .priority {
  background: #feebc8;
  color: #dd6b20;
}

.notification-item.normal .priority {
  background: #bee3f8;
  color: #3182ce;
}

.time {
  color: #a0aec0;
  font-size: 12px;
}

.notification-stats .confirmation-stats {
  color: #4a5568;
  font-size: 12px;
}

.notification-stats .no-confirmation {
  color: #a0aec0;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.page-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #2c5aa0;
}

.page-btn:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

.page-info {
  color: #4a5568;
  font-size: 14px;
}

/* 资料列表样式 */
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
  border-radius: 6px;
  transition: all 0.3s;
}

.material-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-weight: 500;
}

.material-meta {
  display: flex;
  gap: 16px;
  color: #a0aec0;
  font-size: 12px;
}

.material-actions {
  display: flex;
  gap: 8px;
}

.download-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.3s;
}

.download-btn:hover:not(:disabled) {
  background: #2f855a;
}

.download-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.delete-material-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.3s;
}

.delete-material-btn:hover {
  background: #c53030;
}

/* 资料上传相关样式 */
.material-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-section {
  display: flex;
  align-items: center;
}

.upload-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.upload-btn:hover:not(:disabled) {
  background: #2f855a;
}

.upload-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

/* 通知相关样式 */
.notification-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.create-notification-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.create-notification-btn:hover {
  background: #2c5aa0;
}

/* 模态框样式 */
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
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.large-modal {
  width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
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
  cursor: pointer;
  color: #a0aec0;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #718096;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #4a5568;
}

.form-input, .form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.confirm-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.confirm-btn:hover {
  background: #2c5aa0;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #cbd5e0;
}

/* 通知详情样式 */
.notification-detail {
  font-size: 14px;
}

.detail-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-header h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 18px;
}

.detail-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.detail-meta .priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
}

.detail-meta .time {
  color: #a0aec0;
  font-size: 12px;
}

.detail-content p {
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
}

.confirmation-stats {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.confirmation-stats h5 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 16px;
}

.stats-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  color: #4a5568;
}

.confirmation-list h6 {
  margin: 16px 0 8px 0;
  color: #4a5568;
  font-size: 14px;
}

.confirmation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.confirmation-item:last-child {
  border-bottom: none;
}

.student-info {
  color: #2d3748;
  font-weight: 500;
}

.confirm-time {
  color: #a0aec0;
  font-size: 12px;
}

.edit-notification-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
}

.edit-notification-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.notification-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}


/* 导入学生相关样式 */
.import-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.template-btn:hover {
  background: #3182ce;
}

.import-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.import-btn:hover:not(:disabled) {
  background: #2f855a;
}

.import-btn:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
}

.student-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}


@media (max-width: 900px) {

  .student-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .import-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .notification-meta {
    gap: 8px;
  }

  .edit-notification-btn {
    min-width: 24px;
    height: 20px;
    font-size: 10px;
  }

  .material-header-actions, .notification-header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .modal-content {
    width: 95vw;
    margin: 20px;
  }

  .large-modal {
    width: 95vw;
  }

  .main {
    margin-left: 0;
  }

  .content {
    padding: 16px;
  }

  .course-info-card, .students-section, .notification-section, .material-section {
    padding: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .table-header, .table-row {
    grid-template-columns: 40px 1fr 100px;
  }

  .th:nth-child(4), .th:nth-child(5),
  .td:nth-child(4), .td:nth-child(5) {
    display: none;
  }

  .notification-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .material-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .material-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .student-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>