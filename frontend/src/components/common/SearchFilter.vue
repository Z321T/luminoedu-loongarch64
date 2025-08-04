<!-- filepath: d:\git\LuminoEdu\frontend\frontend\src\components\common\SearchFilter.vue -->
<template>
  <div class="search-section">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="search-input"
        @keyup.enter="handleSearch"
      >
      <button
        class="search-btn"
        @click="handleSearch"
      >
        🔍 搜索
      </button>
    </div>

    <div class="filter-bar">
      <slot name="filters">
        <!-- 自定义筛选器插槽 -->
      </slot>

      <button
        class="reset-btn"
        @click="handleReset"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: '请输入搜索关键词...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  reset: []
}>()

const searchQuery = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (newVal) => {
    searchQuery.value = newVal || ''
  }
)

watch(searchQuery, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleReset = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('reset')
}
</script>

<style scoped>
.search-section {
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e1e8ed;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #0056b3;
}

.filter-bar {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.reset-btn {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .search-bar,
  .filter-bar {
    flex-direction: column;
    gap: 10px;
  }
}
</style>