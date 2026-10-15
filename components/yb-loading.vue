<template>
	<view class="yb-loading">
		<view class="yb-loading__dot yb-loading__dot--1"></view>
		<view class="yb-loading__dot yb-loading__dot--2"></view>
		<view class="yb-loading__dot yb-loading__dot--3"></view>
		<text v-if="text" class="yb-loading__text">{{ text }}</text>
	</view>
</template>

<script>
export default {
	name: 'yb-loading',
	props: {
		text: { type: String, default: '' }
	}
}
</script>

<style lang="scss" scoped>
.yb-loading {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: $yb-sp-lg 0;

	&__dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background: $yb-c-orange-1;
		margin: 0 8rpx;
		opacity: 0.35;
	}

	&__dot--1 { opacity: 1; }
	&__dot--2 { opacity: 0.6; }
	&__dot--3 { opacity: 0.35; }

	&__text {
		margin-left: $yb-sp-sm;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub;
	}
}
</style>
