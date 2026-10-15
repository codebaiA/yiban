<template>
	<view class="page">
		<!-- ========== 自定义导航栏（取代 uniapp 默认） ========== -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<view class="nav">
			<!-- 左侧：返回按钮 -->
			<view class="nav__back" @tap="onBack">
				<image class="nav__back-arrow" src="/static/s1开发/看看从前 · 二级界面素材/看看从前-我在哪_slices/返回iocn.png" mode="aspectFit"></image>
				<text class="nav__back-text">返回</text>
			</view>

			<!-- 居中标题 -->
			<text class="nav__title">看看从前</text>

			<!-- 右侧占位：保持布局对称 -->
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

		<!-- ========== 内容卡片 ========== -->
		<view class="card">
			<!-- 大图区：居住地照片 -->
			<view class="card__photo-area">
				<!-- 大照片：有 residence.photo 用它，没有用 slices 素材 默认 -->
				<image class="card__photo" :src="(residence && residence.photo) || '/static/s1开发/看看从前 · 二级界面素材/看看从前-我在哪_slices/我在哪.png'" mode="aspectFill"></image>
			</view>

			<!-- 两段文字 -->
			<view class="card__texts">
				<text class="card__p1">{{ residence ? residence.name || '你住的地方' : '还没有设置居住地' }}</text>
				<text class="card__p2">{{ residence ? (residence.desc || residence.detail || '家属还没有补充居住地的详细介绍。') : '家属可以在「我的 → 家属管理」中补充居住地信息。' }}</text>
			</view>
		</view>

		<!-- ========== 底部区 ========== -->
		<view class="bottom">
			<!-- 朗读按钮 -->
			<view class="speak-btn" :class="{ 'is-speaking': speaking }" @tap="onSpeak">
				<image class="speak-btn__icon" src="/static/s1开发/阅读.png" mode="aspectFit"></image>
				<text class="speak-btn__text">{{ speaking ? '正在朗读…' : '朗读以上内容' }}</text>
				<view class="speak-btn__badge">
					<text class="speak-btn__time">{{ speakDuration }}</text>
				</view>
			</view>

			<!-- 查看更多回忆 -->
			<view class="more" @tap="onViewMore">
				<image class="more__icon" src="/static/s1开发/看看从前 · 二级界面素材/更多回忆.png" mode="aspectFit"></image>
				<text class="more__text">查看更多回忆</text>
				<image class="more__arrow" src="/static/s1开发/看看从前 · 二级界面素材/进入更多回忆.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import tts from '../../services/tts.js'

export default {
	data() {
		return {
			speaking: false,
			speakTip: '',
			speakDuration: '0:45',
			statusBarHeight: 20
		}
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		residence() { return this.store.patient.residence || null },
		activeTab() { return 'residence' },
		speakText() {
			const r = this.residence
			if (!r) return ''
			const parts = [r.name, r.desc, r.detail].filter(Boolean)
			if (!parts.length) return ''
			return parts.map(s => String(s).replace(/[。！？.!?]+$/, '')).join('。') + '。'
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	},
	onShow() {
		actions.refreshPatient()
	},
	methods: {
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		switchTab(key) {
			const map = {
				whoami: '/pages/past/whoami',
				family: '/pages/past/family',
				residence: '/pages/past/residence'
			}
			if (key === 'residence') return
			uni.redirectTo({ url: map[key] })
		},
		onSpeak() {
			if (this.speaking) { tts.stop(); return }
			const text = this.speakText
			if (!text) { this.speakTip = '暂无可朗读内容'; return }
			this.speakTip = ''
			tts.speak(text, {
				onStart: () => { this.speaking = true },
				onDone: () => { this.speaking = false; this.speakTip = '朗读完成' },
				onFallback: (msg) => { this.speakTip = msg }
			})
		},
		onViewMore() {
			uni.switchTab({ url: '/pages/memory/memoir', fail: () => uni.navigateTo({ url: '/pages/memory/memoir' }) })
		}
	}
}
</script>

<style lang="scss" scoped>
/* 像素还原参考 whoami.vue，只换内容 */

.page {
	background-color: rgba(245, 249, 246, 1);
	min-height: 100vh;
	width: 750rpx;
	display: flex;
	flex-direction: column;
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
		background-color: rgba(225, 234, 228, 1);
		margin-left: 15rpx;
	}
	&:nth-child(3) {
		width: 215rpx;
		background-color: rgba(225, 234, 228, 1);
		margin-left: 13rpx;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		white-space: nowrap;
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

/* ========= 内容卡片 ========= */
.card {
	box-shadow: 0 1rpx 2rpx 0 rgba(0, 0, 0, 0.05);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 31rpx;
	width: 673rpx;
	margin: -2rpx 0 0 38rpx;
	display: flex;
	flex-direction: column;
	padding: 27rpx 27rpx 35rpx;
	box-sizing: border-box;
}

.card__photo-area {
	width: 100%;
}

.card__photo {
	width: 100%;
	height: 400rpx;
	border-radius: 21rpx;
	object-fit: cover;
}

.card__texts {
	width: 604rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 27rpx 0 0 35rpx;
}

.card__p1 {
	color: rgba(21, 29, 26, 1);
	font-size: 42rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 62rpx;
	white-space: nowrap;
}

.card__p2 {
	color: rgba(66, 72, 68, 1);
	font-size: 35rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 56rpx;
	margin-top: 12rpx;
}

/* ========= 底部区 ========= */
.bottom {
	display: flex;
	flex-direction: column;
	margin-top: 23rpx;
}

.speak-btn {
	background-color: rgba(87, 181, 165, 1);
	border-radius: 19229rpx;
	width: 673rpx;
	height: 108rpx;
	margin: 0 0 0 38rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 113rpx 0 113rpx;
	box-sizing: border-box;

	&__icon { width: 62rpx; height: 62rpx; }
	&__text {
		color: rgba(255, 255, 255, 1);
		font-size: 42rpx;
		letter-spacing: 1rpx;
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		line-height: 62rpx;
		margin-left: 22rpx;
		flex: 1;
	}
	&__badge {
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 19229rpx;
		width: 98rpx;
		height: 46rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__time {
		color: rgba(255, 255, 255, 0.9);
		font-size: 23rpx;
		letter-spacing: 1rpx;
		font-family: "Liberation Mono", monospace;
		font-weight: normal;
		line-height: 31rpx;
	}

	&.is-speaking { background-color: rgba(72, 101, 86, 1); }
}

.more {
	width: 260rpx;
	height: 42rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 21rpx 0 325rpx 250rpx;

	&__icon { width: 33rpx; height: 33rpx; }
	&__text {
		color: rgba(66, 72, 68, 1);
		font-size: 31rpx;
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		line-height: 42rpx;
		margin-left: 12rpx;
	}
	&__arrow { width: 16rpx; height: 16rpx; margin-left: 12rpx; }
}
</style>
