<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<!-- 顶部：状态栏安全区 + 日期胶囊 + 右上角头像 + 问候语（自定义导航，内容贴顶） -->
		<view class="head" :style="{ paddingTop: safeTop + 'rpx' }">
			<view class="head__top">
				<view class="date-pill">
					<image class="date-pill__icon" :src="icon('date')" mode="aspectFit"></image>
					<text class="date-pill__text">{{ dateText }}</text>
				</view>
				<view class="head__avatar">
					<image class="head__avatar-img" :src="patient.avatar || icon('patient')" mode="aspectFill"></image>
				</view>
			</view>
			<text class="greeting">{{ greeting }}，{{ patient.nickname || patient.name || '' }}！</text>
		</view>

		<!-- 看看从前：三个一级入口（PRD 8.2），三色卡片 -->
		<view class="lookback">
			<view class="lookback__head">
				<image class="lookback__head-icon" :src="icon('lookBack')" mode="aspectFit"></image>
				<text class="lookback__head-title">看看从前</text>
				<text class="lookback__head-tip">点一下就看</text>
			</view>

			<view class="entries">
				<!-- 我是谁 -->
				<view class="entry entry--green" hover-class="entry--hover" @tap="goWhoami">
					<view class="entry__avatar">
						<image class="entry__avatar-img" :src="patient.avatar || icon('patient')" mode="aspectFill"></image>
					</view>
					<text class="entry__name">我是谁</text>
					<text class="entry__sub entry__sub--green">{{ patient.name || '' }} {{ patient.age || '' }}岁</text>
				</view>

				<!-- 家人们 -->
				<view class="entry entry--orange" hover-class="entry--hover" @tap="goFamily">
					<view class="entry__avatar">
						<image class="entry__avatar-img" :src="icon('family')" mode="aspectFit"></image>
					</view>
					<text class="entry__name">家人们</text>
					<text class="entry__sub entry__sub--orange">{{ familySubtitle }}</text>
				</view>

				<!-- 我住哪 -->
				<view class="entry entry--blue" hover-class="entry--hover" @tap="goResidence">
					<view class="entry__blue-circle">
						<image class="entry__blue-icon" :src="icon('whereILive')" mode="aspectFit"></image>
					</view>
					<text class="entry__name">我住哪</text>
					<text class="entry__sub entry__sub--blue">{{ residenceText }}</text>
				</view>
			</view>
		</view>

		<!-- 下方双栏：左 脑力小时光（青绿） / 右 呼叫女儿（橙）+ 今日提醒（白） -->
		<view class="duo">
			<!-- 脑力小时光 -->
			<view class="brain" hover-class="brain--hover" @tap="goTraining">
				<view class="brain__top">
					<text class="brain__title">脑力小时光</text>
					<view class="brain__mini">
						<view class="ic-play"></view>
					</view>
				</view>
				<text class="brain__desc">玩玩小游戏\n唤醒好记忆</text>
				<view class="brain__play">
					<image class="brain__play-img" :src="icon('brainTime')" mode="aspectFit"></image>
				</view>
			</view>

			<view class="duo__right">
				<!-- 呼叫女儿 -->
				<view class="call" hover-class="call--hover" @tap="onAskCall">
					<view class="call__top">
						<view class="call__avatar">
							<image class="call__avatar-img" :src="icon('avatarFangfang')" mode="aspectFill"></image>
						</view>
						<view class="call__mini">
							<view class="ic-phone"></view>
						</view>
					</view>
					<view class="call__label">
						<view class="ic-phone ic-phone--lg"></view>
						<text class="call__title">呼叫女儿</text>
					</view>
				</view>

				<!-- 今日提醒 -->
				<view class="remind">
					<view class="remind__head">
						<view class="ic-bell"></view>
						<text class="remind__title">今日提醒</text>
					</view>
					<view class="med" hover-class="med--hover" @tap="onAskConfirm(nextPlan)">
						<view class="med__circle">
							<image class="med__pill" :src="icon('medication')" mode="aspectFit"></image>
						</view>
						<view class="med__text">
							<text class="med__name">吃药</text>
							<text class="med__time" v-if="nextPlan">{{ nextPlan.planTime }}</text>
							<text class="med__status" v-if="nextPlan">{{ planStatus(nextPlan.id) === 'PENDING' ? '待确认' : '已确认' }}</text>
							<text class="med__time" v-else>暂无提醒</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 服药确认弹窗 -->
		<yb-confirm-dialog
			:visible="confirmVisible"
			title="确认服药"
			:content="confirmText"
			confirm-text="已服用"
			cancel-text="点错了"
			@confirm="onConfirmOk"
			@cancel="onConfirmCancel"
		></yb-confirm-dialog>

		<!-- 拨打电话确认弹窗 -->
		<yb-confirm-dialog
			:visible="callVisible"
			title="拨打紧急电话"
			:content="callText"
			confirm-text="立即拨打"
			cancel-text="取消"
			@confirm="onCallOk"
			@cancel="onCallCancel"
		></yb-confirm-dialog>

		<!-- 自定义底部 TabBar -->
		<yb-tab-bar></yb-tab-bar>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import { icon } from '../../services/iconMap.js'
import { greetingByHour, weekdayNames } from '../../services/defaults.js'
import { todayKey } from '../../store/persistence.js'

/** 计划时间统一补零排序（'9:00' → '09:00'） */
function timeVal(t) {
	const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || ''))
	return m ? ('0' + m[1]).slice(-2) + ':' + m[2] : String(t || '')
}

export default {
	data() {
		return {
			icon,
			confirmVisible: false,
			pendingPlan: null,
			callVisible: false,
			safeTop: 40
		}
	},
	computed: {
		store() { return useStore() },
		ui() { return this.store.ui },
		patient() { return this.store.patient },
		family() { return this.store.family },
		medication() { return this.store.medication },
		emergency() { return this.store.emergency },
		serifReady() { return this.store.ui.serifReady },
		dateText() {
			const d = new Date()
			return (d.getMonth() + 1) + '月' + d.getDate() + '日 · ' + weekdayNames[d.getDay()] + ' · 晴'
		},
		greeting() {
			return greetingByHour(new Date().getHours())
		},
		familySubtitle() {
			return '老伴与女儿'
		},
		residenceText() {
			const r = this.patient.residence
			return (r && r.name) ? r.name : '老家院子'
		},
		enabledPlans() {
			return (this.medication.plans || [])
				.filter(p => p.enabled)
				.slice()
				.sort((a, b) => timeVal(a.planTime).localeCompare(timeVal(b.planTime)))
		},
		pendingPlans() {
			return this.enabledPlans.filter(p => this.planStatus(p.id) === 'PENDING')
		},
		/** 首页只展示一条：下一个待确认的；全部已确认则展示当天第一条看状态 */
		nextPlan() {
			const pending = this.pendingPlans
			if (pending.length) return pending[0]
			const all = this.enabledPlans
			return all.length ? all[0] : null
		},
		confirmText() {
			const p = this.pendingPlan
			if (!p) return ''
			let s = '是否已服用「' + p.drugName + '」？'
			const meta = [p.planTime, p.note].filter(Boolean).join(' · ')
			if (meta) s += '（' + meta + '）'
			return s
		},
		callText() {
			const e = this.emergency
			if (!e) return ''
			return '即将拨打' + (e.relation || '') + (e.name || '') + '的电话：' + (e.phone || '')
		}
	},
	onLoad() {
		// 自定义导航：用真实状态栏高度作为顶部安全区，避免内容被刘海/状态栏遮挡
		try {
			const info = uni.getSystemInfoSync()
			this.safeTop = Math.round((info.statusBarHeight || 20) * 1.923)
		} catch (e) {
			this.safeTop = 40
		}
	},
	onShow() {
		// tabBar 页不触发 onLoad，必须在 onShow 刷新（跨页同步的关键）
		actions.refreshPatient()
		actions.refreshMedication()
		actions.refreshEmergency()
		actions.refreshFamily()
		actions.refreshMemoir()
	},
	methods: {
		planStatus(planId) {
			const day = todayKey()
			const c = (this.medication.confirmations || []).find(x => x.planId === planId && x.day === day)
			return c ? c.status : 'PENDING'
		},
		onAskConfirm(plan) {
			if (!plan) return
			this.pendingPlan = plan
			this.confirmVisible = true
		},
		onConfirmCancel() {
			this.confirmVisible = false
			this.pendingPlan = null
		},
		async onConfirmOk() {
			const plan = this.pendingPlan
			this.confirmVisible = false
			this.pendingPlan = null
			if (!plan) return
			try {
				await actions.confirmMedication(plan.id)
				uni.showToast({ title: '已确认', icon: 'success' })
			} catch (e) {
				uni.showToast({ title: (e && e.message) || '确认失败', icon: 'none' })
			}
		},
		onAskCall() {
			// 无号码禁止空拨号（PRD 8.5）
			if (!this.emergency || !this.emergency.phone) {
				uni.showToast({ title: '还没有设置紧急联系人电话', icon: 'none' })
				return
			}
			this.callVisible = true
		},
		onCallCancel() {
			this.callVisible = false
		},
		onCallOk() {
			this.callVisible = false
			const e = this.emergency
			if (!e || !e.phone) {
				uni.showToast({ title: '还没有设置紧急联系人电话', icon: 'none' })
				return
			}
			uni.makePhoneCall({
				phoneNumber: e.phone,
				fail: () => {
					uni.showToast({ title: '拨号失败，请重试', icon: 'none' })
				}
			})
		},
		goWhoami() {
			uni.navigateTo({ url: '/pages/past/whoami' })
		},
		goFamily() {
			uni.navigateTo({ url: '/pages/past/family' })
		},
		goResidence() {
			uni.navigateTo({ url: '/pages/past/residence' })
		},
		goTraining() {
			uni.showToast({ title: '脑力小时光即将上线', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: $yb-c-bg-grey;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding-bottom: 220rpx;
	box-sizing: border-box;
}

/* —— 顶部 —— */
.head {
	display: flex;
	flex-direction: column;
}

.head__top {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin: 42rpx 52rpx 0;
}

.head__avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: $yb-c-bg-white;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.12);
	overflow: hidden;
	flex-shrink: 0;
}

.head__avatar-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
}

.date-pill {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: $yb-c-teal-3;
	border-radius: 15rpx;
	width: 344rpx;
	height: 60rpx;
	box-sizing: border-box;
	padding: 0 23rpx;

	&__icon {
		width: 25rpx;
		height: 29rpx;
		margin-right: 12rpx;
	}

	&__text {
		font-family: $yb-font-sans;
		font-size: 29rpx;
		font-weight: 700;
		color: $yb-c-green-2;
		white-space: nowrap;
	}
}

.greeting {
	font-family: $yb-font-sans;
	font-size: 54rpx;
	font-weight: 500;
	color: $yb-c-text-1;
	text-align: left;
	white-space: nowrap;
	margin: 44rpx 0 0 52rpx;
}

/* —— 看看从前 —— */
.lookback {
	background-color: $yb-c-bg-white;
	border-radius: 46rpx;
	width: 688rpx;
	align-self: center;
	margin-top: 44rpx;
	padding: 33rpx 33rpx 40rpx;
	box-sizing: border-box;
	box-shadow: 0 4rpx 16rpx rgba(30, 50, 40, 0.06);
	border: 1rpx solid #E3EDE7;

	&__head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 23rpx;
	}

	&__head-icon {
		width: 46rpx;
		height: 46rpx;
	}

	&__head-title {
		font-family: $yb-font-sans;
		font-size: 42rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		flex: 1;
		margin-left: 12rpx;
	}

	&__head-tip {
		font-family: $yb-font-sans;
		font-size: 29rpx;
		font-weight: 500;
		color: $yb-c-text-sub2;
	}
}

.entries {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.entry {
	width: 192rpx;
	height: 335rpx;
	border-radius: 31rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	padding-top: 48rpx;

	&--hover { opacity: 0.9; }

	&--green {
		background-color: #F4F9F6;
		border: 2rpx solid #D4E8DC;
	}
	&--orange {
		background-color: #FFF6EF;
		border: 2rpx solid #FDCCC5;
	}
	&--blue {
		background-color: #F0F5FA;
		border: 2rpx solid #D3E3F2;
	}

	&__avatar {
		width: 123rpx;
		height: 123rpx;
		border-radius: 50%;
		background-color: #FFFFFF;
		box-shadow: 0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	&__avatar-img {
		width: 123rpx;
		height: 123rpx;
		border-radius: 50%;
	}

	&__blue-circle {
		width: 123rpx;
		height: 123rpx;
		border-radius: 50%;
		background-color: $yb-c-blue-2;
		box-shadow: 0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__blue-icon {
		width: 63rpx;
		height: 58rpx;
	}

	&__name {
		font-family: $yb-font-sans;
		font-size: 38rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		text-align: center;
		margin-top: 15rpx;
	}

	&__sub {
		font-family: $yb-font-sans;
		font-size: 25rpx;
		font-weight: 500;
		text-align: center;
		margin-top: 4rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 176rpx;

		&--green { color: $yb-c-green-2; }
		&--orange { color: $yb-c-orange-3; }
		&--blue { color: $yb-c-blue-1; }
	}
}

/* —— 下方双栏 —— */
.duo {
	width: 688rpx;
	align-self: center;
	margin-top: 42rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

/* 脑力小时光（青绿大卡） */
.brain {
	width: 360rpx;
	height: 579rpx;
	background-color: $yb-c-teal-1;
	border-radius: 46rpx;
	border: 2rpx solid rgba(54, 89, 71, 0.2);
	box-shadow: 0 8rpx 24rpx rgba(54, 89, 71, 0.28);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	padding: 46rpx 27rpx 63rpx;

	&--hover { opacity: 0.95; }

	&__top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: 50rpx;
		font-weight: 500;
		letter-spacing: -1rpx;
		color: #FFFFFF;
		white-space: nowrap;
		flex-shrink: 0;
	}

	&__mini {
		width: 77rpx;
		height: 77rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-left: -6rpx;
	}

	&__desc {
		font-family: $yb-font-sans;
		font-size: 33rpx;
		font-weight: 500;
		color: $yb-c-teal-2;
		line-height: 49rpx;
		margin-top: 62rpx;
		white-space: pre-line;
	}

	&__play {
		width: 138rpx;
		height: 138rpx;
		border-radius: 50%;
		background-color: #FFFFFF;
		box-shadow: 0 10rpx 15rpx -3rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 62rpx;
	}

	&__play-img {
		width: 92rpx;
		height: 92rpx;
	}
}

/* 右侧列 */
.duo__right {
	width: 298rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

/* 呼叫女儿（橙卡） */
.call {
	width: 298rpx;
	height: 265rpx;
	background-color: $yb-c-orange-2;
	border-radius: 46rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.4);
	box-shadow: 0 8rpx 24rpx rgba(255, 122, 41, 0.38);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	padding: 27rpx 9rpx 23rpx 31rpx;

	&--hover { opacity: 0.95; }

	&__top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	&__avatar {
		width: 123rpx;
		height: 123rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	&__avatar-img {
		width: 108rpx;
		height: 108rpx;
		border-radius: 50%;
	}

	&__mini {
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__label {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 17rpx;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: 50rpx;
		font-weight: 500;
		letter-spacing: -1rpx;
		color: #FFFFFF;
		margin-left: 12rpx;
		white-space: nowrap;
		flex-shrink: 0;
	}
}

/* 今日提醒（白卡） */
.remind {
	width: 298rpx;
	height: 287rpx;
	background-color: $yb-c-bg-white;
	border-radius: 46rpx;
	border: 1rpx solid #E3EDE7;
	box-shadow: 0 4rpx 16rpx rgba(30, 50, 40, 0.06);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	padding: 33rpx 23rpx 17rpx;

	&__head {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: 42rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		margin-left: 12rpx;
	}
}

/* 吃药内卡 */
.med {
	margin-top: 8rpx;
	background-color: #FEF6EE;
	border-radius: 31rpx;
	border: 2rpx solid #FBD6B6;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 37rpx 27rpx 37rpx 23rpx;
	box-sizing: border-box;

	&--hover { opacity: 0.95; }

	&__circle {
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
		background-color: $yb-c-orange-1;
		box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	&__pill {
		width: 40rpx;
		height: 46rpx;
	}

	&__text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 12rpx;
	}

	&__name {
		font-family: $yb-font-sans;
		font-size: 42rpx;
		font-weight: 500;
		color: $yb-c-text-1;
	}

	&__time {
		font-family: $yb-font-sans;
		font-size: 23rpx;
		font-weight: 500;
		color: $yb-c-orange-4;
	}

	&__status {
		font-family: $yb-font-sans;
		font-size: 31rpx;
		font-weight: 500;
		color: $yb-c-orange-4;
	}
}

/* —— 内联图标（本地无对应素材，data URI 不引远程依赖） —— */
.ic-play {
	width: 19rpx;
	height: 31rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E");
}

.ic-phone {
	width: 19rpx;
	height: 33rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z'/%3E%3C/svg%3E");

	&--lg {
		width: 44rpx;
		height: 44rpx;
	}
}

.ic-bell {
	width: 40rpx;
	height: 40rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23192620'%3E%3Cpath d='M12 2a2 2 0 0 0-2 2v.5C7.5 5.4 6 7.6 6 10v4l-2 2v1h16v-1l-2-2v-4c0-2.4-1.5-4.6-4-4.5V4a2 2 0 0 0-2-2zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z'/%3E%3C/svg%3E");
}
</style>
