<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <SideBar :menuItems="adminMenuItems" />

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
        <!-- 创建教师内容 -->
        <div class="create-teacher">
          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- Excel 批量导入卡片 -->
            <div class="upload-card">
              <div class="card-header">
                <div class="header-content">
                  <h2 class="card-title">
                    批量导入教师
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
                        @click="handleDownloadTemplate"
                        :disabled="downloading"
                        class="template-btn primary"
                    >
                      <span class="btn-text">{{ downloading ? '下载中...' : '下载Excel模板' }}</span>
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
                      @click="fileInput?.click()"
                  >
                    <input
                        ref="fileInput"
                        type="file"
                        accept=".xlsx,.xls"
                        @change="onFileChange"
                        style="display: none"
                    />

                    <div
                        v-if="!selectedFile"
                        class="upload-placeholder"
                    >
                      <div class="upload-icon">📁</div>
                      <div class="upload-text">
                        <div class="primary-text">点击选择文件或拖拽到此处</div>
                        <div class="secondary-text">支持 .xlsx, .xls 格式</div>
                      </div>
                    </div>

                    <div v-else class="file-info">
                      <div class="file-details">
                        <div class="file-icon">📄</div>
                        <div class="file-meta">
                          <div class="file-name">{{ selectedFile.name }}</div>
                          <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                          <div :class="['file-status', { 'valid': isFileValid, 'invalid': !isFileValid }]">
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
                      v-if="importing"
                      class="upload-progress"
                  >
                    <div class="progress-bar">
                      <div
                          class="progress-fill"
                          :style="{ width: uploadProgress + '%' }"
                      ></div>
                    </div>
                    <div class="progress-text">
                      <span class="loading-spinner"></span>
                      正在导入... {{ uploadProgress.toFixed(0) }}%
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="action-section">
                    <h3 class="section-title">

                    </h3>
                    <div class="action-buttons">
                      <button
                          @click="handleImport"
                          :disabled="!selectedFile || importing || !isFileValid"
                          :class="['action-btn', 'primary', { 'loading': importing }]"
                      >
                        <span class="btn-text">
                          {{ importing ? '正在导入...' : '开始导入教师' }}
                        </span>
                      </button>


                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 导入结果卡片 -->

            <!-- 错误信息 -->
          </div>
        </div>
      </main>
    </div>

    <!-- 移动端遮罩 -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu" />

    <!-- 快速提示 -->
    <transition name="tip-fade">
      <div v-if="showQuickTip" class="quick-tip">
        <div class="tip-content">
          <span>{{ quickTipMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import SideBar from '@/components/layout/SideBar.vue'
import { createTeachers, downloadTeacherTemplate } from '@/api/admin/user_management'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')
const mobileMenuOpen = ref(false)
const downloading = ref(false)
const importing = ref(false)
const selectedFile = ref<File | null>(null)
const importResult = ref<any>(null)
const errorMsg = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const uploadProgress = ref(0)
const showQuickTip = ref(false)
const quickTipMessage = ref('')

const adminMenuItems = [
  { path: '/admin/log_management', label: '日志管理' },
  { path: '/admin/teacher_management', label: '教师管理' },
  { path: '/admin/student_management', label: '学生管理' },
  { path: '/admin/model_management', label: '模型管理' },
]

// 计算属性
const isFileValid = computed(() => {
  if (!selectedFile.value) return false
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  const isValidType = validTypes.includes(selectedFile.value.type) ||
      selectedFile.value.name.toLowerCase().endsWith('.xlsx') ||
      selectedFile.value.name.toLowerCase().endsWith('.xls')
  const isValidSize = selectedFile.value.size <= 10 * 1024 * 1024
  return isValidType && isValidSize
})

// 方法
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

const showQuickTipMessage = (message: string) => {
  quickTipMessage.value = message
  showQuickTip.value = true
  setTimeout(() => {
    showQuickTip.value = false
  }, 3000)
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 下载导入模板
const handleDownloadTemplate = async () => {
  try {
    downloading.value = true
    const blob = await downloadTeacherTemplate()
    if (!blob) throw new Error('下载失败')
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '教师导入模板.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showQuickTipMessage('模板下载成功')
  } catch (e: any) {
    errorMsg.value = e.message || '模板下载失败'
  } finally {
    downloading.value = false
  }
}

// 文件操作
const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    errorMsg.value = ''
  } else {
    selectedFile.value = null
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    errorMsg.value = ''
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const removeFile = () => {
  selectedFile.value = null
  importResult.value = null
  errorMsg.value = ''
  uploadProgress.value = 0
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 导入教师
const handleImport = async () => {
  if (!selectedFile.value || !isFileValid.value) {
    alert('请选择有效的文件')
    return
  }

  importing.value = true
  importResult.value = null
  errorMsg.value = ''
  uploadProgress.value = 0

  let progressInterval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += Math.random() * 10
    }
  }, 200)

  try {
    const result = await createTeachers(selectedFile.value)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // 使用浏览器默认方式显示结果
    let message = `导入完成！\n\n`
    message += `总记录数：${result.total || 0}\n`
    message += `成功导入：${result.success_count || 0}\n`
    message += `失败：${result.failed_count || 0}\n`

    if (result.failed_count > 0 && result.failed_records) {
      message += `\n失败详情：\n`
      result.failed_records.forEach((item: any, index: number) => {
        message += `${index + 1}. ${item.username || '未知用户'}：${item.error || '未知错误'}\n`
      })
    }

    alert(message)

  } catch (err: any) {
    clearInterval(progressInterval)
    console.error('导入失败:', err)
    alert(`导入失败：${err.message || '请重试'}`)
    errorMsg.value = err.message || '导入失败'
  } finally {
    importing.value = false
  }
}

</script>

<style scoped>
/* 复用创建学生页面的完整样式 */
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

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 0;
  overflow-y: auto;
}

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

.template-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

.template-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-text {
  font-size: 14px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #c3dafe;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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