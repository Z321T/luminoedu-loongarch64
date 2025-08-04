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

export function downloadModelApi() {
  return api({
    url: '/admin/model_management/download_model',
    method: 'POST',
  })
}

export function getModelStatusApi() {
    return api({
        url: '/admin/model_management/model_status',
        method: 'GET',
    })
}

export function deleteModelApi() {
    return api({
        url: '/admin/model_management/local_model',
        method: 'DELETE',
    })
}

