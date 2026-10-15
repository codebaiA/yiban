<template>
	<view class="yb-empty">
		<image class="yb-empty__img" :src="imgSrc" mode="aspectFit"></image>
		<text class="yb-empty__title">{{ title }}</text>
		<text v-if="desc" class="yb-empty__desc">{{ desc }}</text>
		<slot></slot>
	</view>
</template>

<script>
import { icon } from '../services/iconMap.js'

export default {
	name: 'yb-empty',
	props: {
		title: { type: String, default: '这里还没有内容' },
		desc: { type: String, default: '' },
		iconName: { type: String, default: 'read' }
	},
	computed: {
		imgSrc() {
			return icon(this.iconName)
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: $yb-sp-xxl $yb-sp-lg;

	&__img {
		width: 120rpx;
		height: 120rpx;
		opacity: 0.45;
		margin-bottom: $yb-sp-md;
	}

	&__title {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-m);
		color: $yb-c-text-sub;
		font-weight: 500;
	}

	&__desc {
		margin-top: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub3;
		text-align: center;
		line-height: 1.6;
	}
}
</style>
