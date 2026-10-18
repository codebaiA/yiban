<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">吃药管理</text>
		</view>

		<!-- ============ 顶部信息卡 ============ -->
		<view class="info-card">
			<view class="info-card__head">
				<view class="info-card__icon">
					<image class="info-card__icon-img" src="/static/mine/med_icon_daily.png" mode="aspectFit"></image>
				</view>
				<text class="info-card__title">日常服药辅助</text>
				<view class="info-card__chip">
					<text class="info-card__chip-text">生活备忘</text>
				</view>
			</view>
			<text class="info-card__desc">依照医生处方记录长辈用药计划与每日服药情况</text>
		</view>

		<!-- ============ 添加服药计划按钮 ============ -->
		<view class="add-btn" hover-class="card-hover" @tap="goAdd">
			<image class="add-btn__icon" src="/static/mine/med_icon_add_plan.png" mode="aspectFit"></image>
			<text class="add-btn__text">添加服药计划</text>
		</view>

		<!-- ============ 查看历史 ============ -->
		<view class="history-row" hover-class="card-hover" @tap="goRecord">
			<image class="history-row__icon" src="/static/mine/med_icon_date.png" mode="aspectFit"></image>
			<text class="history-row__text">查看历史服药记录</text>
			<image class="history-row__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
		</view>

		<!-- ============ 今日服药安排 ============ -->
		<view class="section-row">
			<view class="section-row__bar"></view>
			<text class="section-row__title">今日服药安排</text>
			<text class="section-row__hint">按时段提醒</text>
		</view>

		<!-- 早间药 -->
		<view class="period-card">
			<view class="period-card__head">
				<view class="period-card__icon period-card__icon--sage">
					<image class="period-card__icon-img" src="/static/mine/med_icon_morning.png" mode="aspectFit"></image>
				</view>
				<view class="period-card__texts">
					<view class="period-card__name-row">
						<text class="period-card__name period-card__name--green">早间药</text>
						<text class="period-card__time">08:00</text>
					</view>
					<text class="period-card__sub">早饭后服用</text>
				</view>
				<view class="period-card__status period-card__status--done">
					<image class="period-card__status-icon" src="/static/mine/med_icon_recorded.png" mode="aspectFit"></image>
					<text class="period-card__status-text period-card__status-text--done">已记录</text>
				</view>
			</view>
			<view class="drug-box">
				<view class="drug-box__texts">
					<text class="drug-box__name">盐酸多奈哌齐片</text>
					<view class="drug-box__dose-row">
						<image class="drug-box__dose-icon" src="/static/mine/med_icon_dose.png" mode="aspectFit"></image>
						<text class="drug-box__dose">规格剂量：5mg / 1片</text>
					</view>
				</view>
				<image class="drug-box__pill" src="/static/mine/icon_med.png" mode="aspectFit"></image>
			</view>
			<view class="record-row">
				<image class="record-row__icon" src="/static/mine/med_icon_note.png" mode="aspectFit"></image>
				<text class="record-row__text record-row__text--green">芳芳于 08:15 记录已服</text>
			</view>
		</view>

		<!-- 午间药 -->
		<view class="period-card">
			<view class="period-card__head">
				<view class="period-card__icon period-card__icon--cream">
					<image class="period-card__icon-img" src="/static/mine/med_icon_noon.png" mode="aspectFit"></image>
				</view>
				<view class="period-card__texts">
					<view class="period-card__name-row">
						<text class="period-card__name period-card__name--brown">午间药</text>
						<text class="period-card__time">12:30</text>
					</view>
					<text class="period-card__sub">随餐服用</text>
				</view>
				<view class="period-card__status period-card__status--wait">
					<image class="period-card__status-icon" src="/static/mine/med_icon_pending.png" mode="aspectFit"></image>
					<text class="period-card__status-text period-card__status-text--wait">待服药</text>
				</view>
			</view>
			<view class="drug-box">
				<view class="drug-box__texts">
					<text class="drug-box__name">硝苯地平控释片</text>
					<view class="drug-box__dose-row">
						<image class="drug-box__dose-icon" src="/static/mine/med_icon_dose.png" mode="aspectFit"></image>
						<text class="drug-box__dose">规格剂量：30mg / 1片</text>
					</view>
				</view>
				<image class="drug-box__pill" src="/static/mine/icon_med.png" mode="aspectFit"></image>
			</view>
			<view class="mark-btn" hover-class="card-hover" @tap="markTaken('午间药')">
				<text class="mark-btn__text">点击记录服药</text>
			</view>
		</view>

		<!-- 晚间药 -->
		<view class="period-card">
			<view class="period-card__head">
				<view class="period-card__icon period-card__icon--sage">
					<view class="period-card__moon"></view>
				</view>
				<view class="period-card__texts">
					<view class="period-card__name-row">
						<text class="period-card__name period-card__name--dark">晚间药</text>
						<text class="period-card__time">19:30</text>
					</view>
					<text class="period-card__sub">晚饭后半小时</text>
				</view>
				<view class="period-card__status period-card__status--done">
					<image class="period-card__status-icon" src="/static/mine/med_icon_recorded.png" mode="aspectFit"></image>
					<text class="period-card__status-text period-card__status-text--done">已记录</text>
				</view>
			</view>
			<view class="drug-box">
				<view class="drug-box__texts">
					<text class="drug-box__name">银杏叶提取物滴剂</text>
					<view class="drug-box__dose-row">
						<image class="drug-box__dose-icon" src="/static/mine/med_icon_dose2.png" mode="aspectFit"></image>
						<text class="drug-box__dose">规格剂量：20滴 / 次</text>
					</view>
				</view>
				<image class="drug-box__pill" src="/static/mine/icon_med.png" mode="aspectFit"></image>
			</view>
			<view class="record-row">
				<image class="record-row__icon record-row__icon--bell" src="/static/mine/med_icon_note.png" mode="aspectFit"></image>
				<text class="record-row__text">晚饭后半小时提醒服药</text>
				<image class="record-row__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ============ 底部提示 ============ -->
		<text class="foot-tip">※ 用药剂量与频次请严格遵照执业医师处方，家属记录仅供日常备忘参考</text>

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
		goAdd() {
			uni.navigateTo({ url: '/pages/mine/med-plan-add' })
		},
		goRecord() {
			uni.navigateTo({ url: '/pages/mine/med-record' })
		},
		markTaken(name) {
			uni.showToast({ title: name + '已记录服药', icon: 'success' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F2FCF5;
	padding-bottom: calc(77rpx + env(safe-area-inset-bottom));
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

/* ============ 顶部信息卡 ============ */
.info-card {
	width: 673rpx;
	background-color: rgba(230, 240, 234, 1);
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	padding: 35rpx 38rpx;
	box-sizing: border-box;

	&__head {
		display: flex; flex-direction: row; align-items: center;
	}
	&__icon {
		width: 69rpx; height: 69rpx;
		background-color: rgba(202, 234, 215, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 37rpx; height: 46rpx; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		margin-left: 23rpx;
		flex-shrink: 0;
	}
	&__chip {
		background-color: rgba(174, 206, 188, 0.4);
		border-radius: 999rpx;
		height: 42rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 23rpx;
		margin-left: auto;
		flex-shrink: 0;
	}
	&__chip-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(3, 32, 21, 1);
	}
	&__desc {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		line-height: 50rpx;
		margin-top: 12rpx;
	}
}

/* ============ 添加按钮 ============ */
.add-btn {
	width: 673rpx; height: 123rpx;
	background-color: rgba(91, 181, 165, 1);
	border-radius: 23rpx;
	box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
	margin: 31rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 46rpx; height: 46rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: #FFFFFF;
		margin-left: 15rpx;
	}
}

/* ============ 查看历史 ============ */
.history-row {
	display: flex; flex-direction: row; align-items: center; justify-content: flex-end;
	margin-top: 58rpx;
	padding: 0 38rpx;

	&__icon { width: 35rpx; height: 38rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		margin-left: 8rpx;
	}
	&__arrow { width: 12rpx; height: 18rpx; margin-left: 10rpx; }
}

/* ============ 分组行 ============ */
.section-row {
	display: flex; flex-direction: row; align-items: center;
	margin: 54rpx 38rpx 0;

	&__bar {
		width: 19rpx; height: 46rpx;
		background-color: rgba(72, 101, 86, 1);
		border-radius: 8rpx;
		flex-shrink: 0;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; letter-spacing: -1rpx;
		color: rgba(21, 29, 26, 1);
		margin-left: 15rpx;
	}
	&__hint {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
}

/* ============ 时段卡 ============ */
.period-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	margin: 23rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;

	&__head {
		display: flex; flex-direction: row; align-items: center;
	}
	&__icon {
		width: 73rpx; height: 73rpx;
		border-radius: 15rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}
	&__icon--sage { background-color: rgba(225, 234, 228, 1); }
	&__icon--cream { background-color: rgba(246, 223, 192, 1); }
	&__icon-img { width: 42rpx; height: 42rpx; }
	/* 晚间月牙（素材缺失，CSS 绘制） */
	&__moon {
		width: 42rpx; height: 42rpx;
		border-radius: 50%;
		background-color: rgba(72, 101, 86, 1);
		position: relative;
	}
	&__moon::after {
		content: '';
		position: absolute;
		width: 42rpx; height: 42rpx;
		border-radius: 50%;
		background-color: rgba(225, 234, 228, 1);
		left: -13rpx; top: -9rpx;
	}
	&__texts {
		flex: 1; min-width: 0;
		margin-left: 23rpx;
	}
	&__name-row {
		display: flex; flex-direction: row; align-items: baseline;
	}
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx;
		flex-shrink: 0;
	}
	&__name--green { color: rgba(72, 101, 86, 1); }
	&__name--brown { color: rgba(108, 92, 68, 1); }
	&__name--dark { color: rgba(66, 72, 68, 1); }
	&__time {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		margin-left: 12rpx;
	}
	&__sub {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 2rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__status {
		border-radius: 999rpx;
		height: 54rpx;
		display: flex; flex-direction: row; align-items: center; justify-content: center;
		padding: 0 19rpx;
		flex-shrink: 0;
		box-sizing: border-box;
	}
	&__status--done { background-color: rgba(202, 234, 215, 1); }
	&__status--wait { background-color: rgba(246, 223, 192, 1); }
	&__status-icon { width: 27rpx; height: 27rpx; }
	&__status-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx;
		margin-left: 6rpx;
		white-space: nowrap;
	}
	&__status-text--done { color: rgba(48, 77, 63, 1); }
	&__status-text--wait { color: rgba(83, 69, 46, 1); }
}

/* ============ 药品块 ============ */
.drug-box {
	width: 596rpx; height: 169rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin: 23rpx 0 0;
	padding: 23rpx 31rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: center;

	&__texts {
		flex: 1; min-width: 0;
	}
	&__name {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__dose-row {
		display: flex; flex-direction: row; align-items: center;
		margin-top: 8rpx;
	}
	&__dose-icon { width: 23rpx; height: 29rpx; }
	&__dose {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		margin-left: 8rpx;
	}
	&__pill {
		width: 84rpx; height: 84rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
		opacity: 0.85;
	}
}

/* ============ 记录行 / 补录按钮 ============ */
.record-row {
	display: flex; flex-direction: row; align-items: center;
	margin: 31rpx 0 0;

	&__icon { width: 33rpx; height: 19rpx; }
	&__icon--bell { width: 23rpx; height: 29rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: 10rpx;
		flex: 1; min-width: 0;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__text--green { color: rgba(72, 101, 86, 1); }
	&__arrow { width: 12rpx; height: 18rpx; flex-shrink: 0; }
}

.mark-btn {
	width: 596rpx; height: 108rpx;
	background-color: rgba(246, 223, 192, 1);
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx 0 0;
	display: flex; align-items: center; justify-content: center;

	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(114, 98, 73, 1);
	}
}

/* ============ 底部提示 ============ */
.foot-tip {
	display: block;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 31rpx; color: rgba(66, 72, 68, 1);
	line-height: 50rpx;
	text-align: center;
	margin: 62rpx 77rpx 0;
}
</style>
