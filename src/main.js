import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/common.css'
import '@/assets/css/iconfont.css'
import zq from '@/assets/zq'
import zqlayer from '@/lib/index'

Vue.use(zqlayer)
Vue.use(zq)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
