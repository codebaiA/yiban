<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">声音调节</text>
		</view>

		<!-- ============ 声音大小（蓝湖 box_12/13） ============ -->
		<view class="section-head">
			<image class="section-head__icon" src="/static/mine/icon_sound.png" mode="aspectFit"></image>
			<text class="section-head__title">声音大小</text>
		</view>
		<view class="opt-row">
			<view
				v-for="opt in volumeOptions" :key="opt.key"
				class="opt-cell" :class="{ 'is-active': volume === opt.key }"
				hover-class="opt-cell--hover"
				@tap="volume = opt.key"
			>
				<view v-if="volume === opt.key" class="opt-cell__check-row">
					<image class="opt-cell__check" src="/static/mine/check.png" mode="aspectFit"></image>
					<text class="opt-cell__title opt-cell__title--white">{{ opt.label }}</text>
				</view>
				<text v-else class="opt-cell__title">{{ opt.label }}</text>
				<text class="opt-cell__sub" :class="{ 'opt-cell__sub--active': volume === opt.key }">{{ opt.sub }}</text>
			</view>
		</view>

		<!-- ============ 说话速度（蓝湖 box_14/15） ============ -->
		<view class="section-head">
			<image class="section-head__icon section-head__icon--square" src="/static/mine/icon_speed.png" mode="aspectFit"></image>
			<text class="section-head__title">说话速度</text>
			<text class="section-head__hint">慢慢说，更明白</text>
		</view>
		<view class="opt-row">
			<view
				v-for="opt in speedOptions" :key="opt.key"
				class="opt-cell" :class="{ 'is-active': speed === opt.key }"
				hover-class="opt-cell--hover"
				@tap="speed = opt.key"
			>
				<view v-if="speed === opt.key" class="opt-cell__check-row">
					<image class="opt-cell__check" src="/static/mine/check.png" mode="aspectFit"></image>
					<text class="opt-cell__title opt-cell__title--white">{{ opt.label }}</text>
				</view>
				<text v-else class="opt-cell__title">{{ opt.label }}</text>
				<text class="opt-cell__sub" :class="{ 'opt-cell__sub--active': speed === opt.key }">{{ opt.sub }}</text>
			</view>
		</view>

		<!-- ============ 保存设置（蓝湖 section_1） ============ -->
		<view class="save-btn" hover-class="save-btn--hover" @tap="onSave">
			<image class="save-btn__icon" src="/static/mine/icon_save.png" mode="aspectFit"></image>
			<text class="save-btn__text">保存设置</text>
		</view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

const VOLUME_MAP = { soft: 0.5, mid: 0.8, loud: 1.0 }

export default {
	data() {
		return {
			volume: 'loud',
			speed: 'slow',
			volumeOptions: [
				{ key: 'soft', label: '小声', sub: '安静环境' },
				{ key: 'mid', label: '适中', sub: '普通说话' },
				{ key: 'loud', label: '大声', sub: '推荐长辈' }
			],
			speedOptions: [
				{ key: 'slow', label: '慢一点', sub: '适合长辈' },
				{ key: 'std', label: '标准', sub: '普通语速' },
				{ key: 'fast', label: '快一点', sub: '稍快语速' }
			]
		}
	},
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') }
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		onSave() {
			actions.setVolume(VOLUME_MAP[this.volume] || 0.8)
			uni.showToast({ title: '设置已保存', icon: 'success' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F5F9F6;
	padding-bottom: 60rpx;
	box-sizing: border-box;
}

/* ============ 顶部 ============ */
.topbar {
	position: relative;
	padding: 60rpx 38rpx 0;
}
.topbar__title {
	display: block;
	height: 81rpx; line-height: 81rpx;
	text-align: center;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 46rpx; letter-spacing: -1rpx;
	color: rgba(41, 37, 36, 1);
}
.back-capsule {
	position: absolute; left: 38rpx; top: 60rpx; z-index: 2;
	width: 173rpx; height: 81rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border: 2rpx solid rgba(221, 233, 224, 1);
	border-radius: 999rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	display: flex; flex-direction: row; align-items: center; justify-content: space-between;
	padding: 0 33rpx;
	box-sizing: border-box;
	flex-shrink: 0;

	&__icon { width: 38rpx; height: 38rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(68, 64, 60, 1);
	}
}
.back-capsule--hover { opacity: 0.7; }

/* ============ 分组标题 ============ */
.section-head {
	display: flex; flex-direction: row; align-items: center;
	margin: 54rpx 38rpx 0;

	&__icon { width: 38rpx; height: 37rpx; }
	&__icon--square { width: 42rpx; height: 42rpx; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		margin-left: 15rpx;
		flex: 1;
	}
	&__hint {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
	}
}

/* ============ 三列选项卡 ============ */
.opt-row {
	display: flex; flex-direction: row;
	margin: 19rpx 38rpx 0;
}
.opt-cell {
	flex: 1;
	height: 185rpx;
	background-color: #FFFFFF;
	border-radius: 46rpx;
	box-shadow: 0 4rpx 19rpx rgba(44, 53, 49, 0.04);
	display: flex; flex-direction: column; align-items: center; justify-content: center;
	margin-right: 19rpx;
	transition: background-color 0.2s;

	&:last-child { margin-right: 0; }
	&.is-active {
		background-color: rgba(89, 177, 165, 1);
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	&--hover { opacity: 0.85; }

	&__check-row { display: flex; flex-direction: row; align-items: center; }
	&__check { width: 33rpx; height: 33rpx; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&__title--white {
		color: #FFFFFF;
		margin-left: 6rpx;
	}
	&__sub {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 8rpx;
	}
	&__sub--active { color: rgba(202, 234, 215, 1); }
}

/* ============ 保存按钮 ============ */
.save-btn {
	width: 673rpx; height: 123rpx;
	background-color: rgba(88, 181, 165, 1);
	border-radius: 999rpx;
	box-shadow: 0 15rpx 38rpx -8rpx rgba(44, 53, 49, 0.28);
	display: flex; flex-direction: row; align-items: center; justify-content: center;
	margin: 54rpx auto 0;

	&__icon { width: 40rpx; height: 31rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; letter-spacing: 1rpx;
		color: #FFFFFF;
		margin-left: 15rpx;
	}
}
.save-btn--hover { opacity: 0.85; }
</style>
