
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const routes = [
    {
        path:'/',
        redirect:'/home'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import("@/views/home.vue"),
    },
    {
        path: '/register',
        name: 'register',
        component: ()=>import('@/views/register')
    },
    {
        path: '/login',
        name: 'login',
        component: ()=>import('@/views/login')
    },
    {
        path: '/homeQuestion',
        name: 'homeQuestion',
        component: ()=>import("@/views/homeQuestion"),
        meta: {
            requireAuth: true,  // 该路由项需要权限校验
        }
    },
    {
        path: '/editFrom',
        name: 'editFrom',
        component: ()=>import('@/views/editFrom'),
        meta: {
            requireAuth: true,  // 该路由项需要权限校验
        }
    },
    {
        path: '/homeAnswer',
        name: 'homeAnswer',
        component: ()=>import("@/views/homeAnswer"),
        meta: {
            requireAuth: true,  // 该路由项需要权限校验
        }
    },
    {
        path: '/answer',
        name: 'answer_list',
        component: ()=>import('@/views/answer_list'),
        meta: {
            requireAuth: true,  // 该路由项需要权限校验
        }
    },
    {
        path: '/paper',
        name: 'questionnaire',
        component: ()=>import('@/views/questionnaire'),
        meta: {
            requireAuth: true,  // 该路由项需要权限校验
        }
    },
]

const router = new Router({
	routes,
})

// 路由前置导航守卫
router.beforeEach((to, from, next) => {
	// 根据路由元信息设置文档标题
	if (to.meta.title) {
		document.title = to.meta.title
	}
	next()
})
//路由跳转后滚动到顶部
router.afterEach((to,from,next) => {
	window.scrollTo(0,0)
});

export default router
