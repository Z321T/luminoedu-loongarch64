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
            <button
                class="logout-btn"
                @click="handleLogout"
            >退出登录</button>
          </div>
        </template>
      </PageHeader>

      <!-- 内容区域 -->
      <main class="content-area">
        <div class="teachers-table-card">
          <!-- 表格头部 -->
          <div class="table-header">
            <h2 class="table-title">
              <span class="title-icon">👥</span>
              <span>教师列表</span>
            </h2>
            <div class="header-actions">
              <button class="import-btn" @click="goToCreateTeacher">
                <span>➕</span>
                <span>批量导入教师</span>
              </button>
            </div>
          </div>

          <!-- 筛选区域 -->
          <div class="filter-section">
            <div class="filter-group">
              <label for="nameSearch">姓名</label>
              <input
                  id="nameSearch"
                  v-model="searchForm.name"
                  @input="handleSearch"
                  type="text"
                  placeholder="请输入教师姓名"
                  class="filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="staffIdSearch">教工号</label>
              <input
                  id="staffIdSearch"
                  v-model="searchForm.staff_id"
                  @input="handleSearch"
                  type="text"
                  placeholder="请输入教工号"
                  class="filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="departmentSearch">所属院系</label>
              <input
                  id="departmentSearch"
                  v-model="searchForm.department"
                  @input="handleSearch"
                  type="text"
                  placeholder="请输入院系名称"
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
            找到 {{ filteredTeachers.length }} 位教师
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedTeachers.length > 0" class="batch-actions">
            <div class="batch-info">
              <label class="batch-checkbox">
                <input
                    type="checkbox"
                    @change="toggleAllSelection"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                />
                <span class="checkmark"></span>
              </label>
              <span class="batch-text">已选择 {{ selectedTeachers.length }} 名教师</span>
            </div>
            <div class="batch-buttons">
              <button class="batch-delete-btn" @click="showDeleteConfirm">
                批量删除
              </button>
            </div>
          </div>

          <!-- 表格容器 -->
          <div class="table-container">
            <table class="teachers-table">
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
                <th>教工号</th>
                <th>所属院系</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="loading">
                <td colspan="5" class="loading-row">加载中...</td>
              </tr>
              <tr v-else-if="teachers.length === 0">
                <td colspan="5" class="no-data">
                  <div v-if="hasSearchConditions" class="no-search-results">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-text">未找到匹配的教师</div>
                    <div class="empty-suggestion">
                      尝试调整搜索条件或
                      <button @click="clearAllSearch" class="clear-link">
                        清空搜索条件
                      </button>
                    </div>
                  </div>
                  <div v-else>暂无教师数据</div>
                </td>
              </tr>
              <tr v-else v-for="teacher in teachers" :key="teacher.id">
                <td>
                  <input
                      type="checkbox"
                      :value="teacher.staff_id"
                      @change="toggleTeacherSelection(teacher.staff_id)"
                      :checked="selectedTeachers.includes(teacher.staff_id)"
                  />
                </td>
                <td>{{ teacher.username }}</td>
                <td>{{ teacher.staff_id }}</td>
                <td>{{ teacher.department }}</td>
                <td>
                  <button
                      @click="showTeacherDetail(teacher.staff_id)"
                      class="detail-btn"
                  >
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
              <span>共 {{ filteredTeachers.length }} 条记录，当前第 {{ currentPage }} / {{ totalPages }} 页</span>
            </div>
            <div class="pagination-controls">
              <button
                  class="page-btn"
                  :disabled="currentPage === 1"
                  @click="handlePageChange(1)"
              >首页</button>
              <button
                  class="page-btn"
                  :disabled="currentPage === 1"
                  @click="handlePageChange(currentPage - 1)"
              >上一页</button>
              <button
                  class="page-btn"
                  :disabled="currentPage === totalPages || totalPages === 0"
                  @click="handlePageChange(currentPage + 1)"
              >下一页</button>
              <button
                  class="page-btn"
                  :disabled="currentPage === totalPages || totalPages === 0"
                  @click="handlePageChange(totalPages)"
              >末页</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 教师详情弹窗 -->
    <el-dialog
        v-model="showDetailDialog"
        :title="isEditing ? '编辑教师信息' : '教师详细信息'"
        width="600px"
    >
      <div
          v-if="currentTeacher"
          class="teacher-detail"
      >
        <div
            v-for="(field, index) in teacherFields"
            :key="index"
            class="detail-item"
        >
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
            <el-button
                type="primary"
                @click="saveTeacherInfo"
            >保存</el-button>
          </template>
          <template v-else>
            <el-button @click="showDetailDialog = false">关闭</el-button>
            <el-button
                type="warning"
                @click="showResetPasswordDialog"
            >重置密码</el-button>
            <el-button
                type="primary"
                @click="startEdit"
            >编辑</el-button>
          </template>
        </span>
      </template>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog
        v-model="showPasswordDialog"
        title="重置教师密码"
        width="400px"
    >
      <div class="password-form">
        <div class="form-item">
          <label>新密码：</label>
          <input
              v-model="newPassword"
              type="password"
              placeholder="请输入新密码"
              class="password-input"
          />
        </div>
        <div class="form-item">
          <label>确认密码：</label>
          <input
              v-model="confirmPassword"
              type="password"
              placeholder="请确认新密码"
              class="password-input"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePasswordDialog">取消</el-button>
          <el-button
              type="primary"
              @click="resetPassword"
          >确认重置</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog
        v-model="showDeleteDialog"
        title="确认删除"
        width="500px"
    >
      <div class="delete-confirm">
        <div class="warning-icon">⚠️</div>
        <div class="confirm-text">
          <p>您确定要删除以下 <strong>{{ selectedTeachers.length }}</strong> 个教师吗？</p>
          <p class="warning-text">此操作不可撤销，请谨慎操作！</p>
          <div class="teacher-list">
            <div
                v-for="teacherId in selectedTeachers.slice(0, 5)"
                :key="teacherId"
                class="teacher-item"
            >
              {{ getTeacherName(teacherId) }} ({{ teacherId }})
            </div>
            <div
                v-if="selectedTeachers.length > 5"
                class="more-text"
            >
              还有 {{ selectedTeachers.length - 5 }} 个教师...
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button
              type="danger"
              @click="confirmDelete"
          >确认删除</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 快速提示 -->
    <transition name="tip-fade">
      <div
          v-if="showQuickTip"
          class="quick-tip"
      >
        <div class="tip-content">
          <span class="tip-icon">💡</span>
          <span>{{ quickTipMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import SideBar from '@/components/layout/SideBar.vue'
import { getTeacherList, deleteTeachers, updateTeacherInfo, resetTeacherPassword, getTeacherDetail } from '@/api/admin/user_management'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')

const adminMenuItems = [
  { path: '/admin/log_management', label: '日志管理' },
  { path: '/admin/teacher_management', label: '教师管理' },
  { path: '/admin/student_management', label: '学生管理' },
  { path: '/admin/model_management', label: '模型管理' },
]

// 列表相关
const allTeachers = ref<any[]>([]) // 存储完整的教师列表
const filteredTeachers = ref<any[]>([]) // 存储过滤后的教师列表
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)

// 搜索表单
const searchForm = ref({
  name: '',
  staff_id: '',
  department: ''
})

let searchTimer: any = null

// 选择相关
const selectedTeachers = ref<string[]>([])

// 快速提示
const showQuickTip = ref(false)
const quickTipMessage = ref('')

// 教师详情
const showDetailDialog = ref(false)
const currentTeacher = ref<any>(null)

// 编辑
const isEditing = ref(false)
const editForm = ref<any>({})
const teacherFields = [
  { key: 'username', label: '姓名', type: 'text' },
  { key: 'staff_id', label: '工号', type: 'text' },
  { key: 'department', label: '院系', type: 'text' },
  { key: 'expertise', label: '专业领域', type: 'text' },
  { key: 'intro', label: '个人简介', type: 'textarea' },
  { key: 'contact_email', label: '联系邮箱', type: 'text', inputType: 'email' },
  { key: 'office_location', label: '办公地点', type: 'text' }
]

// 重置密码
const showPasswordDialog = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

// 批量操作
const showDeleteDialog = ref(false)

// 计算属性
const hasSearchConditions = computed(() => {
  return searchForm.value.name || searchForm.value.staff_id || searchForm.value.department
})

// 修改 teachers 计算属性，使用过滤后的数据进行分页
const teachers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTeachers.value.slice(start, end)
})

// 重新计算总页数，基于过滤后的数据
const totalPages = computed(() => Math.ceil(filteredTeachers.value.length / pageSize.value))

// 全选状态
const isAllSelected = computed(() => {
  return teachers.value.length > 0 && teachers.value.every(teacher =>
      selectedTeachers.value.includes(teacher.staff_id)
  )
})

const isIndeterminate = computed(() => {
  return selectedTeachers.value.length > 0 && selectedTeachers.value.length < teachers.value.length
})

// 前端搜索过滤函数
const applyLocalSearch = () => {
  if (!hasSearchConditions.value) {
    filteredTeachers.value = [...allTeachers.value]
  } else {
    filteredTeachers.value = allTeachers.value.filter(teacher => {
      const nameMatch = !searchForm.value.name ||
          teacher.username.toLowerCase().includes(searchForm.value.name.toLowerCase())

      const staffIdMatch = !searchForm.value.staff_id ||
          teacher.staff_id.toLowerCase().includes(searchForm.value.staff_id.toLowerCase())

      const departmentMatch = !searchForm.value.department ||
          teacher.department.toLowerCase().includes(searchForm.value.department.toLowerCase())

      return nameMatch && staffIdMatch && departmentMatch
    })
  }

  // 搜索后重置到第一页
  if (hasSearchConditions.value && currentPage.value > 1) {
    currentPage.value = 1
  }

  // 清空选择
  selectedTeachers.value = []
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
    staff_id: '',
    department: ''
  }
  applyLocalSearch()
}

// 修改分页处理函数
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 修改 loadTeachers 函数
const loadTeachers = async () => {
  try {
    loading.value = true

    // 获取所有教师数据用于前端搜索
    const response = await getTeacherList(1, 1000)

    // 存储完整的教师列表用于前端搜索
    allTeachers.value = response.teachers
    total.value = response.total

    // 应用前端搜索过滤
    applyLocalSearch()
  } catch (error: any) {
    console.error('加载教师列表失败:', error)
    showQuickTipMessage(error.message || '加载教师列表失败')
  } finally {
    loading.value = false
  }
}

// 切换全选
const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedTeachers.value = []
  } else {
    selectedTeachers.value = teachers.value.map(teacher => teacher.staff_id)
  }
}

// 选择单个教师
const toggleTeacherSelection = (teacherId: string) => {
  const idx = selectedTeachers.value.indexOf(teacherId)
  if (idx === -1) {
    selectedTeachers.value.push(teacherId)
  } else {
    selectedTeachers.value.splice(idx, 1)
  }
}

// 批量删除教师
const showDeleteConfirm = () => {
  if (selectedTeachers.value.length === 0) {
    showQuickTipMessage('请先选择要删除的教师')
    return
  }
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    const result = await deleteTeachers(selectedTeachers.value)
    if (result.success) {
      showQuickTipMessage(`成功删除 ${result.deleted} 个教师`)
      selectedTeachers.value = []
      showDeleteDialog.value = false
      await loadTeachers()
    }
  } catch (error: any) {
    showQuickTipMessage(error.message)
  }
}

// 查看教师详情
const showTeacherDetail = async (staff_id: string) => {
  try {
    currentTeacher.value = await getTeacherDetail(staff_id)
    showDetailDialog.value = true
  } catch (error) {
    showQuickTipMessage('获取教师详情失败')
  }
}

// 编辑相关函数
const startEdit = () => {
  editForm.value = { ...currentTeacher.value }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {}
}

const saveTeacherInfo = async () => {
  try {
    const data = {
      username: editForm.value.username,
      staff_id: editForm.value.staff_id,
      department: editForm.value.department,
      expertise: editForm.value.expertise,
      intro: editForm.value.intro,
      contact_email: editForm.value.contact_email,
      office_location: editForm.value.office_location
    }
    const result = await updateTeacherInfo(currentTeacher.value.staff_id, data)
    if (result.status === 'success') {
      showQuickTipMessage('更新成功')
      isEditing.value = false
      await loadTeachers()
      currentTeacher.value = { ...editForm.value }
    }
  } catch (error: any) {
    showQuickTipMessage(error.message)
  }
}

const formatFieldValue = (key: string) => {
  const value = currentTeacher.value?.[key]
  if (value === null || value === undefined) return '暂无'
  return value
}

// 重置密码相关函数
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
    const result = await resetTeacherPassword(currentTeacher.value.staff_id, newPassword.value)
    if (result.status === 'success') {
      showQuickTipMessage('密码重置成功')
      closePasswordDialog()
    }
  } catch (error: any) {
    showQuickTipMessage(error.message)
  }
}

// 其他函数
const goToCreateTeacher = () => {
  router.push('/admin/create_teacher')
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

const getTeacherName = (teacherId: string) => {
  const teacher = allTeachers.value.find(t => t.staff_id === teacherId)
  return teacher ? teacher.username : teacherId
}

// 初始化时应用搜索
onMounted(() => {
  loadTeachers()
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

/* 教师列表卡片样式 */
.teachers-table-card {
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


/* 搜索框样式 */
.search-box input {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 280px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
}

.teachers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.teachers-table th,
.teachers-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.teachers-table th {
  background: #f7fafc;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
}

.teachers-table tr:hover {
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

/* 分页控件样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #667eea;
  color: #667eea;
}

.page-info {
  color: #4a5568;
  font-size: 14px;
}

/* 导入按钮样式 */
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

/* 教师详情弹窗样式 */
.teacher-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
}

.detail-item {
  display: flex;
  gap: 12px;
}

.detail-item label {
  min-width: 80px;
  color: #4a5568;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-layout {
    margin-left: 0;
    width: 100vw;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
  }

  .search-box input {
    width: 100%;
  }

  .user-actions {
    margin-left: 0;
    margin-top: 16px;
  }
}

/* 加载和空数据状态样式 */
.loading-row,
.no-data {
  text-align: center;
  padding: 32px;
  color: #718096;
  font-style: italic;
}

/* 快速提示样式 */

.quick-tip {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #2d3748;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tip-icon {
  font-size: 16px;
}

/* 编辑输入框样式 */
.edit-input,
.edit-textarea {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 100%;
  font-size: 14px;
  margin-top: 4px;
}

.edit-textarea {
  min-height: 80px;
  resize: vertical;
}

/* 密码输入框样式 */
.password-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 100%;
  font-size: 14px;
  margin-top: 4px;
}

/* 批量操作样式 */
.batch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.selected-count {
  color: #2d3748;
  font-weight: 500;
}

.delete-btn {
  padding: 8px 16px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

/* 删除确认弹窗样式 */
.delete-confirm {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.warning-icon {
  font-size: 28px;
  color: #e53e3e;
  align-self: center;
}

.confirm-text {
  color: #4a5568;
  font-size: 14px;
}

.teacher-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.teacher-item {
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-text {
  color: #a0aec0;
  font-size: 12px;
  text-align: center;
}

/* 筛选区域样式 - 参考教师课程页面 */
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

/* 移动端适配 */
@media (max-width: 768px) {
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
}

/* 批量操作栏优化 */
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

/* 分页控件优化 */
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

@media (max-width: 768px) {
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