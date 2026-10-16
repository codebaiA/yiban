<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<text class="page__title yb-serif">王家四代 · 家族图谱</text>
		<text class="page__subtitle">点击家人，查看TA的资料</text>

		<yb-loading v-if="!generations.length && loading" text="加载中…"></yb-loading>
		<yb-empty v-else-if="!generations.length" title="家族图谱还是空的" desc="家属可以在「我的 → 家属管理」中维护家庭成员"></yb-empty>

		<!-- 树状图谱：从上到下四代 -->
		<view v-else class="tree">
			<view v-for="(gen, gi) in generations" :key="gen.generation" class="tree__gen">
				<!-- 代际连接线 -->
				<view v-if="gi > 0" class="tree__link"></view>
				<view class="tree__gen-head">
					<text class="tree__gen-name">{{ gen.generationName }}</text>
				</view>
				<view class="tree__nodes">
					<view
						v-for="m in gen.members"
						:key="m.id"
						class="node"
						:class="m.id === patientId ? 'node--self' : ''"
						hover-class="node--hover"
						@tap="goDetail(m)"
					>
						<view class="node__avatar" :class="m.avatar ? '' : 'node__avatar--ph'">
							<image v-if="m.avatar" class="node__img" :src="m.avatar" mode="aspectFill"></image>
							<text v-else class="node__ph-text">{{ (m.name || '?').slice(0, 1) }}</text>
						</view>
						<text class="node__name">{{ m.name }}</text>
						<text class="node__relation">{{ m.id === patientId ? '我' : m.relation }}</text>
					</view>
				</view>
			</view>
		</view>

		<text class="page__foot">图谱信息由家属维护 · 最多展示四代亲属</text>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return { loading: false }
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		patientId() { return this.store.patient.id || '' },
		family() { return this.store.family },
		serifReady() { return this.store.ui.serifReady },
		generations() {
			const list = (this.family.members || []).filter(m => m.status !== 'DELETED')
			const map = {}
			list.forEach(m => {
				const key = m.generation || 0
				if (!map[key]) {
					map[key] = { generation: key, generationName: m.generationName || ('第' + key + '代'), members: [] }
				}
				map[key].members.push(m)
			})
			return Object.keys(map).sort((a, b) => Number(a) - Number(b)).map(k => map[k])
		}
	},
	onShow() {
		this.loading = true
		actions.refreshFamily().then(() => {
			this.loading = false
		})
	},
	methods: {
		goDetail(m) {
			uni.navigateTo({ url: '/pages/past/member-detail?id=' + encodeURIComponent(m.id) })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $yb-c-bg-page;
	padding: $yb-sp-md;
}

.page__title {
	display: block;
	font-family: $yb-font-serif;
	font-size: $yb-fs-serif-title;
	font-weight: 500;
	color: $yb-c-brown-1;
	text-align: center;
}

.page__subtitle {
	display: block;
	margin-top: $yb-sp-xs;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-s);
	color: $yb-c-text-sub;
	text-align: center;
}

.tree {
	margin-top: $yb-sp-md;

	&__gen {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 代与代之间的连接线 */
	&__link {
		width: 4rpx;
		height: 40rpx;
		background: $yb-c-brown-1;
		opacity: 0.5;
		margin-bottom: $yb-sp-xs;
	}

	&__gen-head {
		background: $yb-c-bg-white;
		border-radius: $yb-r-pill;
		padding: 6rpx $yb-sp-md;
		margin-bottom: $yb-sp-sm;
		box-shadow: $yb-shadow-card;
	}

	&__gen-name {
		font-family: $yb-font-serif;
		font-size: $yb-fs-serif-s;
		font-weight: 500;
		color: $yb-c-brown-1;
	}

	&__nodes {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
	}
}

.node {
	width: 33.33%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $yb-sp-xs 4rpx $yb-sp-sm;
	border-radius: $yb-r-md;

	&--hover { background: $yb-c-bg-white; }

	/* 患者本人高亮（不只用颜色：加「我」文字 + 橙环） */
	&--self {
		.node__avatar {
			border: 6rpx solid $yb-c-orange-1;
			box-shadow: 0 0 0 6rpx rgba(233, 122, 55, 0.15);
		}
		.node__relation {
			color: $yb-c-orange-3;
			font-weight: 500;
		}
	}

	&__avatar {
		width: 108rpx;
		height: 108rpx;
		border-radius: 50%;
		background: $yb-c-bg-grey;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		box-sizing: border-box;

		&--ph { background: $yb-c-teal-2; }
	}

	&__img {
		width: 100%;
		height: 100%;
	}

	&__ph-text {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-l);
		font-weight: 500;
		color: $yb-c-green-2;
	}

	&__name {
		margin-top: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-m);
		font-weight: 500;
		color: $yb-c-text-1;
	}

	&__relation {
		margin-top: 2rpx;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub;
	}
}

.page__foot {
	display: block;
	margin-top: $yb-sp-lg;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-xs);
	color: $yb-c-text-sub3;
	text-align: center;
}
</style>
