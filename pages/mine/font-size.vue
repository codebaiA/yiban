<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 + 提示条（蓝湖 block_1/block_4） ============ -->
		<view class="topbar">
			<view class="topbar__row">
				<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
					<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
					<text class="back-capsule__text">返回</text>
				</view>
				<text class="topbar__title">字体大小</text>
			</view>
			<view class="hint-bar">
				<text class="hint-bar__leaf">🌱</text>
				<text class="hint-bar__text">选择适合您的文字大小，看着清晰最重要</text>
			</view>
		</view>

		<!-- ============ 预览示例条（蓝湖 section_1） ============ -->
		<view class="preview-strip">
			<view class="preview-strip__tag-row">
				<image class="preview-strip__tag" src="/static/mine/tag_preview.png" mode="aspectFit"></image>
				<text class="preview-strip__tag-text">日常显示较多内容</text>
			</view>
			<text class="preview-strip__text">小忆陪你聊聊天，听你讲讲过去的事。</text>
		</view>

		<!-- ============ 标准（蓝湖 section_2） ============ -->
		<view class="opt-card" :class="{ 'is-active': fontLevel === 'md' }" hover-class="opt-card--hover" @tap="choose('md')">
			<view class="opt-card__head">
				<view class="opt-card__pill"><text class="opt-card__pill-text">标准</text></view>
				<text class="opt-card__sub">普通阅读字号</text>
				<view v-if="fontLevel === 'md'" class="opt-card__check"><image class="opt-card__check-img" src="/static/mine/check.png" mode="aspectFit"></image></view>
			</view>
			<text class="opt-card__preview opt-card__preview--md">小忆陪你聊聊天，听你讲讲过去的事。</text>
		</view>

		<!-- ============ 大（蓝湖 section_4，选中态） ============ -->
		<view class="opt-card opt-card--lg" :class="{ 'is-active': fontLevel === 'lg' }" hover-class="opt-card--hover" @tap="choose('lg')">
			<view class="opt-card__head">
				<view class="opt-card__pill opt-card__pill--green"><text class="opt-card__pill-text opt-card__pill-text--white">大</text></view>
				<view class="opt-card__badge"><text class="opt-card__badge-text">适老推荐 · 当前使用</text></view>
				<view v-if="fontLevel === 'lg'" class="opt-card__check"><image class="opt-card__check-img" src="/static/mine/check.png" mode="aspectFit"></image></view>
			</view>
			<text class="opt-card__preview opt-card__preview--lg">小忆陪你聊聊天，听你讲讲过去的事。</text>
		</view>

		<!-- ============ 特大（蓝湖 section_7） ============ -->
		<view class="opt-card" :class="{ 'is-active': fontLevel === 'xl' }" hover-class="opt-card--hover" @tap="choose('xl')">
			<view class="opt-card__head">
				<view class="opt-card__pill opt-card__pill--wide"><text class="opt-card__pill-text">特大</text></view>
				<text class="opt-card__sub">字字清楚明了</text>
				<view v-if="fontLevel === 'xl'" class="opt-card__check"><image class="opt-card__check-img" src="/static/mine/check.png" mode="aspectFit"></image></view>
			</view>
			<text class="opt-card__preview opt-card__preview--xl">小忆陪你聊聊天。</text>
		</view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		fontLevel() { return this.store.ui.fontLevel || 'lg' },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') }
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		choose(level) {
			if (level === this.fontLevel) return
			actions.setFontLevel(level)
			uni.showToast({ title: '已切换字体大小', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F5F9F6;
	padding-bottom: 40rpx;
	box-sizing: border-box;
}

/* ============ 顶部 ============ */
.topbar { padding: 60rpx 38rpx 0; }
.topbar__row {
	display: flex; flex-direction: row; align-items: center;
}
.topbar__title {
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 46rpx; letter-spacing: -1rpx;
	color: rgba(41, 37, 36, 1);
	margin-left: 27rpx;
}
.back-capsule {
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

.hint-bar {
	width: 673rpx; height: 104rpx;
	background-color: rgba(233, 244, 237, 1);
	border: 2rpx solid rgba(214, 234, 222, 1);
	border-radius: 31rpx;
	margin-top: 37rpx;
	display: flex; flex-direction: row; align-items: center;
	padding-left: 29rpx;
	box-sizing: border-box;

	&__leaf { font-size: 39rpx; line-height: 54rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(61, 92, 75, 1);
		margin-left: 8rpx;
		flex: 1;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
}

/* ============ 预览示例条（当前字号的实际展示） ============ */
.preview-strip {
	width: 673rpx;
	margin: 23rpx auto 0;
	background-color: #FFFFFF;
	border: 2rpx solid rgba(229, 238, 231, 1);
	border-radius: 46rpx;
	padding: 42rpx;
	box-sizing: border-box;

	&__tag-row { display: flex; flex-direction: row; align-items: center; }
	&__tag { width: 73rpx; height: 42rpx; }
	&__tag-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(168, 162, 158, 1);
		margin-left: 12rpx;
	}
	&__text {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(68, 64, 60, 1);
		line-height: 46rpx;
		margin-top: 23rpx;
	}
}

/* ============ 选项卡 ============ */
.opt-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border: 3rpx solid rgba(229, 238, 231, 1);
	border-radius: 46rpx;
	margin: 31rpx auto 0;
	padding: 42rpx;
	box-sizing: border-box;
	transition: background-color 0.2s, border-color 0.2s;

	&--lg { margin-top: 29rpx; }
	&--hover { opacity: 0.85; }

	&.is-active {
		background-color: rgba(235, 246, 238, 1);
		border-color: rgba(61, 92, 75, 1);
		box-shadow: 0 0 0 8rpx rgba(61, 92, 75, 0.1);
	}

	&__head { display: flex; flex-direction: row; align-items: center; }

	&__pill {
		min-width: 108rpx; height: 62rpx;
		background-color: rgba(245, 245, 244, 1);
		border-radius: 999rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 27rpx;
		box-sizing: border-box;
		flex-shrink: 0;
	}
	&__pill--green { background-color: rgba(88, 181, 165, 1); }
	&__pill--wide { min-width: 123rpx; height: 69rpx; }
	&__pill-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(68, 64, 60, 1);
	}
	&__pill--wide .opt-card__pill-text { font-size: 35rpx; }
	&__pill-text--white { color: #FFFFFF; letter-spacing: 1rpx; }

	&__sub {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(168, 162, 158, 1);
		margin-left: 15rpx;
	}

	&__badge {
		background-color: rgba(252, 236, 224, 1);
		border: 2rpx solid rgba(245, 215, 190, 1);
		border-radius: 12rpx;
		height: 42rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 21rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
	&__badge-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(201, 105, 36, 1);
	}

	&__check {
		width: 62rpx; height: 62rpx;
		background-color: rgba(88, 181, 165, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		margin-left: auto;
		flex-shrink: 0;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	&__check-img { width: 38rpx; height: 38rpx; }

	/* 三档预览字号（跟随设计：标准 37 / 大 46 / 特大 54rpx） */
	&__preview {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		color: rgba(28, 25, 23, 1);
		margin-top: 21rpx;
	}
	&__preview--md { font-size: 37rpx; line-height: 50rpx; }
	&__preview--lg { font-size: 46rpx; line-height: 64rpx; margin-top: 27rpx; }
	&__preview--xl { font-size: 54rpx; line-height: 67rpx; letter-spacing: 1rpx; }
}
</style>
