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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var SideBar_vue_1 = __importDefault(require("@/components/layout/SideBar.vue"));
var PageHeader_vue_1 = __importDefault(require("@/components/layout/PageHeader.vue"));
var profile_th_1 = require("@/api/teacher/profile_th");
var router = (0, vue_router_1.useRouter)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '教师');
var teacherMenuItems = [
    { path: '/teacher/course', label: '课程管理' },
    { path: '/teacher/chat', label: '教学助手' },
    { path: '/teacher/exercise_generate', label: '习题生成' },
    { path: '/teacher/ppt/generate', label: 'PPT生成' },
    { path: '/teacher/profile', label: '个人信息' },
];
// 数据状态
var loading = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)('');
var profile = (0, vue_1.ref)(null);
// 编辑状态
var editMode = (0, vue_1.ref)(false);
var updating = (0, vue_1.ref)(false);
var editForm = (0, vue_1.ref)({
    intro: '',
    contact_email: '',
    expertise: '',
    office_location: ''
});
// 密码修改状态
var passwordMode = (0, vue_1.ref)(false);
var changingPassword = (0, vue_1.ref)(false);
var passwordForm = (0, vue_1.ref)({
    current_password: '',
    new_password: ''
});
var confirmPassword = (0, vue_1.ref)('');
// 密码验证状态
var passwordValidationErrors = (0, vue_1.ref)([]);
// 密码复杂度检查
var passwordChecks = (0, vue_1.computed)(function () {
    var password = passwordForm.value.new_password;
    return {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
});
// 确认密码错误
var confirmPasswordError = (0, vue_1.computed)(function () {
    if (!confirmPassword.value)
        return '';
    if (passwordForm.value.new_password !== confirmPassword.value) {
        return '两次输入的密码不一致';
    }
    return '';
});
// 密码是否有效
var isPasswordValid = (0, vue_1.computed)(function () {
    var checks = passwordChecks.value;
    var isComplexityValid = checks.length && checks.uppercase && checks.lowercase && checks.number && checks.special;
    var isConfirmValid = passwordForm.value.new_password === confirmPassword.value && confirmPassword.value.length > 0;
    var hasCurrentPassword = passwordForm.value.current_password.length > 0;
    return isComplexityValid && isConfirmValid && hasCurrentPassword;
});
// 验证密码复杂度
var validatePassword = function () {
    var password = passwordForm.value.new_password;
    var errors = [];
    if (password.length > 0) {
        if (password.length < 6) {
            errors.push('密码至少需要6位字符');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('密码必须包含至少一个大写字母');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('密码必须包含至少一个小写字母');
        }
        if (!/\d/.test(password)) {
            errors.push('密码必须包含至少一个数字');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('密码必须包含至少一个特殊字符');
        }
    }
    passwordValidationErrors.value = errors;
};
// 监听密码变化
(0, vue_1.watch)(function () { return passwordForm.value.new_password; }, validatePassword);
// 加载教师信息
var loadProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                loading.value = true;
                error.value = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                _a = profile;
                return [4 /*yield*/, (0, profile_th_1.getTeacherProfile)()
                    // 初始化编辑表单
                ];
            case 2:
                _a.value = _b.sent();
                // 初始化编辑表单
                editForm.value = {
                    intro: profile.value.intro || '',
                    contact_email: profile.value.contact_email || '',
                    expertise: profile.value.expertise || '',
                    office_location: profile.value.office_location || ''
                };
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error('获取教师信息失败:', err_1);
                error.value = err_1.message;
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 切换编辑模式
var toggleEditMode = function () {
    var _a, _b, _c, _d;
    if (editMode.value) {
        // 取消编辑，恢复原始数据
        editForm.value = {
            intro: ((_a = profile.value) === null || _a === void 0 ? void 0 : _a.intro) || '',
            contact_email: ((_b = profile.value) === null || _b === void 0 ? void 0 : _b.contact_email) || '',
            expertise: ((_c = profile.value) === null || _c === void 0 ? void 0 : _c.expertise) || '',
            office_location: ((_d = profile.value) === null || _d === void 0 ? void 0 : _d.office_location) || ''
        };
    }
    editMode.value = !editMode.value;
};
// 更新个人信息
var updateProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (updating.value)
                    return [2 /*return*/];
                updating.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 7, 8]);
                return [4 /*yield*/, (0, profile_th_1.updateTeacherProfile)(editForm.value)];
            case 2:
                result = _a.sent();
                if (!(result.status === 'success')) return [3 /*break*/, 4];
                alert('个人信息更新成功！');
                editMode.value = false;
                // 重新加载用户信息
                return [4 /*yield*/, loadProfile()];
            case 3:
                // 重新加载用户信息
                _a.sent();
                return [3 /*break*/, 5];
            case 4: throw new Error(result.message || '更新失败');
            case 5: return [3 /*break*/, 8];
            case 6:
                err_2 = _a.sent();
                console.error('更新个人信息失败:', err_2);
                alert('更新失败：' + err_2.message);
                return [3 /*break*/, 8];
            case 7:
                updating.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// 切换密码修改模式
var togglePasswordMode = function () {
    if (passwordMode.value) {
        // 取消修改，清空表单
        passwordForm.value = {
            current_password: '',
            new_password: ''
        };
        confirmPassword.value = '';
        passwordValidationErrors.value = [];
    }
    passwordMode.value = !passwordMode.value;
};
// 修改密码
var changeUserPassword = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (changingPassword.value || !isPasswordValid.value)
                    return [2 /*return*/];
                changingPassword.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, profile_th_1.changePassword)(passwordForm.value)];
            case 2:
                result = _a.sent();
                if (result.status === 'success') {
                    alert('密码修改成功！请重新登录。');
                    // 清空表单
                    passwordForm.value = {
                        current_password: '',
                        new_password: ''
                    };
                    confirmPassword.value = '';
                    passwordValidationErrors.value = [];
                    passwordMode.value = false;
                    // 退出登录
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    router.push('/login');
                }
                else {
                    throw new Error(result.message || '密码修改失败');
                }
                return [3 /*break*/, 5];
            case 3:
                err_3 = _a.sent();
                console.error('修改密码失败:', err_3);
                alert('密码修改失败：' + err_3.message);
                return [3 /*break*/, 5];
            case 4:
                changingPassword.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 处理菜单点击
var handleMenuClick = function (item) {
    router.push({
        path: item.path,
        query: { _t: Date.now() }
    });
};
// 退出登录
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
(0, vue_1.onMounted)(function () {
    loadProfile();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['password-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['requirements-list']} */ ;
/** @type {__VLS_StyleScopedClasses['requirements-list']} */ ;
/** @type {__VLS_StyleScopedClasses['requirements-list']} */ ;
/** @type {__VLS_StyleScopedClasses['requirements-list']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "teacher-layout" }));
/** @type {[typeof SideBar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default(__assign({ 'onMenuClick': {} }, { menuItems: (__VLS_ctx.teacherMenuItems), activeItem: ('/teacher/profile') })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onMenuClick': {} }, { menuItems: (__VLS_ctx.teacherMenuItems), activeItem: ('/teacher/profile') })], __VLS_functionalComponentArgsRest(__VLS_0), false));
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
    title: "个人信息",
}));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
        title: "个人信息",
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "profile-container" }));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "loading" }));
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "error-state" }));
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.loadProfile) }, { class: "retry-btn" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "profile-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-grid" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_a = __VLS_ctx.profile) === null || _a === void 0 ? void 0 : _a.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_b = __VLS_ctx.profile) === null || _b === void 0 ? void 0 : _b.staff_id);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    ((_c = __VLS_ctx.profile) === null || _c === void 0 ? void 0 : _c.department);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleEditMode) }, { class: "edit-btn" }), { disabled: (__VLS_ctx.updating) }));
    (__VLS_ctx.editMode ? '取消编辑' : '编辑资料');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.updateProfile) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "text", value: (__VLS_ctx.editForm.expertise), readonly: (!__VLS_ctx.editMode), placeholder: "请输入专业领域" }, { class: "form-input" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "text", value: (__VLS_ctx.editForm.office_location), readonly: (!__VLS_ctx.editMode), placeholder: "请输入办公地点" }, { class: "form-input" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.editForm.intro), readonly: (!__VLS_ctx.editMode), placeholder: "请输入个人简介", rows: "4" }, { class: "form-input" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "email", readonly: (!__VLS_ctx.editMode), placeholder: "请输入联系邮箱" }, { class: "form-input" }));
    (__VLS_ctx.editForm.contact_email);
    if (__VLS_ctx.editMode) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-actions" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ type: "submit" }, { class: "save-btn" }), { disabled: (__VLS_ctx.updating) }));
        (__VLS_ctx.updating ? '保存中...' : '保存修改');
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "info-card" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.togglePasswordMode) }, { class: "edit-btn" }), { disabled: (__VLS_ctx.changingPassword) }));
    (__VLS_ctx.passwordMode ? '取消修改' : '修改密码');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-body" }));
    if (__VLS_ctx.passwordMode) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.changeUserPassword) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "password", placeholder: "请输入当前密码" }, { class: "form-input" }), { required: true }));
        (__VLS_ctx.passwordForm.current_password);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign(__assign({ onInput: (__VLS_ctx.validatePassword) }, { type: "password", placeholder: "请输入新密码" }), { class: "form-input" }), { class: ({ 'input-error': __VLS_ctx.passwordValidationErrors.length > 0 }) }), { required: true }));
        (__VLS_ctx.passwordForm.new_password);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "password-requirements" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "requirements-title" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "requirements-list" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ class: ({ 'valid': __VLS_ctx.passwordChecks.length }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ class: ({ 'valid': __VLS_ctx.passwordChecks.uppercase }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ class: ({ 'valid': __VLS_ctx.passwordChecks.lowercase }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ class: ({ 'valid': __VLS_ctx.passwordChecks.number }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ class: ({ 'valid': __VLS_ctx.passwordChecks.special }) }));
        if (__VLS_ctx.passwordValidationErrors.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "validation-errors" }));
            for (var _i = 0, _d = __VLS_getVForSourceType((__VLS_ctx.passwordValidationErrors)); _i < _d.length; _i++) {
                var error_1 = _d[_i][0];
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (error_1) }, { class: "error-item" }));
                (error_1);
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ type: "password", placeholder: "请再次输入新密码" }, { class: "form-input" }), { class: ({ 'input-error': __VLS_ctx.confirmPasswordError }) }), { required: true }));
        (__VLS_ctx.confirmPassword);
        if (__VLS_ctx.confirmPasswordError) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "password-error" }));
            (__VLS_ctx.confirmPasswordError);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-actions" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ type: "submit" }, { class: "save-btn" }), { disabled: (__VLS_ctx.changingPassword || !__VLS_ctx.isPasswordValid) }));
        (__VLS_ctx.changingPassword ? '修改中...' : '确认修改');
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "password-placeholder" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "password-tip" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    }
}
/** @type {__VLS_StyleScopedClasses['teacher-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-error']} */ ;
/** @type {__VLS_StyleScopedClasses['password-requirements']} */ ;
/** @type {__VLS_StyleScopedClasses['requirements-title']} */ ;
/** @type {__VLS_StyleScopedClasses['requirements-list']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['valid']} */ ;
/** @type {__VLS_StyleScopedClasses['validation-errors']} */ ;
/** @type {__VLS_StyleScopedClasses['error-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-error']} */ ;
/** @type {__VLS_StyleScopedClasses['password-error']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['password-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['password-tip']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            SideBar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            username: username,
            teacherMenuItems: teacherMenuItems,
            loading: loading,
            error: error,
            profile: profile,
            editMode: editMode,
            updating: updating,
            editForm: editForm,
            passwordMode: passwordMode,
            changingPassword: changingPassword,
            passwordForm: passwordForm,
            confirmPassword: confirmPassword,
            passwordValidationErrors: passwordValidationErrors,
            passwordChecks: passwordChecks,
            confirmPasswordError: confirmPasswordError,
            isPasswordValid: isPasswordValid,
            validatePassword: validatePassword,
            loadProfile: loadProfile,
            toggleEditMode: toggleEditMode,
            updateProfile: updateProfile,
            togglePasswordMode: togglePasswordMode,
            changeUserPassword: changeUserPassword,
            handleMenuClick: handleMenuClick,
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
