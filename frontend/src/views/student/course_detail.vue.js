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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var course_detail_stu_1 = require("@/api/student/course_detail_stu");
var router = (0, vue_router_1.useRouter)();
var route = (0, vue_router_1.useRoute)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '学生');
var studentMenuItems = [
    { path: '/student/course', label: '我的课程' },
    { path: '/student/chat', label: '学习助手' },
    { path: '/student/exercise_generate', label: '习题生成' },
    { path: '/student/profile', label: '个人信息' },
];
var courseId = (0, vue_1.computed)(function () { return parseInt(route.params.courseId); });
// 数据状态
var loading = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)('');
var courseDetail = (0, vue_1.ref)(null);
// 通知相关状态
var notificationLoading = (0, vue_1.ref)(false);
var notificationError = (0, vue_1.ref)('');
var notificationData = (0, vue_1.ref)(null);
var notifications = (0, vue_1.ref)([]);
var currentPage = (0, vue_1.ref)(1);
var pageSize = (0, vue_1.ref)(20);
// 资料相关状态
var materialLoading = (0, vue_1.ref)(false);
var materialError = (0, vue_1.ref)('');
var materialData = (0, vue_1.ref)(null);
var materials = (0, vue_1.ref)([]);
// 下载状态
var downloadingFiles = (0, vue_1.ref)(new Set());
// 通知详情弹框状态
var showNotificationModal = (0, vue_1.ref)(false);
var selectedNotificationId = (0, vue_1.ref)(null);
var notificationDetail = (0, vue_1.ref)(null);
var notificationDetailLoading = (0, vue_1.ref)(false);
var notificationDetailError = (0, vue_1.ref)('');
var confirming = (0, vue_1.ref)(false);
// 格式化日期
var formatDate = function (dateString) {
    if (!dateString)
        return '';
    return new Date(dateString).toLocaleDateString('zh-CN');
};
// 下载文件
var downloadFile = function (fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                downloadingFiles.value.add(fileName);
                return [4 /*yield*/, (0, course_detail_stu_1.downloadCourseMaterial)(courseId.value, fileName)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                err_1 = _a.sent();
                alert("\u4E0B\u8F7D\u5931\u8D25: ".concat(err_1.message));
                return [3 /*break*/, 4];
            case 3:
                downloadingFiles.value.delete(fileName);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 打开通知详情
var openNotificationDetail = function (notificationId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                selectedNotificationId.value = notificationId;
                showNotificationModal.value = true;
                return [4 /*yield*/, loadNotificationDetail(notificationId)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 关闭通知详情
var closeNotificationDetail = function () {
    showNotificationModal.value = false;
    selectedNotificationId.value = null;
    notificationDetail.value = null;
    notificationDetailError.value = '';
};
// 加载通知详情
var loadNotificationDetail = function (notificationId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                notificationDetailLoading.value = true;
                notificationDetailError.value = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = notificationDetail;
                return [4 /*yield*/, (0, course_detail_stu_1.getNotificationDetail)(notificationId)];
            case 2:
                _a.value = _b.sent();
                return [3 /*break*/, 5];
            case 3:
                err_2 = _b.sent();
                notificationDetailError.value = err_2.message;
                return [3 /*break*/, 5];
            case 4:
                notificationDetailLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 确认通知
var handleConfirmNotification = function () { return __awaiter(void 0, void 0, void 0, function () {
    var notificationIndex, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!notificationDetail.value || confirming.value)
                    return [2 /*return*/];
                confirming.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, course_detail_stu_1.confirmNotification)(notificationDetail.value.id)];
            case 2:
                _a.sent();
                notificationDetail.value.is_confirmed = true;
                notificationIndex = notifications.value.findIndex(function (n) { var _a; return n.id === ((_a = notificationDetail.value) === null || _a === void 0 ? void 0 : _a.id); });
                if (notificationIndex !== -1) {
                    notifications.value[notificationIndex].is_confirmed = true;
                }
                alert('通知确认成功！');
                return [3 /*break*/, 5];
            case 3:
                err_3 = _a.sent();
                alert("\u786E\u8BA4\u5931\u8D25: ".concat(err_3.message));
                return [3 /*break*/, 5];
            case 4:
                confirming.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 加载课程详情
var loadCourseDetail = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = courseDetail;
                return [4 /*yield*/, (0, course_detail_stu_1.getCourseDetail)(courseId.value)];
            case 1:
                _a.value = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                throw new Error("\u83B7\u53D6\u8BFE\u7A0B\u8BE6\u60C5\u5931\u8D25: ".concat(err_4.message));
            case 3: return [2 /*return*/];
        }
    });
}); };
// 加载通知
var loadNotifications = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (page) {
        var _a, err_5;
        if (page === void 0) { page = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notificationLoading.value = true;
                    notificationError.value = '';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    _a = notificationData;
                    return [4 /*yield*/, (0, course_detail_stu_1.getCourseNotifications)(courseId.value, page, pageSize.value)];
                case 2:
                    _a.value = _b.sent();
                    notifications.value = notificationData.value.notifications;
                    currentPage.value = page;
                    return [3 /*break*/, 5];
                case 3:
                    err_5 = _b.sent();
                    notificationError.value = err_5.message;
                    return [3 /*break*/, 5];
                case 4:
                    notificationLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
};
// 加载资料
var loadMaterials = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                materialLoading.value = true;
                materialError.value = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = materialData;
                return [4 /*yield*/, (0, course_detail_stu_1.getCourseMaterials)(courseId.value)];
            case 2:
                _a.value = _b.sent();
                materials.value = materialData.value.materials;
                return [3 /*break*/, 5];
            case 3:
                err_6 = _b.sent();
                materialError.value = err_6.message;
                return [3 /*break*/, 5];
            case 4:
                materialLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 加载所有数据
var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loading.value = true;
                error.value = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, Promise.all([
                        loadCourseDetail(),
                        loadNotifications(),
                        loadMaterials()
                    ])];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                err_7 = _a.sent();
                error.value = err_7.message;
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var goBack = function () {
    router.push('/student/course');
};
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
(0, vue_1.onMounted)(function () {
    loadData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['course-info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['description']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-error']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['important']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['normal']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-info']} */ ;
/** @type {__VLS_StyleScopedClasses['download-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-error']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['important']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['normal']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmed']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-status']} */ ;
/** @type {__VLS_StyleScopedClasses['unconfirmed']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['course-info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-section']} */ ;
/** @type {__VLS_StyleScopedClasses['material-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "student-layout" }));
/** @type {[typeof Sidebar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default({
    menuItems: (__VLS_ctx.studentMenuItems),
    activeItem: ('/student/course'),
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        menuItems: (__VLS_ctx.studentMenuItems),
        activeItem: ('/student/course'),
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main" }));
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
var __VLS_3 = __VLS_asFunctionalComponent(PageHeader_vue_1.default, new PageHeader_vue_1.default({
    title: "课程详情",
}));
var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{
        title: "课程详情",
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
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "loading" }));
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "error-state" }));
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.loadData) }, { class: "retry-btn" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "course-detail-container" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "course-info-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    ((_a = __VLS_ctx.courseDetail) === null || _a === void 0 ? void 0 : _a.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-grid" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_b = __VLS_ctx.courseDetail) === null || _b === void 0 ? void 0 : _b.teacher_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_c = __VLS_ctx.courseDetail) === null || _c === void 0 ? void 0 : _c.semester);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_d = __VLS_ctx.courseDetail) === null || _d === void 0 ? void 0 : _d.credit);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatDate((_e = __VLS_ctx.courseDetail) === null || _e === void 0 ? void 0 : _e.start_date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatDate((_f = __VLS_ctx.courseDetail) === null || _f === void 0 ? void 0 : _f.end_date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "description" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    ((_g = __VLS_ctx.courseDetail) === null || _g === void 0 ? void 0 : _g.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-stats" }));
    (((_h = __VLS_ctx.notificationData) === null || _h === void 0 ? void 0 : _h.total_count) || 0);
    if (__VLS_ctx.notificationLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-loading" }));
    }
    else if (__VLS_ctx.notificationError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-error" }));
        (__VLS_ctx.notificationError);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (function () { return __VLS_ctx.loadNotifications(); }) }, { class: "retry-btn" }));
    }
    else if (__VLS_ctx.notifications.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-list" }));
        var _loop_1 = function (notification) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.notificationLoading))
                        return;
                    if (!!(__VLS_ctx.notificationError))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
                        return;
                    __VLS_ctx.openNotificationDetail(notification.id);
                } }, { key: (notification.id) }), { class: "notification-item" }), { class: (__VLS_ctx.getPriorityClass(notification.priority)) }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-header" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
            (notification.title);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-meta" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "priority" }));
            (__VLS_ctx.getPriorityText(notification.priority));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "time" }));
            (__VLS_ctx.formatDateTime(notification.publish_time));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-content" }));
            (notification.content);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-footer" }));
            if (notification.require_confirmation) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "confirmation" }));
                if (notification.is_confirmed) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "confirmed" }));
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "unconfirmed" }));
                }
            }
        };
        for (var _i = 0, _k = __VLS_getVForSourceType((__VLS_ctx.notifications)); _i < _k.length; _i++) {
            var notification = _k[_i][0];
            _loop_1(notification);
        }
    }
    if (__VLS_ctx.notificationData && __VLS_ctx.notificationData.total_pages > 1) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pagination" }));
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
                if (!(__VLS_ctx.notificationData && __VLS_ctx.notificationData.total_pages > 1))
                    return;
                __VLS_ctx.loadNotifications(__VLS_ctx.currentPage - 1);
            } }, { disabled: (__VLS_ctx.currentPage <= 1) }), { class: "page-btn" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "page-info" }));
        (__VLS_ctx.currentPage);
        (__VLS_ctx.notificationData.total_pages);
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
                if (!(__VLS_ctx.notificationData && __VLS_ctx.notificationData.total_pages > 1))
                    return;
                __VLS_ctx.loadNotifications(__VLS_ctx.currentPage + 1);
            } }, { disabled: (__VLS_ctx.currentPage >= __VLS_ctx.notificationData.total_pages) }), { class: "page-btn" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-stats" }));
    (((_j = __VLS_ctx.materialData) === null || _j === void 0 ? void 0 : _j.total) || 0);
    if (__VLS_ctx.materialLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-loading" }));
    }
    else if (__VLS_ctx.materialError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-error" }));
        (__VLS_ctx.materialError);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.loadMaterials) }, { class: "retry-btn" }));
    }
    else if (__VLS_ctx.materials.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-list" }));
        var _loop_2 = function (material) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (material.file_name) }, { class: "material-item" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-icon" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-info" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
            (material.file_name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-meta" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (material.uploader_name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatDateTime(material.upload_time));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-actions" }));
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
                    if (!!(__VLS_ctx.materialLoading))
                        return;
                    if (!!(__VLS_ctx.materialError))
                        return;
                    if (!!(__VLS_ctx.materials.length === 0))
                        return;
                    __VLS_ctx.downloadFile(material.file_name);
                } }, { class: "download-btn" }), { disabled: (__VLS_ctx.downloadingFiles.has(material.file_name)) }));
            (__VLS_ctx.downloadingFiles.has(material.file_name) ? '下载中...' : '下载');
        };
        for (var _l = 0, _m = __VLS_getVForSourceType((__VLS_ctx.materials)); _l < _m.length; _l++) {
            var material = _m[_l][0];
            _loop_2(material);
        }
    }
}
if (__VLS_ctx.showNotificationModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closeNotificationDetail) }, { class: "modal-overlay" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "modal-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeNotificationDetail) }, { class: "close-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-body" }));
    if (__VLS_ctx.notificationDetailLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-loading" }));
    }
    else if (__VLS_ctx.notificationDetailError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-error" }));
        (__VLS_ctx.notificationDetailError);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.showNotificationModal))
                    return;
                if (!!(__VLS_ctx.notificationDetailLoading))
                    return;
                if (!(__VLS_ctx.notificationDetailError))
                    return;
                __VLS_ctx.loadNotificationDetail(__VLS_ctx.selectedNotificationId);
            } }, { class: "retry-btn" }));
    }
    else if (__VLS_ctx.notificationDetail) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-detail" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "detail-header" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        (__VLS_ctx.notificationDetail.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "detail-meta" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "priority" }, { class: (__VLS_ctx.getPriorityClass(__VLS_ctx.notificationDetail.priority)) }));
        (__VLS_ctx.getPriorityText(__VLS_ctx.notificationDetail.priority));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "course" }));
        (__VLS_ctx.notificationDetail.course_name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "teacher" }));
        (__VLS_ctx.notificationDetail.teacher_name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "time" }));
        (__VLS_ctx.formatDateTime(__VLS_ctx.notificationDetail.publish_time));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "detail-content" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.notificationDetail.content);
        if (__VLS_ctx.notificationDetail.require_confirmation) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirmation-section" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirmation-status" }));
            if (__VLS_ctx.notificationDetail.is_confirmed) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "confirmed" }));
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "unconfirmed" }));
            }
            if (!__VLS_ctx.notificationDetail.is_confirmed) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleConfirmNotification) }, { class: "confirm-btn" }), { disabled: (__VLS_ctx.confirming) }));
                (__VLS_ctx.confirming ? '确认中...' : '确认通知');
            }
        }
    }
}
/** @type {__VLS_StyleScopedClasses['student-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['course-detail-container']} */ ;
/** @type {__VLS_StyleScopedClasses['course-info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['description']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['section-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['section-error']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-list']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-content']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmed']} */ ;
/** @type {__VLS_StyleScopedClasses['unconfirmed']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-info']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['section-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['section-error']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['material-list']} */ ;
/** @type {__VLS_StyleScopedClasses['material-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['material-info']} */ ;
/** @type {__VLS_StyleScopedClasses['material-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['material-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['download-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-error']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['course']} */ ;
/** @type {__VLS_StyleScopedClasses['teacher']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-section']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-status']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmed']} */ ;
/** @type {__VLS_StyleScopedClasses['unconfirmed']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-btn']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            Sidebar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            formatDateTime: course_detail_stu_1.formatDateTime,
            getPriorityText: course_detail_stu_1.getPriorityText,
            getPriorityClass: course_detail_stu_1.getPriorityClass,
            username: username,
            studentMenuItems: studentMenuItems,
            loading: loading,
            error: error,
            courseDetail: courseDetail,
            notificationLoading: notificationLoading,
            notificationError: notificationError,
            notificationData: notificationData,
            notifications: notifications,
            currentPage: currentPage,
            materialLoading: materialLoading,
            materialError: materialError,
            materialData: materialData,
            materials: materials,
            downloadingFiles: downloadingFiles,
            showNotificationModal: showNotificationModal,
            selectedNotificationId: selectedNotificationId,
            notificationDetail: notificationDetail,
            notificationDetailLoading: notificationDetailLoading,
            notificationDetailError: notificationDetailError,
            confirming: confirming,
            formatDate: formatDate,
            downloadFile: downloadFile,
            openNotificationDetail: openNotificationDetail,
            closeNotificationDetail: closeNotificationDetail,
            loadNotificationDetail: loadNotificationDetail,
            handleConfirmNotification: handleConfirmNotification,
            loadNotifications: loadNotifications,
            loadMaterials: loadMaterials,
            loadData: loadData,
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
