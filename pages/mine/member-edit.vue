<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">编辑资料</text>
		</view>

		<!-- ============ 提示条 ============ -->
		<view class="hint-bar">
			<image class="hint-bar__icon" src="/static/mine/icon_edit_file.png" mode="aspectFit"></image>
			<text class="hint-bar__text">正在编辑成员档案，修改将同步至小忆陪伴对话</text>
		</view>

		<!-- ============ 头像更换 ============ -->
		<view class="avatar-block">
			<view class="avatar-block__ring" @tap="choosePhoto">
				<image v-if="photoUrl" class="avatar-block__photo" :src="photoUrl" mode="aspectFill"></image>
				<image v-else class="avatar-block__photo" src="/static/mine/member_fangfang.png" mode="aspectFill"></image>
				<view class="avatar-block__camera">
					<image class="avatar-block__camera-icon" src="/static/mine/icon_change_photo.png" mode="aspectFit"></image>
				</view>
			</view>
			<text class="avatar-block__text">点击更换照片</text>
		</view>

		<!-- ============ 表单卡 ============ -->
		<view class="form-card">
			<view class="field-label">
				<text class="field-label__text">姓名</text>
				<text class="field-label__required">*</text>
			</view>
			<view class="text-input">
				<input class="text-input__input" v-model="name" maxlength="10" />
				<text class="text-input__edit">✎</text>
			</view>

			<view class="field-label field-label--gap">
				<text class="field-label__text">与王建国的关系</text>
				<text class="field-label__required">*</text>
				<text class="field-label__hint">请选择称呼</text>
			</view>
			<view class="rel-grid">
				<view
					v-for="(opt, oi) in relationOptions"
					:key="oi"
					class="rel-grid__item"
					:class="{ 'rel-grid__item--active': relation === opt }"
					hover-class="card-hover"
					@click="relation = opt"
				>
					<text class="rel-grid__text" :class="{ 'rel-grid__text--active': relation === opt }">{{ opt }}</text>
				</view>
			</view>

			<text class="field-label__plain">年龄</text>
			<view class="text-input">
				<input class="text-input__input" v-model="age" type="number" maxlength="3" />
				<text class="text-input__unit">岁</text>
			</view>

			<view class="field-label field-label--gap">
				<text class="field-label__text">专属陪伴备忘</text>
				<text class="field-label__hint2">帮助小忆更懂{{ name || '芳芳' }}</text>
			</view>
			<view class="memo-box">
				<textarea class="memo-box__textarea" v-model="memo" maxlength="200" />
			</view>
		</view>

		<!-- ============ 保存按钮 ============ -->
		<view class="save-btn" hover-class="card-hover" @tap="save">
			<image class="save-btn__icon" src="/static/mine/icon_save_changes.png" mode="aspectFit"></image>
			<text class="save-btn__text">保存修改</text>
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
			photoUrl: '',
			name: '芳芳',
			relation: '女儿',
			relationOptions: ['女儿', '老伴', '儿子', '孙女', '孙子', '女婿', '儿媳', '其他'],
			age: '45',
			memo: '王建国的大女儿，也是主要负责爸爸日常生活与记忆陪伴的协助人。每周六都会回家陪爸爸包饺子、听广播，是爸爸最信赖和熟悉的小棉袄。'
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
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 23rpx 62rpx 23rpx 38rpx;
	box-sizing: border-box;

	&__icon { width: 40rpx; height: 35rpx; flex-shrink: 0; }
	&__text {
		flex: 1; min-width: 0;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(21, 29, 26, 1);
		line-height: 38rpx;
		margin-left: 12rpx;
	}
}

/* ============ 头像更换 ============ */
.avatar-block {
	display: flex; flex-direction: column; align-items: center;
	margin-top: 50rpx;

	&__ring {
		width: 215rpx; height: 215rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
		position: relative;
	}
	&__photo {
		width: 215rpx; height: 215rpx;
		border-radius: 50%;
		display: block;
	}
	&__camera {
		width: 77rpx; height: 77rpx;
		background-color: rgba(90, 181, 165, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		position: absolute;
		right: 0; bottom: 0;
	}
	&__camera-icon { width: 33rpx; height: 29rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		margin-top: 12rpx;
	}
}

/* ============ 表单卡 ============ */
.form-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 54rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
}

.field-label {
	display: flex; flex-direction: row; align-items: center;

	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
	}
	&__required {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 700;
		font-size: 31rpx; color: rgba(138, 80, 32, 1);
		margin-left: 8rpx;
	}
	&__hint {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
	&__hint2 {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
}
.field-label--gap { margin-top: 38rpx; }
.field-label__plain {
	display: block;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 31rpx; color: rgba(21, 29, 26, 1);
	margin-top: 38rpx;
}

.text-input {
	width: 596rpx; height: 115rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	box-shadow: inset 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
	margin-top: 12rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 44rpx 0 31rpx;
	box-sizing: border-box;

	&__input {
		flex: 1; min-width: 0;
		height: 115rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
	}
	&__edit {
		font-size: 35rpx; color: rgba(168, 162, 158, 1);
		flex-shrink: 0;
	}
	&__unit {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
		flex-shrink: 0;
	}
}

/* ============ 关系选择网格 ============ */
.rel-grid {
	width: 596rpx;
	margin-top: 19rpx;
	display: flex; flex-direction: row; flex-wrap: wrap;
	justify-content: space-between;

	&__item {
		width: 135rpx; height: 100rpx;
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

/* ============ 备忘输入 ============ */
.memo-box {
	width: 596rpx; height: 287rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	box-shadow: inset 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
	margin-top: 12rpx;
	padding: 31rpx;
	box-sizing: border-box;

	&__textarea {
		width: 534rpx; height: 225rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		line-height: 56rpx;
	}
}

/* ============ 保存按钮 ============ */
.save-btn {
	width: 673rpx; height: 123rpx;
	background-color: rgba(90, 181, 165, 1);
	border-radius: 999rpx;
	margin: 65rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 38rpx; height: 38rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: #FFFFFF;
		margin-left: 15rpx;
	}
}
</style>
