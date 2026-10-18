<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">添加家人</text>
		</view>

		<!-- ============ 照片上传卡 ============ -->
		<view class="photo-card" hover-class="card-hover" @tap="choosePhoto">
			<view class="photo-card__ring">
				<image v-if="photoUrl" class="photo-card__photo" :src="photoUrl" mode="aspectFill"></image>
				<block v-else>
					<view class="photo-card__icon-wrap">
						<image class="photo-card__icon" src="/static/mine/icon_upload_photo.png" mode="aspectFit"></image>
					</view>
					<text class="photo-card__ring-text">传照片</text>
				</block>
			</view>
			<text class="photo-card__title">点击上传家人照片</text>
			<text class="photo-card__sub">支持拍照或直接从手机相册选取</text>
		</view>

		<!-- ============ 表单卡 ============ -->
		<view class="form-card">
			<view class="field-head">
				<view class="field-head__dot"></view>
				<text class="field-head__title">家人姓名</text>
			</view>
			<view class="name-input">
				<input
					class="name-input__input"
					v-model="name"
					placeholder="请输入家人姓名（如：芳芳）"
					placeholder-class="name-input__placeholder"
					maxlength="10"
				/>
				<image class="name-input__voice" src="/static/mine/icon_voice_input.png" mode="aspectFit"></image>
			</view>

			<view class="field-head field-head--gap">
				<view class="field-head__dot"></view>
				<text class="field-head__title">与王建国的关系</text>
				<text class="field-head__hint">请轻点选择一项</text>
			</view>
			<view class="rel-grid">
				<view
					v-for="(opt, oi) in relationOptions"
					:key="oi"
					class="rel-grid__item"
					:class="{
						'rel-grid__item--active': relation === opt,
						'rel-grid__item--tall': opt.length > 4
					}"
					hover-class="card-hover"
					@click="relation = opt"
				>
					<text class="rel-grid__text" :class="{ 'rel-grid__text--active': relation === opt }">{{ opt }}</text>
				</view>
			</view>

			<view class="field-head field-head--gap">
				<view class="field-head__dot"></view>
				<text class="field-head__title">年龄</text>
			</view>
			<view class="age-row">
				<view class="age-row__btn" hover-class="card-hover" @tap="changeAge(-1)">
					<view class="age-row__minus"></view>
				</view>
				<view class="age-row__value">
					<text class="age-row__num">{{ age }}</text>
					<text class="age-row__unit">岁</text>
				</view>
				<view class="age-row__btn" hover-class="card-hover" @tap="changeAge(1)">
					<view class="age-row__plus-h"></view>
					<view class="age-row__plus-v"></view>
				</view>
			</view>

			<view class="field-head field-head--gap">
				<text class="field-head__title">温情特征与常做的事</text>
				<text class="field-head__optional">(选填)</text>
			</view>
			<view class="trait-box">
				<textarea
					class="trait-box__textarea"
					v-model="trait"
					placeholder="写一两句这位家人常做的事，或长辈最熟悉的特征（例如：每周来看望、喜欢一起喝茶等）..."
					placeholder-class="trait-box__placeholder"
					maxlength="100"
				/>
				<view class="trait-box__voice-pill" hover-class="card-hover" @tap="toastSoon('语音输入')">
					<image class="trait-box__voice-icon" src="/static/mine/icon_hold_talk.png" mode="aspectFit"></image>
					<text class="trait-box__voice-text">按住说话输入</text>
				</view>
			</view>
		</view>

		<!-- ============ 保存按钮 ============ -->
		<view class="save-btn" hover-class="card-hover" @tap="save">
			<image class="save-btn__icon" src="/static/mine/icon_save_member.png" mode="aspectFit"></image>
			<text class="save-btn__text">保存家人信息</text>
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
			name: '',
			relation: '妻子',
			relationOptions: ['妻子', '女儿', '儿子', '女婿', '儿媳', '外孙/孙子', '外孙女/孙女', '兄弟姐妹', '亲友'],
			age: 68,
			trait: ''
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
		changeAge(delta) {
			const next = this.age + delta
			if (next < 0 || next > 120) return
			this.age = next
		},
		save() {
			if (!this.name.trim()) {
				uni.showToast({ title: '请先填写家人姓名', icon: 'none' })
				return
			}
			uni.showToast({ title: '已保存家人信息', icon: 'success' })
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

/* ============ 照片上传卡 ============ */
.photo-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	padding: 38rpx 0;
	box-sizing: border-box;
	display: flex; flex-direction: column; align-items: center;

	&__ring {
		width: 215rpx; height: 215rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 50%;
		box-shadow: inset 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		overflow: hidden;
		box-sizing: border-box;
	}
	&__photo { width: 215rpx; height: 215rpx; }
	&__icon-wrap {
		width: 85rpx; height: 85rpx;
		background-color: rgba(202, 234, 215, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
	}
	&__icon { width: 46rpx; height: 40rpx; }
	&__ring-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		margin-top: 8rpx;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		margin-top: 12rpx;
	}
	&__sub {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 27rpx; color: rgba(66, 72, 68, 1);
		margin-top: 4rpx;
	}
}

/* ============ 表单卡 ============ */
.form-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 38rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
}

.field-head {
	display: flex; flex-direction: row; align-items: center;

	&__dot {
		width: 15rpx; height: 15rpx;
		background-color: rgba(72, 101, 86, 1);
		border-radius: 50%;
		flex-shrink: 0;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: rgba(21, 29, 26, 1);
		margin-left: 12rpx;
	}
	&__hint {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-left: auto;
	}
	&__optional {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		margin-left: 12rpx;
	}
}
.field-head--gap { margin-top: 54rpx; }

.name-input {
	width: 596rpx; height: 108rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 44rpx 0 38rpx;
	box-sizing: border-box;

	&__input {
		flex: 1; min-width: 0;
		height: 108rpx;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
	}
	&__placeholder {
		color: rgba(114, 121, 116, 1);
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx;
	}
	&__voice { width: 35rpx; height: 35rpx; flex-shrink: 0; }
}

/* ============ 关系选择网格 ============ */
.rel-grid {
	width: 596rpx;
	margin-top: 19rpx;
	display: flex; flex-direction: row; flex-wrap: wrap;
	justify-content: space-between;

	&__item {
		width: 186rpx; height: 100rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 15rpx;
		margin-top: 19rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 8rpx;
		box-sizing: border-box;
		transition: background-color 0.2s;
	}
	/* 长选项（外孙女/孙女 等）行高加大 */
	&__item--tall { height: 115rpx; }
	&__item--active { background-color: rgba(89, 181, 165, 1); }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		text-align: center;
	}
	&__text--active { color: #FFFFFF; }
}

/* ============ 年龄步进器 ============ */
.age-row {
	width: 596rpx; height: 108rpx;
	margin-top: 12rpx;
	display: flex; flex-direction: row;

	&__btn {
		width: 108rpx; height: 108rpx;
		background-color: rgba(225, 234, 228, 1);
		border-radius: 15rpx;
		display: flex; align-items: center; justify-content: center;
		position: relative;
		flex-shrink: 0;
	}
	&__minus {
		width: 33rpx; height: 6rpx;
		background-color: rgba(66, 72, 68, 1);
		border-radius: 3rpx;
	}
	&__plus-h {
		width: 33rpx; height: 6rpx;
		background-color: rgba(66, 72, 68, 1);
		border-radius: 3rpx;
		position: absolute;
	}
	&__plus-v {
		width: 6rpx; height: 33rpx;
		background-color: rgba(66, 72, 68, 1);
		border-radius: 3rpx;
		position: absolute;
	}
	&__value {
		width: 335rpx; height: 108rpx;
		background-color: rgba(236, 246, 240, 1);
		border-radius: 15rpx;
		margin: 0 23rpx;
		display: flex; flex-direction: row; align-items: center; justify-content: center;
		box-sizing: border-box;
	}
	&__num {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
	}
	&__unit {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
		margin-left: 8rpx;
	}
}

/* ============ 特征输入 ============ */
.trait-box {
	width: 596rpx; height: 277rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 15rpx;
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
		height: 62rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 999rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
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
	background-color: rgba(89, 181, 165, 1);
	border-radius: 23rpx;
	box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
	margin: 62rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 46rpx; height: 46rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: #FFFFFF;
		margin-left: 15rpx;
	}
}
</style>
