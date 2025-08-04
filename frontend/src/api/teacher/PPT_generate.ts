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

// PPT生成请求接口
export interface PPTGenerateRequest {
  title: string;
  subject: string;
  teaching_target: string;
  key_points: string[];
  target_grade: string;
  slide_count: number;
  additional_info: string | null;
}

// PPT大纲响应接口
export interface PPTOutlineResponse {
  title: string;
  outline_md: string;
}

// PPT幻灯片接口
export interface PPTSlide {
  title: string;
  content: string;
  note: string;
}

// PPT完整响应接口
export interface PPTCompleteResponse {
  title: string;
  slides: PPTSlide[];
}

/**
 * 生成PPT大纲
 * @param data PPT生成请求参数
 * @returns Promise<PPTOutlineResponse> 包含标题和markdown格式大纲
 */
export const generatePPTOutline = async (data: PPTGenerateRequest): Promise<PPTOutlineResponse> => {
  try {
    // 记录API调用开始
    console.log('开始生成PPT大纲:', data);

    // 发送API请求
    const response = await api.post('/teacher/ppt/generate_outline', data);

    console.log('PPT大纲生成成功:', response.data);
    return response.data;

  } catch (error: any) {
    // 处理错误
    console.error('PPT大纲生成失败:', error);

    // 构建友好的错误信息
    let errorMessage = '生成PPT大纲时出错';

    if (error.response) {
      // 服务器返回错误
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = `参数错误: ${data.detail || '请检查输入内容'}`;
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '权限不足，无法访问此功能';
          break;
        case 404:
          errorMessage = 'API接口不存在';
          break;
        case 422:
          errorMessage = `数据验证失败: ${data.detail || '请检查输入格式'}`;
          break;
        case 500:
          errorMessage = `服务器错误: ${data.detail || '请稍后重试'}`;
          break;
        default:
          errorMessage = `请求失败 (${status}): ${data.detail || '请稍后重试'}`;
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      errorMessage = '服务器无响应，请检查网络连接';
    }

    throw new Error(errorMessage);
  }
};

/**
 * 从大纲生成完整PPT
 * @param title PPT标题
 * @param file 大纲Markdown文件
 * @returns Promise<PPTCompleteResponse> 包含标题和幻灯片内容
 */
export const generatePPTFromOutline = async (title: string, file: File): Promise<PPTCompleteResponse> => {
  try {
    // 记录API调用开始
    console.log('开始从大纲生成PPT:', title, file.name);

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    // 发送API请求
    const response = await api.post(`/teacher/ppt/generate_from_outline?title=${encodeURIComponent(title)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('PPT生成成功:', response.data);
    return response.data;

  } catch (error: any) {
    // 处理错误
    console.error('从大纲生成PPT失败:', error);

    // 构建友好的错误信息
    let errorMessage = '生成PPT时出错';

    if (error.response) {
      // 服务器返回错误
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = `参数错误: ${data.detail || '请检查输入内容'}`;
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '权限不足，无法访问此功能';
          break;
        case 404:
          errorMessage = 'API接口不存在';
          break;
        case 422:
          errorMessage = `数据验证失败: ${data.detail || '请检查输入格式'}`;
          break;
        case 500:
          errorMessage = `服务器错误: ${data.detail || '请稍后重试'}`;
          break;
        default:
          errorMessage = `请求失败 (${status}): ${data.detail || '请稍后重试'}`;
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      errorMessage = '服务器无响应，请检查网络连接';
    }

    throw new Error(errorMessage);
  }
};

/**
 * 从生成的PPT数据下载PPTX文件
 * @param pptData PPT数据
 * @param filename 文件名
 */
export const downloadPPTX = async (filename: string): Promise<void> => {
  try {
    console.log('开始下载PPTX文件:', filename);

    const response = await api.get(`/teacher/ppt/download_ppt/${filename}`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.pptx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log('PPTX文件下载成功');
  } catch (error: any) {
    console.error('下载PPTX文件失败:', error);
    throw new Error('下载PPTX文件失败，请稍后重试');
  }
};


/**
 * 下载PPT大纲文件
 * @param fileName 大纲文件名
 */
export const downloadPPTOutlineFile = async (fileName: string): Promise<void> => {
  try {
    console.log('开始下载大纲文件:', fileName);

    const response = await api.get(`/teacher/ppt/download_outline/${encodeURIComponent(fileName)}`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log('大纲文件下载成功');
  } catch (error: any) {
    console.error('下载大纲文件失败:', error);
    throw new Error('下载大纲文件失败，请稍后重试');
  }
};



/**
 * 获取当前教师的所有PPT大纲
 * @returns Promise<PPTOutlineListItem[]> 大纲列表
 */
export const getAllPPTOutlines = async () => {
  try {
    const response = await api.get('/teacher/ppt/outlines');
    console.log('获取大纲列表成功:', response.data);
    return response.data || [];
  } catch (error: any) {
    console.error('获取大纲列表失败:', error);

    // 构建友好的错误信息
    let errorMessage = '获取大纲列表失败';

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '权限不足，无法访问此功能';
          break;
        case 404:
          errorMessage = 'API接口不存在';
          break;
        case 500:
          errorMessage = '服务器错误，请稍后重试';
          break;
        default:
          errorMessage = `请求失败 (${status})`;
      }
    } else if (error.request) {
      errorMessage = '服务器无响应，请检查网络连接';
    }

    throw new Error(errorMessage);
  }
};
// ...existing code...

/**
 * 删除指定文件名的PPT大纲
 * @param fileName 大纲文件名
 * @returns Promise<string> 删除成功的消息
 */
export const deletePPTOutlineFile = async (fileName: string): Promise<string> => {
  try {
    const response = await api.delete(`/teacher/ppt/outline/${fileName}`);
    console.log('删除大纲文件成功:', fileName);
    return response.data;
  } catch (error: any) {
    console.error('删除大纲文件失败:', error);

    // 构建友好的错误信息
    let errorMessage = '删除大纲文件失败';

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '权限不足，无法删除此大纲';
          break;
        case 404:
          errorMessage = '大纲文件不存在或已被删除';
          break;
        case 500:
          errorMessage = '服务器错误，请稍后重试';
          break;
        default:
          errorMessage = `请求失败 (${status})`;
      }
    } else if (error.request) {
      errorMessage = '服务器无响应，请检查网络连接';
    }

    throw new Error(errorMessage);
  }
};



// 添加这两个接口定义用于类型化API响应
export interface PPTFile {
  file_name: string;
  size: number;
  created_at: number;
}

export interface PPTFileListResponse {
  files: PPTFile[];
}

// 修改 getPPTFileList 函数指定返回类型
export const getPPTFileList = async (): Promise<PPTFileListResponse> => {
  try {
    const response = await api.get('/teacher/ppt/list_ppt');
    console.log('获取PPT文件列表成功:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('获取PPT文件列表失败:', error);
    throw new Error('获取PPT文件列表失败');
  }
};


export const downloadPPTXfile = async (filename: string): Promise<void> => {
  try {
    console.log('开始下载PPTX文件:', filename);

    const response = await api.get(`/teacher/ppt/download_ppt/${encodeURIComponent(filename)}`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log('PPTX文件下载成功');
  } catch (error: any) {
    console.error('下载PPTX文件失败:', error);
    throw new Error('下载PPTX文件失败，请稍后重试');
  }
};


/**
 * 删除PPT文件
 */
export const deletePPTFile = async (fileName: string): Promise<void> => {
  try {
    await api.delete(`/teacher/ppt/file/${fileName}`);
    console.log('删除PPT文件成功:', fileName);
  } catch (error: any) {
    console.error('删除PPT文件失败:', error);
    throw new Error('删除PPT文件失败');
  }
};