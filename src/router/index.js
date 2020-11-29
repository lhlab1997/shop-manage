
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../router/routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/* 
  定义路由导航守卫
  to === login  next()
  to !== login  next('/login')
*/

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router
