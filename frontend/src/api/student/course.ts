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

// 定义课程接口类型
export interface Course {
  id: number
  name: string
  description: string
  semester: string
  credit: number
  start_date: string
  end_date: string
  teacher_name: string
}

export interface CourseResponse {
  total: number
  courses: Course[]
}

// 获取学生课程列表
export const getStudentCourses = async (): Promise<CourseResponse> => {
    try {
        const response = await api.get<CourseResponse>('/student/course/')
        return response.data
    } catch (error: any) {
        console.error('请求失败:', error)

        // 更详细的错误处理
        if (error.response) {
            // 服务器返回了错误状态码
            const status = error.response.status
            const message = error.response.data?.detail || error.response.statusText || '请求失败'
            throw new Error(`${status}: ${message}`)
        } else if (error.request) {
            // 请求已发出但没有收到响应
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            // 其他错误
            throw new Error(error.message || '获取课程失败')
        }
    }
}

// 根据日期判断课程状态
export const getCourseStatus = (course: Course): string => {
  const today = new Date()
  const startDate = new Date(course.start_date)
  const endDate = new Date(course.end_date)

  if (today < startDate) {
    return 'upcoming'
  } else if (today > endDate) {
    return 'completed'
  } else {
    return 'active'
  }
}

// 格式化日期
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 获取状态文本
export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '进行中',
    completed: '已结束',
    upcoming: '即将开始'
  }
  return statusMap[status] || status
}