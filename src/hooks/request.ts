import axios from "axios";
import { notification } from "./discrete_api";
const axios_util = axios.create({
    baseURL: "http://localhost:8888",
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

        // //权限验证
        // const computer = ref<Computer>({
        //     authorization_id: 0,
        //     computer_id: "",
        //     expires_at: null,
        //     is_active: null
        // })

        // computer.value.computer_id = localStorage.getItem('fingerprint') as string

        // post('/computer/auth', computer.value).then(r => {
        //     console.log(r);
        // })
        // .catch(e => {
        //     console.log(e);
            
        // })

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

axios_util.interceptors.response.use(
    response => {
        if (response.data.code === 500) {
            notification.create({title: response.data.message})
        }
        return response.data;
    },
    error => {
        console.log(error);
        
        notification.error({title: error.message})

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