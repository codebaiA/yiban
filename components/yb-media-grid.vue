<template>
	<view class="yb-grid">
		<view
			v-for="(m, i) in list"
			:key="m.id || i"
			class="yb-grid__cell"
			@tap="onTap(m)"
		>
			<image
				v-if="!failed[i]"
				class="yb-grid__img"
				:src="m.url"
				mode="aspectFill"
				@error="onError(i)"
			></image>
			<view v-else class="yb-grid__img yb-grid__img--failed">
				<text class="yb-grid__failed-text">照片\n没加载出来</text>
			</view>

			<text v-if="m.title" class="yb-grid__title">{{ m.title }}</text>

			<view v-if="m.type === 'VIDEO'" class="yb-grid__play">
				<text class="yb-grid__play-text">▶</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'yb-media-grid',
	props: {
		list: { type: Array, default: () => [] }
	},
	data() {
		return { failed: {} }
	},
	methods: {
		onError(i) {
			this.failed[i] = true
			this.failed = Object.assign({}, this.failed)
		},
		onTap(m) {
			this.$emit('tap', m)
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-grid {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	/* 每屏 4–6 个缩略图（PRD 8.6）：两列布局，按适老字号自适应 */
	&__cell {
		width: 50%;
		padding: $yb-sp-xs;
		position: relative;
	}

	&__img {
		width: 100%;
		height: 240rpx;
		border-radius: $yb-r-md;
		background: $yb-c-bg-grey;
	}

	&__img--failed {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__failed-text {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: #B5AEA3;
		text-align: center;
		white-space: pre-line;
	}

	&__title {
		display: block;
		margin-top: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-2;
	}

	&__play {
		position: absolute;
		left: 50%;
		top: 120rpx;
		transform: translate(-50%, -50%);
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: rgba(43, 32, 20, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__play-text {
		color: #fff;
		font-size: 34rpx;
	}
}
</style>
