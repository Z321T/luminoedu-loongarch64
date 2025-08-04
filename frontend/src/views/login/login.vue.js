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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var element_plus_1 = require("element-plus");
var icons_vue_1 = require("@element-plus/icons-vue");
var login_1 = require("@/api/login/login");
var router = (0, vue_router_1.useRouter)();
var http = (0, vue_1.inject)('axios');
var loading = (0, vue_1.ref)(false);
var loginFormRef = (0, vue_1.ref)(null);
var loginForm = (0, vue_1.reactive)({
    user_id: '',
    password: '',
});
var rules = (0, vue_1.reactive)({
    user_id: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名至少3个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' },
    ],
});
var submitForm = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!loginFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, loginFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var data, error_1, msg;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid) return [3 /*break*/, 12];
                                    loading.value = true;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 10, 11, 12]);
                                    return [4 /*yield*/, (0, login_1.login)(loginForm, http)];
                                case 2:
                                    data = _a.sent();
                                    console.log('登录响应数据:', data);
                                    // 保存认证信息
                                    if (data.access_token) {
                                        localStorage.setItem('token', data.access_token);
                                        localStorage.setItem('token_type', data.token_type || 'Bearer');
                                        localStorage.setItem('user_id', String(data.user_id || loginForm.user_id));
                                        localStorage.setItem('username', data.username || loginForm.user_id);
                                        localStorage.setItem('role', data.role || 'student');
                                        console.log('用户信息已保存:', {
                                            token: !!data.access_token,
                                            role: data.role,
                                            user_id: data.user_id,
                                        });
                                    }
                                    element_plus_1.ElMessage.success('登录成功！');
                                    if (!(data.role === 'student')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, router.push('/student/course')];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 9];
                                case 4:
                                    if (!(data.role === 'teacher')) return [3 /*break*/, 6];
                                    return [4 /*yield*/, router.push('/teacher/course')];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 9];
                                case 6:
                                    if (!(data.role === 'admin')) return [3 /*break*/, 8];
                                    return [4 /*yield*/, router.push('/admin/log_management')];
                                case 7:
                                    _a.sent();
                                    return [3 /*break*/, 9];
                                case 8:
                                    element_plus_1.ElMessage.error('未知用户角色，无法跳转');
                                    _a.label = 9;
                                case 9: return [3 /*break*/, 12];
                                case 10:
                                    error_1 = _a.sent();
                                    console.error('登录失败:', error_1);
                                    msg = '登录失败';
                                    if (Array.isArray(error_1.detail)) {
                                        msg = error_1.detail.map(function (d) { return d.msg || d; }).join('; ');
                                    }
                                    else if (typeof error_1.detail === 'string') {
                                        msg = error_1.detail;
                                    }
                                    else if (error_1.message) {
                                        msg = error_1.message;
                                    }
                                    element_plus_1.ElMessage.error(msg);
                                    return [3 /*break*/, 12];
                                case 11:
                                    loading.value = false;
                                    return [7 /*endfinally*/];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 检查是否已登录
(0, vue_1.onMounted)(function () {
    var token = localStorage.getItem('token');
    var role = localStorage.getItem('role');
    if (token && role) {
        console.log('检测到已登录状态，重定向到对应页面');
        // 如果已登录，直接跳转到对应页面
        if (role === 'admin') {
            router.push('/admin/log_management');
        }
        else if (role === 'teacher') {
            router.push('/teacher/course');
        }
        else if (role === 'student') {
            router.push('/student/course');
        }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-content']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['side-decoration']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
/** @type {__VLS_StyleScopedClasses['login-content']} */ ;
/** @type {__VLS_StyleScopedClasses['side-decoration']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-showcase']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-content']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['login-content']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['side-decoration']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "login-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "login-background" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "background-animation" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "floating-shape shape-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "floating-shape shape-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "floating-shape shape-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "floating-shape shape-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "floating-shape shape-5" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "gradient-overlay" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "login-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "login-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "brand-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "brand-logo" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "logo-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "brand-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "brand-subtitle" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "form-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "form-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "form-subtitle" }));
var __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ 'onKeyup': {} }, { ref: "loginFormRef", model: (__VLS_ctx.loginForm), rules: (__VLS_ctx.rules) }), { class: "login-form" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ 'onKeyup': {} }, { ref: "loginFormRef", model: (__VLS_ctx.loginForm), rules: (__VLS_ctx.rules) }), { class: "login-form" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4;
var __VLS_5;
var __VLS_6;
var __VLS_7 = {
    onKeyup: (__VLS_ctx.submitForm)
};
/** @type {typeof __VLS_ctx.loginFormRef} */ ;
var __VLS_8 = {};
__VLS_3.slots.default;
var __VLS_10 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ prop: "user_id" }, { class: "form-item" })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ prop: "user_id" }, { class: "form-item" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
__VLS_13.slots.default;
var __VLS_14 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
var __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14(__assign(__assign({ modelValue: (__VLS_ctx.loginForm.user_id), placeholder: "请输入用户名" }, { class: "form-input" }), { size: "large", prefixIcon: (__VLS_ctx.User) })));
var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign(__assign({ modelValue: (__VLS_ctx.loginForm.user_id), placeholder: "请输入用户名" }, { class: "form-input" }), { size: "large", prefixIcon: (__VLS_ctx.User) })], __VLS_functionalComponentArgsRest(__VLS_15), false));
var __VLS_13;
var __VLS_18 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18(__assign({ prop: "password" }, { class: "form-item" })));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ prop: "password" }, { class: "form-item" })], __VLS_functionalComponentArgsRest(__VLS_19), false));
__VLS_21.slots.default;
var __VLS_22 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
var __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22(__assign(__assign({ modelValue: (__VLS_ctx.loginForm.password), type: "password", placeholder: "请输入密码", showPassword: true }, { class: "form-input" }), { size: "large", prefixIcon: (__VLS_ctx.Lock) })));
var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([__assign(__assign({ modelValue: (__VLS_ctx.loginForm.password), type: "password", placeholder: "请输入密码", showPassword: true }, { class: "form-input" }), { size: "large", prefixIcon: (__VLS_ctx.Lock) })], __VLS_functionalComponentArgsRest(__VLS_23), false));
var __VLS_21;
var __VLS_26 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
var __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26(__assign(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "login-btn" }), { size: "large" })));
var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "login-btn" }), { size: "large" })], __VLS_functionalComponentArgsRest(__VLS_27), false));
var __VLS_30;
var __VLS_31;
var __VLS_32;
var __VLS_33 = {
    onClick: (__VLS_ctx.submitForm)
};
__VLS_29.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "btn-text" }));
(__VLS_ctx.loading ? '登录中...' : '登录');
var __VLS_29;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "side-decoration" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "decoration-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-showcase" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-item" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-text" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-item" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-text" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-item" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "feature-text" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-background']} */ ;
/** @type {__VLS_StyleScopedClasses['background-animation']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['shape-1']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['shape-2']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['shape-3']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['shape-4']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['shape-5']} */ ;
/** @type {__VLS_StyleScopedClasses['gradient-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['login-content']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-header']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-title']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['login-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
/** @type {__VLS_StyleScopedClasses['side-decoration']} */ ;
/** @type {__VLS_StyleScopedClasses['decoration-content']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-showcase']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
// @ts-ignore
var __VLS_9 = __VLS_8;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            User: icons_vue_1.User,
            Lock: icons_vue_1.Lock,
            loading: loading,
            loginFormRef: loginFormRef,
            loginForm: loginForm,
            rules: rules,
            submitForm: submitForm,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
