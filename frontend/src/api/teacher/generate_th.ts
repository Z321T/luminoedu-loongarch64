import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000, // 生成习题可能需要较长时间
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
    (error) => {
        return Promise.reject(error)
    }
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

// 定义通用错误处理函数
const handleError = (error: any, defaultMessage: string): Error => {
    if (error.response) {
        return new Error(error.response.data?.detail || error.response.data?.message || defaultMessage)
    } else if (error.request) {
        return new Error('网络连接失败，请检查网络设置')
    } else {
        return new Error('请求失败，请稍后重试')
    }
}

// 定义生成请求类型
export interface GenerateRequest {
    document_id?: string
    content?: string
    title: string
    count: number
    types: number[]
    use_knowledge_matching: boolean
}

// 定义生成响应类型
export interface GenerateResponse {
    md_filename: string
    json_filename: string
    exercise_count: number
    document_id?: string
    used_knowledge_matching: boolean
    message: string
}

// 定义习题文件信息类型
export interface ExerciseFile {
    filename: string
    created_at: string
    size_kb: number
}

// 定义文件列表响应类型
export interface ExerciseListResponse {
    exercises: ExerciseFile[]
}

// 定义文件内容响应类型
export interface FileContentResponse {
    content: string
}

// 定义文档信息类型
export interface DocumentInfo {
    document_id: string
    title: string
    filename: string
    created_at: string
}

// 生成习题
export const generateExercise = async (request: GenerateRequest): Promise<GenerateResponse> => {
    try {
        const response = await api.post<GenerateResponse>('/teacher/exercise_generator/generate', request)
        return response.data
    } catch (error: any) {
        throw handleError(error, '生成习题失败')
    }
}

// 获取文件内容
export const getFileContent = async (fileName: string): Promise<string> => {
    try {
        const response = await api.get<FileContentResponse>(`/teacher/exercise_generator/file_md_content/${fileName}`)
        return response.data.content
    } catch (error: any) {
        throw handleError(error, '获取文件内容失败')
    }
}

// 下载文件
export const downloadFile = async (fileName: string): Promise<Blob> => {
    try {
        const response = await api.get(`/teacher/exercise_generator/download/${fileName}`, {
            responseType: 'blob'
        })
        return response.data
    } catch (error: any) {
        throw handleError(error, '下载文件失败')
    }
}

// 获取习题文件列表
export const getExerciseList = async (limit: number = 50, titleFilter?: string): Promise<ExerciseFile[]> => {
    try {
        const params: any = { limit }
        if (titleFilter) {
            params.title_filter = titleFilter
        }
        const response = await api.get<ExerciseListResponse>('/teacher/exercise_generator/list', { params })
        return response.data.exercises
    } catch (error: any) {
        throw handleError(error, '获取习题列表失败')
    }
}

// 删除习题文件
export const deleteExerciseFile = async (fileName: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete<{ message: string }>(`/teacher/exercise_generator/delete/${fileName}`)
        return response.data
    } catch (error: any) {
        throw handleError(error, '删除文件失败')
    }
}

// 获取向量化文档列表
export const getVectorizedDocuments = async (): Promise<DocumentInfo[]> => {
    try {
        const response = await api.get<{ documents: DocumentInfo[] }>('/teacher/document_vectorization/list')
        return response.data.documents || []
    } catch (error: any) {
        throw handleError(error, '获取向量化文档列表失败')
    }
}