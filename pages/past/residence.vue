<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<template v-if="residence && residence.name">
			<!-- 居住地照片 -->
			<view v-if="residence.photo" class="photo">
				<image class="photo__img" :src="residence.photo" mode="widthFix"></image>
			</view>

			<!-- 名称 + 说明（PRD 8.3：未设置显示空状态，不虚构） -->
			<yb-card>
				<view class="place">
					<image class="place__icon" :src="icon('whereILive')" mode="aspectFit"></image>
					<text class="place__name">{{ residence.name }}</text>
				</view>
				<text v-if="residence.desc" class="place__desc">{{ residence.desc }}</text>
				<text v-if="residence.detail" class="place__detail">{{ residence.detail }}</text>
			</yb-card>

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
		</template>

		<!-- 空状态：未设置居住地 -->
		<yb-empty
			v-else
			title="还没有设置居住地"
			desc="家属可以在「我的 → 家属管理」中补充居住地信息"
		></yb-empty>
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
		residence() { return this.store.patient.residence || null },
		serifReady() { return this.store.ui.serifReady },
		speakText() {
			const r = this.residence
			if (!r) return ''
			const parts = [r.name, r.desc, r.detail].filter(Boolean)
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
			tts.speak(text, {
				onStart: () => { this.speaking = true },
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
	padding: $yb-sp-md;
}

.photo {
	border-radius: $yb-r-lg;
	overflow: hidden;
	box-shadow: $yb-shadow-card;

	&__img {
		display: block;
		width: 100%;
		background: $yb-c-bg-grey;
	}
}

.yb-card {
	margin-top: $yb-sp-md;
}

.place {
	display: flex;
	flex-direction: row;
	align-items: center;

	&__icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: $yb-sp-xs;
		flex-shrink: 0;
	}

	&__name {
		font-family: $yb-font-serif;
		font-size: $yb-fs-serif-l;
		font-weight: 500;
		color: $yb-c-blue-1;
	}
}

.place__desc {
	display: block;
	margin-top: $yb-sp-sm;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-b);
	color: $yb-c-text-2;
	line-height: 1.8;
}

.place__detail {
	display: block;
	margin-top: $yb-sp-sm;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-s);
	color: $yb-c-text-sub;
	line-height: 1.8;
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
