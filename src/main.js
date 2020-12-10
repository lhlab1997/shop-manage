import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table',ZkTable)

// 引入字体图标文件
import './assets/fonts/iconfont.css'

// 引入全局样式文件
import './assets/css/global.css'

// 引入请求库
import axios from 'axios'
// 定义基本请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    let tokenStr = window.sessionStorage.getItem('token')
    if(!!tokenStr) {
        config.headers.Authorization = tokenStr
    }
    return config
})

Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
