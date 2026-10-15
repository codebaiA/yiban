<template>
	<view class="yb-tabbar">
		<!-- box_5: 三个 tab 横排 -->
		<view class="yb-tabbar__bar">

			<!-- 首页（选中态：胶囊 bg:#486556, 内部 icon 上文字下 flex column） -->
			<view
				class="tab-home"
				:class="{ 'is-inactive': current !== 'index' }"
				@tap="switchTo('index')"
			>
				<image class="tab-home__icon" src="/static/TabBar_icons/首页.png" mode="aspectFit"></image>
				<text class="tab-home__text">首页</text>
			</view>

			<!-- 我的回忆（中间，未选中） -->
			<view
				class="tab-memoir"
				:class="{ 'is-active': current === 'memory' }"
				@tap="switchTo('memory')"
			>
				<image class="tab-memoir__icon" src="/static/TabBar_icons/我的回忆tab.png" mode="aspectFit"></image>
				<text class="tab-memoir__text">我的回忆</text>
			</view>

			<!-- 我的（右侧） -->
			<view
				class="tab-mine"
				:class="{ 'is-active': current === 'mine' }"
				@tap="switchTo('mine')"
			>
				<image class="tab-mine__icon" src="/static/TabBar_icons/我的tab.png" mode="aspectFit"></image>
				<text class="tab-mine__text">我的</text>
			</view>

		</view>
	</view>
</template>

<script>
export default {
	computed: {
		current() {
			const pages = getCurrentPages()
			const route = pages.length ? pages[pages.length - 1].route : ''
			if (route.indexOf('memory') >= 0) return 'memory'
			if (route.indexOf('mine') >= 0) return 'mine'
			return 'index'
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
/* ========= TabBar 整体（蓝湖 box_5） ========= */
.yb-tabbar {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 750rpx;
	z-index: 999;
	background-color: rgba(242, 252, 245, 0.95);
	padding-bottom: env(safe-area-inset-bottom);

	&__bar {
		position: relative;
		width: 750rpx;
		height: 169rpx;
		display: flex;
		flex-direction: row;
		box-shadow: 0 -8rpx 24rpx -4rpx rgba(44, 53, 49, 0.06);
	}
}

/* ========= 首页（选中态胶囊，蓝湖 section_4） ========= */
.tab-home {
	position: absolute;
	left: 67rpx;
	top: 25rpx;
	width: 171rpx;
	height: 106rpx;
	border-radius: 19229rpx; /* 蓝湖 19229rpx = 胶囊形 */
	background-color: rgba(72, 101, 86, 1); /* #486556 */
	box-shadow: 0 4rpx 12rpx rgba(72, 101, 86, 0.25);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0 12rpx;

	&__icon {
		width: 37rpx;
		height: 44rpx;
		/* 蓝湖首页 icon 原色是深色，胶囊内要白色，用 filter 反转 */
		filter: brightness(0) invert(1);
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;
		letter-spacing: 1rpx;
		font-weight: 500;
		color: #ffffff;
		line-height: 38rpx;
	}

	/* 非选中态：胶囊透明，icon 原色 */
	&.is-inactive {
		background-color: transparent;
		box-shadow: none;
	}
	&.is-inactive .tab-home__icon {
		filter: none;
	}
	&.is-inactive .tab-home__text {
		color: #424844;
	}
}

/* ========= 我的回忆（中间 tab） ========= */
.tab-memoir {
	position: absolute;
	left: 315rpx;
	top: 35rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 130rpx;

	&__icon {
		width: 48rpx;
		height: 48rpx;
		object-fit: contain;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;
		letter-spacing: 1rpx;
		font-weight: 500;
		color: #424844;
		line-height: 38rpx;
		margin-top: 6rpx;
	}

	&.is-active .tab-memoir__text {
		color: #E97A37;
	}
}

/* ========= 我的（右侧 tab） ========= */
.tab-mine {
	position: absolute;
	left: 566rpx;
	top: 38rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 80rpx;

	&__icon {
		width: 48rpx;
		height: 48rpx;
		object-fit: contain;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;
		letter-spacing: 1rpx;
		font-weight: 500;
		color: #424844;
		line-height: 38rpx;
		margin-top: 8rpx;
	}

	&.is-active .tab-mine__text {
		color: #E97A37;
	}
}
</style>
