<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<view class="page__head">
			<text class="yb-serif page__title">目　录</text>
			<text class="page__sub">CONTENTS</text>
		</view>

		<yb-card v-for="ch in chapters" :key="ch.id" clickable @click="noop(ch)">
			<text class="chapter__no">{{ ch.id.slice(2) }}</text>
			<text class="yb-serif chapter__name">{{ ch.name }}</text>
			<text class="chapter__sub">{{ ch.subtitle }}</text>
		</yb-card>

		<view class="page__state">
			<text class="page__state-text">S0 骨架：章节 {{ chapters.length }} 条 / 回忆 {{ memoir.memories.length }} 条 / 当前视图 {{ ui.viewMode }}</text>
			<yb-big-button size="sm" variant="outline" :text="ui.viewMode === 'toc' ? '切到图文视图' : '切到目录视图'" @click="toggleView"></yb-big-button>
		</view>

		<yb-tab-bar></yb-tab-bar>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import { chapters } from '../../services/defaults.js'

export default {
	data() {
		return { chapters }
	},
	computed: {
		store() { return useStore() },
		ui() { return this.store.ui },
		memoir() { return this.store.memoir },
		serifReady() { return this.store.ui.serifReady }
	},
	onShow() {
		actions.refreshMemoir()
	},
	methods: {
		noop(ch) {
			uni.showToast({ title: ch.name + '（S2 阶段实现）', icon: 'none' })
		},
		toggleView() {
			actions.setViewMode(this.ui.viewMode === 'toc' ? 'gallery' : 'toc')
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $yb-c-bg-page;
	padding: $yb-sp-md;
	padding-bottom: 220rpx;

	&__head {
		padding: $yb-sp-md 0 $yb-sp-lg;
		text-align: center;
	}

	&__title {
		display: block;
		font-size: var(--yb-fs-serif-title, 58rpx);
		font-weight: 700;
		color: $yb-c-text-3;
		letter-spacing: 8rpx;
	}

	&__sub {
		display: block;
		margin-top: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xxs);
		color: $yb-c-text-sub3;
		letter-spacing: 4rpx;
	}

	&__state {
		margin-top: $yb-sp-lg;
	}

	&__state-text {
		display: block;
		margin-bottom: $yb-sp-sm;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub3;
	}
}

.chapter__no {
	display: block;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-b);
	color: $yb-c-brown-1;
}

.chapter__name {
	display: block;
	margin-top: 4rpx;
	font-size: var(--yb-fs-mp);
	font-weight: 500;
	color: $yb-c-text-3;
}

.chapter__sub {
	display: block;
	margin-top: 6rpx;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-xs);
	color: $yb-c-text-sub3;
}

.yb-card {
	margin-bottom: $yb-sp-sm;
}
</style>
