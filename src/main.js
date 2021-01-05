import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import crypto from 'crypto'
import ViewUI from 'view-design'
import '@/assets/common/flexible.js'
import "@/assets/common/iconfont.css";
import 'view-design/dist/styles/iview.css'
import "@/assets/common/common.scss";
import http from "@/api/httpServer"
import zqlayer from '@/lib/index'

Vue.use(zqlayer);
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

