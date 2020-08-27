// import * as storage from './storage'
import {KEYS} from './constants'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}
/**
 * 存储sessionStorage
 */
export const setStoreSession = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getStoreSession = name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
}

/**
 * 删除sessionStorage
 */
export const removeStoreSession = name => {
    if (!name) return;
    window.sessionStorage.removeItem(name);
};

// 用户缓存，避免重复读取缓存
const CACHED = {}

// 设置缓存
const setCache = (key, val) => {
    CACHED[key] = val

    return storage.setItem(key, val)
}

// 获取缓存
const getCache = key => {
    if (CACHED[key]) {
        return CACHED[key]
    }

    CACHED[key] = storage.getItemSync(key)

    return CACHED[key]
}

  // 移除缓存
const removeCache = key => {
    delete CACHED[key]

    return storage.removeItem(key)
}

/**
 * 生成全局唯一标识
 */
const generateUUID = () => {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
let deviceId = generateUUID()

// 唯一标识 是否生成
let deviceIdIs = () => {
    if(!getStore('deviceId')){
        setStore('deviceId',deviceId)
    } else {
        getStore('deviceId')
    }
}

/**
 * 获取缓存中的token（同步）
 * @return {string} token
 */
export const getToken = () => getCache(KEYS.TOKEN_KEY)

/**
 * 将token保存到缓存中(同步)
 * @param  {string} token
 * @return {undefined}
 */
export const saveToken = val => setCache(KEYS.TOKEN_KEY, val)

/**
 * @date Date类型对象
 * @fmt 格式化字符串  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *                   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * dateformat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * dateformat(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
export const dateformat = (date, fmt) => {
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/**
 * 获取一周内的时间
 * 返回值数组 arr[0]：一周前的那天，arr[1]：今天
 * 例子：
 * getWeeks();  // return ['2018-07-01', '2018-07-08']
 */
export const getWeeks = () => {
    let weeks = [];
    let now = new Date();
    let lastweek = new Date( now.getTime() - 7 * 24 * 60 * 60 * 1000);
    weeks.push(dateformat(lastweek, 'yyyy-MM-dd'), dateformat(now, 'yyyy-MM-dd'));
    return weeks;
}

/**
 * 获取一月内的时间
 * 返回值数组 arr[0]：一月前的那天，arr[1]：今天
 * 例子：
 * getWeeks();  // return ['2018-06-08', '2018-07-08']
 */
export const getMonths = () => {
    let months = [];
    let now = new Date();
    months.push(dateformat(now, 'yyyy-MM-dd'));
    let lastmonth = new Date(now.setMonth(now.getMonth() - 1));
    months.push(dateformat(lastmonth, 'yyyy-MM-dd'));
    return months.reverse();
}

/**
 * 获取一年内的时间
 * 返回值数组 arr[0]：一年前的那天，arr[1]：今天
 * 例子：
 * getWeeks();  // return ['2017-07-08', '2018-07-08']
 */
export const getYears = () => {
    let years = [];
    let now = new Date();
    years.push(dateformat(now, 'yyyy-MM-dd'));
    let lastmonth = new Date(now.setFullYear(now.getFullYear() - 1));
    years.push(dateformat(lastmonth, 'yyyy-MM-dd'));
    return years.reverse();
}

/**
 * 获取某元素距离顶部的距离
 * 参数element为该元素的dom对象
 */
export const getElementTop = (element) => {
    let actualTop = element.offsetTop
    let current = element.offsetParent
    while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
    }
    return actualTop
}

/**获取当前URL里的查询参数
 *
 * @param url
 * @returns {{}|*}
 */
export const getUrlParams = url => {
    url = url || window.location.href;
    let queryArray = url.split(/[?&#]/).slice(1);
    let i;
    let args = {};
    for (i = 0; i < queryArray.length; i++) {
        var match = queryArray[i].match(/([^=]+)=([^=]+)/);
        if (match !== null) {
            args[match[1]] = decodeURIComponent(match[2]);
        }
    }
    return args;
}

export const getdeviceId = () => deviceIdIs()

export const funs = undefined