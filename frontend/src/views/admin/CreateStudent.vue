<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <SideBar
        :menuItems="adminMenuItems"
    />

    <!-- 主要内容区域 -->
    <div class="main-layout">
      <!-- 页面头部 -->
      <PageHeader title="管理系统">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <!-- 内容区域 -->
      <main class="content-area">
        <!-- 创建学生内容 -->
        <div class="create-teacher">

          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- Excel 批量导入卡片 -->
            <div class="upload-card">
              <div class="card-header">
                <div class="header-content">
                  <h2 class="card-title">
                    批量导入学生
                  </h2>
                  <p class="card-description">
                    支持 Excel (.xlsx, .xls)
                  </p>
                </div>
              </div>

              <div class="card-body">
                <!-- 模板下载区域 -->
                <div class="template-section">
                  <h3 class="section-title">
                    下载并填写模板
                  </h3>
                  <div class="template-actions">
                    <button
                        @click="downloadTemplate"
                        class="template-btn primary"
                    >
                      <span class="btn-text">下载Excel模板</span>
                    </button>

                  </div>
                </div>

                <!-- 文件上传区域 -->
                <div class="upload-section">
                  <h3 class="section-title">
                    选择并上传文件
                  </h3>

                  <!-- 拖拽上传区域 -->
                  <div
                      :class="['upload-area', { 'drag-over': isDragOver, 'has-file': selectedFile }]"
                      @drop="handleDrop"
                      @dragover.prevent="handleDragOver"
                      @dragleave="handleDragLeave"
                      @dragenter.prevent="handleDragEnter"
                      @click="$refs.fileInput.click()"
                  >
                    <input
                        ref="fileInput"
                        type="file"
                        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                        @change="handleFileSelect"
                        style="display: none"
                    />

                    <div
                        v-if="!selectedFile"
                        class="upload-placeholder"
                    >
                      <div class="upload-icon">📁</div>
                      <div class="upload-text">
                        <div class="primary-text">点击选择文件或拖拽到此处</div>
                        <div class="secondary-text">支持 .xlsx, .xls</div>
                      </div>
                    </div>

                    <div v-else class="file-info" >
                      <div class="file-details">
                        <div class="file-icon">📄</div>
                        <div class="file-meta">
                          <div class="file-name">{{ selectedFile.name }}</div>
                          <div class="file-size">
                            {{ formatFileSize(selectedFile.size) }}</div>
                          <div :class="['file-status', { 'valid': isFileValid, 'invalid': !isFileValid }]" >
                            {{ isFileValid ? '✅ 文件有效' : '❌ 文件无效' }}
                          </div>
                        </div>
                      </div>
                      <button
                          @click.stop="removeFile"
                          class="remove-file-btn"
                      >
                        <span class="remove-icon">🗑️</span>
                      </button>
                    </div>
                  </div>

                  <!-- 上传进度 -->
                  <div
                      v-if="isUploading"
                      class="upload-progress"
                  >
                    <div class="progress-bar">
                      <div
                          class="progress-fill"
                          :style="{ width: uploadProgress + '%' }"
                      ></div>
                    </div>
                    <div class="progress-text">上传中...
                      {{ uploadProgress.toFixed(0) }}%</div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="action-section">
                    <h3 class="section-title">

                    </h3>
                    <div class="action-buttons">
                      <button
                          @click="handleBatchUpload"
                          :disabled="!isFileValid || isUploading"
                          :class="['action-btn', 'primary', { 'loading': isUploading }]"
                      >
                        <span class="btn-text">
                          {{ isUploading ? '正在导入...' : '开始导入学生' }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>

    <!-- 移动端遮罩 -->
    <div
        v-if="mobileMenuOpen"
        class="mobile-overlay"
        @click="closeMobileMenu"
    />

    <!-- 快速提示 -->
    <transition name="tip-fade">
      <div
          v-if="showQuickTip"
          class="quick-tip"
      >
        <div class="tip-content">
          <span>{{ quickTipMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import SideBar from '@/components/layout/SideBar.vue'
import { downloadStudentTemplate, createStudents } from '@/api/admin/user_management'

const props = defineProps(['data'])
const emit = defineEmits(['dataUpdated'])

const router = useRouter()
const route = useRoute()

// 侧边栏相关
const mobileMenuOpen = ref(false)
const showQuickTip = ref(false)
const quickTipMessage = ref('')

const adminMenuItems = [
  { path: '/admin/log_management', label: '日志管理' },
  { path: '/admin/teacher_management', label: '教师管理' },
  { path: '/admin/student_management', label: '学生管理' },
  { path: '/admin/model_management', label: '模型管理' },
]

// 文件上传相关
const selectedFile = ref(null)
const isDragOver = ref(false)
const uploadResult = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

// 消息提示
const showSuccess = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// 数据相关
const uploadHistory = ref([])

// 调试相关
const showDebug = ref(false)
const apiLogs = ref([])
const debugMode = process.env.NODE_ENV === 'development'
const apiError = ref(false)
const apiErrorMessage = ref('')

// 计算属性
const username = computed(() => localStorage.getItem('username') || '管理员')

const isFileValid = computed(() => {
  if (!selectedFile.value) return false
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ]
  const isValidType = validTypes.includes(selectedFile.value.type)
  const isValidSize = selectedFile.value.size <= 10 * 1024 * 1024
  return isValidType && isValidSize
})

const teacherCount = computed(() => props.data?.teachers?.length || 0)

const subjectStats = computed(() => {
  const teachersList = props.data?.teachers || []
  const stats = {}
  teachersList.forEach(teacher => {
    const subject = teacher.subject
    stats[subject] = (stats[subject] || 0) + 1
  })
  return stats
})
computed(() =>
    JSON.stringify({
      isUploading: isUploading.value,
      isDragOver: isDragOver.value,
      showSuccess: showSuccess.value,
      hasError: !!errorMessage.value,
      teacherCount: teacherCount.value,
      hasSelectedFile: !!selectedFile.value,
      isFileValid: isFileValid.value,
      hasUploadResult: !!uploadResult.value,
      uploadProgress: uploadProgress.value,
      mode: 'Excel批量导入模式'
    }, null, 2)
);
computed(() => {
  if (!selectedFile.value) return 'null'
  return JSON.stringify({
    name: selectedFile.value.name,
    size: selectedFile.value.size,
    type: selectedFile.value.type,
    lastModified: new Date(selectedFile.value.lastModified).toISOString(),
    isValid: isFileValid.value
  }, null, 2)
});
computed(() =>
    JSON.stringify({
      mode: 'Excel批量导入',
      dataSource: props.data?.teachers ? 'props' : 'local',
      totalCount: teacherCount.value,
      subjectDistribution: subjectStats.value,
      uploadHistoryCount: uploadHistory.value.length
    }, null, 2)
);

// 方法
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function logDebug(action, data = {}) {
  if (!debugMode) return
  const timestamp = new Date().toISOString()
  console.log(`[CreateStudent Debug] ${timestamp} - ${action}:`, data)
}

function handleFileSelect(event) {
  const files = event.target.files
  if (files.length > 0) {
    selectedFile.value = files[0]
    console.log('📁 文件选择调试信息:', {
      name: selectedFile.value.name,
      size: selectedFile.value.size,
      type: selectedFile.value.type,
      lastModified: selectedFile.value.lastModified,
      extension: selectedFile.value.name.split('.').pop()?.toLowerCase(),
      constructor: selectedFile.value.constructor.name,
      toString: selectedFile.value.toString(),
      isFile: selectedFile.value instanceof File,
      isBlob: selectedFile.value instanceof Blob
    })
    logDebug('文件选择', {
      fileName: selectedFile.value.name,
      fileSize: selectedFile.value.size,
      fileType: selectedFile.value.type
    })
    errorMessage.value = ''
  }
}

function handleDrop(event) {
  event.preventDefault()
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    selectedFile.value = files[0]
    console.log('📁 文件拖拽调试信息:', {
      name: selectedFile.value.name,
      size: selectedFile.value.size,
      type: selectedFile.value.type,
      lastModified: selectedFile.value.lastModified,
      extension: selectedFile.value.name.split('.').pop()?.toLowerCase()
    })
    logDebug('文件拖拽', {
      fileName: selectedFile.value.name,
      fileSize: selectedFile.value.size,
      fileType: selectedFile.value.type
    })
    errorMessage.value = ''
  }
}

function handleDragOver(event) {
  event.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDragEnter(event) {
  event.preventDefault()
  isDragOver.value = true
}

function removeFile() {
  selectedFile.value = null
  logDebug('文件移除')
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function downloadTemplate() {
  try {
    const blob = await downloadStudentTemplate()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '学生导入模板.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
    successMessage.value = '学生模板下载成功'
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message || '模板下载失败'
  }
}
async function handleBatchUpload() {
  if (!selectedFile.value || !isFileValid.value) {
    alert('请选择有效的文件')
    return
  }

  isUploading.value = true
  uploadProgress.value = 0
  errorMessage.value = ''

  let progressInterval = null

  try {
    console.log('开始上传 - 文件验证:', {
      fileName: selectedFile.value.name,
      fileSize: selectedFile.value.size,
      fileType: selectedFile.value.type
    })

    logDebug('开始上传', { fileName: selectedFile.value.name })

    progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10
      }
    }, 200)

    const result = await createStudents(selectedFile.value)

    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    uploadProgress.value = 100

    // 使用浏览器默认方式显示结果
    let message = `导入完成！\n\n`
    message += `总记录数：${result.total || 0}\n`
    message += `成功导入：${result.success_count || 0}\n`
    message += `失败：${result.failed_count || 0}\n`

    if (result.failed_count > 0 && result.failed_records) {
      message += `\n失败详情：\n`
      result.failed_records.forEach((item, index) => {
        message += `${index + 1}. ${item.username || '未知用户'}：${item.error || '未知错误'}\n`
      })
    }

    alert(message)


    emit('dataUpdated')

  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    console.error('批量上传失败:', error)
    logDebug('批量上传失败', { error: error.message })

    // 使用浏览器默认方式显示错误
    alert(`导入失败：${error.message || '请重试'}`)

  } finally {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
    isUploading.value = false
  }
}
</script>

<style scoped>
/* 基础布局样式 */
.admin-layout {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #f8fafc;
  overflow: hidden;
  position: relative;
}

.main-layout {
  margin-left: 240px;
  width: calc(100vw - 240px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  position: relative;
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

.content-area {
  flex: 1;
  width: 100%;
  height: calc(100vh - 80px);
  margin: 0;
  padding: 0;
  background: #f8fafc;
  overflow: hidden;
  position: relative;
}

.create-teacher {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e53e3e;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.3);
}

.logout-btn:hover {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
}


.debug-header h3 {
  margin: 0;
  color: #f7fafc;
}


.debug-section h4 {
  margin: 0 0 10px 0;
  color: #cbd5e0;
  font-size: 13px;
}

.debug-section pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e2e8f0;
  font-size: 11px;
  line-height: 1.4;
}

/* 主内容样式 */
.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 0;
  overflow-y: auto;
}

/* 上传卡片样式 */
.upload-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex-shrink: 0;
}

.card-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 30px;
  color: white;
}

.header-content {
  max-width: 100%;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.card-description {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}

.card-body {
  padding: 30px;
}

/* 章节样式 */
.template-section,
.upload-section,
.action-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e2e8f0;
}

.action-section {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
}

/* 模板操作按钮 */
.template-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.template-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.template-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.template-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.template-btn.secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.template-btn.secondary:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-2px);
}

.btn-text {
  font-size: 14px;
}

/* 上传区域样式 */
.upload-area {
  border: 3px dashed #cbd5e0;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f7fafc;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #667eea;
  background: #edf2f7;
}

.upload-area.drag-over {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  transform: scale(1.02);
}

.upload-area.has-file {
  border-color: #38a169;
  background: #f0fff4;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  font-size: 48px;
  color: #a0aec0;
}

.upload-text {
  text-align: center;
}

.primary-text {
  font-size: 18px;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 8px;
}

.secondary-text {
  font-size: 14px;
  color: #718096;
}

/* 文件信息样式 */
.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.file-details {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-icon {
  font-size: 36px;
  color: #667eea;
}

.file-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.file-size {
  font-size: 14px;
  color: #718096;
}

.file-status {
  font-size: 14px;
  font-weight: 500;
}

.file-status.valid {
  color: #38a169;
}

.file-status.invalid {
  color: #e53e3e;
}

.remove-file-btn {
  background: #fed7d7;
  color: #c53030;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-file-btn:hover {
  background: #fbb6ce;
  transform: scale(1.1);
}

.remove-icon {
  font-size: 16px;
}

/* 上传进度样式 */
.upload-progress {
  margin-top: 20px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.stat-item.total .stat-number {
  color: #667eea;
}

.stat-item.success .stat-number {
  color: #38a169;
}

.stat-item.failed .stat-number {
  color: #e53e3e;
}


.template-notes h4 {
  margin: 0 0 15px 0;
  color: #2d3748;
  font-size: 16px;
}

.template-notes ul {
  margin: 0;
  padding-left: 20px;
}

.template-notes li {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.5;
}

.template-notes strong {
  color: #2d3748;
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* 快速提示样式 */
.quick-tip {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #667eea;
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  z-index: 1000;
  max-width: 300px;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-layout {
    margin-left: 260px;
    width: calc(100vw - 260px);
  }
}

@media (max-width: 768px) {
  .main-layout {
    margin-left: 0;
    width: 100vw;
  }

  .mobile-overlay {
    display: block;
  }

  .template-actions,
  .action-buttons {
    flex-direction: column;
  }

  .template-btn,
  .action-btn {
    width: 100%;
    justify-content: center;
  }


  .logout-btn span:last-child {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 10px;
    gap: 20px;
  }

  .card-body {
    padding: 20px;
  }

}
</style>