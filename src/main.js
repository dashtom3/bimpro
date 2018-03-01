// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'element-ui'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(axios)

Vue.filter('filterIdentify',function(value){
  return value == '0' ? '用户':'管理员'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
