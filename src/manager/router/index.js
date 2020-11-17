import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
    // mode: 'history',
    routes: [{
            path: '/',
            component: () => import("@/web/views/home/index.vue")
        },
        {
            path: '/about',
            component: () => import("@/web/views/about/index.vue")

        },
    ]
})

export default router