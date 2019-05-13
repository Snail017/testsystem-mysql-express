import axios from 'axios';
import router from './router';

//定义一个路由防卫，每次路由跳转，我们都来做一下权限校验
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (localStorage.token&&localStorage.token!='') { //判断token是否存在
        console.log("token存在");
        next();
      } else {
        console.log("token不存在");
        next({
          path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
          query: {redirect: to.fullPath}
        })
      }
    }
    else { // 如果不需要权限校验，直接进入路由界面
      next();
    }
  });
  
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

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 999) {
      router.replace('/login');
      console.log("token过期");
    }else if(response.headers.authorization){
      localStorage.token=response.headers.authorization;
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
export default axios;