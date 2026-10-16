<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<!-- 顶部区：日期胶囊（left:52, top:42）+ 问候语 + 头像（absolute left:560 top:144 rpx） -->
		<view class="group-1" :style="{ paddingTop: safeTop + 'rpx' }">
			<!-- 日期胶囊 -->
			<view class="date-pill">
				<image class="date-pill__icon" :src="icon('date')" mode="aspectFit"></image>
				<text class="date-pill__text">{{ dateText }}</text>
			</view>
			<!-- 问候语 -->
			<text class="greeting">{{ greeting }}，{{ patient.nickname || patient.name || '' }}！</text>
			<!-- 右上头像（底部与问候语底部齐平，JS 动态算 top = safeTop + 44rpx） -->
			<view class="head-avatar" :style="{ top: headAvatarTop + 'rpx' }">
				<image class="head-avatar-img" :src="patient.avatar || icon('patient')" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 看看从前：白卡 border-radius:46rpx 浅绿描边 + 阴影，margin-top:-2 贴近顶部 -->
		<view class="lookback">
			<view class="lookback__head">
				<image class="lookback__head-icon" :src="icon('lookBack')" mode="aspectFit"></image>
				<text class="lookback__head-title">看看从前</text>
				<text class="lookback__head-tip">点一下就看</text>
			</view>
			<view class="entries">
				<!-- 我是谁（绿底浅绿描边） -->
				<view class="entry entry--green" hover-class="entry--hover" @tap="goWhoami">
					<view class="entry__avatar">
						<image class="entry__avatar-img" :src="patient.avatar || icon('patient')" mode="aspectFill"></image>
					</view>
					<text class="entry__name">我是谁</text>
					<text class="entry__sub entry__sub--green">{{ patient.name || '' }} {{ patient.age || '' }}岁</text>
				</view>
				<!-- 家人们（橙底橙描边） -->
				<view class="entry entry--orange" hover-class="entry--hover" @tap="goFamily">
					<view class="entry__avatar">
						<image class="entry__avatar-img" :src="icon('family')" mode="aspectFit"></image>
					</view>
					<text class="entry__name">家人们</text>
					<text class="entry__sub entry__sub--orange">{{ familySubtitle }}</text>
				</view>
				<!-- 我住哪（蓝底蓝描边 + 蓝圆实心背景） -->
				<view class="entry entry--blue" hover-class="entry--hover" @tap="goResidence">
					<view class="entry__blue-circle">
						<image class="entry__blue-icon" :src="icon('whereILive')" mode="aspectFit"></image>
					</view>
					<text class="entry__name">我住哪</text>
					<text class="entry__sub entry__sub--blue">{{ residenceText }}</text>
				</view>
			</view>
		</view>

		<!-- 下方双栏：左大(脑力小时光) + 右小(呼叫女儿 / 今日提醒) -->
		<view class="duo">
			<!-- 脑力小时光（青绿 bg:#57B5A5） -->
			<view class="brain" hover-class="brain--hover" @tap="goTraining">
				<view class="brain__top">
					<text class="brain__title">脑力小时光</text>
					<view class="brain__mini">
						<image class="brain__arrow" :src="icon('arrowRight')" mode="aspectFit"></image>
					</view>
				</view>
				<text class="brain__desc">玩玩小游戏\n唤醒好记忆</text>
				<view class="brain__play">
					<image class="brain__play-img" :src="icon('brainTime')" mode="aspectFit"></image>
				</view>
			</view>

			<view class="duo__right">
				<!-- 呼叫女儿（橙 bg:#FF7A29） -->
				<view class="call" hover-class="call--hover" @tap="onAskCall">
					<view class="call__top">
						<view class="call__avatar">
							<image class="call__avatar-img" :src="icon('avatarFangfang')" mode="aspectFill"></image>
						</view>
						<view class="call__mini">
							<image class="call__arrow" :src="icon('arrowRight')" mode="aspectFit"></image>
						</view>
					</view>
					<view class="call__label">
						<view class="ic-phone"></view>
						<text class="call__title">呼叫女儿</text>
					</view>
				</view>
				<!-- 今日提醒（白卡 + 橙色内卡） -->
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
			safeTop: 40,
			headAvatarTop: 64  // safeTop + 24 的默认值
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
		try {
			const info = uni.getSystemInfoSync()
			this.safeTop = Math.round((info.statusBarHeight || 20) * 1.923)
			// 头像 bottom 与问候语 bottom 齐平：胶囊 top(safeTop+22) + 胶囊高(60) - 问候语margin(-2) + 问候语line-height(67) - 头像高(123)
			// = safeTop + 22 + 60 - 2 + 67 - 123 = safeTop + 24
			this.headAvatarTop = this.safeTop + 24
		} catch (e) {
			this.safeTop = 40
			this.headAvatarTop = 40 + 44
		}
	},
	onShow() {
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
			uni.navigateTo({ url: '/pages/training/clock' })
		}
	}
}
</script>

<style lang="scss" scoped>
/* ============================================================
   蓝湖 1:1 还原（rpx 单位，源画布 750×1623 rpx）
   ============================================================ */
.page {
	background-color: $yb-c-bg-grey; /* #F5F9F6 */
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding-bottom: 180rpx;
	box-sizing: border-box;
	width: 750rpx;
}

/* —— 顶部 group_1 —— */
.group-1 {
	position: relative;
	width: 750rpx;
	display: flex;
	flex-direction: column;
}

/* 日期胶囊（紧凑化：margin-top 从 42→22） */
.date-pill {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: $yb-c-teal-3; /* #E5F2EB */
	border-radius: 15rpx;
	width: 344rpx;
	height: 60rpx;
	box-sizing: border-box;
	margin: 22rpx 0 0 52rpx;

	&__icon {
		width: 25rpx;
		height: 29rpx;
		margin-top: 10rpx;
		margin-left: 23rpx;
		margin-right: 14rpx;
	}

	&__text {
		font-family: $yb-font-sans;
		font-size: 29rpx;
		font-weight: 700;
		color: $yb-c-green-2; /* #365947 */
		white-space: nowrap;
		line-height: 43rpx;
	}
}

/* 问候语（紧凑化：margin-bottom 从 44→20） */
.greeting {
	font-family: $yb-font-sans;
	font-size: 54rpx;
	font-weight: 500;
	color: $yb-c-text-1; /* #192620 */
	text-align: left;
	white-space: nowrap;
	line-height: 67rpx;
	margin: -2rpx 0 20rpx 52rpx;
}

/* 右上头像（bottom 与问候语 bottom 齐平，JS 动态控制 top） */
.head-avatar {
	position: absolute;
	left: 560rpx;
	width: 123rpx;
	height: 123rpx;
	border-radius: 19229rpx; /* ≈50% */
	background-color: $yb-c-bg-white;
	box-shadow: 0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;

	&-img {
		width: 123rpx;
		height: 123rpx;
		border-radius: 19229rpx;
	}
}

/* —— 看看从前 group_6（margin:-2rpx 0 0 31rpx，贴近顶部）—— */
.lookback {
	background-color: $yb-c-bg-white;
	border-radius: 46rpx;
	width: 688rpx;
	height: 488rpx;
	margin: -2rpx 0 0 31rpx;
	box-sizing: border-box;
	box-shadow: 0 4rpx 16rpx rgba(30, 50, 40, 0.06);
	border: 1rpx solid #E3EDE7;
	display: flex;
	flex-direction: column;

	&__head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start; /* icon 和 title 贴近，tip 推到最右 */
		width: 608rpx;
		height: 63rpx;
		margin: 33rpx 0 0 40rpx;
	}

	&__head-icon {
		width: 46rpx;
		height: 46rpx;
		margin-top: 10rpx;
		flex-shrink: 0;
	}

	&__head-title {
		font-family: $yb-font-sans;
		font-size: 42rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		line-height: 63rpx;
		margin-left: 12rpx; /* icon→title 贴近，12rpx 间距 */
		flex-shrink: 0;
	}

	&__head-tip {
		font-family: $yb-font-sans;
		font-size: 29rpx;
		font-weight: 500;
		color: $yb-c-text-sub2; /* #4F6358 */
		margin-top: 10rpx;
		line-height: 43rpx;
		margin-left: auto; /* 推到最右 */
	}
}

/* 三个入口横排（蓝湖：623×337rpx，margin:23rpx 0 33rpx 33rpx） */
.entries {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 623rpx;
	height: 337rpx;
	margin: 23rpx 0 33rpx 33rpx;
}

.entry {
	width: 192rpx;
	height: 335rpx; /* 蓝湖 block_1 height:335, block_2/3:337，统一取 335 */
	border-radius: 31rpx;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	&--hover { opacity: 0.9; }

	&--green {
		background-color: #F4F9F6;
		border: 2rpx solid #D4E8DC;
		justify-content: flex-start;
	}
	&--orange {
		background-color: #FFF6EF;
		border: 2rpx solid #FDCCC5;
		margin-left: 23rpx;
		height: 337rpx;
	}
	&--blue {
		background-color: #F0F5FA;
		border: 2rpx solid #D3E3F2;
		margin-left: 23rpx;
		height: 337rpx;
	}

	/* 头像圆（3 卡都是 123×123，margin-top 略有差异：48 / 50 / 50） */
	&__avatar {
		width: 123rpx;
		height: 123rpx;
		border-radius: 19229rpx;
		background-color: $yb-c-bg-white;
		box-shadow: 0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		margin: 48rpx 0 0 35rpx;
	}
	.entry--orange &__avatar,
	.entry--blue &__avatar {
		margin-top: 50rpx;
	}

	&__avatar-img {
		width: 123rpx;
		height: 123rpx;
		border-radius: 19229rpx;
		object-fit: cover;
	}

	/* 我住哪专属：蓝圆实心背景 + 房子图标（房子放大到 90×83rpx） */
	&__blue-circle {
		width: 123rpx;
		height: 123rpx;
		border-radius: 19229rpx;
		background-color: $yb-c-blue-2; /* #3874AB */
		box-shadow: 0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 50rpx 0 0 35rpx;
	}

	&__blue-icon {
		width: 90rpx;
		height: 83rpx;
	}

	/* 文字组（蓝湖：name 在 138rpx 宽容器居中，sub 在下方） */
	&__name {
		font-family: $yb-font-sans;
		font-size: 38rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		text-align: center;
		line-height: 58rpx;
		margin-top: 15rpx;
	}

	&__sub {
		font-family: $yb-font-sans;
		font-size: 25rpx;
		font-weight: 500;
		text-align: center;
		line-height: 38rpx;
		margin-top: 4rpx;
		margin-bottom: 48rpx;
		white-space: nowrap;
	}
	.entry--orange &__sub,
	.entry--blue &__sub {
		margin-top: 2rpx;
		margin-bottom: 50rpx;
	}

	&__sub--green { color: $yb-c-green-2; }   /* #365947 */
	&__sub--orange { color: $yb-c-orange-3; } /* #BA5518 */
	&__sub--blue { color: $yb-c-blue-1; }     /* #275988 */
}

/* 下方双栏（紧凑化：margin-top 从 42→15） */
.duo {
	width: 688rpx;
	height: 579rpx;
	margin: 30rpx 0 0 31rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

/* 脑力小时光（青绿大卡：360×579rpx, bg:#57B5A5, border:2rpx rgba(54,89,71,0.2)） */
.brain {
	width: 360rpx;
	height: 579rpx;
	background-color: $yb-c-teal-1; /* #57B5A5 */
	border-radius: 46rpx;
	border: 2rpx solid rgba(54, 89, 71, 0.2);
	box-shadow: 0 8rpx 24rpx rgba(54, 89, 71, 0.28);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	&--hover { opacity: 0.95; }

	/* 顶部标题行：居中对齐一行显示 */
	&__top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 317rpx;
		margin: 46rpx 0 0 27rpx;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: 50rpx;
		font-weight: 500;
		letter-spacing: -1rpx;
		color: #FFFFFF;
		line-height: 63rpx;
	}

	/* 播放小角标（77×77 白半透明圆） */
	&__mini {
		width: 77rpx;
		height: 77rpx;
		border-radius: 19229rpx;
		background-color: rgba(255, 255, 255, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-left: -6rpx;
	}

	&__arrow {
		width: 40rpx;
		height: 40rpx;
	}

	/* 描述文字（margin-top:62rpx） */
	&__desc {
		font-family: $yb-font-sans;
		font-size: 33rpx;
		font-weight: 500;
		color: $yb-c-teal-2; /* #CFE4D8 */
		line-height: 49rpx;
		margin: 62rpx 0 0 27rpx;
		white-space: pre-line;
	}

	/* 下方大播放圆（138×138 白底 + shadow） */
	&__play {
		width: 138rpx;
		height: 138rpx;
		border-radius: 19229rpx;
		background-color: #FFFFFF;
		box-shadow: 0 10rpx 15rpx -3rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 62rpx 0 63rpx 27rpx;
	}

	&__play-img {
		width: 92rpx;
		height: 92rpx;
	}
}

/* 右侧列（298×579 flex 纵向 space-between） */
.duo__right {
	width: 298rpx;
	height: 579rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

/* 呼叫女儿（橙卡：298×265, bg:#FF7A29, border:2rpx rgba(255,255,255,0.4)） */
.call {
	width: 298rpx;
	height: 265rpx;
	background-color: $yb-c-orange-2; /* #FF7A29 */
	border-radius: 46rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.4);
	box-shadow: 0 8rpx 24rpx rgba(255, 122, 41, 0.38);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	&--hover { opacity: 0.95; }

	/* 头区（margin:27rpx 0 0 31rpx） */
	&__top {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		width: 250rpx;
		height: 123rpx;
		margin: 27rpx 0 0 31rpx;
	}

	&__avatar {
		width: 123rpx;
		height: 123rpx;
		border-radius: 19229rpx;
		background-color: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	&__avatar-img {
		width: 108rpx;
		height: 108rpx;
		border-radius: 19229rpx;
		margin: 8rpx 0 0 8rpx; /* 蓝湖 image-wrapper_7 里 margin:8rpx */
	}

	/* 右上小圆（92×92 白半透明） */
	&__mini {
		width: 92rpx;
		height: 92rpx;
		border-radius: 19229rpx;
		background-color: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__arrow {
		width: 44rpx;
		height: 44rpx;
	}

	/* 标题行（margin:17rpx 0 23rpx 37rpx） */
	&__label {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 252rpx;
		height: 75rpx;
		margin: 17rpx 0 23rpx 37rpx;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: 50rpx;
		font-weight: 500;
		letter-spacing: -1rpx;
		color: #FFFFFF;
		margin-left: 12rpx;
		line-height: 75rpx;
		white-space: nowrap;
	}
}

/* 今日提醒（白卡：298×287, bg:#FFF, border-radius:46rpx, shadow） */
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

	/* 标题行（margin:33rpx 0 0 40rpx） */
	&__head {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 225rpx;
		height: 63rpx;
		margin: 33rpx 0 0 40rpx;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: 42rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		line-height: 63rpx;
		margin-left: 12rpx;
	}
}

/* 吃药内卡（橙边：263×165, bg:#FEF6EE, border-radius:31rpx, border:2rpx #FBD6B6） */
.med {
	margin: 8rpx 0 17rpx 23rpx;
	background-color: #FEF6EE;
	border-radius: 31rpx;
	border: 2rpx solid #FBD6B6;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	width: 263rpx;
	height: 165rpx;
	box-sizing: border-box;

	&--hover { opacity: 0.95; }

	/* 药丸图标圆（92×92, bg:#E97A37, margin:37rpx 0 0 23rpx） */
	&__circle {
		width: 92rpx;
		height: 92rpx;
		border-radius: 19229rpx;
		background-color: $yb-c-orange-1; /* #E97A37 */
		box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin: 37rpx 0 0 23rpx;
	}

	&__pill {
		width: 40rpx;
		height: 46rpx;
	}

	/* 文字组 */
	&__text {
		display: flex;
		flex-direction: column;
		margin: 30rpx 0 0 12rpx;
	}

	&__name {
		font-family: $yb-font-sans;
		font-size: 42rpx;
		font-weight: 500;
		color: $yb-c-text-1;
		line-height: 58rpx;
	}

	&__time {
		font-family: $yb-font-sans;
		font-size: 25rpx;
		font-weight: 500;
		color: $yb-c-orange-4; /* #A25016 */
		line-height: 38rpx;
	}
}

/* ============================================================
   内联 SVG 图标（本地无对应素材，data URI 不引远程依赖）
   颜色按蓝湖设计稿精确值写死在 SVG path fill 中
   ============================================================ */

/* 呼叫女儿 - 白色电话图标（蓝湖 44×44rpx，用于标题行） */
.ic-phone {
	width: 44rpx;
	height: 44rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z'/%3E%3C/svg%3E");
}

/* 今日提醒 - 墨绿黑铃铛图标（蓝湖 40×40rpx，fill:#192620） */
.ic-bell {
	width: 40rpx;
	height: 40rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23192620'%3E%3Cpath d='M12 2a2 2 0 0 0-2 2v.5C7.5 5.4 6 7.6 6 10v4l-2 2v1h16v-1l-2-2v-4c0-2.4-1.5-4.6-4-4.5V4a2 2 0 0 0-2-2zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z'/%3E%3C/svg%3E");
}
</style>
