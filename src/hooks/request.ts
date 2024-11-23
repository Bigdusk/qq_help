import axios from "axios";
import { notification } from "./discrete_api";
const axios_util = axios.create({
    baseURL: "http://api.hhzx.top:7777",
    timeout: 60000
});

interface ApiResponse<T> {
    code: number,
    message: string,
    data: T
}

//请求拦截器
axios_util.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

axios_util.interceptors.response.use(
    response => {
        if (response.data.code === 500) {
            notification.create({title: response.data.message,duration: 5000,})
        }
        return response.data;
    },
    error => {
        console.log(error);
        
        notification.error({title: error.message,duration: 5000,})

        return Promise.reject(error);
    }
)


//要求实现参数提示
//封装get方法
export async function get<T>(
    url: string,
    params?: any
): Promise<T> {
    return await axios_util.get<ApiResponse<T>>(url, { params })
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}

//封装post请求
export async function post<T>(
    url: string,
    data: any,
    params?: any
): Promise<T> {
    return await axios_util.post<ApiResponse<T>>(url, data, { params })
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}