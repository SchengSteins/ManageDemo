import axios from "./axios";

export const getMenu = (param) => {
    return axios.request({
        url: '/user/login',
        method: 'post',
        data: param
    })
}

export const getData = () => {
    return axios.request({
        url: '/home/getData'
    })
}

export const getUser = (params) => {
    return axios.request({
        url: '/user/getUser',
        method: 'get',
        params
    })
}

export const getReg = (params) => {
    return axios.request({
        url: '/user/regist',
        method: 'post',
        data: params
    })
}

export const getAuth = (params) => {
    return axios.request({
        url: '/user/auth',
        method: 'post',
        data: params
    })
}

export const uploads = (params) => {
    return axios.request({
        url: '/ocr/uploads',
        method: "post",
        data: params,
    })
}

export const uploadTags = (params) => {
    return axios.request({
        url: '/ocr/uploadTags',
        method: "post",
        data: params,
    })
}

export const deloads = (params) => {
    return axios.request({
        url: '/ocr/deloads',
        method: "get",
        params: {
            filename: params
        }
    })
}

export const getImg = () => {
    return axios.request({
        url: '/ocr/getImg',
    })
}