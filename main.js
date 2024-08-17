import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import Vant from 'vant';
import './uni.promisify.adaptor'
import 'vant/lib/index.css';
Vue.config.productionTip = false
Vue.use(Vant)
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  // 全局引入Vant
  app.use(Vant)
  return {
    app
  }
}
// #endif