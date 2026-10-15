<template>
	<view class="yb-error">
		<text class="yb-error__title">出了点小问题</text>
		<text class="yb-error__msg">{{ message }}</text>
		<yb-big-button size="sm" variant="outline" text="重新加载" @click="$emit('retry')"></yb-big-button>
	</view>
</template>

<script>
export default {
	name: 'yb-error',
	props: {
		message: { type: String, default: '内容没有加载出来' }
	}
}
</script>

<style lang="scss" scoped>
.yb-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: $yb-sp-xxl $yb-sp-lg;

	&__title {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-m);
		font-weight: 500;
		color: $yb-c-text-2;
	}

	&__msg {
		margin: $yb-sp-xs 0 $yb-sp-md;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub;
		text-align: center;
		line-height: 1.6;
	}
}
</style>
