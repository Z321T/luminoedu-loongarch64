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
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var marked_1 = require("marked");
var generate_th_1 = require("@/api/teacher/generate_th");
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
var generating = (0, vue_1.ref)(false);
var loading = (0, vue_1.ref)(false);
var loadingList = (0, vue_1.ref)(false);
var loadingPreview = (0, vue_1.ref)(false);
var listError = (0, vue_1.ref)('');
var previewError = (0, vue_1.ref)('');
// 表单显示
var showForm = (0, vue_1.ref)(false);
// 生成表单数据
var generateMode = (0, vue_1.ref)('document');
var selectedDocumentId = (0, vue_1.ref)('');
var customContent = (0, vue_1.ref)('');
var exerciseTitle = (0, vue_1.ref)('');
var exerciseCount = (0, vue_1.ref)(5);
var selectedTypes = (0, vue_1.ref)([1]);
var useKnowledgeMatching = (0, vue_1.ref)(true);
// 文档列表
var documents = (0, vue_1.ref)([]);
// 习题列表
var exercises = (0, vue_1.ref)([]);
var titleFilter = (0, vue_1.ref)('');
var filteredExercises = (0, vue_1.ref)([]);
// 预览
var showPreview = (0, vue_1.ref)(false);
var previewTitle = (0, vue_1.ref)('');
var previewContent = (0, vue_1.ref)('');
var currentPreviewFile = (0, vue_1.ref)(null);
// 计算属性
var canGenerate = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d;
    if (!((_a = exerciseTitle.value) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = customContent.value) === null || _b === void 0 ? void 0 : _b.trim()) || !((_c = selectedTypes.value) === null || _c === void 0 ? void 0 : _c.length) || exerciseCount.value < 1 || exerciseCount.value > 50) {
        return false;
    }
    if (generateMode.value === 'document') {
        return !!((_d = selectedDocumentId.value) === null || _d === void 0 ? void 0 : _d.trim());
    }
    return true;
});
var renderedPreview = (0, vue_1.computed)(function () {
    return previewContent.value ? (0, marked_1.marked)(previewContent.value) : '';
});
// 工具函数
var formatDate = function (dateString) {
    return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
};
var getExerciseTitle = function (filename) {
    var parts = filename.split('_');
    return parts.length >= 4 ? parts.slice(3).join('_').replace('.md', '') : filename.replace('.md', '');
};
// 题目类型切换
var toggleType = function (type) {
    var index = selectedTypes.value.indexOf(type);
    if (index > -1) {
        selectedTypes.value.splice(index, 1);
    }
    else {
        selectedTypes.value.push(type);
    }
};
// API 调用
var loadDocuments = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                loading.value = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = documents;
                return [4 /*yield*/, (0, generate_th_1.getVectorizedDocuments)()];
            case 2:
                _a.value = _b.sent();
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                alert("\u52A0\u8F7D\u6587\u6863\u5217\u8868\u5931\u8D25\uFF1A".concat(err_1.message));
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var loadExerciseList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                loadingList.value = true;
                listError.value = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = exercises;
                return [4 /*yield*/, (0, generate_th_1.getExerciseList)()];
            case 2:
                _a.value = _b.sent();
                filterExercises();
                return [3 /*break*/, 5];
            case 3:
                err_2 = _b.sent();
                listError.value = err_2.message;
                return [3 /*break*/, 5];
            case 4:
                loadingList.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var filterExercises = function () {
    if (titleFilter.value.trim()) {
        filteredExercises.value = exercises.value.filter(function (ex) {
            return getExerciseTitle(ex.filename).toLowerCase().includes(titleFilter.value.toLowerCase());
        });
    }
    else {
        filteredExercises.value = __spreadArray([], exercises.value, true);
    }
};
// 表单操作
var showGenerateForm = function () {
    showForm.value = true;
    if (generateMode.value === 'document' && documents.value.length === 0) {
        loadDocuments();
    }
};
var hideGenerateForm = function () {
    showForm.value = false;
    resetForm();
};
var resetForm = function () {
    generateMode.value = 'document';
    selectedDocumentId.value = '';
    customContent.value = '';
    exerciseTitle.value = '';
    exerciseCount.value = 5;
    selectedTypes.value = [1];
    useKnowledgeMatching.value = true;
};
var confirmGenerate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var request, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!canGenerate.value) {
                    alert('请填写所有必填项！');
                    return [2 /*return*/];
                }
                generating.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                request = {
                    title: exerciseTitle.value.trim(),
                    content: customContent.value.trim(),
                    count: exerciseCount.value,
                    types: selectedTypes.value,
                    use_knowledge_matching: useKnowledgeMatching.value
                };
                if (generateMode.value === 'document') {
                    request.document_id = selectedDocumentId.value.trim();
                }
                return [4 /*yield*/, (0, generate_th_1.generateExercise)(request)];
            case 2:
                result = _a.sent();
                alert("\u751F\u6210\u6210\u529F\uFF01\u5171\u751F\u6210 ".concat(result.exercise_count, " \u9053\u9898\u76EE"));
                hideGenerateForm();
                return [4 /*yield*/, loadExerciseList()];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                err_3 = _a.sent();
                alert("\u751F\u6210\u5931\u8D25\uFF1A".concat(err_3.message || '未知错误'));
                return [3 /*break*/, 6];
            case 5:
                generating.value = false;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
// 习题操作
var handleFilter = function () {
    setTimeout(filterExercises, 300);
};
var clearFilter = function () {
    titleFilter.value = '';
    filterExercises();
};
var previewExercise = function (exercise) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                currentPreviewFile.value = exercise;
                previewTitle.value = getExerciseTitle(exercise.filename);
                showPreview.value = true;
                loadingPreview.value = true;
                previewError.value = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = previewContent;
                return [4 /*yield*/, (0, generate_th_1.getFileContent)(exercise.filename)];
            case 2:
                _a.value = _b.sent();
                return [3 /*break*/, 5];
            case 3:
                err_4 = _b.sent();
                previewError.value = err_4.message;
                return [3 /*break*/, 5];
            case 4:
                loadingPreview.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var downloadExercise = function (exercise) { return __awaiter(void 0, void 0, void 0, function () {
    var blob, url, a, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, generate_th_1.downloadFile)(exercise.filename)];
            case 1:
                blob = _a.sent();
                url = window.URL.createObjectURL(blob);
                a = document.createElement('a');
                a.href = url;
                a.download = exercise.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                alert('下载失败：' + err_5.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var downloadCurrentPreview = function () {
    if (currentPreviewFile.value) {
        downloadExercise(currentPreviewFile.value);
    }
};
var deleteExercise = function (exercise) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u4E60\u9898 \"".concat(getExerciseTitle(exercise.filename), "\" \u5417\uFF1F")))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, generate_th_1.deleteExerciseFile)(exercise.filename)];
            case 2:
                _a.sent();
                alert('删除成功');
                return [4 /*yield*/, loadExerciseList()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_6 = _a.sent();
                alert('删除失败：' + err_6.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var closePreview = function () {
    showPreview.value = false;
    previewTitle.value = '';
    previewContent.value = '';
    currentPreviewFile.value = null;
};
// 导航
var goBack = function () {
    router.push('/teacher/exercise_generate');
};
// 导航与认证
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
// 监听器
(0, vue_1.watch)(generateMode, function (newMode) {
    if (newMode === 'document' && documents.value.length === 0) {
        loadDocuments();
    }
});
// 生命周期钩子
(0, vue_1.onMounted)(function () {
    loadExerciseList();
    if (generateMode.value === 'document') {
        loadDocuments();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-item']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-item']} */ ;
/** @type {__VLS_StyleScopedClasses['refresh-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-item']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-info']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['download-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-dialog-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-input']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-group']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
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
    title: "习题生成",
}));
var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{
        title: "习题生成",
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "generate-dashboard" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dashboard-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.showGenerateForm) }, { disabled: (__VLS_ctx.generating) }), { class: "generate-btn" }));
(__VLS_ctx.generating ? '生成中...' : '新建习题');
if (__VLS_ctx.showForm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "generate-form" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "radio-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "radio-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "radio",
        value: "document",
    });
    (__VLS_ctx.generateMode);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "radio-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "radio",
        value: "content",
    });
    (__VLS_ctx.generateMode);
    if (__VLS_ctx.generateMode === 'document') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "document-select",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.loadDocuments) }, { type: "button" }), { class: "refresh-btn" }), { disabled: (__VLS_ctx.loading) }));
        (__VLS_ctx.loading ? '加载中...' : '刷新');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ id: "document-select" }, { class: "form-select" }), { value: (__VLS_ctx.selectedDocumentId), disabled: (__VLS_ctx.loading || !__VLS_ctx.documents.length) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "",
        });
        for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.documents)); _i < _a.length; _i++) {
            var doc = _a[_i][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (doc.document_id),
                value: (doc.document_id),
            });
            (doc.title);
            (doc.filename);
        }
        if (__VLS_ctx.loading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ style: {} }));
        }
        else if (!__VLS_ctx.documents.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ style: {} }));
        }
        else if (__VLS_ctx.selectedDocumentId) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ style: {} }));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    if (__VLS_ctx.generateMode === 'document') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign(__assign({ value: (__VLS_ctx.customContent) }, { class: "form-textarea" }), { rows: (__VLS_ctx.generateMode === 'document' ? 2 : 6), placeholder: (__VLS_ctx.generateMode === 'document' ? '请输入习题相关的主题或关键词...' : '请输入用于生成习题的学习内容...') }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.exerciseTitle), type: "text" }, { class: "form-input" }), { placeholder: "请输入习题标题" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number", min: "1", max: "50" }, { class: "form-input" }));
    (__VLS_ctx.exerciseCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "checkbox-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "checkbox-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showForm))
                return;
            __VLS_ctx.toggleType(1);
        } }, { type: "checkbox", checked: (__VLS_ctx.selectedTypes.includes(1)) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "checkbox-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showForm))
                return;
            __VLS_ctx.toggleType(2);
        } }, { type: "checkbox", checked: (__VLS_ctx.selectedTypes.includes(2)) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "checkbox-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showForm))
                return;
            __VLS_ctx.toggleType(3);
        } }, { type: "checkbox", checked: (__VLS_ctx.selectedTypes.includes(3)) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "checkbox-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "checkbox",
    });
    (__VLS_ctx.useKnowledgeMatching);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.hideGenerateForm) }, { class: "cancel-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.confirmGenerate) }, { disabled: (!__VLS_ctx.canGenerate || __VLS_ctx.generating) }), { class: "generate-btn" }));
    (__VLS_ctx.generating ? '生成中...' : '开始生成');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "exercise-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onInput: (__VLS_ctx.handleFilter) }, { value: (__VLS_ctx.titleFilter), type: "text" }), { class: "filter-input" }), { placeholder: "搜索习题标题..." }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.clearFilter) }, { class: "clear-btn" }));
if (__VLS_ctx.loadingList) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "loading" }));
}
else if (__VLS_ctx.listError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "error-state" }));
    (__VLS_ctx.listError);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.loadExerciseList) }, { class: "retry-btn" }));
}
else if (__VLS_ctx.filteredExercises.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.showGenerateForm) }, { class: "generate-btn" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "exercise-list" }));
    var _loop_1 = function (exercise) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (exercise.filename) }, { class: "exercise-item" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "exercise-icon" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "exercise-info" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        (__VLS_ctx.getExerciseTitle(exercise.filename));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "exercise-meta" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.formatDate(exercise.created_at));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (exercise.size_kb);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "exercise-actions" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loadingList))
                    return;
                if (!!(__VLS_ctx.listError))
                    return;
                if (!!(__VLS_ctx.filteredExercises.length === 0))
                    return;
                __VLS_ctx.previewExercise(exercise);
            } }, { class: "action-btn" }), { title: "预览" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loadingList))
                    return;
                if (!!(__VLS_ctx.listError))
                    return;
                if (!!(__VLS_ctx.filteredExercises.length === 0))
                    return;
                __VLS_ctx.downloadExercise(exercise);
            } }, { class: "action-btn" }), { title: "下载" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loadingList))
                    return;
                if (!!(__VLS_ctx.listError))
                    return;
                if (!!(__VLS_ctx.filteredExercises.length === 0))
                    return;
                __VLS_ctx.deleteExercise(exercise);
            } }, { class: "action-btn delete" }), { title: "删除" }));
    };
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.filteredExercises)); _b < _c.length; _b++) {
        var exercise = _c[_b][0];
        _loop_1(exercise);
    }
}
if (__VLS_ctx.showPreview) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closePreview) }, { class: "preview-dialog-overlay" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "preview-dialog" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dialog-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (__VLS_ctx.previewTitle);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closePreview) }, { class: "close-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dialog-body" }));
    if (__VLS_ctx.loadingPreview) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "loading" }));
    }
    else if (__VLS_ctx.previewError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "error" }));
        (__VLS_ctx.previewError);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-content" }));
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.renderedPreview) }), null, null);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "dialog-footer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.downloadCurrentPreview) }, { class: "download-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closePreview) }, { class: "close-dialog-btn" }));
}
/** @type {__VLS_StyleScopedClasses['teacher-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-group']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-item']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['refresh-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-item']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-item']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-input']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-list']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-item']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-info']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['exercise-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-body']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['download-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-dialog-btn']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            Sidebar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            username: username,
            teacherMenuItems: teacherMenuItems,
            generating: generating,
            loading: loading,
            loadingList: loadingList,
            loadingPreview: loadingPreview,
            listError: listError,
            previewError: previewError,
            showForm: showForm,
            generateMode: generateMode,
            selectedDocumentId: selectedDocumentId,
            customContent: customContent,
            exerciseTitle: exerciseTitle,
            exerciseCount: exerciseCount,
            selectedTypes: selectedTypes,
            useKnowledgeMatching: useKnowledgeMatching,
            documents: documents,
            titleFilter: titleFilter,
            filteredExercises: filteredExercises,
            showPreview: showPreview,
            previewTitle: previewTitle,
            canGenerate: canGenerate,
            renderedPreview: renderedPreview,
            formatDate: formatDate,
            getExerciseTitle: getExerciseTitle,
            toggleType: toggleType,
            loadDocuments: loadDocuments,
            loadExerciseList: loadExerciseList,
            showGenerateForm: showGenerateForm,
            hideGenerateForm: hideGenerateForm,
            confirmGenerate: confirmGenerate,
            handleFilter: handleFilter,
            clearFilter: clearFilter,
            previewExercise: previewExercise,
            downloadExercise: downloadExercise,
            downloadCurrentPreview: downloadCurrentPreview,
            deleteExercise: deleteExercise,
            closePreview: closePreview,
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
