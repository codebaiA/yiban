<template>
	<view class="page">

		<!-- ============ 书本目录式 viewMode='book' ============ -->
		<view v-if="viewMode === 'book'" class="book-view">

			<!-- 羊皮纸底图 -->
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

			<!-- group_2 大标题行：返回 + MEMOIR OF LIFE / 目录 / CONTENTS + 右侧切换按钮 section_1 -->
			<!-- 关键：thumbnail_1 + text_4 直接平铺在 group_2 里，不要额外包裹层！ -->
			<view class="book-group-2">
				<image class="book-back__icon" src="/static/memoir_index/back_arrow.png" mode="aspectFit" @tap="onBack"></image>
				<text class="book-back__text" @tap="onBack">返回</text>
				<!-- 大标题 text-group_1 -->
				<view class="book-big-title">
					<text class="book-big-title__en-top">MEMOIR OF LIFE</text>
					<text class="book-big-title__cn">目 录</text>
					<text class="book-big-title__en-bot">CONTENTS</text>
				</view>
				<!-- 切换按钮 section_1（书本↔相册）-->
				<view class="book-switch" @tap="viewMode = 'album'" hover-class="switch-hover">
					<image class="book-switch__icon" src="/static/memoir_index/switch_toggle.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 装饰线 group_3 -->
			<view class="book-divider">
				<view class="book-divider__line book-divider__line--left"></view>
				<view class="book-divider__dot"></view>
				<view class="book-divider__line book-divider__line--right"></view>
			</view>

			<!-- 朗读 + 添加 group_4 -->
			<view class="book-actions">
				<view class="book-chip" @tap="onReadAloud">
					<text class="book-chip__emoji">🔊</text>
					<text class="book-chip__text">朗读目录</text>
				</view>
				<view class="book-chip book-chip--primary" @tap="onAdd">
					<image class="book-chip__icon" src="/static/memoir_index/add_icon.png" mode="aspectFit"></image>
					<text class="book-chip__text">添加回忆</text>
				</view>
			</view>

			<!-- scroll-view 章节列表 -->
			<scroll-view class="book-chapters" scroll-y :show-scrollbar="false">
				<view
					v-for="(ch, i) in chapters"
					:key="ch.id"
					class="book-chapter"
					@tap="onOpenChapter(ch)"
				>
					<view class="book-chapter__mark"></view>
					<text class="book-chapter__idx">{{ pad2(ch.sort) }}</text>
					<view class="book-chapter__texts">
						<view class="book-chapter__title-row">
							<text class="book-chapter__title">{{ ch.name }}</text>
							<!-- 第一章右边那个延伸线（蓝湖 group_7 里才显示） -->
							<image v-if="i === 0" class="book-chapter__arrow" src="/static/memoir_index/chapter_arrow.png" mode="aspectFit"></image>
						</view>
						<text class="book-chapter__sub">{{ ch.subtitle }}</text>
					</view>
					<text class="book-chapter__page">{{ ch.page }}</text>
				</view>

				<!-- 底部 group_17 翻页导航：左右两端对齐 + 目录居中 -->
				<view class="book-footer-nav">
					<view class="book-footer-nav__left">
						<text class="book-footer-nav__prev">‹</text>
						<text class="book-footer-nav__link">封面</text>
					</view>
					<text class="book-footer-nav__center">目录</text>
					<view class="book-footer-nav__right">
						<text class="book-footer-nav__next">翻开第 1 篇</text>
						<text class="book-footer-nav__next-arrow">›</text>
					</view>
				</view>

				<view style="height: 120rpx"></view>
			</scroll-view>

		</view>

		<!-- ============ 相册式 viewMode='album' ============ -->
		<view v-else class="album-view">

			<!-- 状态栏 -->
			<view class="album-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

			<!-- 顶部标题条 box_3 -->
			<view class="album-top">
				<view class="album-top__dot"></view>
				<text class="album-top__text">忆伴 · 实体回忆录</text>
				<!-- 切换回书本按钮 -->
				<view class="album-top__switch" @tap="viewMode = 'book'" hover-class="switch-hover">
					<image class="album-top__switch-icon" src="/static/memoir_index/switch_toggle.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 返回行 image-text_1 -->
			<view class="album-back" @tap="onBack">
				<image class="album-back__icon" src="/static/memoir_index/back_arrow.png" mode="aspectFit"></image>
				<text class="album-back__text">返回</text>
			</view>

			<!-- 相册网格 -->
			<view class="album-grid">
				<!-- 第 1 行 group_2 -->
				<view class="album-row">
					<view
						v-for="item in row01"
						:key="item.name"
						class="album-card"
						@tap="onOpenChapter(item)"
					>
						<view class="album-card__cover">
							<image class="album-card__img" :src="item.cover" mode="aspectFill"></image>
						</view>
						<text class="album-card__name">{{ item.name }}</text>
					</view>
				</view>

				<!-- 第 2 行 group_5 -->
				<view class="album-row">
					<view
						v-for="item in row02"
						:key="item.name"
						class="album-card"
						@tap="onOpenChapter(item)"
					>
						<view class="album-card__cover">
							<image class="album-card__img" :src="item.cover" mode="aspectFill"></image>
						</view>
						<text class="album-card__name">{{ item.name }}</text>
					</view>
				</view>

				<!-- 第 3 行 group_10 -->
				<view class="album-row">
					<view
						v-for="item in row03"
						:key="item.name"
						class="album-card"
						@tap="onOpenChapter(item)"
					>
						<view class="album-card__cover">
							<image class="album-card__img" :src="item.cover" mode="aspectFill"></image>
						</view>
						<text class="album-card__name">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<!-- 底部绿色胶囊 group_16 -->
			<view class="album-tip">
				<image class="album-tip__icon" src="/static/memoir_index/tip_icon.png" mode="aspectFit"></image>
				<text class="album-tip__text">轻触任意照片可看大图与回忆故事</text>
				<!-- 装饰圆点 group_17 -->
				<view class="album-tip__deco"></view>
			</view>

		</view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

// ====== 修复 #1：目录内容硬编码，不管 store 有没有都固定显示 ======
const HARDCODE_CHAPTERS = [
	{ id: 'ch1', sort: 1,  name: '我的个人简介',   subtitle: '老伴秀兰与女儿芳芳 · 温暖的家',                   page: '01 页',  categoryId: 'c7' },
	{ id: 'ch2', sort: 2,  name: '认识我的家人',   subtitle: '老伴秀兰与女儿芳芳 · 温暖的家',                   page: '02 页',  categoryId: 'c1' },
	{ id: 'ch3', sort: 3,  name: '我的人生阶段',   subtitle: '青年时代与知青岁月 · 工厂奋斗年华',               page: '12 页', categoryId: 'c2' },
	{ id: 'ch4', sort: 4,  name: '我生活过的地方', subtitle: '老家小四合院、青杠树街与蓉城记忆',                page: '20 页', categoryId: 'c3' },
	{ id: 'ch5', sort: 5,  name: '那些重要的日子', subtitle: '金婚纪念日、芳芳大学毕业与退休那一天',             page: '28 页', categoryId: 'c4' },
	{ id: 'ch6', sort: 6,  name: '我的老相册',     subtitle: '黑白胶片、老战友留影与全家福照片集',              page: '36 页', categoryId: 'c5' }
]

// 相册式 6 张卡片（严格按蓝湖相册版目录顺序：老相册在前、重要日子在后）
const ALBUM_ITEMS = [
	{ name: '我的个人简介',   cover: '/static/memoir_index/album_ch1.png', categoryId: 'c7' },
	{ name: '认识我的家人',   cover: '/static/memoir_index/album_ch2.png', categoryId: 'c1' },
	{ name: '我的人生阶段',   cover: '/static/memoir_index/album_ch3.png', categoryId: 'c2' },
	{ name: '我生活过的地方', cover: '/static/memoir_index/album_ch4.png', categoryId: 'c3' },
	{ name: '我的老相册',     cover: '/static/memoir_index/album_ch5.png', categoryId: 'c5' },
	{ name: '那些重要的日子', cover: '/static/memoir_index/album_ch6.png', categoryId: 'c4' }
]

export default {
	data() {
		return {
			statusBarHeight: 20,
			viewMode: 'book' // 'book' | 'album'
		}
	},
	computed: {
		store() { return useStore() },
		// 书本式章节（硬编码，不依赖 store）
		chapters() { return HARDCODE_CHAPTERS },
		// 相册式 3 行，每行 2 张
		row01() { return ALBUM_ITEMS.slice(0, 2) },
		row02() { return ALBUM_ITEMS.slice(2, 4) },
		row03() { return ALBUM_ITEMS.slice(4, 6) }
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
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/memory/memoir' }) })
		},
		onReadAloud() {
			uni.showToast({ title: '朗读功能开发中', icon: 'none' })
		},
		onAdd() {
			uni.navigateTo({ url: '/pages/memory/addRecall' })
		},
		onOpenChapter(item) {
			const name = item.name
			const categoryId = item.categoryId
			const memories = (this.store.memoir && this.store.memoir.memories) || []
			const inChapter = memories.filter(m => m.categoryId === categoryId)
			if (inChapter.length > 0) {
				// 详情页还没建 → 先弹窗展示第一条内容
				const first = inChapter[0]
				uni.showModal({
					title: first.title || name,
					content: first.desc || '(暂无正文)',
					showCancel: false,
					confirmText: '知道了'
				})
			} else {
				uni.showToast({ title: name + ' · 暂无内容', icon: 'none' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>

.page {
	width: 750rpx;
	min-height: 100vh;
	position: relative;
}
.switch-hover { opacity: 0.55; }

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
	width: 750rpx; height: 100%;
	z-index: 0;
}
.book-status-bar { position: relative; z-index: 1; }

/* 顶部信息条 text-wrapper_1 */
.book-top-bar {
	position: relative; z-index: 1;
	padding: 0 64rpx;
}
.book-top-bar__divider {
	display: flex; flex-direction: row;
	justify-content: space-between; align-items: center;
	height: 50rpx;
	border: 1rpx solid rgba(227, 220, 203, 0.8);
	margin-top: 48rpx; padding: 0 16rpx;
}
.book-top-bar__left {
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 24rpx; letter-spacing: 1rpx;
	color: rgba(87, 82, 74, 1); line-height: 50rpx;
}
.book-top-bar__right {
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 24rpx; letter-spacing: 0.5rpx;
	color: rgba(87, 82, 74, 1); line-height: 50rpx;
}

/* ============ group_2 顶部返回 + 大标题 + 切换按钮（100% 蓝湖） ============ */
.book-group-2 {
	position: relative; z-index: 1;
	width: 652rpx;
	height: 154rpx;
	margin: 30rpx 0 0 78rpx;
	display: flex;
	flex-direction: row;
	/* 蓝湖没设 align-items → 默认 stretch（让子元素撑满） */
}
/* thumbnail_1 回退箭头（真实素材 返回@2x.png 32×32px，显示 32rpx） */
.book-back__icon {
	width: 32rpx;
	height: 32rpx;
	margin-top: 6rpx;
	margin-right: 0;
	flex-shrink: 0;
}
/* text_4 "返回" —— white-space: nowrap 是关键！不让换行 */
.book-back__text {
	font-family: "PingFang SC", sans-serif;
	font-weight: 500;
	font-size: 32rpx;
	color: rgba(21, 29, 26, 1);
	width: 64rpx;
	height: 44rpx;
	margin: 4rpx 0 0 8rpx;
	line-height: 44rpx;
	text-align: center;
	white-space: nowrap;
}
/* 返回这两个元素直接平铺，不包额外 width */

/* text-group_1 大标题容器 */
.book-big-title {
	width: 306rpx;
	height: 152rpx;
	margin: 2rpx 0 0 72rpx;
	display: flex;
	flex-direction: column;
	flex-shrink: 0; /* 不让 flex 压缩！ */
}
.book-big-title__en-top {
	font-family: "PingFang SC", sans-serif;
	font-weight: 400;
	font-size: 24rpx;
	letter-spacing: 8.4rpx;
	color: rgba(155, 100, 56, 1);
	line-height: 32rpx;
	text-align: center;
	white-space: nowrap;
}
.book-big-title__cn {
	font-family: "PingFang SC", sans-serif;
	font-weight: 500;
	font-size: 60rpx;
	letter-spacing: 12rpx;
	color: rgba(45, 42, 38, 1);
	line-height: 72rpx;
	text-align: center;
	white-space: nowrap;
	margin: 4rpx 0;
}
.book-big-title__en-bot {
	font-family: "PingFang SC", sans-serif;
	font-weight: 400;
	font-size: 24rpx;
	letter-spacing: 2.4rpx;
	color: rgba(87, 82, 74, 1);
	line-height: 32rpx;
	text-align: center;
	white-space: nowrap;
}
/* section_1 切换按钮 —— 纯 33×33，不要任何背景/圆角/阴影！ */
.book-switch {
	margin-left: 120rpx;
	width: 66rpx;
	height: 66rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	flex-shrink: 0;
}
.book-switch__icon { width: 64rpx; height: 64rpx; }

/* ============ 装饰线 group_3 ============ */
.book-divider {
	position: relative; z-index: 1;
	display: flex; flex-direction: row; align-items: center; justify-content: center;
	margin: 16rpx 0 0 268rpx;
	width: 246rpx;
}
.book-divider__line { height: 2rpx; }
.book-divider__line--left { width: 96rpx; background-color: #D1C7B2; }
.book-divider__line--right { width: 96rpx; background-color: #D1C7B2; margin-left: 16rpx; }
.book-divider__dot { width: 22rpx; height: 22rpx; background-color: #9B6438; border-radius: 50%; }

/* ============ 朗读 + 添加 group_4 ============ */
.book-actions {
	position: relative; z-index: 1;
	display: flex; flex-direction: row; justify-content: space-between;
	padding: 24rpx 100rpx 0;
}
.book-chip {
	height: 68rpx; padding: 0 40rpx;
	display: flex; flex-direction: row; align-items: center;
	background-color: rgba(241, 234, 217, 1);
	border: 1rpx solid rgba(223, 213, 191, 1);
	border-radius: 999rpx;
	box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);

	&__emoji { font-size: 28rpx; color: #9B6438; margin-right: 6rpx; }
	&__icon { width: 40rpx; height: 40rpx; margin-right: 6rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 28rpx; color: rgba(45, 42, 38, 1);
	}

	&--primary {
		background-color: rgba(201, 156, 53, 0.95);
		border-color: rgba(180, 130, 30, 0.5);
	}
	&--primary .book-chip__text { color: #FFFFFF; }
}

/* ============ 章节列表 ============ */
.book-chapters {
	position: relative; z-index: 1;
	margin-top: 20rpx; padding: 0 32rpx;
	height: calc(100vh - 540rpx);
}
.book-chapter {
	display: flex; flex-direction: row; align-items: center;
	height: 92rpx; margin-top: 30rpx;

	&__mark {
		width: 12rpx; height: 12rpx;
		background-color: #9B6438; border-radius: 50%;
		margin-right: 20rpx;
	}
	&__idx {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 36rpx; letter-spacing: 3rpx;
		color: rgba(155, 100, 56, 0.85); width: 50rpx; text-align: left;
	}
	&__texts {
		flex: 1; display: flex; flex-direction: column;
		justify-content: space-between; height: 70rpx;
	}
	&__title-row { display: flex; flex-direction: row; align-items: center; }
	&__title {
		font-family: "Noto Serif SC", serif; font-weight: 600;
		font-size: 32rpx; color: rgba(45, 42, 38, 1);
	}
	&__arrow { width: 264rpx; height: 4rpx; margin-left: 14rpx; opacity: 0.5; }
	&__sub {
		font-family: "PingFang SC", sans-serif; font-weight: 400;
		font-size: 24rpx; color: rgba(117, 110, 99, 0.75);
	}
	&__page {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 26rpx; letter-spacing: 1rpx;
		color: rgba(155, 100, 56, 0.7);
	}
}

/* ============ 底部翻页导航：两端对齐 + 目录居中 ============ */
.book-footer-nav {
	margin-top: 60rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between; /* 关键！两端对齐 */
	height: 88rpx;
	border-top: 1rpx solid rgba(209, 199, 178, 0.6);
	padding: 22rpx 10rpx 0;

	/* 左：‹封面 */
	&__left {
		display: flex; flex-direction: row; align-items: center;
		flex: 0 0 auto;
	}
	&__prev { font-size: 36rpx; color: rgba(155, 100, 56, 0.5); margin-right: 8rpx; }
	&__link {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 26rpx; color: rgba(117, 110, 99, 0.6);
	}
	/* 中：目录（居中，flex:1 占满剩余空间然后 text-align:center） */
	&__center {
		flex: 1;
		font-family: "PingFang SC", sans-serif; font-weight: 700;
		font-size: 28rpx; color: rgba(155, 100, 56, 1);
		letter-spacing: 4rpx;
		text-align: center;
	}
	/* 右：翻开第 1 篇 › */
	&__right {
		display: flex; flex-direction: row; align-items: center;
		flex: 0 0 auto;
	}
	&__next {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 26rpx; color: rgba(45, 42, 38, 1);
	}
	&__next-arrow { font-size: 32rpx; color: rgba(155, 100, 56, 1); margin-left: 4rpx; }
}

/* ============ 相册式 ============ */
.album-view {
	position: relative; width: 750rpx; min-height: 100vh;
	background-color: #F6F3EA; padding-bottom: 80rpx;
}
.album-status-bar { background-color: #F9F6ED; }

/* 顶栏 box_3 */
.album-top {
	position: relative; width: 750rpx; height: 130rpx;
	border-bottom: 1rpx solid rgba(233, 227, 211, 1);
	display: flex; flex-direction: row; align-items: center;
	background-color: #F9F6ED;

	&__dot { width: 12rpx; height: 12rpx; background-color: #B89F7C; border-radius: 50%; margin-left: 64rpx; }
	&__text {
		font-family: "Noto Serif SC", serif; font-weight: 400;
		font-size: 26rpx; letter-spacing: 1.3rpx;
		color: rgba(117, 110, 99, 1); margin-left: 16rpx;
	}
	/* 切换回书本按钮（圆形胶囊） */
	&__switch {
		position: absolute; right: 48rpx; top: 50%;
		transform: translateY(-50%);
		width: 64rpx; height: 64rpx;
		display: flex; align-items: center; justify-content: center;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 50%;
		box-shadow: 0 4rpx 12rpx rgba(155, 100, 56, 0.12);
	}
	&__switch-icon { width: 48rpx; height: 48rpx; }
}

/* 返回行 */
.album-back {
	display: flex; flex-direction: row; align-items: center;
	padding: 32rpx 0 0 64rpx;
	&__icon { width: 32rpx; height: 32rpx; margin-right: 8rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 32rpx; color: rgba(21, 29, 26, 1);
	}
}

/* 相册网格 */
.album-grid { display: flex; flex-direction: column; padding: 22rpx 40rpx 0; }
.album-row { display: flex; flex-direction: row; justify-content: space-between; margin-top: 80rpx; }
.album-row:first-child { margin-top: 22rpx; }

.album-card {
	width: 330rpx; height: 336rpx;
	background-color: #FFFFFF;
	border-radius: 32rpx;
	box-shadow: 0 8rpx 32rpx -4rpx rgba(44, 53, 49, 0.06);
	display: flex; flex-direction: column; overflow: hidden;

	&__cover {
		width: 298rpx; height: 224rpx;
		margin: 16rpx 0 0 16rpx;
		background-color: #E6F0EA; border-radius: 24rpx; overflow: hidden;
	}
	&__img { width: 100%; height: 100%; }
	&__placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #E6F0EA, #D4E5DC); }
	&__name {
		font-family: "Noto Serif SC", serif; font-weight: 500;
		font-size: 40rpx; color: rgba(21, 29, 26, 1);
		margin: 20rpx 0 24rpx 24rpx;
	}
}

/* 底部绿色胶囊 group_16 */
.album-tip {
	position: relative; margin: 128rpx auto 70rpx;
	width: 536rpx; height: 56rpx;
	background-color: #A1F3C9;
	border-radius: 999rpx;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 24rpx; box-sizing: border-box;

	&__icon { width: 40rpx; height: 40rpx; margin-right: 12rpx; }
	&__text {
		flex: 1;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 30rpx; color: rgba(66, 72, 68, 1); text-align: center;
	}
	/* 装饰圆点 group_17 —— 胶囊上的小绿点 */
	&__deco {
		position: absolute; left: 18rpx; top: 8rpx;
		width: 40rpx; height: 40rpx;
		background-color: rgba(161, 243, 201, 0.5);
		border-radius: 50%;
	}
}
</style>
