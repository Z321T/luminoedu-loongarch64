<!-- filepath: d:\git\LuminoEdu\frontend\frontend\src\components\common\ErrorMessage.vue -->
<template>
  <div class="error-container">
    <div class="error-card">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h3>出现错误</h3>
        <p>{{ message }}</p>
        <div class="error-actions">
          <button
            v-if="showRetry"
            class="retry-btn"
            @click="handleRetry"
          >
            🔄 重试
          </button>
          <button
            v-if="showContact"
            class="contact-btn"
            @click="handleContact"
          >
            📞 联系支持
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  showRetry?: boolean
  showContact?: boolean
}

withDefaults(defineProps<Props>(), {
  showRetry: true,
  showContact: false,
})

const emit = defineEmits<{
  retry: []
  contact: []
}>()

const handleRetry = () => {
  emit('retry')
}

const handleContact = () => {
  emit('contact')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.error-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #fee;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-content h3 {
  color: #dc3545;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.error-content p {
  color: #666;
  margin: 0 0 25px 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.retry-btn,
.contact-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.retry-btn {
  background: #007bff;
  color: white;
}

.retry-btn:hover {
  background: #0056b3;
}

.contact-btn {
  background: #6c757d;
  color: white;
}

.contact-btn:hover {
  background: #545b62;
}

@media (max-width: 480px) {
  .error-card {
    padding: 30px 20px;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>