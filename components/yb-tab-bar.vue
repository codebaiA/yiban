<template>
	<view class="yb-tabbar">
		<view class="yb-tabbar__bar">
			<!-- 首页：绿色胶囊（选中态） -->
			<view class="tab tab--home" :class="{ 'is-active': current === 'index' }" hover-class="tab--home-hover" @tap="switchTo('index')">
				<view class="tab__pill">
					<view class="tab__home" :class="current === 'index' ? 'tab__home--on' : 'tab__home--off'"></view>
					<text class="tab__home-label" :class="current === 'index' ? 'tab__text--on' : 'tab__text--off'">首页</text>
				</view>
			</view>

			<!-- 我的回忆：中间悬浮 -->
			<view class="tab tab--center" :class="{ 'is-active': current === 'memory' }" hover-class="tab--center-hover" @tap="switchTo('memory')">
				<view class="tab__center" :class="{ 'tab__center--on': current === 'memory' }">
					<image class="tab__center-img" :src="icon('tabMemoir')" mode="aspectFit"></image>
				</view>
				<text class="tab__center-label" :class="current === 'memory' ? 'tab__text--on' : 'tab__text--off'">我的回忆</text>
			</view>

			<!-- 我的 -->
			<view class="tab tab--mine" :class="{ 'is-active': current === 'mine' }" hover-class="tab--mine-hover" @tap="switchTo('mine')">
				<view class="tab__mine" :class="{ 'tab__mine--on': current === 'mine' }">
					<image class="tab__mine-img" :src="icon('tabMine')" mode="aspectFit"></image>
				</view>
				<text class="tab__mine-label" :class="current === 'mine' ? 'tab__text--on' : 'tab__text--off'">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
import { icon } from '../services/iconMap.js'

export default {
	data() {
		return { icon }
	},
	computed: {
		current() {
			const pages = getCurrentPages()
			const route = pages.length ? pages[pages.length - 1].route : ''
			if (route.indexOf('memory') >= 0) return 'memory'
			if (route.indexOf('mine') >= 0) return 'mine'
			return 'index'
		}
	},
	methods: {
		switchTo(key) {
			const map = {
				index: '/pages/index/index',
				memory: '/pages/memory/memoir',
				mine: '/pages/mine/mine'
			}
			const url = map[key]
			if (!url) return
			const pages = getCurrentPages()
			const route = pages.length ? pages[pages.length - 1].route : ''
			// 已在当前 tab 则不重复跳
			if (route === key || (key === 'index' && route.indexOf('index') >= 0)) return
			uni.switchTab({ url })
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-tabbar {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 750rpx;
	z-index: 999;
	background-color: rgba(242, 252, 245, 0.95);
	padding-bottom: env(safe-area-inset-bottom);

	&__bar {
		position: relative;
		width: 750rpx;
		height: 169rpx;
	}
}

/* —— 首页胶囊 —— */
.tab--home {
	position: absolute;
	left: 67rpx;
	top: 25rpx;
	width: 171rpx;
	height: 106rpx;
}
.tab__pill {
	width: 171rpx;
	height: 106rpx;
	border-radius: 999rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: rgba(72, 101, 86, 1); // 选中绿
	box-shadow: 0 4rpx 12rpx rgba(72, 101, 86, 0.25);
}
.tab--home:not(.is-active) .tab__pill {
	background-color: transparent;
	box-shadow: none;
}
.tab__home {
	width: 37rpx;
	height: 44rpx;
	margin-right: 12rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}
.tab__home--on {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3z'/%3E%3C/svg%3E");
}
.tab__home--off {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23424444'%3E%3Cpath d='M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3z'/%3E%3C/svg%3E");
}
.tab__home-label {
	font-family: $yb-font-sans;
	font-size: 29rpx;
	letter-spacing: 1rpx;
	font-weight: 500;
	color: #ffffff;
}
.tab--home:not(.is-active) .tab__home-label {
	color: #424844;
}
.tab--home-hover { opacity: 0.85; }

/* —— 我的回忆（中间） —— */
.tab--center {
	position: absolute;
	left: 310rpx;
	top: 28rpx;
	width: 130rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.tab__center {
	width: 80rpx;
	height: 80rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.tab__center--on {
	background-color: rgba(233, 122, 55, 0.14);
}
.tab__center-img {
	width: 44rpx;
	height: 56rpx;
}
.tab__center-label {
	margin-top: 6rpx;
	font-family: $yb-font-sans;
	font-size: 29rpx;
	letter-spacing: 1rpx;
	font-weight: 500;
	white-space: nowrap;
}
.tab--center-hover { opacity: 0.85; }

/* —— 我的（右侧） —— */
.tab--mine {
	position: absolute;
	left: 566rpx;
	top: 30rpx;
	width: 70rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.tab__mine {
	width: 72rpx;
	height: 72rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.tab__mine--on {
	background-color: rgba(233, 122, 55, 0.14);
}
.tab__mine-img {
	width: 40rpx;
	height: 44rpx;
}
.tab__mine-label {
	margin-top: 8rpx;
	font-family: $yb-font-sans;
	font-size: 29rpx;
	letter-spacing: 1rpx;
	font-weight: 500;
	white-space: nowrap;
}
.tab--mine-hover { opacity: 0.85; }

/* —— 文字高亮 —— */
.tab__text--on {
	color: #E97A37;
}
.tab__text--off {
	color: #424844;
}
</style>
