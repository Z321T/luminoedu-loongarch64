import {createRouter,createWebHistory, }from 'vue-router'
import type{RouteRecordRaw} from 'vue-router'
import login from '@/views/login/login.vue'
// 学生界面
import course from '@/views/student/course.vue'
import course_detail_stu from '@/views/student/course_detail.vue'
import chat_stu from '@/views/student/chat_stu.vue'
import exercise_generate_stu from '@/views/student/exercise_generate_stu.vue'
import document_stu from '@/views/student/document_stu.vue'
import generate_stu from '@/views/student/generate_stu.vue'
import profile from '@/views/student/profile.vue'
// 教师界面
import course_th from '@/views/teacher/course_th.vue'
import course_create from '@/views/teacher/course_create.vue'
import course_detail_th from '@/views/teacher/course_detail.vue'
import chat_th from '@/views/teacher/chat_th.vue'
import exercise_generate_th from '@/views/teacher/exercise_generate_th.vue'
import document_th from '@/views/teacher/document_th.vue'
import generate_th from '@/views/teacher/generate_th.vue';
import PPT_generate from "@/views/teacher/PPT_generate.vue";
import PPT_files from "@/views/teacher/PPT_files.vue";
import PPT_outline from "@/views/teacher/PPT_outline.vue";
import profile_th from '@/views/teacher/profile_th.vue'
// admin界面
import log_management from '@/views/admin/log_management.vue'
import CreateTeacher from '@/views/admin/CreateTeacher.vue'
import CreateStudent from '@/views/admin/CreateStudent.vue'
import teacher_management from '@/views/admin/teacher_management.vue'
import student_management from '@/views/admin/student_management.vue'
import model_management from '@/views/admin/model_management.vue';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    // 学生端路由
    {
        path: '/student/course',
        name: 'course',
        component: course,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/student/course/:courseId',
        name: 'course_detail_stu',
        component: course_detail_stu,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/student/chat',
        name: 'chat_stu',
        component: chat_stu,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/student/exercise_generate',
        name: 'exercise_generate_stu',
        component: exercise_generate_stu,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/student/exercise_generate/document',
        name: 'document_stu',
        component: document_stu,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/student/exercise_generate/generate',
        name: 'generate_stu',
        component: generate_stu,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/student/profile',
        name: 'profile',
        component: profile,
        meta: { requiresAuth: true, role: 'student' }
    },
    // 教师端路由
    {
        path: '/teacher/course',
        name: 'course_th',
        component: course_th,
        meta: { requiresAuth: true , role: 'teacher' }
    },
     {
        path: '/teacher/course/create',
        name: 'course_create',
        component: course_create,
        meta: { requiresAuth: true , role: 'teacher' }
    },
    {
        path: '/teacher/course/detail/:courseId',
        name: 'course_detail_th',
        component: course_detail_th,
        meta: { requiresAuth: true , role: 'teacher' }
    },
    {
        path: '/teacher/chat',
        name: 'chat_th',
        component: chat_th,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/exercise_generate',
        name: 'exercise_generate_th',
        component: exercise_generate_th,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/exercise_generate/document',
        name: 'document_th',
        component: document_th,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/exercise_generate/generate',
        name: 'generate_th',
        component: generate_th,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/ppt/generate',
        name: 'PPT_generate',
        component: PPT_generate,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/ppt/files',
        name: 'PPT_files',
        component: PPT_files,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/ppt/outline',
        name: 'PPT_outline',
        component: PPT_outline,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/teacher/profile',
        name: 'profile_th',
        component: profile_th,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    // 管理员端路由
    {
        path: '/admin/log_management',
        name: 'log_management',
        component: log_management,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/create_teacher',
        name: 'CreateTeacher',
        component: CreateTeacher,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/create_student',
        name: 'CreateStudent',
        component: CreateStudent,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/student_management',
        name: 'student_management',
        component: student_management,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/teacher_management',
        name: 'teacher_management',
        component: teacher_management,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/model_management',
        name: 'model_management',
        component: model_management,
        meta: { requiresAuth: true, role: 'admin' }
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router