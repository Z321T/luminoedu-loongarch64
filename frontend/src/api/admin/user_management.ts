import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000', // 确保使用正确的API基础路径
  timeout: 60000, // AI生成需要较长时间
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
// 类型定义
export interface CreateTeachersRequest {
  file: File
}

export interface CreateTeachersResponse {
  total: number
  success_count: number
  failed_count: number
  failed_records: Array<{
    username: string
    success: boolean
    error: string
  }>
}

export interface Teacher {
  id: string
  name: string
  subject: string
  email: string
  phone: string
  workId?: string
  remark?: string
  createdAt: string
}

/**
 * 批量创建教师 - 修复API路径
 */
export const createTeachers = async (file: File): Promise<CreateTeachersResponse> => {
  try {
    // 参数校验
    if (!file) throw new Error('请选择要上传的文件')
    if (!file.name) throw new Error('文件名不能为空')

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const validExtensions = ['xlsx', 'xls']
    if (!validExtensions.includes(fileExtension || '')) {
      throw new Error('文件格式不支持。请上传Excel文件(.xlsx, .xls)')
    }
    if (file.size > 10 * 1024 * 1024) throw new Error('文件过大，请确保文件大小不超过10MB')
    if (file.size === 0) throw new Error('文件不能为空')

    // 构建 FormData
    const formData = new FormData()
    formData.append('file', file)

    // 发起请求
    const response = await api.post('/admin/user_management/create_teachers', formData, {
      timeout: 30000,
    })

    // 解析响应
    const data = response.data
    return {
      total: data.total || 0,
      success_count: data.success_count || 0,
      failed_count: data.failed_count || 0,
      failed_records: data.failed_records || []
    }
  } catch (error: any) {
    // 统一错误处理
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，文件上传时间较长，请稍后重试')
      }
      throw new Error(`网络错误: ${error.message}`)
    }
    const status = error.response.status
    const errorData = error.response.data
    if (status === 401) throw new Error('认证失败，请重新登录')
    if (status === 403) throw new Error('权限不足，请联系管理员')
    if (status === 404) throw new Error('接口不存在，请检查后端服务')
    if (status === 422) {
      const detail = errorData?.detail
      if (Array.isArray(detail)) {
        const errors = detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join('; ')
        throw new Error(`参数验证失败: ${errors}`)
      }
      throw new Error(`参数验证失败: ${detail || '请检查文件内容'}`)
    }
    if (status === 500) throw new Error(`服务器内部错误: ${errorData?.detail || '请稍后重试'}`)
    const errorMessage = errorData?.message || errorData?.detail || error.message || '未知错误'
    throw new Error(`批量创建失败: ${errorMessage}`)
  }
}

/**
 * 下载教师Excel导入模板 - 根据后端要求修复格式
 */
export const downloadTeacherTemplate = async (): Promise<Blob> => {
  console.log('请求下载教师Excel模板')

  const response = await api.get('/admin/user_management/download_teacher_template', {
    responseType: 'blob'
  })

  console.log('教师Excel模板下载成功')

  return new Blob([response.data], {
    type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}



// 添加教师列表响应接口
export interface TeacherListResponse {
  total: number
  page: number
  page_size: number
  teachers: Array<{
    id: number
    username: string
    staff_id: string
    department: string
  }>
}
/**
 * 获取教师列表 - 修复API路径
 */
export const getTeacherList = async (
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    retryCount: number = 3
): Promise<TeacherListResponse> => {
  try {
    // 构建查询参数
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    })

    if (search) {
      params.append('search', search)
    }

    try {
      const response = await api.get(`/admin/user_management/list_teachers?${params}`)
      console.log();
      return response.data
    } catch (error: any) {
      // 如果是500错误且还有重试次数，进行重试
      if (error.response?.status === 500 && retryCount > 0) {
        console.log(`搜索请求失败，${retryCount}秒后重试...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return getTeacherList(page, pageSize, search, retryCount - 1)
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
        throw new Error('搜索参数无效，请检查输入')
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法获取教师列表')
      case 404:
        throw new Error('教师列表接口不存在')
      case 500:
        throw new Error(`服务器内部错误: ${errorData?.detail || '搜索服务暂时不可用'}`)
      default:
        throw new Error(errorData?.message || `获取教师列表失败(${status})`)
    }
  }
}

// 添加教师详情接口
export interface TeacherDetail {
  id: number
  username: string
  staff_id: string
  department: string
  created_at: string
  expertise: string
  intro: string
  contact_email: string
  office_location: string
}


/**
 * 获取单个教师详细信息
 */
export const getTeacherDetail = async (staff_id: string): Promise<TeacherDetail> => {
  try {
    const response = await api.get(`/admin/user_management/teacher_detail/${staff_id}`)
    console.log("@@",response.data);
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error('请求参数无效')
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法访问该教师信息')
      case 404:
        throw new Error('未找到该教师')
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '获取教师信息失败'}`)
      default:
        throw new Error(errorData?.message || `获取教师信息失败(${status})`)
    }
  }
}

/**
 * 更新教师信息 - 修复API路径
 */
export const updateTeacher = async (teacherId: string, updateData: Partial<Teacher>): Promise<void> => {
  try {
    console.log('请求更新教师信息:', teacherId, updateData)

    const response = await api.put(`/admin/user_management/update_teacher/${teacherId}`, updateData)

    console.log('教师信息更新成功:', response.data)

  } catch (error: any) {
    console.error('更新教师信息失败:', error)

    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    if (status === 401) throw new Error('认证失败，请重新登录')
    if (status === 403) throw new Error('权限不足，无法更新教师信息')
    if (status === 404) throw new Error('教师不存在')
    if (status === 422) throw new Error('输入数据格式错误')
    if (status === 500) throw new Error('服务器内部错误，请稍后重试')

    const errorMessage = errorData?.detail || errorData?.message || error.message || '未知错误'
    throw new Error(`更新教师信息失败: ${errorMessage}`)
  }
}



/**
 * 下载学生Excel导入模板
 */
export const downloadStudentTemplate = async (): Promise<Blob> => {
  console.log('请求下载学生Excel模板')

  const response = await api.get('/admin/user_management/download_student_template', {
    responseType: 'blob'
  })

  console.log('学生Excel模板下载成功')

  return new Blob([response.data], {
    type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}



// 添加学生相关的接口类型定义
export interface CreateStudentsResponse {
  total: number
  success_count: number
  failed_count: number
  failed_records: Array<{
    username: string
    success: boolean
    error: string
  }>
}

/**
 * 批量创建学生
 */
export const createStudents = async (file: File): Promise<CreateStudentsResponse> => {
  try {
    // 参数校验
    if (!file) throw new Error('请选择要上传的文件')
    if (!file.name) throw new Error('文件名不能为空')

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const validExtensions = ['xlsx', 'xls', 'csv']
    if (!validExtensions.includes(fileExtension || '')) {
      throw new Error('文件格式不支持。请上传Excel文件(.xlsx, .xls)或CSV文件(.csv)')
    }
    if (file.size > 10 * 1024 * 1024) throw new Error('文件过大，请确保文件大小不超过10MB')
    if (file.size === 0) throw new Error('文件不能为空')

    // 构建 FormData
    const formData = new FormData()
    formData.append('file', file)

    // 发起请求
    const response = await api.post('/admin/user_management/create_students', formData, {
      timeout: 30000,
    })

    // 解析响应
    const data = response.data
    return {
      total: data.total || 0,
      success_count: data.success_count || 0,
      failed_count: data.failed_count || 0,
      failed_records: data.failed_records || []
    }
  } catch (error: any) {
    // 统一错误处理
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，文件上传时间较长，请稍后重试')
      }
      throw new Error(`网络错误: ${error.message}`)
    }
    const status = error.response.status
    const errorData = error.response.data
    if (status === 401) throw new Error('认证失败，请重新登录')
    if (status === 403) throw new Error('权限不足，请联系管理员')
    if (status === 404) throw new Error('接口不存在，请检查后端服务')
    if (status === 422) {
      const detail = errorData?.detail
      if (Array.isArray(detail)) {
        const errors = detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join('; ')
        throw new Error(`参数验证失败: ${errors}`)
      }
      throw new Error(`参数验证失败: ${detail || '请检查文件内容'}`)
    }
    if (status === 500) throw new Error(`服务器内部错误: ${errorData?.detail || '请稍后重试'}`)
    const errorMessage = errorData?.message || errorData?.detail || error.message || '未知错误'
    throw new Error(`批量创建失败: ${errorMessage}`)
  }
}


// 添加学生列表响应接口
export interface StudentListResponse {
  total: number
  page: number
  page_size: number
  students: Array<{
    id: number
    username: string
    student_id: string  // 学号
    department: string  // 学院
    major: string      // 专业
    grade: string      // 年级
    enrollment_year: string  // 入学年份
  }>
}

/**
 * 获取学生列表 - 支持分页和搜索
 */
export const getStudentList = async (
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    retryCount: number = 3
): Promise<StudentListResponse> => {
  try {
    // 构建查询参数
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    })

    if (search) {
      params.append('search', search)
    }

    try {
      const response = await api.get(`/admin/user_management/list_students?${params}`)
      return response.data
    } catch (error: any) {
      // 如果是500错误且还有重试次数，进行重试
      if (error.response?.status === 500 && retryCount > 0) {
        console.log(`🔄 搜索请求失败，${retryCount}秒后重试...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return getStudentList(page, pageSize, search, retryCount - 1)
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
        throw new Error('搜索参数无效，请检查输入')
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法获取学生列表')
      case 404:
        throw new Error('学生列表接口不存在')
      case 500:
        throw new Error(`服务器内部错误: ${errorData?.detail || '搜索服务暂时不可用'}`)
      default:
        throw new Error(errorData?.message || `获取学生列表失败(${status})`)
    }
  }
}

// 添加学生详情接口
export interface StudentDetail {
  id: number
  username: string
  student_id: string
  college: string      // 注意这里是 college 而不是 department
  created_at: string
  major: string
  grade: string
  enrollment_year: number  // 注意这里是 number 类型
  intro: string
  contact_email: string
}
// 更新学生请求接口
export interface UpdateStudentRequest {
  username: string
  student_id: string
  college: string
  major: string
  grade: string
  enrollment_year: number
  intro: string
  contact_email: string
}

// 更新学生响应接口
export interface UpdateStudentResponse {
  status: string
  message: string
  user_id: string
}

/**
 * 更新学生信息
 */
export const updateStudent = async (studentId: string, data: UpdateStudentRequest): Promise<UpdateStudentResponse> => {
  try {
    console.log('📤 开始更新学生信息:', { studentId, data })

    const response = await api.put(`/admin/user_management/update_student/${studentId}`, data)

    console.log('📥 更新学生信息成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查输入'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法更新该学生信息')
      case 404:
        throw new Error(`未找到ID为 ${studentId} 的学生记录`)
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '更新学生信息失败'}`)
      default:
        throw new Error(errorData?.message || `更新学生信息失败(${status})`)
    }
  }
}


// 更新教师请求接口
export interface UpdateTeacherRequest {
  username: string
  staff_id: string
  department: string
  expertise: string
  intro: string
  contact_email: string
  office_location: string
}

// 更新教师响应接口
export interface UpdateTeacherResponse {
  status: string
  message: string
  user_id: string
}

/**
 * 更新教师信息
 */
export const updateTeacherInfo = async (teacherId: string, data: UpdateTeacherRequest): Promise<UpdateTeacherResponse> => {
  try {
    console.log('📤 开始更新教师信息:', { teacherId, data })

    const response = await api.put(`/admin/user_management/update_teacher/${teacherId}`, data)

    console.log('📥 更新教师信息成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查输入'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法更新该教师信息')
      case 404:
        throw new Error(`未找到ID为 ${teacherId} 的教师记录`)
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '更新教师信息失败'}`)
      default:
        throw new Error(errorData?.message || `更新教师信息失败(${status})`)
    }
  }
}

// 重置学生密码请求接口
export interface ResetStudentPasswordRequest {
  new_password: string
}

// 重置学生密码响应接口
export interface ResetStudentPasswordResponse {
  status: string
  message: string
  user_id: string
}

/**
 * 重置学生密码
 */
export const resetStudentPassword = async (studentId: string, newPassword: string): Promise<ResetStudentPasswordResponse> => {
  try {
    console.log('📤 开始重置学生密码:', { studentId })

    const data: ResetStudentPasswordRequest = {
      new_password: newPassword
    }

    const response = await api.post(`/admin/user_management/reset_password/${studentId}`, data)

    console.log('📥 重置学生密码成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查密码格式'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法重置该学生密码')
      case 404:
        throw new Error(`未找到ID为 ${studentId} 的学生记录`)
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '重置密码失败'}`)
      default:
        throw new Error(errorData?.message || `重置学生密码失败(${status})`)
    }
  }
}


// 重置教师密码请求接口
export interface ResetTeacherPasswordRequest {
  new_password: string
}

// 重置教师密码响应接口
export interface ResetTeacherPasswordResponse {
  status: string
  message: string
  user_id: string
}

/**
 * 重置教师密码
 */
export const resetTeacherPassword = async (teacherId: string, newPassword: string): Promise<ResetTeacherPasswordResponse> => {
  try {
    console.log('📤 开始重置教师密码:', { teacherId })

    const data: ResetTeacherPasswordRequest = {
      new_password: newPassword
    }

    const response = await api.post(`/admin/user_management/reset_teacher_password/${teacherId}`, data)

    console.log('📥 重置教师密码成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查密码格式'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法重置该教师密码')
      case 404:
        throw new Error(`未找到ID为 ${teacherId} 的教师记录`)
      case 405:
        throw new Error('请求方法不被允许，请联系技术支持')
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '重置密码失败'}`)
      default:
        throw new Error(errorData?.message || `重置教师密码失败(${status})`)
    }
  }
}



// 批量删除学生请求接口
export interface DeleteStudentsRequest {
  student_ids: string[]
}

// 批量删除学生响应接口
export interface DeleteStudentsResponse {
  success: boolean
  deleted: number
  message: string
}

/**
 * 批量删除学生
 */
export const deleteStudents = async (studentIds: string[]): Promise<DeleteStudentsResponse> => {
  try {
    console.log('📤 开始批量删除学生:', { studentIds })

    if (!studentIds || studentIds.length === 0) {
      throw new Error('请选择要删除的学生')
    }

    const data: DeleteStudentsRequest = {
      student_ids: studentIds
    }

    const response = await api.delete('/admin/user_management/batch_delete_students', {
      data: data
    })

    console.log('📥 批量删除学生成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查学生ID列表'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法删除学生')
      case 404:
        throw new Error('部分学生不存在')
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '批量删除失败'}`)
      default:
        throw new Error(errorData?.message || `批量删除学生失败(${status})`)
    }
  }
}


// 批量删除教师请求接口
export interface DeleteTeachersRequest {
  staff_ids: string[]
}

// 批量删除教师响应接口
export interface DeleteTeachersResponse {
  success: boolean
  deleted: number
  message: string
}

/**
 * 批量删除教师
 */
export const deleteTeachers = async (teacherIds: string[]): Promise<DeleteTeachersResponse> => {
  try {
    console.log('开始批量删除教师:', { teacherIds })

    if (!teacherIds || teacherIds.length === 0) {
      throw new Error('请选择要删除的教师')
    }

    const data: DeleteTeachersRequest = {
      staff_ids: teacherIds
    }

    const response = await api.delete('/admin/user_management/batch_delete_teachers', {
      data: data
    })

    console.log('📥 批量删除教师成功:', response.data)
    return response.data

  } catch (error: any) {
    if (!error.response) {
      throw new Error(`网络错误: ${error.message}`)
    }

    const status = error.response.status
    const errorData = error.response.data

    switch (status) {
      case 400:
        throw new Error(`参数验证失败: ${errorData?.detail || '请检查教师ID列表'}`)
      case 401:
        throw new Error('认证失败，请重新登录')
      case 403:
        throw new Error('权限不足，无法删除教师')
      case 404:
        throw new Error('部分教师不存在')
      case 500:
        throw new Error(`服务器错误: ${errorData?.detail || '批量删除失败'}`)
      default:
        throw new Error(errorData?.message || `批量删除教师失败(${status})`)
    }
  }
}


// 获取日志文件内容请求参数接口
// 获取日志文件内容响应接口
// 工具函数：解析日志行
export const parseLogLine = (line: string): {
  timestamp?: string,
  level?: string,
  module?: string,
  message?: string,
  raw: string
} => {
  try {
    // 常见的日志格式正则
    const patterns = [
      // 2024-01-01 12:00:00 [INFO] module: message
      /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s*\[(\w+)\]\s*(\w+):\s*(.+)$/,
      // 2024-01-01T12:00:00Z INFO module: message  
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s+(\w+)\s+(\w+):\s*(.+)$/,
      // [2024-01-01 12:00:00] INFO module - message
      /^\[(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\]\s+(\w+)\s+(\w+)\s*-\s*(.+)$/
    ]

    for (const pattern of patterns) {
      const match = line.match(pattern)
      if (match) {
        return {
          timestamp: match[1],
          level: match[2],
          module: match[3],
          message: match[4],
          raw: line
        }
      }
    }

    // 如果没有匹配到任何格式，返回原始内容
    return { raw: line }

  } catch (error) {
    return { raw: line }
  }
}

// 工具函数：按日志级别过滤内容
export const filterLogContentByLevel = (content: string[], level: string): string[] => {
  if (!level || level === 'ALL') return content

  return content.filter(line => {
    const parsed = parseLogLine(line)
    return parsed.level?.toLowerCase() === level.toLowerCase()
  })
}

// 工具函数：按时间范围过滤内容
// 工具函数：高亮关键词
// 工具函数：统计日志级别分布
