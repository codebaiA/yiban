<template>
	<view class="page">
		<!-- 安全区占位 -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 顶部按钮区 + 题目卡 -->
		<view class="top">
			<view class="top-row">
				<view class="btn" hover-class="btn-hover" @tap="onBack">
					<image class="btn__img" src="/static/s1开发/clock_slices/back.png" mode="aspectFit"></image>
				</view>
				<text class="progress">{{ progress }}</text>
				<view class="btn" hover-class="btn-hover" @tap="onReplay">
					<image class="btn__img btn__img--sm" src="/static/s1开发/clock_slices/speaker.png" mode="aspectFit"></image>
				</view>
				<view class="btn" hover-class="btn-hover" @tap="onHelp">
					<image class="btn__img" src="/static/s1开发/clock_slices/help.png" mode="aspectFit"></image>
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
				<!-- 9 + 横条(时针) + 3 -->
				<view class="dial-row dial-row--center">
					<text class="num">9</text>
					<!-- 时针：body + 圆头(指向3) -->
					<view class="hand-wrap hand-wrap--h">
						<view class="hand-body hand-body--h"></view>
						<view class="hand-tip hand-tip--h"></view>
					</view>
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
				<!-- 分针(竖)：body + 圆头(指向12) -->
				<view class="hand-wrap hand-wrap--v">
					<view class="hand-body hand-body--v"></view>
					<view class="hand-tip hand-tip--v"></view>
				</view>
				<!-- 中心点 -->
				<image class="center" src="/static/s1开发/clock_slices/center.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 答案选项 -->
		<view class="opt-wrap">
			<view class="opt-row">
				<view
					class="opt"
					:class="{
						'opt--correct': showResult && selectedIdx === 0 && isCorrect,
						'opt--wrong': showResult && selectedIdx === 0 && !isCorrect,
						'opt--disabled': showResult
					}"
					hover-class="opt-hover"
					@tap="onSelect(0)"
				>
					<text class="opt__text">{{ options[0] || '' }}</text>
				</view>
				<view
					class="opt"
					:class="{
						'opt--correct': showResult && selectedIdx === 1 && isCorrect,
						'opt--wrong': showResult && selectedIdx === 1 && !isCorrect,
						'opt--disabled': showResult
					}"
					hover-class="opt-hover"
					@tap="onSelect(1)"
				>
					<text class="opt__text">{{ options[1] || '' }}</text>
				</view>
				<view
					class="opt"
					:class="{
						'opt--correct': showResult && selectedIdx === 2 && isCorrect,
						'opt--wrong': showResult && selectedIdx === 2 && !isCorrect,
						'opt--disabled': showResult
					}"
					hover-class="opt-hover"
					@tap="onSelect(2)"
				>
					<text class="opt__text">{{ options[2] || '' }}</text>
				</view>
			</view>
		</view>

		<!-- 适老化提示条（代替 showToast） -->
		<view v-if="showTip" class="tip-mask" @tap="dismissTip">
			<view class="tip-card" :class="isCorrect ? 'tip-card--ok' : 'tip-card--bad'">
				<text class="tip-icon">{{ isCorrect ? '✓' : '✗' }}</text>
				<text class="tip-msg">{{ tipMsg }}</text>
				<text v-if="question.tip" class="tip-hint">{{ question.tip }}</text>
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
			// 答题状态
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
		/** 识钟类题目 */
		clockQuestions() {
			return (this.store.training.questions || []).filter(q => q.visual === 'clock')
		},
		/** 当前题目 */
		question() {
			return this.clockQuestions[this.current] || this.clockQuestions[0] || {}
		},
		options() {
			return this.question.options || []
		},
		total() {
			return (this.store.training.questions || []).length
		},
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
	onUnload() {
		this._clearTimer()
	},
	methods: {
		_clearTimer() {
			if (this._timer) {
				clearTimeout(this._timer)
				this._timer = null
			}
		},
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		onReplay() {
			this._showTip('正在重新读题', true)
			setTimeout(() => { this.showTip = false }, 1200)
		},
		onHelp() {
			const msg = this.question.tip || '看表盘选出正确答案'
			this._showTip(msg, true)
			setTimeout(() => { this.showTip = false }, 2000)
		},
		onSelect(i) {
			if (this.showResult) return // 已作答，防止重复点击
			const q = this.question
			if (!q || !q.options || !q.options.length) return

			this.selectedIdx = i
			this.isCorrect = (i === q.answerIndex)
			this.showResult = true

			if (this.isCorrect) {
				this._showTip('答对啦！真棒', true)
				// 答对 1.5 秒后自动切下一题
				this._clearTimer()
				this._timer = setTimeout(() => {
					this._next()
				}, 1800)
			} else {
				this._showTip('再想想，不着急', false)
				// 答错：2.5 秒后重置，让用户再选
				this._clearTimer()
				this._timer = setTimeout(() => {
					this._reset()
				}, 2500)
			}
		},
		/** 切下一题 */
		_next() {
			this.showTip = false
			this._reset(false)
			const max = Math.max(this.clockQuestions.length - 1, 0)
			if (this.current >= max) {
				// 已是最后一道识钟题，循环回第一题
				this.current = 0
				this._showTip('这组识钟练完了，再来一轮', true)
				this._clearTimer()
				this._timer = setTimeout(() => { this.showTip = false }, 2000)
			} else {
				this.current++
			}
		},
		/** 重置答题状态 */
		reset(all = true) {
			this.selectedIdx = -1
			this.isCorrect = false
			this.showResult = false
			if (all) {
				this.current = 0
				this.showTip = false
			}
		},
		_reset(all = true) { this.reset(all) },
		_showTip(msg, ok) {
			this.tipMsg = msg
			this.isCorrect = ok
			this.showTip = true
		},
		dismissTip() {
			this.showTip = false
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
.nav-safe { width: 750rpx; flex-shrink: 0; }

/* ———————— 顶部按钮区 + 题目卡 ———————— */
.top { width: 750rpx; padding: 20rpx 31rpx 0 31rpx; flex-shrink: 0; }
.top-row { width: 688rpx; height: 80rpx; display: flex; flex-direction: row; align-items: center; }

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

/* ———————— 圆表盘 ———————— */
.dial-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 31rpx; min-height: 0; }
.dial {
	box-shadow: 0px 8px 18px 0px rgba(70,55,45,0.18);
	background-color: #fff;
	border-radius: 50%;
	height: 400rpx; width: 400rpx;
	position: relative;
	display: flex; flex-direction: column; align-items: center; justify-content: center;
	border: 8rpx solid rgba(14,164,169,1);
	box-sizing: border-box;
}

.dial-row { width: 340rpx; display: flex; flex-direction: row; }
.dial-row--top { justify-content: center; gap: 24rpx; margin-top: 12rpx; }
.dial-row--mid { justify-content: space-between; padding: 0 18rpx; }
.dial-row--center { justify-content: center; align-items: center; gap: 30rpx; }
.dial-row--bottom { justify-content: center; gap: 26rpx; margin-bottom: 12rpx; }

.num {
	color: rgba(56,43,38,1); font-size: 30rpx;
	font-family: 'PingFang SC', sans-serif; font-weight: 500;
	line-height: 42rpx; width: 40rpx; text-align: center;
}
.num--big { font-size: 34rpx; font-weight: 600; }

/* —— 指针（头明显比尾长/粗） —— */
/* 统一：body 是细杆，tip 是头部大圆 */
.hand-wrap { position: absolute; left: 50%; top: 50%; }

/* 时针（横，指向3）：body 水平细杆 + 右端大圆头 */
.hand-wrap--h { margin-left: -40rpx; margin-top: -5rpx; width: 80rpx; height: 10rpx; }
.hand-body--h {
	position: absolute; left: 0; top: 50%; transform: translateY(-50%);
	width: 62rpx; height: 10rpx;
	background: rgba(58,40,35,1); border-radius: 5rpx;
}
.hand-tip--h {
	position: absolute; right: 0; top: 50%; transform: translateY(-50%);
	width: 20rpx; height: 20rpx;
	background: rgba(58,40,35,1); border-radius: 50%;
}

/* 分针（竖，指向12）：body 竖直细杆 + 上端大圆头 */
.hand-wrap--v { margin-left: -6rpx; margin-top: -72rpx; width: 12rpx; height: 120rpx; }
.hand-body--v {
	position: absolute; left: 50%; top: 20rpx; transform: translateX(-50%);
	width: 12rpx; height: 92rpx;
	background: rgba(58,40,35,1); border-radius: 6rpx;
}
.hand-tip--v {
	position: absolute; left: 50%; top: 0; transform: translateX(-50%);
	width: 24rpx; height: 24rpx;
	background: rgba(58,40,35,1); border-radius: 50%;
}

.center {
	position: absolute; left: 50%; top: 50%;
	width: 32rpx; height: 32rpx;
	margin-left: -16rpx; margin-top: -16rpx;
}

/* ———————— 答案选项 ———————— */
.opt-wrap { width: 750rpx; padding: 0 31rpx 40rpx 31rpx; flex-shrink: 0; }
.opt-row { width: 688rpx; display: flex; flex-direction: row; justify-content: space-between; }

.opt {
	box-shadow: 0px 3px 6px 0px rgba(180,160,140,0.15);
	background-color: rgba(255,253,249,1);
	border-radius: 24rpx;
	height: 110rpx; width: 216rpx;
	border: 3rpx solid rgba(255,170,0,1);
	display: flex; align-items: center; justify-content: center;
	box-sizing: border-box;
	transition: all .15s ease;
}
.opt-hover { opacity: 0.9; }

/* 答对 */
.opt--correct {
	background-color: #59B5A5 !important;
	border-color: #59B5A5 !important;
}
.opt--correct .opt__text { color: #fff; font-weight: 600; }

/* 答错 */
.opt--wrong {
	background-color: #FF5458 !important;
	border-color: #FF5458 !important;
}
.opt--wrong .opt__text { color: #fff; font-weight: 600; }

/* 已作答后全部禁用态 */
.opt--disabled { opacity: 0.7; }

.opt__text {
	color: rgba(58,40,35,1);
	font-size: 34rpx; font-weight: 500;
	text-align: center; line-height: 44rpx;
}

/* ———————— 适老化提示条 ———————— */
.tip-mask {
	position: fixed; inset: 0;
	display: flex; align-items: center; justify-content: center;
	z-index: 999;
}
.tip-card {
	width: 560rpx;
	padding: 48rpx 40rpx;
	border-radius: 36rpx;
	display: flex; flex-direction: column; align-items: center;
	box-shadow: 0 12rpx 36rpx rgba(0,0,0,0.18);
}
.tip-card--ok {
	background: #59B5A5;
}
.tip-card--bad {
	background: #FF5458;
}
.tip-icon {
	font-size: 120rpx;
	color: #fff;
	line-height: 1;
	font-weight: 700;
	margin-bottom: 16rpx;
}
.tip-msg {
	color: #fff;
	font-size: 48rpx;
	font-weight: 700;
	text-align: center;
	line-height: 60rpx;
}
.tip-hint {
	color: rgba(255,255,255,0.9);
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	line-height: 44rpx;
	margin-top: 20rpx;
	max-width: 480rpx;
}
</style>
