<template>
	<view class="page">
		<!-- 安全区占位（自定义导航，避开状态栏） -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- ========== section_2：顶部按钮区 + 题目卡 ========== -->
		<view class="section_2">
			<!-- box_12 顶部三按钮 + 进度 -->
			<view class="box_12">
				<!-- 返回 -->
				<view class="group_1" hover-class="btn-hover" @tap="onBack">
					<image class="icon-back" :src="icon('clockBack')" mode="aspectFit"></image>
				</view>
				<!-- 进度 3/8 -->
				<text class="text_1">{{ progress }}</text>
				<!-- 重新听题（喇叭） -->
				<view class="group_3" hover-class="btn-hover" @tap="onReplay">
					<image class="icon-speaker" :src="icon('clockSpeaker')" mode="aspectFit"></image>
				</view>
				<!-- 帮助 -->
				<view class="group_5" hover-class="btn-hover" @tap="onHelp">
					<image class="icon-help" :src="icon('clockHelp')" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 按钮文字标签行 -->
			<view class="text-wrapper_15">
				<text class="text_2">返回</text>
				<text class="text_3">重新听题</text>
				<text class="text_4">帮助</text>
			</view>

			<!-- 题目卡 -->
			<view class="text-wrapper_2">
				<text class="paragraph_1">{{ question.title }}</text>
			</view>
		</view>

		<!-- ========== block_2：圆表盘 ========== -->
		<view class="block_2">
			<view class="box_4">
				<!-- 11 12 1 -->
				<view class="text-wrapper_16">
					<text class="num text_5">11</text>
					<text class="num text_6">12</text>
					<text class="num text_7">1</text>
				</view>
				<!-- 10 2 -->
				<view class="text-wrapper_17">
					<text class="num text_8">10</text>
					<text class="num text_9">2</text>
				</view>
				<!-- 9 + 横条 + 3 -->
				<view class="section_3">
					<text class="num text_10">9</text>
					<view class="box_6"></view>
					<text class="num text_11">3</text>
				</view>
				<!-- 8 4 -->
				<view class="text-wrapper_18">
					<text class="num text_12">8</text>
					<text class="num text_13">4</text>
				</view>
				<!-- 7 6 5 -->
				<view class="text-wrapper_19">
					<text class="num text_14">7</text>
					<text class="num text_15">6</text>
					<text class="num text_16">5</text>
				</view>
				<!-- 竖条指针 -->
				<view class="box_7"></view>
				<!-- 中心点 -->
				<image class="label_1" :src="icon('clockCenter')" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ========== section_4：三个答案选项 ========== -->
		<view class="section_4">
			<view class="box_13">
				<view class="option option--1" hover-class="opt-hover" @tap="onSelect(0)">
					<text class="option__text">{{ options[0] || '' }}</text>
				</view>
				<view class="option option--2" hover-class="opt-hover" @tap="onSelect(1)">
					<text class="option__text">{{ options[1] || '' }}</text>
				</view>
				<view class="option option--3" hover-class="opt-hover" @tap="onSelect(2)">
					<text class="option__text">{{ options[2] || '' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import { icon } from '../../services/iconMap.js'

export default {
	data() {
		return {
			icon,
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
			const idx = (this.store.training.questions || []).findIndex(x => x.id === q.id)
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
/* ============================================================
   蓝湖「脑力训练 · 简单生活识钟（一页一题极简版）」1:1 还原
   画布 750×1700rpx，颜色/字号/间距按设计稿字面量
   ============================================================ */

.page {
	background-color: #F5F9F6;
	position: relative;
	width: 750rpx;
	min-height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* —— section_2 —— */
.section_2 {
	width: 750rpx;
	height: 587rpx;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
}

.box_12 {
	width: 688rpx;
	height: 108rpx;
	flex-direction: row;
	display: flex;
	margin: 38rpx 0 0 31rpx;
}

.group_1,
.group_3,
.group_5 {
	box-shadow: 0px 2px 4px 0px rgba(180, 160, 140, 0.12);
	background-color: #F5F9F6;
	border-radius: 38rpx;
	height: 108rpx;
	width: 108rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	flex-shrink: 0;
}

.group_3 { margin-left: 50rpx; }
.group_5 { margin-left: 29rpx; }

.btn-hover { opacity: 0.85; }

.icon-back {
	width: 54rpx;
	height: 54rpx;
}
.icon-speaker {
	width: 46rpx;
	height: 33rpx;
}
.icon-help {
	width: 54rpx;
	height: 54rpx;
}

.text_1 {
	width: 98rpx;
	height: 62rpx;
	color: rgba(207, 185, 160, 1);
	font-size: 46rpx;
	letter-spacing: 5rpx;
	font-family: 'Liberation Mono', 'PingFang SC', monospace;
	font-weight: 700;
	text-align: left;
	white-space: nowrap;
	line-height: 62rpx;
	margin: 23rpx 0 0 188rpx;
	flex-shrink: 0;
}

/* —— 按钮文字标签行 —— */
.text-wrapper_15 {
	width: 637rpx;
	height: 38rpx;
	flex-direction: row;
	display: flex;
	margin: 12rpx 0 0 58rpx;
}

.text_2,
.text_3,
.text_4 {
	height: 38rpx;
	color: rgba(74, 54, 48, 1);
	font-size: 27rpx;
	letter-spacing: 1rpx;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 500;
	text-align: left;
	white-space: nowrap;
	line-height: 38rpx;
}
.text_2 { width: 56rpx; }
.text_3 { width: 113rpx; margin-left: 358rpx; }
.text_4 { width: 56rpx; margin-left: 54rpx; }

/* —— 题目卡 —— */
.text-wrapper_2 {
	box-shadow: 0px 2px 8px 0px rgba(180, 160, 140, 0.06);
	background-color: #F5F9F6;
	border-radius: 73rpx;
	height: 202rpx;
	border: 2rpx solid rgba(254, 170, 4, 1);
	display: flex;
	flex-direction: column;
	width: 688rpx;
	margin: 15rpx 0 173rpx 31rpx;
	box-sizing: border-box;
}

.paragraph_1 {
	width: 473rpx;
	height: 133rpx;
	color: rgba(58, 40, 35, 1);
	font-size: 48rpx;
	letter-spacing: 1rpx;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 500;
	text-align: center;
	line-height: 66rpx;
	white-space: pre-line;
	margin: 35rpx 0 0 108rpx;
}

/* —— block_2 表盘区 —— */
.block_2 {
	box-shadow: inset 0px 0px 12px 2px rgba(200, 180, 160, 0.06);
	border-radius: 69rpx;
	height: 731rpx;
	display: flex;
	flex-direction: column;
	width: 688rpx;
	position: relative;
	margin: -2rpx 0 0 31rpx;
	flex-shrink: 0;
}

.box_4 {
	box-shadow: 0px 8px 18px 0px rgba(70, 55, 45, 0.18);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 19229rpx;
	height: 519rpx;
	border: 10rpx solid rgba(14, 164, 169, 1);
	width: 519rpx;
	position: relative;
	display: flex;
	flex-direction: column;
	margin: 106rpx 0 0 85rpx;
	box-sizing: border-box;
}

/* 表盘数字 */
.num {
	color: rgba(56, 43, 38, 1);
	font-size: 46rpx;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 500;
	text-align: left;
	white-space: nowrap;
	line-height: 62rpx;
}

.text-wrapper_16 {
	width: 250rpx;
	height: 100rpx;
	flex-direction: row;
	display: flex;
	margin: 35rpx 0 0 131rpx;
}
.text_5 { width: 56rpx; height: 62rpx; margin-top: 38rpx; }
.text_6 { width: 56rpx; height: 62rpx; margin-left: 48rpx; }
.text_7 { width: 29rpx; height: 62rpx; margin: 38rpx 0 0 62rpx; }

.text-wrapper_17 {
	width: 388rpx;
	height: 62rpx;
	flex-direction: row;
	display: flex;
	justify-content: space-between;
	margin: 8rpx 0 0 62rpx;
}
.text_8 { width: 56rpx; height: 62rpx; }
.text_9 { width: 29rpx; height: 62rpx; }

.section_3 {
	width: 435rpx;
	height: 62rpx;
	flex-direction: row;
	display: flex;
	margin: 25rpx 0 0 42rpx;
}
.text_10 { width: 29rpx; height: 62rpx; }
.box_6 {
	box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
	background-color: rgba(58, 40, 35, 1);
	width: 127rpx;
	height: 17rpx;
	margin: 21rpx 0 0 188rpx;
}
.text_11 { width: 29rpx; height: 62rpx; margin-left: 62rpx; }

.text-wrapper_18 {
	width: 381rpx;
	height: 62rpx;
	flex-direction: row;
	display: flex;
	justify-content: space-between;
	margin: 25rpx 0 0 69rpx;
}
.text_12 { width: 29rpx; height: 62rpx; }
.text_13 { width: 29rpx; height: 62rpx; }

.text-wrapper_19 {
	width: 242rpx;
	height: 100rpx;
	flex-direction: row;
	display: flex;
	margin: 8rpx 0 35rpx 138rpx;
}
.text_14 { width: 29rpx; height: 62rpx; }
.text_15 { width: 29rpx; height: 62rpx; margin: 38rpx 0 0 81rpx; }
.text_16 { width: 29rpx; height: 62rpx; margin-left: 75rpx; }

/* 竖条指针 */
.box_7 {
	box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
	background-color: rgba(58, 40, 35, 1);
	position: absolute;
	left: 269rpx;
	top: 206rpx;
	width: 19rpx;
	height: 100rpx;
}

/* 中心点 */
.label_1 {
	position: absolute;
	left: 237rpx;
	top: 237rpx;
	width: 46rpx;
	height: 46rpx;
}

/* —— section_4 答案选项 —— */
.section_4 {
	width: 750rpx;
	height: 387rpx;
	margin-bottom: 2rpx;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
}

.box_13 {
	width: 708rpx;
	height: 154rpx;
	flex-direction: row;
	display: flex;
	justify-content: space-between;
	margin: 169rpx 0 0 31rpx;
}

.option {
	box-shadow: 0px 3px 6px 0px rgba(180, 160, 140, 0.15);
	background-color: rgba(255, 253, 249, 1);
	border-radius: 31rpx;
	height: 154rpx;
	border: 2rpx solid rgba(255, 170, 0, 1);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.option--1 { width: 223rpx; }
.option--2 { width: 221rpx; }
.option--3 { width: 217rpx; }

.opt-hover { opacity: 0.9; }

.option__text {
	height: 54rpx;
	color: rgba(58, 40, 35, 1);
	font-size: 38rpx;
	letter-spacing: -1rpx;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 500;
	text-align: center;
	white-space: nowrap;
	line-height: 54rpx;
}
</style>
