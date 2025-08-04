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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_router_1 = require("vue-router");
var props = withDefaults(defineProps(), {
    menuItems: function () { return [
        { path: '/home_teacher', label: '首页' },
        { path: '/exercise_generate', label: '习题生成' },
        { path: '/exercise_history', label: '历史记录' },
        { path: '/student_management', label: '学生管理' },
        { path: '/settings', label: '设置' },
    ]; },
    activeItem: '',
});
var emit = defineEmits();
var router = (0, vue_router_1.useRouter)();
var route = (0, vue_router_1.useRoute)();
var handleMenuClick = function (item) {
    // 如果是路由路径，则导航
    if (item.path.startsWith('/')) {
        navigateTo(item.path);
    }
    else {
        // 否则发射事件给父组件处理
        emit('menuClick', item);
    }
};
var navigateTo = function (path) {
    router.push(path);
};
var isActive = function (path) {
    // 如果有activeItem prop，则使用它来判断激活状态
    if (props.activeItem) {
        return props.activeItem === path;
    }
    // 否则使用路由来判断
    return route.path === path;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    menuItems: function () { return [
        { path: '/home_teacher', label: '首页' },
        { path: '/exercise_generate', label: '习题生成' },
        { path: '/exercise_history', label: '历史记录' },
        { path: '/student_management', label: '学生管理' },
        { path: '/settings', label: '设置' },
    ]; },
    activeItem: '',
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)(__assign({ class: "sidebar" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "logo" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "menu" }));
var _loop_1 = function (item) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.handleMenuClick(item);
        } }, { key: (item.path) }), { class: "menu-item" }), { class: ({ active: __VLS_ctx.isActive(item.path) }) }), { 'data-path': (item.path) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(__assign({ class: "icon" }));
    (item.icon);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.label);
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.menuItems)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    _loop_1(item);
}
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['menu']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            handleMenuClick: handleMenuClick,
            isActive: isActive,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
exports.default = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
