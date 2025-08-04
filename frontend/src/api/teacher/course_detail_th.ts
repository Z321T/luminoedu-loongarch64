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


// 教师课程详情接口
export interface TeacherCourseDetail {
    id: number
    name: string
    description: string
    semester: string
    credit: number
    start_date: string
    end_date: string
    students: CourseStudent[]
}

export interface CourseStudent {
    name: string
    student_id: string
    college: string
    grade: string
}

// 获取教师课程详情
export const getTeacherCourseDetail = async (courseId: number): Promise<TeacherCourseDetail> => {
    try {
        const response = await api.get<TeacherCourseDetail>(`/teacher/course/${courseId}`)
        return response.data
    } catch (error: any) {
        console.error('获取课程详情失败:', error)
        throw new Error(error.response?.data?.detail || '获取课程详情失败')
    }
}



// 教师通知接口
export interface TeacherNotification {
    id: number
    title: string
    priority: number
    require_confirmation: boolean
    publish_time: string
    confirmed_students: number
    total_students: number
}

export interface TeacherNotificationResponse {
    notifications: TeacherNotification[]
    total_count: number
    page: number
    page_size: number
    total_pages: number
}

// 获取课程通知
export const getCourseNotifications = async (
    courseId: number,
    page: number = 1,
    pageSize: number = 20
): Promise<TeacherNotificationResponse> => {
    try {
        const response = await api.get<TeacherNotificationResponse>(
            `/teacher/course_notification/${courseId}/notifications`,
            {
                params: { page, page_size: pageSize }
            }
        )
        return response.data
    } catch (error: any) {
        console.error('获取课程通知失败:', error)
        throw new Error(error.response?.data?.detail || '获取课程通知失败')
    }
}



// 更新通知响应接口
export interface UpdateNotificationResponse {
    success: boolean
    message: string
    notification_id: number
}

// 更新课程通知
export const updateNotification = async (
    courseId: number,
    notificationId: number,
    notificationData: CreateNotificationRequest
): Promise<UpdateNotificationResponse> => {
    try {
        const response = await api.put<UpdateNotificationResponse>(
            `/teacher/course_notification/${courseId}/notifications/${notificationId}`,
            notificationData
        )
        return response.data
    } catch (error: any) {
        console.error('更新通知失败:', error)
        throw new Error(error.response?.data?.detail || '更新通知失败')
    }
}



// 创建通知请求接口
export interface CreateNotificationRequest {
    title: string
    content: string
    priority: number
    require_confirmation: boolean
}

// 创建通知响应接口
export interface CreateNotificationResponse {
    success: boolean
    message: string
    notification_id: number
}

// 通知详情接口
export interface NotificationDetail {
    id: number
    title: string
    content: string
    priority: number
    require_confirmation: boolean
    publish_time: string
    total_students: number
    confirmed_students: number
    confirmation_rate: number
    confirmations: NotificationConfirmation[]
}

export interface NotificationConfirmation {
    student_id: number
    student_name: string
    student_number: string
    confirmed_at: string
}

// 创建课程通知
export const createNotification = async (
    courseId: number,
    notificationData: CreateNotificationRequest
): Promise<CreateNotificationResponse> => {
    try {
        const response = await api.post<CreateNotificationResponse>(
            `/teacher/course_notification/${courseId}/notifications`,
            notificationData
        )
        return response.data
    } catch (error: any) {
        console.error('创建通知失败:', error)
        throw new Error(error.response?.data?.detail || '创建通知失败')
    }
}

// 获取通知详情
export const getNotificationDetail = async (
    courseId: number,
    notificationId: number
): Promise<NotificationDetail> => {
    try {
        const response = await api.get<NotificationDetail>(
            `/teacher/course_notification/${courseId}/notifications/${notificationId}`
        )
        return response.data
    } catch (error: any) {
        console.error('获取通知详情失败:', error)
        throw new Error(error.response?.data?.detail || '获取通知详情失败')
    }
}

// 验证文件类型
export const validateFileType = (file: File): boolean => {
    const allowedExtensions = [
        '.pdf', '.doc', '.docx', '.txt', '.md',
        '.xls', '.xlsx',
        '.ppt', '.pptx',
        '.zip', '.rar', '.7z', '.tar', '.gz',
        '.jpg', '.jpeg', '.png', '.gif',
        '.mp4', '.avi', '.mov'
    ]

    const fileName = file.name.toLowerCase()
    return allowedExtensions.some(ext => fileName.endsWith(ext))
}

// 验证文件大小（2GB限制）
export const validateFileSize = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024 * 1024 // 2GB
    return file.size <= maxSize
}



// 课程资料接口
export interface CourseMaterial {
    filename: string
    file_size: number
    upload_time: string
    file_extension: string
}

export interface CourseMaterialResponse {
    course_id: number
    course_name: string
    materials: CourseMaterial[]
    total_count: number
}

// 获取课程资料
export const getCourseMaterials = async (courseId: number): Promise<CourseMaterialResponse> => {
    try {
        const response = await api.get<CourseMaterialResponse>(`/teacher/course_material/${courseId}/materials`)
        return response.data
    } catch (error: any) {
        console.error('获取课程资料失败:', error)
        throw new Error(error.response?.data?.detail || '获取课程资料失败')
    }
}

// 优先级文本映射
export const getPriorityText = (priority: number): string => {
    const priorityMap: Record<number, string> = {
        1: '普通',
        2: '重要',
        3: '紧急'
    }
    return priorityMap[priority] || '普通'
}

// 优先级样式类名
export const getPriorityClass = (priority: number): string => {
    const classMap: Record<number, string> = {
        1: 'normal',
        2: 'important',
        3: 'urgent'
    }
    return classMap[priority] || 'normal'
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}



// 导入学生响应接口
export interface ImportStudentsResponse {
    success: boolean
    total: number
    added: number
    failed: string[]
    message: string
}

// 导入学生
export const importStudents = async (
    courseId: number,
    file: File
): Promise<ImportStudentsResponse> => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post<ImportStudentsResponse>(
            `/teacher/course/${courseId}/add_students`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    } catch (error: any) {
        console.error('导入学生失败:', error)
        throw new Error(error.response?.data?.detail || '导入学生失败')
    }
}

// 下载学生导入模板
export const downloadStudentTemplate = async (): Promise<void> => {
    try {
        const response = await api.get(
            '/teacher/course/template/add_students',
            {
                responseType: 'blob'
            }
        )

        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'add_student_template.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error: any) {
        console.error('下载模板失败:', error)
        throw new Error(error.response?.data?.detail || '下载模板失败')
    }
}

// 验证Excel文件类型
export const validateExcelFileType = (file: File): boolean => {
    const allowedExtensions = ['.xlsx', '.xls']
    const fileName = file.name.toLowerCase()
    return allowedExtensions.some(ext => fileName.endsWith(ext))
}



// 删除课程学生响应接口
export interface RemoveStudentsResponse {
    success: boolean
    removed: number
    message: string
}

// 批量删除课程学生
export const removeStudentsFromCourse = async (
    courseId: number,
    studentIds: string[]
): Promise<RemoveStudentsResponse> => {
    try {
        const response = await api.delete<RemoveStudentsResponse>(
            `/teacher/course/${courseId}/students`,
            {
                data: { student_ids: studentIds }
            }
        )
        return response.data
    } catch (error: any) {
        console.error('删除学生失败:', error)
        throw new Error(error.response?.data?.detail || '删除学生失败')
    }
}



// 上传文件响应接口
export interface UploadFileResponse {
    success: boolean
    filename: string
    file_size: number
    message: string
}

// 上传课程资料
export const uploadMaterial = async (
    courseId: number,
    file: File
): Promise<UploadFileResponse> => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post<UploadFileResponse>(
            `/teacher/course_material/${courseId}/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    } catch (error: any) {
        console.error('上传资料失败:', error)
        throw new Error(error.response?.data?.detail || '上传资料失败')
    }
}

// 删除课程资料响应接口
export interface DeleteMaterialResponse {
    success: boolean
    message: string
}

// 删除课程资料
export const deleteMaterial = async (
    courseId: number,
    filename: string
): Promise<DeleteMaterialResponse> => {
    try {
        const response = await api.delete<DeleteMaterialResponse>(
            `/teacher/course_material/${courseId}/materials/${encodeURIComponent(filename)}`
        )
        return response.data
    } catch (error: any) {
        console.error('删除资料失败:', error)
        throw new Error(error.response?.data?.detail || '删除资料失败')
    }
}



// 下载课程资料
export const downloadMaterial = async (
    courseId: number,
    filename: string
): Promise<void> => {
    try {
        const response = await api.get(
            `/teacher/course_material/${courseId}/download/${encodeURIComponent(filename)}`,
            {
                responseType: 'blob'
            }
        )

        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error: any) {
        console.error('下载资料失败:', error)
        throw new Error(error.response?.data?.detail || '下载资料失败')
    }
}


