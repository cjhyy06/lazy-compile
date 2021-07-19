/**
* Created by Wu Jian Ping on - 2019/08/13.
*/

import Vue from 'vue'
import Router from 'vue-router'
import layout from './layout'

let routes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('./pages/home')
      },
      {
        name: 'p2',
        path: '/p2',
        component: () => import('./pages/p2')
      }
    ]
  }
]


Vue.use(Router)


const router = new Router({
  mode: 'history',
  routes: routes
})


export default router
