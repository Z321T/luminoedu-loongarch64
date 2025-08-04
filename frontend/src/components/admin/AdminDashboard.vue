<!-- filepath: src/components/admin/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-container">
        <div class="logo-section">
          <h1>🎓 管理员控制台</h1>
        </div>
        <div class="user-section">
          <div class="user-info">
            <div class="user-avatar">{{ username.charAt(0) }}</div>
            <span class="username">{{ username }}</span>
          </div>
          <button
            @click="logout"
            class="logout-btn"
          >退出登录</button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="dashboard-main">
      <div class="dashboard-content">
        <!-- 统计卡片区域 -->
        <section class="stats-section">
          <div class="stat-card teacher-card">
            <div class="stat-icon">👨‍🏫</div>
            <div class="stat-content">
              <div class="stat-number">{{ data.teachers.length }}</div>
              <div class="stat-label">教师总数</div>
            </div>
          </div>
          <div class="stat-card student-card">
            <div class="stat-icon">👨‍🎓</div>
            <div class="stat-content">
              <div class="stat-number">{{ data.students.length }}</div>
              <div class="stat-label">学生总数</div>
            </div>
          </div>
        </section>

        <!-- 导航按钮区域 -->
        <nav class="nav-section">
          <div class="nav-grid">
            <button
              @click="currentView = 'CreateTeacher'"
              :class="{ active: currentView === 'CreateTeacher' }"
              class="nav-card"
            >
              <div class="nav-icon">➕</div>
              <div class="nav-content">
                <h3>创建教师</h3>
                <p>添加新的教师账户</p>
              </div>
            </button>

            <button
              @click="currentView = 'CreateStudent'"
              :class="{ active: currentView === 'CreateStudent' }"
              class="nav-card"
            >
              <div class="nav-icon">👤</div>
              <div class="nav-content">
                <h3>创建学生</h3>
                <p>添加新的学生账户</p>
              </div>
            </button>

            <button
              @click="currentView = 'ListTeachers'"
              :class="{ active: currentView === 'ListTeachers' }"
              class="nav-card"
            >
              <div class="nav-icon">📋</div>
              <div class="nav-content">
                <h3>教师列表</h3>
                <p>管理所有教师信息</p>
              </div>
            </button>

            <button
              @click="currentView = 'ListStudents'"
              :class="{ active: currentView === 'ListStudents' }"
              class="nav-card"
            >
              <div class="nav-icon">📝</div>
              <div class="nav-content">
                <h3>学生列表</h3>
                <p>管理所有学生信息</p>
              </div>
            </button>
          </div>
        </nav>

        <!-- 内容展示区域 -->
        <main class="content-area">
          <div class="content-header">
            <h2>{{ getViewTitle() }}</h2>
          </div>
          <div class="content-body">
            <component
              :is="currentView"
              @updateData="updateData"
              @deleteItem="deleteItem"
              :data="data"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import CreateTeacher from './CreateTeacher.vue';
import CreateStudent from './CreateStudent.vue';
import ListTeachers from './ListTeachers.vue';
import ListStudents from './ListStudents.vue';

export default {
  components: {
    CreateTeacher,
    CreateStudent,
    ListTeachers,
    ListStudents,
  },
  data () {
    return {
      currentView: 'CreateTeacher',
      username: localStorage.getItem('username') || '管理员',
      data: {
        teachers: JSON.parse(localStorage.getItem('teachers')) || [],
        students: JSON.parse(localStorage.getItem('students')) || [],
      },
    };
  },
  methods: {
    updateData (type, item) {
      this.data[type].push(item);
      localStorage.setItem(type, JSON.stringify(this.data[type]));
    },

    deleteItem (type, index) {
      this.data[type].splice(index, 1);
      localStorage.setItem(type, JSON.stringify(this.data[type]));
    },

    getViewTitle () {
      const titles = {
        CreateTeacher: '创建教师',
        CreateStudent: '创建学生',
        ListTeachers: '教师列表',
        ListStudents: '学生列表'
      };
      return titles[this.currentView] || '管理面板';
    },

    logout () {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        this.$router.push('/admin_login');
      }
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 顶部头部 */
.top-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section h1 {
  color: white;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 1px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.username {
  color: white;
  font-weight: 500;
  font-size: 16px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 主要内容区域 */
.dashboard-main {
  flex: 1;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.dashboard-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 统计卡片 */
.stats-section {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 200px;
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 40px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-card .stat-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.student-card .stat-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 16px;
  color: #7f8c8d;
  font-weight: 500;
}

/* 导航区域 */
.nav-section {
  display: flex;
  justify-content: center;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.nav-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.nav-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.nav-card.active {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.3);
  border: 2px solid #667eea;
}

.nav-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-card.active .nav-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.nav-content h3 {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.nav-content p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.nav-card.active .nav-content h3 {
  color: #667eea;
}

/* 内容区域 */
.content-area {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 25px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.content-header h2 {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.content-body {
  padding: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .dashboard-main {
    padding: 20px 10px;
  }

  .stats-section {
    flex-direction: column;
    align-items: center;
  }

  .nav-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .nav-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .content-body {
    padding: 20px;
  }

  .logo-section h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    min-width: auto;
    width: 100%;
    max-width: 280px;
  }

  .nav-card {
    padding: 20px;
  }

  .dashboard-main {
    padding: 15px 5px;
  }
}
</style>