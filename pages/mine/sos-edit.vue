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

		<!-- ============ 即刻同步守护提示条 ============ -->
		<view class="sync-bar">
			<view class="sync-bar__circle">
				<image class="sync-bar__icon" src="/static/mine/icon_edit_file.png" mode="aspectFit"></image>
			</view>
			<view class="sync-bar__texts">
				<text class="sync-bar__title">即刻同步守护</text>
				<text class="sync-bar__desc">修改紧急联系人信息后，将即刻同步更新至首页呼叫入口。</text>
			</view>
		</view>

		<!-- ============ 头像更换 ============ -->
		<view class="avatar-block">
			<view class="avatar-block__ring" @tap="choosePhoto">
				<image class="avatar-block__photo" :src="photoUrl || defaultAvatar" mode="aspectFill"></image>
				<view class="avatar-block__camera">
					<image class="avatar-block__camera-icon" src="/static/mine/icon_change_photo.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="avatar-block__row">
				<text class="avatar-block__text">轻触更换照片</text>
				<image class="avatar-block__row-icon" src="/static/mine/icon_change_photo.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ============ 姓名卡 ============ -->
		<view class="form-card">
			<view class="field-label">
				<text class="field-label__text">联系人姓名</text>
				<text class="field-label__required">*</text>
			</view>
			<view class="name-input">
				<input class="name-input__input" v-model="name" maxlength="10" placeholder="请输入联系人姓名" placeholder-style="color:rgba(168,162,158,1)" />
				<text class="name-input__edit">✎</text>
				<view class="name-input__circle">
					<image class="name-input__circle-icon" src="/static/mine/sos_icon_target.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<!-- ============ 关系卡 ============ -->
		<view class="form-card form-card--gap">
			<view class="field-label">
				<text class="field-label__text">与老人的关系</text>
				<text class="field-label__required">*</text>
				<text class="field-label__hint">单选直接生效</text>
			</view>
			<view class="rel-grid">
				<view
					v-for="(opt, oi) in relationOptions"
					:key="oi"
					class="rel-grid__item"
					:class="{ 'rel-grid__item--active': relation === opt }"
					hover-class="card-hover"
					@tap="relation = opt"
				>
					<view v-if="relation === opt" class="rel-grid__check">
						<text class="rel-grid__check-mark">✓</text>
					</view>
					<view v-else class="rel-grid__radio"></view>
					<text class="rel-grid__text" :class="{ 'rel-grid__text--active': relation === opt }">{{ opt }}</text>
				</view>
			</view>
		</view>

		<!-- ============ 联系电话卡 ============ -->
		<view class="form-card form-card--gap2">
			<view class="field-label">
				<text class="field-label__text">联系电话</text>
				<text class="field-label__required">*</text>
				<view class="field-label__right">
					<image class="field-label__right-icon" src="/static/mine/sos_icon_call.png" mode="aspectFit"></image>
					<text class="field-label__right-text">一键直拨号码</text>
				</view>
			</view>
			<view class="phone-input">
				<image class="phone-input__icon" src="/static/mine/sos_icon_call.png" mode="aspectFit"></image>
				<input class="phone-input__input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号码" placeholder-style="color:rgba(168,162,158,1)" />
				<text class="phone-input__edit">✎</text>
			</view>
			<text class="phone-tip">老人遇到困惑时，点击首页“呼叫家人”将直接拨通该号码。</text>
		</view>

		<!-- ============ 备注卡 ============ -->
		<view class="form-card form-card--gap2">
			<view class="field-label">
				<text class="field-label__text">备注说明</text>
				<text class="field-label__optional">(选填)</text>
				<text class="field-label__hint">温情备忘</text>
			</view>
			<view class="memo-box">
				<textarea class="memo-box__textarea" v-model="memo" maxlength="200" placeholder="填写与这位家人的温情备注" placeholder-style="color:rgba(168,162,158,1)" />
			</view>
		</view>

		<!-- ============ 保存区 ============ -->
		<view class="save-btn" hover-class="card-hover" @tap="save">
			<image class="save-btn__icon" src="/static/mine/icon_save_changes.png" mode="aspectFit"></image>
			<text class="save-btn__text">保存修改</text>
		</view>
		<text class="save-note">点击保存后将更新当前紧急联系人，并同步用于首页展示</text>
		<text class="giveup" hover-class="card-hover" @tap="goBack">放弃修改并返回</text>

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
			photoUrl: '',
			defaultAvatar: '/static/mine/member_fangfang.png',
			name: '芳芳',
			relation: '女儿',
			relationOptions: ['女儿', '配偶 / 老伴', '儿子', '其他亲属'],
			phone: '13988882156',
			memo: '女儿芳芳常驻同城，平时负责照顾爸爸日常生活，遇紧急情况请优先拨打。'
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		choosePhoto() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					if (res.tempFilePaths && res.tempFilePaths.length) {
						this.photoUrl = res.tempFilePaths[0]
					}
				}
			})
		},
		save() {
			if (!this.name.trim()) {
				uni.showToast({ title: '姓名不能为空', icon: 'none' })
				return
			}
			if (!/^1\d{10}$/.test(this.phone.trim())) {
				uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
				return
			}
			uni.showToast({ title: '已保存修改', icon: 'success' })
			setTimeout(() => { uni.navigateBack() }, 800)
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

/* ============ 即刻同步守护提示条 ============ */
.sync-bar {
	width: 673rpx; min-height: 223rpx;
	background-color: rgba(246, 223, 192, 1);
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 38rpx 42rpx 38rpx 38rpx;
	box-sizing: border-box;

	&__circle {
		width: 77rpx; height: 77rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon { width: 40rpx; height: 35rpx; }
	&__texts {
		flex: 1; min-width: 0;
		display: flex; flex-direction: column;
		margin-left: 23rpx;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(114, 98, 73, 1);
	}
	&__desc {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		line-height: 50rpx;
		margin-top: 4rpx;
	}
}

/* ============ 头像更换 ============ */
.avatar-block {
	display: flex; flex-direction: column; align-items: center;
	margin-top: 6rpx;

	&__ring {
		width: 215rpx; height: 215rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 50%;
		box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
		position: relative;
		display: flex; align-items: center; justify-content: center;
	}
	&__photo {
		width: 200rpx; height: 200rpx;
		border-radius: 50%;
	}
	&__camera {
		width: 77rpx; height: 77rpx;
		background-color: rgba(90, 181, 165, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		position: absolute;
		right: 0; bottom: 0;
	}
	&__camera-icon { width: 31rpx; height: 29rpx; }
	&__row {
		display: flex; flex-direction: row; align-items: center;
		margin-top: 27rpx;
	}
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(72, 101, 86, 1);
	}
	&__row-icon {
		width: 23rpx; height: 27rpx;
		margin-left: 15rpx;
	}
}

/* ============ 表单卡 ============ */
.form-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 42rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
}
.form-card--gap { margin-top: 54rpx; }
.form-card--gap2 { margin-top: 54rpx; }

.field-label {
	display: flex; flex-direction: row; align-items: center;

	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
	}
	&__required {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 700;
		font-size: 35rpx; color: rgba(138, 80, 32, 1);
		margin-left: 8rpx;
	}
	&__optional {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: 15rpx;
	}
	&__hint {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
	&__right {
		margin-left: auto;
		display: flex; flex-direction: row; align-items: center;
	}
	&__right-icon {
		width: 21rpx; height: 25rpx;
		flex-shrink: 0;
	}
	&__right-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		margin-left: 8rpx;
		white-space: nowrap;
	}
}

/* ============ 姓名输入 ============ */
.name-input {
	width: 596rpx; height: 108rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 8rpx 0 38rpx;
	box-sizing: border-box;

	&__input {
		flex: 1; min-width: 0;
		height: 108rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
	}
	&__edit {
		font-size: 35rpx; color: rgba(168, 162, 158, 1);
		flex-shrink: 0;
		margin-right: 25rpx;
	}
	&__circle {
		width: 77rpx; height: 77rpx;
		background-color: rgba(202, 234, 215, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__circle-icon { width: 23rpx; height: 31rpx; }
}

/* ============ 关系选择网格 ============ */
.rel-grid {
	width: 596rpx;
	margin-top: 23rpx;
	display: flex; flex-direction: row; flex-wrap: wrap;
	justify-content: space-between;

	&__item {
		width: 285rpx; height: 108rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 23rpx;
		margin-top: 23rpx;
		display: flex; flex-direction: row; align-items: center; justify-content: center;
		transition: background-color 0.2s;
		box-sizing: border-box;
		padding: 0 12rpx;
	}
	&__item--active {
		background-color: rgba(90, 181, 165, 1);
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	&__check {
		width: 38rpx; height: 38rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__check-mark {
		font-size: 35rpx; font-weight: 700;
		color: #FFFFFF;
		line-height: 38rpx;
	}
	&__radio {
		width: 38rpx; height: 38rpx;
		border: 4rpx solid rgba(114, 121, 116, 0.4);
		border-radius: 50%;
		box-sizing: border-box;
		flex-shrink: 0;
	}
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		margin-left: 12rpx;
		white-space: nowrap;
	}
	&__text--active { color: #FFFFFF; }
}

/* ============ 联系电话 ============ */
.phone-input {
	width: 596rpx; height: 123rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 38rpx;
	box-sizing: border-box;

	&__icon {
		width: 35rpx; height: 35rpx;
		flex-shrink: 0;
	}
	&__input {
		flex: 1; min-width: 0;
		height: 123rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; letter-spacing: 1rpx;
		color: rgba(21, 29, 26, 1);
		margin-left: 23rpx;
	}
	&__edit {
		font-size: 35rpx; color: rgba(168, 162, 158, 1);
		flex-shrink: 0;
	}
}
.phone-tip {
	display: block;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 29rpx; color: rgba(66, 72, 68, 1);
	line-height: 46rpx;
	margin: 12rpx 0 0 8rpx;
}

/* ============ 备注输入 ============ */
.memo-box {
	width: 596rpx; height: 246rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin-top: 12rpx;
	padding: 31rpx 38rpx;
	box-sizing: border-box;

	&__textarea {
		width: 520rpx; height: 184rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		line-height: 56rpx;
	}
}

/* ============ 保存区 ============ */
.save-btn {
	width: 673rpx; height: 108rpx;
	background-color: rgba(90, 181, 165, 1);
	border-radius: 23rpx;
	box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
	margin: 65rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 38rpx; height: 38rpx; flex-shrink: 0; }
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
	line-height: 38rpx;
	text-align: center;
	margin: 23rpx auto 0;
}
.giveup {
	display: block;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 35rpx; color: rgba(114, 121, 116, 1);
	text-align: center;
	margin: 46rpx auto 0;
}
</style>
