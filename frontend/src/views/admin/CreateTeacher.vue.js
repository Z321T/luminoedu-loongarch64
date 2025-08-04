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
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var user_management_1 = require("@/api/admin/user_management");
var router = (0, vue_router_1.useRouter)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '管理员');
var mobileMenuOpen = (0, vue_1.ref)(false);
var downloading = (0, vue_1.ref)(false);
var importing = (0, vue_1.ref)(false);
var selectedFile = (0, vue_1.ref)(null);
var importResult = (0, vue_1.ref)(null);
var errorMsg = (0, vue_1.ref)('');
var fileInput = (0, vue_1.ref)(null);
var isDragOver = (0, vue_1.ref)(false);
var uploadProgress = (0, vue_1.ref)(0);
var showQuickTip = (0, vue_1.ref)(false);
var quickTipMessage = (0, vue_1.ref)('');
var adminMenuItems = [
    { path: '/admin/log_management', label: '日志管理' },
    { path: '/admin/teacher_management', label: '教师管理' },
    { path: '/admin/student_management', label: '学生管理' },
    { path: '/admin/model_management', label: '模型管理' },
];
// 计算属性
var isFileValid = (0, vue_1.computed)(function () {
    if (!selectedFile.value)
        return false;
    var validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    var isValidType = validTypes.includes(selectedFile.value.type) ||
        selectedFile.value.name.toLowerCase().endsWith('.xlsx') ||
        selectedFile.value.name.toLowerCase().endsWith('.xls');
    var isValidSize = selectedFile.value.size <= 10 * 1024 * 1024;
    return isValidType && isValidSize;
});
// 方法
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
var showQuickTipMessage = function (message) {
    quickTipMessage.value = message;
    showQuickTip.value = true;
    setTimeout(function () {
        showQuickTip.value = false;
    }, 3000);
};
var closeMobileMenu = function () {
    mobileMenuOpen.value = false;
};
// 下载导入模板
var handleDownloadTemplate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var blob, url, a, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                downloading.value = true;
                return [4 /*yield*/, (0, user_management_1.downloadTeacherTemplate)()];
            case 1:
                blob = _a.sent();
                if (!blob)
                    throw new Error('下载失败');
                url = window.URL.createObjectURL(blob);
                a = document.createElement('a');
                a.href = url;
                a.download = '教师导入模板.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showQuickTipMessage('模板下载成功');
                return [3 /*break*/, 4];
            case 2:
                e_1 = _a.sent();
                errorMsg.value = e_1.message || '模板下载失败';
                return [3 /*break*/, 4];
            case 3:
                downloading.value = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 文件操作
var onFileChange = function (e) {
    var files = e.target.files;
    if (files && files.length > 0) {
        selectedFile.value = files[0];
        errorMsg.value = '';
    }
    else {
        selectedFile.value = null;
    }
};
var handleDrop = function (event) {
    var _a;
    event.preventDefault();
    isDragOver.value = false;
    var files = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files;
    if (files && files.length > 0) {
        selectedFile.value = files[0];
        errorMsg.value = '';
    }
};
var handleDragOver = function (event) {
    event.preventDefault();
    isDragOver.value = true;
};
var handleDragLeave = function () {
    isDragOver.value = false;
};
var handleDragEnter = function (event) {
    event.preventDefault();
    isDragOver.value = true;
};
var removeFile = function () {
    selectedFile.value = null;
    importResult.value = null;
    errorMsg.value = '';
    uploadProgress.value = 0;
};
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
// 导入教师
var handleImport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var progressInterval, result, message_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!selectedFile.value || !isFileValid.value) {
                    alert('请选择有效的文件');
                    return [2 /*return*/];
                }
                importing.value = true;
                importResult.value = null;
                errorMsg.value = '';
                uploadProgress.value = 0;
                progressInterval = setInterval(function () {
                    if (uploadProgress.value < 90) {
                        uploadProgress.value += Math.random() * 10;
                    }
                }, 200);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, user_management_1.createTeachers)(selectedFile.value)];
            case 2:
                result = _a.sent();
                clearInterval(progressInterval);
                uploadProgress.value = 100;
                message_1 = "\u5BFC\u5165\u5B8C\u6210\uFF01\n\n";
                message_1 += "\u603B\u8BB0\u5F55\u6570\uFF1A".concat(result.total || 0, "\n");
                message_1 += "\u6210\u529F\u5BFC\u5165\uFF1A".concat(result.success_count || 0, "\n");
                message_1 += "\u5931\u8D25\uFF1A".concat(result.failed_count || 0, "\n");
                if (result.failed_count > 0 && result.failed_records) {
                    message_1 += "\n\u5931\u8D25\u8BE6\u60C5\uFF1A\n";
                    result.failed_records.forEach(function (item, index) {
                        message_1 += "".concat(index + 1, ". ").concat(item.username || '未知用户', "\uFF1A").concat(item.error || '未知错误', "\n");
                    });
                }
                alert(message_1);
                return [3 /*break*/, 5];
            case 3:
                err_1 = _a.sent();
                clearInterval(progressInterval);
                console.error('导入失败:', err_1);
                alert("\u5BFC\u5165\u5931\u8D25\uFF1A".concat(err_1.message || '请重试'));
                errorMsg.value = err_1.message || '导入失败';
                return [3 /*break*/, 5];
            case 4:
                importing.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['template-notes']} */ ;
/** @type {__VLS_StyleScopedClasses['template-notes']} */ ;
/** @type {__VLS_StyleScopedClasses['template-notes']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['file-status']} */ ;
/** @type {__VLS_StyleScopedClasses['file-status']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-file-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-number']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-number']} */ ;
/** @type {__VLS_StyleScopedClasses['main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['template-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "admin-layout" }));
/** @type {[typeof SideBar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default({
    menuItems: (__VLS_ctx.adminMenuItems),
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        menuItems: (__VLS_ctx.adminMenuItems),
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main-layout" }));
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
var __VLS_3 = __VLS_asFunctionalComponent(PageHeader_vue_1.default, new PageHeader_vue_1.default({
    title: "管理系统",
}));
var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{
        title: "管理系统",
    }], __VLS_functionalComponentArgsRest(__VLS_3), false));
__VLS_5.slots.default;
{
    var __VLS_thisSlot = __VLS_5.slots.actions;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-user" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "logout-btn" }));
}
var __VLS_5;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)(__assign({ class: "content-area" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "create-teacher" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "card-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "card-description" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "template-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "section-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "template-actions" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleDownloadTemplate) }, { disabled: (__VLS_ctx.downloading) }), { class: "template-btn primary" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "btn-text" }));
(__VLS_ctx.downloading ? '下载中...' : '下载Excel模板');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "section-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign(__assign(__assign({ onDrop: (__VLS_ctx.handleDrop) }, { onDragover: (__VLS_ctx.handleDragOver) }), { onDragleave: (__VLS_ctx.handleDragLeave) }), { onDragenter: (__VLS_ctx.handleDragEnter) }), { onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$refs.fileInput.click();
    } }), { class: (['upload-area', { 'drag-over': __VLS_ctx.isDragOver, 'has-file': __VLS_ctx.selectedFile }]) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onChange: (__VLS_ctx.onFileChange) }, { ref: "fileInput", type: "file", accept: ".xlsx,.xls" }), { style: {} }));
/** @type {typeof __VLS_ctx.fileInput} */ ;
if (!__VLS_ctx.selectedFile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-placeholder" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-text" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "primary-text" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "secondary-text" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-info" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-details" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-meta" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-name" }));
    (__VLS_ctx.selectedFile.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-size" }));
    (__VLS_ctx.formatFileSize(__VLS_ctx.selectedFile.size));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: (['file-status', { 'valid': __VLS_ctx.isFileValid, 'invalid': !__VLS_ctx.isFileValid }]) }));
    (__VLS_ctx.isFileValid ? '✅ 文件有效' : '❌ 文件无效');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.removeFile) }, { class: "remove-file-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "remove-icon" }));
}
if (__VLS_ctx.importing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-progress" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "progress-bar" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "progress-fill" }, { style: ({ width: __VLS_ctx.uploadProgress + '%' }) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "progress-text" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "loading-spinner" }));
    (__VLS_ctx.uploadProgress.toFixed(0));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "action-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "section-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "action-buttons" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleImport) }, { disabled: (!__VLS_ctx.selectedFile || __VLS_ctx.importing || !__VLS_ctx.isFileValid) }), { class: (['action-btn', 'primary', { 'loading': __VLS_ctx.importing }]) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "btn-text" }));
(__VLS_ctx.importing ? '正在导入...' : '开始导入教师');
if (__VLS_ctx.mobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closeMobileMenu) }, { class: "mobile-overlay" }));
}
var __VLS_6 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    name: "tip-fade",
}));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
        name: "tip-fade",
    }], __VLS_functionalComponentArgsRest(__VLS_7), false));
__VLS_9.slots.default;
if (__VLS_ctx.showQuickTip) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "quick-tip" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "tip-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.quickTipMessage);
}
var __VLS_9;
/** @type {__VLS_StyleScopedClasses['admin-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['create-teacher']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-description']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['template-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['template-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['drag-over']} */ ;
/** @type {__VLS_StyleScopedClasses['has-file']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-details']} */ ;
/** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-size']} */ ;
/** @type {__VLS_StyleScopedClasses['file-status']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-file-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-content']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            PageHeader: PageHeader_vue_1.default,
            SideBar: SideBar_vue_1.default,
            username: username,
            mobileMenuOpen: mobileMenuOpen,
            downloading: downloading,
            importing: importing,
            selectedFile: selectedFile,
            fileInput: fileInput,
            isDragOver: isDragOver,
            uploadProgress: uploadProgress,
            showQuickTip: showQuickTip,
            quickTipMessage: quickTipMessage,
            adminMenuItems: adminMenuItems,
            isFileValid: isFileValid,
            handleLogout: handleLogout,
            closeMobileMenu: closeMobileMenu,
            handleDownloadTemplate: handleDownloadTemplate,
            onFileChange: onFileChange,
            handleDrop: handleDrop,
            handleDragOver: handleDragOver,
            handleDragLeave: handleDragLeave,
            handleDragEnter: handleDragEnter,
            removeFile: removeFile,
            formatFileSize: formatFileSize,
            handleImport: handleImport,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
