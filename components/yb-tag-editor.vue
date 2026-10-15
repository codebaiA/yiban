<template>
	<view class="yb-tags">
		<text class="yb-tags__label">{{ label }}</text>

		<view class="yb-tags__list">
			<view
				v-for="(t, i) in tags"
				:key="t.tagName + i"
				class="yb-tags__item"
				:class="t.sourceType === 'AI' ? 'is-ai' : ''"
				@tap="remove(i)"
			>
				<text class="yb-tags__text">{{ t.tagName }}</text>
				<text class="yb-tags__x">×</text>
			</view>

			<view v-if="!tags.length" class="yb-tags__empty">
				<text class="yb-tags__empty-text">还没有标签</text>
			</view>
		</view>

		<view class="yb-tags__add">
			<input
				class="yb-tags__input"
				v-model="draft"
				placeholder="补充一个标签"
				placeholder-class="yb-tags__ph"
				:maxlength="10"
			/>
			<yb-big-button size="sm" variant="soft" text="添加" @click="add"></yb-big-button>
		</view>

		<text v-if="hint" class="yb-tags__hint">{{ hint }}</text>
	</view>
</template>

<script>
export default {
	name: 'yb-tag-editor',
	props: {
		tags: { type: Array, default: () => [] },
		label: { type: String, default: '标签' },
		hint: { type: String, default: '点击标签可删除；AI 建议的标签也可以改' }
	},
	data() {
		return { draft: '' }
	},
	methods: {
		add() {
			const v = String(this.draft || '').trim()
			if (!v) return
			if (this.tags.some(t => t.tagName === v)) {
				uni.showToast({ title: '这个标签已经有了', icon: 'none' })
				return
			}
			this.$emit('add', { tagName: v, sourceType: 'USER', confirmed: true })
			this.draft = ''
		},
		remove(i) {
			this.$emit('remove', i)
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-tags {
	display: flex;
	flex-direction: column;

	&__label {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub;
		margin-bottom: $yb-sp-xs;
	}

	&__list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		min-height: 72rpx;
	}

	&__item {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: $yb-c-bg-page;
		border-radius: $yb-r-pill;
		padding: 10rpx 24rpx;
		margin: 0 $yb-sp-xs $yb-sp-xs 0;

		&.is-ai {
			background: $yb-c-teal-3;
		}
	}

	&__text {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-brown-2;
	}

	&__x {
		margin-left: 10rpx;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub3;
	}

	&__empty-text {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: #B5AEA3;
		padding: 16rpx 0;
	}

	&__add {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: $yb-sp-xs;
	}

	&__input {
		flex: 1;
		height: 88rpx;
		background: $yb-c-bg-white;
		border: 2rpx solid $yb-c-line;
		border-radius: $yb-r-md;
		padding: 0 $yb-sp-md;
		margin-right: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
	}

	&__ph {
		color: #B5AEA3;
		font-size: var(--yb-fs-s);
	}

	&__hint {
		margin-top: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub3;
		line-height: 1.5;
	}
}
</style>
