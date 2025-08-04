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

// 课程接口定义
export interface Course_th {
  id: number
  name: string
  description: string
  semester: string
  credit: number
  start_date: string
  end_date: string
}

// 获取教师所有课程
export const getAllCourses = async (): Promise<Course_th[]> => {
  try {
    const response = await api.get<Course_th[]>('/teacher/course/list')
    return response.data
  } catch (error: any) {
    console.error('请求失败:', error)

    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.detail || error.response.statusText || '请求失败'
      throw new Error(`${status}: ${message}`)
    } else if (error.request) {
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      throw new Error(error.message || '获取课程失败')
    }
  }
}



// 删除课程响应类型
export interface DeleteCourseResponse {
  success: boolean
  message: string
}

// 删除课程
export const deleteCourse = async (courseId: number): Promise<DeleteCourseResponse> => {
  try {
    const response = await api.delete<DeleteCourseResponse>(`/teacher/course/${courseId}`)
    return response.data
  } catch (error: any) {
    console.error('删除课程失败:', error)

    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.detail || error.response.statusText || '删除失败'
      throw new Error(`${status}: ${message}`)
    } else if (error.request) {
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      throw new Error(error.message || '删除课程失败')
    }
  }
}



// 创建课程请求和响应类型
export interface CreateCourseRequest {
  name: string
  description: string
  semester: string
  credit: number
  start_date: string
  end_date: string
}

export interface CreateCourseResponse {
  id: number
  name: string
  description: string
}

// 创建课程
export const createCourse = async (courseData: CreateCourseRequest): Promise<CreateCourseResponse> => {
  try {
    const response = await api.post<CreateCourseResponse>('/teacher/course/create', courseData)
    return response.data
  } catch (error: any) {
    console.error('创建课程失败:', error)

    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.detail || error.response.statusText || '创建失败'
      throw new Error(`${status}: ${message}`)
    } else if (error.request) {
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      throw new Error(error.message || '创建课程失败')
    }
  }
}

// 格式化日期时间
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN')
}