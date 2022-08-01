import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { getAuth } from '../api/data'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        redirect: '/home',
        children: []
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login/login')
    },
    {
        path: '/regist',
        name: 'regist',
        component: () => import('../views/regist/index')
    }
]
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
    mode: 'history',
    routes
})

// 导航守卫（全局路由守卫）
router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.state.user.token
    if (!token && to.name !== 'login' && to.name !== 'regist') {
        next({ name: 'login' })
    } else if (token && to.name === 'login') {
        getAuth({ token }).then(
            ({ data: res }) => {
                if (res.status == 1) {
                    store.commit("clearToken");
                    store.commit("clearMenu");
                    next({ name: 'login' })
                } else {
                    next({ name: 'home' })
                }
            }
        )
    } else {
        next()
    }
})

export default router