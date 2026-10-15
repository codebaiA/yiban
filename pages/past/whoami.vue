<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<!-- 顶部：大头像 + 姓名/年龄/身份（PRD 8.2：与回忆录「我的个人简介」共享同一份数据） -->
		<view class="hero">
			<image class="hero__avatar" :src="patient.avatar || icon('patient')" mode="aspectFill"></image>
			<view class="hero__info">
				<text class="hero__name">{{ patient.name || '还没有填写姓名' }}</text>
				<view class="hero__meta">
					<text v-if="patient.age" class="hero__age">{{ patient.age }} 岁</text>
					<text v-if="patient.identity" class="hero__identity">{{ patient.identity }}</text>
				</view>
			</view>
		</view>

		<!-- 个人简介 -->
		<yb-card>
			<text class="card__title yb-serif">关于我</text>
			<text class="card__intro">{{ patient.intro || '家属还没有填写个人简介。' }}</text>
		</yb-card>

		<!-- 补充信息：性别/生日（字段为空则不展示，不虚构） -->
		<yb-card v-if="patient.gender || patient.birthDate">
			<view class="row">
				<text v-if="patient.gender" class="row__label">性别</text>
				<text v-if="patient.gender" class="row__value">{{ patient.gender }}</text>
			</view>
			<view v-if="patient.birthDate" class="row">
				<text class="row__label">生日</text>
				<text class="row__value">{{ patient.birthDate }}</text>
			</view>
		</yb-card>

		<!-- 语言辅助：朗读以上内容（演示模式，见 services/tts.js） -->
		<view class="speak">
			<yb-big-button
				variant="soft"
				icon-name="read"
				:loading="speaking"
				:text="speaking ? '正在朗读…' : '朗读以上内容'"
				@click="onSpeak"
			></yb-big-button>
			<text v-if="speakTip" class="speak__tip">{{ speakTip }}</text>
		</view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import { icon } from '../../services/iconMap.js'
import tts from '../../services/tts.js'

export default {
	data() {
		return { icon, speaking: false, speakTip: '' }
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		serifReady() { return this.store.ui.serifReady },
		/** 朗读文本：姓名 + 身份 + 简介（PRD 16：应用内语音辅助） */
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
	onShow() {
		actions.refreshPatient()
	},
	methods: {
		onSpeak() {
			if (this.speaking) {
				tts.stop()
				return
			}
			const text = this.speakText
			if (!text) {
				this.speakTip = '暂无可朗读的内容'
				return
			}
			this.speakTip = ''
			// 演示模式：完整走 开始→进度→结束 流程，不发声（isAvailable() 恒 false）
			tts.speak(text, {
				onStart: () => { this.speaking = true },
				onProgress: (p) => {
					if (p >= 1) this.speakTip = ''
				},
				onDone: () => { this.speaking = false; this.speakTip = '朗读完成' },
				onFallback: (msg) => { this.speakTip = msg }
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $yb-c-bg-page;
	padding: $yb-sp-lg;
}

.hero {
	display: flex;
	flex-direction: row;
	align-items: center;
	background: $yb-c-bg-white;
	border-radius: $yb-r-lg;
	padding: $yb-sp-lg;
	box-shadow: $yb-shadow-card;

	&__avatar {
		width: 168rpx;
		height: 168rpx;
		border-radius: 50%;
		background: $yb-c-bg-grey;
		flex-shrink: 0;
	}

	&__info {
		margin-left: $yb-sp-md;
		flex: 1;
	}

	&__name {
		display: block;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xl);
		font-weight: 500;
		color: $yb-c-text-1;
	}

	&__meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: $yb-sp-xs;
	}

	&__age {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-mp);
		font-weight: 500;
		color: $yb-c-orange-3;
	}

	&__identity {
		margin-left: $yb-sp-sm;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
		color: $yb-c-text-sub;
	}
}

.yb-card {
	margin-top: $yb-sp-md;
}

.card__title {
	display: block;
	font-family: $yb-font-serif;
	font-size: $yb-fs-serif-l;
	font-weight: 500;
	color: $yb-c-brown-1;
	margin-bottom: $yb-sp-sm;
}

.card__intro {
	display: block;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-b);
	color: $yb-c-text-2;
	line-height: 1.8;
}

.row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	min-height: $yb-tap-min;
	border-bottom: 2rpx solid $yb-c-line;

	&:last-child { border-bottom: none; }

	&__label {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
		color: $yb-c-text-sub;
	}

	&__value {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-mp);
		font-weight: 500;
		color: $yb-c-text-2;
	}
}

.speak {
	margin-top: $yb-sp-lg;

	&__tip {
		display: block;
		margin-top: $yb-sp-sm;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub3;
		text-align: center;
	}
}
</style>
