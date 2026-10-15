<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<!-- 患者本人置顶（图谱以患者为参照，PRD 9.2） -->
		<view class="self">
			<image class="self__avatar" :src="patient.avatar || icon('patient')" mode="aspectFill"></image>
			<view class="self__info">
				<text class="self__name">{{ patient.name || '我' }}</text>
				<text class="self__relation">这是我</text>
			</view>
		</view>

		<!-- 四代分组 -->
		<view v-for="gen in generations" :key="gen.generation" class="gen">
			<view class="gen__head">
				<text class="gen__name yb-serif">{{ gen.generationName }}</text>
				<text class="gen__count">{{ gen.members.length }} 位</text>
			</view>
			<view class="gen__list">
				<view class="member" hover-class="member--hover" @tap="goDetail(m)">
					<view class="member__avatar" :class="m.avatar ? '' : 'member__avatar--ph'">
						<image v-if="m.avatar" class="member__img" :src="m.avatar" mode="aspectFill"></image>
						<text v-else class="member__ph-text">{{ (m.name || '?').slice(0, 1) }}</text>
					</view>
					<text class="member__name">{{ m.name }}</text>
					<text class="member__relation">{{ m.relation }}</text>
				</view>
			</view>
		</view>

		<yb-empty v-if="!generations.length" title="还没有添加家人" desc="家属可以在「我的 → 家属管理」中维护家庭成员"></yb-empty>

		<text class="page__tip">点击家人头像，看看他的故事</text>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import { icon } from '../../services/iconMap.js'

export default {
	data() {
		return { icon }
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		family() { return this.store.family },
		serifReady() { return this.store.ui.serifReady },
		/** 按 generation 分组，保持 mock 定义顺序 */
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
		actions.refreshFamily()
		actions.refreshPatient()
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

.self {
	display: flex;
	flex-direction: row;
	align-items: center;
	background: $yb-c-orange-1;
	border-radius: $yb-r-lg;
	padding: $yb-sp-md;
	box-shadow: $yb-shadow-card;

	&__avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.9);
		background: $yb-c-bg-grey;
		flex-shrink: 0;
	}

	&__info {
		margin-left: $yb-sp-md;
	}

	&__name {
		display: block;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-l);
		font-weight: 500;
		color: #fff;
	}

	&__relation {
		display: block;
		margin-top: 4rpx;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: rgba(255, 255, 255, 0.92);
	}
}

.gen {
	margin-top: $yb-sp-md;

	&__head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 $yb-sp-xs;
		margin-bottom: $yb-sp-sm;
	}

	&__name {
		font-family: $yb-font-serif;
		font-size: $yb-fs-serif-m;
		font-weight: 500;
		color: $yb-c-brown-1;
	}

	&__count {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub3;
	}

	&__list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		background: $yb-c-bg-white;
		border-radius: $yb-r-lg;
		padding: $yb-sp-md $yb-sp-sm;
		box-shadow: $yb-shadow-card;
	}
}

.member {
	width: 33.33%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $yb-sp-sm 4rpx;
	border-radius: $yb-r-md;

	&--hover { background: $yb-c-bg-page; }

	&__avatar {
		width: 104rpx;
		height: 104rpx;
		border-radius: 50%;
		background: $yb-c-bg-grey;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		&--ph { background: $yb-c-teal-2; }

		.member__img {
			width: 100%;
			height: 100%;
		}
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
		color: $yb-c-orange-3;
	}
}

.page__tip {
	display: block;
	margin-top: $yb-sp-lg;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-xs);
	color: $yb-c-text-sub3;
	text-align: center;
}
</style>
