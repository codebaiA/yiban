<template>
	<view class="page">
		<!-- 状态栏安全区 -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 自定义导航栏 -->
		<view class="nav">
			<view class="nav__back" @tap="onBack">
				<image class="nav__back-arrow" :src="icon('trainingBack')" mode="aspectFit"></image>
				<text class="nav__back-text">返回</text>
			</view>
			<text class="nav__title">脑力小时光</text>
			<view class="nav__help" @tap="showHelp">
				<image class="nav__help-icon" :src="icon('trainingHelp')" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 答题中 -->
		<block v-if="!finished && question">
			<!-- 进度 -->
			<view class="progress">
				<view class="progress__head">
					<text class="progress__label">第 {{ current + 1 }} 题 · 共 {{ total }} 题</text>
					<text class="progress__badge" v-if="answered" :class="isCorrect ? 'is-right' : 'is-wrong'">
						{{ isCorrect ? '答对了' : '再想想' }}
					</text>
				</view>
				<view class="progress__track">
					<view class="progress__fill" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>

			<!-- 题目卡片 -->
			<view class="card">
				<view class="card__head">
					<text class="card__title">{{ question.title }}</text>
					<view class="card__replay" @tap="replayQuestion">
						<image class="card__replay-icon" :src="icon('trainingReplay')" mode="aspectFit"></image>
					</view>
				</view>

				<!-- 识钟：CSS 钟面（动态指针） -->
				<view v-if="question.clock" class="clock">
					<text class="clock__num clock__num--12">12</text>
					<text class="clock__num clock__num--3">3</text>
					<text class="clock__num clock__num--6">6</text>
					<text class="clock__num clock__num--9">9</text>
					<view class="clock__hand clock__hand--hour" :style="{ transform: 'rotate(' + hourAngle + 'deg)' }"></view>
					<view class="clock__hand clock__hand--minute" :style="{ transform: 'rotate(' + minuteAngle + 'deg)' }"></view>
					<view class="clock__dot"></view>
				</view>
				<image v-else-if="questionImage" class="card__image" :src="questionImage" mode="aspectFit"></image>

				<!-- 选项 -->
				<view class="options">
					<view
						v-for="(opt, i) in question.options"
						:key="i"
						class="option"
						:class="optionClass(i)"
						hover-class="option--hover"
						@tap="selectOption(i)"
					>
						<text class="option__index">{{ optionLetter(i) }}</text>
						<text class="option__text">{{ opt }}</text>
					</view>
				</view>
			</view>

			<!-- 答题反馈 -->
			<view v-if="answered" class="feedback">
				<text class="feedback__title">{{ isCorrect ? '答对啦！' : '没关系，看这里' }}</text>
				<text class="feedback__tip">{{ question.tip }}</text>
				<view class="feedback__next" hover-class="feedback__next--hover" @tap="next">
					<text class="feedback__next-text">{{ isLast ? '查看结果' : '下一题' }}</text>
				</view>
			</view>
		</block>

		<!-- 结果页 -->
		<view v-else-if="finished" class="result">
			<text class="result__emoji">{{ correctCount >= total ? '真棒' : '不错哦' }}</text>
			<text class="result__title">脑力小挑战完成</text>
			<text class="result__score">共答对 {{ correctCount }} / {{ total }} 题</text>
			<text class="result__sub">每天动动脑，记忆更牢靠</text>
			<view class="result__actions">
				<view class="result__btn result__btn--primary" hover-class="result__btn--hover" @tap="restart">
					<text class="result__btn-text">再来一组</text>
				</view>
				<view class="result__btn result__btn--ghost" hover-class="result__btn--hover" @tap="goHome">
					<text class="result__btn-text result__btn-text--ghost">返回首页</text>
				</view>
			</view>
		</view>

		<!-- 加载中 / 空态兜底 -->
		<view v-else class="empty">
			<text class="empty__text">题目加载中…</text>
		</view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import { icon } from '../../services/iconMap.js'
import { speak } from '../../services/tts.js'

// 接口返回空时的兜底题库（保证进页面一定有题可做）
const FALLBACK_QUESTIONS = [
	{
		id: 'fb1', type: 'CLOCK',
		title: '这个钟显示几点？',
		clock: { hour: 3, minute: 0 },
		options: ['3点', '6点', '12点'],
		answerIndex: 0,
		tip: '短针指 3，长针指 12，是 3 点整'
	},
	{
		id: 'fb2', type: 'CLOCK',
		title: '这个钟显示几点？',
		clock: { hour: 9, minute: 0 },
		options: ['9点', '8点', '10点'],
		answerIndex: 0,
		tip: '短针指 9，长针指 12'
	},
	{
		id: 'fb3', type: 'CLOCK',
		title: '这个钟显示几点半？',
		clock: { hour: 6, minute: 30 },
		options: ['5点半', '6点半', '7点半'],
		answerIndex: 1,
		tip: '长针指向 6，表示半点'
	}
]

function shuffle(arr) {
	const a = arr.slice()
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

export default {
	data() {
		return {
			icon,
			statusBarHeight: 20,
			questions: [],
			current: 0,
			selectedIndex: -1,
			answered: false,
			correctCount: 0,
			finished: false
		}
	},
	computed: {
		store() { return useStore() },
		question() { return this.questions[this.current] || null },
		total() { return this.questions.length },
		isCorrect() {
			return this.answered && this.question && this.selectedIndex === this.question.answerIndex
		},
		isLast() { return this.current >= this.total - 1 },
		progressPercent() {
			if (!this.total) return 0
			return Math.round(((this.current + 1) / this.total) * 100)
		},
		hourAngle() {
			const q = this.question
			if (!q || !q.clock) return 0
			return ((q.clock.hour % 12) * 30) + (q.clock.minute * 0.5)
		},
		minuteAngle() {
			const q = this.question
			if (!q || !q.clock) return 0
			return q.clock.minute * 6
		},
		questionImage() {
			const q = this.question
			if (!q) return ''
			if (q.image) return q.image
			if (q.type === 'COUNT') return icon('countApples')
			return ''
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	},
	onShow() {
		this.initQuestions()
	},
	methods: {
		async initQuestions() {
			try {
				await actions.refreshTraining()
			} catch (e) {
				// 拉取失败也走兜底
			}
			const list = this.store.training.questions || []
			this.questions = shuffle(list.length ? list : FALLBACK_QUESTIONS)
			this.reset()
		},
		reset() {
			this.current = 0
			this.selectedIndex = -1
			this.answered = false
			this.correctCount = 0
			this.finished = false
		},
		optionLetter(i) {
			return String.fromCharCode(65 + i) // A / B / C
		},
		optionClass(i) {
			if (!this.answered) return ''
			if (i === this.question.answerIndex) return 'option--correct'
			if (i === this.selectedIndex) return 'option--wrong'
			return 'option--dim'
		},
		selectOption(i) {
			if (this.answered) return
			this.selectedIndex = i
			this.answered = true
			if (this.question && i === this.question.answerIndex) {
				this.correctCount += 1
			}
		},
		replayQuestion() {
			const q = this.question
			if (q && q.title) speak(q.title)
		},
		showHelp() {
			uni.showModal({
				title: '帮助',
				content: '看钟面：短针是时针，长针是分针。长针指向 12 就是整点，指向 6 就是半点。',
				showCancel: false,
				confirmText: '知道了'
			})
		},
		next() {
			if (this.isLast) {
				this.finished = true
				return
			}
			this.current += 1
			this.selectedIndex = -1
			this.answered = false
		},
		restart() {
			this.questions = shuffle(this.questions)
			this.reset()
		},
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: $yb-c-bg-grey; /* #F5F9F6 */
	min-height: 100vh;
	width: 750rpx;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* ========= 导航栏（与看看从前二级页一致） ========= */
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
	background-color: #E6F0EA;
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
	color: $yb-c-text-2;
	font-size: 32rpx;
	font-family: $yb-font-sans;
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
	color: $yb-c-text-2;
	font-size: 42rpx;
	font-family: $yb-font-sans;
	font-weight: 500;
	line-height: 62rpx;
	white-space: nowrap;
	pointer-events: none;
}

.nav__help {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	background-color: #E6F0EA;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.nav__help-icon {
	width: 44rpx;
	height: 44rpx;
}

/* ========= 进度 ========= */
.progress {
	width: 686rpx;
	margin: 20rpx 0 0 32rpx;
}

.progress__head {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.progress__label {
	color: $yb-c-text-sub;
	font-size: $yb-fs-s;
	font-family: $yb-font-sans;
	line-height: 43rpx;
}

.progress__badge {
	padding: 6rpx 22rpx;
	border-radius: 19229rpx;
	font-size: $yb-fs-xs;
	font-family: $yb-font-sans;
	line-height: 38rpx;

	&.is-right { background-color: $yb-c-teal-3; color: $yb-c-green-2; }
	&.is-wrong { background-color: #FDE7E5; color: $yb-c-danger; }
}

.progress__track {
	width: 100%;
	height: 14rpx;
	border-radius: 7rpx;
	background-color: #E5EDE8;
	overflow: hidden;
}

.progress__fill {
	height: 100%;
	border-radius: 7rpx;
	background-color: $yb-c-teal-1;
	transition: width 0.3s ease;
}

/* ========= 题目卡片 ========= */
.card {
	background-color: $yb-c-bg-white;
	border-radius: $yb-r-xl;
	border: 1rpx solid #E3EDE7;
	box-shadow: $yb-shadow-card;
	width: 686rpx;
	margin: 24rpx 0 0 32rpx;
	padding: 46rpx 40rpx 50rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.card__head {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
}

.card__title {
	color: $yb-c-text-1;
	font-size: $yb-fs-l;
	font-family: $yb-font-sans;
	font-weight: 500;
	line-height: 63rpx;
	text-align: center;
}

.card__replay {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: $yb-c-bg-grey2;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 16rpx;
	flex-shrink: 0;
}
.card__replay-icon {
	width: 36rpx;
	height: 36rpx;
}

.card__image {
	width: 320rpx;
	height: 320rpx;
	margin: 0 auto 40rpx;
}

/* ========= CSS 钟面（占位，未来替换切片图片） ========= */
.clock {
	position: relative;
	width: 320rpx;
	height: 320rpx;
	border-radius: 50%;
	background-color: #FFFFFF;
	border: 8rpx solid $yb-c-text-1;
	box-shadow: 0 8rpx 24rpx rgba(30, 50, 40, 0.12);
	margin: 0 auto 40rpx;
	box-sizing: border-box;
}

.clock__num {
	position: absolute;
	font-size: 42rpx;
	font-weight: 700;
	color: $yb-c-text-1;
	font-family: $yb-font-sans;
	line-height: 1;
}
.clock__num--12 { left: 50%; top: 18rpx; transform: translateX(-50%); }
.clock__num--3 { right: 22rpx; top: 50%; transform: translateY(-50%); }
.clock__num--6 { left: 50%; bottom: 18rpx; transform: translateX(-50%); }
.clock__num--9 { left: 22rpx; top: 50%; transform: translateY(-50%); }

.clock__hand {
	position: absolute;
	left: 50%;
	bottom: 50%;
	transform-origin: 50% 100%;
	border-radius: 6rpx;
}
.clock__hand--hour {
	width: 14rpx;
	height: 82rpx;
	margin-left: -7rpx;
	background-color: $yb-c-text-1;
}
.clock__hand--minute {
	width: 10rpx;
	height: 118rpx;
	margin-left: -5rpx;
	background-color: $yb-c-orange-2;
}

.clock__dot {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 24rpx;
	height: 24rpx;
	margin: -12rpx 0 0 -12rpx;
	border-radius: 50%;
	background-color: $yb-c-orange-2;
}

/* ========= 选项 ========= */
.options {
	display: flex;
	flex-direction: column;
}

.option {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	min-height: 112rpx;
	border-radius: $yb-r-lg;
	border: 2rpx solid #E3EDE7;
	background-color: #FFFFFF;
	box-sizing: border-box;
	padding: 0 30rpx;
	margin-bottom: 22rpx;

	&:last-child { margin-bottom: 0; }
	&--hover { background-color: #F4F9F6; }

	&--correct { background-color: $yb-c-teal-3; border-color: $yb-c-teal-1; }
	&--wrong { background-color: #FDE7E5; border-color: #F0A39E; }
	&--dim { opacity: 0.55; }
}

.option__index {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: $yb-c-bg-grey2;
	color: $yb-c-text-sub;
	font-size: $yb-fs-m;
	font-weight: 700;
	font-family: $yb-font-sans;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
}

.option--correct .option__index { background-color: $yb-c-teal-1; color: #FFFFFF; }
.option--wrong .option__index { background-color: $yb-c-danger; color: #FFFFFF; }

.option__text {
	color: $yb-c-text-1;
	font-size: $yb-fs-mp;
	font-family: $yb-font-sans;
	font-weight: 500;
	line-height: 58rpx;
}

/* ========= 反馈 ========= */
.feedback {
	width: 686rpx;
	margin: 24rpx 0 0 32rpx;
	background-color: #FFFFFF;
	border-radius: $yb-r-xl;
	border: 1rpx solid #E3EDE7;
	box-shadow: $yb-shadow-card;
	padding: 40rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.feedback__title {
	color: $yb-c-text-1;
	font-size: $yb-fs-l;
	font-weight: 500;
	font-family: $yb-font-sans;
	line-height: 63rpx;
	text-align: center;
}

.feedback__tip {
	color: $yb-c-text-sub2;
	font-size: $yb-fs-b;
	font-family: $yb-font-sans;
	line-height: 49rpx;
	text-align: center;
	margin-top: 8rpx;
}

.feedback__next {
	margin-top: 32rpx;
	background-color: $yb-c-orange-2;
	border-radius: $yb-r-lg;
	width: 380rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.feedback__next--hover { opacity: 0.92; }
.feedback__next-text {
	color: #FFFFFF;
	font-size: $yb-fs-mp;
	font-weight: 500;
	font-family: $yb-font-sans;
	line-height: 58rpx;
}

/* ========= 结果页 ========= */
.result {
	width: 686rpx;
	margin: 40rpx 0 0 32rpx;
	background-color: #FFFFFF;
	border-radius: $yb-r-xl;
	border: 1rpx solid #E3EDE7;
	box-shadow: $yb-shadow-card;
	padding: 80rpx 40rpx 60rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.result__emoji {
	color: $yb-c-orange-2;
	font-size: $yb-fs-xl;
	font-weight: 700;
	font-family: $yb-font-sans;
	line-height: 80rpx;
}

.result__title {
	color: $yb-c-text-1;
	font-size: $yb-fs-l;
	font-weight: 500;
	font-family: $yb-font-sans;
	line-height: 63rpx;
	margin-top: 16rpx;
	text-align: center;
}

.result__score {
	color: $yb-c-green-2;
	font-size: $yb-fs-xl;
	font-weight: 700;
	font-family: $yb-font-sans;
	line-height: 80rpx;
	margin-top: 16rpx;
	text-align: center;
}

.result__sub {
	color: $yb-c-text-sub2;
	font-size: $yb-fs-b;
	font-family: $yb-font-sans;
	line-height: 49rpx;
	margin-top: 8rpx;
	text-align: center;
}

.result__actions {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-top: 48rpx;
}

.result__btn {
	height: 96rpx;
	border-radius: $yb-r-lg;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24rpx;

	&:last-child { margin-bottom: 0; }
	&--hover { opacity: 0.92; }

	&--primary { background-color: $yb-c-orange-2; }
	&--ghost { background-color: #FFFFFF; border: 2rpx solid $yb-c-orange-2; }
}

.result__btn-text {
	color: #FFFFFF;
	font-size: $yb-fs-mp;
	font-weight: 500;
	font-family: $yb-font-sans;
	line-height: 58rpx;

	&--ghost { color: $yb-c-orange-3; }
}

/* ========= 空态 ========= */
.empty {
	width: 686rpx;
	margin: 40rpx 0 0 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 400rpx;
}

.empty__text {
	color: $yb-c-text-sub;
	font-size: $yb-fs-b;
	font-family: $yb-font-sans;
}
</style>
