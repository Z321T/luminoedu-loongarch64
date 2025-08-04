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

// 定义文档接口类型
export interface DocumentInfo {
    document_id: string
    title: string
    filename: string
    content_hash: string
    created_at: string
    chunk_count: number
    file_size: number
    collection_id: string
}

// 定义上传响应类型
export interface UploadResponse {
    document_id: string
    title: string
    is_new: boolean
    chunk_count: number
    message: string
}

// 定义列表响应类型
export interface DocumentListResponse {
    documents: DocumentInfo[]
}

// 定义搜索响应类型
export interface SearchResponse {
    documents: DocumentInfo[]
}

// 定义删除响应类型
export interface DeleteResponse {
    message: string
}

// 上传文档
export const uploadDocument = async (file: File, title: string): Promise<UploadResponse> => {
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title)

        const response = await api.post<UploadResponse>('/teacher/document_vectorization/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error: any) {
        console.error('上传文档失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '上传失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('上传请求失败')
        }
    }
}

// 获取文档列表
export const getDocumentList = async (): Promise<DocumentInfo[]> => {
    try {
        const response = await api.get<DocumentListResponse>('/teacher/document_vectorization/list')
        return response.data.documents
    } catch (error: any) {
        console.error('获取文档列表失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '获取文档列表失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('获取文档列表请求失败')
        }
    }
}

// 搜索文档
export const searchDocuments = async (keyword: string, limit: number = 20): Promise<DocumentInfo[]> => {
    try {
        const response = await api.get<SearchResponse>('/teacher/document_vectorization/search', {
            params: { keyword, limit }
        })
        return response.data.documents
    } catch (error: any) {
        console.error('搜索文档失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '搜索失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('搜索请求失败')
        }
    }
}

// 删除文档
export const deleteDocument = async (documentId: string): Promise<string> => {
    try {
        const response = await api.delete<DeleteResponse>(`/teacher/document_vectorization/delete/${documentId}`)
        return response.data.message
    } catch (error: any) {
        console.error('删除文档失败:', error)
        if (error.response) {
            throw new Error(error.response.data?.detail || error.response.data?.message || '删除失败')
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络设置')
        } else {
            throw new Error('删除请求失败')
        }
    }
}