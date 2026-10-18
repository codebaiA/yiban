<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">家庭管理</text>
		</view>

		<!-- ============ 核心资料整理 ============ -->
		<text class="group-label">核心资料整理</text>

		<view class="big-card" hover-class="card-hover" @tap="goMemberList">
			<view class="big-card__icon big-card__icon--green">
				<image class="big-card__icon-img" src="/static/mine/icon_members.png" mode="aspectFit"></image>
			</view>
			<view class="big-card__texts">
				<view class="big-card__title-row">
					<text class="big-card__title">家庭成员</text>
					<view class="big-card__chip big-card__chip--green">
						<text class="big-card__chip-text big-card__chip-text--green">已录入 {{ memberCount }} 位亲人</text>
					</view>
				</view>
				<text class="big-card__sub">记录每一位家人的信息与联系方式</text>
			</view>
			<image class="big-card__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
		</view>

		<view class="big-card" hover-class="card-hover" @tap="goMemoryManage">
			<view class="big-card__icon big-card__icon--cream">
				<image class="big-card__icon-img" src="/static/mine/icon_memory.png" mode="aspectFit"></image>
			</view>
			<view class="big-card__texts">
				<view class="big-card__title-row">
					<text class="big-card__title">回忆管理</text>
					<view class="big-card__chip big-card__chip--cream">
						<text class="big-card__chip-text big-card__chip-text--brown">已收录 {{ memoirCount }} 段回忆</text>
					</view>
				</view>
				<text class="big-card__sub">翻看属于{{ patientName }}的每一段珍贵回忆</text>
			</view>
			<image class="big-card__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
		</view>

		<!-- ============ 日常生活与守护 ============ -->
		<text class="group-label group-label--gap">日常生活与守护</text>

		<view class="row-card" hover-class="card-hover" @tap="goMedManage">
			<view class="row-card__icon row-card__icon--sage">
				<image class="row-card__icon-img" src="/static/mine/icon_med_fm.png" mode="aspectFit"></image>
			</view>
			<view class="row-card__texts">
				<text class="row-card__title">吃药管理</text>
				<text class="row-card__sub">记录每日用药与提醒</text>
			</view>
			<text class="row-card__value">每日 {{ medTimes }} 次提醒</text>
			<image class="row-card__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
		</view>

		<view class="row-card" hover-class="card-hover" @tap="goSosManage">
			<view class="row-card__icon row-card__icon--orange">
				<image class="row-card__icon-img" src="/static/mine/icon_sos.png" mode="aspectFit"></image>
			</view>
			<view class="row-card__texts">
				<text class="row-card__title">紧急联系人</text>
				<text class="row-card__sub">突发情况一键联系家人</text>
			</view>
			<text class="row-card__value row-card__value--brown">已设 {{ sosCount }} 位第一联系人</text>
			<image class="row-card__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
		</view>

		<!-- ============ 新增回忆分类申请（紧随紧急联系人） ============ -->
		<view class="apply-card" hover-class="card-hover" @tap="openApply">
			<view class="apply-card__icon">
				<image class="apply-card__icon-img" src="/static/mine/icon_apply_memoir.png" mode="aspectFit"></image>
			</view>
			<view class="apply-card__texts">
				<text class="apply-card__title">新增回忆分类申请</text>
				<text class="apply-card__sub">把新的回忆主题告诉家人，由家人添加</text>
			</view>
			<image class="apply-card__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
		</view>

		<!-- ============ 回忆分类申请进度弹窗 ============ -->
		<view v-if="applyVisible" class="apply-mask" @tap="closeApply">
			<view class="apply-dialog" @tap.stop>
				<text class="apply-dialog__title">回忆分类申请进度</text>
				<scroll-view class="apply-dialog__list" scroll-y>
					<view v-if="!applyList.length" class="apply-dialog__empty">
						<text class="apply-dialog__empty-text">暂无申请记录，\n可在新增回忆时选择「自定义标题」发起申请</text>
					</view>
					<view v-for="(r, i) in applyList" :key="i" class="apply-item">
						<view class="apply-item__row">
							<text class="apply-item__name">《{{ r.requestName }}》</text>
							<view class="apply-item__chip" :class="'apply-item__chip--' + (r.status || 'PENDING').toLowerCase()">
								<text class="apply-item__chip-text">{{ r.status === 'APPROVED' ? '已通过' : (r.status === 'REJECTED' ? '未通过' : '正在申请') }}</text>
							</view>
						</view>
						<text class="apply-item__time">{{ r.date }}</text>
					</view>
				</scroll-view>
				<view class="apply-dialog__btn" hover-class="card-hover" @tap="closeApply">
					<text class="apply-dialog__btn-text">我知道了</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') },
		patientName() { return (this.store.patient && this.store.patient.name) || '王建国' },
		memberCount() {
			const f = this.store.family
			return (f && f.members && f.members.length) || 6
		},
		memoirCount() {
			const m = this.store.memoir
			return (m && m.memories && m.memories.length) || 12
		},
		medTimes() {
			const p = this.store.medication
			if (p && p.plans && p.plans.length && p.plans[0].times) return p.plans[0].times.length
			return 2
		},
		sosCount() {
			const e = this.store.emergency
			return (e && e.contacts && e.contacts.length) || 2
		},
		applyList() {
			return (this.store.categoryRequests && this.store.categoryRequests.requests) || []
		}
	},
	data() {
		return {
			applyVisible: false // 回忆分类申请进度弹窗
		}
	},
	onLoad() {
		actions.refreshFamily && actions.refreshFamily()
		actions.refreshMemoir && actions.refreshMemoir()
		actions.refreshEmergency && actions.refreshEmergency()
		actions.refreshCategoryRequests && actions.refreshCategoryRequests()
	},
	methods: {
		openApply() {
			this.applyVisible = true
			actions.refreshCategoryRequests && actions.refreshCategoryRequests()
		},
		closeApply() {
			this.applyVisible = false
		},
		goBack() {
			uni.navigateBack()
		},
		goMemberList() {
			uni.navigateTo({ url: '/pages/mine/member-list' })
		},
		goMedManage() {
			uni.navigateTo({ url: '/pages/mine/med-manage' })
		},
		goSosManage() {
			uni.navigateTo({ url: '/pages/mine/sos-manage' })
		},
		goMemoryManage() {
			uni.navigateTo({ url: '/pages/mine/memory-manage' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F5F9F6;
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
.group-label {
	display: block;
	margin: 38rpx 0 0 46rpx;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 29rpx; color: rgba(66, 72, 68, 1);
}
.group-label--gap { margin-top: 50rpx; }

/* ============ 大卡（成员/回忆） ============ */
.big-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	margin: 23rpx auto 0;
	padding: 42rpx 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: center;

	&__icon {
		width: 92rpx; height: 92rpx;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon--green { background-color: #CAEAD7; }
	&__icon--cream { background-color: #F6DFC0; }
	&__icon-img { width: 44rpx; height: 44rpx; }

	&__texts {
		flex: 1; min-width: 0;
		margin-left: 31rpx;
	}
	&__title-row { display: flex; flex-direction: row; align-items: center; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		flex-shrink: 0;
	}
	&__chip {
		border-radius: 999rpx;
		height: 46rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 21rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
	&__chip--green { background-color: #ECF6F0; }
	&__chip--cream { background-color: #F6DFC0; }
	&__chip-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx;
		white-space: nowrap;
	}
	&__chip-text--green { color: rgba(72, 101, 86, 1); }
	&__chip-text--brown { color: rgba(138, 90, 40, 1); }
	&__sub {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 12rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__arrow {
		width: 13rpx; height: 21rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
}

/* ============ 行卡（吃药/紧急联系人） ============ */
.row-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	margin: 23rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: center;

	&__icon {
		width: 85rpx; height: 85rpx;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon--sage { background-color: #E1EAE4; }
	&__icon--orange { background-color: #FFDCC5; }
	&__icon-img { width: 38rpx; height: 38rpx; }

	&__texts {
		flex: 1; min-width: 0;
		margin-left: 31rpx;
	}
	&__title {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&__sub {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 8rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__value {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		flex-shrink: 0;
	}
	&__value--brown { color: rgba(138, 80, 32, 1); }
	&__arrow {
		width: 13rpx; height: 21rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
}
.card-hover { opacity: 0.8; }

/* ============ 新增回忆分类申请卡 ============ */
.apply-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	margin: 23rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: center;

	&__icon {
		width: 77rpx; height: 77rpx;
		background-color: #E6F0EA;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 31rpx; height: 31rpx; }
	&__texts { flex: 1; min-width: 0; margin-left: 27rpx; }
	&__title {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
	}
	&__sub {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 6rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__arrow {
		width: 13rpx; height: 21rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
}

/* ============ 回忆分类申请进度弹窗 ============ */
.apply-mask {
	position: fixed; left: 0; top: 0; right: 0; bottom: 0;
	background-color: rgba(21, 29, 26, 0.45);
	z-index: 99;
	display: flex; align-items: center; justify-content: center;
}
.apply-dialog {
	width: 630rpx;
	max-height: 70vh;
	background-color: #FFFFFF;
	border-radius: 31rpx;
	padding: 46rpx 38rpx calc(38rpx + env(safe-area-inset-bottom) / 2);
	box-sizing: border-box;
	display: flex; flex-direction: column;

	&__title {
		text-align: center;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
	}
	&__list {
		flex: 1;
		min-height: 0;
		margin-top: 31rpx;
		max-height: 620rpx;
	}
	&__empty {
		padding: 62rpx 0;
		display: flex; align-items: center; justify-content: center;
	}
	&__empty-text {
		text-align: center;
		font-family: "PingFang SC", sans-serif; font-weight: 400;
		font-size: 29rpx; color: rgba(114, 121, 116, 1);
		line-height: 46rpx;
	}
	&__btn {
		margin-top: 38rpx;
		height: 96rpx;
		background-color: rgba(89, 181, 165, 1);
		border-radius: 999rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__btn-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 33rpx; color: #FFFFFF;
	}
}
.apply-item {
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	padding: 27rpx 31rpx;
	margin-bottom: 23rpx;

	&__row {
		display: flex; flex-direction: row; align-items: center;
	}
	&__name {
		flex: 1; min-width: 0;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__chip {
		margin-left: 15rpx;
		padding: 6rpx 19rpx;
		border-radius: 999rpx;
		flex-shrink: 0;
	}
	&__chip--pending { background-color: rgba(246, 223, 192, 1); }
	&__chip--approved { background-color: rgba(202, 234, 215, 1); }
	&__chip--rejected { background-color: rgba(226, 230, 228, 1); }
	&__chip-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 25rpx; color: rgba(72, 101, 86, 1);
	}
	&__time {
		display: block;
		margin-top: 8rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 400;
		font-size: 25rpx; color: rgba(114, 121, 116, 1);
	}
}
</style>
