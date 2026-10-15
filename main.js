import App from './App'
import { fontMixin } from './store/mixins.js'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
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
  // 全局注入字号 class：每个页面根节点用 :class="ybFontClass" 即可
  app.mixin(fontMixin)
  return {
    app
  }
}
// #endif
