<template>
	<view class="page">
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- ============ 顶部导航 ============ -->
		<view class="top-bar">
			<view class="top-bar__back" @tap="onBack">
				<image class="top-bar__back-icon" src="/static/memoir_new/back_arrow.png" mode="aspectFit"></image>
			</view>
			<view class="top-bar__center">
				<text class="top-bar__day">{{ day }}</text>
				<text class="top-bar__date">{{ dateLabel }}</text>
			</view>
			<view class="top-bar__right">
				<image class="top-bar__right-icon" src="/static/memoir_new/save_draft.png" mode="aspectFit" @tap="onSaveDraft"></image>
				<image class="top-bar__right-icon" src="/static/memoir_new/share_btn.png" mode="aspectFit" @tap="onShare"></image>
			</view>
		</view>

		<!-- ============ 主体区 ============ -->
		<scroll-view class="content" scroll-y :show-scrollbar="false">

			<!-- 上传图片/视频 -->
			<view class="upload-row">

				<!-- 没上传过：显示大占位框 -->
				<view v-if="!uploadedList.length" class="upload-box upload-box--placeholder" @tap="onUploadMedia">
					<image class="upload-box__icon" src="/static/memoir_new/upload_icon.png" mode="aspectFit"></image>
					<text class="upload-box__text">上传图片 / 视频</text>
				</view>

				<!-- 已上传：显示缩略图列表 + 继续上传小按钮 -->
				<template v-else>
					<view v-for="(item, i) in uploadedList" :key="'u-' + i" class="preview-item">
						<image v-if="item.type === 'image'" class="preview-item__img" :src="item.path" mode="aspectFill"></image>
						<view v-else class="preview-item__video">
							<image class="preview-item__video-play" src="/static/memoir_new/upload_icon.png" mode="aspectFit"></image>
							<text class="preview-item__video-label">视频</text>
						</view>
						<view class="preview-item__remove" @tap="removeMedia(i)">✕</view>
					</view>
					<!-- 继续上传按钮 -->
					<view class="upload-box upload-box--add" @tap="onUploadMedia">
						<image class="upload-box__icon" src="/static/memoir_new/upload_icon.png" mode="aspectFit"></image>
						<text class="upload-box__text">继续添加</text>
					</view>
				</template>
			</view>

			<!-- 标题 -->
			<view class="field-title">
				<input
					class="field-title__input"
					v-model="title"
					placeholder="标题"
					placeholder-class="field-title__ph"
					maxlength="30"
				/>
			</view>
			<view class="divider"></view>

			<!-- 标签 -->
			<view class="tags-row">
				<view
					v-for="(t, i) in tags"
					:key="i"
					class="tag"
				>
					<text class="tag__text">{{ t }}</text>
					<text class="tag__close" @tap="removeTag(i)">✕</text>
				</view>
				<view class="tag tag--add" @tap="onAddTag">
					<text class="tag__text">+ 标签</text>
				</view>
			</view>

			<view class="divider"></view>

			<!-- 正文 -->
			<view class="body-editor">
				<textarea
					class="body-editor__ta"
					v-model="body"
					placeholder="把珍贵的回忆，一点点留在时光里。
记录建国叔叔的人生故事，可以上传老照片、写下往事，或添加一段语音。无论是难忘的经历、熟悉的老地方，还是与家人相伴的温暖时光，都值得被好好珍藏。
不必追求完整，想起多少，就记录多少。"
					placeholder-class="body-editor__ph"
					auto-height
					:maxlength="-1"
				/>
			</view>

			<!-- 草稿状态 -->
			<view class="draft-bar">
				<view class="draft-bar__dot"></view>
				<text class="draft-bar__label">草稿准备就绪</text>
				<text class="draft-bar__count">{{ body.length }} 字</text>
			</view>

			<!-- 录音按钮 -->
			<view class="record-btn"
				@longpress="startRecord"
				@touchend="stopRecord"
				@touchcancel="cancelRecord"
			>
				<view class="record-btn__circle">
					<image class="record-btn__icon" src="/static/memoir_new/record_icon.png" mode="aspectFit"></image>
				</view>
				<text class="record-btn__text">{{ recording ? '松开上传录音…' : '长按录音，松开上传' }}</text>
			</view>

			<!-- 底部 booklet 信息 -->
			<view class="foot-info">
				<image class="foot-info__icon" src="/static/memoir_new/book_icon.png" mode="aspectFit"></image>
				<text class="foot-info__text">专属回忆册 · 为父亲王建国记录</text>
			</view>

		</scroll-view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return {
			statusBarHeight: 20,
			title: '',
			body: '',
			tags: ['合影', '老伴'],
			uploadedList: [], // { type: 'image'|'video', path: '' }
			recording: false
		}
	},
	computed: {
		store() { return useStore() },
		day() {
			const d = new Date()
			return String(d.getDate())
		},
		dateLabel() {
			const d = new Date()
			return `${d.getFullYear()}年${d.getMonth() + 1}月`
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	},
	methods: {
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/memory/memoir' }) })
		},

		onSaveDraft() {
			uni.showToast({ title: '草稿已保存', icon: 'none' })
		},
		onShare() {
			uni.showToast({ title: '分享功能开发中', icon: 'none' })
		},

		/* ============ 上传：图片 / 视频 ============ */
		onUploadMedia() {
			uni.showActionSheet({
				itemList: ['上传图片', '上传视频'],
				success: (res) => {
					if (res.tapIndex === 0) this.chooseImage()
					else if (res.tapIndex === 1) this.chooseVideo()
				}
			})
		},
		chooseImage() {
			uni.chooseImage({
				count: 9 - this.uploadedList.length,
				success: (res) => {
					res.tempFilePaths.forEach(p => {
						this.uploadedList.push({ type: 'image', path: p })
					})
				}
			})
		},
		chooseVideo() {
			uni.chooseVideo({
				sourceType: ['album', 'camera'],
				maxDuration: 60,
				success: (res) => {
					this.uploadedList.push({ type: 'video', path: res.tempFilePath })
				}
			})
		},
		removeMedia(i) {
			this.uploadedList.splice(i, 1)
		},

		/* ============ 标签 ============ */
		onAddTag() {
			uni.showModal({
				title: '添加标签',
				editable: true,
				placeholderText: '输入标签',
				success: (res) => {
					if (res.confirm && res.content && res.content.trim()) {
						const v = res.content.trim()
						if (this.tags.indexOf(v) < 0) this.tags.push(v)
					}
				}
			})
		},
		removeTag(i) {
			this.tags.splice(i, 1)
		},

		/* ============ 录音 ============ */
		startRecord() {
			this.recording = true
			const mgr = uni.getRecorderManager()
			mgr.start({ duration: 60000, format: 'mp3' })
		},
		stopRecord() {
			if (!this.recording) return
			this.recording = false
			const mgr = uni.getRecorderManager()
			mgr.stop()
			mgr.once('stop', (res) => {
				uni.showToast({ title: '录音已添加', icon: 'none' })
			})
		},
		cancelRecord() {
			this.recording = false
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: rgba(245, 249, 246, 1); /* #F5F9F6 */
	width: 750rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

/* ============ 顶部导航 ============ */
.top-bar {
	position: relative;
	width: 750rpx;
	height: 108rpx;
	display: flex;
	align-items: center;
	background-color: rgba(245, 249, 246, 1);

	&__back {
		width: 78rpx;
		height: 108rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__back-icon {
		width: 23rpx;
		height: 38rpx;
		transform: rotate(180deg);
	}

	&__center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 108rpx;
	}
	&__day {
		font-family: "Noto Serif SC", -apple-system, "PingFang SC", serif;
		font-weight: 700;
		font-size: 50rpx;
		line-height: 75rpx;
		letter-spacing: -1rpx;
		color: rgba(21, 29, 26, 1);
	}
	&__date {
		font-family: "Noto Serif SC", -apple-system, "PingFang SC", serif;
		font-weight: 600;
		font-size: 29rpx;
		line-height: 43rpx;
		color: rgba(114, 121, 116, 1);
		margin-left: 12rpx;
	}

	&__right {
		display: flex;
		align-items: center;
		padding-right: 40rpx;
		gap: 20rpx;
	}
	&__right-icon {
		width: 48rpx;
		height: 48rpx;
		margin-left: 12rpx;
	}
}

/* ============ 主体 ============ */
.content {
	flex: 1;
	width: 750rpx;
	box-sizing: border-box;
}

/* ============ 上传区 ============ */
.upload-row {
	padding: 37rpx 38rpx 0;
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}
.upload-box {
	background-color: #FFFFFF;
	border-radius: 31rpx;
	border: 1px solid rgba(194, 200, 194, 0.8);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;

	/* 大占位框：未上传时 */
	&--placeholder {
		width: 310rpx;
		height: 200rpx;
		border-style: dashed;
		border-width: 2rpx;
		border-color: rgba(194, 200, 194, 0.9);
		background-color: rgba(255, 255, 255, 0.6);
	}

	/* 小加按钮：已上传后继续加 */
	&--add {
		width: 160rpx;
		height: 160rpx;
		border-style: dashed;
		border-width: 2rpx;
		border-color: rgba(143, 174, 157, 1);
		background-color: rgba(245, 250, 247, 0.5);
	}

	&__icon {
		width: 46rpx;
		height: 40rpx;
	}
	&__text {
		font-family: "Noto Serif SC", serif;
		font-size: 25rpx;
		font-weight: 500;
		letter-spacing: 1rpx;
		color: rgba(114, 121, 116, 0.8);
		line-height: 38rpx;
		margin-top: 6rpx;
		text-align: center;
		white-space: nowrap; /* 关键：强制单行不换行 */
	}
}

.preview-item {
	position: relative;
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
	overflow: hidden;
	border: 1px solid rgba(232, 230, 223, 0.8);
	background-color: #FFFFFF;

	&__img {
		width: 100%;
		height: 100%;
	}
	&__video {
		width: 100%;
		height: 100%;
		background-color: rgba(30, 41, 59, 0.75);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	&__video-play {
		width: 48rpx;
		height: 48rpx;
		opacity: 0.85;
	}
	&__video-label {
		font-family: "PingFang SC", sans-serif;
		font-size: 22rpx;
		color: #FFFFFF;
		margin-top: 6rpx;
	}
	&__remove {
		position: absolute;
		right: 6rpx;
		top: 6rpx;
		width: 32rpx;
		height: 32rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 32rpx;
		text-align: center;
		border-radius: 50%;
	}
}

/* ============ 标题 ============ */
.field-title {
	padding: 54rpx 38rpx 0;
	&__input {
		width: 100%;
		height: 60rpx;
		font-family: "Noto Serif SC", serif;
		font-weight: 700;
		font-size: 42rpx;
		letter-spacing: 1rpx;
		line-height: 60rpx;
		color: rgba(21, 29, 26, 1);
		text-align: center;
	}
	&__ph {
		color: rgba(114, 121, 116, 0.4);
		font-weight: 700;
	}
}

.divider {
	width: 673rpx;
	height: 0;
	border-top: 1px solid rgba(232, 230, 223, 0.8);
	margin: 10rpx 38rpx 0;
}

/* ============ 标签 ============ */
.tags-row {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 31rpx 38rpx 0;
	gap: 23rpx;
}
.tag {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 19229rpx;
	height: 50rpx;
	border: 1px solid rgba(226, 232, 240, 0.9);
	padding: 0 25rpx;
	box-sizing: border-box;

	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 23rpx;
		line-height: 31rpx;
		color: rgba(71, 85, 105, 1);
	}
	&__close {
		font-family: "PingFang SC", sans-serif;
		font-weight: 400;
		font-size: 23rpx;
		line-height: 31rpx;
		color: rgba(148, 163, 184, 1);
		margin-left: 12rpx;
	}

	&--add {
		background-color: rgba(245, 250, 247, 1);
		border-color: rgba(143, 174, 157, 1);
		padding-right: 21rpx;

		.tag__text {
			color: rgba(73, 136, 105, 1);
		}
	}
}

/* ============ 正文 ============ */
.body-editor {
	padding: 29rpx 38rpx 0;
	&__ta {
		width: 673rpx;
		min-height: 300rpx;
		font-family: "Noto Serif SC", serif;
		font-weight: 500;
		font-size: 29rpx;
		line-height: 50rpx;
		color: rgba(36, 33, 29, 1);
		text-align: left;
	}
	&__ph {
		color: rgba(114, 121, 116, 0.7);
		font-weight: 500;
	}
}

/* ============ 草稿状态 ============ */
.draft-bar {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 38rpx;
	padding: 16rpx 38rpx 0;
	&__dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background-color: rgba(114, 121, 116, 0.4);
		margin-right: 12rpx;
	}
	&__label {
		font-family: "Noto Serif SC", serif;
		font-weight: 500;
		font-size: 25rpx;
		line-height: 38rpx;
		color: rgba(114, 121, 116, 0.6);
		flex: 1;
	}
	&__count {
		font-family: "Plus Jakarta Sans", "Noto Serif SC", sans-serif;
		font-size: 25rpx;
		line-height: 38rpx;
		color: rgba(114, 121, 116, 0.6);
	}
}

/* ============ 录音按钮 ============ */
.record-btn {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: rgba(231, 244, 237, 1);
	border: 1px solid rgba(203, 229, 215, 1);
	border-radius: 31rpx;
	width: 673rpx;
	height: 140rpx;
	margin: 46rpx 38rpx 0;
	padding: 0 33rpx;
	box-sizing: border-box;

	&__circle {
		width: 69rpx;
		height: 69rpx;
		background-color: rgba(62, 142, 104, 1);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__icon {
		width: 31rpx;
		height: 31rpx;
	}
	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 25rpx;
		line-height: 38rpx;
		color: rgba(30, 41, 59, 1);
		margin-left: 23rpx;
		flex: 1;
	}
}

/* ============ 底部 booklet ============ */
.foot-info {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0 40rpx;

	&__icon {
		width: 25rpx;
		height: 25rpx;
		margin-right: 12rpx;
	}
	&__text {
		font-family: "Noto Serif SC", serif;
		font-weight: 500;
		font-size: 25rpx;
		line-height: 38rpx;
		color: rgba(114, 121, 116, 0.7);
	}
}
</style>
