<template>
	<view class="page">
		<!-- 安全区占位（自定义导航，避开状态栏） -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- ========== 顶部按钮区 + 题目卡 ========== -->
		<view class="top">
			<!-- 三按钮 + 进度 -->
			<view class="top-row">
				<!-- 返回 -->
				<view class="btn btn--img" hover-class="btn-hover" @tap="onBack">
					<image class="btn__img" src="/static/s1开发/clock_slices/back.png" mode="aspectFit"></image>
				</view>
				<!-- 进度 -->
				<text class="progress">{{ progress }}</text>
				<!-- 重新听题 -->
				<view class="btn btn--img" hover-class="btn-hover" @tap="onReplay">
					<image class="btn__img btn__img--sm" src="/static/s1开发/clock_slices/speaker.png" mode="aspectFit"></image>
				</view>
				<!-- 帮助 -->
				<view class="btn btn--img" hover-class="btn-hover" @tap="onHelp">
					<image class="btn__img" src="/static/s1开发/clock_slices/help.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 按钮文字标签 -->
			<view class="top-labels">
				<text class="lbl">返回</text>
				<text class="lbl lbl--right">重新听题</text>
				<text class="lbl lbl--right2">帮助</text>
			</view>

			<!-- 题目卡 -->
			<view class="q-card">
				<text class="q-text">{{ question.title }}</text>
			</view>
		</view>

		<!-- ========== 圆表盘 ========== -->
		<view class="dial-wrap">
			<view class="dial">
				<!-- 11 12 1 -->
				<view class="dial-row dial-row--top">
					<text class="num">11</text>
					<text class="num num--big">12</text>
					<text class="num">1</text>
				</view>
				<!-- 10 2 -->
				<view class="dial-row dial-row--mid">
					<text class="num">10</text>
					<text class="num">2</text>
				</view>
				<!-- 9 + 横条 + 3 -->
				<view class="dial-row dial-row--center">
					<text class="num">9</text>
					<view class="hand hand--h"></view>
					<text class="num">3</text>
				</view>
				<!-- 8 4 -->
				<view class="dial-row dial-row--mid">
					<text class="num">8</text>
					<text class="num">4</text>
				</view>
				<!-- 7 6 5 -->
				<view class="dial-row dial-row--bottom">
					<text class="num">7</text>
					<text class="num num--big">6</text>
					<text class="num">5</text>
				</view>
				<!-- 竖条指针 -->
				<view class="hand hand--v"></view>
				<!-- 中心点 -->
				<image class="center" src="/static/s1开发/clock_slices/center.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ========== 三个答案选项 ========== -->
		<view class="opt-wrap">
			<view class="opt-row">
				<view class="opt" hover-class="opt-hover" @tap="onSelect(0)">
					<text class="opt__text">{{ options[0] || '' }}</text>
				</view>
				<view class="opt" hover-class="opt-hover" @tap="onSelect(1)">
					<text class="opt__text">{{ options[1] || '' }}</text>
				</view>
				<view class="opt" hover-class="opt-hover" @tap="onSelect(2)">
					<text class="opt__text">{{ options[2] || '' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return {
			current: 0,
			statusBarHeight: 20
		}
	},
	computed: {
		store() { return useStore() },
		/** 识钟类题目（visual === 'clock'） */
		clockQuestions() {
			return (this.store.training.questions || []).filter(q => q.visual === 'clock')
		},
		/** 当前展示的题目 */
		question() {
			return this.clockQuestions[this.current] || this.clockQuestions[0] || {}
		},
		/** 当前题目选项（防御空数据） */
		options() {
			return this.question.options || []
		},
		/** 总题数（全部题型） */
		total() {
			return (this.store.training.questions || []).length
		},
		/** 进度文本，如 3/8（按题目在题库中的全局序号） */
		progress() {
			const q = this.question
			const all = this.store.training.questions || []
			const idx = all.findIndex(x => x.id === q.id)
			const no = idx >= 0 ? idx + 1 : (this.current + 1)
			return no + '/' + this.total
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	},
	onShow() {
		actions.refreshTraining()
	},
	methods: {
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		onReplay() {
			uni.showToast({ title: '正在重新读题', icon: 'none' })
		},
		onHelp() {
			uni.showToast({ title: this.question.tip || '看表盘选出正确答案', icon: 'none' })
		},
		onSelect(i) {
			const q = this.question
			if (!q || !q.options || !q.options.length) return
			if (i === q.answerIndex) {
				uni.showToast({ title: '答对啦' + (q.tip ? '，' + q.tip : ''), icon: 'none' })
			} else {
				uni.showToast({ title: '再想想，不着急', icon: 'none' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #F5F9F6;
	width: 750rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* —————————— 顶部按钮区 + 题目卡 —————————— */
.top {
	width: 750rpx;
	padding: 20rpx 31rpx 0 31rpx;
	flex-shrink: 0;
}

.top-row {
	width: 688rpx;
	height: 80rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.btn {
	box-shadow: 0px 2px 4px 0px rgba(180, 160, 140, 0.12);
	background-color: #F5F9F6;
	border-radius: 28rpx;
	height: 80rpx;
	width: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	flex-shrink: 0;
}
.btn--img { }
.btn-hover { opacity: 0.85; }

.btn__img { width: 40rpx; height: 40rpx; }
.btn__img--sm { width: 34rpx; height: 24rpx; }

.progress {
	flex: 1;
	height: 48rpx;
	color: rgba(207, 185, 160, 1);
	font-size: 36rpx;
	font-family: 'PingFang SC', monospace;
	font-weight: 700;
	text-align: left;
	margin-left: 20rpx;
	margin-right: 20rpx;
	line-height: 48rpx;
}

.top-row .btn + .btn { margin-left: 36rpx; }

.top-labels {
	width: 688rpx;
	display: flex;
	flex-direction: row;
	margin-top: 4rpx;
	padding-left: 4rpx;
}
.lbl {
	color: rgba(74, 54, 48, 1);
	font-size: 22rpx;
	font-weight: 500;
	line-height: 30rpx;
	width: 50rpx;
}
.lbl--right { margin-left: 248rpx; }
.lbl--right2 { margin-left: 40rpx; }

.q-card {
	box-shadow: 0px 2px 8px 0px rgba(180, 160, 140, 0.06);
	background-color: #F5F9F6;
	border-radius: 48rpx;
	height: 140rpx;
	border: 2rpx solid rgba(254, 170, 4, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 12rpx;
	box-sizing: border-box;
}

.q-text {
	width: 620rpx;
	color: rgba(58, 40, 35, 1);
	font-size: 34rpx;
	font-weight: 500;
	text-align: center;
	line-height: 48rpx;
	white-space: pre-line;
}

/* —————————— 圆表盘 —————————— */
.dial-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 31rpx;
	min-height: 0;
}

.dial {
	box-shadow: 0px 8px 18px 0px rgba(70, 55, 45, 0.18);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 50%;
	height: 420rpx;
	width: 420rpx;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 8rpx solid rgba(14, 164, 169, 1);
	box-sizing: border-box;
}

/* 表盘文字行 */
.dial-row {
	width: 360rpx;
	display: flex;
	flex-direction: row;
}
.dial-row--top { justify-content: center; gap: 28rpx; margin-top: 16rpx; }
.dial-row--mid { justify-content: space-between; padding: 0 20rpx; }
.dial-row--center { justify-content: center; align-items: center; gap: 36rpx; }
.dial-row--bottom { justify-content: center; gap: 30rpx; margin-bottom: 16rpx; }

.num {
	color: rgba(56, 43, 38, 1);
	font-size: 30rpx;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 500;
	line-height: 42rpx;
	width: 40rpx;
	text-align: center;
}
.num--big { font-size: 34rpx; font-weight: 600; }

/* 指针 */
.hand {
	background-color: rgba(58, 40, 35, 1);
	position: absolute;
}
.hand--h {
	width: 90rpx;
	height: 12rpx;
	left: 50%;
	top: 50%;
	margin-left: -45rpx;
	margin-top: -6rpx;
	border-radius: 6rpx;
}
.hand--v {
	width: 14rpx;
	height: 80rpx;
	left: 50%;
	top: 50%;
	margin-left: -7rpx;
	margin-top: -60rpx;
	border-radius: 7rpx;
}

/* 中心点 */
.center {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 36rpx;
	height: 36rpx;
	margin-left: -18rpx;
	margin-top: -18rpx;
}

/* —————————— 答案选项 —————————— */
.opt-wrap {
	width: 750rpx;
	padding: 0 31rpx 40rpx 31rpx;
	flex-shrink: 0;
}

.opt-row {
	width: 688rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.opt {
	box-shadow: 0px 3px 6px 0px rgba(180, 160, 140, 0.15);
	background-color: rgba(255, 253, 249, 1);
	border-radius: 24rpx;
	height: 110rpx;
	width: 216rpx;
	border: 2rpx solid rgba(255, 170, 0, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.opt-hover { opacity: 0.9; }

.opt__text {
	color: rgba(58, 40, 35, 1);
	font-size: 30rpx;
	font-weight: 500;
	text-align: center;
	line-height: 42rpx;
}
</style>
