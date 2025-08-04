import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import './style.css'; // 导入全局样式文件


axios.defaults.withCredentials=true;

// 创建Axios实例
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // 根据后端实际地址进行修改
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



const app = createApp(App)
.use(router)
.use(ElementPlus)
.provide("axios",axiosInstance)


// 注册全局组件

app.mount('#app')

