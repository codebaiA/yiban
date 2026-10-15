<template>
	<view class="page">
		<!-- ========== 自定义导航栏（取代 uniapp 默认） ========== -->
		<!-- 安全区占位：避开手机状态栏刘海 -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<view class="nav">
			<!-- 左侧：返回按钮 -->
			<view class="nav__back" @tap="onBack">
				<!-- 返回 icon：inline SVG 左箭头（slices 目录未传，暂无 PNG） -->
				<image class="nav__back-arrow" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><path d='M14 4L6 11l8 7' fill='none' stroke='%23151D1A' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>" mode="aspectFit"></image>
				<text class="nav__back-text">返回</text>
			</view>

			<!-- 居中标题（absolute + left/right 0 实现真正居中，不受左右按钮宽度影响） -->
			<text class="nav__title">看看从前</text>

			<!-- 右侧：语音按钮（适老化放大） -->
			<view class="nav__right" @tap="onVoice">
				<image class="nav__right-icon" src="/static/s1开发/看看从前 · 二级界面素材/语音icon.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ========== section_11 Tab 胶囊组 ========== -->
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

		<!-- ========== group_4 内容卡片 ========== -->
		<view class="card">
			<!-- section_13 大图区：王建国照片 -->
			<view class="card__photo-area">
				<!-- block_1 深绿胶囊标签 -->
				<view class="card__label">
					<image class="card__label-icon" :src="patient.avatar || '/static/s1开发/王建国.png'" mode="aspectFill"></image>
					<text class="card__label-text">这就是你&nbsp;·&nbsp;{{ patient.name || '王爷爷' }}</text>
				</view>
				<!-- 大照片：正式素材 王建国照片.png -->
				<image class="card__photo" src="/static/s1开发/看看从前 · 二级界面素材/王建国照片.png" mode="aspectFill"></image>
			</view>

			<!-- text-group_7 两段文字 -->
			<view class="card__texts">
				<text class="card__p1">{{ patient.name || '你' }}是{{ patient.age || 74 }}岁的{{ patient.identity || '退休老人' }}。</text>
				<text class="card__p2">{{ patient.intro || '家属还没有填写个人简介。' }}</text>
			</view>
		</view>

		<!-- ========== box_6 底部区 ========== -->
		<view class="bottom">
			<!-- block_2 朗读按钮 -->
			<view class="speak-btn" :class="{ 'is-speaking': speaking }" @tap="onSpeak">
				<image class="speak-btn__icon" src="/static/s1开发/阅读.png" mode="aspectFit"></image>
				<text class="speak-btn__text">{{ speaking ? '正在朗读…' : '朗读以上内容' }}</text>
				<view class="speak-btn__badge">
					<text class="speak-btn__time">{{ speakDuration }}</text>
				</view>
			</view>

			<!-- block_4 查看更多回忆 -->
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
			statusBarHeight: 20  // 默认值，onLoad 时覆盖
		}
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		activeTab() { return 'whoami' },
		speakText() {
			const p = this.patient
			const parts = []
			if (p.name) parts.push(p.name)
			if (p.age) parts.push(p.age + '岁')
			if (p.identity) parts.push(p.identity)
			if (p.intro) parts.push(p.intro)
			if (!parts.length) return ''
			return parts.map(s => String(s).replace(/[。！？.!?]+$/, '')).join('。') + '。'
		}
	},
	onLoad() {
		// 获取手机状态栏高度，自定义导航栏需安全区占位
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
		onVoice() {
			// 语音/语言按钮占位，后续接语音交互
			uni.showToast({ title: '语音功能开发中', icon: 'none' })
		},
		switchTab(key) {
			const map = {
				whoami: '/pages/past/whoami',
				family: '/pages/past/family',
				residence: '/pages/past/residence'
			}
			if (key === 'whoami') return
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
/* ============================================================
   蓝湖 1:1 还原（750×1623rpx 画布）
   ============================================================ */

.page {
	background-color: rgba(245, 249, 246, 1); /* 蓝湖 page bg */
	min-height: 100vh;
	width: 750rpx;
	display: flex;
	flex-direction: column;
}

/* 自定义导航栏：状态栏安全区 */
.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* ========= 导航栏 ========= */
.nav {
	position: relative;  /* 让标题用 absolute 真正居中 */
	width: 750rpx;
	height: 92rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;  /* 左右按钮贴边 */
	padding: 0 24rpx;
	box-sizing: border-box;
}

/* 左侧返回 */
.nav__back {
	background-color: rgba(230, 240, 234, 1); /* 蓝湖 box_1 bg */
	border-radius: 19229rpx;
	width: 140rpx;   /* 适老化：从 131 → 140 */
	height: 78rpx;   /* 适老化：从 73 → 78 */
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.nav__back-arrow {
	width: 36rpx;   /* 适老化：从 15 → 36（2.4 倍） */
	height: 36rpx;
	margin-right: 6rpx;
}
.nav__back-text {
	color: rgba(21, 29, 26, 1); /* 蓝湖 text-group_1 */
	font-size: 32rpx;  /* 适老化：从 31 → 32 */
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 42rpx;
}

/* 居中标题：absolute left/right:0 让文字在整行正中，不受左右按钮宽度影响 */
.nav__title {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	text-align: center;
	color: rgba(21, 29, 26, 1); /* 蓝湖 text_2 */
	font-size: 42rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 62rpx;
	white-space: nowrap;
	pointer-events: none;  /* 不挡点击 */
}

/* 右侧语音按钮 */
.nav__right {
	background-color: rgba(202, 234, 215, 1); /* 蓝湖 image-wrapper_1 bg */
	border-radius: 19229rpx;
	width: 108rpx;   /* 适老化：从 92 → 108 */
	height: 108rpx;  /* 适老化：从 92 → 108 */
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	box-shadow: 0 1rpx 2rpx 0 rgba(0, 0, 0, 0.05);
}
.nav__right-icon {
	width: 72rpx;   /* 适老化：从 48 → 72（1.5 倍） */
	height: 72rpx;
}

/* ========= section_11 Tab 胶囊组 ========= */
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
		background-color: rgba(88, 181, 165, 1); /* #58B5A5 */
	}
	&.is-selected &__text {
		color: rgba(255, 255, 255, 1);
		font-size: 35rpx;
		line-height: 46rpx;
	}
}

/* ========= group_4 内容卡片 ========= */
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

/* section_13 大图区 */
.card__photo-area {
	position: relative;
	width: 619rpx;
	height: 463rpx;
}

.card__photo {
	width: 100%;
	height: 400rpx;
	border-radius: 21rpx;
	object-fit: cover;
	margin-top: 63rpx;
}

/* block_1 深绿胶囊标签 */
.card__label {
	position: absolute;
	top: 0;
	left: 23rpx;
	background-color: rgba(72, 101, 86, 0.95);
	border-radius: 19229rpx;
	width: 329rpx;
	height: 62rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 23rpx;
	box-sizing: border-box;
	z-index: 2;
}
.card__label-icon {
	width: 29rpx;
	height: 29rpx;
	border-radius: 50%;
	margin-top: 6rpx;
	flex-shrink: 0;
}
.card__label-text {
	color: rgba(255, 255, 255, 1);
	font-size: 29rpx;
	letter-spacing: 1rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 38rpx;
	margin: 6rpx 0 0 12rpx;
	white-space: nowrap;
}

/* text-group_7 两段文字 */
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

/* ========= box_6 底部区 ========= */
.bottom {
	display: flex;
	flex-direction: column;
	margin-top: 23rpx;
}

/* block_2 朗读按钮 */
.speak-btn {
	background-color: rgba(87, 181, 165, 1); /* #57B5A5 */
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

/* block_4 查看更多回忆 */
.more {
	width: 252rpx;
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
