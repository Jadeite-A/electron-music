import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Main',
  //   component: () => import(/* webpackChunkName: 'MainWindow' */ '@/views/MainWindow.vue')
  // },
  // {
  //   path: '/:pathMath(.*)',
  //   redirect: '/'
  // }
  {
    path: '/',
    name: 'Music',
    component: () => import(/* webpackChunkName: 'Music' */ '@/views/Music/index.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import(/* webpackChunkName: 'Video' */ '@/views/Video/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
