<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">紧急联系人</text>
		</view>

		<!-- ============ 提示卡 ============ -->
		<view class="hint-card">
			<image class="hint-card__icon" src="/static/mine/sos_icon_hint.png" mode="aspectFit"></image>
			<text class="hint-card__text">设置一位紧急联系人，方便需要帮助时快速联系家人。</text>
		</view>

		<!-- ============ 配置对象行 ============ -->
		<view class="config-row">
			<view class="config-row__left">
				<image class="config-row__icon" src="/static/mine/sos_icon_target.png" mode="aspectFit"></image>
				<text class="config-row__label">配置对象：</text>
				<text class="config-row__name">{{ contact.owner }}</text>
			</view>
			<view class="config-row__pill">
				<text class="config-row__pill-text">{{ contact.role }}</text>
			</view>
		</view>

		<!-- ============ 首要紧急联系人主卡 ============ -->
		<view class="main-card">
			<!-- 头部：胶囊 + 已生效 -->
			<view class="main-card__head">
				<view class="main-card__head-pill">
					<view class="main-card__head-dot"></view>
					<text class="main-card__head-text">首要紧急联系人</text>
				</view>
				<view class="main-card__active">
					<image class="main-card__active-icon" src="/static/mine/check.png" mode="aspectFit"></image>
					<text class="main-card__active-text">已生效</text>
				</view>
			</view>

			<!-- 头像行 -->
			<view class="main-card__profile">
				<view class="main-card__avatar-ring">
					<image class="main-card__avatar" :src="contact.avatar" mode="aspectFill"></image>
				</view>
				<view class="main-card__info">
					<view class="main-card__name-row">
						<text class="main-card__name">{{ contact.name }}</text>
						<text class="main-card__relation">{{ contact.relation }}</text>
					</view>
					<view class="main-card__tag">
						<text class="main-card__tag-text">{{ contact.tag }}</text>
					</view>
				</view>
			</view>

			<!-- 电话块 -->
			<view class="phone-block">
				<text class="phone-block__label">直拨呼叫号码</text>
				<text class="phone-block__number">{{ contact.phone }}</text>
			</view>

			<!-- 说明块 -->
			<view class="desc-block">
				<image class="desc-block__icon" src="/static/mine/sos_icon_call.png" mode="aspectFit"></image>
				<view class="desc-block__texts">
					<text class="desc-block__text desc-block__text--dim">已在首页配置完成：当{{ contact.ownerName }}遇到困难或迷茫时，在首页点击「一键呼叫家人」直接呼叫{{ contact.relation }}{{ contact.name }}。</text>
					<!-- <text class="desc-block__text desc-block__text--strong"></text> -->
					<!-- <text class="desc-block__text desc-block__text--dim"></text> -->
				</view>
			</view>
		</view>

		<!-- ============ 状态卡 ============ -->
		<view class="status-card">
			<image class="status-card__icon" src="/static/mine/sos_icon_call.png" mode="aspectFit"></image>
			<view class="status-card__texts">
				<text class="status-card__title">紧急联络通道连通状态</text>
				<text class="status-card__sub">通话权限及音量增强配置正常</text>
			</view>
			<view class="status-card__right">
				<text class="status-card__state">可用</text>
				<image class="status-card__state-icon" src="/static/mine/check.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ============ 修改按钮 ============ -->
		<view class="edit-btn" hover-class="card-hover" @tap="goSosEdit">
			<image class="edit-btn__icon" src="/static/mine/sos_icon_edit.png" mode="aspectFit"></image>
			<text class="edit-btn__text">修改紧急联系人</text>
		</view>

		<!-- ============ 忆伴承诺卡 ============ -->
		<view class="promise-card">
			<image class="promise-card__icon" src="/static/mine/sos_icon_call.png" mode="aspectFit"></image>
			<view class="promise-card__texts">
				<text class="promise-card__head">※ 忆伴承诺：</text>
				<text class="promise-card__body">仅作为长者端紧急快捷联络电话，不进行后台定位追踪、不发送商业推广，严格保障老人与家庭隐私。</text>
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
	data() {
		return {
			contact: {
				owner: '王建国 (74岁)',
				ownerName: '王建国',
				role: '首要受护人',
				avatar: '/static/mine/member_fangfang.png',
				name: '芳芳',
				relation: '女儿',
				tag: '主要家属协助人 · 45岁',
				phone: '139 •••• 2156'
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goSosEdit() {
			uni.navigateTo({ url: '/pages/mine/sos-edit' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F2FCF5;
	padding-bottom: calc(81rpx + env(safe-area-inset-bottom));
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

/* ============ 提示卡 ============ */
.hint-card {
	width: 673rpx; min-height: 146rpx;
	background-color: rgba(202, 234, 215, 0.4);
	border-radius: 23rpx;
	box-shadow: 0 4rpx 15rpx rgba(44, 53, 49, 0.04);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 27rpx 50rpx 27rpx 23rpx;
	box-sizing: border-box;

	&__icon {
		width: 85rpx; height: 85rpx;
		flex-shrink: 0;
	}
	&__text {
		flex: 1; min-width: 0;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(38, 66, 53, 1);
		line-height: 50rpx;
		margin-left: 23rpx;
	}
}

/* ============ 配置对象行 ============ */
.config-row {
	width: 673rpx; height: 69rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 999rpx;
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 38rpx;
	box-sizing: border-box;

	&__left {
		display: flex; flex-direction: row; align-items: center;
		flex: 1; min-width: 0;
	}
	&__icon { width: 27rpx; height: 27rpx; flex-shrink: 0; }
	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: 15rpx;
		flex-shrink: 0;
	}
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		margin-left: 12rpx;
		white-space: nowrap;
		overflow: hidden; text-overflow: ellipsis;
	}
	&__pill {
		width: 167rpx; height: 46rpx;
		background-color: rgba(202, 234, 215, 0.6);
		border-radius: 999rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
		margin-left: 12rpx;
	}
	&__pill-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		white-space: nowrap;
	}
}

/* ============ 主卡 ============ */
.main-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 38rpx -4rpx rgba(44, 53, 49, 0.06);
	margin: 40rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;

	&__head {
		display: flex; flex-direction: row; align-items: center;
	}
	&__head-pill {
		height: 54rpx;
		background-color: rgba(72, 101, 86, 0.1);
		border-radius: 999rpx;
		display: flex; flex-direction: row; align-items: center;
		padding: 0 23rpx 0 23rpx;
		box-sizing: border-box;
	}
	&__head-dot {
		width: 19rpx; height: 19rpx;
		background-color: rgba(72, 101, 86, 1);
		border-radius: 50%;
		flex-shrink: 0;
	}
	&__head-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; letter-spacing: 1rpx;
		color: rgba(72, 101, 86, 1);
		margin-left: 15rpx;
		white-space: nowrap;
	}
	&__active {
		margin-left: auto;
		display: flex; flex-direction: row; align-items: center;
	}
	&__active-icon { width: 29rpx; height: 27rpx; flex-shrink: 0; }
	&__active-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: 8rpx;
		white-space: nowrap;
	}

	&__profile {
		display: flex; flex-direction: row; align-items: flex-start;
		margin-top: 35rpx;
	}
	&__avatar-ring {
		width: 185rpx; height: 185rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 50%;
		box-shadow: 0 4rpx 23rpx rgba(72, 101, 86, 0.15);
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__avatar {
		width: 169rpx; height: 169rpx;
		border-radius: 50%;
	}
	&__info {
		flex: 1; min-width: 0;
		margin-left: 38rpx;
		padding-top: 13rpx;
	}
	&__name-row {
		display: flex; flex-direction: row; align-items: baseline;
	}
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 50rpx; letter-spacing: -1rpx;
		color: rgba(21, 29, 26, 1);
	}
	&__relation {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(72, 101, 86, 1);
		margin-left: 25rpx;
	}
	&__tag {
		height: 54rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 999rpx;
		display: inline-flex; align-items: center;
		padding: 0 19rpx;
		box-sizing: border-box;
		margin-top: 12rpx;
		max-width: 100%;
	}
	&__tag-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		white-space: nowrap;
	}
}

/* ============ 电话块 ============ */
.phone-block {
	width: 596rpx; min-height: 162rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	margin: 38rpx 0 0;
	padding: 23rpx;
	box-sizing: border-box;
	display: flex; flex-direction: column; justify-content: center;

	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
	}
	&__number {
		font-family: "PingFang SC", sans-serif; font-weight: 700;
		font-size: 42rpx; letter-spacing: 1rpx;
		color: rgba(21, 29, 26, 1);
		line-height: 62rpx;
		margin-top: 15rpx;
	}
}

/* ============ 说明块 ============ */
.desc-block {
	width: 596rpx; min-height: 196rpx;
	background-color: rgba(246, 223, 192, 0.4);
	border-radius: 23rpx;
	margin: 23rpx 0 0;
	padding: 23rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: flex-start;

	&__icon {
		width: 60rpx; height: 60rpx;
		margin-top: 8rpx;
		flex-shrink: 0;
	}
	&__texts {
		flex: 1; min-width: 0;
		display: flex; flex-direction: column;
		margin-left: 23rpx;
	}
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; line-height: 50rpx;
		&--dim { color: rgba(114, 98, 73, 1); }
		&--strong { color: rgba(21, 29, 26, 1); }
	}
}

/* ============ 状态卡 ============ */
.status-card {
	width: 673rpx; min-height: 169rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	margin: 38rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 27rpx 37rpx 27rpx 65rpx;
	box-sizing: border-box;

	&__icon {
		width: 40rpx; height: 37rpx;
		flex-shrink: 0;
	}
	&__texts {
		flex: 1; min-width: 0;
		display: flex; flex-direction: column;
		margin-left: 48rpx;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		white-space: nowrap;
	}
	&__sub {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 10rpx;
		white-space: nowrap;
	}
	&__right {
		display: flex; flex-direction: row; align-items: center;
		flex-shrink: 0;
		margin-left: 15rpx;
	}
	&__state {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(72, 101, 86, 1);
		white-space: nowrap;
	}
	&__state-icon {
		width: 27rpx; height: 27rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
}

/* ============ 修改按钮 ============ */
.edit-btn {
	width: 673rpx; height: 108rpx;
	background-color: rgba(90, 181, 165, 1);
	border-radius: 999rpx;
	box-shadow: 0 8rpx 31rpx rgba(72, 101, 86, 0.24);
	margin: 54rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 37rpx; height: 37rpx; flex-shrink: 0; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; letter-spacing: 1rpx;
		color: #FFFFFF;
		margin-left: 15rpx;
	}
}

/* ============ 忆伴承诺卡 ============ */
.promise-card {
	width: 673rpx; min-height: 219rpx;
	background-color: rgba(236, 246, 240, 0.7);
	border-radius: 23rpx;
	margin: 54rpx auto 0;
	padding: 37rpx 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: flex-start;

	&__icon {
		width: 23rpx; height: 35rpx;
		margin-top: 2rpx;
		flex-shrink: 0;
	}
	&__texts {
		flex: 1; min-width: 0;
		display: flex; flex-direction: column;
		margin-left: 19rpx;
	}
	&__head {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(21, 29, 26, 1);
		line-height: 46rpx;
	}
	&__body {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		line-height: 46rpx;
	}
}
</style>
