<!-- filepath: src/components/admin/ListTeachers.vue -->
<template>
  <div class="list-teachers">
    <div class="page-header">
      <div class="header-left">
        <h2>教师管理</h2>
        <p>共有 {{ data.teachers.length }} 位教师</p>
      </div>
      <div class="header-actions">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索教师姓名或科目..."
          class="search-input"
        />
      </div>
    </div>

    <div
      class="teachers-grid"
      v-if="filteredTeachers.length > 0"
    >
      <div
        v-for="(teacher, index) in filteredTeachers"
        :key="index"
        class="teacher-card"
      >
        <div class="teacher-avatar">
          {{ teacher.name.charAt(0) }}
        </div>
        <div class="teacher-info">
          <h3 class="teacher-name">{{ teacher.name }}</h3>
          <p class="teacher-subject">{{ teacher.subject }}</p>
          <div class="teacher-details">
            <div
              class="detail-item"
              v-if="teacher.email"
            >
              <span class="detail-icon">📧</span>
              <span>{{ teacher.email }}</span>
            </div>
            <div
              class="detail-item"
              v-if="teacher.phone"
            >
              <span class="detail-icon">📞</span>
              <span>{{ teacher.phone }}</span>
            </div>
            <div
              class="detail-item"
              v-if="teacher.createdAt"
            >
              <span class="detail-icon">📅</span>
              <span>创建时间: {{ teacher.createdAt }}</span>
            </div>
          </div>
        </div>
        <div class="teacher-actions">
          <button
            @click="editTeacher(index)"
            class="btn-edit"
          >
            编辑
          </button>
          <button
            @click="deleteTeacher(index)"
            class="btn-delete"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="empty-state"
    >
      <div class="empty-icon">👨‍🏫</div>
      <h3>{{ searchQuery ? '未找到匹配的教师' : '暂无教师数据' }}</h3>
      <p>{{ searchQuery ? '请尝试其他搜索关键词' : '点击"创建教师"添加新的教师' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data () {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredTeachers () {
      if (!this.searchQuery) {
        return this.data.teachers;
      }
      return this.data.teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    editTeacher (index) {
      console.log('编辑教师:', this.filteredTeachers[index]);
      alert('编辑功能开发中...');
    },

    deleteTeacher (index) {
      if (confirm(`确定要删除教师 ${this.filteredTeachers[index].name} 吗？`)) {
        const originalIndex = this.data.teachers.findIndex(teacher =>
          teacher === this.filteredTeachers[index]
        );
        this.$emit('deleteItem', 'teachers', originalIndex);
      }
    }
  }
};
</script>

<style scoped>
.list-teachers {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 200px);
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.header-left h2 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 5px;
}

.header-left p {
  color: #7f8c8d;
  margin: 0;
  font-size: 16px;
}

.search-input {
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 16px;
  width: 300px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.teachers-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 20px;
}

.teacher-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
  height: fit-content;
}

.teacher-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.teacher-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.teacher-name {
  color: #2c3e50;
  font-size: 20px;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.teacher-subject {
  color: #3498db;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 15px 0;
}

.teacher-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #7f8c8d;
}

.detail-icon {
  font-size: 16px;
}

.teacher-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-edit {
  background: #f39c12;
  color: white;
}

.btn-edit:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
  font-size: 16px;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .search-input {
    width: 100%;
  }

  .teachers-grid {
    grid-template-columns: 1fr;
  }

  .teacher-actions {
    flex-direction: column;
  }
}
</style>
