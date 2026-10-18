<template>
	<view class="page">

		<!-- 书页左侧装订阴影（盖在最上层但不挡点击） -->
		<view class="page-spine"></view>

		<!-- 状态栏 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 顶栏：圆点 + 忆伴·实体回忆录 -->
		<view class="top-bar">
			<view class="top-bar__dot"></view>
			<text class="top-bar__text">忆伴 · 实体回忆录</text>
		</view>

		<!-- 返回行 -->
		<view class="back-row" @tap="onBack">
			<image class="back-row__icon" src="/static/memoir_index/back_arrow.png" mode="aspectFit"></image>
			<text class="back-row__text">返回</text>
		</view>

		<!-- 章节大标题 -->
		<text class="page-title">{{ title }}</text>

		<!-- 相框卡片：照片 + 四角相角 + 日期说明 -->
		<view class="photo-card">
			<view class="photo-card__frame">
				<image class="photo-card__img" :src="photo" mode="aspectFill"></image>
				<!-- 四角相角（棕褐色 L 形） -->
				<view class="corner corner--tl"></view>
				<view class="corner corner--tr"></view>
				<view class="corner corner--bl"></view>
				<view class="corner corner--br"></view>
			</view>
			<text class="photo-card__caption">{{ caption }}</text>
		</view>

		<!-- 正文（宋体）+ 右侧滚动条装饰 -->
		<view class="body-block">
			<text class="body-block__text">{{ body }}</text>
			<view class="body-block__scrollbar"></view>
		</view>

		<!-- 女儿语音条 -->
		<view class="voice-bar" hover-class="bar-hover" @tap="onPlayVoice">
			<view class="voice-bar__play">
				<image class="voice-bar__icon" src="/static/memoir_detail/voice_icon.png" mode="aspectFit"></image>
			</view>
			<text class="voice-bar__label">播放女儿留给我的语音</text>
			<view class="voice-bar__dur">
				<text class="voice-bar__dur-text">0:28</text>
			</view>
		</view>

		<!-- 朗读这一页（青绿大按钮） -->
		<view class="read-btn" hover-class="read-btn--hover" @tap="onReadAloud">
			<image class="read-btn__icon" src="/static/memoir_detail/read_icon.png" mode="aspectFit"></image>
			<text class="read-btn__label">朗读这一页</text>
			<view class="read-btn__dur">
				<text class="read-btn__dur-text">0:45</text>
			</view>
		</view>

		<!-- 底部安全区 -->
		<view class="safe-bottom"></view>

	</view>
</template>

<script>
import { useStore } from '../../store/index.js'

export default {
	data() {
		return {
			statusBarHeight: 20,
			title: '我的个人简介',
			categoryId: 'c7',
			photo: '/static/memoir_detail/photo_wang.png',
			caption: '二〇二三年深秋 · 拍摄于家中',
			body: ''
		}
	},
	computed: {
		store() { return useStore() }
	},
	onLoad(options) {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}

		this.categoryId = options.categoryId || 'c7'
		this.title = decodeURIComponent(options.name || '我的个人简介')
		this.resolveContent()
	},
	methods: {
		/** 依据章节分类解析：照片 / 日期说明 / 正文 */
		resolveContent() {
			const memoir = this.store.memoir || {}
			const memories = memoir.memories || []
			const media = memoir.media || []

			const mine = memories.filter(m => m.categoryId === this.categoryId)
			const memory = mine[0] || null

			// 照片：优先用回忆自带封面 image（与「回忆管理」列表同源），其次媒体数组，最后默认素材
			if (memory) {
				if (memory.image) {
					this.photo = memory.image
				} else {
					const md = media.find(x => x.memoryId === memory.id && x.type === 'IMAGE')
					if (md && md.url) this.photo = md.url
					else if (this.categoryId !== 'c7') this.photo = '/static/memoir_detail/photo_family.png'
				}
				this.caption = (memory.date || '') + ' · 珍藏影像'
			}

			// 正文：优先回忆描述；c7 无回忆时用患者档案拼装（贴近设计稿文案）；其余空章节给引导文案
			if (memory && memory.desc) {
				this.body = memory.desc
			} else if (this.categoryId === 'c7') {
				const p = this.store.patient || {}
				const name = p.name || '王建国'
				const age = p.age || 74
				const identity = p.identity || '退休老工程师'
				const intro = p.intro || ''
				this.body = '　　我是' + name + '，今年 ' + age + ' 岁，退休前是一名受人尊敬的' + identity + '。' +
					'我最喜欢在清晨泡一壶温热的茉莉花茶，看晨光照亮阳台的花草；' +
					(intro ? intro : '老伴秀兰常陪我在院子里晒太阳，女儿芳芳每周都回来看我。')
			} else {
				this.body = '　　这一章还没有回忆内容。请家属在「添加回忆」里，帮我写下这一章的故事。'
			}
		},
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/memory/memoir' }) })
		},
		onPlayVoice() {
			uni.showToast({ title: '语音播放 · 演示模式', icon: 'none' })
		},
		onReadAloud() {
			uni.showToast({ title: '朗读 · 演示模式', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
/* ============ 页面：书页米白 + 左侧装订阴影 ============ */
.page {
	position: relative;
	width: 750rpx;
	min-height: 100vh;
	background-color: #FFFEF9;
	display: flex;
	flex-direction: column;
	align-items: center;   /* 所有块水平居中，窄屏/宽屏都自适应 */
	box-sizing: border-box;
}
/* 左侧书页装订阴影（蓝湖 inset 18px → 34rpx），不挡点击 */
.page-spine {
	position: fixed;
	left: 0; top: 0;
	width: 750rpx; height: 100vh;
	box-shadow: inset 34rpx 0 48rpx -23rpx rgba(90, 72, 54, 0.16);
	pointer-events: none;   /* 关键：纯视觉层，点击穿透 */
	z-index: 9;
}

.status-bar { width: 750rpx; flex-shrink: 0; }

/* ============ 顶栏（蓝湖 block_2：33px → 63rpx） ============ */
.top-bar {
	width: 750rpx;
	height: 63rpx;
	border-bottom: 1rpx solid rgba(233, 227, 211, 1);
	display: flex; flex-direction: row; align-items: center;
	flex-shrink: 0;

	&__dot {
		width: 12rpx; height: 12rpx;
		background-color: #B89F7C; border-radius: 50%;
		margin-left: 62rpx;
	}
	&__text {
		font-family: "Noto Serif SC", serif; font-weight: 400;
		font-size: 25rpx; letter-spacing: 1.2rpx;
		color: rgba(117, 110, 99, 1); margin-left: 15rpx;
	}
}

/* ============ 返回行（蓝湖 block_3） ============ */
.back-row {
	display: flex; flex-direction: row; align-items: center;
	margin: 42rpx 0 0 50rpx;
	align-self: flex-start;
	&__icon { width: 30rpx; height: 30rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1); margin-left: 12rpx;
	}
}

/* ============ 章节大标题（蓝湖 text_4：26px → 50rpx） ============ */
.page-title {
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 50rpx; letter-spacing: -1rpx;
	color: rgba(44, 39, 35, 1);
	line-height: 60rpx;
	margin-top: 20rpx;
	max-width: 654rpx;
	text-align: center;
}

/* ============ 相框卡片（蓝湖 block_4：291×252 → 560×485，内容流式） ============ */
.photo-card {
	width: 560rpx;
	background-color: #FFFEF9;
	border: 1rpx solid rgba(232, 225, 206, 1);
	border-radius: 8rpx;
	box-shadow: 0 8rpx 27rpx rgba(78, 62, 45, 0.18);
	margin-top: 38rpx;
	padding: 19rpx 19rpx 0;
	box-sizing: border-box;

	&__frame {
		position: relative;
		width: 100%;
		height: 389rpx;                 /* 蓝湖 202px 照片区 */
		background-color: #EADCC8;
		overflow: visible;              /* 相角要露在照片外 */
	}
	&__img {
		width: 100%; height: 100%;
		display: block;
	}
	&__caption {
		display: block;
		font-family: "Noto Serif SC", serif; font-weight: 400;
		font-size: 31rpx; letter-spacing: 0.5rpx;
		color: rgba(140, 130, 122, 1);
		line-height: 44rpx;
		text-align: center;
		margin: 13rpx 0 24rpx;
		width: 100%;
	}
}

/* 四角相角：棕褐 L 形（蓝湖 group_1/group_2/box_2/box_3） */
.corner {
	position: absolute;
	width: 33rpx; height: 33rpx;
	border: 6rpx solid #8B7355;
	z-index: 2;
}
.corner--tl { left: -13rpx; top: -13rpx; border-right: none; border-bottom: none; }
.corner--tr { right: -13rpx; top: -13rpx; border-left: none; border-bottom: none; }
.corner--bl { left: -13rpx; bottom: -13rpx; border-right: none; border-top: none; }
.corner--br { right: -13rpx; bottom: -13rpx; border-left: none; border-top: none; }

/* ============ 正文（蓝湖 block_5：20px 宋体 / 36px 行高 → 38/69rpx） ============ */
.body-block {
	position: relative;
	width: 592rpx;
	margin-top: 50rpx;

	&__text {
		display: block;
		width: 550rpx;
		font-family: "Noto Serif SC", serif; font-weight: 500;
		font-size: 38rpx; letter-spacing: 1rpx;
		color: rgba(45, 40, 37, 1);
		line-height: 69rpx;
		text-align: justify;
	}
	/* 右侧灰色滚动条装饰（蓝湖 box_5：6×78 → 12×150） */
	&__scrollbar {
		position: absolute;
		right: 6rpx; top: 137rpx;
		width: 12rpx; height: 150rpx;
		background-color: rgba(130, 130, 130, 0.55);
		border-radius: 20rpx;
	}
}

/* ============ 语音条（蓝湖 block_6：326×66 → 627×127） ============ */
.voice-bar {
	width: 627rpx; height: 127rpx;
	background-color: rgba(244, 239, 226, 0.8);
	border: 1rpx solid rgba(227, 217, 196, 1);
	border-radius: 23rpx;
	margin-top: 44rpx;
	display: flex; flex-direction: row; align-items: center;
	box-sizing: border-box;

	&__play {
		width: 77rpx; height: 77rpx;
		background-color: #EDE4D0;
		border: 1rpx solid rgba(213, 201, 176, 1);
		border-radius: 50%;
		margin-left: 25rpx;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon { width: 34rpx; height: 34rpx; }
	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(44, 39, 35, 1);
		margin-left: 23rpx;
		flex: 1;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__dur {
		background-color: #E8DEC7;
		border-radius: 8rpx;
		padding: 4rpx 12rpx;
		margin-right: 30rpx;
		flex-shrink: 0;
	}
	&__dur-text {
		font-family: "PingFang SC", sans-serif; font-weight: 400;
		font-size: 21rpx; color: rgba(87, 83, 78, 1);
	}
}
.bar-hover { opacity: 0.7; }

/* ============ 朗读按钮（蓝湖 block_7：326×56 → 627×108） ============ */
.read-btn {
	width: 627rpx; height: 108rpx;
	background-color: #58B5A5;
	border: 1rpx solid rgba(62, 92, 78, 1);
	border-radius: 23rpx;
	box-shadow: 0 8rpx 12rpx -2rpx rgba(74, 107, 93, 0.2);
	margin-top: 21rpx;
	display: flex; flex-direction: row; align-items: center;
	box-sizing: border-box;

	&__icon { width: 62rpx; height: 62rpx; margin-left: 40rpx; flex-shrink: 0; }
	&__label {
		font-family: "Noto Serif SC", serif; font-weight: 500;
		font-size: 33rpx; letter-spacing: 0.8rpx;
		color: rgba(255, 255, 255, 1);
		margin-left: 19rpx;
		flex: 1;
	}
	&__dur {
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 999rpx;
		padding: 6rpx 20rpx;
		margin-right: 38rpx;
		flex-shrink: 0;
	}
	&__dur-text {
		font-family: "PingFang SC", sans-serif; font-weight: 400;
		font-size: 23rpx; color: rgba(255, 255, 255, 0.9);
	}
}
.read-btn--hover { background-color: #4AA694; }

/* 底部安全区（蓝湖 block_7 下边距 71px → 137rpx） */
.safe-bottom {
	width: 750rpx;
	height: 137rpx;
	/* 兼容全面屏，至少保留设计稿间距 */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: content-box;
}
</style>
