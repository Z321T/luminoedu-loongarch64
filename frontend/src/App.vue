<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition
        name="fade-page"
        mode="out-in"
      >
        <component
            :is="Component"
            key="getRouteKey(route)"
        />
      </transition>
    </router-view>
  </div>
</template>
  
<script setup lang="ts" >
import { RouterView } from 'vue-router'


</script>

<style>
/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>

<style scoped>

/* 页面切换动画 */

</style>