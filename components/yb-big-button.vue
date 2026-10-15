<template>
	<button
		class="yb-btn"
		:class="['yb-btn--' + variant, 'yb-btn--' + size, disabled ? 'is-disabled' : '']"
		:disabled="disabled"
		:loading="loading"
		hover-class="yb-btn--hover"
		@tap="onTap"
	>
		<image v-if="iconName" class="yb-btn__icon" :src="iconSrc" mode="aspectFit"></image>
		<text class="yb-btn__text">{{ text }}</text>
	</button>
</template>

<script>
import { icon } from '../services/iconMap.js'

export default {
	name: 'yb-big-button',
	props: {
		text: { type: String, default: '' },
		variant: { type: String, default: 'primary' },
		size: { type: String, default: 'md' },
		iconName: { type: String, default: '' },
		disabled: { type: Boolean, default: false },
		loading: { type: Boolean, default: false }
	},
	computed: {
		iconSrc() {
			return this.iconName ? icon(this.iconName) : ''
		}
	},
	methods: {
		onTap(e) {
			if (this.disabled || this.loading) return
			this.$emit('click', e)
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-btn {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: $yb-r-lg;
	min-height: $yb-tap-min;
	padding: 0 $yb-sp-lg;

	&__icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: $yb-sp-xs;
	}

	&__text {
		font-family: $yb-font-sans;
		font-weight: 500;
		font-size: var(--yb-fs-mp);
		line-height: 1.3;
	}

	/* 尺寸 */
	&--sm { min-height: 88rpx; padding: 0 $yb-sp-md; }
	&--md { min-height: $yb-tap-min; }
	&--lg { min-height: $yb-tap-lg; padding: 0 $yb-sp-xl; }

	/* 变体 */
	&--primary {
		background: $yb-c-orange-1;
		.yb-btn__text { color: #fff; }
	}
	&--danger {
		background: $yb-c-danger;
		.yb-btn__text { color: #fff; }
	}
	&--green {
		background: $yb-c-green-2;
		.yb-btn__text { color: #fff; }
	}
	&--soft {
		background: $yb-c-bg-page;
		.yb-btn__text { color: $yb-c-orange-3; }
	}
	&--outline {
		background: transparent;
		border: 2rpx solid $yb-c-orange-1;
		.yb-btn__text { color: $yb-c-orange-3; }
	}
	&--ghost {
		background: $yb-c-bg-grey;
		.yb-btn__text { color: $yb-c-text-sub; }
	}

	&--hover { opacity: 0.86; }

	&.is-disabled {
		opacity: 0.45;
	}
}
</style>
