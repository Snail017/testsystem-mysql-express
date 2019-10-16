
import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import homeQuestion from '@/views/homeQuestion'
import homeAnswer from '@/views/homeAnswer'
import editFrom from '@/views/editFrom'
import questionnaire from '@/views/questionnaire'
import answer_list from '@/views/answer_list'
import register from "@/views/register"
import login from "@/views/login"

Vue.use(Router)

export default new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/register',
            name: 'register',
            component: register
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/homeQuestion',
            name: 'homeQuestion',
            component: homeQuestion,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/editFrom',
            name: 'editFrom',
            component: editFrom,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/homeAnswer',
            name: 'homeAnswer',
            component: homeAnswer,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/answer_list',
            name: 'answer_list',
            component: answer_list,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/paper',
            name: 'questionnaire',
            component: questionnaire,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/checkpaper',
            name: 'questionnaire',
            component: questionnaire,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/review',
            name: 'questionnaire',
            component: questionnaire,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/answerpaper',
            name: 'questionnaire',
            component: questionnaire,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/checkpaper',
            name: 'questionnaire',
            component: questionnaire,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
        {
            path: '/questionnaire',
            name: 'questionnaire',
            component: questionnaire,
            meta: {
                requireAuth: true,  // 该路由项需要权限校验
              }
        },
    ]
})
