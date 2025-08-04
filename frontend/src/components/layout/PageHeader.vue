<!-- filepath: d:\git\LuminoEdu\frontend\frontend\src\components\layout\PageHeader.vue -->
<template>
  <header class="header">
    <div class="header-left">
      <button
        v-if="showMobileMenu"
        class="mobile-menu-btn"
        @click="toggleMobileMenu"
      >
        ☰
      </button>
      <h1>{{ title }}</h1>
    </div>

    <div class="header-actions">
      <slot name="actions">
        <!-- 默认操作按钮 -->
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  showMobileMenu?: boolean
}

withDefaults(defineProps<Props>(), {
  showMobileMenu: false,
})

const emit = defineEmits<{
  toggleMobileMenu: []
}>()

const toggleMobileMenu = () => {
  emit('toggleMobileMenu')
}
</script>

<style scoped>
.header {
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e1e8ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .header {
    padding: 15px 20px;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>