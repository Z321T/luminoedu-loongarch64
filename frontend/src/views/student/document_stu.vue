<template>
  <div class="student-layout">
    <!-- 侧边栏 -->
    <Sidebar
        :menuItems="studentMenuItems"
        :activeItem="'/student/exercise_generate'"
    />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="文档管理">
        <template #actions>
          <div class="header-user">
            <button
                class="back-btn"
                @click="goBack"
            >返回</button>
            <span>欢迎，{{ username }}</span>
            <button
                class="logout-btn"
                @click="handleLogout"
            >退出登录</button>
          </div>
        </template>
      </PageHeader>

      <section class="content">
        <div class="document-dashboard">
          <!-- 标题和上传按钮 -->
          <div class="dashboard-header">
            <h1>文档管理</h1>
            <button
                @click="triggerUpload"
                :disabled="uploading"
                class="upload-btn"
            >
              {{ uploading ? '上传中...' : '上传文档' }}
            </button>
          </div>

          <!-- 统计信息 -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">📄</div>
                <div class="stat-info">
                  <div class="stat-value">{{ documents.length }}</div>
                  <div class="stat-label">总文档数</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                  <div class="stat-value">{{ getTotalChunks() }}</div>
                  <div class="stat-label">总片段数</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">💾</div>
                <div class="stat-info">
                  <div class="stat-value">{{ getTotalSize() }}</div>
                  <div class="stat-label">总大小</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 搜索和筛选 -->
          <div class="filter-section">
            <div class="filter-group">
              <label>搜索：</label>
              <input
                  v-model="searchKeyword"
                  @input="handleSearch"
                  placeholder="搜索文档标题或文件名"
                  type="text"
              />
            </div>
            <div class="filter-group">
              <label>排序：</label>
              <select v-model="sortBy" @change="filterDocuments">
                <option value="date">按时间排序</option>
                <option value="name">按名称排序</option>
                <option value="size">按大小排序</option>
              </select>
            </div>
            <div class="filter-group">
              <button @click="clearSearch" class="upload-btn secondary">清除搜索</button>
            </div>
          </div>

          <!-- 文档列表 -->
          <div class="document-section">
            <div v-if="loading" class="loading">
              正在加载文档列表...
            </div>

            <div v-else-if="error" class="error-state">
              {{ error }}
              <button @click="loadDocuments" class="retry-btn">重试</button>
            </div>

            <div v-else-if="filteredDocuments.length === 0" class="empty-state">
              <div class="empty-icon">📁</div>
              <div>暂无文档</div>
              <button @click="triggerUpload" class="upload-btn">上传第一个文档</button>
            </div>

            <div v-else class="document-list">
              <div
                  v-for="doc in filteredDocuments"
                  :key="doc.document_id"
                  :class="['document-item', { selected: selectedDocuments.has(doc.document_id) }]"
                  @click="selectDocument(doc)"
              >
                <div class="document-icon" :style="{ background: getFileColor(doc.filename) }">
                  <span class="file-type">{{ getFileExtension(doc.filename) }}</span>
                </div>

                <div class="document-info">
                  <h4>{{ doc.title }}</h4>
                  <div class="document-meta">
                    <span>📄 {{ doc.filename }}</span>
                    <span>📊 {{ doc.chunk_count }} 个片段</span>
                    <span>💾 {{ formatFileSize(doc.file_size) }}</span>
                    <span>🕒 {{ formatDate(doc.created_at) }}</span>
                  </div>
                </div>

                <div class="document-actions" @click.stop>
                  <button
                      @click="deleteDocument(doc)"
                      class="action-btn delete"
                      title="删除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

          <<!-- 批量操作栏 -->
        <div v-if="selectedDocuments.size > 0" class="batch-actions">
          <span>已选择 {{ selectedDocuments.size }} 个文档</span>
          <div class="batch-buttons">
            <button @click="batchDelete" class="batch-btn delete">批量删除</button>
            <button @click="clearSelection" class="batch-btn">取消选择</button>
          </div>
        </div>

        <!-- 隐藏的文件上传输入 -->
        <input
            ref="fileInput"
            type="file"
            accept=".txt,.docx"
            @change="handleFileUpload"
            style="display: none;"
        />

        <!-- 上传对话框 -->
        <div v-if="showUploadDialog" class="upload-dialog-overlay" @click="closeUploadDialog">
          <div class="upload-dialog" @click.stop>
            <div class="dialog-header">
              <h3>上传文档</h3>
              <button @click="closeUploadDialog" class="close-btn">✕</button>
            </div>
            <div class="dialog-body">
              <div class="form-group">
                <label>选择文件：</label>
                <div class="file-info">
                  <span>{{ selectedFile?.name }}</span>
                  <span class="file-size">{{ selectedFile ? formatFileSize(selectedFile.size) : '' }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>文档标题：</label>
                <input
                    v-model="uploadTitle"
                    type="text"
                    placeholder="请输入文档标题"
                    class="form-input"
                />
              </div>
              <div class="upload-tips">
                <h4>支持格式：</h4>
                <ul>
                  <li><strong>TXT格式：</strong>纯文本，向量化效果最佳</li>
                  <li><strong>DOCX格式：</strong>Word文档，自动提取文本内容</li>
                </ul>
                <p>文件大小限制：500MB以内</p>
              </div>
            </div>
            <div class="dialog-footer">
              <button @click="closeUploadDialog" class="cancel-btn">取消</button>
              <button
                  @click="confirmUpload"
                  :disabled="!canUpload || uploading"
                  class="upload-btn"
              >
                {{ uploading ? '上传中...' : '确认上传' }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  uploadDocument,
  getDocumentList,
  searchDocuments,
  deleteDocument as deleteDocumentAPI,
  type DocumentInfo
} from '@/api/student/document_stu'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '学生')

const studentMenuItems = [
  { path: '/student/course', label: '我的课程' },
  { path: '/student/chat', label: '学习助手' },
  { path: '/student/exercise_generate', label: '习题生成' },
  { path: '/student/profile', label: '个人信息' },
]

// 状态管理
const loading = ref(false)
const error = ref('')
const uploading = ref(false)
const documents = ref<DocumentInfo[]>([])
const filteredDocuments = ref<DocumentInfo[]>([])
const selectedDocuments = ref(new Set<string>())

// 搜索和筛选
const searchKeyword = ref('')
const sortBy = ref('date')
let searchTimer: NodeJS.Timeout | null = null

// 文件上传
const fileInput = ref<HTMLInputElement>()
const showUploadDialog = ref(false)
const selectedFile = ref<File | null>(null)
const uploadTitle = ref('')

// 计算属性
const getTotalChunks = () => {
  return documents.value.reduce((sum, doc) => sum + doc.chunk_count, 0)
}

const getTotalSize = () => {
  const totalBytes = documents.value.reduce((sum, doc) => sum + doc.file_size, 0)
  return formatFileSize(totalBytes)
}

const canUpload = computed(() => {
  return selectedFile.value && uploadTitle.value.trim().length > 0
})

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE'
}

const getFileColor = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'txt': return '#4a5568'
    case 'docx': return '#2b6cb0'
    default: return '#718096'
  }
}

// 数据操作
const loadDocuments = async () => {
  loading.value = true
  error.value = ''

  try {
    documents.value = await getDocumentList()
    filterDocuments()
  } catch (err: any) {
    console.error('获取文档失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const filterDocuments = () => {
  let filtered = [...documents.value]

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.title.localeCompare(b.title)
      case 'size':
        return b.file_size - a.file_size
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  filteredDocuments.value = filtered
}

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(async () => {
    if (searchKeyword.value.trim()) {
      try {
        loading.value = true
        const results = await searchDocuments(searchKeyword.value.trim())
        filteredDocuments.value = results
      } catch (err: any) {
        console.error('搜索失败:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    } else {
      filterDocuments()
    }
  }, 500)
}

const clearSearch = () => {
  searchKeyword.value = ''
  filterDocuments()
}

// 文件操作
const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  const file = files[0]

  // 检查文件类型
  const allowedTypes = ['.txt', '.docx']
  const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!allowedTypes.includes(fileExt)) {
    alert('不支持的文件格式，请选择 .txt 或 .docx 文件')
    target.value = ''
    return
  }

  // 检查文件大小 (500MB)
  if (file.size > 500 * 1024 * 1024) {
    alert('文件大小不能超过 500MB')
    target.value = ''
    return
  }

  selectedFile.value = file
  uploadTitle.value = file.name.replace(/\.[^/.]+$/, '') // 移除扩展名作为默认标题
  showUploadDialog.value = true
  target.value = ''
}

const closeUploadDialog = () => {
  showUploadDialog.value = false
  selectedFile.value = null
  uploadTitle.value = ''
}

const confirmUpload = async () => {
  if (!selectedFile.value || !uploadTitle.value.trim()) return

  uploading.value = true

  try {
    const result = await uploadDocument(selectedFile.value, uploadTitle.value.trim())

    // 上传成功后重新加载文档列表
    await loadDocuments()

    closeUploadDialog()
    alert(`上传成功！文档已处理为 ${result.chunk_count} 个片段`)
  } catch (err: any) {
    console.error('上传失败:', err)
    alert('上传失败：' + err.message)
  } finally {
    uploading.value = false
  }
}

const selectDocument = (doc: DocumentInfo) => {
  if (selectedDocuments.value.has(doc.document_id)) {
    selectedDocuments.value.delete(doc.document_id)
  } else {
    selectedDocuments.value.add(doc.document_id)
  }
}

const deleteDocument = async (doc: DocumentInfo) => {
  if (!confirm(`确定要删除文档 "${doc.title}" 吗？删除后无法恢复。`)) return

  try {
    await deleteDocumentAPI(doc.document_id)

    // 删除成功后重新加载文档列表
    await loadDocuments()
    selectedDocuments.value.delete(doc.document_id)

    alert('删除成功')
  } catch (err: any) {
    console.error('删除失败:', err)
    alert('删除失败：' + err.message)
  }
}

// 批量操作
const batchDelete = async () => {
  if (selectedDocuments.value.size === 0) return

  if (!confirm(`确定要删除选中的 ${selectedDocuments.value.size} 个文档吗？删除后无法恢复。`)) return

  const deletePromises = Array.from(selectedDocuments.value).map(id =>
      deleteDocumentAPI(id)
  )

  try {
    await Promise.all(deletePromises)

    // 删除成功后重新加载文档列表
    await loadDocuments()
    clearSelection()

    alert('批量删除成功')
  } catch (err: any) {
    console.error('批量删除失败:', err)
    alert('批量删除失败：' + err.message)
    // 重新加载以获取最新状态
    await loadDocuments()
  }
}

const clearSelection = () => {
  selectedDocuments.value.clear()
}

// 导航
const goBack = () => {
  router.push('/student/exercise_generate')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

onMounted(() => {
  loadDocuments()
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

.document-dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  margin: 0;
  color: #2d3748;
  font-size: 28px;
}

.upload-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.upload-btn:hover:not(:disabled) {
  background: #2f855a;
}

.upload-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #a0aec0;
}

.upload-btn.secondary {
  background: #3182ce;
}

.upload-btn.secondary:hover {
  background: #2c5aa0;
}

.stats-section {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  margin-top: 4px;
}


.stat-value.online {
  color: #38a169;
}

.filter-section {
  margin-bottom: 24px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #4a5568;
  min-width: 80px;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.document-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.loading,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  font-size: 16px;
}

.error-state {
  color: #e53e3e;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
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

.document-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #f7fafc;
}

.document-item:hover {
  border-color: #e2e8f0;
  background: #fff;
}

.document-item.selected {
  border-color: #3182ce;
  background: #ebf8ff;
}

.document-icon {
  width: 48px;
  height: 48px;
  background: #4a5568;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-type {
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.document-info {
  flex: 1;
  min-width: 0;
}

.document-info h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #718096;
  flex-wrap: wrap;
}

.document-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #e2e8f0;
}

.action-btn.delete:hover {
  background: #fed7d7;
}

.batch-actions {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 100;
}

.batch-buttons {
  display: flex;
  gap: 8px;
}

.batch-btn {
  background: transparent;
  color: white;
  border: 1px solid #4a5568;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.batch-btn:hover {
  background: #4a5568;
}

.batch-btn.delete {
  border-color: #e53e3e;
  color: #fed7d7;
}

.batch-btn.delete:hover {
  background: #e53e3e;
  color: white;
}

/* 上传对话框样式 */
.upload-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.upload-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #718096;
  padding: 4px;
}

.close-btn:hover {
  color: #2d3748;
}

.dialog-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
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
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.file-size {
  color: #718096;
  font-size: 12px;
}

.upload-tips {
  background: #f7fafc;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #3182ce;
}

.upload-tips h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
}

.upload-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #4a5568;
}

.upload-tips li {
  margin-bottom: 4px;
}

.upload-tips p {
  margin: 8px 0 0 0;
  color: #718096;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.cancel-btn {
  background: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }

  .content {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-group input {
    min-width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .document-meta {
    flex-direction: column;
    gap: 4px;
  }

  .batch-actions {
    left: 16px;
    right: 16px;
    transform: none;
    flex-direction: column;
    gap: 12px;
  }

  .batch-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .upload-dialog {
    width: 95%;
    margin: 16px;
  }
}
</style>