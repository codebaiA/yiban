<template>
	<view class="panel">
		<!-- ========== group_4 内容卡片 ========== -->
		<view class="card">
			<!-- section_13 大图区：王建国照片 -->
			<view class="card__photo-area">
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
			<view class="speak-btn" :class="{ 'is-speaking': speaking }" @tap="onSpeak">
				<image class="speak-btn__icon" src="/static/s1开发/阅读.png" mode="aspectFit"></image>
				<text class="speak-btn__text">{{ speaking ? '正在朗读…' : '朗读以上内容' }}</text>
				<view class="speak-btn__badge">
					<text class="speak-btn__time">{{ speakDuration }}</text>
				</view>
			</view>

			<view class="more" @tap="onViewMore">
				<image class="more__icon" src="/static/s1开发/看看从前 · 二级界面素材/更多回忆.png" mode="aspectFit"></image>
				<text class="more__text">查看更多回忆</text>
				<image class="more__arrow" src="/static/s1开发/看看从前 · 二级界面素材/进入更多回忆.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { useStore } from '../../store/index.js'
import tts from '../../services/tts.js'

export default {
	data() {
		return {
			speaking: false,
			speakTip: '',
			speakDuration: '0:45'
		}
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
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
	methods: {
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
.panel {
	width: 750rpx;
	display: flex;
	flex-direction: column;
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

.card__photo-area { width: 100%; }

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

/* ========= box_6 底部区 ========= */
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
