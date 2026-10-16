<template>
	<view class="page">
		<!-- 状态栏安全区 -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- ============ Header 区：忆伴品牌条 ============ -->
		<view class="header">
			<!-- 绿色徽标 + icon -->
			<view class="brand-badge">
				<image class="brand-icon" src="static/回忆录界面/我的回忆录 · 实体书封面-已添加回忆_slices/Icon@2x.png" mode="aspectFit"></image>
			</view>
			<!-- 忆伴 + 副标题 -->
			<view class="brand-text">
				<text class="brand-title">忆伴</text>
				<text class="brand-sub">翻阅{{ patient.name || '王建国' }}同志的岁月画卷</text>
			</view>
		</view>

		<!-- ============ 主内容：实体书封面 + 按钮 ============ -->
		<view class="book-area">
			<!-- 实体书封面 (box_5 + group_6 合并简化) -->
			<view class="book-cover" hover-class="book-cover--hover" @tap="onOpenBook">
				<!-- 左侧金色书脊 -->
				<view class="book-spine"></view>
				<!-- 右边缘纸纹装饰 -->
				<view class="book-pages"></view>

				<!-- 封面内部 -->
				<view class="book-inner">
					<!-- 书名行 -->
					<view class="book-title-row">
						<text class="book-sub-en">YOUR MEMORY BOOK</text>
					</view>
					<!-- 中文书名 -->
					<text class="book-title-cn">你的岁月画卷</text>
					<!-- 分隔细线 -->
					<view class="book-divider"></view>

					<!-- 照片卡片（group_7） -->
					<view class="photo-card">
						<!-- 照片占位框（空着：未添加回忆态） -->
						<view class="photo-empty">
							<image
								class="photo-img"
								v-if="coverPhoto"
								:src="coverPhoto"
								mode="aspectFill"
							></image>
							<view v-else class="photo-placeholder">
								<text class="photo-placeholder-text">照片</text>
							</view>
						</view>
						<!-- 照片下方说明 -->
						<view class="photo-caption-row">
							<text class="photo-caption">{{ coverPhoto ? '留给我的第一张珍贵照片' : '留给我的第一张珍贵照片' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 提示图标 + 文字（封面下方） -->
			<view class="hint-row">
				<image class="hint-icon" src="static/回忆录界面/我的回忆录 · 实体书封面-已添加回忆_slices/点击icon@2x.png" mode="aspectFit"></image>
				<text class="hint-text">点击黄色封面或按钮，即可开始写日记</text>
			</view>

			<!-- 卷号标签 -->
			<view class="archive-label">
				<text class="archive-en">FAMILY&nbsp;ARCHIVE</text>
				<text class="archive-cn">全本共&nbsp;{{ totalVolumes }}&nbsp;卷</text>
			</view>
		</view>

		<!-- ============ 底部绿按钮：写下第一篇回忆 ============ -->
		<view class="btn-write" hover-class="btn-write--hover" @tap="onWriteFirst">
			<text class="btn-write__text">写下第一篇回忆</text>
		</view>

		<!-- 自定义 TabBar -->
		<yb-tab-bar></yb-tab-bar>
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
		patient() { return this.store.patient },
		memories() { return this.store.memoir && this.store.memoir.memories ? this.store.memoir.memories : [] },
		totalVolumes() {
			// 卷数 = 回忆分类数 + 空卷占位，蓝湖写死"全本共 4 卷"
			return 4
		},
		coverPhoto() {
			// 取最新一条回忆的封面图（后期接后端）
			const m = this.memories[0]
			if (m && m.images && m.images.length) return m.images[0]
			return ''
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	},
	onShow() {
		actions.refreshMemoir()
		actions.refreshPatient()
	},
	methods: {
		onOpenBook() {
			uni.showToast({ title: '翻开回忆录（待实现）', icon: 'none' })
		},
		onWriteFirst() {
			uni.showToast({ title: '写下第一篇回忆（待实现）', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
/* ========= 页面根 ========= */
.page {
	background-color: rgba(245, 249, 246, 1); /* #F5F9F6 蓝湖 .page */
	width: 750rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	padding-bottom: 220rpx;
	box-sizing: border-box;
}

/* ========= 状态栏占位 ========= */
.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* ========= Header ========= */
.header {
	width: 675rpx;
	height: 85rpx;
	display: flex;
	flex-direction: row;
	margin: 37rpx 0 0 46rpx;
}

/* 绿色徽标（image-wrapper_1, 77×77rpx 椭圆圆角） */
.brand-badge {
	background-color: rgba(59, 110, 83, 0.15);
	border: 1rpx solid rgba(59, 110, 83, 0.2);
	border-radius: 31rpx;
	width: 77rpx;
	height: 77rpx;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
}

.brand-icon {
	width: 38rpx;
	height: 38rpx;
	margin: 19rpx 0 0 19rpx;
}

/* 忆伴 + 副标题文字 */
.brand-text {
	width: 277rpx;
	height: 85rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-left: 23rpx;
}

/* text_2: "忆伴" 38rpx Noto Serif Bold */
.brand-title {
	color: rgba(36, 33, 29, 1); /* #24211D */
	font-size: 38rpx;
	letter-spacing: 1rpx;
	font-weight: 700;
	line-height: 54rpx;
	font-family: -apple-system, "PingFang SC", "Noto Serif SC", serif;
}

/* text_3: "翻阅王建国同志的岁月画卷" 23rpx */
.brand-sub {
	color: rgba(105, 100, 94, 1); /* #69645E */
	font-size: 23rpx;
	font-weight: 500;
	line-height: 31rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* ========= 书区 ========= */
.book-area {
	width: 600rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 60rpx 0 0 75rpx;
}

/* ========= 实体书封面 ========= */
.book-cover {
	position: relative;
	width: 654rpx;
	height: 817rpx;
	border: 1rpx solid rgba(255, 255, 255, 0.4);
	box-shadow: 0 25rpx 40rpx -12rpx rgba(45, 52, 40, 0.28);
	/* 书脊渐变：左侧棕金 + 中间米色 + 右侧纸纹 */
	background-image: linear-gradient(
		90deg,
		rgba(201, 156, 53, 1) 0,
		rgba(201, 156, 53, 1) 15rpx,
		rgba(251, 246, 234, 1) 15rpx,
		rgba(251, 246, 234, 1) 95%,
		rgba(229, 221, 202, 1) 96%,
		rgba(255, 253, 247, 1) 97%
	);
	border-radius: 4rpx;

	&--hover { opacity: 0.95; }
}

/* 左金色书脊 31rpx */
.book-spine {
	position: absolute;
	left: -12rpx;
	top: -12rpx;
	width: 31rpx;
	height: 819rpx;
	background-color: rgba(201, 156, 53, 1); /* #C99C35 */
	box-shadow: inset 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.05);
	border-radius: 4rpx 0 0 4rpx;
}

/* 右纸纹装饰 23rpx */
.book-pages {
	position: absolute;
	left: 658rpx;
	top: 4rpx;
	width: 23rpx;
	height: 788rpx;
	background-image: linear-gradient(
		90deg,
		rgba(251, 246, 234, 1) 0%,
		rgba(229, 221, 202, 1) 50%,
		rgba(255, 253, 247, 1) 100%
	);
	box-shadow: 2rpx 0 3rpx 0 rgba(0, 0, 0, 0.18);
}

/* 封面内部内容区 */
.book-inner {
	position: absolute;
	left: 54rpx;
	top: 54rpx;
	width: 537rpx;
}

/* 英文小标 */
.book-title-row {
	margin-top: 60rpx;
}

.book-sub-en {
	color: rgba(105, 100, 94, 1); /* #69645E */
	font-size: 23rpx;
	letter-spacing: 6rpx;
	font-weight: 700;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* 中文书名 text_9: 58rpx Noto Serif Black */
.book-title-cn {
	display: block;
	margin-top: 15rpx;
	color: rgba(36, 33, 29, 1); /* #24211D */
	font-size: 58rpx;
	font-weight: 900;
	line-height: 72rpx;
	font-family: "Noto Serif SC", "PingFang SC", serif;
}

/* 分隔细线 */
.book-divider {
	margin-top: 15rpx;
	width: 521rpx;
	height: 2rpx;
	background-color: rgba(105, 100, 94, 0.3);
}

/* ========= 照片卡片 group_7 ========= */
.photo-card {
	box-shadow: inset 0 1rpx 3rpx 1rpx rgba(0, 0, 0, 0.25);
	background-color: rgba(244, 236, 216, 1); /* #F4ECD8 */
	border-radius: 4rpx;
	border: 1rpx solid rgba(168, 162, 158, 0.3);
	width: 277rpx;
	height: 215rpx;
	margin: 40rpx auto 0 auto;

	/* group_8 内部 */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 13rpx 12rpx 12rpx;
	box-sizing: border-box;
}

/* 照片占位 */
.photo-empty {
	width: 250rpx;
	height: 188rpx;
	background-image: linear-gradient(360deg, rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.photo-img {
	width: 250rpx;
	height: 188rpx;
}

.photo-placeholder {
	width: 250rpx;
	height: 188rpx;
	background-color: rgba(201, 156, 53, 0.15);
	border-radius: 4rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.photo-placeholder-text {
	color: rgba(120, 53, 15, 0.7);
	font-size: 15rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* 照片下方 caption */
.photo-caption-row {
	width: 250rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

/* text_10: 38rpx Semibold */
.photo-caption {
	color: rgba(36, 33, 29, 0.85);
	font-size: 38rpx;
	font-weight: 600;
	line-height: 46rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* ========= 封面下方提示 ========= */
.hint-row {
	width: 394rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 30rpx 0 0 179rpx;
}

.hint-icon {
	width: 17rpx;
	height: 21rpx;
	margin-top: 6rpx;
	flex-shrink: 0;
}

.hint-text {
	color: rgba(105, 100, 94, 1);
	font-size: 23rpx;
	font-weight: 500;
	line-height: 31rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* ========= FAMILY ARCHIVE 标签 ========= */
.archive-label {
	display: flex;
	flex-direction: row;
	width: 394rpx;
	justify-content: space-between;
	margin: 19rpx 0 0 179rpx;
}

/* text_5: 23rpx 宽字距 */
.archive-en {
	color: rgba(105, 100, 94, 1);
	font-size: 23rpx;
	letter-spacing: 6rpx;
	font-weight: 700;
	line-height: 31rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* text_6: 23rpx 圆角胶囊 */
.archive-cn {
	border-radius: 8rpx;
	height: 42rpx;
	line-height: 42rpx;
	border: 1rpx solid rgba(105, 100, 94, 0.3);
	padding: 0 13rpx;
	color: rgba(105, 100, 94, 1);
	font-size: 23rpx;
	font-weight: 500;
	font-family: -apple-system, "PingFang SC", sans-serif;
}

/* ========= 底部绿按钮 ========= */
.btn-write {
	background-color: rgba(87, 181, 165, 1); /* #57B5A5 青绿 */
	border-radius: 31rpx;
	width: 654rpx;
	height: 123rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 65rpx 0 0 48rpx;
	box-shadow: 0 10rpx 15rpx 0 rgba(0, 0, 0, 0.1);

	&--hover { opacity: 0.9; }
}

/* text-group_1: 46rpx PingFang Bold 白 */
.btn-write__text {
	color: rgba(255, 255, 255, 1);
	font-size: 46rpx;
	letter-spacing: 1rpx;
	font-weight: 700;
	line-height: 54rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
}
</style>
