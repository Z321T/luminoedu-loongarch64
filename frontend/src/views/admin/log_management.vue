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
        <div class="logs-management">
          <h1>日志文件管理</h1>
          <!-- 服务选择 -->
          <div class="filter-group">
            <label>选择服务：</label>
            <select
                v-model="selectedService"
                @change="loadLogFiles"
            >
              <option
                  v-for="service in logServices"
                  :key="service.name"
                  :value="service.name"
              >
                {{ service.description }} ({{ service.name }})
              </option>
            </select>
          </div>
          <!-- 日期筛选 -->
          <div class="filter-group">
            <label>开始日期：</label>
            <input
                type="date"
                v-model="fileStartDate"
                @change="loadLogFiles"
            />
            <label>结束日期：</label>
            <input
                type="date"
                v-model="fileEndDate"
                @change="loadLogFiles"
            />
          </div>
          <!-- 导出按钮 -->
          <div class="export-section">
            <button
                @click="handleExportLogs"
                class="export-btn"
                :disabled="exporting || !selectedService"
            >
              <span v-if="exporting">导出中...</span>
              <span v-else>导出全部日志</span>
            </button>
          </div>
          <!-- 文件列表 -->
          <div class="file-list">
            <div v-if="loadingFiles">加载中...</div>
            <div v-else-if="logFiles.length === 0">暂无日志文件</div>
            <ul v-else>
              <li
                  v-for="file in logFiles"
                  :key="file.name"
                  class="file-item"
              >
                <span class="file-name">{{ file.name }}</span>
                <span class="file-date">{{ formatFileDate(file.date) }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <div class="file-actions">
                  <button
                      @click="viewFile(file)"
                      class="view-btn"
                  >查看</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- 文件内容查看模态框 -->
    <div
        v-if="showContentModal"
        class="modal-overlay"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ viewingFile?.name }}</h3>
          <button
              @click="closeContentModal"
              class="close-btn"
          >&times;</button>
        </div>
        <div class="modal-body">
          <div
              v-if="loadingContent"
              class="content-loading"
          >加载中...</div>
          <pre
              v-else-if="fileContent.length"
              class="file-content"
          >{{ fileContent.join('\n') }}</pre>
          <div
              v-else
              class="empty-content"
          >文件内容为空</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  getLogServices,
  getLogFiles,
  getLogFileContent,
  formatFileDate,
  formatFileSize,
  exportServiceLogs,
  triggerDownload,
} from '@/api/admin/admin_log'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')

const adminMenuItems = [
  { path: '/admin/log_management', label: '日志管理' },
  { path: '/admin/teacher_management', label: '教师管理' },
  { path: '/admin/student_management', label: '学生管理' },
  { path: '/admin/model_management', label: '模型管理' },
]

const logServices = ref<{ name: string; description: string }[]>([])
const selectedService = ref('')
const fileStartDate = ref('')
const fileEndDate = ref('')
const logFiles = ref<any[]>([])
const loadingFiles = ref(false)

// 在其他 ref 定义后添加
const fileContent = ref<string[]>([])
const viewingFile = ref<{ name: string; service: string } | null>(null)
const loadingContent = ref(false)
const showContentModal = ref(false)
const exporting = ref(false)

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

const loadLogServices = async () => {
  try {
    const res = await getLogServices()
    logServices.value = res.services
    if (res.services.length > 0) selectedService.value = res.services[0].name
  } catch {
    logServices.value = []
  }
}

const loadLogFiles = async () => {
  if (!selectedService.value) return
  loadingFiles.value = true
  try {
    const params = {
      service_name: selectedService.value,
      start_date: fileStartDate.value || undefined,
      end_date: fileEndDate.value || undefined,
    }
    const res = await getLogFiles(params)
    logFiles.value = res.files
  } catch {
    logFiles.value = []
  } finally {
    loadingFiles.value = false
  }
}

// 添加在 downloadFile 函数后面
const viewFile = async (file: any) => {
  try {
    loadingContent.value = true
    viewingFile.value = {
      name: file.name,
      service: selectedService.value,
    }
    showContentModal.value = true

    const result = await getLogFileContent({
      service_name: selectedService.value,
      file_name: file.name,
    })

    fileContent.value = result.content || []
  } catch (error: any) {
    alert(`查看文件失败: ${error.message || '未知错误'}`)
    showContentModal.value = false
  } finally {
    loadingContent.value = false
  }
}

// 关闭模态框
const closeContentModal = () => {
  showContentModal.value = false
  fileContent.value = []
  viewingFile.value = null
}

// 修改 handleExportLogs 函数
const handleExportLogs = async () => {
  try {
    // 显示加载状态
    exporting.value = true

    // 调用导出函数
    const blob = await exportServiceLogs(
        selectedService.value,
        fileStartDate.value,
        fileEndDate.value
    )

    // 下载文件
    const filename = `${selectedService.value}_logs_${new Date().toISOString().slice(0, 10)}.txt`
    triggerDownload(blob, filename)

    // 显示成功消息
    alert('日志导出成功')
  } catch (error: any) {
    // 显示错误消息
    alert(`导出失败: ${error.message || '未知错误'}`)
  } finally {
    // 隐藏加载状态
    exporting.value = false
  }
}

onMounted(async () => {
  await loadLogServices()
  await loadLogFiles()
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
.logs-management {
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
.filter-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.export-section {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
.export-btn {
  background: #38a169;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.export-btn:hover:not(:disabled) {
  background: #2f855a;
}

.export-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.file-list {
  margin-top: 24px;
}
.file-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.file-name {
  flex: 1;
  font-weight: 500;
}
.file-date,
.file-size {
  color: #718096;
  font-size: 13px;
  min-width: 120px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.view-btn {
  background: #4299e1;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 14px;
  cursor: pointer;
  font-size: 14px;
}

.view-btn:hover {
  background: #3182ce;
}

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
  width: 80%;
  max-width: 1000px;
  height: 80%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #718096;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.file-content {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  height: 100%;
  overflow: auto;
}

.content-loading,
.empty-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #718096;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }
  .content {
    padding: 12px;
  }
  .logs-management {
    padding: 12px;
  }
}
</style>