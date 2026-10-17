/**
 * 全局 mixin：为所有页面注入字号 class + statusBarHeight
 * 在 main.js 里通过 app.mixin 挂载
 */

import { useStore } from './index.js'

export const fontMixin = {
	data() {
		return {
			// 状态栏高度 (px)，所有 custom navigationStyle 页面都能用
			statusBarHeight: 20
		}
	},
	computed: {
		ybFontClass() {
			return 'yb-font-' + (useStore().ui.fontLevel || 'lg')
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	}
}

export default fontMixin
