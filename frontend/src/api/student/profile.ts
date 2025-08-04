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

// 定义用户信息接口类型
export interface UserProfile {
    username: string
    role: string
    student_id: string
    college: string
    major: string
    grade: string
    enrollment_year: number
    intro: string | null
    contact_email: string | null
}

// 定义更新信息接口类型
export interface UpdateProfileRequest {
    intro?: string
    contact_email?: string
}

// 定义修改密码接口类型
export interface ChangePasswordRequest {
    current_password: string
    new_password: string
}

// 定义API响应类型
export interface ApiResponse {
    status: string
    message: string
    data?: any
}

// 获取用户个人信息
export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await api.get<UserProfile>('/user/profile')
        return response.data
    } catch (error: any) {
        console.error('获取用户信息失败:', error)
        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.detail || error.response.statusText || '获取用户信息失败'
            throw new Error(`${status}: ${message}`)
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error(error.message || '获取用户信息失败')
        }
    }
}

// 更新用户个人信息
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<ApiResponse> => {
    try {
        const response = await api.put<ApiResponse>('/user/profile/student', data)
        return response.data
    } catch (error: any) {
        console.error('更新用户信息失败:', error)
        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.detail || error.response.statusText || '更新用户信息失败'
            throw new Error(`${status}: ${message}`)
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error(error.message || '更新用户信息失败')
        }
    }
}

// 修改密码
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    try {
        const response = await api.post<ApiResponse>('/user/change_password', data)
        return response.data
    } catch (error: any) {
        console.error('修改密码失败:', error)
        if (error.response) {
            const status = error.response.status
            // 处理验证错误 (422)
            if (status === 422 && error.response.data?.detail) {
                const details = error.response.data.detail
                if (Array.isArray(details) && details.length > 0) {
                    // 获取第一个验证错误信息
                    const firstError = details[0]
                    throw new Error(firstError.msg || '密码格式不正确')
                }
            }
            // 处理业务错误 (400)
            else if (status === 400 && error.response.data?.detail) {
                throw new Error(error.response.data.detail)
            }

            const message = error.response.data?.detail || error.response.statusText || '修改密码失败'
            throw new Error(`${status}: ${message}`)
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error(error.message || '修改密码失败')
        }
    }
}