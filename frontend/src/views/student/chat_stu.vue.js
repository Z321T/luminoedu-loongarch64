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
var chat_stu_1 = require("@/api/student/chat_stu");
var router = (0, vue_router_1.useRouter)();
var username = (0, vue_1.ref)(localStorage.getItem('username') || '学生');
var studentMenuItems = [
    { path: '/student/course', label: '我的课程' },
    { path: '/student/chat', label: '学习助手' },
    { path: '/student/exercise_generate', label: '习题生成' },
    { path: '/student/profile', label: '个人信息' },
];
var chatHistory = (0, vue_1.ref)([]);
var historyLoading = (0, vue_1.ref)(false);
var messages = (0, vue_1.ref)([]);
var activeChatId = (0, vue_1.ref)(null);
var userInput = (0, vue_1.ref)('');
var isReplying = (0, vue_1.ref)(false);
var messagesAreaRef = (0, vue_1.ref)(null);
// 打字效果相关状态
var typewriterQueue = (0, vue_1.ref)([]);
var currentAssistantMessage = (0, vue_1.ref)(null);
var typewriterTimer = null;
var scrollToBottom = function () {
    (0, vue_1.nextTick)(function () {
        if (messagesAreaRef.value) {
            messagesAreaRef.value.scrollTop = messagesAreaRef.value.scrollHeight;
        }
    });
};
// 打字效果函数
var startTypewriter = function () {
    if (typewriterTimer) {
        clearInterval(typewriterTimer);
    }
    typewriterTimer = setInterval(function () {
        if (typewriterQueue.value.length === 0) {
            clearInterval(typewriterTimer);
            typewriterTimer = null;
            return;
        }
        // 添加安全检查
        if (!currentAssistantMessage.value) {
            console.warn('当前助手消息引用为空，停止打字效果');
            typewriterQueue.value = [];
            clearInterval(typewriterTimer);
            typewriterTimer = null;
            return;
        }
        var nextChar = typewriterQueue.value.shift();
        currentAssistantMessage.value.content += nextChar;
        scrollToBottom();
    }, 30);
};
// 添加文本到打字队列
var addToTypewriterQueue = function (text) {
    var _a;
    (_a = typewriterQueue.value).push.apply(_a, text.split(''));
    if (!typewriterTimer) {
        startTypewriter();
    }
};
// 停止打字效果
var stopTypewriter = function () {
    if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
    }
    // 立即显示剩余的所有文本
    if (currentAssistantMessage.value && typewriterQueue.value.length > 0) {
        currentAssistantMessage.value.content += typewriterQueue.value.join('');
        typewriterQueue.value = [];
        scrollToBottom();
    }
    // 如果没有当前消息引用但还有队列，说明可能有问题
    else if (typewriterQueue.value.length > 0) {
        console.warn('打字队列中还有内容，但没有当前消息引用');
        typewriterQueue.value = [];
    }
};
var loadHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                historyLoading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                console.log('开始加载聊天历史...');
                return [4 /*yield*/, (0, chat_stu_1.getChatHistoryList)()];
            case 2:
                res = _a.sent();
                console.log('聊天历史响应:', res);
                if (res && Array.isArray(res.chats)) {
                    chatHistory.value = res.chats;
                    console.log("\u6210\u529F\u52A0\u8F7D ".concat(res.chats.length, " \u6761\u5386\u53F2\u8BB0\u5F55:"), res.chats);
                }
                else if (res && res.chats) {
                    // 如果chats不是数组，尝试转换
                    chatHistory.value = [];
                    console.warn('历史记录格式异常:', res);
                }
                else {
                    console.warn('历史记录响应格式不正确:', res);
                    chatHistory.value = [];
                }
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('加载聊天历史失败:', error_1);
                chatHistory.value = [];
                // 更详细的错误提示
                if (error_1 instanceof Error) {
                    console.error('错误详情:', error_1.message);
                    if (error_1.message.includes('401')) {
                        alert('登录已过期，请重新登录');
                        handleLogout();
                    }
                    else if (error_1.message.includes('404')) {
                        console.log('暂无历史记录');
                    }
                    else {
                        console.error("\u52A0\u8F7D\u804A\u5929\u5386\u53F2\u5931\u8D25: ".concat(error_1.message));
                    }
                }
                else {
                    console.error('未知错误:', error_1);
                }
                return [3 /*break*/, 5];
            case 4:
                historyLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var loadChatSession = function (chatId) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isReplying.value)
                    return [2 /*return*/];
                // 停止当前的打字效果
                stopTypewriter();
                activeChatId.value = chatId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, chat_stu_1.getChatSession)(chatId)];
            case 2:
                res = _a.sent();
                messages.value = res.messages;
                scrollToBottom();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('加载对话内容失败:', error_2);
                alert('加载对话内容失败');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var startNewChat = function () {
    if (isReplying.value)
        return;
    // 停止当前的打字效果
    stopTypewriter();
    activeChatId.value = null;
    messages.value = [];
    userInput.value = '';
};
var sendMessage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userMessage, assistantMessage, isNewChat, hasReceivedContent, error_3, errorMessage, waitForTypewriterComplete_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userInput.value.trim() || isReplying.value)
                    return [2 /*return*/];
                userMessage = { role: 'user', content: userInput.value };
                messages.value.push(userMessage);
                userInput.value = '';
                isReplying.value = true;
                scrollToBottom();
                assistantMessage = { role: 'assistant', content: '' };
                messages.value.push(assistantMessage);
                currentAssistantMessage.value = assistantMessage;
                scrollToBottom();
                isNewChat = activeChatId.value === null;
                hasReceivedContent = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 7]);
                return [4 /*yield*/, (0, chat_stu_1.streamChat)({
                        messages: messages.value.slice(0, -1),
                        chat_id: activeChatId.value,
                        max_tokens: 4096,
                        temperature: 0.7,
                        stream: true,
                    }, function (chunk, chatId) {
                        // 将接收到的文本块添加到打字队列
                        if (chunk) {
                            hasReceivedContent = true;
                            addToTypewriterQueue(chunk);
                        }
                        // 如果是新对话且收到了 chat_id，则更新状态并刷新历史列表
                        if (isNewChat && chatId && !activeChatId.value) {
                            activeChatId.value = chatId;
                            isNewChat = false;
                            loadHistory();
                        }
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 7];
            case 3:
                error_3 = _a.sent();
                // 停止打字效果并显示错误
                stopTypewriter();
                errorMessage = error_3 instanceof Error ? error_3.message : String(error_3);
                assistantMessage.content = "\u62B1\u6B49\uFF0C\u51FA\u9519\u4E86: ".concat(errorMessage);
                console.error('发送消息失败:', error_3);
                return [3 /*break*/, 7];
            case 4:
                isReplying.value = false;
                waitForTypewriterComplete_1 = function () {
                    if (typewriterQueue.value.length > 0 || typewriterTimer !== null) {
                        setTimeout(waitForTypewriterComplete_1, 50);
                    }
                    else {
                        currentAssistantMessage.value = null;
                    }
                };
                // 确保所有文本都已显示
                setTimeout(function () {
                    stopTypewriter();
                    waitForTypewriterComplete_1();
                }, 100);
                if (!(isNewChat && activeChatId.value)) return [3 /*break*/, 6];
                return [4 /*yield*/, loadHistory()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                scrollToBottom();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
var formatDate = function (dateString) {
    return new Date(dateString).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
var handleLogout = function () {
    if (confirm('确定要退出登录吗？')) {
        // 停止打字效果
        stopTypewriter();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
};
(0, vue_1.onMounted)(function () {
    loadHistory();
});
// 组件卸载时清理定时器
(0, vue_1.onUnmounted)(function () {
    stopTypewriter();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['history-header']} */ ;
/** @type {__VLS_StyleScopedClasses['new-chat-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['new-chat-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['history-list']} */ ;
/** @type {__VLS_StyleScopedClasses['history-list']} */ ;
/** @type {__VLS_StyleScopedClasses['history-list']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['message-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['message-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['assistant']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-indicator']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "student-layout" }));
/** @type {[typeof Sidebar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SideBar_vue_1.default, new SideBar_vue_1.default({
    menuItems: (__VLS_ctx.studentMenuItems),
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        menuItems: (__VLS_ctx.studentMenuItems),
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "main" }));
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
var __VLS_3 = __VLS_asFunctionalComponent(PageHeader_vue_1.default, new PageHeader_vue_1.default({
    title: "LuminoEdu 学习助手",
}));
var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{
        title: "LuminoEdu 学习助手",
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "chat-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "history-panel" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "history-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.startNewChat) }, { class: "new-chat-btn" }), { disabled: (__VLS_ctx.isReplying) }));
if (__VLS_ctx.historyLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "history-loading" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "history-list" }));
    var _loop_1 = function (item) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.historyLoading))
                    return;
                __VLS_ctx.loadChatSession(item.chat_id);
            } }, { key: (item.chat_id) }), { class: ({ active: item.chat_id === __VLS_ctx.activeChatId }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "history-preview" }));
        (item.preview);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "history-date" }));
        (__VLS_ctx.formatDate(item.created_at));
    };
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.chatHistory)); _i < _a.length; _i++) {
        var item = _a[_i][0];
        _loop_1(item);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "chat-window" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "messages-area" }, { ref: "messagesAreaRef" }));
/** @type {typeof __VLS_ctx.messagesAreaRef} */ ;
if (__VLS_ctx.messages.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "welcome-message" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "welcome-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.messages)); _b < _c.length; _b++) {
        var _d = _c[_b], msg = _d[0], idx = _d[1];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (idx) }, { class: (['message-wrapper', msg.role]) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "message-bubble" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "message-content" }));
        (msg.content);
        if (msg.role === 'assistant' && __VLS_ctx.isReplying && idx === __VLS_ctx.messages.length - 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "typing-cursor" }));
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "input-area" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ onKeydown: (__VLS_ctx.sendMessage) }, { value: (__VLS_ctx.userInput), disabled: (__VLS_ctx.isReplying), placeholder: "请输入您的问题，按回车发送" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.sendMessage) }, { disabled: (__VLS_ctx.isReplying || !__VLS_ctx.userInput.trim()) }));
if (__VLS_ctx.isReplying) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "typing-indicator" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
/** @type {__VLS_StyleScopedClasses['student-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['history-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['history-header']} */ ;
/** @type {__VLS_StyleScopedClasses['new-chat-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['history-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['history-list']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['history-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['history-date']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-window']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-area']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-message']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-indicator']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({
    setup: function () {
        return {
            Sidebar: SideBar_vue_1.default,
            PageHeader: PageHeader_vue_1.default,
            username: username,
            studentMenuItems: studentMenuItems,
            chatHistory: chatHistory,
            historyLoading: historyLoading,
            messages: messages,
            activeChatId: activeChatId,
            userInput: userInput,
            isReplying: isReplying,
            messagesAreaRef: messagesAreaRef,
            loadChatSession: loadChatSession,
            startNewChat: startNewChat,
            sendMessage: sendMessage,
            formatDate: formatDate,
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
