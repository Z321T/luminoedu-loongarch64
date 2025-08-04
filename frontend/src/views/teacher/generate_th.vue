<template>
  <div class="teacher-layout">
    <!-- 侧边栏 -->
    <Sidebar
        :menuItems="teacherMenuItems"
        :activeItem="'/teacher/exercise_generate'"
    />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="习题生成">
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
        <div class="generate-dashboard">
          <!-- 标题 -->
          <div class="dashboard-header">
            <h1>智能习题生成</h1>
            <button
                @click="showGenerateForm"
                :disabled="generating"
                class="generate-btn"
            >
              {{ generating ? '生成中...' : '新建习题' }}
            </button>
          </div>

          <!-- 生成表单 -->
          <div v-if="showForm" class="generate-form">
            <div class="form-card">
              <h2>生成配置</h2>

              <!-- 生成模式选择 -->
              <div class="form-group">
                <label>生成模式：</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                        type="radio"
                        v-model="generateMode"
                        value="document"
                    />
                    基于文档生成
                  </label>
                  <label class="radio-item">
                    <input
                        type="radio"
                        v-model="generateMode"
                        value="content"
                    />
                    基于自定义内容生成
                  </label>
                </div>
              </div>

              <!-- 文档选择 -->
              <div class="form-group" v-if="generateMode === 'document'">
                <label for="document-select">
                  选择已向量化文档
                  <button
                      type="button"
                      class="refresh-btn"
                      @click="loadDocuments"
                      :disabled="loading"
                  >
                    {{ loading ? '加载中...' : '刷新' }}
                  </button>
                </label>
                <select
                    id="document-select"
                    class="form-select"
                    v-model="selectedDocumentId"
                    :disabled="loading || !documents.length"
                >
                  <option value="">请选择已向量化的文档</option>
                  <option
                      v-for="doc in documents"
                      :key="doc.document_id"
                      :value="doc.document_id"
                  >
                    {{ doc.title }} ({{ doc.filename }})
                  </option>
                </select>
                <div v-if="loading" style="color: #718096; font-size: 12px; margin-top: 4px;">
                  正在加载向量化文档列表...
                </div>
                <div v-else-if="!documents.length" style="color: #e53e3e; font-size: 12px; margin-top: 4px;">
                  暂无已向量化文档，请先上传文档并完成向量化
                </div>
                <div v-else-if="selectedDocumentId" style="color: #38a169; font-size: 12px; margin-top: 4px;">
                  已选择文档，将基于此文档的知识点生成习题
                </div>
              </div>

              <!-- 主题或自定义内容 -->
              <div class="form-group">
                <label v-if="generateMode === 'document'">主题或关键词：</label>
                <label v-else>自定义内容：</label>
                <textarea
                    v-model="customContent"
                    class="form-textarea"
                    :rows="generateMode === 'document' ? 2 : 6"
                    :placeholder="generateMode === 'document' ? '请输入习题相关的主题或关键词...' : '请输入用于生成习题的学习内容...'"
                ></textarea>
              </div>

              <!-- 习题标题 -->
              <div class="form-group">
                <label>习题标题：</label>
                <input
                    v-model="exerciseTitle"
                    type="text"
                    class="form-input"
                    placeholder="请输入习题标题"
                />
              </div>

              <!-- 题目数量 -->
              <div class="form-group">
                <label>题目数量：</label>
                <input
                    v-model.number="exerciseCount"
                    type="number"
                    min="1"
                    max="50"
                    class="form-input"
                />
              </div>

              <!-- 题目类型 -->
              <div class="form-group">
                <label>题目类型：</label>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input
                        type="checkbox"
                        :checked="selectedTypes.includes(1)"
                        @change="toggleType(1)"
                    />
                    选择题
                  </label>
                  <label class="checkbox-item">
                    <input
                        type="checkbox"
                        :checked="selectedTypes.includes(2)"
                        @change="toggleType(2)"
                    />
                    填空题
                  </label>
                  <label class="checkbox-item">
                    <input
                        type="checkbox"
                        :checked="selectedTypes.includes(3)"
                        @change="toggleType(3)"
                    />
                    简答题
                  </label>
                </div>
              </div>

              <!-- 知识匹配 -->
              <div class="form-group">
                <label class="checkbox-item">
                  <input
                      type="checkbox"
                      v-model="useKnowledgeMatching"
                  />
                  启用知识匹配
                </label>
              </div>

              <!-- 操作按钮 -->
              <div class="form-actions">
                <button @click="hideGenerateForm" class="cancel-btn">取消</button>
                <button
                    @click="confirmGenerate"
                    :disabled="!canGenerate || generating"
                    class="generate-btn"
                >
                  {{ generating ? '生成中...' : '开始生成' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 习题列表 -->
          <div class="exercise-section">
            <div class="section-header">
              <h2>我的习题</h2>
              <div class="filter-group">
                <input
                    v-model="titleFilter"
                    @input="handleFilter"
                    type="text"
                    class="filter-input"
                    placeholder="搜索习题标题..."
                />
                <button @click="clearFilter" class="clear-btn">清除</button>
              </div>
            </div>

            <div v-if="loadingList" class="loading">
              正在加载习题列表...
            </div>

            <div v-else-if="listError" class="error-state">
              {{ listError }}
              <button @click="loadExerciseList" class="retry-btn">重试</button>
            </div>

            <div v-else-if="filteredExercises.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <div>暂无习题</div>
              <button @click="showGenerateForm" class="generate-btn">生成第一个习题</button>
            </div>

            <div v-else class="exercise-list">
              <div
                  v-for="exercise in filteredExercises"
                  :key="exercise.filename"
                  class="exercise-item"
              >
                <div class="exercise-icon">📄</div>

                <div class="exercise-info">
                  <h4>{{ getExerciseTitle(exercise.filename) }}</h4>
                  <div class="exercise-meta">
                    <span>创建时间: {{ formatDate(exercise.created_at) }}</span>
                    <span>文件大小: {{ exercise.size_kb }} KB</span>
                  </div>
                </div>

                <div class="exercise-actions">
                  <button
                      @click="previewExercise(exercise)"
                      class="action-btn"
                      title="预览"
                  >
                    📖
                  </button>
                  <button
                      @click="downloadExercise(exercise)"
                      class="action-btn"
                      title="下载"
                  >
                    ⬇️
                  </button>
                  <button
                      @click="deleteExercise(exercise)"
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

        <!-- 预览对话框 -->
        <div v-if="showPreview" class="preview-dialog-overlay" @click="closePreview">
          <div class="preview-dialog" @click.stop>
            <div class="dialog-header">
              <h3>{{ previewTitle }}</h3>
              <button @click="closePreview" class="close-btn">✕</button>
            </div>
            <div class="dialog-body">
              <div v-if="loadingPreview" class="loading">加载中...</div>
              <div v-else-if="previewError" class="error">{{ previewError }}</div>
              <div v-else class="preview-content" v-html="renderedPreview"></div>
            </div>
            <div class="dialog-footer">
              <button @click="downloadCurrentPreview" class="download-btn">下载文件</button>
              <button @click="closePreview" class="close-dialog-btn">关闭</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { marked } from 'marked'
import {
  generateExercise as apiGenerateExercise,
  getFileContent,
  downloadFile,
  getExerciseList,
  deleteExerciseFile,
  getVectorizedDocuments,
  type GenerateRequest,
  type ExerciseFile,
  type DocumentInfo
} from '@/api/teacher/generate_th'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '教师')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

// 状态管理
const generating = ref(false)
const loading = ref(false)
const loadingList = ref(false)
const loadingPreview = ref(false)
const listError = ref('')
const previewError = ref('')

// 表单显示
const showForm = ref(false)

// 生成表单数据
const generateMode = ref<'document' | 'content'>('document')
const selectedDocumentId = ref('')
const customContent = ref('')
const exerciseTitle = ref('')
const exerciseCount = ref(5)
const selectedTypes = ref<number[]>([1])
const useKnowledgeMatching = ref(true)

// 文档列表
const documents = ref<DocumentInfo[]>([])

// 习题列表
const exercises = ref<ExerciseFile[]>([])
const titleFilter = ref('')
const filteredExercises = ref<ExerciseFile[]>([])

// 预览
const showPreview = ref(false)
const previewTitle = ref('')
const previewContent = ref('')
const currentPreviewFile = ref<ExerciseFile | null>(null)

// 计算属性
const canGenerate = computed(() => {
  if (!exerciseTitle.value?.trim() || !customContent.value?.trim() || !selectedTypes.value?.length || exerciseCount.value < 1 || exerciseCount.value > 50) {
    return false
  }
  if (generateMode.value === 'document') {
    return !!selectedDocumentId.value?.trim()
  }
  return true
})

const renderedPreview = computed(() => {
  return previewContent.value ? marked(previewContent.value) : ''
})

// 工具函数
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })
}

const getExerciseTitle = (filename: string): string => {
  const parts = filename.split('_')
  return parts.length >= 4 ? parts.slice(3).join('_').replace('.md', '') : filename.replace('.md', '')
}

// 题目类型切换
const toggleType = (type: number) => {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

// API 调用
const loadDocuments = async () => {
  loading.value = true
  try {
    documents.value = await getVectorizedDocuments()
  } catch (err: any) {
    alert(`加载文档列表失败：${err.message}`)
  } finally {
    loading.value = false
  }
}

const loadExerciseList = async () => {
  loadingList.value = true
  listError.value = ''
  try {
    exercises.value = await getExerciseList()
    filterExercises()
  } catch (err: any) {
    listError.value = err.message
  } finally {
    loadingList.value = false
  }
}

const filterExercises = () => {
  if (titleFilter.value.trim()) {
    filteredExercises.value = exercises.value.filter(ex =>
        getExerciseTitle(ex.filename).toLowerCase().includes(titleFilter.value.toLowerCase())
    )
  } else {
    filteredExercises.value = [...exercises.value]
  }
}

// 表单操作
const showGenerateForm = () => {
  showForm.value = true
  if (generateMode.value === 'document' && documents.value.length === 0) {
    loadDocuments()
  }
}

const hideGenerateForm = () => {
  showForm.value = false
  resetForm()
}

const resetForm = () => {
  generateMode.value = 'document'
  selectedDocumentId.value = ''
  customContent.value = ''
  exerciseTitle.value = ''
  exerciseCount.value = 5
  selectedTypes.value = [1]
  useKnowledgeMatching.value = true
}

const confirmGenerate = async () => {
  if (!canGenerate.value) {
    alert('请填写所有必填项！')
    return
  }
  generating.value = true
  try {
    const request: GenerateRequest = {
      title: exerciseTitle.value.trim(),
      content: customContent.value.trim(),
      count: exerciseCount.value,
      types: selectedTypes.value,
      use_knowledge_matching: useKnowledgeMatching.value
    }
    if (generateMode.value === 'document') {
      request.document_id = selectedDocumentId.value.trim()
    }
    const result = await apiGenerateExercise(request)
    alert(`生成成功！共生成 ${result.exercise_count} 道题目`)
    hideGenerateForm()
    await loadExerciseList()
  } catch (err: any) {
    alert(`生成失败：${err.message || '未知错误'}`)
  } finally {
    generating.value = false
  }
}

// 习题操作
const handleFilter = () => {
  setTimeout(filterExercises, 300)
}

const clearFilter = () => {
  titleFilter.value = ''
  filterExercises()
}

const previewExercise = async (exercise: ExerciseFile) => {
  currentPreviewFile.value = exercise
  previewTitle.value = getExerciseTitle(exercise.filename)
  showPreview.value = true
  loadingPreview.value = true
  previewError.value = ''
  try {
    previewContent.value = await getFileContent(exercise.filename)
  } catch (err: any) {
    previewError.value = err.message
  } finally {
    loadingPreview.value = false
  }
}

const downloadExercise = async (exercise: ExerciseFile) => {
  try {
    const blob = await downloadFile(exercise.filename)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = exercise.filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err: any) {
    alert('下载失败：' + err.message)
  }
}

const downloadCurrentPreview = () => {
  if (currentPreviewFile.value) {
    downloadExercise(currentPreviewFile.value)
  }
}

const deleteExercise = async (exercise: ExerciseFile) => {
  if (!confirm(`确定要删除习题 "${getExerciseTitle(exercise.filename)}" 吗？`)) return
  try {
    await deleteExerciseFile(exercise.filename)
    alert('删除成功')
    await loadExerciseList()
  } catch (err: any) {
    alert('删除失败：' + err.message)
  }
}

const closePreview = () => {
  showPreview.value = false
  previewTitle.value = ''
  previewContent.value = ''
  currentPreviewFile.value = null
}

// 导航
const goBack = () => {
  router.push('/teacher/exercise_generate')
}

// 导航与认证
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}

// 监听器
watch(generateMode, (newMode) => {
  if (newMode === 'document' && documents.value.length === 0) {
    loadDocuments()
  }
})

// 生命周期钩子
onMounted(() => {
  loadExerciseList()
  if (generateMode.value === 'document') {
    loadDocuments()
  }
})
</script>

<style scoped>
/* 样式与学生端 generate_stu.vue 保持一致 */
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

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.generate-dashboard {
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

.generate-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.generate-btn:hover:not(:disabled) {
  background: #2f855a;
}

.generate-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #a0aec0;
}

.generate-form {
  margin-bottom: 32px;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-card h2 {
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 20px;
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

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.radio-item input,
.checkbox-item input {
  width: auto;
  margin: 0;
}

.refresh-btn {
  margin-left: 12px;
  background: #3182ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.refresh-btn:hover {
  background: #2c5aa0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
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

.exercise-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 20px;
}

.filter-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

.clear-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.clear-btn:hover {
  background: #4a5568;
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

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.exercise-item:hover {
  border-color: #cbd5e0;
  background: #fff;
}

.exercise-icon {
  font-size: 24px;
  width: 32px;
  text-align: center;
}

.exercise-info {
  flex: 1;
  min-width: 0;
}

.exercise-info h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exercise-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #718096;
  flex-wrap: wrap;
}

.exercise-actions {
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

.preview-dialog-overlay {
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

.preview-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
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

.preview-content {
  line-height: 1.6;
}

.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3) {
  color: #2d3748;
  margin-top: 0;
}

.preview-content :deep(p) {
  margin-bottom: 16px;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 20px;
}

.preview-content :deep(code) {
  background: #f7fafc;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.preview-content :deep(pre) {
  background: #f7fafc;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.download-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.download-btn:hover {
  background: #2f855a;
}

.close-dialog-btn {
  background: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.close-dialog-btn:hover {
  background: #e2e8f0;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }
  .content {
    padding: 16px;
  }
  .dashboard-header, .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  .filter-group {
    width: 100%;
  }
  .filter-input {
    flex: 1;
  }
  .radio-group, .checkbox-group {
    flex-direction: column;
    gap: 8px;
  }
  .exercise-meta {
    flex-direction: column;
    gap: 4px;
  }
  .preview-dialog {
    width: 95%;
    margin: 16px;
  }
  .form-actions {
    flex-direction: column;
  }
}
</style>