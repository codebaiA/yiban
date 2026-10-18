<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">添加服药计划</text>
		</view>

		<!-- ============ 提示条 ============ -->
		<view class="hint-bar">
			<view class="hint-bar__icon">
				<image class="hint-bar__icon-img" src="/static/mine/med_icon_hint.png" mode="aspectFit"></image>
			</view>
			<view class="hint-bar__texts">
				<text class="hint-bar__title">为{{ patientName }}（{{ patientAge }}岁）添加服药计划</text>
				<text class="hint-bar__sub">请依据医院处方或药盒医嘱如实填写</text>
			</view>
		</view>

		<!-- ============ 药物基本信息卡 ============ -->
		<view class="form-card">
			<view class="card-head">
				<view class="card-head__icon">
					<image class="card-head__icon-img" src="/static/mine/med_icon_drug.png" mode="aspectFit"></image>
				</view>
				<text class="card-head__title">药物基本信息</text>
			</view>

			<view class="field-row">
				<text class="field-row__label">药物名称</text>
				<text class="field-row__required">*</text>
				<text class="field-row__note">（必填）</text>
			</view>
			<view class="name-input">
				<input
					class="name-input__input"
					v-model="drugName"
					placeholder="请输入药物名称"
					placeholder-class="name-input__placeholder"
					maxlength="20"
				/>
				<view class="name-input__voice">
					<image class="name-input__voice-img" src="/static/mine/icon_voice_input.png" mode="aspectFit"></image>
				</view>
			</view>

			<view class="field-row field-row--gap">
				<text class="field-row__label">每次服用剂量</text>
				<text class="field-row__required">*</text>
				<text class="field-row__note">由用户按医生处方填写</text>
			</view>
			<view class="dose-row">
				<view class="dose-cell">
					<input class="dose-cell__num" v-model="doseNum" type="number" maxlength="3" />
					<text class="dose-cell__unit">数量</text>
				</view>
				<picker class="dose-cell" mode="selector" :range="doseUnits" @change="onUnitChange">
					<view class="dose-cell__inner">
						<text class="dose-cell__value">{{ doseUnit }}</text>
						<view class="caret"></view>
					</view>
				</picker>
			</view>
			<view class="quick-row">
				<text class="quick-row__label">常见剂量:</text>
				<view
					v-for="(q, qi) in quickDoses"
					:key="qi"
					class="quick-row__chip"
					hover-class="card-hover"
					@tap="applyQuick(q)"
				>
					<text class="quick-row__chip-text">{{ q }}</text>
				</view>
			</view>
		</view>

		<!-- ============ 服药时间安排卡 ============ -->
		<view class="form-card">
			<view class="card-head">
				<view class="card-head__icon">
					<image class="card-head__icon-img" src="/static/mine/med_icon_schedule.png" mode="aspectFit"></image>
				</view>
				<text class="card-head__title">服药时间安排</text>
			</view>

			<text class="field-label">每日服药频次</text>
			<view class="freq-grid">
				<view
					v-for="(f, fi) in freqOptions"
					:key="fi"
					class="freq-grid__item"
					:class="{ 'freq-grid__item--active': freq === f }"
					hover-class="card-hover"
					@click="freq = f"
				>
					<text class="freq-grid__text" :class="{ 'freq-grid__text--active': freq === f }">{{ f }}</text>
				</view>
			</view>

			<view class="field-row field-row--gap">
				<text class="field-row__label">具体服药时间点</text>
				<text class="field-row__required">*</text>
				<text class="field-row__note">准时播报与提醒</text>
			</view>
			<view
				v-for="(tp, ti) in timePoints"
				:key="ti"
				class="time-row"
			>
				<view class="time-row__icon">
					<image class="time-row__icon-img" src="/static/mine/med_icon_timepoint.png" mode="aspectFit"></image>
				</view>
				<view class="time-row__texts">
					<text class="time-row__label">{{ tp.label }}</text>
					<text class="time-row__time">{{ tp.time }}</text>
				</view>
				<picker mode="time" :value="tp.time" @change="onTimeChange($event, ti)">
					<view class="time-row__btn" hover-class="card-hover">
						<text class="time-row__btn-text">修改时间</text>
					</view>
				</picker>
			</view>
			<view class="add-time-row" hover-class="card-hover" @tap="addTimePoint">
				<image class="add-time-row__icon" src="/static/mine/med_icon_add_time.png" mode="aspectFit"></image>
				<text class="add-time-row__text">添加服药时间点</text>
			</view>
		</view>

		<!-- ============ 计划周期与说明卡 ============ -->
		<view class="form-card">
			<view class="card-head">
				<view class="card-head__icon">
					<image class="card-head__icon-img" src="/static/mine/med_icon_cycle.png" mode="aspectFit"></image>
				</view>
				<text class="card-head__title">计划周期与说明</text>
				<text class="card-head__optional">（选填）</text>
			</view>

			<view class="date-label-row">
				<text class="date-label-row__label">开始日期</text>
				<text class="date-label-row__label">结束日期</text>
			</view>
			<view class="date-row">
				<picker class="date-cell" mode="date" :value="startDate" @change="onStartDateChange">
					<view class="date-cell__inner">
						<text class="date-cell__text">{{ startDateText }}</text>
					</view>
				</picker>
				<picker class="date-cell" mode="selector" :range="endOptions" @change="onEndChange">
					<view class="date-cell__inner">
						<text class="date-cell__text">{{ endDate }}</text>
						<view class="caret caret--small"></view>
					</view>
				</picker>
			</view>

			<view class="field-row field-row--gap">
				<text class="field-row__label">服药注意事项及处方备注</text>
				<text class="field-row__note">支持长按语音</text>
			</view>
			<view class="note-box">
				<textarea
					class="note-box__textarea"
					v-model="note"
					placeholder="写明用药禁忌、是否需要饭后服用等提醒内容..."
					placeholder-class="note-box__placeholder"
					maxlength="100"
				/>
				<view class="note-box__voice-pill" hover-class="card-hover" @tap="toastSoon('语音录入')">
					<image class="note-box__voice-icon" src="/static/mine/icon_voice_input.png" mode="aspectFit"></image>
					<text class="note-box__voice-text">长按语音录入</text>
				</view>
			</view>
		</view>

		<!-- ============ 保存按钮 ============ -->
		<view class="save-btn" hover-class="card-hover" @tap="save">
			<view class="save-btn__ring">
				<image class="save-btn__icon" src="/static/mine/med_icon_save.png" mode="aspectFit"></image>
			</view>
			<text class="save-btn__text">保存计划</text>
		</view>
		<text class="save-note">保存后将加入{{ patientName }}的每日服药安排列表中</text>

	</view>
</template>

<script>
import { useStore } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') },
		patientName() { return (this.store.patient && this.store.patient.name) || '王建国' },
		patientAge() {
			const p = this.store.patient
			return (p && p.age) || 74
		},
		startDateText() {
			const parts = this.startDate.split('-')
			if (parts.length !== 3) return this.startDate
			return `${Number(parts[1])} / ${Number(parts[2])} / ${parts[0]}`
		}
	},
	data() {
		return {
			drugName: '',
			doseNum: '1',
			doseUnit: '片 (tablet)',
			doseUnits: ['片 (tablet)', '粒 (capsule)', '袋 (sachet)', '滴 (drops)', '毫升 (ml)'],
			quickDoses: ['1 片', '2 片', '5 mg', '10 mg'],
			freq: '每日 1 次',
			freqOptions: ['每日 1 次', '每日 2 次', '每日 3 次', '需要时服用'],
			timePoints: [
				{ label: '第 1 次 · 早晨', time: '08:00' }
			],
			startDate: '2026-10-24',
			endDate: '长期坚持服用',
			endOptions: ['长期坚持服用', '两周', '一个月', '三个月', '半年'],
			note: ''
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		onUnitChange(e) {
			this.doseUnit = this.doseUnits[Number(e.detail.value)]
		},
		applyQuick(q) {
			const m = q.match(/^(\d+)\s*(.+)$/)
			if (m) {
				this.doseNum = m[1]
				if (/片$/.test(m[2])) this.doseUnit = '片 (tablet)'
				else this.doseUnit = 'mg'
			}
		},
		periodName(time) {
			const h = Number(time.split(':')[0])
			if (h < 6) return '凌晨'
			if (h < 11) return '早晨'
			if (h < 15) return '中午'
			if (h < 18) return '下午'
			return '晚上'
		},
		onTimeChange(e, index) {
			const time = e.detail.value
			this.timePoints[index].time = time
			this.timePoints[index].label = '第 ' + (index + 1) + ' 次 · ' + this.periodName(time)
		},
		addTimePoint() {
			if (this.timePoints.length >= 4) {
				uni.showToast({ title: '最多添加 4 个时间点', icon: 'none' })
				return
			}
			const next = this.timePoints.length + 1
			const defaults = ['08:00', '12:30', '18:30', '21:00']
			const time = defaults[this.timePoints.length] || '12:00'
			this.timePoints.push({ label: '第 ' + next + ' 次 · ' + this.periodName(time), time })
		},
		onStartDateChange(e) {
			this.startDate = e.detail.value
		},
		onEndChange(e) {
			this.endDate = this.endOptions[Number(e.detail.value)]
		},
		save() {
			if (!this.drugName.trim()) {
				uni.showToast({ title: '请先填写药物名称', icon: 'none' })
				return
			}
			uni.showToast({ title: '已保存服药计划', icon: 'success' })
			setTimeout(() => { uni.navigateBack() }, 800)
		},
		toastSoon(name) {
			uni.showToast({ title: name + '（即将开放）', icon: 'none' })
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
	background-color: rgba(225, 234, 228, 1);
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 31rpx 38rpx;
	box-sizing: border-box;

	&__icon {
		width: 77rpx; height: 77rpx;
		background-color: rgba(202, 234, 215, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 31rpx; height: 38rpx; }
	&__texts {
		flex: 1; min-width: 0;
		margin-left: 23rpx;
	}
	&__title {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
	}
	&__sub {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		line-height: 46rpx;
		margin-top: 4rpx;
	}
}

/* ============ 表单卡 ============ */
.form-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
}

.card-head {
	display: flex; flex-direction: row; align-items: center;

	&__icon {
		width: 62rpx; height: 62rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 12rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 33rpx; height: 33rpx; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		margin-left: 15rpx;
	}
	&__optional {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: 8rpx;
	}
}

.field-row {
	display: flex; flex-direction: row; align-items: baseline;
	margin-top: 42rpx;

	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		flex-shrink: 0;
	}
	&__required {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 700;
		font-size: 35rpx; color: rgba(186, 26, 26, 1);
		margin-left: 4rpx;
		flex-shrink: 0;
	}
	&__note {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
}
.field-row--gap { margin-top: 54rpx; }
.field-label {
	display: block;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 35rpx; color: rgba(21, 29, 26, 1);
	margin-top: 42rpx;
}

/* ============ 药名输入 ============ */
.name-input {
	width: 596rpx; height: 108rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 15rpx 0 38rpx;
	box-sizing: border-box;

	&__input {
		flex: 1; min-width: 0;
		height: 108rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&__placeholder {
		color: rgba(114, 121, 116, 1);
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx;
	}
	&__voice {
		width: 77rpx; height: 77rpx;
		background-color: rgba(225, 234, 228, 1);
		border-radius: 15rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__voice-img { width: 25rpx; height: 35rpx; }
}

/* ============ 剂量行 ============ */
.dose-row {
	width: 596rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; justify-content: space-between;

	& .dose-cell {
		width: 287rpx; height: 108rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 15rpx;
		display: flex; flex-direction: row; align-items: center;
		padding: 0 31rpx;
		box-sizing: border-box;
	}
	&__num {
		flex: 1; min-width: 0;
		height: 108rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
	}
	&__unit {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		flex-shrink: 0;
	}
	&__inner {
		width: 100%; height: 108rpx;
		display: flex; flex-direction: row; align-items: center; justify-content: space-between;
	}
	&__value {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
}

.caret {
	width: 0; height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-top: 10rpx solid rgba(114, 121, 116, 1);
	margin-left: 12rpx;
	flex-shrink: 0;
}
.caret--small { margin-left: 0; }

/* ============ 常见剂量快捷 ============ */
.quick-row {
	display: flex; flex-direction: row; align-items: center;
	margin-top: 19rpx;

	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(114, 121, 116, 1);
		flex-shrink: 0;
	}
	&__chip {
		background-color: rgba(230, 240, 234, 1);
		border-radius: 15rpx;
		height: 62rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 19rpx;
		margin-left: 12rpx;
		box-sizing: border-box;
	}
	&__chip-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(21, 29, 26, 1);
		white-space: nowrap;
	}
}

/* ============ 频次网格 ============ */
.freq-grid {
	width: 596rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; flex-wrap: wrap;
	justify-content: space-between;

	&__item {
		width: 287rpx; height: 108rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 23rpx;
		margin-top: 19rpx;
		display: flex; align-items: center; justify-content: center;
		transition: background-color 0.2s;
	}
	&__item--active { background-color: rgba(90, 181, 165, 1); }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
	}
	&__text--active { color: #FFFFFF; }
}

/* ============ 时间点行 ============ */
.time-row {
	width: 596rpx; height: 154rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	margin-top: 19rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 23rpx;
	box-sizing: border-box;

	&__icon {
		width: 77rpx; height: 77rpx;
		background-color: rgba(246, 223, 192, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 35rpx; height: 33rpx; }
	&__texts {
		flex: 1; min-width: 0;
		margin-left: 23rpx;
	}
	&__label {
		display: block;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
	}
	&__time {
		display: block;
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
		margin-top: 2rpx;
	}
	&__btn {
		width: 177rpx; height: 73rpx;
		background-color: rgba(219, 229, 223, 1);
		border-radius: 15rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__btn-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(72, 101, 86, 1);
	}
}

.add-time-row {
	width: 596rpx; height: 108rpx;
	background-color: rgba(225, 234, 228, 1);
	border-radius: 23rpx;
	margin-top: 19rpx;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 38rpx; height: 38rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(72, 101, 86, 1);
		margin-left: 10rpx;
	}
}

/* ============ 周期日期 ============ */
.date-label-row {
	display: flex; flex-direction: row;
	margin-top: 42rpx;

	&__label {
		width: 287rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
	}
}
.date-row {
	width: 596rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; justify-content: space-between;

	& .date-cell {
		width: 287rpx; height: 108rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 15rpx;
	}
	&__inner {
		width: 100%; height: 108rpx;
		display: flex; flex-direction: row; align-items: center;
		padding: 0 31rpx;
		box-sizing: border-box;
		justify-content: space-between;
	}
	&__text {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
}

/* ============ 备注框 ============ */
.note-box {
	width: 596rpx; height: 289rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	margin-top: 12rpx;
	padding: 23rpx;
	box-sizing: border-box;
	position: relative;

	&__textarea {
		width: 550rpx; height: 150rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		line-height: 50rpx;
	}
	&__placeholder {
		color: rgba(114, 121, 116, 1);
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx;
	}
	&__voice-pill {
		position: absolute;
		right: 23rpx; bottom: 23rpx;
		height: 69rpx;
		background-color: rgba(219, 229, 223, 1);
		border-radius: 999rpx;
		display: flex; flex-direction: row; align-items: center;
		padding: 0 25rpx;
		box-sizing: border-box;
	}
	&__voice-icon { width: 21rpx; height: 29rpx; }
	&__voice-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		margin-left: 6rpx;
	}
}

/* ============ 保存按钮 ============ */
.save-btn {
	width: 673rpx; height: 123rpx;
	background-color: rgba(90, 181, 165, 1);
	border-radius: 23rpx;
	box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
	margin: 54rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__ring {
		width: 46rpx; height: 46rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
	}
	&__icon { width: 31rpx; height: 31rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: #FFFFFF;
		margin-left: 15rpx;
	}
}
.save-note {
	display: block;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 29rpx; color: rgba(66, 72, 68, 1);
	text-align: center;
	margin-top: 19rpx;
}
</style>
