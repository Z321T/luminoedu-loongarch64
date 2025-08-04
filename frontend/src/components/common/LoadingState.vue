<!-- filepath: d:\git\LuminoEdu\frontend\frontend\src\components\common\LoadingState.vue -->
<template>
  <div
    class="loading-state"
    :class="type"
  >
    <div class="loading-content">
      <div
        v-if="type === 'spinner'"
        class="spinner"
      >
        <div class="spinner-circle"></div>
      </div>

      <div
        v-else-if="type === 'dots'"
        class="dots"
      >
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>

      <div
        v-else-if="type === 'pulse'"
        class="pulse"
      >
        <div class="pulse-circle"></div>
      </div>

      <div
        v-else
        class="default-loader"
      >
        <div class="loader-bar"></div>
      </div>

      <p
        v-if="message"
        class="loading-message"
      >{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'spinner' | 'dots' | 'pulse' | 'bar'
  message?: string
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  type: 'spinner',
  message: '加载中...',
  size: 'medium',
})
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 200px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-message {
  margin: 0;
  color: #666;
  font-size: 14px;
  text-align: center;
}

/* Spinner 样式 */
.spinner {
  width: 40px;
  height: 40px;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dots 样式 */
.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}
.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Pulse 样式 */
.pulse {
  width: 40px;
  height: 40px;
}

.pulse-circle {
  width: 100%;
  height: 100%;
  background: #3498db;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Bar 样式 */
.default-loader {
  width: 60px;
  height: 4px;
  background: #f3f3f3;
  border-radius: 2px;
  overflow: hidden;
}

.loader-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 2px;
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 尺寸变体 */
.loading-state.small .spinner,
.loading-state.small .pulse {
  width: 24px;
  height: 24px;
}

.loading-state.small .dots .dot {
  width: 6px;
  height: 6px;
}

.loading-state.small .default-loader {
  width: 40px;
  height: 3px;
}

.loading-state.large .spinner,
.loading-state.large .pulse {
  width: 60px;
  height: 60px;
}

.loading-state.large .dots .dot {
  width: 12px;
  height: 12px;
}

.loading-state.large .default-loader {
  width: 80px;
  height: 6px;
}

.loading-state.large .loading-message {
  font-size: 16px;
}
</style>