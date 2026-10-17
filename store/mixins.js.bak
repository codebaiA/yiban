/**
 * 全局 mixin：为所有页面注入字号 class
 * 在 main.js 里通过 app.mixin 挂载
 */

import { useStore } from './index.js'

export const fontMixin = {
  computed: {
    ybFontClass() {
      return 'yb-font-' + (useStore().ui.fontLevel || 'lg')
    }
  }
}

export default fontMixin
