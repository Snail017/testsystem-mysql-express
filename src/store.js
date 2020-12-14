import Vue from 'vue'
import Vuex from 'vuex'

import axios from "axios";

Vue.use(Vuex)
const state = {
  system: ''
}

const getters = {

}
const mutations = {

}

var web3GetIdFlag = false,
  web3GetIdPromise = null;
const actions = {
  system(state) {
    if (state.system) {
      return resolve(state.system)
    } else {
      if (!web3GetIdFlag) {
        web3GetIdFlag = true;
        web3GetIdPromise = new Promise((resolve, reject) => {
          try {
              var ua = navigator.userAgent.toLowerCase();
              if (ua.indexOf("android") > -1 || ua.indexOf("linux") > -1) {
                if (window.ShowFitness !== undefined) {
                  store.state.system = 'android'
                  return resolve('android');
                }
              }
              else if (ua.indexOf("iphone") > -1 || ua.indexOf("ios") > -1) {
                store.state.system = 'ios'
                return resolve('ios');
              } else if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //在微信中打开
                store.state.system = 'weixin'
                return resolve('weixin');
              }
              else if (ua.match(/WeiBo/i) == "weibo") {
                //在新浪微博客户端打开
                store.state.system = 'weibo'
                return resolve('weibo');
              }
              else if (ua.match(/QQ/i) == "qq") {
                //在QQ空间打开
                store.state.system = 'qq'
                return resolve('qq');
              }
          
          } catch (err) {
            console.log(err)
            reject(err)
          }
        })
      }
      return web3GetIdPromise
    }
  },
}
const store = new Vuex.Store({
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
});

export default store;
