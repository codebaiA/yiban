<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">家庭成员</text>
		</view>

		<!-- ============ 爱的家谱卡 ============ -->
		<view class="tree-card" hover-class="card-hover" @tap="toastSoon('爱的家谱')">
			<view class="tree-card__icon">
				<image class="tree-card__icon-img" src="/static/mine/icon_family_tree.png" mode="aspectFit"></image>
			</view>
			<text class="tree-card__title">爱的家谱</text>
			<view class="tree-card__chip">
				<view class="tree-card__dot"></view>
				<text class="tree-card__chip-text">共 {{ memberCount }} 位亲人</text>
			</view>
		</view>

		<!-- ============ 添加按钮 ============ -->
		<view class="add-btn" hover-class="card-hover" @tap="goAdd">
			<image class="add-btn__icon" src="/static/mine/icon_member_add.png" mode="aspectFit"></image>
			<text class="add-btn__text">添加新的家庭成员</text>
		</view>

		<!-- ============ 成员分组 ============ -->
		<block v-for="(group, gi) in groups" :key="gi">
			<view class="group-row">
				<view class="group-row__dot" :style="{ backgroundColor: group.dotColor }"></view>
				<text class="group-row__text">{{ group.label }}</text>
			</view>
			<view
				v-for="(m, mi) in group.members"
				:key="mi"
				class="member-card"
				hover-class="card-hover"
				@tap="goDetail(m)"
			>
				<image class="member-card__avatar" :src="'/static/mine/' + m.avatar" mode="aspectFill"></image>
				<view class="member-card__info">
					<view class="member-card__name-row">
						<text class="member-card__name">{{ m.name }}</text>
						<text v-if="m.nameAgeInline" class="member-card__age">· {{ m.age }}</text>
					</view>
					<view class="member-card__tags" :class="{ 'member-card__tags--row': m.tagsRow }">
						<view
							v-for="(tag, ti) in m.tags"
							:key="ti"
							class="member-card__tag"
							:class="'member-card__tag--' + tag.c"
						>
							<text class="member-card__tag-text" :class="'member-card__tag-text--' + tag.c">{{ tag.t }}</text>
						</view>
					</view>
				</view>
				<text v-if="m.ageRight" class="member-card__age-right">· {{ m.age }}</text>
			</view>
		</block>

	</view>
</template>

<script>
import { useStore } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') },
		memberCount() {
			return this.groups.reduce((sum, g) => sum + g.members.length, 0)
		}
	},
	data() {
		return {
			/* 标签配色：green 绿底 / yellow 黄底 / sage 灰绿底 / pale 浅绿底 */
			groups: [
				{
					label: '核心相伴 · 岁月知己',
					dotColor: 'rgba(72, 101, 86, 1)',
					members: [
						{ name: '王建国', age: '74岁', avatar: 'member_wangjianguo.png', nameAgeInline: true, tags: [{ t: '本人', c: 'green' }, { t: '记忆主角', c: 'yellow' }] },
						{ name: '秀兰', age: '71岁', avatar: 'member_xiulan.png', nameAgeInline: true, tags: [{ t: '妻子', c: 'green' }, { t: '相伴老伴', c: 'yellow' }] }
					]
				},
				{
					label: '儿女支柱 · 贴心照料',
					dotColor: 'rgba(143, 174, 157, 1)',
					members: [
						{ name: '芳芳', age: '45岁', avatar: 'member_fangfang_list.png', nameAgeInline: true, tags: [{ t: '女儿', c: 'green' }, { t: '主要协助人', c: 'yellow' }] },
						{ name: '李志强', age: '47岁', avatar: 'member_lizhiqiang.png', nameAgeInline: false, ageRight: true, tags: [{ t: '女婿', c: 'sage' }] }
					]
				},
				{
					label: '膝下孙辈 · 欢声笑语',
					dotColor: 'rgba(223, 150, 96, 1)',
					members: [
						{ name: '天天', age: '12岁', avatar: 'member_tiantian.png', nameAgeInline: false, ageRight: true, tags: [{ t: '外孙', c: 'yellow' }, { t: '孙辈', c: 'sage' }] },
						{ name: '朵朵', age: '8岁', avatar: 'member_duoduo.png', nameAgeInline: true, tags: [{ t: '外孙女', c: 'yellow' }, { t: '孙辈', c: 'sage' }] }
					]
				},
				{
					label: '骨肉手足 · 家族血脉',
					dotColor: 'rgba(114, 121, 116, 1)',
					members: [
						{ name: '王建军', age: '69岁', avatar: 'member_wangjianjun.png', nameAgeInline: true, tags: [{ t: '弟弟', c: 'green' }, { t: '手足同胞', c: 'sage' }] },
						{ name: '王浩然', age: '39岁', avatar: 'member_wanghaoran.png', nameAgeInline: true, tagsRow: true, tags: [{ t: '侄子', c: 'sage' }, { t: '晚辈', c: 'pale' }] }
					]
				}
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goAdd() {
			uni.navigateTo({ url: '/pages/mine/member-add' })
		},
		goDetail() {
			uni.navigateTo({ url: '/pages/mine/member-detail' })
		},
		toastSoon(name) {
			uni.showToast({ title: name + '（即将开放）', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #F2FCF5;
	padding-bottom: calc(77rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

/* ============ 顶部 ============ */
.topbar {
	position: relative;
	padding: 60rpx 38rpx 0;
}
.topbar__title {
	display: block;
	height: 81rpx; line-height: 81rpx;
	text-align: center;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 42rpx; letter-spacing: -1rpx;
	color: rgba(21, 29, 26, 1);
}
.back-capsule {
	position: absolute; left: 38rpx; top: 60rpx; z-index: 2;
	width: 173rpx; height: 81rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border: 2rpx solid rgba(221, 233, 224, 1);
	border-radius: 999rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	display: flex; flex-direction: row; align-items: center; justify-content: space-between;
	padding: 0 33rpx;
	box-sizing: border-box;
	flex-shrink: 0;

	&__icon { width: 38rpx; height: 38rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(68, 64, 60, 1);
	}
}
.back-capsule--hover { opacity: 0.7; }
.card-hover { opacity: 0.85; }

/* ============ 爱的家谱卡 ============ */
.tree-card {
	width: 673rpx; height: 169rpx;
	background-color: rgba(236, 246, 240, 1);
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center;
	padding: 0 38rpx;
	box-sizing: border-box;

	&__icon {
		width: 92rpx; height: 92rpx;
		background-color: rgba(246, 223, 192, 1);
		border-radius: 50%;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 44rpx; height: 42rpx; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; letter-spacing: -1rpx;
		color: rgba(72, 101, 86, 1);
		margin-left: 23rpx;
		flex-shrink: 0;
	}
	&__chip {
		margin-left: auto;
		height: 54rpx;
		background-color: rgba(230, 240, 234, 1);
		border-radius: 999rpx;
		display: flex; flex-direction: row; align-items: center;
		padding: 0 23rpx;
		box-sizing: border-box;
		flex-shrink: 0;
	}
	&__dot {
		width: 15rpx; height: 15rpx;
		background-color: rgba(72, 101, 86, 1);
		border-radius: 50%;
		flex-shrink: 0;
	}
	&__chip-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		margin-left: 12rpx;
		white-space: nowrap;
	}
}

/* ============ 添加按钮 ============ */
.add-btn {
	width: 673rpx; height: 108rpx;
	background-color: rgba(89, 181, 165, 1);
	border-radius: 23rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin: 23rpx auto 0;
	display: flex; flex-direction: row; align-items: center; justify-content: center;

	&__icon { width: 42rpx; height: 31rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; color: #FFFFFF;
		margin-left: 15rpx;
	}
}

/* ============ 分组行 ============ */
.group-row {
	display: flex; flex-direction: row; align-items: center;
	margin: 62rpx 0 0 8rpx;

	&__dot {
		width: 19rpx; height: 19rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 35rpx; letter-spacing: 1rpx;
		color: rgba(21, 29, 26, 1);
		margin-left: 15rpx;
	}
}
/* 第一个分组行与添加按钮的间距（24px） */
.group-row:first-of-type { margin-top: 46rpx; }

/* ============ 成员卡 ============ */
.member-card {
	width: 673rpx;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.06);
	margin: 23rpx auto 0;
	padding: 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: center;

	&__avatar {
		width: 123rpx; height: 123rpx;
		border-radius: 50%;
		background-color: rgba(236, 246, 240, 1);
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}
	&__info {
		flex: 1; min-width: 0;
		margin-left: 38rpx;
	}
	&__name-row {
		display: flex; flex-direction: row; align-items: baseline;
	}
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		flex-shrink: 0;
	}
	&__age {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		margin-left: 12rpx;
	}
	&__tags {
		display: flex; flex-direction: column; align-items: flex-start;
		margin-top: 12rpx;
	}
	&__tags--row {
		flex-direction: row;
	}
	&__tag {
		height: 46rpx;
		border-radius: 999rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 19rpx;
		box-sizing: border-box;
	}
	&__tags--row .member-card__tag + .member-card__tag { margin-left: 12rpx; }
	&__tag--green { background-color: rgba(202, 234, 215, 1); }
	&__tag--yellow { background-color: rgba(246, 223, 192, 1); }
	&__tag--sage { background-color: rgba(225, 234, 228, 1); }
	&__tag--pale { background-color: rgba(230, 240, 234, 1); }
	&__tag-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx;
		white-space: nowrap;
	}
	&__tag-text--green { color: rgba(48, 77, 63, 1); }
	&__tag-text--yellow { color: rgba(83, 69, 46, 1); }
	&__tag-text--sage { color: rgba(66, 72, 68, 1); }
	&__tag-text--pale { color: rgba(66, 72, 68, 1); }
	&__age-right {
		font-family: "Plus Jakarta Sans", sans-serif; font-weight: 400;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		align-self: flex-start;
		margin-top: 50rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
}
</style>
