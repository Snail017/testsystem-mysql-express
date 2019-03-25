import Vue from 'vue'
import Router from 'vue-router'
import homeQuestion from '@/components/homeQuestion'
import homeAnswer from '@/components/homeAnswer'
import editFrom from '@/views/editFrom'
import questionnaire from '@/views/questionnaire'
import answer_list from '@/components/answer_list'
import register from "@/views/register"
import login from "@/views/login"

Vue.use(Router)

export default new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
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
            component: homeQuestion
        },
        {
            path: '/editFrom',
            name: 'editFrom',
            component: editFrom
        },
        {
            path: '/homeAnswer',
            name: 'homeAnswer',
            component: homeAnswer
        },
        {
            path: '/answer_list',
            name: 'answer_list',
            component: answer_list
        },
        {
            path: '/paper',
            name: 'questionnaire',
            component: questionnaire
        },
        {
            path: '/checkpaper',
            name: 'questionnaire',
            component: questionnaire
        },
        {
            path: '/answerpaper',
            name: 'questionnaire',
            component: questionnaire
        },
        {
            path: '/checkpaper',
            name: 'questionnaire',
            component: questionnaire
        },
        {
            path: '/questionnaire',
            name: 'questionnaire',
            component: questionnaire
        },
    ]
})
