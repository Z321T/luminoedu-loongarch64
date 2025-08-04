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
var admin_log_1 = require("@/api/admin/admin_log");
var router = (0, vue_router_1.useRouter)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '管理员');
var adminMenuItems = [
    { path: '/admin/log_management', label: '日志管理' },
    { path: '/admin/teacher_management', label: '教师管理' },
    { path: '/admin/student_management', label: '学生管理' },
    { path: '/admin/model_management', label: '模型管理' },
];
var logServices = (0, vue_1.ref)([]);
var selectedService = (0, vue_1.ref)('');
var fileStartDate = (0, vue_1.ref)('');
var fileEndDate = (0, vue_1.ref)('');
var logFiles = (0, vue_1.ref)([]);
var loadingFiles = (0, vue_1.ref)(false);
// 在其他 ref 定义后添加
var fileContent = (0, vue_1.ref)([]);
var viewingFile = (0, vue_1.ref)(null);
var loadingContent = (0, vue_1.ref)(false);
var showContentModal = (0, vue_1.ref)(false);
var exporting = (0, vue_1.ref)(false);
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        router.push('/login');
    }
};
var loadLogServices = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, admin_log_1.getLogServices)()];
            case 1:
                res = _b.sent();
                logServices.value = res.services;
                if (res.services.length > 0)
                    selectedService.value = res.services[0].name;
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                logServices.value = [];
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var loadLogFiles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var params, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!selectedService.value)
                    return [2 /*return*/];
                loadingFiles.value = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                params = {
                    service_name: selectedService.value,
                    start_date: fileStartDate.value || undefined,
                    end_date: fileEndDate.value || undefined,
                };
                return [4 /*yield*/, (0, admin_log_1.getLogFiles)(params)];
            case 2:
                res = _b.sent();
                logFiles.value = res.files;
                return [3 /*break*/, 5];
            case 3:
                _a = _b.sent();
                logFiles.value = [];
                return [3 /*break*/, 5];
            case 4:
                loadingFiles.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 添加在 downloadFile 函数后面
var viewFile = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                loadingContent.value = true;
                viewingFile.value = {
                    name: file.name,
                    service: selectedService.value,
                };
                showContentModal.value = true;
                return [4 /*yield*/, (0, admin_log_1.getLogFileContent)({
                        service_name: selectedService.value,
                        file_name: file.name,
                    })];
            case 1:
                result = _a.sent();
                fileContent.value = result.content || [];
                return [3 /*break*/, 4];
            case 2:
                error_1 = _a.sent();
                alert("\u67E5\u770B\u6587\u4EF6\u5931\u8D25: ".concat(error_1.message || '未知错误'));
                showContentModal.value = false;
                return [3 /*break*/, 4];
            case 3:
                loadingContent.value = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 关闭模态框
var closeContentModal = function () {
    showContentModal.value = false;
    fileContent.value = [];
    viewingFile.value = null;
};
// 修改 handleExportLogs 函数
var handleExportLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var blob, filename, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                // 显示加载状态
                exporting.value = true;
                return [4 /*yield*/, (0, admin_log_1.exportServiceLogs)(selectedService.value, fileStartDate.value, fileEndDate.value)
                    // 下载文件
                ];
            case 1:
                blob = _a.sent();
                filename = "".concat(selectedService.value, "_logs_").concat(new Date().toISOString().slice(0, 10), ".txt");
                (0, admin_log_1.triggerDownload)(blob, filename);
                // 显示成功消息
                alert('日志导出成功');
                return [3 /*break*/, 4];
            case 2:
                error_2 = _a.sent();
                // 显示错误消息
                alert("\u5BFC\u51FA\u5931\u8D25: ".concat(error_2.message || '未知错误'));
                return [3 /*break*/, 4];
            case 3:
                // 隐藏加载状态
                exporting.value = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadLogServices()];
            case 1:
                _a.sent();
                return [4 /*yield*/, loadLogFiles()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['export-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['export-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['view-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['logs-management']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "admin-layout" }));
/** @type {[typeof Sidebar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default({
    menuItems: (__VLS_ctx.adminMenuItems),
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        menuItems: (__VLS_ctx.adminMenuItems),
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main" }));
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "logs-management" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ onChange: (__VLS_ctx.loadLogFiles) }, { value: (__VLS_ctx.selectedService) }));
for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.logServices)); _i < _b.length; _i++) {
    var service = _b[_i][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (service.name),
        value: (service.name),
    });
    (service.description);
    (service.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: (__VLS_ctx.loadLogFiles) }, { type: "date" }));
(__VLS_ctx.fileStartDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ onChange: (__VLS_ctx.loadLogFiles) }, { type: "date" }));
(__VLS_ctx.fileEndDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "export-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleExportLogs) }, { class: "export-btn" }), { disabled: (__VLS_ctx.exporting || !__VLS_ctx.selectedService) }));
if (__VLS_ctx.exporting) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-list" }));
if (__VLS_ctx.loadingFiles) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
}
else if (__VLS_ctx.logFiles.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    var _loop_1 = function (file) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ key: (file.name) }, { class: "file-item" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "file-name" }));
        (file.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "file-date" }));
        (__VLS_ctx.formatFileDate(file.date));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "file-size" }));
        (__VLS_ctx.formatFileSize(file.size));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "file-actions" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loadingFiles))
                    return;
                if (!!(__VLS_ctx.logFiles.length === 0))
                    return;
                __VLS_ctx.viewFile(file);
            } }, { class: "view-btn" }));
    };
    for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.logFiles)); _c < _d.length; _c++) {
        var file = _d[_c][0];
        _loop_1(file);
    }
}
if (__VLS_ctx.showContentModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-overlay" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-header" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    ((_a = __VLS_ctx.viewingFile) === null || _a === void 0 ? void 0 : _a.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.closeContentModal) }, { class: "close-btn" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "modal-body" }));
    if (__VLS_ctx.loadingContent) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "content-loading" }));
    }
    else if (__VLS_ctx.fileContent.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)(__assign({ class: "file-content" }));
        (__VLS_ctx.fileContent.join('\n'));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-content" }));
    }
}
/** @type {__VLS_StyleScopedClasses['admin-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['logs-management']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['export-section']} */ ;
/** @type {__VLS_StyleScopedClasses['export-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['file-list']} */ ;
/** @type {__VLS_StyleScopedClasses['file-item']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-date']} */ ;
/** @type {__VLS_StyleScopedClasses['file-size']} */ ;
/** @type {__VLS_StyleScopedClasses['file-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['view-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['content-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['file-content']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-content']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            Sidebar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            formatFileDate: admin_log_1.formatFileDate,
            formatFileSize: admin_log_1.formatFileSize,
            username: username,
            adminMenuItems: adminMenuItems,
            logServices: logServices,
            selectedService: selectedService,
            fileStartDate: fileStartDate,
            fileEndDate: fileEndDate,
            logFiles: logFiles,
            loadingFiles: loadingFiles,
            fileContent: fileContent,
            viewingFile: viewingFile,
            loadingContent: loadingContent,
            showContentModal: showContentModal,
            exporting: exporting,
            handleLogout: handleLogout,
            loadLogFiles: loadLogFiles,
            viewFile: viewFile,
            closeContentModal: closeContentModal,
            handleExportLogs: handleExportLogs,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
