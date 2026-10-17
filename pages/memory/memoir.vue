<template>
	<view class="page">

		<!-- 状态栏安全区 -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- ============ 顶部：忆伴品牌 ============ -->
		<view class="brand-row">
			<view class="brand-badge">
				<image class="brand-badge__icon" src="/static/memoir_cover_new/brand_logo.png" mode="aspectFit"></image>
			</view>
			<view class="brand-text">
				<text class="brand-text__title">忆伴</text>
				<text class="brand-text__sub">翻阅王建国同志的岁月画卷</text>
			</view>
		</view>

		<!-- ============ 中心：黄色实体书封面 ============ -->
		<view class="book-wrap">

			<!-- 书脊左侧装饰圆球（蓝湖 box_1） -->
			<view class="book-glow"></view>

			<!-- 书本体（蓝湖 group_6 + box_3/4/5） -->
			<view class="book" @tap="onOpenBook">

				<!-- 书脊（左边缘） -->
				<view class="book__spine"></view>
				<!-- 纸纹侧边（右边缘，暗示是多页实体书） -->
				<view class="book__pages"></view>

				<!-- ============ 黄色封面主体 ============ -->
				<view class="book__cover">

					<!-- 书角装饰（左上的小圆点） -->
					<view class="book__corner-dot"></view>

					<!-- 照片卡（回忆录上的照片@2x.png，1982秋摄） -->
					<view class="photo-card">
						<image
							class="photo-card__img"
							src="/static/回忆录界面/我的回忆录 · 实体书封面-已添加回忆_slices/回忆录上的照片@2x.png"
							mode="aspectFill"
						></image>
						<!-- 照片底部深色遮罩 + 日期 -->
						<view class="photo-card__mask">
							<text class="photo-card__date">1982.秋 摄</text>
						</view>
					</view>

					<!-- 英文装饰线 LIFETIME MEMOIR -->
					<view class="en-line">
						<text class="en-line__text">LIFETIME MEMOIR</text>
					</view>

					<!-- 中文大书名：我的回忆 -->
					<text class="book-cn-title">我的回忆</text>

					<!-- 作者 + 身份 tag -->
					<view class="author-row">
						<text class="author-row__name">王建国</text>
						<view class="author-row__tag">
							<text class="author-row__tag-text">人生故事</text>
						</view>
					</view>

					<!-- 生卒年 -->
					<text class="book-life">1958 年 — 至今 · 珍藏录</text>

					<!-- 引言框 -->
					<view class="quote-box">
						<text class="quote-box__text">"每一段走过的路，<text class="quote-br"></text>都是闪闪发光的日子。"</text>
					</view>

					<!-- 底部 FAMILY ARCHIVE + 书签 + 全本共 6 卷 -->
					<view class="book-footer">
						<text class="book-footer__en">FAMILY ARCHIVE</text>
						<image class="book-footer__mark" src="/static/memoir_cover_new/bookmark_icon.png" mode="aspectFit"></image>
						<text class="book-footer__cn">全本共 6卷</text>
					</view>

				</view>
			</view>
		</view>

		<!-- ============ 底部绿色大按钮 ============ -->
		<view class="open-btn" @tap="onOpenBook">
			<text class="open-btn__emoji">📖</text>
			<view class="open-btn__text-wrap">
				<text class="open-btn__text">轻触翻开回忆录</text>
				<image class="open-btn__arrow" src="/static/memoir_cover_new/open_book_arrow.png" mode="aspectFit"></image>
			</view>
			<view class="open-btn__shadow"></view>
		</view>

		<!-- ============ 轻触提示 ============ -->
		<view class="tap-hint">
			<image class="tap-hint__icon" src="/static/memoir_cover_new/tap_icon.png" mode="aspectFit"></image>
			<text class="tap-hint__text">点击黄色封面或按钮，即可开始阅读</text>
		</view>

		<!-- tabBar (yb-tab-bar 全局组件会自动显示，这里留空) -->
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return {
			statusBarHeight: 20
		}
	},
	computed: {
		store() { return useStore() },
		hasMemories() {
			return (this.store.memoir && this.store.memoir.memories && this.store.memoir.memories.length > 0)
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
		// 确保回忆录数据已加载
		if (!this.hasMemories) {
			actions.refreshMemoir()
		}
	},
	methods: {
		onOpenBook() {
			// 先判断有没有回忆 → 有就进目录页，没有就进新增页
			if (this.hasMemories) {
				uni.showToast({ title: '目录页开发中', icon: 'none' })
			} else {
				uni.navigateTo({ url: '/pages/memory/addRecall' })
			}
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
	box-sizing: border-box;
}

.nav-safe { width: 750rpx; }

/* ============ 顶部忆伴品牌 ============ */
.brand-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 37rpx 0 0 46rpx;

	&__badge {
		background-color: rgba(59, 110, 83, 0.15);
		border-radius: 31rpx;
		height: 77rpx;
		width: 77rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(59, 110, 83, 0.2);
		margin-top: 4rpx;
	}
	&__icon {
		width: 33rpx;
		height: 38rpx;
	}
}
.brand-text {
	margin-left: 23rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 85rpx;

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

/* ============ 中心黄色书 ============ */
.book-wrap {
	position: relative;
	width: 600rpx;
	height: 783rpx;
	margin: 129rpx 0 0 75rpx; /* 蓝湖 margin: 129 0 0 129，居中微调 */
}
/* 圆球光晕（蓝湖 box_1，492×492 黄色圆球） */
.book-glow {
	position: absolute;
	left: 54rpx;
	top: 290rpx;
	width: 492rpx;
	height: 492rpx;
	background-color: rgba(253, 230, 138, 0.4);
	border-radius: 50%;
	z-index: 0;
}
/* 书整体 */
.book {
	position: relative;
	width: 492rpx;
	height: 765rpx;
	margin: 0 auto;
	z-index: 1;

	/* 左边缘书脊 */
	&__spine {
		position: absolute;
		left: -15rpx;
		top: 0;
		width: 15rpx;
		height: 765rpx;
		background-image: linear-gradient(
			90deg,
			rgba(251, 246, 234, 0.85) 0%,
			rgba(229, 221, 202, 0.85) 50%,
			rgba(255, 253, 247, 0.85) 100%
		);
		box-shadow: 2px 0 3px 0 rgba(0, 0, 0, 0.18);
		z-index: 2;
	}
	/* 右边缘纸纹暗示 */
	&__pages {
		position: absolute;
		right: -10rpx;
		top: 4rpx;
		width: 10rpx;
		height: 757rpx;
		background-color: rgba(229, 221, 202, 0.9);
		z-index: 2;
		border-radius: 0 4rpx 4rpx 0;
	}

	/* ============ 黄色封面 ============ */
	&__cover {
		position: absolute;
		left: 0;
		top: 0;
		width: 492rpx;
		height: 765rpx;
		background-color: #F8DC7E; /* 用户指定 */
		border-radius: 6rpx 10rpx 10rpx 6rpx;
		box-shadow:
			0 10rpx 25rpx rgba(0, 0, 0, 0.12),
			0 4rpx 10rpx rgba(0, 0, 0, 0.06);
		box-sizing: border-box;
		padding: 26rpx 20rpx 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 左上角装饰圆点 */
	&__corner-dot {
		position: absolute;
		left: 428rpx;
		top: 737rpx;
		width: 19rpx;
		height: 19rpx;
		background-color: rgba(36, 33, 29, 0.25);
		border-radius: 50%;
	}
}

/* ============ 照片卡 ============ */
.photo-card {
	width: 250rpx;
	height: 188rpx;
	position: relative;
	border-radius: 3rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.15);

	&__img {
		width: 100%;
		height: 100%;
	}
	&__mask {
		position: absolute;
		left: 0; right: 0; bottom: 0;
		height: 40rpx;
		background: linear-gradient(360deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%);
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		padding-right: 8rpx;
	}
	&__date {
		font-family: "Liberation Mono", monospace;
		font-size: 15rpx;
		color: rgba(120, 53, 15, 0.7);
		line-height: 23rpx;
	}
}

/* ============ LIFETIME MEMOIR 装饰线 ============ */
.en-line {
	width: 288rpx;
	height: 42rpx;
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
.book-cn-title {
	width: 440rpx;
	margin-top: 15rpx;
	font-family: "Noto Serif SC", serif;
	font-weight: 900;
	font-size: 58rpx;
	color: rgba(36, 33, 29, 1);
	letter-spacing: 1rpx;
	line-height: 72rpx;
	text-shadow: 0 1rpx 1rpx rgba(0,0,0,0.05);
}

/* ============ 作者行 ============ */
.author-row {
	width: 440rpx;
	margin-top: 15rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	&__name {
		font-family: "PingFang SC", sans-serif;
		font-weight: 600;
		font-size: 38rpx;
		color: rgba(36, 33, 29, 0.85);
		line-height: 46rpx;
	}
	&__tag {
		border: 1rpx solid rgba(105, 100, 94, 0.3);
		border-radius: 8rpx;
		height: 42rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 13rpx;
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
.book-life {
	width: 440rpx;
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
	width: 440rpx;
	margin-top: 31rpx;
	border: 1rpx solid rgba(180, 83, 9, 0.15);
	padding: 23rpx 22rpx;
	box-sizing: border-box;

	&__text {
		font-family: "ZCOOL XiaoWei", "Noto Serif SC", serif;
		font-size: 35rpx;
		color: rgba(62, 52, 32, 1);
		letter-spacing: 1rpx;
		line-height: 48rpx;
	}
	.quote-br {
		display: block;
	}
}

/* ============ 底部 FAMILY ARCHIVE ============ */
.book-footer {
	width: 440rpx;
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
	&__mark {
		width: 13rpx;
		height: 17rpx;
		margin: 0 12rpx;
	}
	&__cn {
		font-family: "Noto Serif SC", serif;
		font-weight: 400;
		font-size: 27rpx;
		color: rgba(120, 53, 15, 0.6);
		line-height: 32rpx;
	}
}

/* ============ 底部绿色大按钮 ============ */
.open-btn {
	width: 654rpx;
	height: 123rpx;
	margin: 65rpx auto 0;
	background-color: rgba(87, 181, 165, 1); /* #57B5A5 */
	border-radius: 31rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	box-shadow: 0 10rpx 15rpx rgba(0, 0, 0, 0.1);
	position: relative;

	&__emoji {
		font-family: "Liberation Serif", serif;
		font-weight: 700;
		font-size: 46rpx;
		color: rgba(255, 255, 255, 1);
		line-height: 62rpx;
		margin-left: 106rpx;
	}
	&__text-wrap {
		margin-left: 21rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 388rpx;
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
		width: 21rpx;
		height: 16rpx;
	}
}

/* ============ 轻触提示 ============ */
.tap-hint {
	width: 514rpx;
	margin: 30rpx auto 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	&__icon {
		width: 18rpx;
		height: 22rpx;
		margin-right: 8rpx;
		opacity: 0.5;
	}
	&__text {
		font-family: "PingFang SC", sans-serif;
		font-size: 23rpx;
		color: rgba(105, 100, 94, 0.65);
		line-height: 31rpx;
	}
}
</style>
