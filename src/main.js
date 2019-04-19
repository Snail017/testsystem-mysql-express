import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import crypto from 'crypto'
import $ from 'jquery'
import iView from 'iview'
import 'iview/dist/styles/iview.css';

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import http from "@/http"

import '@/assets/css/common.css'
import '@/assets/css/iconfont.css'
import zq from '@/assets/zq'
import zqlayer from '@/lib/index'

Vue.use(zqlayer);
Vue.use(zq);
Vue.use(iView);
Vue.use(crypto);

Vue.prototype.crypto = crypto;
Vue.prototype.$http = http;
Vue.config.productionTip = false;

//获取公钥
Vue.prototype.$http({
    method: 'get',
    url: "/user/public_key",
}).then((res) => {
    res = res.data;
    if (res.code == 200) {
        window.localStorage.setItem("public_key", res.msg);
    }
})


new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')

