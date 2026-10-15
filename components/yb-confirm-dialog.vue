<template>
	<view v-if="visible" class="yb-dialog" @tap.stop="noop">
		<view class="yb-dialog__mask" @tap="onCancel"></view>
		<view class="yb-dialog__panel">
			<text class="yb-dialog__title">{{ title }}</text>
			<text v-if="content" class="yb-dialog__content">{{ content }}</text>
			<slot></slot>
			<view class="yb-dialog__actions">
				<yb-big-button size="sm" variant="ghost" :text="cancelText" @click="onCancel"></yb-big-button>
				<yb-big-button size="sm" :variant="danger ? 'danger' : 'primary'" :text="confirmText" @click="onConfirm"></yb-big-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'yb-confirm-dialog',
	props: {
		visible: { type: Boolean, default: false },
		title: { type: String, default: '请确认' },
		content: { type: String, default: '' },
		confirmText: { type: String, default: '确定' },
		cancelText: { type: String, default: '取消' },
		danger: { type: Boolean, default: false }
	},
	methods: {
		noop() {},
		onCancel() { this.$emit('cancel') },
		onConfirm() { this.$emit('confirm') }
	}
}
</script>

<style lang="scss" scoped>
.yb-dialog {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 900;

	&__mask {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(43, 32, 20, 0.42);
	}

	&__panel {
		position: absolute;
		left: 48rpx;
		right: 48rpx;
		top: 50%;
		transform: translateY(-50%);
		background: #fff;
		border-radius: $yb-r-xl;
		padding: $yb-sp-lg;
		box-shadow: $yb-shadow-float;
	}

	&__title {
		display: block;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-l);
		font-weight: 500;
		color: $yb-c-text-2;
		text-align: center;
	}

	&__content {
		display: block;
		margin-top: $yb-sp-sm;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub;
		line-height: 1.7;
		text-align: center;
	}

	&__actions {
		display: flex;
		flex-direction: row;
		margin-top: $yb-sp-lg;

		/* 子组件宽度均分 */
		:deep(.yb-btn) {
			flex: 1;
			margin: 0 8rpx;
		}
	}
}
</style>
