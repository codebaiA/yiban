<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<!-- 加载中 -->
		<yb-loading v-if="!loaded" text="加载中…"></yb-loading>

		<!-- 未找到成员 -->
		<yb-error
			v-else-if="!member"
			text="没有找到这位家人"
			retry-text="返回"
			@retry="goBack"
		></yb-error>

		<template v-else>
			<!-- 头部：大头像 + 姓名 + 关系 -->
			<view class="hero">
				<view class="hero__avatar" :class="member.avatar ? '' : 'hero__avatar--ph'">
					<image v-if="member.avatar" class="hero__img" :src="member.avatar" mode="aspectFill"></image>
					<text v-else class="hero__ph-text">{{ (member.name || '?').slice(0, 1) }}</text>
				</view>
				<text class="hero__name">{{ member.name }}</text>
				<view class="hero__relation">
					<text class="hero__relation-text">是我的{{ member.relation }}</text>
				</view>
			</view>

			<!-- 信息卡（字段为空不展示，不虚构） -->
			<yb-card>
				<view v-if="member.intro" class="block">
					<text class="block__title yb-serif">关于TA</text>
					<text class="block__text">{{ member.intro }}</text>
				</view>
				<view class="rows">
					<view v-if="member.age" class="row">
						<text class="row__label">年龄</text>
						<text class="row__value">{{ member.age }} 岁</text>
					</view>
					<view v-if="member.city" class="row">
						<text class="row__label">现居</text>
						<text class="row__value">{{ member.city }}</text>
					</view>
					<view v-if="member.phone" class="row">
						<text class="row__label">电话</text>
						<text class="row__value">{{ member.phone }}</text>
					</view>
					<view class="row">
						<text class="row__label">辈分</text>
						<text class="row__value">{{ member.generationName || '未分组' }}</text>
					</view>
				</view>
			</yb-card>

			<text class="page__tip">资料由家属维护，如有变更请联系家属更新</text>
		</template>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return { memberId: '', loaded: false }
	},
	computed: {
		store() { return useStore() },
		family() { return this.store.family },
		serifReady() { return this.store.ui.serifReady },
		member() {
			return (this.family.members || []).find(m => m.id === this.memberId) || null
		}
	},
	onLoad(options) {
		this.memberId = options && options.id ? decodeURIComponent(options.id) : ''
	},
	onShow() {
		// 分包页同样在 onShow 刷新，保证家属端改完返回可见最新数据
		actions.refreshFamily().then(() => {
			this.loaded = true
		})
	},
	methods: {
		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $yb-c-bg-page;
	padding: $yb-sp-md;
}

.hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: $yb-c-bg-white;
	border-radius: $yb-r-lg;
	padding: $yb-sp-lg;
	box-shadow: $yb-shadow-card;

	&__avatar {
		width: 176rpx;
		height: 176rpx;
		border-radius: 50%;
		background: $yb-c-bg-grey;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		&--ph { background: $yb-c-teal-2; }
	}

	&__img {
		width: 100%;
		height: 100%;
	}

	&__ph-text {
		font-family: $yb-font-sans;
		font-size: 72rpx;
		font-weight: 500;
		color: $yb-c-green-2;
	}

	&__name {
		margin-top: $yb-sp-md;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xl);
		font-weight: 500;
		color: $yb-c-text-1;
	}

	&__relation {
		margin-top: $yb-sp-xs;
		background: $yb-c-orange-1;
		border-radius: $yb-r-pill;
		padding: 6rpx $yb-sp-md;
	}

	&__relation-text {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: #fff;
	}
}

.yb-card {
	margin-top: $yb-sp-md;
}

.block {
	border-bottom: 2rpx solid $yb-c-line;
	padding-bottom: $yb-sp-sm;

	&__title {
		display: block;
		font-family: $yb-font-serif;
		font-size: $yb-fs-serif-m;
		font-weight: 500;
		color: $yb-c-brown-1;
		margin-bottom: $yb-sp-xs;
	}

	&__text {
		display: block;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
		color: $yb-c-text-2;
		line-height: 1.8;
	}
}

.rows {
	padding-top: $yb-sp-xs;
}

.row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	min-height: $yb-tap-min;
	border-bottom: 2rpx solid $yb-c-line;

	&:last-child { border-bottom: none; }

	&__label {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
		color: $yb-c-text-sub;
	}

	&__value {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-mp);
		font-weight: 500;
		color: $yb-c-text-2;
	}
}

.page__tip {
	display: block;
	margin-top: $yb-sp-lg;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-xs);
	color: $yb-c-text-sub3;
	text-align: center;
}
</style>
