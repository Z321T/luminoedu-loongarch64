<template>
  <div class="teacher-layout">
    <!-- 侧边栏 -->
    <Sidebar :menuItems="teacherMenuItems" />

    <!-- 主体内容 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="习题生成">
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
        <div class="exercise-dashboard">
          <h1>智能习题生成</h1>

          <!-- 功能介绍 -->
          <div class="intro-section">
            <div class="intro-card">
              <h2>教师智能习题生成系统</h2>
              <p>本系统可以帮助您：</p>
              <ul>
                <li>基于教学文档和课程内容智能生成习题</li>
                <li>高效管理和整理教学资料</li>
                <li>自定义不同难度和类型的习题</li>
                <li>为学生创建个性化的练习集</li>
                <li>导出和管理习题资源库</li>
              </ul>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="quick-actions">
            <h2>快速开始</h2>
            <div class="action-grid">
              <div class="action-card">
                <div class="action-icon">📁</div>
                <h3>文档管理</h3>
                <p>上传和管理教学文档，为习题生成提供素材</p>
                <button
                    class="action-btn primary"
                    @click="goToDocumentManagement"
                >
                  进入文档管理
                </button>
              </div>

              <div class="action-card" @click="navigateToGenerate">
                <div class="action-icon">✏️</div>
                <h3>习题生成</h3>
                <p>基于已上传的文档内容生成智能习题</p>
                <button class="action-btn primary" @click.stop="navigateToGenerate">
                  进入习题生成
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/layout/SideBar.vue'
import PageHeader from '@/components/layout/PageHeader.vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '教师')

const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
]

// 跳转到文档管理
const goToDocumentManagement = () => {
  router.push('/teacher/exercise_generate/document')
}

// 导航到习题生成页面
const navigateToGenerate = () => {
  router.push('/teacher/exercise_generate/generate')
}

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}
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

.exercise-dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.exercise-dashboard h1 {
  margin: 0 0 32px 0;
  color: #2d3748;
  font-size: 28px;
}

.intro-section {
  margin-bottom: 40px;
}

.intro-card {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.intro-card h2 {
  margin: 0 0 16px 0;
  color: #2d3748;
  font-size: 20px;
}

.intro-card p {
  margin: 0 0 12px 0;
  color: #4a5568;
  line-height: 1.6;
}

.intro-card ul {
  margin: 0;
  padding-left: 20px;
  color: #4a5568;
}

.intro-card li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 20px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.action-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-align: center;
  transition: all 0.3s ease;
}

.action-card:not(.disabled):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.action-card.disabled {
  opacity: 0.6;
}

.action-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.action-card h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 18px;
}

.action-card p {
  margin: 0 0 20px 0;
  color: #718096;
  line-height: 1.5;
  font-size: 14px;
}

.action-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  font-size: 14px;
}

.action-btn.primary:hover {
  background: #2c5aa0;
}

.action-btn.disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #a0aec0;
}

@media (max-width: 900px) {
  .main {
    margin-left: 60px;
  }

  .content {
    padding: 16px;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>