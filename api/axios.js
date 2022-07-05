import axios from 'axios'
import config from '../config'

const baseURL = process.env.NODE_ENV === 'development' ? config.baseURL.dev : config.baseURL.pro

class HttpRequest {
    constructor(baseURL) {
        this.baseURL = baseURL
    }

    getInsideConfig() {
        const config = {
            baseURL: this.baseURL,
            header: {}
        }
        return config
    }

    interceptors(instance) {
        // 添加请求拦截器
        instance.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

        // 添加响应拦截器
        instance.interceptors.response.use(function (response) {
            // 对响应数据做点什么
            return response;
        }, function (error) {
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    }

    request(options) {
        //创建一个axios实例
        const instance = axios.create()
        //包含config和输入options
        options = {...this.getInsideConfig(), ...options}
        //请求拦截器
        this.interceptors(instance)
        //发送axios请求（请求参数中混入了config）
        return instance(options)
    }
} 

export default new HttpRequest(baseURL)