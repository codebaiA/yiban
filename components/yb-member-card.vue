<template>
	<view class="yb-member" @tap="$emit('tap', member)">
		<image
			v-if="member.avatar"
			class="yb-member__avatar"
			:src="member.avatar"
			mode="aspectFill"
			@error="onAvatarError"
		></image>
		<view v-else class="yb-member__avatar yb-member__avatar--empty">
			<text class="yb-member__initial">{{ initial }}</text>
		</view>

		<text class="yb-member__name">{{ member.name }}</text>
		<text class="yb-member__relation">{{ member.relation }}</text>
		<text v-if="member.intro" class="yb-member__intro">{{ member.intro }}</text>
	</view>
</template>

<script>
export default {
	name: 'yb-member-card',
	props: {
		member: { type: Object, default: () => ({}) }
	},
	computed: {
		initial() {
			return String(this.member.name || '?').slice(-1)
		}
	},
	methods: {
		onAvatarError() {
			/* 头像加载失败时保持占位，不显示破图 */
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-member {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: $yb-c-bg-white;
	border-radius: $yb-r-lg;
	padding: $yb-sp-md $yb-sp-sm;
	box-shadow: $yb-shadow-card;

	&__avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: $yb-c-bg-page;
		margin-bottom: $yb-sp-xs;
	}

	&__avatar--empty {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__initial {
		font-family: $yb-font-serif;
		font-size: var(--yb-fs-l);
		color: $yb-c-brown-1;
	}

	&__name {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-mp);
		font-weight: 500;
		color: $yb-c-text-2;
	}

	&__relation {
		margin-top: 4rpx;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-brown-1;
	}

	&__intro {
		margin-top: 6rpx;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub3;
		text-align: center;
	}
}
</style>
