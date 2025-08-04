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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var document_th_1 = require("@/api/teacher/document_th");
var router = (0, vue_router_1.useRouter)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '教师');
var teacherMenuItems = [
    { path: '/teacher/course', label: '课程管理' },
    { path: '/teacher/chat', label: '教学助手' },
    { path: '/teacher/exercise_generate', label: '习题生成' },
    { path: '/teacher/ppt/generate', label: 'PPT生成' },
    { path: '/teacher/profile', label: '个人信息' },
];
// 状态管理
var loading = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)('');
var uploading = (0, vue_1.ref)(false);
var documents = (0, vue_1.ref)([]);
var filteredDocuments = (0, vue_1.ref)([]);
var selectedDocuments = (0, vue_1.ref)(new Set());
// 搜索和筛选
var searchKeyword = (0, vue_1.ref)('');
var sortBy = (0, vue_1.ref)('date');
var searchTimer = null;
// 文件上传
var fileInput = (0, vue_1.ref)();
var showUploadDialog = (0, vue_1.ref)(false);
var selectedFile = (0, vue_1.ref)(null);
var uploadTitle = (0, vue_1.ref)('');
// 计算属性
var getTotalChunks = function () {
    return documents.value.reduce(function (sum, doc) { return sum + doc.chunk_count; }, 0);
};
var getTotalSize = function () {
    var totalBytes = documents.value.reduce(function (sum, doc) { return sum + doc.file_size; }, 0);
    return formatFileSize(totalBytes);
};
var canUpload = (0, vue_1.computed)(function () {
    return selectedFile.value && uploadTitle.value.trim().length > 0;
});
// 工具函数
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
var formatDate = function (dateString) {
    return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
var getFileExtension = function (filename) {
    var _a;
    return ((_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'FILE';
};
var getFileColor = function (filename) {
    var _a;
    var ext = (_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    switch (ext) {
        case 'txt': return '#4a5568';
        case 'docx': return '#2b6cb0';
        default: return '#718096';
    }
};
// 数据操作
var loadDocuments = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                loading.value = true;
                error.value = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = documents;
                return [4 /*yield*/, (0, document_th_1.getDocumentList)()];
            case 2:
                _a.value = _b.sent();
                filterDocuments();
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error('获取文档失败:', err_1);
                error.value = err_1.message;
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var filterDocuments = function () {
    var filtered = __spreadArray([], documents.value, true);
    // 排序
    filtered.sort(function (a, b) {
        switch (sortBy.value) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'size':
                return b.file_size - a.file_size;
            case 'date':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });
    filteredDocuments.value = filtered;
};
var handleSearch = function () {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
        var results, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!searchKeyword.value.trim()) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    loading.value = true;
                    return [4 /*yield*/, (0, document_th_1.searchDocuments)(searchKeyword.value.trim())];
                case 2:
                    results = _a.sent();
                    filteredDocuments.value = results;
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error('搜索失败:', err_2);
                    error.value = err_2.message;
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    filterDocuments();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); }, 500);
};
var clearSearch = function () {
    searchKeyword.value = '';
    filterDocuments();
};
// 文件操作
var triggerUpload = function () {
    var _a;
    (_a = fileInput.value) === null || _a === void 0 ? void 0 : _a.click();
};
var handleFileUpload = function (event) {
    var _a;
    var target = event.target;
    var files = target.files;
    if (!files || files.length === 0)
        return;
    var file = files[0];
    var allowedTypes = ['.txt', '.docx'];
    var fileExt = '.' + ((_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase());
    if (!allowedTypes.includes(fileExt)) {
        alert('不支持的文件格式，请选择 .txt 或 .docx 文件');
        target.value = '';
        return;
    }
    if (file.size > 500 * 1024 * 1024) {
        alert('文件大小不能超过 500MB');
        target.value = '';
        return;
    }
    selectedFile.value = file;
    uploadTitle.value = file.name.replace(/\.[^/.]+$/, '');
    showUploadDialog.value = true;
    target.value = '';
};
var closeUploadDialog = function () {
    showUploadDialog.value = false;
    selectedFile.value = null;
    uploadTitle.value = '';
};
var confirmUpload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!selectedFile.value || !uploadTitle.value.trim())
                    return [2 /*return*/];
                uploading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                return [4 /*yield*/, (0, document_th_1.uploadDocument)(selectedFile.value, uploadTitle.value.trim())];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, loadDocuments()];
            case 3:
                _a.sent();
                closeUploadDialog();
                alert("\u4E0A\u4F20\u6210\u529F\uFF01\u6587\u6863\u5DF2\u5904\u7406\u4E3A ".concat(result.chunk_count, " \u4E2A\u7247\u6BB5"));
                return [3 /*break*/, 6];
            case 4:
                err_3 = _a.sent();
                console.error('上传失败:', err_3);
                alert('上传失败：' + err_3.message);
                return [3 /*break*/, 6];
            case 5:
                uploading.value = false;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
var selectDocument = function (doc) {
    if (selectedDocuments.value.has(doc.document_id)) {
        selectedDocuments.value.delete(doc.document_id);
    }
    else {
        selectedDocuments.value.add(doc.document_id);
    }
};
var deleteDocument = function (doc) { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u6587\u6863 \"".concat(doc.title, "\" \u5417\uFF1F\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\u3002")))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, document_th_1.deleteDocument)(doc.document_id)];
            case 2:
                _a.sent();
                return [4 /*yield*/, loadDocuments()];
            case 3:
                _a.sent();
                selectedDocuments.value.delete(doc.document_id);
                alert('删除成功');
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                console.error('删除失败:', err_4);
                alert('删除失败：' + err_4.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 批量操作
var batchDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
    var deletePromises, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (selectedDocuments.value.size === 0)
                    return [2 /*return*/];
                if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u9009\u4E2D\u7684 ".concat(selectedDocuments.value.size, " \u4E2A\u6587\u6863\u5417\uFF1F\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\u3002")))
                    return [2 /*return*/];
                deletePromises = Array.from(selectedDocuments.value).map(function (id) {
                    return (0, document_th_1.deleteDocument)(id);
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 6]);
                return [4 /*yield*/, Promise.all(deletePromises)];
            case 2:
                _a.sent();
                return [4 /*yield*/, loadDocuments()];
            case 3:
                _a.sent();
                clearSelection();
                alert('批量删除成功');
                return [3 /*break*/, 6];
            case 4:
                err_5 = _a.sent();
                console.error('批量删除失败:', err_5);
                alert('批量删除失败：' + err_5.message);
                return [4 /*yield*/, loadDocuments()];
            case 5:
                _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var clearSelection = function () {
    selectedDocuments.value.clear();
};
// 导航
var goBack = function () {
    router.push('/teacher/exercise_generate');
};
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
(0, vue_1.onMounted)(function () {
    loadDocuments();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['document-item']} */ ;
/** @type {__VLS_StyleScopedClasses['document-item']} */ ;
/** @type {__VLS_StyleScopedClasses['document-info']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['document-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-dialog']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teacher-layout" }));
/** @type {[typeof Sidebar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default({
    menuItems: (__VLS_ctx.teacherMenuItems),
    activeItem: ('/teacher/exercise_generate'),
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        menuItems: (__VLS_ctx.teacherMenuItems),
        activeItem: ('/teacher/exercise_generate'),
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main" }));
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
var __VLS_3 = __VLS_asFunctionalComponent(PageHeader_vue_1.default, new PageHeader_vue_1.default({
    title: "文档管理",
}));
var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{
        title: "文档管理",
    }], __VLS_functionalComponentArgsRest(__VLS_3), false));
__VLS_5.slots.default;
{
    var __VLS_thisSlot = __VLS_5.slots.actions;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-user" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goBack) }, { class: "back-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "logout-btn" }));
}
var __VLS_5;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "document-dashboard" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dashboard-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.triggerUpload) }, { disabled: (__VLS_ctx.uploading) }), { class: "upload-btn" }));
(__VLS_ctx.uploading ? '上传中...' : '上传文档');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stats-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stats-grid" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.documents.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.getTotalChunks());
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.getTotalSize());
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stat-label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onInput: (__VLS_ctx.handleSearch) }, { value: (__VLS_ctx.searchKeyword), placeholder: "搜索文档标题或文件名", type: "text" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ onChange: (__VLS_ctx.filterDocuments) }, { value: (__VLS_ctx.sortBy) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "date",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "name",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "size",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.clearSearch) }, { class: "upload-btn secondary" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "document-section" }));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "loading" }));
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "error-state" }));
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.loadDocuments) }, { class: "retry-btn" }));
}
else if (__VLS_ctx.filteredDocuments.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.triggerUpload) }, { class: "upload-btn" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "document-list" }));
    var _loop_1 = function (doc) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.error))
                    return;
                if (!!(__VLS_ctx.filteredDocuments.length === 0))
                    return;
                __VLS_ctx.selectDocument(doc);
            } }, { key: (doc.document_id) }), { class: (['document-item', { selected: __VLS_ctx.selectedDocuments.has(doc.document_id) }]) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "document-icon" }, { style: ({ background: __VLS_ctx.getFileColor(doc.filename) }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "file-type" }));
        (__VLS_ctx.getFileExtension(doc.filename));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "document-info" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        (doc.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "document-meta" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (doc.filename);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (doc.chunk_count);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.formatFileSize(doc.file_size));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.formatDate(doc.created_at));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "document-actions" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.error))
                    return;
                if (!!(__VLS_ctx.filteredDocuments.length === 0))
                    return;
                __VLS_ctx.deleteDocument(doc);
            } }, { class: "action-btn delete" }), { title: "删除" }));
    };
    for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.filteredDocuments)); _i < _b.length; _i++) {
        var doc = _b[_i][0];
        _loop_1(doc);
    }
}
if (__VLS_ctx.selectedDocuments.size > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "batch-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.selectedDocuments.size);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "batch-buttons" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.batchDelete) }, { class: "batch-btn delete" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.clearSelection) }, { class: "batch-btn" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileUpload) }, { ref: "fileInput", type: "file", accept: ".txt,.docx" }), { style: {} }));
/** @type {typeof __VLS_ctx.fileInput} */ ;
if (__VLS_ctx.showUploadDialog) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closeUploadDialog) }, { class: "upload-dialog-overlay" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "upload-dialog" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dialog-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeUploadDialog) }, { class: "close-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dialog-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-info" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_a = __VLS_ctx.selectedFile) === null || _a === void 0 ? void 0 : _a.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "file-size" }));
    (__VLS_ctx.selectedFile ? __VLS_ctx.formatFileSize(__VLS_ctx.selectedFile.size) : '');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ value: (__VLS_ctx.uploadTitle), type: "text", placeholder: "请输入文档标题" }, { class: "form-input" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-tips" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dialog-footer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeUploadDialog) }, { class: "cancel-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.confirmUpload) }, { disabled: (!__VLS_ctx.canUpload || __VLS_ctx.uploading) }), { class: "upload-btn" }));
    (__VLS_ctx.uploading ? '上传中...' : '确认上传');
}
/** @type {__VLS_StyleScopedClasses['teacher-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['document-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-section']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['document-section']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['document-list']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['document-item']} */ ;
/** @type {__VLS_StyleScopedClasses['document-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-type']} */ ;
/** @type {__VLS_StyleScopedClasses['document-info']} */ ;
/** @type {__VLS_StyleScopedClasses['document-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['document-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-size']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            Sidebar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            username: username,
            teacherMenuItems: teacherMenuItems,
            loading: loading,
            error: error,
            uploading: uploading,
            documents: documents,
            filteredDocuments: filteredDocuments,
            selectedDocuments: selectedDocuments,
            searchKeyword: searchKeyword,
            sortBy: sortBy,
            fileInput: fileInput,
            showUploadDialog: showUploadDialog,
            selectedFile: selectedFile,
            uploadTitle: uploadTitle,
            getTotalChunks: getTotalChunks,
            getTotalSize: getTotalSize,
            canUpload: canUpload,
            formatFileSize: formatFileSize,
            formatDate: formatDate,
            getFileExtension: getFileExtension,
            getFileColor: getFileColor,
            loadDocuments: loadDocuments,
            filterDocuments: filterDocuments,
            handleSearch: handleSearch,
            clearSearch: clearSearch,
            triggerUpload: triggerUpload,
            handleFileUpload: handleFileUpload,
            closeUploadDialog: closeUploadDialog,
            confirmUpload: confirmUpload,
            selectDocument: selectDocument,
            deleteDocument: deleteDocument,
            batchDelete: batchDelete,
            clearSelection: clearSelection,
            goBack: goBack,
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
