import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import crypto from 'crypto'
import ViewUI from 'view-design'
import http from "@/http"
import zq from '@/assets/zq'
import zqlayer from '@/lib/index'

Vue.use(zqlayer);
Vue.use(zq);
Vue.use(crypto);
Vue.use(ViewUI)
Vue.prototype.crypto = crypto;
Vue.prototype.$http = http;
Vue.config.productionTip = false;

//获取公钥
Vue.prototype.$http({
    method: 'get',
    url: "/publicKey",
}).then((res) => {
    res = res.data;
    if (res.code == 200) {
        window.localStorage.setItem("public_key", res.msg);
    }
})


new Vue({
    router,
    render: h => h(App),
}).$mount('#app')

