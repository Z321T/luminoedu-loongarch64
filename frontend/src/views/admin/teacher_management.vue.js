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
var adminMenuItems = [
    { path: '/admin/log_management', label: '日志管理' },
    { path: '/admin/teacher_management', label: '教师管理' },
    { path: '/admin/student_management', label: '学生管理' },
    { path: '/admin/model_management', label: '模型管理' },
];
// 列表相关
var allTeachers = (0, vue_1.ref)([]); // 存储完整的教师列表
var filteredTeachers = (0, vue_1.ref)([]); // 存储过滤后的教师列表
var currentPage = (0, vue_1.ref)(1);
var pageSize = (0, vue_1.ref)(20);
var total = (0, vue_1.ref)(0);
var loading = (0, vue_1.ref)(false);
// 搜索表单
var searchForm = (0, vue_1.ref)({
    name: '',
    staff_id: '',
    department: ''
});
var searchTimer = null;
// 选择相关
var selectedTeachers = (0, vue_1.ref)([]);
// 快速提示
var showQuickTip = (0, vue_1.ref)(false);
var quickTipMessage = (0, vue_1.ref)('');
// 教师详情
var showDetailDialog = (0, vue_1.ref)(false);
var currentTeacher = (0, vue_1.ref)(null);
// 编辑
var isEditing = (0, vue_1.ref)(false);
var editForm = (0, vue_1.ref)({});
var teacherFields = [
    { key: 'username', label: '姓名', type: 'text' },
    { key: 'staff_id', label: '工号', type: 'text' },
    { key: 'department', label: '院系', type: 'text' },
    { key: 'expertise', label: '专业领域', type: 'text' },
    { key: 'intro', label: '个人简介', type: 'textarea' },
    { key: 'contact_email', label: '联系邮箱', type: 'text', inputType: 'email' },
    { key: 'office_location', label: '办公地点', type: 'text' }
];
// 重置密码
var showPasswordDialog = (0, vue_1.ref)(false);
var newPassword = (0, vue_1.ref)('');
var confirmPassword = (0, vue_1.ref)('');
// 批量操作
var showDeleteDialog = (0, vue_1.ref)(false);
// 计算属性
var hasSearchConditions = (0, vue_1.computed)(function () {
    return searchForm.value.name || searchForm.value.staff_id || searchForm.value.department;
});
// 修改 teachers 计算属性，使用过滤后的数据进行分页
var teachers = (0, vue_1.computed)(function () {
    var start = (currentPage.value - 1) * pageSize.value;
    var end = start + pageSize.value;
    return filteredTeachers.value.slice(start, end);
});
// 重新计算总页数，基于过滤后的数据
var totalPages = (0, vue_1.computed)(function () { return Math.ceil(filteredTeachers.value.length / pageSize.value); });
// 全选状态
var isAllSelected = (0, vue_1.computed)(function () {
    return teachers.value.length > 0 && teachers.value.every(function (teacher) {
        return selectedTeachers.value.includes(teacher.staff_id);
    });
});
var isIndeterminate = (0, vue_1.computed)(function () {
    return selectedTeachers.value.length > 0 && selectedTeachers.value.length < teachers.value.length;
});
// 前端搜索过滤函数
var applyLocalSearch = function () {
    if (!hasSearchConditions.value) {
        filteredTeachers.value = __spreadArray([], allTeachers.value, true);
    }
    else {
        filteredTeachers.value = allTeachers.value.filter(function (teacher) {
            var nameMatch = !searchForm.value.name ||
                teacher.username.toLowerCase().includes(searchForm.value.name.toLowerCase());
            var staffIdMatch = !searchForm.value.staff_id ||
                teacher.staff_id.toLowerCase().includes(searchForm.value.staff_id.toLowerCase());
            var departmentMatch = !searchForm.value.department ||
                teacher.department.toLowerCase().includes(searchForm.value.department.toLowerCase());
            return nameMatch && staffIdMatch && departmentMatch;
        });
    }
    // 搜索后重置到第一页
    if (hasSearchConditions.value && currentPage.value > 1) {
        currentPage.value = 1;
    }
    // 清空选择
    selectedTeachers.value = [];
};
// 搜索处理函数
var handleSearch = function () {
    // 清除之前的定时器
    if (searchTimer) {
        clearTimeout(searchTimer);
    }
    // 设置防抖延迟
    searchTimer = setTimeout(function () {
        applyLocalSearch();
    }, 300);
};
// 清空所有搜索条件
var clearAllSearch = function () {
    searchForm.value = {
        name: '',
        staff_id: '',
        department: ''
    };
    applyLocalSearch();
};
// 修改分页处理函数
var handlePageChange = function (page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
// 修改 loadTeachers 函数
var loadTeachers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                loading.value = true;
                return [4 /*yield*/, (0, user_management_1.getTeacherList)(1, 1000)
                    // 存储完整的教师列表用于前端搜索
                ];
            case 1:
                response = _a.sent();
                // 存储完整的教师列表用于前端搜索
                allTeachers.value = response.teachers;
                total.value = response.total;
                // 应用前端搜索过滤
                applyLocalSearch();
                return [3 /*break*/, 4];
            case 2:
                error_1 = _a.sent();
                console.error('加载教师列表失败:', error_1);
                showQuickTipMessage(error_1.message || '加载教师列表失败');
                return [3 /*break*/, 4];
            case 3:
                loading.value = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 切换全选
var toggleAllSelection = function () {
    if (isAllSelected.value) {
        selectedTeachers.value = [];
    }
    else {
        selectedTeachers.value = teachers.value.map(function (teacher) { return teacher.staff_id; });
    }
};
// 选择单个教师
var toggleTeacherSelection = function (teacherId) {
    var idx = selectedTeachers.value.indexOf(teacherId);
    if (idx === -1) {
        selectedTeachers.value.push(teacherId);
    }
    else {
        selectedTeachers.value.splice(idx, 1);
    }
};
// 批量删除教师
var showDeleteConfirm = function () {
    if (selectedTeachers.value.length === 0) {
        showQuickTipMessage('请先选择要删除的教师');
        return;
    }
    showDeleteDialog.value = true;
};
var confirmDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, user_management_1.deleteTeachers)(selectedTeachers.value)];
            case 1:
                result = _a.sent();
                if (!result.success) return [3 /*break*/, 3];
                showQuickTipMessage("\u6210\u529F\u5220\u9664 ".concat(result.deleted, " \u4E2A\u6559\u5E08"));
                selectedTeachers.value = [];
                showDeleteDialog.value = false;
                return [4 /*yield*/, loadTeachers()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                showQuickTipMessage(error_2.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 查看教师详情
var showTeacherDetail = function (staff_id) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = currentTeacher;
                return [4 /*yield*/, (0, user_management_1.getTeacherDetail)(staff_id)];
            case 1:
                _a.value = _b.sent();
                showDetailDialog.value = true;
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                showQuickTipMessage('获取教师详情失败');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// 编辑相关函数
var startEdit = function () {
    editForm.value = __assign({}, currentTeacher.value);
    isEditing.value = true;
};
var cancelEdit = function () {
    isEditing.value = false;
    editForm.value = {};
};
var saveTeacherInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = {
                    username: editForm.value.username,
                    staff_id: editForm.value.staff_id,
                    department: editForm.value.department,
                    expertise: editForm.value.expertise,
                    intro: editForm.value.intro,
                    contact_email: editForm.value.contact_email,
                    office_location: editForm.value.office_location
                };
                return [4 /*yield*/, (0, user_management_1.updateTeacherInfo)(currentTeacher.value.staff_id, data)];
            case 1:
                result = _a.sent();
                if (!(result.status === 'success')) return [3 /*break*/, 3];
                showQuickTipMessage('更新成功');
                isEditing.value = false;
                return [4 /*yield*/, loadTeachers()];
            case 2:
                _a.sent();
                currentTeacher.value = __assign({}, editForm.value);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                showQuickTipMessage(error_4.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var formatFieldValue = function (key) {
    var _a;
    var value = (_a = currentTeacher.value) === null || _a === void 0 ? void 0 : _a[key];
    if (value === null || value === undefined)
        return '暂无';
    return value;
};
// 重置密码相关函数
var showResetPasswordDialog = function () {
    newPassword.value = '';
    confirmPassword.value = '';
    showPasswordDialog.value = true;
};
var closePasswordDialog = function () {
    showPasswordDialog.value = false;
    newPassword.value = '';
    confirmPassword.value = '';
};
var resetPassword = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!newPassword.value) {
                    showQuickTipMessage('请输入新密码');
                    return [2 /*return*/];
                }
                if (newPassword.value.length < 6) {
                    showQuickTipMessage('密码长度不能少于6位');
                    return [2 /*return*/];
                }
                if (newPassword.value !== confirmPassword.value) {
                    showQuickTipMessage('两次输入的密码不一致');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, user_management_1.resetTeacherPassword)(currentTeacher.value.staff_id, newPassword.value)];
            case 1:
                result = _a.sent();
                if (result.status === 'success') {
                    showQuickTipMessage('密码重置成功');
                    closePasswordDialog();
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                showQuickTipMessage(error_5.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// 其他函数
var goToCreateTeacher = function () {
    router.push('/admin/create_teacher');
};
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
    }, 2000);
};
var getTeacherName = function (teacherId) {
    var teacher = allTeachers.value.find(function (t) { return t.staff_id === teacherId; });
    return teacher ? teacher.username : teacherId;
};
// 初始化时应用搜索
(0, vue_1.onMounted)(function () {
    loadTeachers();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['teachers-table']} */ ;
/** @type {__VLS_StyleScopedClasses['teachers-table']} */ ;
/** @type {__VLS_StyleScopedClasses['teachers-table']} */ ;
/** @type {__VLS_StyleScopedClasses['teachers-table']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['import-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['no-search-results']} */ ;
/** @type {__VLS_StyleScopedClasses['no-search-results']} */ ;
/** @type {__VLS_StyleScopedClasses['no-search-results']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-link']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-controls']} */ ;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teachers-table-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "table-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "table-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "title-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "header-actions" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goToCreateTeacher) }, { class: "import-btn" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "nameSearch",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onInput: (__VLS_ctx.handleSearch) }, { id: "nameSearch", value: (__VLS_ctx.searchForm.name), type: "text", placeholder: "请输入教师姓名" }), { class: "filter-input" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "staffIdSearch",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onInput: (__VLS_ctx.handleSearch) }, { id: "staffIdSearch", value: (__VLS_ctx.searchForm.staff_id), type: "text", placeholder: "请输入教工号" }), { class: "filter-input" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "departmentSearch",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onInput: (__VLS_ctx.handleSearch) }, { id: "departmentSearch", value: (__VLS_ctx.searchForm.department), type: "text", placeholder: "请输入院系名称" }), { class: "filter-input" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
if (__VLS_ctx.hasSearchConditions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.clearAllSearch) }, { class: "clear-btn" }));
}
if (__VLS_ctx.hasSearchConditions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "search-results-info" }));
    (__VLS_ctx.filteredTeachers.length);
}
if (__VLS_ctx.selectedTeachers.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "batch-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "batch-info" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "batch-checkbox" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: (__VLS_ctx.toggleAllSelection) }, { type: "checkbox", checked: (__VLS_ctx.isAllSelected), indeterminate: (__VLS_ctx.isIndeterminate) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "checkmark" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "batch-text" }));
    (__VLS_ctx.selectedTeachers.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "batch-buttons" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.showDeleteConfirm) }, { class: "batch-delete-btn" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "table-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)(__assign({ class: "teachers-table" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: (__VLS_ctx.toggleAllSelection) }, { type: "checkbox", checked: (__VLS_ctx.isAllSelected), indeterminate: (__VLS_ctx.isIndeterminate) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ colspan: "5" }, { class: "loading-row" }));
}
else if (__VLS_ctx.teachers.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ colspan: "5" }, { class: "no-data" }));
    if (__VLS_ctx.hasSearchConditions) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "no-search-results" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-icon" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-text" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-suggestion" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.clearAllSearch) }, { class: "clear-link" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    }
}
else {
    var _loop_1 = function (teacher) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (teacher.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.teachers.length === 0))
                    return;
                __VLS_ctx.toggleTeacherSelection(teacher.staff_id);
            } }, { type: "checkbox", value: (teacher.staff_id), checked: (__VLS_ctx.selectedTeachers.includes(teacher.staff_id)) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (teacher.username);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (teacher.staff_id);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (teacher.department);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.teachers.length === 0))
                    return;
                __VLS_ctx.showTeacherDetail(teacher.staff_id);
            } }, { class: "detail-btn" }));
    };
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.teachers)); _i < _a.length; _i++) {
        var teacher = _a[_i][0];
        _loop_1(teacher);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pagination" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pagination-info" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.filteredTeachers.length);
(__VLS_ctx.currentPage);
(__VLS_ctx.totalPages);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pagination-controls" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.handlePageChange(1);
    } }, { class: "page-btn" }), { disabled: (__VLS_ctx.currentPage === 1) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.handlePageChange(__VLS_ctx.currentPage - 1);
    } }, { class: "page-btn" }), { disabled: (__VLS_ctx.currentPage === 1) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.handlePageChange(__VLS_ctx.currentPage + 1);
    } }, { class: "page-btn" }), { disabled: (__VLS_ctx.currentPage === __VLS_ctx.totalPages || __VLS_ctx.totalPages === 0) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.handlePageChange(__VLS_ctx.totalPages);
    } }, { class: "page-btn" }), { disabled: (__VLS_ctx.currentPage === __VLS_ctx.totalPages || __VLS_ctx.totalPages === 0) }));
var __VLS_6 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    modelValue: (__VLS_ctx.showDetailDialog),
    title: (__VLS_ctx.isEditing ? '编辑教师信息' : '教师详细信息'),
    width: "600px",
}));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.showDetailDialog),
        title: (__VLS_ctx.isEditing ? '编辑教师信息' : '教师详细信息'),
        width: "600px",
    }], __VLS_functionalComponentArgsRest(__VLS_7), false));
__VLS_9.slots.default;
if (__VLS_ctx.currentTeacher) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teacher-detail" }));
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.teacherFields)); _b < _c.length; _b++) {
        var _d = _c[_b], field = _d[0], index = _d[1];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (index) }, { class: "detail-item" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        (field.label);
        if (__VLS_ctx.isEditing) {
            if (field.type === 'text') {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: (field.inputType || 'text') }, { class: "edit-input" }));
                (__VLS_ctx.editForm[field.key]);
            }
            else if (field.type === 'textarea') {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.editForm[field.key]) }, { class: "edit-textarea" }));
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatFieldValue(field.key));
        }
    }
}
{
    var __VLS_thisSlot = __VLS_9.slots.footer;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "dialog-footer" }));
    if (__VLS_ctx.isEditing) {
        var __VLS_10 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ 'onClick': {} })));
        var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_11), false));
        var __VLS_14 = void 0;
        var __VLS_15 = void 0;
        var __VLS_16 = void 0;
        var __VLS_17 = {
            onClick: (__VLS_ctx.cancelEdit)
        };
        __VLS_13.slots.default;
        var __VLS_13;
        var __VLS_18 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18(__assign({ 'onClick': {} }, { type: "primary" })));
        var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_19), false));
        var __VLS_22 = void 0;
        var __VLS_23 = void 0;
        var __VLS_24 = void 0;
        var __VLS_25 = {
            onClick: (__VLS_ctx.saveTeacherInfo)
        };
        __VLS_21.slots.default;
        var __VLS_21;
    }
    else {
        var __VLS_26 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        var __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26(__assign({ 'onClick': {} })));
        var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_27), false));
        var __VLS_30 = void 0;
        var __VLS_31 = void 0;
        var __VLS_32 = void 0;
        var __VLS_33 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.isEditing))
                    return;
                __VLS_ctx.showDetailDialog = false;
            }
        };
        __VLS_29.slots.default;
        var __VLS_29;
        var __VLS_34 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        var __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34(__assign({ 'onClick': {} }, { type: "warning" })));
        var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "warning" })], __VLS_functionalComponentArgsRest(__VLS_35), false));
        var __VLS_38 = void 0;
        var __VLS_39 = void 0;
        var __VLS_40 = void 0;
        var __VLS_41 = {
            onClick: (__VLS_ctx.showResetPasswordDialog)
        };
        __VLS_37.slots.default;
        var __VLS_37;
        var __VLS_42 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        var __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42(__assign({ 'onClick': {} }, { type: "primary" })));
        var __VLS_44 = __VLS_43.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_43), false));
        var __VLS_46 = void 0;
        var __VLS_47 = void 0;
        var __VLS_48 = void 0;
        var __VLS_49 = {
            onClick: (__VLS_ctx.startEdit)
        };
        __VLS_45.slots.default;
        var __VLS_45;
    }
}
var __VLS_9;
var __VLS_50 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    modelValue: (__VLS_ctx.showPasswordDialog),
    title: "重置教师密码",
    width: "400px",
}));
var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.showPasswordDialog),
        title: "重置教师密码",
        width: "400px",
    }], __VLS_functionalComponentArgsRest(__VLS_51), false));
__VLS_53.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "password-form" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-item" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "password", placeholder: "请输入新密码" }, { class: "password-input" }));
(__VLS_ctx.newPassword);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-item" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "password", placeholder: "请确认新密码" }, { class: "password-input" }));
(__VLS_ctx.confirmPassword);
{
    var __VLS_thisSlot = __VLS_53.slots.footer;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "dialog-footer" }));
    var __VLS_54 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54(__assign({ 'onClick': {} })));
    var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_55), false));
    var __VLS_58 = void 0;
    var __VLS_59 = void 0;
    var __VLS_60 = void 0;
    var __VLS_61 = {
        onClick: (__VLS_ctx.closePasswordDialog)
    };
    __VLS_57.slots.default;
    var __VLS_57;
    var __VLS_62 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    var __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62(__assign({ 'onClick': {} }, { type: "primary" })));
    var __VLS_64 = __VLS_63.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_63), false));
    var __VLS_66 = void 0;
    var __VLS_67 = void 0;
    var __VLS_68 = void 0;
    var __VLS_69 = {
        onClick: (__VLS_ctx.resetPassword)
    };
    __VLS_65.slots.default;
    var __VLS_65;
}
var __VLS_53;
var __VLS_70 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
var __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.showDeleteDialog),
    title: "确认删除",
    width: "500px",
}));
var __VLS_72 = __VLS_71.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.showDeleteDialog),
        title: "确认删除",
        width: "500px",
    }], __VLS_functionalComponentArgsRest(__VLS_71), false));
__VLS_73.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "delete-confirm" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "warning-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "confirm-text" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.selectedTeachers.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "warning-text" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teacher-list" }));
for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.selectedTeachers.slice(0, 5))); _e < _f.length; _e++) {
    var teacherId = _f[_e][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (teacherId) }, { class: "teacher-item" }));
    (__VLS_ctx.getTeacherName(teacherId));
    (teacherId);
}
if (__VLS_ctx.selectedTeachers.length > 5) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "more-text" }));
    (__VLS_ctx.selectedTeachers.length - 5);
}
{
    var __VLS_thisSlot = __VLS_73.slots.footer;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "dialog-footer" }));
    var __VLS_74 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    var __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74(__assign({ 'onClick': {} })));
    var __VLS_76 = __VLS_75.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_75), false));
    var __VLS_78 = void 0;
    var __VLS_79 = void 0;
    var __VLS_80 = void 0;
    var __VLS_81 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.showDeleteDialog = false;
        }
    };
    __VLS_77.slots.default;
    var __VLS_77;
    var __VLS_82 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    var __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82(__assign({ 'onClick': {} }, { type: "danger" })));
    var __VLS_84 = __VLS_83.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger" })], __VLS_functionalComponentArgsRest(__VLS_83), false));
    var __VLS_86 = void 0;
    var __VLS_87 = void 0;
    var __VLS_88 = void 0;
    var __VLS_89 = {
        onClick: (__VLS_ctx.confirmDelete)
    };
    __VLS_85.slots.default;
    var __VLS_85;
}
var __VLS_73;
var __VLS_90 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
var __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    name: "tip-fade",
}));
var __VLS_92 = __VLS_91.apply(void 0, __spreadArray([{
        name: "tip-fade",
    }], __VLS_functionalComponentArgsRest(__VLS_91), false));
__VLS_93.slots.default;
if (__VLS_ctx.showQuickTip) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "quick-tip" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "tip-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "tip-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.quickTipMessage);
}
var __VLS_93;
/** @type {__VLS_StyleScopedClasses['admin-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['teachers-table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['table-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['import-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['search-results-info']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-info']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['checkmark']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-text']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['teachers-table']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-row']} */ ;
/** @type {__VLS_StyleScopedClasses['no-data']} */ ;
/** @type {__VLS_StyleScopedClasses['no-search-results']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-suggestion']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-link']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['teacher-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-input']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['password-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['password-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['password-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['warning-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-text']} */ ;
/** @type {__VLS_StyleScopedClasses['warning-text']} */ ;
/** @type {__VLS_StyleScopedClasses['teacher-list']} */ ;
/** @type {__VLS_StyleScopedClasses['teacher-item']} */ ;
/** @type {__VLS_StyleScopedClasses['more-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-content']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-icon']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            PageHeader: PageHeader_vue_1.default,
            SideBar: SideBar_vue_1.default,
            username: username,
            adminMenuItems: adminMenuItems,
            filteredTeachers: filteredTeachers,
            currentPage: currentPage,
            loading: loading,
            searchForm: searchForm,
            selectedTeachers: selectedTeachers,
            showQuickTip: showQuickTip,
            quickTipMessage: quickTipMessage,
            showDetailDialog: showDetailDialog,
            currentTeacher: currentTeacher,
            isEditing: isEditing,
            editForm: editForm,
            teacherFields: teacherFields,
            showPasswordDialog: showPasswordDialog,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            showDeleteDialog: showDeleteDialog,
            hasSearchConditions: hasSearchConditions,
            teachers: teachers,
            totalPages: totalPages,
            isAllSelected: isAllSelected,
            isIndeterminate: isIndeterminate,
            handleSearch: handleSearch,
            clearAllSearch: clearAllSearch,
            handlePageChange: handlePageChange,
            toggleAllSelection: toggleAllSelection,
            toggleTeacherSelection: toggleTeacherSelection,
            showDeleteConfirm: showDeleteConfirm,
            confirmDelete: confirmDelete,
            showTeacherDetail: showTeacherDetail,
            startEdit: startEdit,
            cancelEdit: cancelEdit,
            saveTeacherInfo: saveTeacherInfo,
            formatFieldValue: formatFieldValue,
            showResetPasswordDialog: showResetPasswordDialog,
            closePasswordDialog: closePasswordDialog,
            resetPassword: resetPassword,
            goToCreateTeacher: goToCreateTeacher,
            handleLogout: handleLogout,
            getTeacherName: getTeacherName,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
