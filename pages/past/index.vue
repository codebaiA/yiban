<template>
	<view class="page">
		<!-- ========== 自定义导航栏 ========== -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<view class="nav">
			<view class="nav__back" @tap="onBack">
				<image class="nav__back-arrow" src="/static/s1开发/看看从前 · 二级界面素材/看看从前-我在哪_slices/返回iocn.png" mode="aspectFit"></image>
				<text class="nav__back-text">返回</text>
			</view>

			<text class="nav__title">看看从前</text>

			<view class="nav__placeholder"></view>
		</view>

		<!-- ========== Tab 胶囊组 ========== -->
		<view class="tabs">
			<view class="tab" :class="{ 'is-selected': activeTab === 'whoami' }" @tap="switchTab('whoami')">
				<text class="tab__text">我是谁</text>
			</view>
			<view class="tab" :class="{ 'is-selected': activeTab === 'family' }" @tap="switchTab('family')">
				<text class="tab__text">家人们</text>
			</view>
			<view class="tab" :class="{ 'is-selected': activeTab === 'residence' }" @tap="switchTab('residence')">
				<text class="tab__text">我在哪</text>
			</view>
		</view>

		<!-- ========== 内容区：三 panel 横向滑动过渡（中间不断） ========== -->
		<view class="stage">
			<view class="track" :style="trackStyle">
				<view class="panel-wrap"><WhoamiPanel /></view>
				<view class="panel-wrap"><FamilyPanel /></view>
				<view class="panel-wrap"><ResidencePanel /></view>
			</view>
		</view>
	</view>
</template>

<script>
import { actions } from '../../store/index.js'
import WhoamiPanel from '../../components/past/whoami-panel.vue'
import FamilyPanel from '../../components/past/family-panel.vue'
import ResidencePanel from '../../components/past/residence-panel.vue'

const TABS = ['whoami', 'family', 'residence']

export default {
	components: { WhoamiPanel, FamilyPanel, ResidencePanel },
	data() {
		return {
			statusBarHeight: 20,
			activeTab: 'whoami',
			tabIndex: 0
		}
	},
	computed: {
		trackStyle() {
			return { transform: 'translateX(-' + (this.tabIndex * 750) + 'rpx)' }
		}
	},
	onLoad(options) {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
		// 支持 ?tab=whoami|family|residence 指定初始页签
		const t = options && options.tab
		if (t && TABS.indexOf(t) >= 0) {
			this.activeTab = t
			this.tabIndex = TABS.indexOf(t)
		}
	},
	onShow() {
		actions.refreshPatient()
		actions.refreshFamily()
	},
	methods: {
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		switchTab(key) {
			if (key === this.activeTab) return
			this.activeTab = key
			this.tabIndex = TABS.indexOf(key)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: rgba(245, 249, 246, 1);
	min-height: 100vh;
	width: 750rpx;
	display: flex;
	flex-direction: column;
	overflow-x: hidden;
}

.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* ========= 导航栏 ========= */
.nav {
	position: relative;
	width: 750rpx;
	height: 92rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	box-sizing: border-box;
}

.nav__back {
	background-color: rgba(230, 240, 234, 1);
	border-radius: 19229rpx;
	width: 140rpx;
	height: 78rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.nav__back-arrow {
	width: 36rpx;
	height: 36rpx;
	margin-right: 6rpx;
}
.nav__back-text {
	color: rgba(21, 29, 26, 1);
	font-size: 32rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 42rpx;
}

.nav__title {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	text-align: center;
	color: rgba(21, 29, 26, 1);
	font-size: 42rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 62rpx;
	white-space: nowrap;
	pointer-events: none;
}

.nav__placeholder {
	width: 108rpx;
	height: 108rpx;
	flex-shrink: 0;
}

/* ========= Tab 胶囊组 ========= */
.tabs {
	width: 675rpx;
	height: 92rpx;
	display: flex;
	flex-direction: row;
	margin: 20rpx 0 29rpx 38rpx;
}

.tab {
	height: 92rpx;
	border-radius: 19229rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;

	&:nth-child(1) { width: 215rpx; }
	&:nth-child(2) {
		width: 215rpx;
		margin-left: 15rpx;
	}
	&:nth-child(3) {
		width: 215rpx;
		margin-left: 13rpx;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		white-space: nowrap;
	}

	&:not(.is-selected) {
		background-color: rgba(225, 234, 228, 1);
	}
	&:not(.is-selected) &__text {
		color: rgba(66, 72, 68, 1);
		font-size: 31rpx;
		line-height: 42rpx;
	}

	&.is-selected {
		background-color: rgba(88, 181, 165, 1);
	}
	&.is-selected &__text {
		color: rgba(255, 255, 255, 1);
		font-size: 35rpx;
		line-height: 46rpx;
	}
}

/* ========= 内容区（横向滑动） ========= */
.stage {
	width: 750rpx;
	overflow: hidden;
	flex: 1;
}

.track {
	display: flex;
	flex-direction: row;
	transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	will-change: transform;
}

.panel-wrap {
	width: 750rpx;
	flex-shrink: 0;
}
</style>
