import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import back from '@/components/back'
import login from '@/components/login'
import user from '@/components/user'
import dataview from '@/components/dataview'
import basicData from '@/components/basicData'
import modelData from '@/components/modelData'
import upload from '@/components/upload'
import adminLogin from '@/components/adminLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/back',
      name: 'back',
      component: back,
      children: [
        { path: '/user', component: user, name: 'user' },
        { path: '/dataview', component: dataview, name: 'dataview' },
        { path: '/upload', component: upload, name: 'upload' },
        { path: '/basicData', component: basicData, name: 'basicData' }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/adminLogin',
      name: 'adminLogin',
      component: adminLogin
    },{
      path: '/dataview',
      name: 'dataview',
      component: dataview
    },{
      path: '/modelData',
      name: 'modelData',
      component: modelData
    }
  ]
})
