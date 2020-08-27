//接口域名地址
let baseURL, protocol = 'http://',hostName;

if (process.env.NODE_ENV === 'development') {
    hostName = "101.132.121.71:8000";
} else if (process.env.NODE_ENV === 'production') {
    hostName = '127.0.0.1';
}

baseURL = protocol + hostName

export default {
    baseURL: baseURL,
    hostName: hostName
}
