<template>
	<view class="page">

		<!-- ============ 书本体（绝对定位，背景层） ============ -->
		<view class="book-group">
			<!-- 左侧金黄书脊 box_3 -->
			<view class="book-spine-gold"></view>

			<!-- 右侧纸纹 box_4 -->
			<view class="book-paper-edge"></view>

			<!-- ============ 黄色封面 box_5 ============ -->
			<view class="book-cover">
				<!-- 封面左侧高光渐变 block_11 -->
				<view class="book-cover__shine"></view>

				<!-- 封面内全部文字 block_12 -->
				<view class="book-cover__inner">

					<!-- 照片 group_7/8/box_6 -->
					<view class="photo-card">
						<image
							class="photo-card__img"
							src="/static/回忆录界面/我的回忆录 · 实体书封面-已添加回忆_slices/回忆录上的照片@2x.png"
							mode="aspectFill"
						></image>
						<view class="photo-card__mask"></view>
						<text class="photo-card__date">1982.秋&nbsp;摄</text>
					</view>

					<!-- LIFETIME MEMOIR text-wrapper_2 -->
					<view class="en-bar">
						<text class="en-bar__text">LIFETIME MEMOIR</text>
					</view>

					<!-- 中文大标题 text_9 -->
					<text class="cn-title">我的回忆</text>

					<!-- 作者 + tag group_9 -->
					<view class="author-row">
						<text class="author-row__name">王建国</text>
						<view class="author-row__tag">
							<text class="author-row__tag-text">人生故事</text>
						</view>
					</view>

					<!-- 生卒年 text_12 -->
					<text class="life-line">1958&nbsp;年&nbsp;—&nbsp;至今&nbsp;·&nbsp;珍藏录</text>

					<!-- 引言框 text-wrapper_5 -->
					<view class="quote-box">
						<text class="quote-box__text">"每一段走过的路，</text>
						<text class="quote-box__text quote-box__text--br">都是闪闪发光的日子。"</text>
					</view>

					<!-- 底部 group_10 FAMILY ARCHIVE -->
					<view class="book-footer">
						<text class="book-footer__en">FAMILY ARCHIVE</text>
						<image class="book-footer__icon" src="/static/memoir_cover_new/bookmark_icon.png" mode="aspectFit"></image>
						<text class="book-footer__cn">全本共&nbsp;6卷</text>
					</view>

				</view>

				<!-- 右下角装饰圆点 block_13 -->
				<view class="book-cover__corner"></view>

			</view>
		</view>

		<!-- ============ 品牌徽标 block_10（叠在书上方） ============ -->
		<view class="brand">
			<view class="brand__badge">
				<image class="brand__icon" src="/static/memoir_cover_new/brand_logo.png" mode="aspectFit"></image>
			</view>
			<view class="brand__texts">
				<text class="brand__title">忆伴</text>
				<text class="brand__sub">翻阅王建国同志的岁月画卷</text>
			</view>
		</view>

		<!-- ============ 左侧光晕圆球 box_1（叠在书下方） ============ -->
		<view class="glow-ball"></view>

		<!-- ============ 绿色大按钮 block_6 ============ -->
		<view class="open-btn" @tap="onOpenBook">
			<text class="open-btn__emoji">📖</text>
			<view class="open-btn__text-wrap">
				<text class="open-btn__text">轻触翻开回忆录</text>
				<image class="open-btn__arrow" src="/static/memoir_cover_new/open_book_arrow.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ============ 轻触提示 block_8 ============ -->
		<view class="tap-hint">
			<image class="tap-hint__icon" src="/static/memoir_cover_new/tap_icon.png" mode="aspectFit"></image>
			<text class="tap-hint__text">点击黄色封面或按钮，即可开始阅读</text>
		</view>

		<!-- ============ 点击区域 ============ -->
		<view class="hit-area" @tap="onOpenBook"></view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return {}
	},
	computed: {
		store() { return useStore() },
		hasMemories() {
			return (this.store.memoir && this.store.memoir.memories && this.store.memoir.memories.length > 0)
		}
	},
	onLoad() {
		if (!this.hasMemories) {
			actions.refreshMemoir()
		}
	},
	methods: {
		onOpenBook() {
			uni.navigateTo({ url: '/pages/memory/memoirIndex' })
		}
	}
}
</script>

<style lang="scss" scoped>
/* ============ 页面容器 ============ */
.page {
	position: relative;
	background-color: rgba(245, 249, 246, 1); /* #F5F9F6 */
	width: 750rpx;
	height: 1623rpx; /* 蓝湖精确高度 */
	overflow: hidden;
}

/* ============ 书本体 group_6（绝对定位，最底层） ============ */
.book-group {
	position: absolute;
	left: 37rpx;
	top: 333rpx;
	width: 677rpx;
	height: 842rpx;
	background-color: rgba(0, 0, 0, 0.1); /* group_6 整体投影 */
	border-radius: 8rpx 16rpx 8rpx 16rpx;
	z-index: 0;
}

/* 左金黄书脊 box_3 */
.book-spine-gold {
	position: absolute;
	left: -12rpx;
	top: -12rpx;
	width: 31rpx;
	height: 819rpx;
	background-color: rgba(201, 156, 53, 1); /* #C99C35 金黄 */
	box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	z-index: 2;
}

/* 右纸纹 box_4 */
.book-paper-edge {
	position: absolute;
	left: 658rpx;
	top: 4rpx;
	width: 23rpx;
	height: 788rpx;
	background-image: linear-gradient(
		90deg,
		rgba(251, 246, 234, 1) 0%,
		rgba(251, 246, 234, 1) 8.3%,
		rgba(229, 221, 202, 1) 12.5%,
		rgba(255, 253, 247, 1) 16.7%,
		rgba(251, 246, 234, 1) 25%,
		rgba(229, 221, 202, 1) 29.2%,
		rgba(255, 253, 247, 1) 33.3%,
		rgba(251, 246, 234, 1) 41.7%,
		rgba(229, 221, 202, 1) 45.8%,
		rgba(255, 253, 247, 1) 50%,
		rgba(251, 246, 234, 1) 58.3%,
		rgba(229, 221, 202, 1) 62.5%,
		rgba(255, 253, 247, 1) 66.7%,
		rgba(251, 246, 234, 1) 75%,
		rgba(229, 221, 202, 1) 79.2%,
		rgba(255, 253, 247, 1) 83.3%,
		rgba(251, 246, 234, 1) 91.7%,
		rgba(229, 221, 202, 1) 95.8%,
		rgba(255, 253, 247, 1) 100%
	);
	box-shadow: 2rpx 0 3rpx rgba(0, 0, 0, 0.18);
	z-index: 2;
}

/* ============ 黄色封面 box_5 ============ */
.book-cover {
	position: absolute;
	left: 12rpx;
	top: -12rpx;
	width: 654rpx;
	height: 817rpx;
	background-color: #F8DC7E; /* 用户指定！！！ */
	border-radius: 2rpx 12rpx 2rpx 12rpx;
	border: 1rpx solid rgba(255, 255, 255, 0.4);
	box-shadow: 0 25rpx 40rpx -12rpx rgba(45, 52, 40, 0.28);
	z-index: 10;

	/* 封面左侧书脊高光渐变 block_11 */
	&__shine {
		position: absolute;
		left: 0;
		top: 0;
		width: 54rpx;
		height: 815rpx;
		margin-top: 2rpx;
		background-image: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.18) 0%,
			rgba(255, 255, 255, 0.45) 8%,
			rgba(0, 0, 0, 0.12) 18%,
			rgba(255, 255, 255, 0.15) 30%,
			rgba(255, 255, 255, 0) 100%
		);
	}

	/* 右下装饰圆点 block_13 */
	&__corner {
		position: absolute;
		left: 452rpx;
		top: 737rpx;
		width: 19rpx;
		height: 19rpx;
		background-color: rgba(36, 33, 29, 0.25);
		border-radius: 50%;
	}

	/* 封面内全部文字 block_12 */
	&__inner {
		position: absolute;
		left: 15rpx;
		top: 54rpx;
		width: 537rpx;
		height: 708rpx;
		display: flex;
		flex-direction: column;
	}
}

/* ============ 照片卡 group_7 ============ */
.photo-card {
	width: 277rpx;
	height: 215rpx;
	margin-left: 254rpx;
	background-color: rgba(244, 236, 216, 1);
	border-radius: 4rpx;
	border: 1rpx solid rgba(168, 162, 158, 0.3);
	box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.25);
	position: relative;
	overflow: hidden;
	padding: 13rpx 12rpx;
	box-sizing: border-box;

	&__img {
		width: 250rpx;
		height: 188rpx;
		border-radius: 2rpx;
	}
	&__mask {
		position: absolute;
		left: 27rpx;
		top: 13rpx;
		width: 250rpx;
		height: 188rpx;
		background: linear-gradient(360deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%);
		border-radius: 2rpx;
	}
	&__date {
		position: absolute;
		right: 13rpx;
		top: 13rpx;
		font-family: "Liberation Mono", monospace;
		font-size: 15rpx;
		color: rgba(120, 53, 15, 0.7);
		line-height: 23rpx;
	}
}

/* ============ LIFETIME MEMOIR ============ */
.en-bar {
	width: 288rpx;
	height: 58rpx;
	margin-top: 33rpx;
	border-top: 2rpx solid rgba(36, 33, 29, 0.2);
	border-bottom: 2rpx solid rgba(36, 33, 29, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;

	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 700;
		font-size: 23rpx;
		letter-spacing: 6rpx;
		color: rgba(105, 100, 94, 1);
		line-height: 31rpx;
	}
}

/* ============ 中文大标题 ============ */
.cn-title {
	margin-top: 15rpx;
	font-family: "Noto Serif SC", serif;
	font-weight: 900;
	font-size: 58rpx;
	color: rgba(36, 33, 29, 1);
	letter-spacing: 1rpx;
	line-height: 72rpx;
}

/* ============ 作者行 ============ */
.author-row {
	width: 250rpx;
	height: 46rpx;
	margin-top: 15rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	&__name {
		font-family: "PingFang SC", sans-serif;
		font-weight: 600;
		font-size: 38rpx;
		color: rgba(36, 33, 29, 0.85);
		line-height: 46rpx;
	}
	&__tag {
		width: 119rpx;
		height: 42rpx;
		border: 1rpx solid rgba(105, 100, 94, 0.3);
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__tag-text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 23rpx;
		color: rgba(105, 100, 94, 1);
		line-height: 31rpx;
	}
}

/* ============ 生卒年 ============ */
.life-line {
	margin-top: 8rpx;
	font-family: "Noto Serif SC", serif;
	font-weight: 400;
	font-size: 31rpx;
	color: rgba(105, 100, 94, 0.9);
	letter-spacing: 1rpx;
	line-height: 31rpx;
}

/* ============ 引言框 ============ */
.quote-box {
	width: 521rpx;
	height: 121rpx;
	margin-top: 31rpx;
	border: 1rpx solid rgba(180, 83, 9, 0.15);
	padding: 23rpx 0 0 22rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	&__text {
		font-family: "ZCOOL XiaoWei", "Noto Serif SC", serif;
		font-size: 35rpx;
		color: rgba(62, 52, 32, 1);
		letter-spacing: 1rpx;
		line-height: 48rpx;
	}
	&__text--br {
		margin-top: -4rpx;
	}
}

/* ============ 底部 FAMILY ARCHIVE ============ */
.book-footer {
	width: 537rpx;
	margin-top: 29rpx;
	display: flex;
	flex-direction: row;
	align-items: center;

	&__en {
		font-family: "PingFang SC", sans-serif;
		font-weight: 700;
		font-size: 19rpx;
		letter-spacing: 6rpx;
		color: rgba(69, 26, 3, 0.6);
		line-height: 29rpx;
	}
	&__icon {
		width: 13rpx;
		height: 17rpx;
		margin: 0 14rpx 0 150rpx;
	}
	&__cn {
		font-family: "Noto Serif SC", serif;
		font-weight: 400;
		font-size: 27rpx;
		color: rgba(120, 53, 15, 0.6);
		line-height: 32rpx;
	}
}

/* ============ 品牌徽标 block_10 ============ */
.brand {
	position: absolute;
	left: 48rpx;
	top: 138rpx;
	width: 377rpx;
	height: 85rpx;
	display: flex;
	flex-direction: row;
	z-index: 5;

	&__badge {
		width: 77rpx;
		height: 77rpx;
		background-color: rgba(59, 110, 83, 0.15);
		border-radius: 31rpx;
		border: 1rpx solid rgba(59, 110, 83, 0.2);
		margin-top: 4rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__icon {
		width: 33rpx;
		height: 38rpx;
	}
	&__texts {
		margin-left: 23rpx;
		width: 277rpx;
		height: 85rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	&__title {
		font-family: "Noto Serif SC", serif;
		font-weight: 700;
		font-size: 38rpx;
		color: rgba(36, 33, 29, 1);
		letter-spacing: 1rpx;
		line-height: 54rpx;
	}
	&__sub {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 23rpx;
		color: rgba(105, 100, 94, 1);
		line-height: 31rpx;
	}
}

/* ============ 左侧光晕圆球 box_1 ============ */
.glow-ball {
	position: absolute;
	left: 183rpx;
	top: 623rpx; /* 333(group_6 top) + 290(margin-top) */
	width: 492rpx;
	height: 492rpx;
	background-color: rgba(253, 230, 138, 0.4);
	border-radius: 50%;
	z-index: -1;
}

/* ============ 绿色大按钮 block_6 ============ */
.open-btn {
	position: absolute;
	left: 48rpx;
	top: 1240rpx; /* 蓝湖 block_6 y = 333+842+65 = 1240 */
	width: 654rpx;
	height: 123rpx;
	background-color: rgba(87, 181, 165, 1); /* #57B5A5 */
	border-radius: 31rpx;
	box-shadow: 0 10rpx 15rpx rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: row;
	align-items: center;
	z-index: 20;

	&__emoji {
		margin-left: 106rpx;
		font-family: "Liberation Serif", serif;
		font-weight: 700;
		font-size: 46rpx;
		color: rgba(255, 255, 255, 1);
		line-height: 62rpx;
	}
	&__text-wrap {
		margin-left: 21rpx;
		width: 388rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 700;
		font-size: 46rpx;
		letter-spacing: 1rpx;
		color: rgba(255, 255, 255, 1);
		line-height: 54rpx;
	}
	&__arrow {
		width: 29rpx;
		height: 23rpx;
		margin-top: 15rpx;
	}
}

/* ============ 轻触提示 block_8 ============ */
.tap-hint {
	position: absolute;
	left: 179rpx;
	top: 1382rpx; /* 1240 + 123 + 19 */
	width: 394rpx;
	height: 31rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	&__icon {
		width: 17rpx;
		height: 21rpx;
		margin-top: 6rpx;
	}
	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 23rpx;
		color: rgba(105, 100, 94, 1);
		line-height: 31rpx;
	}
}

/* ============ 透明点击区域，覆盖书+按钮 ============ */
.hit-area {
	position: absolute;
	left: 0;
	top: 333rpx;
	width: 750rpx;
	height: 1030rpx;
	z-index: 15;
}
</style>
