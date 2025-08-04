<template>
  <div class="teacher-layout">
    <!-- 侧边栏 -->
    <SideBar
      :menuItems="teacherMenuItems"
      :activeItem="'/teacher/ppt/generate'"
      :class="{ 'mobile-open': mobileMenuOpen }"
      @menuClick="handleMenuClick"
    />

    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 顶部栏 -->
      <PageHeader title="教学PPT生成助手">
        <template #actions>
          <div class="header-user">
            <span>欢迎，{{ username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
      </PageHeader>

      <!-- 内容区域 -->
      <main class="content-area">
        <div class="ppt-generate">
          <!-- 副标题和导航按钮区域 -->
          <div class="subtitle-container">
            <!-- 副标题 -->
            <p class="subtitle">根据教学内容自动生成PPT大纲，提高备课效率</p>

            <!-- 导航按钮 -->
            <div class="nav-buttons">
              <router-link
                to="/teacher/ppt/files"
                class="outline-nav-btn"
              >
                <i class="icon-list"></i> 查看我的PPT文件
              </router-link>
              <router-link
                to="/teacher/ppt/outline"
                class="outline-nav-btn"
              >
                <i class="icon-list"></i> 查看我的大纲
              </router-link>
            </div>
          </div>

          <!-- 错误提示 -->
          <div
            v-if="errorMessage"
            class="error-message"
          >
            <i class="icon-error"></i>
            <span>{{ errorMessage }}</span>
            <button
              @click="clearError"
              class="close-btn"
            >&times;</button>
          </div>

          <!-- 成功提示 -->
          <div
            v-if="showSuccess"
            class="success-message"
          >
            <i class="icon-success"></i>
            <span>{{ successMessage }}</span>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-content">
            <!-- 表单区域 -->
            <div
              class="form-card"
              :class="{ 'loading': isLoading }"
            >
              <div class="card-header">
                <div class="header-content">
                  <h2 class="card-title">
                    PPT大纲
                  </h2>
                  <p class="card-description">
                    填写详细的信息将帮助生成更有针对性的PPT大纲（md格式）
                  </p>
                </div>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label for="title">PPT标题 <span
                      class="required">*</span></label>
                  <input
                    type="text"
                    id="title"
                    v-model="formData.title"
                    class="form-control"
                    placeholder="请输入PPT标题，不超过30个字符"
                    maxlength="30"
                    :disabled="isLoading"
                  />
                  <small class="form-hint">清晰简洁的标题将帮助生成更精准的内容</small>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="subject">学科 <span
                        class="required">*</span></label>
                    <input
                      type="text"
                      id="subject"
                      v-model="formData.subject"
                      class="form-control"
                      placeholder="请输入学科名称，如数学、语文等"
                      maxlength="30"
                      :disabled="isLoading"
                    />
                  </div>

                  <div class="form-group">
                    <label for="target_grade">目标年级 <span
                        class="required">*</span></label>
                    <input
                      type="text"
                      id="target_grade"
                      v-model="formData.target_grade"
                      class="form-control"
                      placeholder="如：初一、高二等"
                      :disabled="isLoading"
                    />
                  </div>

                  <div class="form-group">
                    <label for="slide_count">幻灯片数量 <span
                        class="required">*</span></label>
                    <div class="slide-count-container">
                      <input
                        type="range"
                        id="slide_count"
                        v-model.number="formData.slide_count"
                        min="5"
                        max="20"
                        step="1"
                        class="range-slider"
                        :disabled="isLoading"
                      />
                      <span class="slide-count-value">{{ formData.slide_count }}
                        张</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="teaching_target">教学目标 <span
                      class="required">*</span></label>
                  <textarea
                    id="teaching_target"
                    v-model="formData.teaching_target"
                    class="form-control textarea"
                    placeholder="描述这节课的教学目标，不超过100个字符"
                    rows="3"
                    maxlength="100"
                    :disabled="isLoading"
                  ></textarea>
                  <small class="form-hint">明确的教学目标能够生成更有针对性的PPT大纲</small>
                </div>

                <div class="form-group">
                  <label>教学重点 <span class="required">*</span></label>
                  <div class="key-points-container">
                    <div
                      v-for="(point, index) in formData.key_points"
                      :key="index"
                      class="key-point-item"
                    >
                      <input
                        type="text"
                        v-model="formData.key_points[index]"
                        class="form-control"
                        :placeholder="`请输入教学重点${index+1}`"
                        :disabled="isLoading"
                      />
                      <button
                        type="button"
                        @click="removeKeyPoint(index)"
                        class="remove-btn"
                        :disabled="isLoading"
                      >
                        <i class="icon-delete"></i>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addKeyPoint"
                      class="add-btn"
                      :disabled="isLoading || formData.key_points.length >= 10"
                    >
                      <i class="icon-plus"></i> 添加重点
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label for="additional_info">附加信息 (可选)</label>
                  <textarea
                    id="additional_info"
                    v-model="formData.additional_info"
                    class="form-control textarea"
                    placeholder="添加其他要求或说明，如教学方法、教具准备等"
                    rows="2"
                    :disabled="isLoading"
                  ></textarea>
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    @click="resetForm"
                    class="secondary-btn"
                    :disabled="isLoading"
                  >
                    <i class="icon-refresh"></i> 重置
                  </button>
                  <button
                    type="button"
                    @click="generateOutline"
                    class="primary-btn"
                    :disabled="!isFormValid || isLoading"
                  >
                    <span
                      v-if="isLoading"
                      class="loading-spinner"
                    ></span>
                    <span v-else><i class="icon-generate"></i></span>
                    {{ isLoading ? '正在生成...' : '生成PPT大纲' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 结果展示区域 -->
            <div
              v-if="outlineResult"
              class="result-card"
            >
              <div class="card-header">
                <div class="header-content">
                  <h2 class="card-title">
                    PPT大纲预览
                  </h2>
                  <p class="card-description">
                    生成的PPT大纲，可以复制或下载进行编辑
                  </p>
                </div>
              </div>

              <div class="card-body">
                <div class="outline-header">
                  <h3>{{ outlineResult.title }}</h3>
                  <div class="outline-actions">
                    <button
                      @click="copyOutline"
                      class="action-btn"
                    >
                      复制大纲
                    </button>
                    <button
                      @click="downloadOutline"
                      class="action-btn"
                    >
                      下载 Markdown
                    </button>
                    <button
                      @click="generatePPT"
                      class="action-btn primary"
                      :disabled="isGeneratingPPT"
                    >
                      <span
                        v-if="isGeneratingPPT"
                        class="loading-spinner-small"
                      ></span>
                      <i
                        v-else
                        class="icon-ppt"
                      ></i>
                      {{ isGeneratingPPT ? '生成中...' : '生成PPT' }}
                    </button>
                  </div>
                </div>

                <div class="outline-content">
                  <div
                    v-html="renderedOutline"
                    class="markdown-content"
                  ></div>
                </div>

                <div class="outline-footer">
                  <p>
                    <i class="icon-info"></i>
                    您可以复制此大纲用于进一步编辑和完善，也可以下载 Markdown 格式文件保存到本地
                  </p>
                </div>
              </div>
            </div>

            <!-- PPT预览区域 -->
            <div
              v-if="pptResult"
              class="result-card"
            >
              <div class="card-header">
                <div class="header-content">
                  <h2 class="card-title">
                    PPT预览
                  </h2>
                  <p class="card-description">
                    生成的PPT幻灯片，可以下载为PPTX文件
                  </p>
                </div>
              </div>

              <div class="card-body">
                <div class="outline-header">
                  <h3>{{ pptResult.title }}</h3>
                  <div class="outline-actions">
                    <button
                      @click="downloadPPT"
                      class="action-btn primary"
                      :disabled="isDownloadingPPT"
                    >
                      <span
                        v-if="isDownloadingPPT"
                        class="loading-spinner-small"
                      ></span>
                      <i
                        v-else
                        class="icon-download-ppt"
                      ></i>
                      {{ isDownloadingPPT ? '下载中...' : '下载PPTX文件' }}
                    </button>
                  </div>
                </div>

                <div class="ppt-preview">
                  <div class="slide-navigator">
                    <button
                      @click="currentSlide = index"
                      v-for="(slide, index) in pptResult.slides"
                      :key="index"
                      :class="{ active: currentSlide === index }"
                      class="slide-nav-item"
                    >
                      {{ index + 1 }}
                    </button>
                  </div>

                  <div class="slide-container">
                    <div class="slide-preview">
                      <h3 class="slide-title">
                        {{ pptResult.slides[currentSlide].title }}</h3>
                      <div
                        class="slide-content markdown-content"
                        v-html="renderedSlideContent"
                      ></div>
                    </div>

                    <div
                      class="slide-notes"
                      v-if="pptResult.slides[currentSlide].note"
                    >
                      <h4>讲稿备注:</h4>
                      <p>{{ pptResult.slides[currentSlide].note }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 上传自定义大纲区域 -->
            <div class="result-card">
              <div class="card-header">
                <div class="header-content">
                  <h2 class="card-title">
                    自定义大纲
                  </h2>
                  <p class="card-description">
                    上传您自己的Markdown格式大纲文件，直接生成PPT
                  </p>
                </div>
              </div>

              <div class="card-body">
                <div class="upload-outline">
                  <div class="upload-form">
                    <div class="form-group">
                      <label for="custom-title">PPT标题 <span
                          class="required">*</span></label>
                      <input
                        type="text"
                        id="custom-title"
                        v-model="customOutlineTitle"
                        class="form-control"
                        placeholder="请输入PPT标题"
                        :disabled="isUploadingOutline"
                      />
                    </div>

                    <div class="file-upload-container">
                      <label
                        for="outline-file"
                        class="file-upload-label"
                      >
                        <i class="icon-upload"></i>
                        <span>{{ outlineFile ? outlineFile.name : '选择Markdown大纲文件' }}</span>
                      </label>
                      <input
                        type="file"
                        id="outline-file"
                        accept=".md,.markdown,text/markdown"
                        @change="handleFileChange"
                        class="file-input"
                        :disabled="isUploadingOutline"
                      />
                      <button
                        @click="uploadOutlineFile"
                        class="primary-btn"
                        :disabled="!isUploadReady || isUploadingOutline"
                      >
                        <span
                          v-if="isUploadingOutline"
                          class="loading-spinner-small"
                        ></span>
                        <i
                          v-else
                          class="icon-upload"
                        ></i>
                        {{ isUploadingOutline ? '上传中...' : '上传并生成PPT' }}
                      </button>
                    </div>

                    <p class="upload-hint">
                      <i class="icon-info"></i>
                      支持Markdown格式的大纲文件，文件内容需要符合大纲格式要求
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 移动端遮罩 -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    />

    <!-- 快速提示 -->
    <transition name="tip-fade">
      <div
        v-if="showQuickTip"
        class="quick-tip"
      >
        <div class="tip-content">
          <span class="tip-icon">💡</span>
          <span>{{ quickTipMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { generatePPTOutline, generatePPTFromOutline, downloadPPTX } from '@/api/teacher/PPT_generate';
import { marked } from 'marked';
import PageHeader from '@/components/layout/PageHeader.vue';
import SideBar from '@/components/layout/SideBar.vue';

const router = useRouter();

// 表单数据
const formData = reactive({
  title: '',
  subject: '',
  teaching_target: '',
  key_points: [''],
  target_grade: '',
  slide_count: 10,
  additional_info: ''
});

// 状态管理
const isLoading = ref(false);
const errorMessage = ref('');
const showSuccess = ref(false);
const successMessage = ref('');
const outlineResult = ref(null);

// PPT生成相关状态
const isGeneratingPPT = ref(false);
const isDownloadingPPT = ref(false);
const pptResult = ref(null);
const currentSlide = ref(0);

// 自定义大纲上传相关状态
const customOutlineTitle = ref('');
const outlineFile = ref(null);
const isUploadingOutline = ref(false);
const isUploadReady = ref(false);

// 渲染当前幻灯片内容
const renderedSlideContent = computed(() => {
  if (!pptResult.value || !pptResult.value.slides[currentSlide.value]) {
    return '';
  }
  return marked(pptResult.value.slides[currentSlide.value].content);
});

// 侧边栏相关
const mobileMenuOpen = ref(false);
const showQuickTip = ref(false);
const quickTipMessage = ref('');
const teacherMenuItems = [
  { path: '/teacher/course', label: '课程管理' },
  { path: '/teacher/chat', label: '教学助手' },
  { path: '/teacher/exercise_generate', label: '习题生成' },
  { path: '/teacher/ppt/generate', label: 'PPT生成' },
  { path: '/teacher/profile', label: '个人信息' },
];

// 表单验证
const isFormValid = computed(() => {
  const keyPointsValid = formData.key_points.length > 0 &&
      formData.key_points.filter(point => point.trim() !== '').length > 0;

  return (
      formData.title.trim().length > 0 &&
      formData.subject.trim().length > 0 &&
      formData.teaching_target.trim().length > 0 &&
      keyPointsValid &&
      formData.target_grade.trim().length > 0
  );
});

// Markdown 渲染
const renderedOutline = computed(() => {
  if (!outlineResult.value || !outlineResult.value.outline_md) {
    return '';
  }
  return marked(outlineResult.value.outline_md);
});

// 获取用户名
const username = computed(() => {
  return localStorage.getItem('username') || '教师用户';
});

// 侧边栏相关方法
const handleMenuClick = (item) => {
  router.push(item.path);
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const showQuickTipMessage = (message) => {
  quickTipMessage.value = message;
  showQuickTip.value = true;
  setTimeout(() => {
    showQuickTip.value = false;
  }, 2000);
};

// 添加教学重点
const addKeyPoint = () => {
  if (formData.key_points.length < 10) {
    formData.key_points.push('');
  }
};

// 删除教学重点
const removeKeyPoint = (index) => {
  if (formData.key_points.length > 1) {
    formData.key_points.splice(index, 1);
  }
};

// 生成PPT大纲
const generateOutline = async () => {
  if (!isFormValid.value) {
    errorMessage.value = '请填写所有必填项';
    return;
  }

  clearError();
  isLoading.value = true;
  outlineResult.value = null;

  try {
    const requestData = {
      title: formData.title.trim(),
      subject: formData.subject.trim(),
      teaching_target: formData.teaching_target.trim(),
      key_points: formData.key_points.filter(point => point.trim() !== ''),
      target_grade: formData.target_grade.trim(),
      slide_count: formData.slide_count,
      additional_info: formData.additional_info.trim() || null
    };

    const result = await generatePPTOutline(requestData);
    outlineResult.value = result;
    successMessage.value = 'PPT大纲生成成功！';
    showSuccess.value = true;
    setTimeout(() => { showSuccess.value = false; }, 3000);

    setTimeout(() => {
      const resultCard = document.querySelector('.result-card');
      if (resultCard) {
        resultCard.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

  } catch (error) {
    errorMessage.value = error.message || '生成PPT大纲失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 复制大纲内容
const copyOutline = () => {
  if (!outlineResult.value) return;
  try {
    navigator.clipboard.writeText(outlineResult.value.outline_md);
    showQuickTipMessage('大纲内容已复制到剪贴板');
  } catch (error) {
    errorMessage.value = '复制失败，请手动复制';
  }
};

// 下载Markdown文件
const downloadOutline = () => {
  if (!outlineResult.value) return;
  try {
    const fileName = `${outlineResult.value.title.replace(/[^\w\s]/gi, '')}_大纲.md`;
    const blob = new Blob([outlineResult.value.outline_md], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    showQuickTipMessage('Markdown文件下载成功');
  } catch (error) {
    errorMessage.value = '下载失败，请稍后重试';
  }
};

// 生成PPT
const generatePPT = async () => {
  if (!outlineResult.value) return;
  clearError();
  isGeneratingPPT.value = true;
  try {
    const mdBlob = new Blob([outlineResult.value.outline_md], { type: 'text/markdown' });
    const mdFile = new File([mdBlob], `${outlineResult.value.title}_大纲.md`, { type: 'text/markdown' });
    const result = await generatePPTFromOutline(outlineResult.value.title, mdFile);
    pptResult.value = result;
    currentSlide.value = 0;
    successMessage.value = 'PPT生成成功！';
    showSuccess.value = true;
    setTimeout(() => { showSuccess.value = false; }, 3000);
    setTimeout(() => {
      const pptPreview = document.querySelector('.ppt-preview');
      if (pptPreview) {
        pptPreview.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    errorMessage.value = error.message || '生成PPT失败，请稍后重试';
  } finally {
    isGeneratingPPT.value = false;
  }
};

// 下载PPT
const downloadPPT = async () => {
  if (!pptResult.value) return;
  try {
    const filename = pptResult.value.filename || '未命名演示文稿';
    await downloadPPTX(pptResult.value, filename);
    showQuickTipMessage('PPT下载成功！');
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    outlineFile.value = file;
    isUploadReady.value = true;
  } else {
    outlineFile.value = null;
    isUploadReady.value = false;
  }
};

// 上传大纲文件
const uploadOutlineFile = async () => {
  if (!outlineFile.value || !customOutlineTitle.value.trim()) {
    errorMessage.value = '请填写标题并选择文件';
    return;
  }
  clearError();
  isUploadingOutline.value = true;
  try {
    const result = await generatePPTFromOutline(customOutlineTitle.value.trim(), outlineFile.value);
    pptResult.value = result;
    currentSlide.value = 0;
    successMessage.value = 'PPT生成成功！';
    showSuccess.value = true;
    setTimeout(() => { showSuccess.value = false; }, 3000);
    setTimeout(() => {
      const pptPreview = document.querySelector('.ppt-preview');
      if (pptPreview) {
        pptPreview.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    errorMessage.value = error.message || '上传大纲文件失败，请稍后重试';
  } finally {
    isUploadingOutline.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formData.title = '';
  formData.subject = '';
  formData.teaching_target = '';
  formData.key_points = [''];
  formData.target_grade = '';
  formData.slide_count = 10;
  formData.additional_info = '';
  outlineResult.value = null;
  clearError();
};

// 清除错误信息
const clearError = () => {
  errorMessage.value = '';
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/login');
  }
};

onMounted(() => {
  console.log('PPT生成页面已加载');
});
</script>

<style scoped>
/* 基础布局样式 */
.teacher-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f5f6fa;
  overflow: hidden;
}

.main {
  position: relative;
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-user {
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.logout-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.logout-btn:hover {
  background: #c0392b;
}


.content-area {
  flex: 1;
  width: 100%;
  height: calc(100vh - 80px);
  margin: 0;
  padding: 0;
  background: #f8fafc;
  overflow: hidden;
  position: relative;
}

.ppt-generate {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* 返回按钮样式 */

.subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

/* 修改subtitle样式以适应新的布局 */
.subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.subtitle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.outline-nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4299e1;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.3);
}

.outline-nav-btn:hover {
  background: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(66, 153, 225, 0.4);
}

.icon-list:before {
  content: '📋';
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 错误和成功消息样式 */
.error-message,
.success-message {
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.error-message {
  background: #fff5f5;
  color: #c53030;
  border-left: 4px solid #e53e3e;
}

.success-message {
  background: #f0fff4;
  color: #2f855a;
  border-left: 4px solid #38a169;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 20px;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
}

.close-btn:hover {
  opacity: 1;
}

/* 卡片样式 */
.form-card,
.result-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.card-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 30px;
  color: white;
}

.header-content {
  max-width: 100%;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.title-icon {
  font-size: 28px;
}

.card-description {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}

.card-body {
  padding: 30px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 16px;
  color: #2d3748;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
}

.form-control:disabled {
  background: #edf2f7;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-control.textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  display: block;
  margin-top: 6px;
  color: #718096;
  font-size: 14px;
}

/* 重点项样式 */
.key-points-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.key-point-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.remove-btn {
  background: #fed7d7;
  color: #e53e3e;
  border: none;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #feb2b2;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-btn {
  background: #e6fffa;
  color: #319795;
  border: 1px dashed #4fd1c5;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 5px;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #b2f5ea;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 滑动条样式 */
.slide-count-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.range-slider {
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slide-count-value {
  background: #edf2f7;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  color: #4a5568;
  min-width: 70px;
  text-align: center;
}

/* 按钮样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
}

.primary-btn,
.secondary-btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.secondary-btn {
  background: #edf2f7;
  color: #4a5568;
}

.secondary-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: #2d3748;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载状态 */
.loading {
  position: relative;
}

.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
  border-radius: 10px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

.loading-spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 结果区域样式 */
.outline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.outline-header h3 {
  margin: 0;
  font-size: 20px;
  color: #2d3748;
}

.outline-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e2e8f0;
  color: #2d3748;
}

.outline-content {
  background: #f7fafc;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
}

.markdown-content {
  line-height: 1.6;
  color: #2d3748;
}

.markdown-content h1 {
  font-size: 24px;
  margin-top: 0;
  color: #2d3748;
}

.markdown-content h2 {
  font-size: 20px;
  margin-top: 24px;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

.markdown-content h3 {
  font-size: 18px;
  margin-top: 20px;
  color: #2d3748;
}

.markdown-content ul {
  padding-left: 24px;
}

.markdown-content li {
  margin-bottom: 6px;
}

.outline-footer {
  background: #f0fff4;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #38a169;
}

.outline-footer p {
  margin: 0;
  color: #2f855a;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* 快速提示样式 */
.quick-tip {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #667eea;
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  z-index: 1000;
  max-width: 300px;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-icon {
  font-size: 18px;
}


@media (max-width: 768px) {

  .mobile-overlay {
    display: block;
  }

  .outline-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .outline-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    justify-content: center;
  }

  .logout-btn span:last-child {
    display: none;
  }
}

@media (max-width: 480px) {
  .ppt-generate {
    padding: 10px;
  }

  .card-body {
    padding: 20px;
  }

}

/* 图标 */

.icon-delete:before {
  content: '🗑️';
}

.icon-plus:before {
  content: '➕';
}

.icon-refresh:before {
  content: '🔄';
}

.icon-generate:before {
  content: '✨';
}

.icon-copy:before {
  content: '📋';
}

.icon-download:before {
  content: '📥';
}

.icon-error:before {
  content: '❌';
}

.icon-success:before {
  content: '✅';
}

.icon-info:before {
  content: 'ℹ️';
}
/* 在 <style scoped> 中添加或修改 */
.nav-buttons {
  display: flex;
  gap: 12px;
}

.outline-nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4299e1;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-buttons {
    width: 100%;
    flex-direction: column;
  }

  .outline-nav-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>