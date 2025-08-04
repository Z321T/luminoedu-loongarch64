"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var PPT_generate_1 = require("@/api/teacher/PPT_generate");
var marked_1 = require("marked");
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var router = (0, vue_router_1.useRouter)();
// 表单数据
var formData = (0, vue_1.reactive)({
    title: '',
    subject: '',
    teaching_target: '',
    key_points: [''],
    target_grade: '',
    slide_count: 10,
    additional_info: ''
});
// 状态管理
var isLoading = (0, vue_1.ref)(false);
var errorMessage = (0, vue_1.ref)('');
var showSuccess = (0, vue_1.ref)(false);
var successMessage = (0, vue_1.ref)('');
var outlineResult = (0, vue_1.ref)(null);
// PPT生成相关状态
var isGeneratingPPT = (0, vue_1.ref)(false);
var isDownloadingPPT = (0, vue_1.ref)(false);
var pptResult = (0, vue_1.ref)(null);
var currentSlide = (0, vue_1.ref)(0);
// 自定义大纲上传相关状态
var customOutlineTitle = (0, vue_1.ref)('');
var outlineFile = (0, vue_1.ref)(null);
var isUploadingOutline = (0, vue_1.ref)(false);
var isUploadReady = (0, vue_1.ref)(false);
// 渲染当前幻灯片内容
var renderedSlideContent = (0, vue_1.computed)(function () {
    if (!pptResult.value || !pptResult.value.slides[currentSlide.value]) {
        return '';
    }
    return (0, marked_1.marked)(pptResult.value.slides[currentSlide.value].content);
});
// 侧边栏相关
var mobileMenuOpen = (0, vue_1.ref)(false);
var showQuickTip = (0, vue_1.ref)(false);
var quickTipMessage = (0, vue_1.ref)('');
var teacherMenuItems = [
    { path: '/teacher/course', label: '课程管理' },
    { path: '/teacher/chat', label: '教学助手' },
    { path: '/teacher/exercise_generate', label: '习题生成' },
    { path: '/teacher/ppt/generate', label: 'PPT生成' },
    { path: '/teacher/profile', label: '个人信息' },
];
// 表单验证
var isFormValid = (0, vue_1.computed)(function () {
    var keyPointsValid = formData.key_points.length > 0 &&
        formData.key_points.filter(function (point) { return point.trim() !== ''; }).length > 0;
    return (formData.title.trim().length > 0 &&
        formData.subject.trim().length > 0 &&
        formData.teaching_target.trim().length > 0 &&
        keyPointsValid &&
        formData.target_grade.trim().length > 0);
});
// Markdown 渲染
var renderedOutline = (0, vue_1.computed)(function () {
    if (!outlineResult.value || !outlineResult.value.outline_md) {
        return '';
    }
    return (0, marked_1.marked)(outlineResult.value.outline_md);
});
// 获取用户名
var username = (0, vue_1.computed)(function () {
    return localStorage.getItem('username') || '教师用户';
});
// 侧边栏相关方法
var handleMenuClick = function (item) {
    router.push(item.path);
    closeMobileMenu();
};
var toggleMobileMenu = function () {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};
var closeMobileMenu = function () {
    mobileMenuOpen.value = false;
};
var showQuickTipMessage = function (message) {
    quickTipMessage.value = message;
    showQuickTip.value = true;
    setTimeout(function () {
        showQuickTip.value = false;
    }, 2000);
};
// 添加教学重点
var addKeyPoint = function () {
    if (formData.key_points.length < 10) {
        formData.key_points.push('');
    }
};
// 删除教学重点
var removeKeyPoint = function (index) {
    if (formData.key_points.length > 1) {
        formData.key_points.splice(index, 1);
    }
};
// 生成PPT大纲
var generateOutline = function () { return __awaiter(void 0, void 0, void 0, function () {
    var requestData, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isFormValid.value) {
                    errorMessage.value = '请填写所有必填项';
                    return [2 /*return*/];
                }
                clearError();
                isLoading.value = true;
                outlineResult.value = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                requestData = {
                    title: formData.title.trim(),
                    subject: formData.subject.trim(),
                    teaching_target: formData.teaching_target.trim(),
                    key_points: formData.key_points.filter(function (point) { return point.trim() !== ''; }),
                    target_grade: formData.target_grade.trim(),
                    slide_count: formData.slide_count,
                    additional_info: formData.additional_info.trim() || null
                };
                return [4 /*yield*/, (0, PPT_generate_1.generatePPTOutline)(requestData)];
            case 2:
                result = _a.sent();
                outlineResult.value = result;
                successMessage.value = 'PPT大纲生成成功！';
                showSuccess.value = true;
                setTimeout(function () { showSuccess.value = false; }, 3000);
                setTimeout(function () {
                    var resultCard = document.querySelector('.result-card');
                    if (resultCard) {
                        resultCard.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                errorMessage.value = error_1.message || '生成PPT大纲失败，请稍后重试';
                return [3 /*break*/, 5];
            case 4:
                isLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 复制大纲内容
var copyOutline = function () {
    if (!outlineResult.value)
        return;
    try {
        navigator.clipboard.writeText(outlineResult.value.outline_md);
        showQuickTipMessage('大纲内容已复制到剪贴板');
    }
    catch (error) {
        errorMessage.value = '复制失败，请手动复制';
    }
};
// 下载Markdown文件
var downloadOutline = function () {
    if (!outlineResult.value)
        return;
    try {
        var fileName = "".concat(outlineResult.value.title.replace(/[^\w\s]/gi, ''), "_\u5927\u7EB2.md");
        var blob = new Blob([outlineResult.value.outline_md], { type: 'text/markdown;charset=utf-8' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
        showQuickTipMessage('Markdown文件下载成功');
    }
    catch (error) {
        errorMessage.value = '下载失败，请稍后重试';
    }
};
// 生成PPT
var generatePPT = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mdBlob, mdFile, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!outlineResult.value)
                    return [2 /*return*/];
                clearError();
                isGeneratingPPT.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                mdBlob = new Blob([outlineResult.value.outline_md], { type: 'text/markdown' });
                mdFile = new File([mdBlob], "".concat(outlineResult.value.title, "_\u5927\u7EB2.md"), { type: 'text/markdown' });
                return [4 /*yield*/, (0, PPT_generate_1.generatePPTFromOutline)(outlineResult.value.title, mdFile)];
            case 2:
                result = _a.sent();
                pptResult.value = result;
                currentSlide.value = 0;
                successMessage.value = 'PPT生成成功！';
                showSuccess.value = true;
                setTimeout(function () { showSuccess.value = false; }, 3000);
                setTimeout(function () {
                    var pptPreview = document.querySelector('.ppt-preview');
                    if (pptPreview) {
                        pptPreview.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                errorMessage.value = error_2.message || '生成PPT失败，请稍后重试';
                return [3 /*break*/, 5];
            case 4:
                isGeneratingPPT.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 下载PPT
var downloadPPT = function () { return __awaiter(void 0, void 0, void 0, function () {
    var filename, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pptResult.value)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                filename = pptResult.value.filename || '未命名演示文稿';
                return [4 /*yield*/, (0, PPT_generate_1.downloadPPTX)(pptResult.value, filename)];
            case 2:
                _a.sent();
                showQuickTipMessage('PPT下载成功！');
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                errorMessage.value = error_3.message;
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 处理文件选择
var handleFileChange = function (event) {
    var file = event.target.files[0];
    if (file) {
        outlineFile.value = file;
        isUploadReady.value = true;
    }
    else {
        outlineFile.value = null;
        isUploadReady.value = false;
    }
};
// 上传大纲文件
var uploadOutlineFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!outlineFile.value || !customOutlineTitle.value.trim()) {
                    errorMessage.value = '请填写标题并选择文件';
                    return [2 /*return*/];
                }
                clearError();
                isUploadingOutline.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, PPT_generate_1.generatePPTFromOutline)(customOutlineTitle.value.trim(), outlineFile.value)];
            case 2:
                result = _a.sent();
                pptResult.value = result;
                currentSlide.value = 0;
                successMessage.value = 'PPT生成成功！';
                showSuccess.value = true;
                setTimeout(function () { showSuccess.value = false; }, 3000);
                setTimeout(function () {
                    var pptPreview = document.querySelector('.ppt-preview');
                    if (pptPreview) {
                        pptPreview.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                return [3 /*break*/, 5];
            case 3:
                error_4 = _a.sent();
                errorMessage.value = error_4.message || '上传大纲文件失败，请稍后重试';
                return [3 /*break*/, 5];
            case 4:
                isUploadingOutline.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 重置表单
var resetForm = function () {
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
var clearError = function () {
    errorMessage.value = '';
};
// 返回上一页
var goBack = function () {
    router.go(-1);
};
// 退出登录
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        router.push('/login');
    }
};
(0, vue_1.onMounted)(function () {
    console.log('PPT生成页面已加载');
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['range-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['range-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-header']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-header']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ppt-generate']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-nav-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teacher-layout" }));
/** @type {[typeof SideBar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default(__assign(__assign({ 'onMenuClick': {} }, { menuItems: (__VLS_ctx.teacherMenuItems), activeItem: ('/teacher/ppt/generate') }), { class: ({ 'mobile-open': __VLS_ctx.mobileMenuOpen }) })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign(__assign({ 'onMenuClick': {} }, { menuItems: (__VLS_ctx.teacherMenuItems), activeItem: ('/teacher/ppt/generate') }), { class: ({ 'mobile-open': __VLS_ctx.mobileMenuOpen }) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3;
var __VLS_4;
var __VLS_5;
var __VLS_6 = {
    onMenuClick: (__VLS_ctx.handleMenuClick)
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main" }));
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(PageHeader_vue_1.default, new PageHeader_vue_1.default({
    title: "教学PPT生成助手",
}));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
        title: "教学PPT生成助手",
    }], __VLS_functionalComponentArgsRest(__VLS_7), false));
__VLS_9.slots.default;
{
    var __VLS_thisSlot = __VLS_9.slots.actions;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-user" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "logout-btn" }));
}
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)(__assign({ class: "content-area" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "ppt-generate" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "subtitle-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "subtitle" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "nav-buttons" }));
var __VLS_10 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ to: "/teacher/ppt/files" }, { class: "outline-nav-btn" })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ to: "/teacher/ppt/files" }, { class: "outline-nav-btn" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
__VLS_13.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-list" }));
var __VLS_13;
var __VLS_14 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
var __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14(__assign({ to: "/teacher/ppt/outline" }, { class: "outline-nav-btn" })));
var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign({ to: "/teacher/ppt/outline" }, { class: "outline-nav-btn" })], __VLS_functionalComponentArgsRest(__VLS_15), false));
__VLS_17.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-list" }));
var __VLS_17;
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "error-message" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-error" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.errorMessage);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.clearError) }, { class: "close-btn" }));
}
if (__VLS_ctx.showSuccess) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "success-message" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-success" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.successMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-card" }, { class: ({ 'loading': __VLS_ctx.isLoading }) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "card-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "card-description" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "text", id: "title", value: (__VLS_ctx.formData.title) }, { class: "form-control" }), { placeholder: "请输入PPT标题，不超过30个字符", maxlength: "30", disabled: (__VLS_ctx.isLoading) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)(__assign({ class: "form-hint" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-row" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "subject",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "text", id: "subject", value: (__VLS_ctx.formData.subject) }, { class: "form-control" }), { placeholder: "请输入学科名称，如数学、语文等", maxlength: "30", disabled: (__VLS_ctx.isLoading) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "target_grade",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "text", id: "target_grade", value: (__VLS_ctx.formData.target_grade) }, { class: "form-control" }), { placeholder: "如：初一、高二等", disabled: (__VLS_ctx.isLoading) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "slide_count",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slide-count-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "range", id: "slide_count", min: "5", max: "20", step: "1" }, { class: "range-slider" }), { disabled: (__VLS_ctx.isLoading) }));
(__VLS_ctx.formData.slide_count);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "slide-count-value" }));
(__VLS_ctx.formData.slide_count);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "teaching_target",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign(__assign({ id: "teaching_target", value: (__VLS_ctx.formData.teaching_target) }, { class: "form-control textarea" }), { placeholder: "描述这节课的教学目标，不超过100个字符", rows: "3", maxlength: "100", disabled: (__VLS_ctx.isLoading) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)(__assign({ class: "form-hint" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "key-points-container" }));
var _loop_1 = function (point, index) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (index) }, { class: "key-point-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "text", value: (__VLS_ctx.formData.key_points[index]) }, { class: "form-control" }), { placeholder: ("\u8BF7\u8F93\u5165\u6559\u5B66\u91CD\u70B9".concat(index + 1)), disabled: (__VLS_ctx.isLoading) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.removeKeyPoint(index);
        } }, { type: "button" }), { class: "remove-btn" }), { disabled: (__VLS_ctx.isLoading) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-delete" }));
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.formData.key_points)); _i < _a.length; _i++) {
    var _b = _a[_i], point = _b[0], index = _b[1];
    _loop_1(point, index);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.addKeyPoint) }, { type: "button" }), { class: "add-btn" }), { disabled: (__VLS_ctx.isLoading || __VLS_ctx.formData.key_points.length >= 10) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-plus" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "additional_info",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign(__assign({ id: "additional_info", value: (__VLS_ctx.formData.additional_info) }, { class: "form-control textarea" }), { placeholder: "添加其他要求或说明，如教学方法、教具准备等", rows: "2", disabled: (__VLS_ctx.isLoading) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-actions" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.resetForm) }, { type: "button" }), { class: "secondary-btn" }), { disabled: (__VLS_ctx.isLoading) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-refresh" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.generateOutline) }, { type: "button" }), { class: "primary-btn" }), { disabled: (!__VLS_ctx.isFormValid || __VLS_ctx.isLoading) }));
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "loading-spinner" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-generate" }));
}
(__VLS_ctx.isLoading ? '正在生成...' : '生成PPT大纲');
if (__VLS_ctx.outlineResult) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "result-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "card-title" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "card-description" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "outline-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (__VLS_ctx.outlineResult.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "outline-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.copyOutline) }, { class: "action-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.downloadOutline) }, { class: "action-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.generatePPT) }, { class: "action-btn primary" }), { disabled: (__VLS_ctx.isGeneratingPPT) }));
    if (__VLS_ctx.isGeneratingPPT) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "loading-spinner-small" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-ppt" }));
    }
    (__VLS_ctx.isGeneratingPPT ? '生成中...' : '生成PPT');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "outline-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "markdown-content" }));
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.renderedOutline) }), null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "outline-footer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-info" }));
}
if (__VLS_ctx.pptResult) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "result-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "card-title" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "card-description" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "outline-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (__VLS_ctx.pptResult.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "outline-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.downloadPPT) }, { class: "action-btn primary" }), { disabled: (__VLS_ctx.isDownloadingPPT) }));
    if (__VLS_ctx.isDownloadingPPT) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "loading-spinner-small" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-download-ppt" }));
    }
    (__VLS_ctx.isDownloadingPPT ? '下载中...' : '下载PPTX文件');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "ppt-preview" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slide-navigator" }));
    var _loop_2 = function (slide, index) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.pptResult))
                    return;
                __VLS_ctx.currentSlide = index;
            } }, { key: (index) }), { class: ({ active: __VLS_ctx.currentSlide === index }) }), { class: "slide-nav-item" }));
        (index + 1);
    };
    for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.pptResult.slides)); _c < _d.length; _c++) {
        var _e = _d[_c], slide = _e[0], index = _e[1];
        _loop_2(slide, index);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slide-container" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slide-preview" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "slide-title" }));
    (__VLS_ctx.pptResult.slides[__VLS_ctx.currentSlide].title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slide-content markdown-content" }));
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.renderedSlideContent) }), null, null);
    if (__VLS_ctx.pptResult.slides[__VLS_ctx.currentSlide].note) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slide-notes" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.pptResult.slides[__VLS_ctx.currentSlide].note);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "result-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "card-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "card-description" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-outline" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-form" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "custom-title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "required" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "text", id: "custom-title", value: (__VLS_ctx.customOutlineTitle) }, { class: "form-control" }), { placeholder: "请输入PPT标题", disabled: (__VLS_ctx.isUploadingOutline) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-upload-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "outline-file" }, { class: "file-upload-label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-upload" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.outlineFile ? __VLS_ctx.outlineFile.name : '选择Markdown大纲文件');
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onChange: (__VLS_ctx.handleFileChange) }, { type: "file", id: "outline-file", accept: ".md,.markdown,text/markdown" }), { class: "file-input" }), { disabled: (__VLS_ctx.isUploadingOutline) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.uploadOutlineFile) }, { class: "primary-btn" }), { disabled: (!__VLS_ctx.isUploadReady || __VLS_ctx.isUploadingOutline) }));
if (__VLS_ctx.isUploadingOutline) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "loading-spinner-small" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-upload" }));
}
(__VLS_ctx.isUploadingOutline ? '上传中...' : '上传并生成PPT');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "upload-hint" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon-info" }));
if (__VLS_ctx.mobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closeMobileMenu) }, { class: "mobile-overlay" }));
}
var __VLS_18 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    name: "tip-fade",
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        name: "tip-fade",
    }], __VLS_functionalComponentArgsRest(__VLS_19), false));
__VLS_21.slots.default;
if (__VLS_ctx.showQuickTip) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "quick-tip" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "tip-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "tip-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.quickTipMessage);
}
var __VLS_21;
/** @type {__VLS_StyleScopedClasses['teacher-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-open']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['ppt-generate']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle-container']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-list']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-list']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-error']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-success']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-description']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-count-container']} */ ;
/** @type {__VLS_StyleScopedClasses['range-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-count-value']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['key-points-container']} */ ;
/** @type {__VLS_StyleScopedClasses['key-point-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-plus']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-refresh']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-generate']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-description']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-header']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner-small']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-ppt']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-info']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-description']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-header']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner-small']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-download-ppt']} */ ;
/** @type {__VLS_StyleScopedClasses['ppt-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-navigator']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-container']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-title']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-notes']} */ ;
/** @type {__VLS_StyleScopedClasses['result-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-description']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['required']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload-container']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload-label']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-input']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner-small']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-info']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-content']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-icon']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            PageHeader: PageHeader_vue_1.default,
            SideBar: SideBar_vue_1.default,
            formData: formData,
            isLoading: isLoading,
            errorMessage: errorMessage,
            showSuccess: showSuccess,
            successMessage: successMessage,
            outlineResult: outlineResult,
            isGeneratingPPT: isGeneratingPPT,
            isDownloadingPPT: isDownloadingPPT,
            pptResult: pptResult,
            currentSlide: currentSlide,
            customOutlineTitle: customOutlineTitle,
            outlineFile: outlineFile,
            isUploadingOutline: isUploadingOutline,
            isUploadReady: isUploadReady,
            renderedSlideContent: renderedSlideContent,
            mobileMenuOpen: mobileMenuOpen,
            showQuickTip: showQuickTip,
            quickTipMessage: quickTipMessage,
            teacherMenuItems: teacherMenuItems,
            isFormValid: isFormValid,
            renderedOutline: renderedOutline,
            username: username,
            handleMenuClick: handleMenuClick,
            closeMobileMenu: closeMobileMenu,
            addKeyPoint: addKeyPoint,
            removeKeyPoint: removeKeyPoint,
            generateOutline: generateOutline,
            copyOutline: copyOutline,
            downloadOutline: downloadOutline,
            generatePPT: generatePPT,
            downloadPPT: downloadPPT,
            handleFileChange: handleFileChange,
            uploadOutlineFile: uploadOutlineFile,
            resetForm: resetForm,
            clearError: clearError,
            handleLogout: handleLogout,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
