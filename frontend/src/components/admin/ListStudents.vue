<!-- filepath: src/components/admin/ListStudents.vue -->
<template>
  <div class="list-students">
    <div class="page-header">
      <div class="header-left">
        <h2>学生管理</h2>
        <p>共有 {{ data.students.length }} 位学生</p>
      </div>
      <div class="header-actions">
        <select
          v-model="gradeFilter"
          class="filter-select"
        >
          <option value="">全部年级</option>
          <option
            v-for="grade in uniqueGrades"
            :key="grade"
            :value="grade"
          >
            {{ grade }}
          </option>
        </select>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索学生姓名或学号..."
          class="search-input"
        />
      </div>
    </div>

    <div
      class="students-grid"
      v-if="filteredStudents.length > 0"
    >
      <div
        v-for="(student, index) in filteredStudents"
        :key="index"
        class="student-card"
      >
        <div class="student-avatar">
          {{ student.name.charAt(0) }}
        </div>
        <div class="student-info">
          <h3 class="student-name">{{ student.name }}</h3>
          <p class="student-grade">{{ student.grade }} {{ student.className }}
          </p>
          <div class="student-details">
            <div
              class="detail-item"
              v-if="student.studentId"
            >
              <span class="detail-icon">🎓</span>
              <span>学号: {{ student.studentId }}</span>
            </div>
            <div
              class="detail-item"
              v-if="student.email"
            >
              <span class="detail-icon">📧</span>
              <span>{{ student.email }}</span>
            </div>
            <div
              class="detail-item"
              v-if="student.parentPhone"
            >
              <span class="detail-icon">📞</span>
              <span>家长: {{ student.parentPhone }}</span>
            </div>
            <div
              class="detail-item"
              v-if="student.createdAt"
            >
              <span class="detail-icon">📅</span>
              <span>创建时间: {{ student.createdAt }}</span>
            </div>
          </div>
        </div>
        <div class="student-actions">
          <button
            @click="editStudent(index)"
            class="btn-edit"
          >
            编辑
          </button>
          <button
            @click="deleteStudent(index)"
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
      <div class="empty-icon">👨‍🎓</div>
      <h3>{{ searchQuery || gradeFilter ? '未找到匹配的学生' : '暂无学生数据' }}</h3>
      <p>{{ searchQuery || gradeFilter ? '请尝试其他搜索条件' : '点击"创建学生"添加新的学生' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data () {
    return {
      searchQuery: '',
      gradeFilter: ''
    }
  },
  computed: {
    uniqueGrades () {
      const grades = this.data.students.map(student => student.grade);
      return [...new Set(grades)].sort();
    },

    filteredStudents () {
      let filtered = this.data.students;

      if (this.gradeFilter) {
        filtered = filtered.filter(student => student.grade === this.gradeFilter);
      }

      if (this.searchQuery) {
        filtered = filtered.filter(student =>
          student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (student.studentId && student.studentId.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      }

      return filtered;
    }
  },
  methods: {
    editStudent (index) {
      console.log('编辑学生:', this.filteredStudents[index]);
      alert('编辑功能开发中...');
    },

    deleteStudent (index) {
      if (confirm(`确定要删除学生 ${this.filteredStudents[index].name} 吗？`)) {
        const originalIndex = this.data.students.findIndex(student =>
          student === this.filteredStudents[index]
        );
        this.$emit('deleteItem', 'students', originalIndex);
      }
    }
  }
};
</script>

<style scoped>
.list-students {
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

.header-actions {
  display: flex;
  gap: 15px;
}

.filter-select,
.search-input {
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.filter-select {
  width: 150px;
}

.search-input {
  width: 300px;
}

.filter-select:focus,
.search-input:focus {
  outline: none;
  border-color: #e67e22;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
}

.students-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 20px;
}

.student-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #e67e22;
  height: fit-content;
}

.student-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.student-name {
  color: #2c3e50;
  font-size: 20px;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.student-grade {
  color: #e67e22;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 15px 0;
}

.student-details {
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

.student-actions {
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

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .filter-select,
  .search-input {
    width: 100%;
  }

  .students-grid {
    grid-template-columns: 1fr;
  }

  .student-actions {
    flex-direction: column;
  }
}
</style>