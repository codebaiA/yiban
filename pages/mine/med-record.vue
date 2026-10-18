<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">服药记录</text>
		</view>

		<!-- ============ 顶部提示条 ============ -->
		<view class="hint-bar">
			<image class="hint-bar__icon" src="/static/mine/med_icon_hint.png" mode="aspectFit"></image>
			<text class="hint-bar__text">※ 本记录仅为辅助打卡时间，不作医疗效果与实际吸收的推断与验证。</text>
		</view>

		<!-- ============ 日期选择 ============ -->
		<view class="date-head">
			<text class="date-head__title">选择查看日期</text>
			<image class="date-head__icon" src="/static/mine/med_icon_date.png" mode="aspectFit"></image>
			<text class="date-head__hint">左右滑动选择</text>
		</view>
		<scroll-view class="date-scroll" scroll-x enable-flex>
			<view
				v-for="(d, di) in dates"
				:key="di"
				class="date-chip"
				:class="{
					'date-chip--active': d.key === activeDate && !d.special,
					'date-chip--special': d.special
				}"
				hover-class="card-hover"
				@tap="chooseDate(d)"
			>
				<image v-if="d.special" class="date-chip__icon" src="/static/mine/med_icon_date.png" mode="aspectFit"></image>
				<text class="date-chip__name" :class="{ 'date-chip__name--active': d.key === activeDate && !d.special }">{{ d.name }}</text>
				<text v-if="d.date" class="date-chip__date" :class="{ 'date-chip__date--active': d.key === activeDate && !d.special }">{{ d.date }}</text>
			</view>
		</scroll-view>

		<!-- ============ 执行明细标题 ============ -->
		<view class="detail-head">
			<text class="detail-head__title">服药执行明细</text>
			<text class="detail-head__count">共 {{ recordCount }} 条记录</text>
		</view>

		<!-- ============ 今天 · 早间药 ============ -->
		<view class="rec-card">
			<view class="rec-card__head">
				<image class="rec-card__head-icon" src="/static/mine/med_icon_morning.png" mode="aspectFit"></image>
				<text class="rec-card__head-title">今天 · 早间药</text>
				<view class="rec-card__status rec-card__status--done">
					<image class="rec-card__status-icon" src="/static/mine/med_icon_recorded.png" mode="aspectFit"></image>
					<text class="rec-card__status-text rec-card__status-text--done">已记录服用</text>
				</view>
			</view>
			<view class="drug-box">
				<text class="drug-box__name">盐酸多奈哌齐片</text>
				<view class="drug-box__dose-row">
					<image class="drug-box__dose-icon" src="/static/mine/med_icon_dose.png" mode="aspectFit"></image>
					<text class="drug-box__dose">规格剂量：5mg / 1片</text>
				</view>
			</view>
			<view class="time-block">
				<view class="time-block__col">
					<text class="time-block__label">计划服药</text>
					<text class="time-block__value">08:00</text>
				</view>
				<view class="time-block__col">
					<text class="time-block__label">打卡记录</text>
					<text class="time-block__value time-block__value--green">08:15</text>
				</view>
			</view>
			<view class="rec-foot">
				<image class="rec-foot__icon" src="/static/mine/med_icon_assist.png" mode="aspectFit"></image>
				<text class="rec-foot__text">协助人芳芳记录 · 早饭后半小时已温水送服</text>
			</view>
		</view>

		<!-- ============ 今天 · 午间药 ============ -->
		<view class="rec-card">
			<view class="rec-card__head">
				<image class="rec-card__head-icon" src="/static/mine/med_icon_noon.png" mode="aspectFit"></image>
				<text class="rec-card__head-title">今天 · 午间药</text>
				<view class="rec-card__status rec-card__status--wait">
					<image class="rec-card__status-icon" src="/static/mine/med_icon_pending.png" mode="aspectFit"></image>
					<text class="rec-card__status-text rec-card__status-text--wait">待记录</text>
				</view>
			</view>
			<view class="drug-box">
				<text class="drug-box__name">硝苯地平控释片</text>
				<view class="drug-box__dose-row">
					<image class="drug-box__dose-icon" src="/static/mine/med_icon_dose.png" mode="aspectFit"></image>
					<text class="drug-box__dose">规格剂量：30mg / 1片</text>
				</view>
			</view>
			<view class="time-block">
				<view class="time-block__col">
					<text class="time-block__label">计划服药</text>
					<text class="time-block__value">12:30</text>
				</view>
				<view class="time-block__col">
					<text class="time-block__label">执行状态</text>
					<text class="time-block__value time-block__value--brown">等待打卡</text>
				</view>
			</view>
			<view class="backfill-btn" hover-class="card-hover" @tap="backfill('今天 · 午间药')">
				<image class="backfill-btn__icon" src="/static/mine/med_icon_backfill.png" mode="aspectFit"></image>
				<text class="backfill-btn__text">立即补录本顿药</text>
			</view>
			<view class="rec-foot">
				<image class="rec-foot__icon rec-foot__icon--note" src="/static/mine/med_icon_note.png" mode="aspectFit"></image>
				<text class="rec-foot__text">备注：计划中</text>
			</view>
		</view>

		<!-- ============ 昨天 · 晚间药 ============ -->
		<view class="rec-card">
			<view class="rec-card__head">
				<view class="rec-card__moon"></view>
				<text class="rec-card__head-title">昨天 · 晚间药</text>
				<view class="rec-card__status rec-card__status--done">
					<image class="rec-card__status-icon" src="/static/mine/med_icon_recorded.png" mode="aspectFit"></image>
					<text class="rec-card__status-text rec-card__status-text--done">已记录服用</text>
				</view>
			</view>
			<view class="drug-box">
				<text class="drug-box__name">银杏叶提取物滴剂</text>
				<view class="drug-box__dose-row">
					<image class="drug-box__dose-icon drug-box__dose-icon--green" src="/static/mine/med_icon_dose2.png" mode="aspectFit"></image>
					<text class="drug-box__dose drug-box__dose--green">规格剂量：20滴 (温开水冲服)</text>
				</view>
			</view>
			<view class="time-block">
				<view class="time-block__col">
					<text class="time-block__label">计划服药</text>
					<text class="time-block__value">19:30</text>
				</view>
				<view class="time-block__col">
					<text class="time-block__label">打卡记录</text>
					<text class="time-block__value time-block__value--green">19:40</text>
				</view>
			</view>
		</view>

		<!-- ============ 前天 · 午间药 ============ -->
		<view class="rec-card rec-card--gap">
			<view class="rec-card__head">
				<image class="rec-card__head-icon rec-card__head-icon--small" src="/static/mine/med_icon_noon.png" mode="aspectFit"></image>
				<text class="rec-card__head-title">前天 · 午间药</text>
				<view class="rec-card__status rec-card__status--miss">
					<image class="rec-card__status-icon" src="/static/mine/med_icon_pending.png" mode="aspectFit"></image>
					<text class="rec-card__status-text rec-card__status-text--miss">未记录 / 已错过</text>
				</view>
			</view>
			<view class="drug-box">
				<text class="drug-box__name">硝苯地平控释片</text>
				<view class="drug-box__dose-row">
					<image class="drug-box__dose-icon" src="/static/mine/med_icon_dose.png" mode="aspectFit"></image>
					<text class="drug-box__dose">规格剂量：30mg / 1片</text>
				</view>
			</view>
			<view class="time-block">
				<view class="time-block__col">
					<text class="time-block__label">原计划时间</text>
					<text class="time-block__value">12:30</text>
				</view>
				<view class="time-block__col time-block__col--msg">
					<text class="time-block__msg">无需忧虑，保持平稳心态</text>
				</view>
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
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') },
		recordCount() { return 4 }
	},
	data() {
		return {
			activeDate: 'today',
			dates: [
				{ key: 'today', name: '今天', date: '10月24日' },
				{ key: 'd1', name: '昨天', date: '10月23日' },
				{ key: 'd2', name: '前天', date: '10月22日' },
				{ key: 'd3', name: '周二', date: '10月21日' },
				{ key: 'd4', name: '周一', date: '10月20日' },
				{ key: 'history', name: '历史日期', special: true }
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		chooseDate(d) {
			if (d.special) {
				uni.showToast({ title: '更早日程记录整理中', icon: 'none' })
				return
			}
			this.activeDate = d.key
		},
		backfill(name) {
			uni.showToast({ title: name + '已补录', icon: 'success' })
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

/* ============ 提示条 ============ */
.hint-bar {
	width: 673rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 23rpx 31rpx;
	box-sizing: border-box;

	&__icon { width: 38rpx; height: 38rpx; flex-shrink: 0; }
	&__text {
		flex: 1; min-width: 0;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		line-height: 50rpx;
		margin-left: 15rpx;
	}
}

/* ============ 日期选择 ============ */
.date-head {
	display: flex; flex-direction: row; align-items: center;
	margin: 42rpx 38rpx 0;

	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&__icon { width: 35rpx; height: 38rpx; margin-left: 10rpx; }
	&__hint {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
}
.date-scroll {
	white-space: nowrap;
	margin-top: 19rpx;
	padding: 0 38rpx;
	box-sizing: border-box;
	width: 100%;
}
.date-chip {
	display: inline-flex;
	flex-direction: column;
	align-items: center; justify-content: center;
	width: 202rpx; height: 112rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	margin-right: 23rpx;
	box-sizing: border-box;

	&--active { background-color: rgba(91, 181, 165, 1); }
	&--special { background-color: rgba(246, 223, 192, 1); }
	&__icon { width: 35rpx; height: 38rpx; }
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&--special .date-chip__name { font-size: 31rpx; color: rgba(114, 98, 73, 1); }
	&__name--active { color: #FFFFFF; }
	&__date {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 2rpx;
	}
	&__date--active { color: #FFFFFF; }
}

/* ============ 明细标题 ============ */
.detail-head {
	display: flex; flex-direction: row; align-items: baseline;
	margin: 54rpx 38rpx 0;

	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; letter-spacing: -1rpx;
		color: rgba(21, 29, 26, 1);
	}
	&__count {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
}

/* ============ 记录卡 ============ */
.rec-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	margin: 23rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;

	&--gap { margin-top: 65rpx; }
	&__head {
		display: flex; flex-direction: row; align-items: center;
	}
	&__head-icon { width: 46rpx; height: 38rpx; flex-shrink: 0; }
	&__head-icon--small { width: 38rpx; height: 31rpx; }
	&__head-title {
		flex: 1; min-width: 0;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		margin-left: 15rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	/* 晚间月牙（素材缺失，CSS 绘制） */
	&__moon {
		width: 42rpx; height: 42rpx;
		border-radius: 50%;
		background-color: rgba(72, 101, 86, 1);
		position: relative;
		overflow: hidden;
		flex-shrink: 0;
	}
	&__moon::after {
		content: '';
		position: absolute;
		width: 42rpx; height: 42rpx;
		border-radius: 50%;
		background-color: rgba(242, 252, 245, 1);
		left: -13rpx; top: -9rpx;
	}
	&__status {
		border-radius: 999rpx;
		height: 58rpx;
		display: flex; flex-direction: row; align-items: center; justify-content: center;
		padding: 0 19rpx;
		flex-shrink: 0;
		box-sizing: border-box;
	}
	&__status--done { background-color: rgba(202, 234, 215, 1); }
	&__status--wait { background-color: rgba(246, 223, 192, 1); }
	&__status--miss { background-color: rgba(219, 229, 223, 1); }
	&__status-icon { width: 33rpx; height: 33rpx; }
	&__status-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx;
		margin-left: 8rpx;
		white-space: nowrap;
	}
	&__status-text--done { color: rgba(3, 32, 21, 1); }
	&__status-text--wait { color: rgba(114, 98, 73, 1); }
	&__status-text--miss { color: rgba(66, 72, 68, 1); }
}

/* ============ 药品块 ============ */
.drug-box {
	width: 596rpx; height: 169rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin: 23rpx 0 0;
	padding: 23rpx 31rpx;
	box-sizing: border-box;
	display: flex; flex-direction: column; justify-content: center;

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
	&__dose-icon--green { width: 27rpx; height: 33rpx; }
	&__dose {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 35rpx; color: rgba(66, 72, 68, 1);
		margin-left: 8rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__dose--green { color: rgba(72, 101, 86, 1); }
}

/* ============ 时间块 ============ */
.time-block {
	width: 596rpx; height: 146rpx;
	background-color: rgba(242, 252, 245, 1);
	border-radius: 15rpx;
	margin: 23rpx 0 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 31rpx;
	box-sizing: border-box;

	&__col {
		width: 264rpx;
		display: flex; flex-direction: column;
	}
	&__col--msg {
		width: auto;
		flex: 1;
		align-items: flex-end;
		justify-content: center;
	}
	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
	}
	&__value {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
		margin-top: 4rpx;
	}
	&__value--green { color: rgba(72, 101, 86, 1); }
	&__value--brown { color: rgba(138, 80, 32, 1); }
	&__msg {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		text-align: right;
	}
}

/* ============ 补录按钮 ============ */
.backfill-btn {
	width: 596rpx; height: 112rpx;
	background-color: rgba(90, 181, 165, 1);
	border-radius: 23rpx;
	margin: 23rpx 0 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 38rpx; height: 35rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: #FFFFFF;
		margin-left: 10rpx;
	}
}

/* ============ 记录底部行 ============ */
.rec-foot {
	display: flex; flex-direction: row; align-items: flex-start;
	margin: 23rpx 0 0;

	&__icon { width: 37rpx; height: 37rpx; margin-top: 4rpx; flex-shrink: 0; }
	&__icon--note { width: 29rpx; height: 19rpx; margin-top: 12rpx; }
	&__text {
		flex: 1; min-width: 0;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		line-height: 46rpx;
		margin-left: 10rpx;
	}
}
</style>
