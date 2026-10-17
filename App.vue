<script>
import { hydrate, useStore, actions } from './store/index.js'
import { loadSerifFont } from './services/font.js'
import tts from './services/tts.js'

export default {
	onLaunch: function() {
		// 1) 读缓存 / 播种 Mock 数据
		hydrate()

		// 2) 预加载宋体（回忆录用）。完成后刷新标记，避免字形闪烁
		loadSerifFont(function(ok) {
			actions.markSerifReady(ok)
			console.log('[忆伴] 宋体加载：', ok ? '成功' : '失败（使用系统宋体回退）')
		})

		// 3) 恢复应用内音量
		const store = useStore()
		tts.setVolume(store.ui.volume)

		console.log('[忆伴] App Launch')
	},
	onShow: function() {
		console.log('[忆伴] App Show')
	},
	onHide: function() {
		console.log('[忆伴] App Hide')
	}
}
</script>

<style>
/* ============================================================
   全局样式（不带 scoped，小程序端对所有页面生效）
   运行时字号：CSS 变量 + 三档根 class
   （scss 变量是编译期常量，做不了动态字号，故用 CSS 变量）
   ============================================================ */

page {
	background: #F5F9F6;
	font-family: 'PingFang SC', -apple-system, 'Helvetica Neue', sans-serif;
	color: #192620;
}

/* 标准档 md —— Figma 390 画布原值（pt × 1.923） */
.yb-font-md {
	--yb-fs-xl: 54rpx;
	--yb-fs-l: 42rpx;
	--yb-fs-mp: 38rpx;
	--yb-fs-m: 35rpx;
	--yb-fs-b: 31rpx;
	--yb-fs-s: 29rpx;
	--yb-fs-xs: 25rpx;
	--yb-fs-xxs: 23rpx;
	--yb-tap: 112rpx;
}

/* 大字档 lg —— ×1.2 */
.yb-font-lg {
	--yb-fs-xl: 62rpx;
	--yb-fs-l: 50rpx;
	--yb-fs-mp: 46rpx;
	--yb-fs-m: 42rpx;
	--yb-fs-b: 37rpx;
	--yb-fs-s: 34rpx;
	--yb-fs-xs: 29rpx;
	--yb-fs-xxs: 27rpx;
	--yb-tap: 132rpx;
}

/* 超大档 xl —— ×1.4 */
.yb-font-xl {
	--yb-fs-xl: 70rpx;
	--yb-fs-l: 58rpx;
	--yb-fs-mp: 54rpx;
	--yb-fs-m: 50rpx;
	--yb-fs-b: 44rpx;
	--yb-fs-s: 40rpx;
	--yb-fs-xs: 34rpx;
	--yb-fs-xxs: 31rpx;
	--yb-tap: 152rpx;
}

/* 宋体：未加载完成时先回退系统宋体，加载成功后启用真 Noto Serif SC */
.yb-serif {
	font-family: 'Songti SC', 'STSong', 'Noto Serif CJK SC', serif;
}
.yb-serif-ready .yb-serif {
	font-family: 'Noto Serif SC', 'Songti SC', 'STSong', serif;
}

/* 页面通用容器 */
.yb-page {
	min-height: 100vh;
	box-sizing: border-box;
	padding: 31rpx;
	background: #F5F9F6;
}
</style>
