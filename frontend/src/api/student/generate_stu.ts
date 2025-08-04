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

// 生成习题
export const generateExercise = async (request: GenerateRequest): Promise<GenerateResponse> => {
    try {
        const response = await api.post<GenerateResponse>('/student/exercise_generator/generate', request)
        return response.data
    } catch (error: any) {
        console.error('生成习题失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '生成失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('生成请求失败')
        }
    }
}

// 获取文件内容
export const getFileContent = async (fileName: string): Promise<string> => {
    try {
        const response = await api.get<FileContentResponse>(`/student/exercise_generator/file_md_content/${fileName}`)
        return response.data.content
    } catch (error: any) {
        console.error('获取文件内容失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '获取文件内容失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('获取文件内容请求失败')
        }
    }
}

// 下载文件
export const downloadFile = async (fileName: string): Promise<Blob> => {
    try {
        const response = await api.get(`/student/exercise_generator/download/${fileName}`, {
            responseType: 'blob'
        })
        return response.data
    } catch (error: any) {
        console.error('下载文件失败:', error)
        if (error.response) {
            throw new Error('下载失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('下载请求失败')
        }
    }
}

// 获取习题文件列表
export const getExerciseList = async (limit: number = 50, titleFilter?: string): Promise<ExerciseFile[]> => {
    try {
        const params: any = { limit }
        if (titleFilter) {
            params.title_filter = titleFilter
        }

        const response = await api.get<ExerciseListResponse>('/student/exercise_generator/list', { params })
        return response.data.exercises
    } catch (error: any) {
        console.error('获取习题列表失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '获取习题列表失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('获取习题列表请求失败')
        }
    }
}

// 删除习题文件
export const deleteExerciseFile = async (fileName: string): Promise<string> => {
    try {
        const response = await api.delete<string>(`/student/exercise_generator/delete/${fileName}`)
        return response.data
    } catch (error: any) {
        console.error('删除文件失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '删除失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('删除请求失败')
        }
    }
}

// 添加DocumentInfo类型定义
export interface DocumentInfo {
    document_id: string
    title: string
    filename: string
    created_at: string
    vectorization_status: string
}

// 获取向量化文档列表的专用API
export const getVectorizedDocuments = async (): Promise<DocumentInfo[]> => {
    try {
        console.log('调用向量化文档列表API')
        const response = await api.get('/student/document_vectorization/list')
        console.log('向量化文档列表响应:', response.data)
        return response.data.documents || []
    } catch (error: any) {
        console.error('获取向量化文档列表失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || '获取文档列表失败')
        }
        throw new Error('网络错误，请检查连接')
    }
}