<template>
	<view class="yb-nav">
		<view class="yb-nav__side" @tap="onBack">
			<text v-if="showBack" class="yb-nav__back">返回</text>
		</view>
		<text class="yb-nav__title">{{ title }}</text>
		<view class="yb-nav__side yb-nav__side--right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'yb-nav-bar',
	props: {
		title: { type: String, default: '' },
		showBack: { type: Boolean, default: true }
	},
	methods: {
		onBack() {
			if (!this.showBack) return
			this.$emit('back')
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack({ delta: 1 })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-nav {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 88rpx;
	padding: 0 $yb-sp-sm;
	background: transparent;

	&__side {
		width: 140rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&--right {
			justify-content: flex-end;
		}
	}

	&__back {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
		color: $yb-c-text-sub;
	}

	&__title {
		flex: 1;
		text-align: center;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-l);
		font-weight: 500;
		color: $yb-c-text-2;
	}
}
</style>
