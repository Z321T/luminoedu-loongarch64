import type { AxiosInstance, AxiosResponse } from 'axios';

export interface LoginData {
    user_id: string; // 修改字段名为 username
    password: string;
}

export interface LoginResponse {
    detail?: string; // 将detail字段更改为字符串类型，用于存储错误信息
    access_token?: string; // 可选，因为登录失败时可能没有token
    token_type?: string; // 可选
    user_id?: number; // 可选
    role?: string; // 可选
    username?: string; // 可选
}


export function login(data: LoginData, axiosInstance: AxiosInstance): Promise<LoginResponse> {
    return axiosInstance.post('/auth/login/', data)
        .then((response: AxiosResponse<LoginResponse>) => {
            console.log('response status is', response.status);
            if (response.status === 200) {
                console.log('login successful:', response.data);
                return response.data; // 返回解析后的响应数据
            } else {
                // 登录失败时，构造一个包含错误信息的LoginResponse对象
                console.log('login failed with status:', response.data);
                const errorResponse: LoginResponse = {
                    detail: '登陆失败' + response.data // 存储错误信息
                };
                console.log('errorResponse 是', errorResponse);
                return Promise.reject(errorResponse); // 使用Promise.reject返回错误响应
            }
        })
        .catch((error) => {
            // 处理网络错误或服务器错误
            console.error('服务器错误,error是',error.request);
            // 构造一个包含错误信息的LoginResponse对象
            const errorResponse: LoginResponse = {
                detail: '登陆失败：' + (error.request.response || 'An unknown error occurred'),
            };
            return Promise.reject(errorResponse); // 使用Promise.reject返回错误响应
        });
}