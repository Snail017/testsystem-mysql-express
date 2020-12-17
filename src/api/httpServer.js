import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

//正式环境和测试环境请求不同的接口域名
const baseURL = () => {
    if (process.env.VUE_APP_CURRENTMODE == 'production') {
        return 'https://api.cellnetwork.io';  // 其它  -正式
    } else {
        return 'https://127.0.0.1:3000';  // 其他  -测试
    }
}

//添加一个请求拦截器
axios.interceptors.response.use(
    response => {
        response.config.baseURL = baseURL()
        if (response.data.code === 401) {
            router.replace('/login');
            console.log("token过期");
        } else if (response.headers.authorization) {
            localStorage.token = response.headers.authorization;
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.token) { //判断token是否存在
            config.headers.Authorization = localStorage.token;  //将token设置成请求头
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//错误处理
function errorState(response) {
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response.data
        // 如果不需要除了data之外的数据，可以直接 return response.data
    } else {
        console.error('网络异常')
    }
}


const httpServer = async (opts, data) => {
    let httpDefaultOpts = { //http默认配置
        method: opts.method || 'post',
        url: opts.url
    }
    if (opts.method == 'get') {
        httpDefaultOpts.params = data
    } else {
        httpDefaultOpts.data = data
    }

    let promise = new Promise(function (resolve, reject) {
        axios(httpDefaultOpts).then(
            (res) => {
                resolve(res)
            }
        ).catch(
            (response) => {
                errorState(response)
                reject(response)
            }
        )
    })
    return promise
}

export default httpServer
