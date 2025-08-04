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
      <PageHeader title="PPT大纲管理">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="logout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <!-- 内容区域 -->
      <section class="content">
        <div class="outline-manage">
          <div class="table-container">
            <div class="dashboard-header">
              <button @click="goToGenerate" class="create-btn">
                <span class="plus-icon">+</span>
                前往生成
              </button>
            </div>
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-state">
              正在加载大纲列表...
            </div>

            <!-- 空状态 -->
            <div v-else-if="outlinesList.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h3>暂无大纲文件</h3>
              <p>您还没有生成任何PPT大纲，请先前往“PPT生成”页面创建。</p>
              <button @click="goToGenerate" class="create-btn">立即前往</button>
            </div>

            <!-- 表格 -->
            <table v-else class="outline-table">
              <thead>
              <tr>
                <th>标题</th>
                <th>文件名</th>
                <th>预览</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="outline in outlinesList" :key="outline.id">
                <td>{{ outline.title }}</td>
                <td>{{ outline.filename }}</td>
                <td class="preview-cell">{{ outline.preview }}</td>
                <td>{{ formatDate(outline.created_at) }}</td>
                <td class="actions">
                  <button @click="downloadOutline(outline.filename)" class="btn download-btn">下载</button>
                  <button @click="confirmDelete(outline.filename)" class="btn delete-btn">删除</button>
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
import { getAllPPTOutlines, deletePPTOutlineFile, downloadPPTOutlineFile } from '@/api/teacher/PPT_generate'
import PageHeader from '@/components/layout/PageHeader.vue'
import SideBar from '@/components/layout/SideBar.vue'

const router = useRouter()
const isLoading = ref(true)
const outlinesList = ref<any[]>([])
const username = ref(localStorage.getItem('username') || '教师用户')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

const formatDate = (dateString: string): string => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleString()
}

const loadOutlines = async () => {
  isLoading.value = true
  try {
    const response = await getAllPPTOutlines()
    outlinesList.value = response.outlines
  } catch (error) {
    console.error('获取大纲列表失败:', error)
    alert('获取大纲列表失败')
  } finally {
    isLoading.value = false
  }
}

const downloadOutline = async (filename: string) => {
  try {
    await downloadPPTOutlineFile(filename)
    alert('大纲文件下载已开始')
  } catch (error: any) {
    alert(error.message || '下载失败')
  }
}

const confirmDelete = async (filename: string) => {
  if (confirm('确定要删除这个大纲文件吗？此操作不可恢复！')) {
    try {
      await deletePPTOutlineFile(filename)
      outlinesList.value = outlinesList.value.filter((item) => item.filename !== filename)
      alert('删除成功')
    } catch (error: any) {
      alert(error.message || '删除失败，请稍后重试')
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

onMounted(loadOutlines)
</script>

<style scoped>
.teacher-layout { display: flex; height: 100vh; width: 100vw; background: #f5f6fa; }
.main { position: relative; flex: 1; margin-left: 240px; display: flex; flex-direction: column; overflow: hidden; }
.header-user { position: absolute; top: 24px; right: 48px; display: flex; align-items: center; gap: 16px; z-index: 10; }
.logout-btn { background: #e74c3c; color: #fff; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; transition: background 0.3s; font-weight: 500; }
.logout-btn:hover { background: #c0392b; }
.content { flex: 1; padding: 32px; overflow-y: auto; }
.outline-manage { background: #fff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.table-container { overflow: auto; }
.outline-table { width: 100%; border-collapse: collapse; text-align: left; }
.outline-table th, .outline-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; }
.outline-table th { background: #f8fafc; font-weight: 600; color: #4a5568; }
.outline-table tr:hover { background: #f8fafc; }
.preview-cell { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #718096; }
.actions { display: flex; gap: 12px; }
.btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s; font-weight: 500; }
.delete-btn { background: #fff5f5; color: #e53e3e; }
.delete-btn:hover { background: #fed7d7; }
.loading-state, .empty-state { padding: 60px 20px; text-align: center; color: #718096; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state h3 { color: #2d3748; margin: 0 0 8px; }
.empty-state p { margin: 0 0 24px; }
.create-btn { background: #3182ce; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.create-btn:hover { background: #2c5aa0; }
.plus-icon { font-size: 16px; font-weight: bold; }

.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
</style>