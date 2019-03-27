import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    publick_key:String
  },
  mutations: {
    aa(state,data) {
      state.publick_key=123456
    }
  },
  actions: {
      aa(context,data){
          console.log(123465)

        //   const $http = data.vue.$http;
        // this.$http({
        //     method:"get",
        //     url:"/data/public_key",
        //     success:function(res){
        //       context.commit('get_publickKey')
        //     }
        // })
      }
  }
})
