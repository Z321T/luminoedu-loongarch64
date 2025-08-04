<template>
  <div class="teacher-layout">
    <!-- 侧边栏 -->
    <SideBar
        :menuItems="teacherMenuItems"
        :activeItem="'/teacher/ppt/generate'"
        @menuClick="handleMenuClick"
    />

    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 页面头部 -->
      <PageHeader title="PPT文件管理">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="logout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <!-- 内容区域 -->
      <section class="content">
        <div class="files-manage">
          <div class="dashboard-header">
            <button @click="goToGenerate" class="create-btn">
              <span class="plus-icon">+</span>
              前往生成
            </button>
          </div>

          <div v-if="isLoading" class="loading-state">
            <p>正在加载文件列表...</p>
          </div>
          <div v-else-if="!filesList || filesList.length === 0" class="empty-state">
            <div class="empty-icon">📁</div>
            <h3>没有找到PPT文件</h3>
            <p>您还没有生成任何PPT文件，请先前往生成页面创建。</p>
            <button @click="goToGenerate" class="create-btn">立即前往</button>
          </div>
          <div v-else class="table-container">
            <table class="files-table">
              <thead>
              <tr>
                <th>文件名</th>
                <th>文件大小</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="file in filesList" :key="file.file_name">
                <td>{{ file.file_name }}</td>
                <td>{{ formatSize(file.size) }}</td>
                <td>{{ formatDate(file.created_at) }}</td>
                <td class="actions">
                  <button @click="downloadFile(file.file_name)" class="btn download-btn">下载</button>
                  <button @click="confirmDelete(file.file_name)" class="btn delete-btn">删除</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPPTFileList, deletePPTFile, downloadPPTXfile} from '@/api/teacher/PPT_generate'
import PageHeader from '@/components/layout/PageHeader.vue'
import SideBar from '@/components/layout/SideBar.vue'

const router = useRouter()
const isLoading = ref(true)
const filesList = ref<any[]>([])
const username = ref(localStorage.getItem('username') || '教师用户')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

// 修改为处理数字时间戳的函数
const formatDate = (timestamp: number): string => {
  if (!timestamp) return '未知日期'
  // 从秒级时间戳创建日期
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

// 添加文件大小格式化函数
const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const loadFiles = async () => {
  isLoading.value = true
  try {
    const response = await getPPTFileList()
    // API返回的是一个包含files数组的对象
    filesList.value = response.files || []
  } catch (error) {
    console.error('加载PPT文件列表失败:', error)
    filesList.value = [] // 出错时确保列表为空
    alert('加载PPT文件列表失败')
  } finally {
    isLoading.value = false
  }
}

const downloadFile = async (filename: string) => {
  try {
    // downloadPPTX 只需要文件名作为参数来下载
    await downloadPPTXfile(filename)
    alert('文件下载已开始')
  } catch (error: any) {
    alert(error.message || '下载失败')
  }
}

const confirmDelete = async (filename: string) => {
  if (confirm('确定要删除这个PPT文件吗？此操作不可恢复！')) {
    try {
      await deletePPTFile(filename)
      alert('文件删除成功')
      await loadFiles() // 重新加载列表
    } catch (error: any) {
      alert(error.message || '删除失败')
    }
  }
}

const handleMenuClick = (item: any) => {
  router.push(item.path)
}

const goToGenerate = () => {
  router.push('/teacher/ppt/generate')
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    router.push('/login')
  }
}

onMounted(loadFiles)
</script>

<style scoped>
.teacher-layout { display: flex; height: 100vh; width: 100vw; background: #f5f6fa; }
.main { position: relative; flex: 1; margin-left: 240px; display: flex; flex-direction: column; overflow: hidden; }
.header-user { position: absolute; top: 24px; right: 48px; display: flex; align-items: center; gap: 16px; z-index: 10; }
.logout-btn { background: #e74c3c; color: #fff; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; transition: background 0.3s; font-weight: 500; }
.logout-btn:hover { background: #c0392b; }
.content { flex: 1; padding: 32px; overflow-y: auto; }
.files-manage { background: #fff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.dashboard-header h1 { margin: 0; color: #2d3748; font-size: 24px; }
.create-btn { background: #3182ce; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.create-btn:hover { background: #2c5aa0; }
.plus-icon { font-size: 16px; font-weight: bold; }
.table-container { overflow-x: auto; }
.files-table { width: 100%; border-collapse: collapse; text-align: left; }
.files-table th, .files-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
.files-table th { background: #f8fafc; font-weight: 600; color: #4a5568; }
.files-table tr:hover { background: #f8fafc; }
.actions { display: flex; gap: 12px; }
.btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s; font-weight: 500; }
.download-btn { background: #ebf8ff; color: #3182ce; }
.download-btn:hover { background: #bee3f8; }
.delete-btn { background: #fff5f5; color: #e53e3e; }
.delete-btn:hover { background: #fed7d7; }
.loading-state, .empty-state { padding: 60px 20px; text-align: center; color: #718096; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state h3 { color: #2d3748; margin: 0 0 8px; }
.empty-state p { margin: 0 0 24px; }
</style>