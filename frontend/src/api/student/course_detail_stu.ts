import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000,
})

// 请求拦截器 - 添加认证信息
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// 课程详情接口类型
export interface CourseDetail {
    id: number
    name: string
    description: string
    semester: string
    credit: number
    start_date: string
    end_date: string
    teacher_name: string
}

// 通知接口类型
export interface Notification {
    id: number
    title: string
    content: string
    priority: number
    require_confirmation: boolean
    publish_time: string
    course_name: string
    teacher_name: string
    is_confirmed: boolean
    confirmed_at: string | null
}

export interface NotificationResponse {
    notifications: Notification[]
    total_count: number
    page: number
    page_size: number
    total_pages: number
}

// 课程资料接口类型
export interface CourseMaterial {
    file_name: string
    upload_time: string
    uploader_name: string
}

export interface MaterialResponse {
    total: number
    materials: CourseMaterial[]
}

// 课程通知详情接口类型
export interface NotificationDetail {
    id: number
    title: string
    content: string
    priority: number
    require_confirmation: boolean
    publish_time: string
    course_name: string
    teacher_name: string
    is_confirmed: boolean
}

export interface ConfirmResponse {
    success: boolean
    message: string
}

// 获取课程详情
export const getCourseDetail = async (courseId: number): Promise<CourseDetail> => {
    try {
        const response = await api.get<CourseDetail>(`/student/course/${courseId}`)
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message || '获取课程详情失败')
    }
}

// 获取课程通知
export const getCourseNotifications = async (
    courseId: number,
    page: number = 1,
    pageSize: number = 20
): Promise<NotificationResponse> => {
    try {
        const response = await api.get<NotificationResponse>(
            '/student/course_notification/notifications',
            {
                params: {
                    course_id: courseId,
                    page: page,
                    page_size: pageSize
                }
            }
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message || '获取课程通知失败')
    }
}

// 获取通知详情
export const getNotificationDetail = async (notificationId: number): Promise<NotificationDetail> => {
    try {
        const response = await api.get<NotificationDetail>(
            `/student/course_notification/notifications/${notificationId}`
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message || '获取通知详情失败')
    }
}

// 确认通知
export const confirmNotification = async (notificationId: number): Promise<ConfirmResponse> => {
    try {
        const response = await api.post<ConfirmResponse>(
            `/student/course_notification/notifications/${notificationId}/confirm`
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message || '确认通知失败')
    }
}

// 获取课程资料
export const getCourseMaterials = async (courseId: number): Promise<MaterialResponse> => {
    try {
        const response = await api.get<MaterialResponse>(
            `/student/course/courses/${courseId}/materials`
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message || '获取课程资料失败')
    }
}

// 下载课程资料
export const downloadCourseMaterial = async (courseId: number, fileName: string): Promise<void> => {
    try {
        const response = await api.get(
            `/student/course/courses/${courseId}/download/${encodeURIComponent(fileName)}`,
            {
                responseType: 'blob'
            }
        )

        // 创建下载链接
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message || '下载文件失败')
    }
}

// 格式化日期时间
export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN')
}

// 获取优先级文本
export const getPriorityText = (priority: number): string => {
    const priorityMap: Record<number, string> = {
        1: '普通',
        2: '重要',
        3: '紧急'
    }
    return priorityMap[priority] || '普通'
}

// 获取优先级样式类
export const getPriorityClass = (priority: number): string => {
    const classMap: Record<number, string> = {
        1: 'normal',
        2: 'important',
        3: 'urgent'
    }
    return classMap[priority] || 'normal'
}