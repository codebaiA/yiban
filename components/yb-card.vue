<template>
	<view class="yb-card" :class="[tone ? 'yb-card--' + tone : '', clickable ? 'is-clickable' : '']" @tap="onTap">
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'yb-card',
	props: {
		tone: { type: String, default: '' },
		clickable: { type: Boolean, default: false }
	},
	methods: {
		onTap(e) {
			if (this.clickable) this.$emit('click', e)
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-card {
	background: $yb-c-bg-white;
	border-radius: $yb-r-lg;
	padding: $yb-sp-md;
	box-shadow: $yb-shadow-card;

	&--warm { background: $yb-c-bg-page; }
	&--grey { background: $yb-c-bg-grey; }
	&--teal { background: $yb-c-teal-3; }
	&--plain { background: transparent; box-shadow: none; }

	&.is-clickable:active { opacity: 0.9; }
}
</style>
