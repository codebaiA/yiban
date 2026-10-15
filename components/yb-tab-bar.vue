<template>
	<view class="yb-tabbar">
		<!-- box_5: 750×169rpx 透明容器，仅顶部投影 -->
		<view class="yb-tabbar__bar">

			<!-- 首页（section_4：选中态深绿胶囊 171×106rpx） -->
			<view
				class="tab-home"
				:class="{ 'is-inactive': current !== 'index' }"
				@tap="switchTo('index')"
			>
				<image class="tab-home__icon" :src="homeIcon" mode="aspectFit"></image>
				<text class="tab-home__text">首页</text>
			</view>

			<!-- 我的回忆（image_7 图标 37×50 + text_14 文字 119×38） -->
			<view
				class="tab-memoir"
				:class="{ 'is-active': current === 'memory' }"
				@tap="switchTo('memory')"
			>
				<image class="tab-memoir__icon" src="/static/TabBar_icons/我的回忆tab.png" mode="aspectFit"></image>
				<text class="tab-memoir__text">我的回忆</text>
			</view>

			<!-- 我的（image-text_12：图标 37×40 + 文字 60×38） -->
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
		},
		/* 首页图标：选中用白色版，未选中用深灰版（蓝湖 image_6） */
		homeIcon() {
			return this.current === 'index'
				? '/static/TabBar_icons/首页.png'
				: '/static/TabBar_icons/首页未选中.png'
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
   蓝湖 1:1 还原（rpx 单位，源画布 750×169 rpx）
   ============================================================ */

/* ========= box_5：整体容器（透明，仅顶部投影） ========= */
.yb-tabbar {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 750rpx;
	z-index: 999;
	background-color: rgba(255, 255, 255, 0); /* 蓝湖 box_5 背景透明 */
	padding-bottom: env(safe-area-inset-bottom);

	&__bar {
		position: relative;
		width: 750rpx;
		height: 169rpx;
		/* 蓝湖 box_5: 0 -8rpx 24rpx -4rpx rgba(44,53,49,0.06) */
		box-shadow: 0 -8rpx 24rpx -4rpx rgba(44, 53, 49, 0.06);
	}
}

/* ========= 首页（section_4：171×106rpx 深绿胶囊） ========= */
.tab-home {
	position: absolute;
	left: 67rpx;   /* 蓝湖 margin-left:67rpx */
	top: 25rpx;    /* 蓝湖 margin-top:25rpx */
	width: 171rpx;
	height: 106rpx;
	border-radius: 19229rpx; /* 蓝湖 border-radius */
	background-color: rgba(72, 101, 86, 1); /* #486556 蓝湖 background-color */
	box-shadow: 0 4rpx 12rpx 0 rgba(72, 101, 86, 0.25); /* 蓝湖 shadow */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0; /* 蓝湖 image-text_11 margin:12rpx 0 0 */
	box-sizing: border-box;

	&__icon {
		width: 37rpx;   /* 蓝湖 image_6 */
		height: 44rpx;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;      /* 蓝湖 text-group_9 */
		letter-spacing: 1rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 38rpx;
	}

	/* 未选中：去掉胶囊，文字/图标转为深灰（蓝湖 text-group_10 色值） */
	&.is-inactive {
		background-color: transparent;
		box-shadow: none;
	}
	&.is-inactive .tab-home__text {
		color: rgba(66, 72, 68, 1);
	}
}

/* ========= 我的回忆（image_7 图标 + text_14 文字） ========= */
.tab-memoir {
	position: absolute;
	left: 315rpx;  /* 蓝湖 text_14 left:315rpx */
	top: 35rpx;    /* 蓝湖 image_7 margin-top:35rpx */
	width: 119rpx; /* 蓝湖 text_14 width:119rpx */
	display: flex;
	flex-direction: column;
	align-items: center;

	&__icon {
		width: 37rpx;   /* 蓝湖 image_7 */
		height: 50rpx;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;      /* 蓝湖 text_14 */
		letter-spacing: 1rpx;
		font-weight: 500;
		color: rgba(66, 72, 68, 1);
		line-height: 38rpx;
		white-space: nowrap;
		/* 蓝湖 icon 底 85rpx 与文字顶 83rpx 有 2rpx 叠合 */
		margin-top: -2rpx;
	}

	&.is-active .tab-memoir__text {
		color: #E97A37;
	}
}

/* ========= 我的（image-text_12：60×79rpx） ========= */
.tab-mine {
	position: absolute;
	left: 571rpx;  /* 蓝湖 margin-left:177rpx 后的实际左边距 */
	top: 38rpx;    /* 蓝湖 image-text_12 margin-top:38rpx */
	width: 60rpx;  /* 蓝湖 image-text_12 width:60rpx */
	height: 79rpx; /* 蓝湖 image-text_12 height:79rpx */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;

	&__icon {
		width: 37rpx;   /* 蓝湖 image_8 */
		height: 40rpx;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-size: 29rpx;      /* 蓝湖 text-group_10 */
		letter-spacing: 1rpx;
		font-weight: 500;
		color: rgba(66, 72, 68, 1);
		line-height: 38rpx;
		white-space: nowrap;
	}

	&.is-active .tab-mine__text {
		color: #E97A37;
	}
}
</style>
