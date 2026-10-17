<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>
		<yb-card tone="warm">
			<view class="user">
				<image class="user__avatar" :src="patient.avatar || ''" mode="aspectFill"></image>
				<view class="user__info">
					<text class="user__name">{{ patient.name || '—' }}</text>
					<text class="user__meta">{{ patient.age ? patient.age + '岁' : '' }}</text>
				</view>
			</view>
		</yb-card>

		<text class="section__title">使用设置</text>

		<yb-card clickable @click="goSoon('字体大小')">
			<text class="row__title">字体大小</text>
			<text class="row__desc">大字清晰阅读体验</text>
		</yb-card>

		<yb-card clickable @click="goSoon('声音调整')">
			<text class="row__title">声音调整</text>
			<text class="row__desc">说话语速与音量</text>
		</yb-card>

		<yb-card clickable @click="goSoon('使用帮助')">
			<text class="row__title">使用帮助</text>
			<text class="row__desc">怎么跟小忆说话</text>
		</yb-card>

		<yb-card clickable @click="goSoon('关于忆伴')">
			<text class="row__title">关于忆伴</text>
			<text class="row__desc">版本 1.2.0</text>
		</yb-card>

		<yb-card tone="grey" clickable @click="goSoon('家属管理')">
			<text class="row__title">家属管理</text>
			<text class="row__desc">需要家人协助调整？女儿芳芳也可帮您设置</text>
		</yb-card>

		<view class="page__dev">
			<text class="page__dev-title">S0 骨架自检</text>
			<yb-big-button variant="outline" text="打开组件样板页" @click="goShowcase"></yb-big-button>
		</view>

		<yb-tab-bar></yb-tab-bar>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		serifReady() { return this.store.ui.serifReady }
	},
	onShow() {
		actions.refreshPatient()
	},
	methods: {
		goSoon(name) {
			uni.showToast({ title: name + '（S3 阶段实现）', icon: 'none' })
		},
		goShowcase() {
			uni.navigateTo({ url: '/pages/dev/showcase' })
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
}

.user {
	display: flex;
	flex-direction: row;
	align-items: center;

	&__avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: $yb-c-bg-grey;
		margin-right: $yb-sp-md;
	}

	&__info {
		display: flex;
		flex-direction: column;
	}

	&__name {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-l);
		font-weight: 500;
		color: $yb-c-text-2;
	}

	&__meta {
		margin-top: 6rpx;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub;
	}
}

.section__title {
	display: block;
	margin: $yb-sp-lg 0 $yb-sp-sm;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-m);
	color: $yb-c-text-sub;
}

.row__title {
	display: block;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-mp);
	font-weight: 500;
	color: $yb-c-text-2;
}

.row__desc {
	display: block;
	margin-top: 6rpx;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-s);
	color: $yb-c-text-sub;
}

.yb-card {
	margin-bottom: $yb-sp-sm;
}

.page__dev {
	margin-top: $yb-sp-lg;
}

.page__dev-title {
	display: block;
	margin-bottom: $yb-sp-sm;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-s);
	color: $yb-c-text-sub;
}
</style>
