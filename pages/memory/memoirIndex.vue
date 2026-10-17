<template>
	<view class="page">

		<!-- ============ 书本目录式（默认） ============ -->
		<view v-if="viewMode === 'book'" class="book-view">

			<!-- 底图（整页羊皮纸） -->
			<image class="book-bg" src="/static/memoir_index/book_index_bg.png" mode="aspectFill"></image>

			<!-- 状态栏 -->
			<view class="book-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

			<!-- 顶部信息条 -->
			<view class="book-top-bar">
				<view class="book-top-bar__divider">
					<text class="book-top-bar__left">忆伴 · 实体回忆录</text>
					<text class="book-top-bar__right">卷一 · 人生篇章</text>
				</view>
			</view>

			<!-- 返回 + 大标题 -->
			<view class="book-header">
				<view class="book-header__back" @tap="onBack">
					<image class="book-header__back-icon" src="/static/memoir_index/back_arrow.png" mode="aspectFit"></image>
					<text class="book-header__back-text">返回</text>
				</view>
				<view class="book-header__titles">
					<text class="book-header__en-top">MEMOIR OF LIFE</text>
					<text class="book-header__cn">目&nbsp;录</text>
					<text class="book-header__en-bot">CONTENTS</text>
				</view>
				<!-- 切换按钮（书本↔相册） -->
				<view class="book-header__switch" @tap="viewMode = 'album'" hover-class="switch-hover">
					<image class="book-header__switch-icon" src="/static/memoir_index/switch_toggle.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 装饰线 -->
			<view class="book-divider">
				<view class="book-divider__line book-divider__line--left"></view>
				<view class="book-divider__dot"></view>
				<view class="book-divider__line book-divider__line--right"></view>
			</view>

			<!-- 朗读 + 添加 按钮行 -->
			<view class="book-actions">
				<view class="book-chip" @tap="onReadAloud">
					<text class="book-chip__emoji">🔊</text>
					<text class="book-chip__text">朗读目录</text>
				</view>
				<view class="book-chip book-chip--primary" @tap="onAdd">
					<view class="book-chip__plus">
						<view class="book-chip__plus-h"></view>
						<view class="book-chip__plus-v"></view>
					</view>
					<text class="book-chip__text">添加回忆</text>
				</view>
			</view>

			<!-- 章节列表 -->
			<scroll-view class="book-chapters" scroll-y :show-scrollbar="false">
				<view
					v-for="(ch, i) in mainChapters"
					:key="ch.id"
					class="book-chapter"
					@tap="onOpenChapter(ch)"
				>
					<!-- 左侧装饰点 -->
					<view class="book-chapter__mark"></view>
					<!-- 序号 -->
					<text class="book-chapter__idx">{{ pad2(ch.sort) }}</text>
					<!-- 标题 + 副标题 -->
					<view class="book-chapter__texts">
						<view class="book-chapter__title-row">
							<text class="book-chapter__title">{{ ch.name }}</text>
							<image v-if="i === 0" class="book-chapter__arrow" src="/static/memoir_index/chapter_arrow.png" mode="aspectFit"></image>
						</view>
						<text class="book-chapter__sub">{{ ch.subtitle }}</text>
					</view>
					<!-- 页码 -->
					<text class="book-chapter__page">{{ ch.page }}</text>
				</view>
				<!-- 底部渐变 + 翻页导航 -->
				<view class="book-footer-nav">
					<text class="book-footer-nav__prev">‹</text>
					<text class="book-footer-nav__link">封面</text>
					<text class="book-footer-nav__link book-footer-nav__link--active">目&nbsp;录</text>
					<view class="book-footer-nav__next-wrap">
						<text class="book-footer-nav__next">翻开第 1 篇</text>
						<text class="book-footer-nav__next-arrow">›</text>
					</view>
				</view>
				<!-- 占位 -->
				<view style="height: 120rpx"></view>
			</scroll-view>

		</view>

		<!-- ============ 相册式 ============ -->
		<view v-else class="album-view">

			<!-- 状态栏 -->
			<view class="album-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

			<!-- 顶部标题条 -->
			<view class="album-top">
				<view class="album-top__dot"></view>
				<text class="album-top__text">忆伴 · 实体回忆录</text>
				<!-- 切换回书本 -->
				<view class="album-top__switch" @tap="viewMode = 'book'" hover-class="switch-hover">
					<text class="album-top__switch-text">📖</text>
				</view>
			</view>

			<!-- 返回行 -->
			<view class="album-back" @tap="onBack">
				<image class="album-back__icon" src="/static/memoir_index/back_arrow.png" mode="aspectFit"></image>
				<text class="album-back__text">返回</text>
			</view>

			<!-- 相册网格 -->
			<view class="album-grid">
				<view class="album-row">
					<view
						v-for="ch in row01"
						:key="ch.id"
						class="album-card"
						@tap="onOpenChapter(ch)"
					>
						<view class="album-card__cover">
							<image
								v-if="getCover(ch)"
								class="album-card__img"
								:src="getCover(ch)"
								mode="aspectFill"
							></image>
							<view v-else class="album-card__placeholder"></view>
						</view>
						<text class="album-card__name">{{ ch.name }}</text>
					</view>
				</view>
				<view class="album-row">
					<view
						v-for="ch in row02"
						:key="ch.id"
						class="album-card"
						@tap="onOpenChapter(ch)"
					>
						<view class="album-card__cover">
							<image
								v-if="getCover(ch)"
								class="album-card__img"
								:src="getCover(ch)"
								mode="aspectFill"
							></image>
							<view v-else class="album-card__placeholder"></view>
						</view>
						<text class="album-card__name">{{ ch.name }}</text>
					</view>
				</view>
				<view class="album-row">
					<view
						v-for="ch in row03"
						:key="ch.id"
						class="album-card"
						@tap="onOpenChapter(ch)"
					>
						<view class="album-card__cover">
							<image
								v-if="getCover(ch)"
								class="album-card__img"
								:src="getCover(ch)"
								mode="aspectFill"
							></image>
							<view v-else class="album-card__placeholder"></view>
						</view>
						<text class="album-card__name">{{ ch.name }}</text>
					</view>
				</view>
			</view>

			<!-- 底部绿色胶囊提示 -->
			<view class="album-tip">
				<image class="album-tip__icon" src="/static/memoir_index/tip_icon.png" mode="aspectFit"></image>
				<text class="album-tip__text">轻触任意照片可看大图与回忆故事</text>
			</view>

		</view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

// 相册式固定封面映射（蓝湖下载的 4 张，缺的章节用占位）
const ALBUM_COVER_MAP = {
	ch1: '/static/memoir_index/album_ch1.png',   // 我的个人简介
	ch2: '/static/memoir_index/album_ch2.png',   // 认识我的家人
	ch5: '/static/memoir_index/album_ch5.png',   // 我的老相册
	ch6: '/static/memoir_index/album_ch6.png'    // 那些重要的日子
}

export default {
	data() {
		return {
			statusBarHeight: 20,
			viewMode: 'book' // 'book' | 'album'
		}
	},
	computed: {
		store() { return useStore() },
		chapters() {
			return (this.store.memoir && this.store.memoir.chapters) || []
		},
		// 主 6 章（排除固定的新增回忆 ch7）
		mainChapters() {
			return this.chapters.filter(c => !c.fixed).sort((a, b) => a.sort - b.sort)
		},
		row01() { return this.mainChapters.slice(0, 2) },
		row02() { return this.mainChapters.slice(2, 4) },
		row03() { return this.mainChapters.slice(4, 6) }
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
		actions.refreshMemoir()
	},
	methods: {
		pad2(n) { return String(n).padStart(2, '0') },
		getCover(ch) { return ALBUM_COVER_MAP[ch.id] },
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/memory/memoir' }) })
		},
		onReadAloud() {
			uni.showToast({ title: '朗读功能开发中', icon: 'none' })
		},
		onAdd() {
			uni.navigateTo({ url: '/pages/memory/addRecall' })
		},
		onOpenChapter(ch) {
			uni.showToast({ title: ch.name + ' 详情开发中', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>

/* ============ 公共 ============ */
.page {
	width: 750rpx;
	min-height: 100vh;
	position: relative;
}
.switch-hover { opacity: 0.6; }

/* ============ 书本目录式 ============ */
.book-view {
	position: relative;
	width: 750rpx;
	min-height: 100vh;
	background-color: #FAF7EE;
}
.book-bg {
	position: absolute;
	left: 0; top: 0;
	width: 750rpx;
	height: 100%;
	z-index: 0;
}
.book-status-bar {
	position: relative;
	z-index: 1;
}
.book-top-bar {
	position: relative;
	z-index: 1;
	padding: 0 64rpx;
}
.book-top-bar__divider {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 50rpx;
	border: 1rpx solid rgba(227, 220, 203, 0.8);
	margin-top: 48rpx;
	padding: 0 16rpx;
	align-items: center;
}
.book-top-bar__left {
	font-family: "PingFang SC", sans-serif;
	font-weight: 500;
	font-size: 24rpx;
	letter-spacing: 1rpx;
	color: rgba(87, 82, 74, 1);
	line-height: 50rpx;
}
.book-top-bar__right {
	font-family: "PingFang SC", sans-serif;
	font-weight: 500;
	font-size: 24rpx;
	letter-spacing: 0.5rpx;
	color: rgba(87, 82, 74, 1);
	line-height: 50rpx;
}

/* 返回 + 大标题 */
.book-header {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 30rpx 0 0 78rpx;
	height: 154rpx;

	&__back {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	&__back-icon {
		width: 16rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}
	&__back-text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 32rpx;
		color: rgba(21, 29, 26, 1);
	}
	&__titles {
		flex: 1;
		margin-left: 72rpx;
		display: flex;
		flex-direction: column;
	}
	&__en-top {
		font-family: "PingFang SC", sans-serif;
		font-weight: 400;
		font-size: 24rpx;
		letter-spacing: 8.4rpx;
		color: rgba(155, 100, 56, 1);
	}
	&__cn {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 60rpx;
		letter-spacing: 12rpx;
		color: rgba(45, 42, 38, 1);
		margin: 8rpx 0;
	}
	&__en-bot {
		font-family: "PingFang SC", sans-serif;
		font-weight: 400;
		font-size: 24rpx;
		letter-spacing: 2.4rpx;
		color: rgba(87, 82, 74, 1);
	}
	&__switch {
		margin-right: 72rpx;
		width: 66rpx;
		height: 66rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__switch-icon {
		width: 66rpx;
		height: 66rpx;
	}
}

/* 装饰线 */
.book-divider {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 16rpx 0 0 268rpx;
	width: 246rpx;

	&__line { height: 2rpx; }
	&__line--left { width: 96rpx; background-color: #D1C7B2; }
	&__line--right { width: 96rpx; background-color: #D1C7B2; margin-left: 16rpx; }
	&__dot { width: 22rpx; height: 22rpx; background-color: #9B6438; border-radius: 50%; }
}

/* 朗读 + 添加 按钮行 */
.book-actions {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 24rpx 100rpx 0;
}
.book-chip {
	height: 68rpx;
	padding: 0 40rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: rgba(241, 234, 217, 1);
	border: 1rpx solid rgba(223, 213, 191, 1);
	border-radius: 999rpx;
	box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);

	&__emoji { font-size: 28rpx; color: #9B6438; margin-right: 6rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 28rpx;
		color: rgba(45, 42, 38, 1);
	}
	&__plus {
		width: 32rpx; height: 32rpx;
		position: relative;
		margin-right: 6rpx;
	}
	&__plus-h {
		position: absolute;
		left: 0; top: 14rpx;
		width: 32rpx; height: 4rpx;
		background-color: rgba(45, 42, 38, 1);
		border-radius: 2rpx;
	}
	&__plus-v {
		position: absolute;
		left: 14rpx; top: 0;
		width: 4rpx; height: 32rpx;
		background-color: rgba(45, 42, 38, 1);
		border-radius: 2rpx;
	}

	&--primary {
		background-color: rgba(201, 156, 53, 0.95);
		border-color: rgba(180, 130, 30, 0.5);
	}
	&--primary .book-chip__text { color: #FFFFFF; }
	&--primary .book-chip__plus-h,
	&--primary .book-chip__plus-v { background-color: #FFFFFF; }
}

/* 章节列表 */
.book-chapters {
	position: relative;
	z-index: 1;
	margin-top: 20rpx;
	padding: 0 32rpx;
	height: calc(100vh - 520rpx);
}
.book-chapter {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 92rpx;
	margin-top: 28rpx;

	&__mark {
		width: 12rpx;
		height: 12rpx;
		background-color: #9B6438;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	&__idx {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 36rpx;
		letter-spacing: 3rpx;
		color: rgba(155, 100, 56, 0.85);
		width: 50rpx;
		text-align: left;
	}
	&__texts {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 70rpx;
	}
	&__title-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	&__title {
		font-family: "Noto Serif SC", serif;
		font-weight: 600;
		font-size: 32rpx;
		color: rgba(45, 42, 38, 1);
	}
	&__arrow {
		width: 264rpx;
		height: 4rpx;
		margin-left: 14rpx;
		opacity: 0.5;
	}
	&__sub {
		font-family: "PingFang SC", sans-serif;
		font-weight: 400;
		font-size: 24rpx;
		color: rgba(117, 110, 99, 0.75);
	}
	&__page {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 26rpx;
		letter-spacing: 1rpx;
		color: rgba(155, 100, 56, 0.7);
	}
}

/* 底部导航 */
.book-footer-nav {
	margin-top: 60rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 66rpx;
	border-top: 1rpx solid rgba(209, 199, 178, 0.6);
	padding-top: 22rpx;

	&__prev {
		font-size: 40rpx;
		color: rgba(155, 100, 56, 0.5);
		margin-right: 12rpx;
	}
	&__link {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 26rpx;
		color: rgba(117, 110, 99, 0.6);
		margin: 0 16rpx;
	}
	&__link--active {
		color: rgba(155, 100, 56, 1);
		font-weight: 700;
	}
	&__next-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 16rpx;
	}
	&__next {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 26rpx;
		color: rgba(45, 42, 38, 1);
	}
	&__next-arrow {
		font-size: 32rpx;
		color: rgba(155, 100, 56, 1);
		margin-left: 4rpx;
	}
}

/* ============ 相册式 ============ */
.album-view {
	position: relative;
	width: 750rpx;
	min-height: 100vh;
	background-color: #F6F3EA;
	padding-bottom: 80rpx;
}
.album-status-bar { background-color: #F6F3EA; }

.album-top {
	position: relative;
	width: 750rpx;
	height: 130rpx;
	border-bottom: 1rpx solid rgba(233, 227, 211, 1);
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #F9F6ED;

	&__dot {
		width: 12rpx; height: 12rpx;
		background-color: #B89F7C;
		border-radius: 50%;
		margin-left: 64rpx;
	}
	&__text {
		font-family: "Noto Serif SC", serif;
		font-weight: 400;
		font-size: 26rpx;
		letter-spacing: 1.3rpx;
		color: rgba(117, 110, 99, 1);
		margin-left: 16rpx;
	}
	&__switch {
		position: absolute;
		right: 48rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 50%;
	}
	&__switch-text { font-size: 32rpx; }
}

.album-back {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 32rpx 0 0 64rpx;

	&__icon { width: 16rpx; height: 24rpx; margin-right: 8rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 32rpx;
		color: rgba(21, 29, 26, 1);
	}
}

/* 相册网格 */
.album-grid {
	display: flex;
	flex-direction: column;
	padding: 22rpx 40rpx 0;
}
.album-row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 80rpx;
}
.album-row:first-child { margin-top: 22rpx; }

.album-card {
	width: 330rpx;
	height: 336rpx;
	background-color: #FFFFFF;
	border-radius: 32rpx;
	box-shadow: 0 8rpx 32rpx -4rpx rgba(44, 53, 49, 0.06);
	display: flex;
	flex-direction: column;
	overflow: hidden;

	&__cover {
		width: 298rpx;
		height: 224rpx;
		margin: 16rpx 0 0 16rpx;
		background-color: #E6F0EA;
		border-radius: 24rpx;
		overflow: hidden;
	}
	&__img { width: 100%; height: 100%; }
	&__placeholder {
		width: 100%; height: 100%;
		background: linear-gradient(135deg, #E6F0EA, #D4E5DC);
	}
	&__name {
		font-family: "Noto Serif SC", serif;
		font-weight: 500;
		font-size: 40rpx;
		color: rgba(21, 29, 26, 1);
		margin: 20rpx 0 24rpx 24rpx;
	}
}

/* 底部绿色胶囊提示 */
.album-tip {
	position: relative;
	margin: 128rpx auto 70rpx;
	width: 536rpx;
	height: 56rpx;
	background-color: #A1F3C9;
	border-radius: 999rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 24rpx;
	box-sizing: border-box;

	&__icon { width: 26rpx; height: 32rpx; margin-right: 12rpx; }
	&__text {
		flex: 1;
		font-family: "PingFang SC", sans-serif;
		font-weight: 500;
		font-size: 30rpx;
		color: rgba(66, 72, 68, 1);
		text-align: center;
	}
}
</style>
