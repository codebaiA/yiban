<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">家人资料</text>
		</view>

		<!-- ============ 头部资料卡 ============ -->
		<view class="hero-card">
			<view class="hero-card__deco hero-card__deco--tr"></view>
			<view class="hero-card__deco hero-card__deco--bl"></view>
			<view class="hero-card__avatar-wrap">
				<image class="hero-card__avatar" src="/static/mine/member_fangfang.png" mode="aspectFill"></image>
			</view>
			<text class="hero-card__name">芳芳</text>
			<view class="hero-card__meta">
				<text class="hero-card__meta-text">45岁</text>
				<text class="hero-card__meta-divider">|</text>
				<text class="hero-card__meta-text">王建国的女儿</text>
				<text class="hero-card__meta-divider">|</text>
				<text class="hero-card__meta-text">主要家属协助</text>
			</view>
			<view class="hero-card__pill">
				<view class="hero-card__pill-dot"></view>
				<text class="hero-card__pill-text">已绑定协助人 · 陪伴在侧</text>
			</view>
		</view>

		<!-- ============ 基础资料卡 ============ -->
		<view class="info-card">
			<view class="info-card__head">
				<view class="info-card__head-icon info-card__head-icon--dark">
					<image class="info-card__head-img" src="/static/mine/icon_basic_info.png" mode="aspectFit"></image>
				</view>
				<text class="info-card__head-title">基础资料</text>
			</view>
			<view class="info-row">
				<text class="info-row__label">姓名</text>
				<text class="info-row__value">芳芳</text>
			</view>
			<view class="info-row info-row--gap">
				<text class="info-row__label">与王建国的关系</text>
				<text class="info-row__value info-row__value--green">女儿</text>
			</view>
			<view class="info-row info-row--gap info-row--last">
				<text class="info-row__label">年龄</text>
				<text class="info-row__value">45岁</text>
			</view>
		</view>

		<!-- ============ 关怀与陪伴记录卡 ============ -->
		<view class="info-card info-card--care">
			<view class="info-card__head">
				<view class="info-card__head-icon info-card__head-icon--brown">
					<image class="info-card__head-img" src="/static/mine/icon_care.png" mode="aspectFit"></image>
				</view>
				<text class="info-card__head-title">关怀与陪伴记录</text>
			</view>
			<view class="care-quote">
				<text class="care-quote__text">“王建国的大女儿，也是主要负责爸爸日常生活与记忆陪伴的协助人。每周六都会回家陪爸爸包饺子、听广播，是爸爸最信赖和熟悉的小棉袄。”</text>
			</view>
		</view>

		<!-- ============ 底部固定：编辑资料 ============ -->
		<view class="footer-bar">
			<view class="footer-btn" hover-class="card-hover" @tap="goEdit">
				<image class="footer-btn__icon" src="/static/mine/icon_edit_profile.png" mode="aspectFit"></image>
				<text class="footer-btn__text">编辑资料</text>
			</view>
		</view>

	</view>
</template>

<script>
import { useStore } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') }
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goEdit() {
			uni.navigateTo({ url: '/pages/mine/member-edit' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F2FCF5;
	padding-bottom: calc(200rpx + env(safe-area-inset-bottom)); /* 给底部固定按钮留位 */
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
	font-size: 42rpx; letter-spacing: -1rpx;
	color: rgba(21, 29, 26, 1);
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
.card-hover { opacity: 0.85; }

/* ============ 头部资料卡 ============ */
.hero-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
	margin: 23rpx auto 0;
	padding: 38rpx 0;
	box-sizing: border-box;
	display: flex; flex-direction: column; align-items: center;
	position: relative;
	overflow: hidden;

	&__deco {
		position: absolute;
		border-radius: 50%;
	}
	&__deco--tr {
		width: 277rpx; height: 277rpx;
		background-color: rgba(202, 234, 215, 0.4);
		right: -62rpx; top: -92rpx;
	}
	&__deco--bl {
		width: 215rpx; height: 215rpx;
		background-color: rgba(246, 223, 192, 0.5);
		left: -62rpx; bottom: -31rpx;
	}
	&__avatar-wrap {
		width: 277rpx; height: 277rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 23rpx;
		box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
		display: flex; align-items: center; justify-content: center;
		position: relative; z-index: 1;
	}
	&__avatar { width: 262rpx; height: 262rpx; border-radius: 15rpx; }
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 50rpx; letter-spacing: 1rpx;
		color: rgba(21, 29, 26, 1);
		margin-top: 31rpx;
		position: relative; z-index: 1;
	}
	&__meta {
		display: flex; flex-direction: row; align-items: center;
		margin-top: 8rpx;
		position: relative; z-index: 1;
		max-width: 596rpx;
	}
	&__meta-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(66, 72, 68, 1);
		white-space: nowrap;
	}
	&__meta-divider {
		font-family: "Plus Jakarta Sans", sans-serif;
		font-size: 35rpx; color: rgba(194, 200, 194, 1);
		margin: 0 10rpx;
	}
	&__pill {
		height: 65rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 999rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		display: flex; flex-direction: row; align-items: center;
		padding: 0 27rpx;
		margin-top: 33rpx;
		box-sizing: border-box;
		position: relative; z-index: 1;

		&-dot {
			width: 19rpx; height: 19rpx;
			background-color: rgba(72, 101, 86, 1);
			border-radius: 50%;
			flex-shrink: 0;
		}
		&-text {
			font-family: "PingFang SC", sans-serif; font-weight: 500;
			font-size: 31rpx; color: rgba(72, 101, 86, 1);
			margin-left: 15rpx;
			white-space: nowrap;
		}
	}
}

/* ============ 内容卡 ============ */
.info-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 38rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;

	&__head {
		display: flex; flex-direction: row; align-items: center;
	}
	&__head-icon {
		width: 38rpx; height: 38rpx;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__head-icon--dark { background-color: rgba(72, 101, 86, 1); }
	&__head-icon--brown { background-color: rgba(138, 80, 32, 1); }
	&__head-img { width: 38rpx; height: 38rpx; }
	&__head-title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		margin-left: 23rpx;
	}
}

.info-row {
	width: 596rpx; height: 108rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin: 23rpx 0 0;
	display: flex; flex-direction: row; align-items: center; justify-content: space-between;
	padding: 0 27rpx;
	box-sizing: border-box;

	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(66, 72, 68, 1);
	}
	&__value {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&__value--green { color: rgba(72, 101, 86, 1); }
}

/* ============ 关怀引文 ============ */
.care-quote {
	width: 596rpx;
	background-color: rgba(246, 223, 192, 0.3);
	border-radius: 15rpx;
	margin: 23rpx 0 0;
	padding: 27rpx;
	box-sizing: border-box;

	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		line-height: 56rpx;
	}
}

/* ============ 底部固定按钮 ============ */
.footer-bar {
	position: fixed;
	left: 0; right: 0; bottom: 0;
	background-color: rgba(242, 252, 245, 0.9);
	box-shadow: 0 -8rpx 31rpx rgba(0, 0, 0, 0.04);
	padding: 23rpx 38rpx;
	padding-bottom: calc(23rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;
	z-index: 10;
}
.footer-btn {
	width: 673rpx; height: 108rpx;
	background-color: rgba(90, 181, 165, 1);
	border-radius: 999rpx;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 35rpx; height: 31rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: #FFFFFF;
		margin-left: 15rpx;
	}
}
</style>
