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
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
)

// 日志服务接口
export interface LogService {
  name: string
  description: string
}

// 获取日志服务列表响应接口
export interface LogServicesResponse {
  services: LogService[]
}

// 日志条目接口
export interface LogEntry {
  id: number
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'
  module: string
  user?: string
  message: string
  details?: any
  stackTrace?: string
}

// 获取日志列表请求参数接口
export interface GetLogsRequest {
  service?: string
  level?: string
  module?: string
  user?: string
  start_time?: string
  end_time?: string
  search?: string
  page?: number
  page_size?: number
}

// 获取日志列表响应接口
export interface GetLogsResponse {
  logs: LogEntry[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// 日志文件接口
export interface LogFile {
  name: string
  date: string
  size: string
}

// 获取日志文件列表请求参数接口
export interface GetLogFilesRequest {
  service_name: string
  start_date?: string
  end_date?: string
}

// 获取日志文件列表响应接口
export interface GetLogFilesResponse {
  files: LogFile[]
  service_name: string
  service_description: string
}

// 获取日志文件内容请求参数接口
export interface GetLogFileContentRequest {
  service_name: string
  file_name: string
}

// 获取日志文件内容响应接口
export interface GetLogFileContentResponse {
  content: string[]
  file_name: string
  service_name: string
}

/**
 * 获取所有可用的日志服务列表
 */
export const getLogServices = async (): Promise<LogServicesResponse> => {
  try {
    console.log('开始获取日志服务列表')

    const response = await api.get('/admin/log_management/services')

    console.log('获取日志服务列表成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法访问日志服务')
      case 404:
        throw new Error('日志服务接口不存在')
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '获取日志服务失败'}`)
      default:
        throw new Error(errorData?.message || `获取日志服务失败(${status})`)
    }
  }
}

/**
 * 获取日志列表 - 支持分页和搜索
 */
export const getLogs = async (
    page: number = 1,
    pageSize: number = 50,
    params: Omit<GetLogsRequest, 'page' | 'page_size'> = {},
    retryCount: number = 3
): Promise<GetLogsResponse> => {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    })

    // 添加其他筛选参数
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    try {
      console.log('开始获取日志列表:', { page, pageSize, params })

      const response = await api.get(`/admin/log_management/logs?${queryParams}`)

      console.log('获取日志列表成功:', response.data)
      return response.data
    } catch (error: any) {
      // 如果是500错误且还有重试次数，进行重试
      if (error.response?.status === 500 && retryCount > 0) {
        console.log(`日志请求失败，${retryCount}秒后重试...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return getLogs(page, pageSize, params, retryCount - 1)
      }
      throw error
    }

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查查询参数'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法访问日志')
      case 404:
        throw new Error('日志接口不存在')
      case 500:
        throw new Error(`服务器内部错误: ${errorData?.detail || '日志服务暂时不可用'}`)
      default:
        throw new Error(errorData?.message || `获取日志失败(${status})`)
    }
  }
}
/**
 * 获取指定服务的日志文件列表
 */
export const getLogFiles = async (params: GetLogFilesRequest): Promise<GetLogFilesResponse> => {
  try {
    console.log('开始获取日志文件列表:', params)

    if (!params.service_name) {
      throw new Error('服务名称不能为空')
    }

    // 构建查询参数
    const queryParams = new URLSearchParams({
      service_name: params.service_name
    })

    // 添加可选的日期参数
    if (params.start_date) {
      queryParams.append('start_date', params.start_date)
    }
    if (params.end_date) {
      queryParams.append('end_date', params.end_date)
    }

    const response = await api.get(`/admin/log_management/files?${queryParams}`)

    console.log('获取日志文件列表成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查服务名称和日期格式'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法访问该服务的日志文件')
      case 404:
        throw new Error(`未找到服务 ${params.service_name} 的日志文件`)
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '获取日志文件列表失败'}`)
      default:
        throw new Error(errorData?.message || `获取日志文件列表失败(${status})`)
    }
  }
}
/**
 * 获取指定日志文件的内容
 */
export const getLogFileContent = async (params: GetLogFileContentRequest): Promise<GetLogFileContentResponse> => {
  try {
    console.log('开始获取日志文件内容:', params)

    if (!params.service_name) {
      throw new Error('服务名称不能为空')
    }

    if (!params.file_name) {
      throw new Error('文件名称不能为空')
    }

    // 构建查询参数
    const queryParams = new URLSearchParams({
      service_name: params.service_name,
      file_name: params.file_name
    })

    const response = await api.get(`/admin/log_management/content?${queryParams}`, {
      timeout: 30000 // 读取文件内容可能需要较长时间
    })

    console.log('获取日志文件内容成功:', {
      fileName: response.data.file_name,
      serviceName: response.data.service_name,
      lineCount: response.data.content?.length || 0
    })

    return response.data

  } catch (error: any) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('读取文件超时，文件较大，请稍后重试')
      }
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查服务名称和文件名'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法访问该日志文件')
      case 404:
        throw new Error(`未找到文件: ${params.file_name}`)
      case 413:
        throw new Error('文件过大，无法直接查看，请下载后查看')
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '读取文件内容失败'}`)
      default:
        throw new Error(errorData?.message || `获取日志文件内容失败(${status})`)
    }
  }
}

// 工具函数：格式化文件大小
export const formatFileSize = (sizeStr: string): string => {
  try {
    const size = parseFloat(sizeStr)
    if (isNaN(size)) return sizeStr

    const units = ['B', 'KB', 'MB', 'GB']
    let unitIndex = 0
    let formattedSize = size

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024
      unitIndex++
    }

    return `${formattedSize.toFixed(2)} ${units[unitIndex]}`
  } catch (error) {
    return sizeStr
  }
}

// 工具函数：格式化文件日期
export const formatFileDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateStr
  }
}

// 工具函数：本地触发文件下载
export const triggerDownload = (blob: Blob, filename: string): void => {
  try {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    console.log('📥 文件下载成功:', filename)
  } catch (error) {
    console.error('❌ 文件下载失败:', error)
    throw new Error('文件下载失败，请重试')
  }
}

// 工具函数：深度克隆
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const copy: any = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as any)[key])
    })
    return copy
  }
  return obj
}


/**
 * 导出指定服务的日志文件（合并多个文件）
 */
export const exportServiceLogs = async (
    serviceName: string,
    startDate?: string,
    endDate?: string
): Promise<Blob> => {
  try {
    console.log('开始导出服务日志:', { serviceName, startDate, endDate })

    if (!serviceName) {
      throw new Error('服务名称不能为空')
    }

    // 构建查询参数
    const queryParams = new URLSearchParams({
      service_name: serviceName
    })

    // 添加可选的日期参数
    if (startDate) {
      queryParams.append('start_date', startDate)
    }
    if (endDate) {
      queryParams.append('end_date', endDate)
    }

    // 修改：直接将 queryParams 对象传给 params 选项，而不是手动拼接URL
    const response = await api.get('/admin/log_management/export', {
      params: queryParams, // 让 axios 处理参数
      responseType: 'blob',
      timeout: 120000 // 导出可能需要较长时间
    })

    console.log('导出服务日志成功')

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'text/plain;charset=utf-8'
    })

    return blob

  } catch (error: any) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('导出超时，日志文件较大，请稍后重试')
      }
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    // 注意：Blob 类型的错误响应需要特殊处理才能读取JSON内容
    let errorDetail = `导出日志文件失败(${status})`
    if (error.response.data instanceof Blob && error.response.data.type.includes('application/json')) {
      try {
        const errorJson = JSON.parse(await error.response.data.text());
        errorDetail = errorJson.detail || JSON.stringify(errorJson);
      } catch (e) {
        // 解析失败则使用默认错误信息
      }
    }

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorDetail}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法导出该服务的日志')
      case 404:
        throw new Error(`未找到服务 ${serviceName} 的日志文件或导出接口不存在`)
      case 500:
        throw new Error(`服务器错误: ${errorDetail}`)
      default:
        throw new Error(errorDetail)
    }
  }
}
