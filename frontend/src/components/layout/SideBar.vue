<!-- filepath: d:\git\LuminoEdu\frontend\frontend\src\components\layout\Sidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="logo">🎓 LuminoEdu</div>
    <ul class="menu">
      <li
        v-for="item in menuItems"
        :key="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
        @click="handleMenuClick(item)"
        :data-path="item.path"
      >
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  path: string
  label: string
}

const props = withDefaults(
  defineProps<{
    menuItems: MenuItem[]
    activeItem?: string // 新增：当前激活的菜单项
  }>(),
  {
    menuItems: () => [
      { path: '/home_teacher', label: '首页' },
      { path: '/exercise_generate', label: '习题生成' },
      { path: '/exercise_history', label: '历史记录' },
      { path: '/student_management', label: '学生管理' },
      { path: '/settings', label: '设置' },
    ],
    activeItem: '',
  }
)

const emit = defineEmits<{
  menuClick: [item: MenuItem]
}>()

const router = useRouter()
const route = useRoute()

const handleMenuClick = (item: MenuItem) => {
  // 如果是路由路径，则导航
  if (item.path.startsWith('/')) {
    navigateTo(item.path)
  } else {
    // 否则发射事件给父组件处理
    emit('menuClick', item)
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => {
  // 如果有activeItem prop，则使用它来判断激活状态
  if (props.activeItem) {
    return props.activeItem === path
  }
  // 否则使用路由来判断
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
}

.logo {
  padding: 25px 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.menu {
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  user-select: none;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: rgba(255, 255, 255, 0.5);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
  border-left-color: #fff;
}

.menu-item .icon {
  margin-right: 15px;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>