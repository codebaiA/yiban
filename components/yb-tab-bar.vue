<template>
	<view class="yb-tabbar">
		<view class="yb-tabbar__bar">

			<!-- ========== 独立胶囊滑块（唯一的选中态背景）========== -->
			<view
				class="yb-tabbar__indicator"
				:style="indicatorStyle"
			></view>

			<!-- ========== 三个 Tab（统一结构，只有 icon/text 颜色变）========== -->
			<view
				class="tab-item tab-index"
				:class="{ 'is-active': current === 'index' }"
				@tap="switchTo('index')"
			>
				<image class="tab-item__icon" :src="homeIcon" mode="aspectFit"></image>
				<text class="tab-item__text">首页</text>
			</view>

			<view
				class="tab-item tab-memoir"
				:class="{ 'is-active': current === 'memory' }"
				@tap="switchTo('memory')"
			>
				<image class="tab-item__icon" :src="memoirIcon" mode="aspectFit"></image>
				<text class="tab-item__text">我的回忆</text>
			</view>

			<view
				class="tab-item tab-mine"
				:class="{ 'is-active': current === 'mine' }"
				@tap="switchTo('mine')"
			>
				<image class="tab-item__icon" src="/static/TabBar_icons/我的tab.png" mode="aspectFit"></image>
				<text class="tab-item__text">我的</text>
			</view>

		</view>
	</view>
</template>

<script>
// 每个 tab 对应的胶囊滑块位置（rpx）
// 三个胶囊都统一尺寸：171×106rpx，和首页蓝湖设计一致
const INDICATOR_POS = {
	index:  67,   // 首页：left: 67rpx
	memory: 289,  // 我的回忆：居中 = (750 - 171)/2
	mine:   516   // 我的：right 侧 ~516rpx
}

export default {
	data() {
		return {
			// 胶囊位置（rpx），响应式驱动 transition
			indicatorX: INDICATOR_POS.index
		}
	},
	computed: {
		current() {
			const pages = getCurrentPages()
			const route = pages.length ? pages[pages.length - 1].route : ''
			if (route.indexOf('memory') >= 0) return 'memory'
			if (route.indexOf('mine') >= 0) return 'mine'
			return 'index'
		},
		homeIcon() {
			return this.current === 'index'
				? '/static/TabBar_icons/首页.png'
				: '/static/TabBar_icons/首页未选中.png'
		},
		memoirIcon() {
			return this.current === 'memory'
				? '/static/TabBar_icons/我的回忆tab_选中.png'
				: '/static/TabBar_icons/我的回忆tab.png'
		},
		// 胶囊滑块的 transform 样式
		indicatorStyle() {
			// 根据当前 current 计算目标位置
			const targetX = INDICATOR_POS[this.current] || INDICATOR_POS.index
			return {
				transform: `translateX(${targetX}rpx)`
			}
		}
	},
	methods: {
		switchTo(key) {
			const map = {
				index: '/pages/index/index',
				memory: '/pages/memory/memoir',
				mine: '/pages/mine/mine'
			}
			const url = map[key]
			if (!url) return
			const pages = getCurrentPages()
			const route = pages.length ? pages[pages.length - 1].route : ''
			if (route === key || (key === 'index' && route.indexOf('index') >= 0)) return
			uni.switchTab({ url })
		}
	}
}
</script>

<style lang="scss" scoped>
/* ============================================================
   yb-tab-bar：胶囊滑块跟随版
   - 单一独立胶囊 .yb-tabbar__indicator，transition 平滑滑动
   - 三个 tab 统一 .tab-item 结构，只在 is-active 时 icon/text 变色
   ============================================================ */

.yb-tabbar {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 750rpx;
	z-index: 999;
	background-color: rgba(255, 255, 255, 0);
	padding-bottom: env(safe-area-inset-bottom);

	&__bar {
		position: relative;
		width: 750rpx;
		height: 98rpx; /* 49pt：+ 安全区后全面屏总高约 88pt */
		box-shadow: 0 -8rpx 24rpx -4rpx rgba(44, 53, 49, 0.06);
	}

	/* ========== 胶囊滑块 ========== */
	/* 初始在 left: 0，通过 transform: translateX 移动 */
	&__indicator {
		position: absolute;
		left: 0;
		top: 9rpx;
		width: 171rpx;
		height: 80rpx;
		border-radius: 19229rpx; /* 蓝湖胶囊圆 */
		background-color: rgba(72, 101, 86, 1); /* #486556 深墨绿 */
		box-shadow: 0 4rpx 12rpx 0 rgba(72, 101, 86, 0.25);
		/* 关键：平滑过渡 */
		transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		/* 胶囊要在 tab 图标下面 */
		z-index: 0;
	}
}

/* ========== 统一的 tab-item 样式 ========== */
.tab-item {
	position: absolute;
	top: 9rpx;
	width: 171rpx;
	height: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 1; /* 在胶囊上面 */

	&__icon {
		width: 32rpx;
		height: 38rpx;
		transition: opacity 0.2s;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;
		letter-spacing: 1rpx;
		font-weight: 500;
		line-height: 34rpx;
		white-space: nowrap;
		/* 未选中：深灰；选中：白色（在胶囊上）*/
		color: rgba(66, 72, 68, 1);
		transition: color 0.2s;
		margin-top: 2rpx;
	}

	/* 选中态：文字变白，图标稍微放大一点点 */
	&.is-active .tab-item__text {
		color: rgba(255, 255, 255, 1);
		font-weight: 600;
	}

	&.is-active .tab-item__icon {
		transform: scale(1.05);
		transition: transform 0.25s;
	}
}

/* 三个 tab 的 left 定位（都宽 171rpx，统一 top:25rpx） */
.tab-index  { left:  67rpx; }
.tab-memoir { left: 289rpx; }
.tab-mine   { left: 516rpx; }
</style>
