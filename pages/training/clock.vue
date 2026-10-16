<template>
	<view class="page">
		<!-- 安全区占位 -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 顶部按钮区 + 题目卡 -->
		<view class="top">
			<view class="top-row">
				<view class="btn" hover-class="btn-hover" @tap="onBack">
					<image class="btn__img" src="/static/clock_icons/back.png" mode="aspectFit"></image>
				</view>
				<text class="progress">{{ progress }}</text>
				<view class="btn" hover-class="btn-hover" @tap="onReplay">
					<image class="btn__img btn__img--sm" src="/static/clock_icons/speaker.png" mode="aspectFit"></image>
				</view>
				<view class="btn" hover-class="btn-hover" @tap="onHelp">
					<image class="btn__img" src="/static/clock_icons/help.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="top-labels">
				<text class="lbl">返回</text>
				<text class="lbl lbl--right">重新听题</text>
				<text class="lbl lbl--right2">帮助</text>
			</view>
			<view class="q-card">
				<text class="q-text">{{ question.title }}</text>
			</view>
		</view>

		<!-- 圆表盘 -->
		<view class="dial-wrap">
			<view class="dial">
				<!-- 11 12 1 -->
				<view class="row row--top">
					<text class="num">11</text>
					<text class="num num--bg">12</text>
					<text class="num">1</text>
				</view>
				<!-- 10 · 2 -->
				<view class="row row--mid">
					<text class="num">10</text>
					<text class="num">2</text>
				</view>
				<!-- 9 · 横(时针) · 3 -->
				<view class="row row--center">
					<text class="num">9</text>
					<view class="hand hand--h"></view>
					<text class="num">3</text>
				</view>
				<!-- 8 · 4 -->
				<view class="row row--mid">
					<text class="num">8</text>
					<text class="num">4</text>
				</view>
				<!-- 7 6 5 -->
				<view class="row row--bot">
					<text class="num">7</text>
					<text class="num num--bg">6</text>
					<text class="num">5</text>
				</view>
				<!-- 分针(竖) -->
				<view class="hand hand--v"></view>
				<!-- 中心点 -->
				<image class="center" src="/static/clock_icons/center.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 答案选项 -->
		<view class="opt-wrap">
			<view class="opt-row">
				<view
					class="opt"
					:class="{
						'opt--ok': showResult && selectedIdx === 0 && isCorrect,
						'opt--bad': showResult && selectedIdx === 0 && !isCorrect,
						'opt--off': showResult
					}"
					hover-class="opt-hover" @tap="onSelect(0)"
				>
					<text class="opt__text">{{ options[0] || '' }}</text>
				</view>
				<view
					class="opt"
					:class="{
						'opt--ok': showResult && selectedIdx === 1 && isCorrect,
						'opt--bad': showResult && selectedIdx === 1 && !isCorrect,
						'opt--off': showResult
					}"
					hover-class="opt-hover" @tap="onSelect(1)"
				>
					<text class="opt__text">{{ options[1] || '' }}</text>
				</view>
				<view
					class="opt"
					:class="{
						'opt--ok': showResult && selectedIdx === 2 && isCorrect,
						'opt--bad': showResult && selectedIdx === 2 && !isCorrect,
						'opt--off': showResult
					}"
					hover-class="opt-hover" @tap="onSelect(2)"
				>
					<text class="opt__text">{{ options[2] || '' }}</text>
				</view>
			</view>
		</view>

		<!-- 适老化提示条 -->
		<view v-if="showTip" class="tip-mask" @tap="dismissTip">
			<view class="tip-card" :class="isCorrect ? 'tip--ok' : 'tip--bad'">
				<text class="tip-icon">{{ isCorrect ? '✓' : '✗' }}</text>
				<text class="tip-msg">{{ tipMsg }}</text>
				<text v-if="question.tip" class="tip-sub">{{ question.tip }}</text>
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
			statusBarHeight: 20,
			selectedIdx: -1,
			isCorrect: false,
			showResult: false,
			showTip: false,
			tipMsg: '',
			_timer: null
		}
	},
	computed: {
		store() { return useStore() },
		clockQuestions() {
			return (this.store.training.questions || []).filter(q => q.visual === 'clock')
		},
		question() {
			return this.clockQuestions[this.current] || this.clockQuestions[0] || {}
		},
		options() { return this.question.options || [] },
		total() { return (this.store.training.questions || []).length },
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
	onShow() { actions.refreshTraining() },
	onUnload() { this._clearTimer() },
	methods: {
		_clearTimer() {
			if (this._timer) { clearTimeout(this._timer); this._timer = null }
		},
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		onReplay() {
			this._showTip('正在重新读题', true)
			setTimeout(() => { this.showTip = false }, 1200)
		},
		onHelp() {
			this._showTip(this.question.tip || '看表盘选出正确答案', true)
			setTimeout(() => { this.showTip = false }, 2000)
		},
		onSelect(i) {
			if (this.showResult) return
			const q = this.question
			if (!q || !q.options || !q.options.length) return

			this.selectedIdx = i
			this.isCorrect = (i === q.answerIndex)
			this.showResult = true

			if (this.isCorrect) {
				this._showTip('答对啦！真棒', true)
				this._clearTimer()
				this._timer = setTimeout(() => { this._next() }, 1800)
			} else {
				this._showTip('再想想，不着急', false)
				this._clearTimer()
				this._timer = setTimeout(() => { this._reset() }, 2500)
			}
		},
		_next() {
			this.showTip = false
			this._reset(false)
			const max = Math.max(this.clockQuestions.length - 1, 0)
			if (this.current >= max) {
				this.current = 0
				this._showTip('这组识钟练完了，再来一轮', true)
				this._clearTimer()
				this._timer = setTimeout(() => { this.showTip = false }, 2000)
			} else {
				this.current++
			}
		},
		_reset(all = true) {
			this.selectedIdx = -1
			this.isCorrect = false
			this.showResult = false
			if (all) { this.current = 0; this.showTip = false }
		},
		_showTip(msg, ok) {
			this.tipMsg = msg
			this.isCorrect = ok
			this.showTip = true
		},
		dismissTip() { this.showTip = false }
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
.nav-safe { width: 750rpx; flex-shrink: 0; }

/* ========== 顶部 ========== */
.top { width: 750rpx; padding: 20rpx 31rpx 0 31rpx; flex-shrink: 0; }
.top-row {
	width: 688rpx; height: 80rpx;
	display: flex; flex-direction: row; align-items: center;
}

.btn {
	box-shadow: 0px 2px 4px 0px rgba(180,160,140,0.12);
	background-color: #F5F9F6;
	border-radius: 28rpx;
	height: 80rpx; width: 80rpx;
	display: flex; align-items: center; justify-content: center;
	box-sizing: border-box; flex-shrink: 0;
}
.btn-hover { opacity: 0.85; }
.btn__img { width: 40rpx; height: 40rpx; }
.btn__img--sm { width: 34rpx; height: 24rpx; }

.progress {
	flex: 1; height: 48rpx;
	color: rgba(207,185,160,1);
	font-size: 36rpx; font-family: 'PingFang SC', monospace;
	font-weight: 700; text-align: left;
	margin-left: 20rpx; margin-right: 20rpx; line-height: 48rpx;
}
.top-row .btn + .btn { margin-left: 36rpx; }

.top-labels { width: 688rpx; display: flex; flex-direction: row; margin-top: 4rpx; padding-left: 4rpx; }
.lbl { color: rgba(74,54,48,1); font-size: 22rpx; font-weight: 500; line-height: 30rpx; width: 50rpx; }
.lbl--right { margin-left: 248rpx; }
.lbl--right2 { margin-left: 40rpx; }

.q-card {
	box-shadow: 0px 2px 8px 0px rgba(180,160,140,0.06);
	background-color: #F5F9F6;
	border-radius: 48rpx;
	height: 140rpx;
	border: 2rpx solid rgba(254,170,4,1);
	display: flex; align-items: center; justify-content: center;
	margin-top: 12rpx; box-sizing: border-box;
}
.q-text {
	width: 620rpx; color: rgba(58,40,35,1);
	font-size: 34rpx; font-weight: 500;
	text-align: center; line-height: 48rpx; white-space: pre-line;
}

/* ========== 表盘 ========== */
.dial-wrap {
	flex: 1;
	display: flex; align-items: center; justify-content: center;
	padding: 0 31rpx; min-height: 0;
}
.dial {
	box-shadow: 0px 8px 18px 0px rgba(70,55,45,0.18);
	background-color: #fff;
	border-radius: 50%;
	height: 380rpx; width: 380rpx;
	position: relative;
	display: flex; flex-direction: column; align-items: center; justify-content: center;
	border: 8rpx solid rgba(14,164,169,1);
	box-sizing: border-box;
}

/* 表盘数字行 */
.row {
	width: 320rpx;
	display: flex; flex-direction: row; align-items: center;
	position: relative; z-index: 1;
}
.row--top { justify-content: center; gap: 22rpx; margin-top: 12rpx; }
.row--mid { justify-content: space-between; padding: 0 16rpx; }
.row--center { justify-content: center; align-items: center; gap: 28rpx; }
.row--bot { justify-content: center; gap: 24rpx; margin-bottom: 12rpx; }

.num {
	color: rgba(56,43,38,1);
	font-size: 30rpx; font-family: 'PingFang SC', sans-serif;
	font-weight: 500; line-height: 40rpx;
	width: 36rpx; text-align: center;
}
.num--bg { font-size: 32rpx; font-weight: 600; }

/* 指针：简单矩形 + 圆头，全部 absolute 基于 dial 中心 */
.hand {
	background-color: rgba(58,40,35,1);
	position: absolute; z-index: 2;
}
/* 时针（横，指向3）：body 60rpx + 右端大圆 18rpx */
.hand--h {
	width: 78rpx; height: 12rpx;
	left: 50%; top: 50%;
	margin-left: -39rpx; margin-top: -6rpx;
	border-radius: 6rpx;
}
.hand--h::after {
	content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
	width: 20rpx; height: 20rpx; background: rgba(58,40,35,1); border-radius: 50%;
}
/* 分针（竖，指向12）：body 80rpx + 上端大圆 22rpx */
.hand--v {
	width: 14rpx; height: 102rpx;
	left: 50%; top: 50%;
	margin-left: -7rpx; margin-top: -72rpx;
	border-radius: 7rpx;
}
.hand--v::after {
	content: ''; position: absolute; left: 50%; top: 0; transform: translateX(-50%);
	width: 24rpx; height: 24rpx; background: rgba(58,40,35,1); border-radius: 50%;
}

.center {
	position: absolute; left: 50%; top: 50%;
	width: 30rpx; height: 30rpx;
	margin-left: -15rpx; margin-top: -15rpx; z-index: 3;
}

/* ========== 答案 ========== */
.opt-wrap { width: 750rpx; padding: 0 31rpx 40rpx 31rpx; flex-shrink: 0; }
.opt-row { width: 688rpx; display: flex; flex-direction: row; justify-content: space-between; }

.opt {
	box-shadow: 0px 3px 6px 0px rgba(180,160,140,0.15);
	background-color: rgba(255,253,249,1);
	border-radius: 24rpx;
	height: 110rpx; width: 216rpx;
	border: 3rpx solid rgba(255,170,0,1);
	display: flex; align-items: center; justify-content: center;
	box-sizing: border-box; transition: all .15s ease;
}
.opt-hover { opacity: 0.9; }
.opt--ok { background-color: #59B5A5 !important; border-color: #59B5A5 !important; }
.opt--ok .opt__text { color: #fff; font-weight: 600; }
.opt--bad { background-color: #FF5458 !important; border-color: #FF5458 !important; }
.opt--bad .opt__text { color: #fff; font-weight: 600; }
.opt--off { opacity: 0.7; }

.opt__text {
	color: rgba(58,40,35,1);
	font-size: 34rpx; font-weight: 500;
	text-align: center; line-height: 44rpx;
}

/* ========== 适老化提示条 ========== */
.tip-mask {
	position: fixed; inset: 0;
	display: flex; align-items: center; justify-content: center;
	z-index: 999; background: rgba(0,0,0,0.1);
}
.tip-card {
	width: 560rpx; padding: 48rpx 40rpx;
	border-radius: 36rpx;
	display: flex; flex-direction: column; align-items: center;
	box-shadow: 0 12rpx 36rpx rgba(0,0,0,0.18);
}
.tip--ok { background: #59B5A5; }
.tip--bad { background: #FF5458; }
.tip-icon {
	font-size: 120rpx; color: #fff;
	line-height: 1; font-weight: 700; margin-bottom: 16rpx;
}
.tip-msg {
	color: #fff; font-size: 48rpx; font-weight: 700;
	text-align: center; line-height: 60rpx;
}
.tip-sub {
	color: rgba(255,255,255,0.9); font-size: 32rpx; font-weight: 500;
	text-align: center; line-height: 44rpx; margin-top: 20rpx; max-width: 480rpx;
}
</style>
