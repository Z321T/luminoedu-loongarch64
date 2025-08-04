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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var course_th_1 = require("@/api/teacher/course_th");
var course_detail_th_1 = require("@/api/teacher/course_detail_th");
var router = (0, vue_router_1.useRouter)();
var route = (0, vue_router_1.useRoute)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '教师');
var teacherMenuItems = [
    { path: '/teacher/course', label: '课程管理' },
    { path: '/teacher/chat', label: '教学助手' },
    { path: '/teacher/exercise_generate', label: '习题生成' },
    { path: '/teacher/ppt/generate', label: 'PPT生成' },
    { path: '/teacher/profile', label: '个人信息' },
];
// 修正：移除 computed 属性中的副作用
var courseId = (0, vue_1.computed)(function () { return parseInt(route.params.courseId); });
// 数据状态
var loading = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)('');
var courseDetail = (0, vue_1.ref)(null);
// 学生选择状态
var selectedStudents = (0, vue_1.ref)([]);
// 通知相关状态
var notificationLoading = (0, vue_1.ref)(false);
var notificationError = (0, vue_1.ref)('');
var notificationData = (0, vue_1.ref)(null);
var notifications = (0, vue_1.ref)([]);
var currentPage = (0, vue_1.ref)(1);
var pageSize = (0, vue_1.ref)(20);
var showCreateNotification = (0, vue_1.ref)(false);
var showNotificationDetail = (0, vue_1.ref)(false);
var selectedNotification = (0, vue_1.ref)(null);
var notificationForm = (0, vue_1.ref)({
    title: '',
    content: '',
    priority: 1,
    require_confirmation: false
});
var isEditMode = (0, vue_1.ref)(false);
var editNotificationId = (0, vue_1.ref)(null);
// 添加防重复点击状态
var editingNotificationId = (0, vue_1.ref)(null);
var viewingNotificationId = (0, vue_1.ref)(null);
// 资料相关状态
var materialLoading = (0, vue_1.ref)(false);
var materialError = (0, vue_1.ref)('');
var materials = (0, vue_1.ref)([]);
var materialUploading = (0, vue_1.ref)(false);
var downloadingFiles = (0, vue_1.ref)([]);
var fileInput = (0, vue_1.ref)(null);
// 新增：导入学生相关状态
var studentImporting = (0, vue_1.ref)(false);
var studentFileInput = (0, vue_1.ref)(null);
// 加载所有数据
var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (courseId.value === 0)
                    return [2 /*return*/];
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
                err_1 = _a.sent();
                console.error('加载数据失败:', err_1);
                error.value = err_1.message || '加载数据失败';
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 加载课程详情
var loadCourseDetail = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = courseDetail;
                return [4 /*yield*/, (0, course_detail_th_1.getTeacherCourseDetail)(courseId.value)];
            case 1:
                _a.value = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                throw new Error('加载课程详情失败: ' + err_2.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
// 加载通知列表
var loadNotifications = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (page) {
        var data, err_3;
        if (page === void 0) { page = 1; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notificationLoading.value = true;
                    notificationError.value = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, course_detail_th_1.getCourseNotifications)(courseId.value, page, pageSize.value)];
                case 2:
                    data = _a.sent();
                    notificationData.value = data;
                    notifications.value = data.notifications;
                    currentPage.value = page;
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    console.error('加载通知失败:', err_3);
                    notificationError.value = err_3.message || '加载通知失败';
                    return [3 /*break*/, 5];
                case 4:
                    notificationLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
};
// 加载资料列表
var loadMaterials = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                materialLoading.value = true;
                materialError.value = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, course_detail_th_1.getCourseMaterials)(courseId.value)];
            case 2:
                data = _a.sent();
                materials.value = data.materials;
                return [3 /*break*/, 5];
            case 3:
                err_4 = _a.sent();
                console.error('加载资料失败:', err_4);
                materialError.value = err_4.message || '加载资料失败';
                return [3 /*break*/, 5];
            case 4:
                materialLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 修改查看通知详情方法，添加防重复点击
var viewNotificationDetail = function (notification) { return __awaiter(void 0, void 0, void 0, function () {
    var detail, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 防止重复点击
                if (viewingNotificationId.value === notification.id) {
                    return [2 /*return*/];
                }
                viewingNotificationId.value = notification.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, course_detail_th_1.getNotificationDetail)(courseId.value, notification.id)];
            case 2:
                detail = _a.sent();
                selectedNotification.value = detail;
                showNotificationDetail.value = true;
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('获取通知详情失败:', error_1);
                alert('获取通知详情失败: ' + error_1.message);
                return [3 /*break*/, 5];
            case 4:
                // 延迟重置状态，防止快速点击
                setTimeout(function () {
                    viewingNotificationId.value = null;
                }, 500);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 显示创建通知对话框
var showCreateNotificationDialog = function () {
    isEditMode.value = false;
    editNotificationId.value = null;
    notificationForm.value = {
        title: '',
        content: '',
        priority: 1,
        require_confirmation: false
    };
    showCreateNotification.value = true;
};
// 修改编辑通知对话框方法，添加防重复点击
var showEditNotificationDialog = function (notification) { return __awaiter(void 0, void 0, void 0, function () {
    var detail, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 防止重复点击
                if (editingNotificationId.value === notification.id) {
                    return [2 /*return*/];
                }
                editingNotificationId.value = notification.id;
                isEditMode.value = true;
                editNotificationId.value = notification.id;
                // 先设置基本信息
                notificationForm.value = {
                    title: notification.title,
                    content: '', // 内容需要通过详情接口获取
                    priority: notification.priority,
                    require_confirmation: notification.require_confirmation
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, course_detail_th_1.getNotificationDetail)(courseId.value, notification.id)];
            case 2:
                detail = _a.sent();
                notificationForm.value.content = detail.content;
                showCreateNotification.value = true;
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.error('加载通知详情失败:', error_2);
                alert('加载通知详情失败: ' + error_2.message);
                return [3 /*break*/, 5];
            case 4:
                editingNotificationId.value = null;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 创建或更新通知
var handleCreateOrUpdateNotification = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!notificationForm.value.title.trim()) {
                    alert('请输入通知标题');
                    return [2 /*return*/];
                }
                if (!notificationForm.value.content.trim()) {
                    alert('请输入通知内容');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                if (!(isEditMode.value && editNotificationId.value)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, course_detail_th_1.updateNotification)(courseId.value, editNotificationId.value, notificationForm.value)];
            case 2:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 4];
                alert('通知更新成功');
                closeCreateNotification();
                return [4 /*yield*/, loadNotifications(currentPage.value)]; // 重新加载当前页
            case 3:
                _a.sent(); // 重新加载当前页
                _a.label = 4;
            case 4: return [3 /*break*/, 8];
            case 5: return [4 /*yield*/, (0, course_detail_th_1.createNotification)(courseId.value, notificationForm.value)];
            case 6:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 8];
                alert('通知创建成功');
                closeCreateNotification();
                return [4 /*yield*/, loadNotifications(1)]; // 加载第一页显示新通知
            case 7:
                _a.sent(); // 加载第一页显示新通知
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_3 = _a.sent();
                console.error(isEditMode.value ? '更新通知失败:' : '创建通知失败:', error_3);
                alert((isEditMode.value ? '更新通知失败: ' : '创建通知失败: ') + error_3.message);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
// 关闭对话框
var closeCreateNotification = function () {
    showCreateNotification.value = false;
    isEditMode.value = false;
    editNotificationId.value = null;
    notificationForm.value = {
        title: '',
        content: '',
        priority: 1,
        require_confirmation: false
    };
};
var closeNotificationDetail = function () {
    showNotificationDetail.value = false;
    selectedNotification.value = null;
};
// 学生管理相关方法
var toggleSelectAll = function (event) {
    var _a;
    var target = event.target;
    if (target.checked) {
        selectedStudents.value = ((_a = courseDetail.value) === null || _a === void 0 ? void 0 : _a.students.map(function (s) { return s.student_id; })) || [];
    }
    else {
        selectedStudents.value = [];
    }
};
// 新增：导入学生相关方法
var triggerStudentImport = function () {
    var _a;
    (_a = studentFileInput.value) === null || _a === void 0 ? void 0 : _a.click();
};
var handleStudentImport = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var target, files, file, maxSize, result, message, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                target = event.target;
                files = target.files;
                if (!files || files.length === 0)
                    return [2 /*return*/];
                file = files[0];
                // 验证文件类型
                if (!(0, course_detail_th_1.validateExcelFileType)(file)) {
                    alert('请选择Excel文件(.xlsx 或 .xls)');
                    target.value = '';
                    return [2 /*return*/];
                }
                maxSize = 10 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('文件大小不能超过10MB');
                    target.value = '';
                    return [2 /*return*/];
                }
                studentImporting.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 7, 8]);
                return [4 /*yield*/, (0, course_detail_th_1.importStudents)(courseId.value, file)];
            case 2:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 4];
                message = "\u5BFC\u5165\u5B8C\u6210\uFF01\n\u603B\u8BA1: ".concat(result.total, " \u6761\u8BB0\u5F55\n\u6210\u529F: ").concat(result.added, " \u6761");
                if (result.failed.length > 0) {
                    message += "\n\u5931\u8D25: ".concat(result.failed.length, " \u6761\n\u5931\u8D25\u539F\u56E0:\n").concat(result.failed.join('\n'));
                }
                alert(message);
                // 重新加载课程详情以更新学生列表
                return [4 /*yield*/, loadCourseDetail()];
            case 3:
                // 重新加载课程详情以更新学生列表
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                alert("\u5BFC\u5165\u5931\u8D25: ".concat(result.message));
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_4 = _a.sent();
                console.error('导入学生失败:', error_4);
                alert("\u5BFC\u5165\u5931\u8D25: ".concat(error_4.message));
                return [3 /*break*/, 8];
            case 7:
                studentImporting.value = false;
                target.value = '';
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
var handleDownloadStudentTemplate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, course_detail_th_1.downloadStudentTemplate)()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('下载模板失败:', error_5);
                alert("\u4E0B\u8F7D\u6A21\u677F\u5931\u8D25: ".concat(error_5.message));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var handleRemoveStudents = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (selectedStudents.value.length === 0)
                    return [2 /*return*/];
                if (!confirm("\u786E\u5B9A\u8981\u79FB\u9664\u9009\u4E2D\u7684 ".concat(selectedStudents.value.length, " \u540D\u5B66\u751F\u5417\uFF1F"))) {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, course_detail_th_1.removeStudentsFromCourse)(courseId.value, selectedStudents.value)];
            case 2:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 4];
                alert("\u6210\u529F\u79FB\u9664 ".concat(result.removed, " \u540D\u5B66\u751F"));
                selectedStudents.value = [];
                return [4 /*yield*/, loadCourseDetail()]; // 重新加载学生列表
            case 3:
                _a.sent(); // 重新加载学生列表
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.error('移除学生失败:', error_6);
                alert('移除学生失败: ' + error_6.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// 资料管理相关方法
var triggerFileUpload = function () {
    var _a;
    (_a = fileInput.value) === null || _a === void 0 ? void 0 : _a.click();
};
var handleFileUpload = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var target, files, fileArray, _i, fileArray_1, file, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                target = event.target;
                files = target.files;
                if (!files || files.length === 0)
                    return [2 /*return*/];
                fileArray = Array.from(files);
                _i = 0, fileArray_1 = fileArray;
                _a.label = 1;
            case 1:
                if (!(_i < fileArray_1.length)) return [3 /*break*/, 9];
                file = fileArray_1[_i];
                // 验证文件类型
                if (!(0, course_detail_th_1.validateFileType)(file)) {
                    alert("\u6587\u4EF6 ".concat(file.name, " \u7C7B\u578B\u4E0D\u652F\u6301"));
                    return [3 /*break*/, 8];
                }
                // 验证文件大小
                if (!(0, course_detail_th_1.validateFileSize)(file)) {
                    alert("\u6587\u4EF6 ".concat(file.name, " \u5927\u5C0F\u8D85\u8FC7 2GB \u9650\u5236"));
                    return [3 /*break*/, 8];
                }
                materialUploading.value = true;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, 7, 8]);
                return [4 /*yield*/, (0, course_detail_th_1.uploadMaterial)(courseId.value, file)];
            case 3:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 5];
                alert("\u6587\u4EF6 ".concat(result.filename, " \u4E0A\u4F20\u6210\u529F"));
                return [4 /*yield*/, loadMaterials()]; // 重新加载资料列表
            case 4:
                _a.sent(); // 重新加载资料列表
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_7 = _a.sent();
                console.error('上传失败:', error_7);
                alert("\u4E0A\u4F20\u6587\u4EF6 ".concat(file.name, " \u5931\u8D25: ").concat(error_7.message));
                return [3 /*break*/, 8];
            case 7:
                materialUploading.value = false;
                return [7 /*endfinally*/];
            case 8:
                _i++;
                return [3 /*break*/, 1];
            case 9:
                // 清空文件输入
                target.value = '';
                return [2 /*return*/];
        }
    });
}); };
var handleDownload = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (downloadingFiles.value.includes(filename))
                    return [2 /*return*/];
                downloadingFiles.value.push(filename);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, course_detail_th_1.downloadMaterial)(courseId.value, filename)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_8 = _a.sent();
                console.error('下载失败:', error_8);
                alert("\u4E0B\u8F7D\u6587\u4EF6\u5931\u8D25: ".concat(error_8.message));
                return [3 /*break*/, 5];
            case 4:
                downloadingFiles.value = downloadingFiles.value.filter(function (f) { return f !== filename; });
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleDeleteMaterial = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u6587\u4EF6 ".concat(filename, " \u5417\uFF1F"))) {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, course_detail_th_1.deleteMaterial)(courseId.value, filename)];
            case 2:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 4];
                alert('文件删除成功');
                return [4 /*yield*/, loadMaterials()]; // 重新加载资料列表
            case 3:
                _a.sent(); // 重新加载资料列表
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_9 = _a.sent();
                console.error('删除失败:', error_9);
                alert("\u5220\u9664\u6587\u4EF6\u5931\u8D25: ".concat(error_9.message));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// 导航相关方法
var goBack = function () {
    router.push('/teacher/course').then(function () {
    });
};
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
// 组件挂载时加载数据
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
/** @type {__VLS_StyleScopedClasses['remove-students-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-error']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
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
/** @type {__VLS_StyleScopedClasses['notification-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-info']} */ ;
/** @type {__VLS_StyleScopedClasses['download-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['download-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-material-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['create-notification-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-notification-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['import-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['import-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['student-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['student-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['import-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-notification-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['large-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['course-info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['students-section']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-section']} */ ;
/** @type {__VLS_StyleScopedClasses['material-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['student-actions']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teacher-layout" }));
/** @type {[typeof SideBar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default({
    menuItems: (__VLS_ctx.teacherMenuItems),
    activeItem: ('/teacher/course'),
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        menuItems: (__VLS_ctx.teacherMenuItems),
        activeItem: ('/teacher/course'),
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
else if (__VLS_ctx.courseDetail) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "course-detail-container" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "course-info-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    (__VLS_ctx.courseDetail.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-grid" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "value" }));
    (__VLS_ctx.courseDetail.semester);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "value" }));
    (__VLS_ctx.courseDetail.credit);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "value" }));
    (__VLS_ctx.formatDateTime(__VLS_ctx.courseDetail.start_date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "value" }));
    (__VLS_ctx.formatDateTime(__VLS_ctx.courseDetail.end_date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "description" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.courseDetail.description || '暂无描述');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-header-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "upload-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onChange: (__VLS_ctx.handleFileUpload) }, { ref: "fileInput", type: "file" }), { style: {} }), { multiple: true, accept: ".pdf,.doc,.docx,.txt,.md,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.tar,.gz,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov" }));
    /** @type {typeof __VLS_ctx.fileInput} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.triggerFileUpload) }, { disabled: (__VLS_ctx.materialUploading) }), { class: "upload-btn" }));
    (__VLS_ctx.materialUploading ? '上传中...' : '+ 上传资料');
    if (__VLS_ctx.materialLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-loading" }));
    }
    else if (__VLS_ctx.materialError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-error" }));
        (__VLS_ctx.materialError);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.error))
                    return;
                if (!(__VLS_ctx.courseDetail))
                    return;
                if (!!(__VLS_ctx.materialLoading))
                    return;
                if (!(__VLS_ctx.materialError))
                    return;
                __VLS_ctx.loadMaterials();
            } }, { class: "retry-btn" }));
    }
    else if (__VLS_ctx.materials.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-list" }));
        var _loop_1 = function (material) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-item" }, { key: (material.filename) }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-icon" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-info" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
            (material.filename);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "material-meta" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatFileSize(material.file_size));
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
                    if (!(__VLS_ctx.courseDetail))
                        return;
                    if (!!(__VLS_ctx.materialLoading))
                        return;
                    if (!!(__VLS_ctx.materialError))
                        return;
                    if (!!(__VLS_ctx.materials.length === 0))
                        return;
                    __VLS_ctx.handleDownload(material.filename);
                } }, { disabled: (__VLS_ctx.downloadingFiles.includes(material.filename)) }), { class: "download-btn" }));
            (__VLS_ctx.downloadingFiles.includes(material.filename) ? '下载中...' : '下载');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!(__VLS_ctx.courseDetail))
                        return;
                    if (!!(__VLS_ctx.materialLoading))
                        return;
                    if (!!(__VLS_ctx.materialError))
                        return;
                    if (!!(__VLS_ctx.materials.length === 0))
                        return;
                    __VLS_ctx.handleDeleteMaterial(material.filename);
                } }, { class: "delete-material-btn" }));
        };
        for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.materials)); _i < _c.length; _i++) {
            var material = _c[_i][0];
            _loop_1(material);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-header-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-stats" }));
    (((_a = __VLS_ctx.notificationData) === null || _a === void 0 ? void 0 : _a.total_count) || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.showCreateNotificationDialog) }, { class: "create-notification-btn" }));
    if (__VLS_ctx.notificationLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-loading" }));
    }
    else if (__VLS_ctx.notificationError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-error" }));
        (__VLS_ctx.notificationError);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.error))
                    return;
                if (!(__VLS_ctx.courseDetail))
                    return;
                if (!!(__VLS_ctx.notificationLoading))
                    return;
                if (!(__VLS_ctx.notificationError))
                    return;
                __VLS_ctx.loadNotifications();
            } }, { class: "retry-btn" }));
    }
    else if (__VLS_ctx.notifications.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-list" }));
        var _loop_2 = function (notification) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ class: "notification-item" }, { class: (__VLS_ctx.getPriorityClass(notification.priority)) }), { key: (notification.id) }));
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
                    if (!(__VLS_ctx.courseDetail))
                        return;
                    if (!!(__VLS_ctx.notificationLoading))
                        return;
                    if (!!(__VLS_ctx.notificationError))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
                        return;
                    __VLS_ctx.viewNotificationDetail(notification);
                } }, { class: "notification-main" }), { style: ({ cursor: 'pointer' }) }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-header" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
            (notification.title);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-meta" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "priority" }));
            (__VLS_ctx.getPriorityText(notification.priority));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "time" }));
            (__VLS_ctx.formatDateTime(notification.publish_time));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-stats" }));
            if (notification.require_confirmation) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "confirmation-stats" }));
                (notification.confirmed_students);
                (notification.total_students);
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "no-confirmation" }));
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-actions" }));
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
                    if (!(__VLS_ctx.courseDetail))
                        return;
                    if (!!(__VLS_ctx.notificationLoading))
                        return;
                    if (!!(__VLS_ctx.notificationError))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
                        return;
                    __VLS_ctx.showEditNotificationDialog(notification);
                } }, { class: "edit-notification-btn" }), { title: "编辑通知", disabled: (__VLS_ctx.editingNotificationId === notification.id) }));
            if (__VLS_ctx.editingNotificationId === notification.id) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
        };
        for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.notifications)); _d < _e.length; _d++) {
            var notification = _e[_d][0];
            _loop_2(notification);
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
                    if (!(__VLS_ctx.courseDetail))
                        return;
                    if (!!(__VLS_ctx.notificationLoading))
                        return;
                    if (!!(__VLS_ctx.notificationError))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
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
                    if (!(__VLS_ctx.courseDetail))
                        return;
                    if (!!(__VLS_ctx.notificationLoading))
                        return;
                    if (!!(__VLS_ctx.notificationError))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
                        return;
                    if (!(__VLS_ctx.notificationData && __VLS_ctx.notificationData.total_pages > 1))
                        return;
                    __VLS_ctx.loadNotifications(__VLS_ctx.currentPage + 1);
                } }, { disabled: (__VLS_ctx.currentPage >= __VLS_ctx.notificationData.total_pages) }), { class: "page-btn" }));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "students-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "student-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "student-stats" }));
    (__VLS_ctx.courseDetail.students.length);
    if (__VLS_ctx.selectedStudents.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedStudents.length);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "import-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleDownloadStudentTemplate) }, { class: "template-btn" }), { title: "下载导入模板" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.triggerStudentImport) }, { class: "import-btn" }), { disabled: (__VLS_ctx.studentImporting), title: "导入学生" }));
    (__VLS_ctx.studentImporting ? '导入中...' : '📁 导入学生');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleStudentImport) }, { ref: "studentFileInput", type: "file", accept: ".xlsx,.xls" }), { style: {} }));
    /** @type {typeof __VLS_ctx.studentFileInput} */ ;
    if (__VLS_ctx.selectedStudents.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleRemoveStudents) }, { class: "remove-students-btn" }));
    }
    if (!((_b = __VLS_ctx.courseDetail) === null || _b === void 0 ? void 0 : _b.students) || __VLS_ctx.courseDetail.students.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "student-table" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "table-header" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "th checkbox-column" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: (__VLS_ctx.toggleSelectAll) }, { type: "checkbox", checked: (__VLS_ctx.selectedStudents.length === __VLS_ctx.courseDetail.students.length), indeterminate: (__VLS_ctx.selectedStudents.length > 0 && __VLS_ctx.selectedStudents.length < __VLS_ctx.courseDetail.students.length) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "th" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "th" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "th" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "th" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "table-body" }));
        for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.courseDetail.students)); _f < _g.length; _f++) {
            var student = _g[_f][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "table-row" }, { key: (student.student_id) }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "td checkbox-column" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                type: "checkbox",
                value: (student.student_id),
            });
            (__VLS_ctx.selectedStudents);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "td" }));
            (student.student_id);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "td" }));
            (student.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "td" }));
            (student.college);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "td" }));
            (student.grade);
        }
    }
}
if (__VLS_ctx.showCreateNotification) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closeCreateNotification) }, { class: "modal-overlay" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "modal-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (__VLS_ctx.isEditMode ? '编辑通知' : '创建通知');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeCreateNotification) }, { class: "close-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "title",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ id: "title", value: (__VLS_ctx.notificationForm.title), type: "text" }, { class: "form-input" }), { placeholder: "请输入通知标题" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "content",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign(__assign({ id: "content", value: (__VLS_ctx.notificationForm.content) }, { class: "form-textarea" }), { rows: "6", placeholder: "请输入通知内容" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "priority",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ id: "priority", value: (__VLS_ctx.notificationForm.priority) }, { class: "form-select" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: (1),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: (2),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: (3),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "checkbox-label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "checkbox",
    });
    (__VLS_ctx.notificationForm.require_confirmation);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-footer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeCreateNotification) }, { class: "cancel-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleCreateOrUpdateNotification) }, { class: "confirm-btn" }));
    (__VLS_ctx.isEditMode ? '更新' : '创建');
}
if (__VLS_ctx.showNotificationDetail && __VLS_ctx.selectedNotification) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.closeNotificationDetail) }, { class: "modal-overlay" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "modal-content large-modal" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeNotificationDetail) }, { class: "close-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notification-detail" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "detail-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    (__VLS_ctx.selectedNotification.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "detail-meta" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "priority" }));
    (__VLS_ctx.getPriorityText(__VLS_ctx.selectedNotification.priority));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "time" }));
    (__VLS_ctx.formatDateTime(__VLS_ctx.selectedNotification.publish_time));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "detail-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedNotification.content);
    if (__VLS_ctx.selectedNotification.require_confirmation) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirmation-stats" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "stats-summary" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.selectedNotification.total_students);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.selectedNotification.confirmed_students);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.selectedNotification.confirmation_rate.toFixed(1));
        if (__VLS_ctx.selectedNotification.confirmations.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirmation-list" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h6, __VLS_intrinsicElements.h6)({});
            for (var _h = 0, _j = __VLS_getVForSourceType((__VLS_ctx.selectedNotification.confirmations)); _h < _j.length; _h++) {
                var confirmation = _j[_h][0];
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirmation-item" }, { key: (confirmation.student_id) }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "student-info" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "student-name" }));
                (confirmation.student_name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "student-number" }));
                (confirmation.student_number);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirm-time" }));
                (__VLS_ctx.formatDateTime(confirmation.confirmed_at));
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-footer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeNotificationDetail) }, { class: "cancel-btn" }));
}
/** @type {__VLS_StyleScopedClasses['teacher-layout']} */ ;
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
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['description']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['material-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-section']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
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
/** @type {__VLS_StyleScopedClasses['delete-material-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['create-notification-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['section-error']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-list']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-main']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['no-confirmation']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-notification-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-info']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['students-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['student-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['student-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['import-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['import-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-students-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['student-table']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-column']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['th']} */ ;
/** @type {__VLS_StyleScopedClasses['table-body']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-column']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['td']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['large-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['priority']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-list']} */ ;
/** @type {__VLS_StyleScopedClasses['confirmation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['student-info']} */ ;
/** @type {__VLS_StyleScopedClasses['student-name']} */ ;
/** @type {__VLS_StyleScopedClasses['student-number']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-time']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            SideBar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            formatDateTime: course_th_1.formatDateTime,
            formatFileSize: course_detail_th_1.formatFileSize,
            getPriorityText: course_detail_th_1.getPriorityText,
            getPriorityClass: course_detail_th_1.getPriorityClass,
            username: username,
            teacherMenuItems: teacherMenuItems,
            loading: loading,
            error: error,
            courseDetail: courseDetail,
            selectedStudents: selectedStudents,
            notificationLoading: notificationLoading,
            notificationError: notificationError,
            notificationData: notificationData,
            notifications: notifications,
            currentPage: currentPage,
            showCreateNotification: showCreateNotification,
            showNotificationDetail: showNotificationDetail,
            selectedNotification: selectedNotification,
            notificationForm: notificationForm,
            isEditMode: isEditMode,
            editingNotificationId: editingNotificationId,
            materialLoading: materialLoading,
            materialError: materialError,
            materials: materials,
            materialUploading: materialUploading,
            downloadingFiles: downloadingFiles,
            fileInput: fileInput,
            studentImporting: studentImporting,
            studentFileInput: studentFileInput,
            loadData: loadData,
            loadNotifications: loadNotifications,
            loadMaterials: loadMaterials,
            viewNotificationDetail: viewNotificationDetail,
            showCreateNotificationDialog: showCreateNotificationDialog,
            showEditNotificationDialog: showEditNotificationDialog,
            handleCreateOrUpdateNotification: handleCreateOrUpdateNotification,
            closeCreateNotification: closeCreateNotification,
            closeNotificationDetail: closeNotificationDetail,
            toggleSelectAll: toggleSelectAll,
            triggerStudentImport: triggerStudentImport,
            handleStudentImport: handleStudentImport,
            handleDownloadStudentTemplate: handleDownloadStudentTemplate,
            handleRemoveStudents: handleRemoveStudents,
            triggerFileUpload: triggerFileUpload,
            handleFileUpload: handleFileUpload,
            handleDownload: handleDownload,
            handleDeleteMaterial: handleDeleteMaterial,
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
