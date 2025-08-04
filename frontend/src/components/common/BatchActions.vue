<!-- filepath: d:\git\LuminoEdu\frontend\frontend\src\components\common\BatchActions.vue -->
<template>
  <div
    v-if="selectedCount > 0"
    class="batch-actions"
  >
    <span class="selected-count">已选择 {{ selectedCount }} 项</span>

    <div class="action-buttons">
      <slot
        name="actions"
        :selectedCount="selectedCount"
      >
        <!-- 默认批量操作按钮 -->
      </slot>

      <button
        class="btn btn-secondary"
        @click="handleClear"
      >
        取消选择
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  clear: []
}>()

const handleClear = () => {
  emit('clear')
}
</script>

<style scoped>
.batch-actions {
  background: #fff3cd;
  padding: 15px 30px;
  border-bottom: 1px solid #ffeaa7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.selected-count {
  font-weight: 500;
  color: #856404;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .batch-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>