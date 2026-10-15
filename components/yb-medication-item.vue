<template>
	<view class="yb-med">
		<view class="yb-med__left">
			<text class="yb-med__name">{{ hideName ? '该吃药了' : plan.drugName }}</text>
			<text class="yb-med__time">{{ plan.planTime }}</text>
		</view>

		<view class="yb-med__right">
			<text v-if="status === 'CONFIRMED'" class="yb-med__status yb-med__status--done">已确认</text>
			<yb-big-button
				v-else
				size="sm"
				variant="primary"
				text="已完成"
				@click="$emit('confirm', plan)"
			></yb-big-button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'yb-medication-item',
	props: {
		plan: { type: Object, default: () => ({}) },
		status: { type: String, default: 'PENDING' },
		// hideName：首页紧凑模式——不显示药名（页面空间有限），只显示「该吃药了」+ 时间
		hideName: { type: Boolean, default: false }
	}
}
</script>

<style lang="scss" scoped>
.yb-med {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background: $yb-c-bg-white;
	border-radius: $yb-r-lg;
	padding: $yb-sp-md;
	box-shadow: $yb-shadow-card;

	&__left {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	&__name {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-mp);
		font-weight: 500;
		color: $yb-c-text-2;
	}

	&__time {
		margin-top: 6rpx;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-orange-3;
	}

	&__right {
		margin-left: $yb-sp-sm;
	}

	&__status {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);

		&--done {
			color: $yb-c-green-1;
		}
	}
}
</style>
