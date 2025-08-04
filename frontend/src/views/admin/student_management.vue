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
        <div class="students-table-card">
          <!-- 表格头部 -->
          <div class="table-header">
            <h3 class="table-title">
              学生列表
            </h3>
            <div class="header-actions">
              <button class="import-btn" @click="goToCreateStudent">
                导入学生
              </button>
            </div>
          </div>

          <!-- 筛选区域 -->
          <!-- 筛选区域 -->
          <div class="filter-section">
            <div class="filter-group">
              <label for="nameSearch">姓名</label>
              <input
                  id="nameSearch"
                  v-model="searchForm.name"
                  @input="handleSearch"
                  type="text"
                  placeholder="请输入学生姓名"
                  class="filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="studentIdSearch">学号</label>
              <input
                  id="studentIdSearch"
                  v-model="searchForm.student_id"
                  @input="handleSearch"
                  type="text"
                  placeholder="请输入学号"
                  class="filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="collegeSearch">学院</label>
              <input
                  id="collegeSearch"
                  v-model="searchForm.college"
                  @input="handleSearch"
                  type="text"
                  placeholder="请输入学院名称"
                  class="filter-input"
              />
            </div>

            <div class="filter-group">
              <button
                  v-if="hasSearchConditions"
                  @click="clearAllSearch"
                  class="clear-btn"
              >
                清空筛选
              </button>
            </div>
          </div>

          <!-- 搜索结果提示 -->
          <div v-if="hasSearchConditions" class="search-results-info">
            找到 {{ filteredStudents.length }} 位学生
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedStudents.length > 0" class="batch-actions">
            <div class="batch-info">
              <span class="batch-text">已选择 {{ selectedStudents.length }} 个学生</span>
            </div>
            <div class="batch-buttons">
              <button class="batch-delete-btn" @click="showDeleteConfirm">
                批量删除
              </button>
            </div>
          </div>

          <!-- 表格容器 -->
          <div class="table-container">
            <table class="students-table">
              <thead>
              <tr>
                <th>
                  <input
                      type="checkbox"
                      @change="toggleAllSelection"
                      :checked="isAllSelected"
                      :indeterminate="isIndeterminate"
                  />
                </th>
                <th>姓名</th>
                <th>学号</th>
                <th>学院</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="loading">
                <td colspan="5" class="loading-row">加载中...</td>
              </tr>
              <tr v-else-if="students.length === 0">
                <td colspan="5" class="no-data">
                  <div v-if="hasSearchConditions" class="no-search-results">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-text">未找到匹配的学生</div>
                    <div class="empty-suggestion">
                      请尝试调整搜索条件或
                      <button class="clear-link" @click="clearAllSearch">清空筛选</button>
                    </div>
                  </div>
                  <div v-else>暂无学生数据</div>
                </td>
              </tr>
              <tr v-for="student in students" :key="student.id">
                <td>
                  <input
                      type="checkbox"
                      :value="student.student_id"
                      @change="toggleStudentSelection(student.student_id)"
                      :checked="selectedStudents.includes(student.student_id)"
                  />
                </td>
                <td>{{ student.username }}</td>
                <td>{{ student.student_id }}</td>
                <td>{{ student.college }}</td>
                <td>
                  <button class="detail-btn" @click="showStudentDetail(student.student_id)">
                    查看详情
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页控件 -->
          <div class="pagination">
            <div class="pagination-info">
              第 {{ currentPage }} 页 / 共 {{ totalPages }} 页，共 {{ filteredStudents.length }} 条记录
            </div>
            <div class="pagination-controls">
              <button
                  class="page-btn"
                  :disabled="currentPage <= 1"
                  @click="handlePageChange(1)"
              >首页</button>
              <button
                  class="page-btn"
                  :disabled="currentPage <= 1"
                  @click="handlePageChange(currentPage - 1)"
              >上一页</button>
              <button
                  class="page-btn"
                  :disabled="currentPage >= totalPages"
                  @click="handlePageChange(currentPage + 1)"
              >下一页</button>
              <button
                  class="page-btn"
                  :disabled="currentPage >= totalPages"
                  @click="handlePageChange(totalPages)"
              >末页</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 学生详细信息弹窗 -->
    <el-dialog v-model="showDetailDialog" :title="isEditing ? '编辑学生信息' : '学生详细信息'" width="600px">
      <div v-if="currentStudent" class="student-detail">
        <div v-for="(field, index) in studentFields" :key="index" class="detail-item">
          <label>{{ field.label }}：</label>
          <template v-if="isEditing">
            <input
                v-if="field.type === 'text'"
                v-model="editForm[field.key]"
                :type="field.inputType || 'text'"
                class="edit-input"
            />
            <textarea
                v-else-if="field.type === 'textarea'"
                v-model="editForm[field.key]"
                class="edit-textarea"
            ></textarea>
          </template>
          <span v-else>{{ formatFieldValue(field.key) }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <template v-if="isEditing">
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="saveStudentInfo">保存</el-button>
          </template>
          <template v-else>
            <el-button @click="showDetailDialog = false">关闭</el-button>
            <el-button type="warning" @click="showResetPasswordDialog">重置密码</el-button>
            <el-button type="primary" @click="startEdit">编辑</el-button>
          </template>
        </span>
      </template>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog v-model="showPasswordDialog" title="重置学生密码" width="400px">
      <div class="password-form">
        <div class="form-item">
          <label>新密码：</label>
          <input v-model="newPassword" type="password" placeholder="请输入新密码" class="password-input" />
        </div>
        <div class="form-item">
          <label>确认密码：</label>
          <input v-model="confirmPassword" type="password" placeholder="请确认新密码" class="password-input" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePasswordDialog">取消</el-button>
          <el-button type="primary" @click="resetPassword">确认重置</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="showDeleteDialog" title="确认删除" width="500px">
      <div class="delete-confirm">
        <div class="warning-icon">⚠️</div>
        <div class="confirm-text">
          <p>您确定要删除以下 <strong>{{ selectedStudents.length }}</strong> 个学生吗？</p>
          <p class="warning-text">此操作不可撤销，请谨慎操作！</p>
          <div class="student-list">
            <div v-for="studentId in selectedStudents.slice(0, 5)" :key="studentId" class="student-item">
              {{ getStudentName(studentId) }} ({{ studentId }})
            </div>
            <div v-if="selectedStudents.length > 5" class="more-text">
              还有 {{ selectedStudents.length - 5 }} 个学生...
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确认删除</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 快速提示 -->
    <transition name="tip-fade">
      <div v-if="showQuickTip" class="quick-tip">
        <div class="tip-content">
          <span class="tip-icon">💡</span>
          <span>{{ quickTipMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import SideBar from '@/components/layout/SideBar.vue'
import { getStudentList, updateStudent, resetStudentPassword, deleteStudents } from '@/api/admin/user_management'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')
const showQuickTip = ref(false)
const quickTipMessage = ref('')

// 列表相关
const allStudents = ref<any[]>([]) // 存储完整的学生列表
const filteredStudents = ref<any[]>([]) // 存储过滤后的学生列表
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)

// 搜索表单
const searchForm = ref({
  name: '',
  student_id: '',
  college: ''
})

let searchTimer: any = null

// 选择相关
const selectedStudents = ref<string[]>([])
const showDetailDialog = ref(false)
const currentStudent = ref<any>(null)
const isEditing = ref(false)
const editForm = reactive<any>({})
const showPasswordDialog = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const showDeleteDialog = ref(false)

const adminMenuItems = [
  { path: '/admin/log_management', label: '日志管理' },
  { path: '/admin/teacher_management', label: '教师管理' },
  { path: '/admin/student_management', label: '学生管理' },
  { path: '/admin/model_management', label: '模型管理' },
]

const studentFields = [
  { key: 'username', label: '姓名', type: 'text' },
  { key: 'student_id', label: '学号', type: 'text' },
  { key: 'college', label: '学院', type: 'text' },
  { key: 'major', label: '专业', type: 'text' },
  { key: 'grade', label: '年级', type: 'text' },
  { key: 'enrollment_year', label: '入学年份', type: 'text', inputType: 'number' },
  { key: 'intro', label: '个人简介', type: 'textarea' },
  { key: 'contact_email', label: '邮箱', type: 'text', inputType: 'email' }
]

// 检查是否有搜索条件
const hasSearchConditions = computed(() => {
  return searchForm.value.name || searchForm.value.student_id || searchForm.value.college
})

// 基于过滤后的数据进行分页
const students = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

// 重新计算总页数，基于过滤后的数据
const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value))

const isAllSelected = computed(() => {
  return students.value.length > 0 && students.value.every(student =>
      selectedStudents.value.includes(student.student_id)
  )
})

const isIndeterminate = computed(() => {
  return selectedStudents.value.length > 0 && selectedStudents.value.length < students.value.length
})

// 前端搜索过滤函数
const applyLocalSearch = () => {
  if (!hasSearchConditions.value) {
    filteredStudents.value = [...allStudents.value]
  } else {
    filteredStudents.value = allStudents.value.filter(student => {
      const nameMatch = !searchForm.value.name ||
          student.username.toLowerCase().includes(searchForm.value.name.toLowerCase())

      const studentIdMatch = !searchForm.value.student_id ||
          student.student_id.toLowerCase().includes(searchForm.value.student_id.toLowerCase())

      const collegeMatch = !searchForm.value.college ||
          student.college.toLowerCase().includes(searchForm.value.college.toLowerCase())

      return nameMatch && studentIdMatch && collegeMatch
    })
  }

  // 搜索后重置到第一页
  if (hasSearchConditions.value && currentPage.value > 1) {
    currentPage.value = 1
  }

  // 清空选择
  selectedStudents.value = []
}

// 搜索处理函数
const handleSearch = () => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  // 设置防抖延迟
  searchTimer = setTimeout(() => {
    applyLocalSearch()
  }, 300)
}

// 清空所有搜索条件
const clearAllSearch = () => {
  searchForm.value = {
    name: '',
    student_id: '',
    college: ''
  }
  applyLocalSearch()
}

// 修改分页处理函数
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 修改 loadStudents 函数
const loadStudents = async () => {
  try {
    loading.value = true

    // 获取所有学生数据用于前端搜索
    const response = await getStudentList(1, 1000, '')

    // 存储完整的学生列表用于前端搜索
    allStudents.value = response.students
    total.value = response.total

    // 应用前端搜索过滤
    applyLocalSearch()
  } catch (error) {
    showQuickTipMessage('加载学生列表失败')
  } finally {
    loading.value = false
  }
}

const goToCreateStudent = () => {
  router.push('/admin/create_student')
}

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
  }, 2000)
}

const showStudentDetail = (studentId: string) => {
  const student = allStudents.value.find(s => s.student_id === studentId)
  currentStudent.value = student || null
  showDetailDialog.value = true
}

const startEdit = () => {
  Object.assign(editForm, currentStudent.value)
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  Object.keys(editForm).forEach(key => delete editForm[key])
}

const saveStudentInfo = async () => {
  try {
    const data = {
      ...editForm,
      enrollment_year: Number(editForm.enrollment_year)
    }
    const result = await updateStudent(currentStudent.value.student_id, data)
    if (result.status === 'success') {
      showQuickTipMessage('更新成功')
      isEditing.value = false
      await loadStudents()
      currentStudent.value = { ...editForm }
    }
  } catch (error: any) {
    showQuickTipMessage(error.message)
  }
}

const showResetPasswordDialog = () => {
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordDialog.value = true
}

const closePasswordDialog = () => {
  showPasswordDialog.value = false
  newPassword.value = ''
  confirmPassword.value = ''
}

const resetPassword = async () => {
  try {
    if (!newPassword.value) {
      showQuickTipMessage('请输入新密码')
      return
    }
    if (newPassword.value.length < 6) {
      showQuickTipMessage('密码长度不能少于6位')
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      showQuickTipMessage('两次输入的密码不一致')
      return
    }
    const result = await resetStudentPassword(currentStudent.value.student_id, newPassword.value)
    if (result.status === 'success') {
      showQuickTipMessage('密码重置成功')
      closePasswordDialog()
    }
  } catch (error: any) {
    showQuickTipMessage(error.message)
  }
}

const formatFieldValue = (key: string) => {
  const value = currentStudent.value?.[key]
  if (value === null || value === undefined) return '暂无'
  return value
}

const toggleStudentSelection = (studentId: string) => {
  const index = selectedStudents.value.indexOf(studentId)
  if (index === -1) {
    selectedStudents.value.push(studentId)
  } else {
    selectedStudents.value.splice(index, 1)
  }
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedStudents.value = []
  } else {
    selectedStudents.value = students.value.map(s => s.student_id)
  }
}

const showDeleteConfirm = () => {
  if (selectedStudents.value.length === 0) {
    showQuickTipMessage('请先选择要删除的学生')
    return
  }
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    if (selectedStudents.value.length === 0) return
    await deleteStudents(selectedStudents.value)
    showQuickTipMessage('批量删除成功')
    selectedStudents.value = []
    showDeleteDialog.value = false
    await loadStudents()
  } catch (error: any) {
    showQuickTipMessage(error.message)
  }
}

const getStudentName = (studentId: string) => {
  const student = allStudents.value.find(s => s.student_id === studentId)
  return student ? student.username : '未知'
}

onMounted(() => {
  loadStudents()
})
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
  padding: 20px;
  background: #f8fafc;
  overflow-y: auto;
  position: relative;
}

/* 学生列表卡片样式 */
.students-table-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

/* 表格头部样式 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 筛选区域样式 - 与教师页面保持一致 */
.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.filter-group input,
.filter-group select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  padding: 10px 20px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  align-self: flex-end;
}

.clear-btn:hover {
  background: #d97706;
  transform: translateY(-1px);
}

/* 搜索结果提示 */
.search-results-info {
  margin-bottom: 16px;
  padding: 8px 16px;
  background: rgba(34, 197, 94, 0.1);
  color: #059669;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* 批量操作栏 */
.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.batch-text {
  color: #92400e;
  font-weight: 500;
}

.batch-delete-btn {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.batch-delete-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.students-table th,
.students-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.students-table th {
  background: #f7fafc;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
}

.students-table tr:hover {
  background: #f0f7ff;
}

/* 操作按钮样式 */
.detail-btn {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.import-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.import-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
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
  display: flex;
  align-items: center;
  gap: 4px;
}

.logout-btn:hover {
  background: #c0392b;
  color: #fff;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #667eea;
  color: #667eea;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

/* 空搜索结果样式 */
.no-search-results {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-search-results .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-search-results .empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;
}

.no-search-results .empty-suggestion {
  font-size: 14px;
  color: #9ca3af;
}

.clear-link {
  color: #667eea;
  text-decoration: underline;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
}

.clear-link:hover {
  color: #5a67d8;
}

/* 空数据状态样式 */
.no-data {
  text-align: center;
  padding: 32px;
  color: #718096;
}

.loading-row {
  text-align: center;
  padding: 32px;
  color: #718096;
  font-style: italic;
}

/* 快速提示样式 */
.quick-tip {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: #2d3748;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: all 0.3s ease;
}

.tip-fade-enter-from,
.tip-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-layout {
    margin-left: 0;
    width: 100vw;
  }

  .filter-section {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .filter-group {
    min-width: unset;
    width: 100%;
  }

  .clear-btn {
    align-self: stretch;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
  }
}
</style>