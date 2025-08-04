<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <Sidebar :menuItems="adminMenuItems" />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏，添加退出按钮 -->
      <PageHeader title="管理系统">
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
        <div class="model-management">
          <h1>模型管理</h1>
          <!-- 按钮组 - 实现并排显示 -->
          <div class="model-actions">
            <button
                class="download-btn"
                @click="downloadModel"
                :disabled="isDownloading"
                :class="{ 'loading': isDownloading }"
            >
              <span v-if="isDownloading" class="loading-spinner"></span>
              {{ isDownloading ? '下载中...' : '下载模型' }}
            </button>
            <button
                class="delete-btn"
                @click="deleteModel"
                :disabled="!modelStatus?.has_local_model || isDownloading"
            >
              删除模型
            </button>
          </div>
          <!-- 下载进度提示 -->
          <div v-if="isDownloading" class="download-progress">
            <div class="progress-content">
              <div class="progress-icon">
                <div class="spinner"></div>
              </div>
              <div class="progress-text">
                <h3>正在下载模型...</h3>
                <p>模型文件较大，请耐心等待。下载完成后会自动刷新状态。</p>
              </div>
            </div>
          </div>
          <!-- 模型状态信息框 -->
          <div class="model-status-section">
            <h2>模型状态</h2>
            <div class="status-card" v-if="modelStatus">
              <div class="status-item">
                <span class="status-label">本地模型:</span>
                <span class="status-value" :class="{ 'status-success': modelStatus.has_local_model, 'status-error': !modelStatus.has_local_model }">
                  {{ modelStatus.has_local_model ? '已安装' : '未安装' }}
                </span>
              </div>

              <div class="status-item" v-if="modelStatus.has_local_model">
                <span class="status-label">模型路径:</span>
                <span class="status-value status-path">{{ modelStatus.local_model_path }}</span>
              </div>

              <div class="status-item">
                <span class="status-label">离线可用:</span>
                <span class="status-value" :class="{ 'status-success': modelStatus.can_use_offline, 'status-error': !modelStatus.can_use_offline }">
                  {{ modelStatus.can_use_offline ? '是' : '否' }}
                </span>
              </div>

              <div class="status-item">
                <span class="status-label">备用可用:</span>
                <span class="status-value" :class="{ 'status-success': modelStatus.fallback_available, 'status-error': !modelStatus.fallback_available }">
                  {{ modelStatus.fallback_available ? '是' : '否' }}
                </span>
              </div>
            </div>

            <div class="loading-status" v-else-if="loading">
              加载模型状态中...
            </div>

            <div class="error-status" v-else-if="error">
              获取模型状态失败: {{ error }}
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
import { downloadModelApi, getModelStatusApi, deleteModelApi } from '@/api/admin/model_management'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')
const modelStatus = ref<any>(null)
const loading = ref(false)
const error = ref('')
const isDownloading = ref(false)

const adminMenuItems = [
  { path: '/admin/log_management', label: '日志管理' },
  { path: '/admin/teacher_management', label: '教师管理' },
  { path: '/admin/student_management', label: '学生管理' },
  { path: '/admin/model_management', label: '模型管理' },
]

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

const fetchModelStatus = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await getModelStatusApi()
    modelStatus.value = response.data
  } catch (err: any) {
    error.value = err.message || '获取模型状态失败'
    console.error('获取模型状态错误:', err)
  } finally {
    loading.value = false
  }
}

const downloadModel = async () => {
  isDownloading.value = true
  try {
    const response = await downloadModelApi()
    const data = response.data

    if (data && data.message) {
      alert(data.message)
      await fetchModelStatus()
    } else {
      alert('模型下载成功')
      await fetchModelStatus()
    }
  } catch (error) {
    console.error('下载错误:', error)
    alert('模型下载失败')
  } finally {
    isDownloading.value = false
  }
}

const deleteModel = async () => {
  if (!confirm('确定要删除本地模型吗？此操作不可撤销。')) {
    return
  }

  try {
    const response = await deleteModelApi()
    const data = response.data

    if (data && data.message) {
      alert(data.message)
      await fetchModelStatus()
    } else {
      alert('模型删除成功')
      await fetchModelStatus()
    }
  } catch (error: any) {
    console.error('删除错误:', error)
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message)
    } else {
      alert('模型删除失败')
    }
  }
}

onMounted(() => {
  fetchModelStatus()
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

.admin-layout {
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

.model-management {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.model-management h1 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

/* 按钮组样式 */
.model-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.download-btn {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.download-btn:hover {
  background: #2980b9;
}

.delete-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.delete-btn:hover:not(:disabled) {
  background: #c0392b;
}

.delete-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.model-status-section {
  margin-top: 16px;
}

.model-status-section h2 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.status-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-weight: 500;
  color: #495057;
}

.status-value {
  font-weight: 600;
}

.status-success {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}

.status-path {
  color: #6c757d;
  font-size: 12px;
  word-break: break-all;
  text-align: right;
  max-width: 60%;
}

.loading-status {
  color: #6c757d;
  font-style: italic;
  padding: 20px;
  text-align: center;
}

.error-status {
  color: #dc3545;
  padding: 20px;
  text-align: center;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

/* 按钮加载状态样式 */
.download-btn.loading {
  background: #7fb3d3;
  cursor: not-allowed;
  position: relative;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 下载进度提示框 */
.download-progress {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.progress-icon {
  flex-shrink: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.progress-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.progress-text p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
}

/* 禁用状态优化 */
.download-btn:disabled,
.delete-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.delete-btn:disabled {
  background: #d5d5d5;
  color: #888;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .progress-text h3 {
    font-size: 16px;
  }

  .progress-text p {
    font-size: 13px;
  }
}

/* 按钮组样式 */
.model-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.download-btn {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.download-btn:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.delete-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.delete-btn:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }
  .content {
    padding: 12px;
  }
  .model-management {
    padding: 12px;
  }
}
</style>