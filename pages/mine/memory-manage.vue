<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 顶部：返回胶囊 + 标题 ============ -->
		<view class="topbar">
			<view class="back-capsule" hover-class="back-capsule--hover" @tap="goBack">
				<image class="back-capsule__icon" src="/static/mine/back.png" mode="aspectFit"></image>
				<text class="back-capsule__text">返回</text>
			</view>
			<text class="topbar__title">回忆管理</text>
		</view>

		<!-- ============ 主人卡（蓝湖 section_1） ============ -->
		<view class="owner-card">
			<image class="owner-card__avatar" :src="avatarSrc" mode="aspectFill"></image>
			<text class="owner-card__name">{{ patientName }}</text>
			<view class="owner-card__chip">
				<text class="owner-card__chip-text">回忆档案主人</text>
			</view>
		</view>

		<!-- ============ 统计卡（蓝湖 box_3） ============ -->
		<view class="stats-card">
			<view class="stats-card__cell" v-for="s in stats" :key="s.label">
				<text class="stats-card__num">{{ s.value }}</text>
				<text class="stats-card__label">{{ s.label }}</text>
			</view>
		</view>

		<!-- ============ 搜索 + 新增（蓝湖 box_4） ============ -->
		<view class="search-row">
			<view class="search-box">
				<text class="search-box__icon">🔍</text>
				<input
					class="search-box__input"
					type="text"
					v-model="searchText"
					placeholder="搜索回忆标题或关键词"
					placeholder-class="search-box__ph"
					confirm-type="search"
				/>
			</view>
			<view class="add-btn" hover-class="add-btn--hover" @tap="goAdd">
				<text class="add-btn__plus">＋</text>
				<text class="add-btn__text">新增回忆</text>
			</view>
		</view>

		<!-- ============ 分类筛选 chips（横向滚动，蓝湖绝对定位 chips） ============ -->
		<scroll-view class="chip-scroll" scroll-x :show-scrollbar="false">
			<view class="chip-row">
				<view
					v-for="c in categoryChips" :key="c.name"
					class="chip" :class="{ 'is-active': activeCategory === c.name }"
					hover-class="chip--hover"
					@tap="activeCategory = c.name"
				>
					<text class="chip__text" :class="{ 'chip__text--white': activeCategory === c.name }">{{ c.name }}</text>
					<view class="chip__count" :class="{ 'chip__count--dark': activeCategory === c.name }">
						<text class="chip__count-text" :class="{ 'chip__count-text--white': activeCategory === c.name }">{{ c.count }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- ============ 回忆卡片列表 ============ -->
		<view
			v-for="(m, idx) in filteredMemories" :key="m.id || idx"
			class="memory-card"
			hover-class="card-hover"
			@tap="toastSoon('回忆详情')"
		>
			<view class="memory-card__main">
				<image class="memory-card__photo" :src="getPhoto(m)" mode="aspectFill"></image>
				<view class="memory-card__info">
					<view class="memory-card__meta-row">
						<view class="memory-card__tag">
							<text class="memory-card__tag-text">{{ m.category || '回忆' }}</text>
						</view>
						<text class="memory-card__meta">照片 {{ photoCount(m) }} 张</text>
					</view>
					<text class="memory-card__title">{{ m.title || '未命名回忆' }}</text>
					<text class="memory-card__desc">{{ m.desc || '这段回忆还没有写下内容。' }}</text>
				</view>
			</view>
			<view class="memory-card__tags">
				<view class="memory-card__mini-tag" v-for="(t, i) in getTags(m)" :key="i">
					<text class="memory-card__mini-tag-text"># {{ t }}</text>
				</view>
			</view>
			<view class="memory-card__footer">
				<view class="memory-card__footer-left">
					<image class="memory-card__footer-icon" src="/static/mine/icon_update.png" mode="aspectFit"></image>
					<text class="memory-card__updated">刚刚更新</text>
				</view>
				<view class="memory-card__footer-edit" hover-class="edit-hover" @tap.stop="toastSoon('编辑回忆')">
					<image class="memory-card__footer-icon" src="/static/mine/icon_edit.png" mode="aspectFit"></image>
					<text class="memory-card__edit-text">编辑回忆</text>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredMemories.length === 0" class="empty-card">
			<text class="empty-card__emoji">🌱</text>
			<text class="empty-card__text">这里还没有回忆，去添加第一条吧</text>
		</view>

	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	data() {
		return {
			searchText: '',
			activeCategory: '全部'
		}
	},
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		ybFontClass() { return 'yb-font-' + (this.store.ui.fontLevel || 'lg') },
		patientName() { return (this.store.patient && this.store.patient.name) || '王建国' },
		avatarSrc() { return (this.store.patient && this.store.patient.avatar) || '/static/mine/avatar.png' },
		memories() {
			const m = this.store.memoir
			return (m && m.memories) || []
		},
		stats() {
			const media = (this.store.memoir && this.store.memoir.media) || []
			const total = this.memories.length
			if (!total && !media.length) {
				return [
					{ label: '回忆总数', value: 1 },
					{ label: '珍贵照片', value: 1 },
					{ label: '珍藏视频', value: 0 }
				]
			}
			return [
				{ label: '回忆总数', value: total },
				{ label: '珍贵照片', value: media.filter(x => x && x.type === 'photo').length },
				{ label: '珍藏视频', value: media.filter(x => x && x.type === 'video').length }
			]
		},
		categoryChips() {
			const chips = [
				{ name: '全部', count: this.memories.length },
				{ name: '我的家人', count: this.countBy('我的家人') }
			]
			const cats = (this.store.memoir && this.store.memoir.categories) || []
			cats.forEach(c => {
				const name = typeof c === 'string' ? c : (c && c.name)
				if (name && name !== '我的家人' && !chips.some(x => x.name === name)) {
					chips.push({ name, count: this.countBy(name) })
				}
			})
			return chips
		},
		filteredMemories() {
			let list = this.memories
			if (this.activeCategory !== '全部') {
				list = list.filter(m => m.category === this.activeCategory)
			}
			const kw = (this.searchText || '').trim()
			if (kw) {
				list = list.filter(m =>
					(m.title || '').indexOf(kw) > -1 || (m.desc || '').indexOf(kw) > -1
				)
			}
			return list
		}
	},
	onLoad() {
		actions.refreshMemoir && actions.refreshMemoir()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goAdd() {
			uni.navigateTo({ url: '/pages/memory/addRecall' })
		},
		countBy(name) {
			return this.memories.filter(m => m.category === name).length
		},
		photoCount(m) {
			const arr = (m && m.media) || []
			return arr.filter(x => !x || !x.type || x.type === 'photo').length || 1
		},
		getPhoto(m) {
			/* 封面图优先级：mock/数据自带 image 字段 → media 数组 → 默认图 */
			if (m && m.image) return m.image
			const arr = (m && m.media) || []
			for (let i = 0; i < arr.length; i++) {
				const it = arr[i]
				if (!it) continue
				if (typeof it === 'string') return it
				if (it.url || it.src || it.path) return it.url || it.src || it.path
			}
			return '/static/memoir_detail/photo_wang.png'
		},
		getTags(m) {
			const t = (m && m.tags) || []
			return t.length ? t.slice(0, 2) : ['合影', '简介']
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
	background-color: #F5F9F6;
	padding-bottom: 60rpx;
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
	color: rgba(41, 37, 36, 1);
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

/* ============ 主人卡 ============ */
.owner-card {
	width: 673rpx;
	margin: 23rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	padding: 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; align-items: center;

	&__avatar {
		width: 108rpx; height: 108rpx;
		border-radius: 50%;
		background-color: #E1EAE4;
		flex-shrink: 0;
	}
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; color: rgba(21, 29, 26, 1);
		margin-left: 27rpx;
		max-width: 280rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__chip {
		background-color: #CAEAD7;
		border-radius: 999rpx;
		height: 46rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 21rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
	&__chip-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(48, 77, 63, 1);
		white-space: nowrap;
	}
}

/* ============ 统计卡 ============ */
.stats-card {
	width: 673rpx;
	margin: 23rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	padding: 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: row; justify-content: space-between;

	&__cell {
		width: 188rpx; height: 146rpx;
		background-color: rgba(236, 246, 240, 0.6);
		border-radius: 15rpx;
		display: flex; flex-direction: column; align-items: center; justify-content: center;
	}
	&__num {
		font-family: "PingFang SC", sans-serif; font-weight: 600;
		font-size: 50rpx; color: rgba(72, 101, 86, 1);
		line-height: 60rpx;
	}
	&__label {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(114, 121, 116, 1);
		margin-top: 4rpx;
	}
}

/* ============ 搜索 + 新增 ============ */
.search-row {
	display: flex; flex-direction: row; align-items: center;
	margin: 23rpx 38rpx 0;
}
.search-box {
	flex: 1;
	height: 92rpx;
	background-color: #FFFFFF;
	border-radius: 31rpx;
	box-shadow: 0 4rpx 19rpx rgba(44, 53, 49, 0.04);
	display: flex; flex-direction: row; align-items: center;
	padding: 0 29rpx;
	box-sizing: border-box;

	&__icon { font-size: 29rpx; }
	&__input {
		flex: 1;
		margin-left: 12rpx;
		font-size: 31rpx;
		color: rgba(28, 25, 23, 1);
		height: 92rpx;
		line-height: 92rpx;
	}
}
.search-box__ph { color: rgba(114, 121, 116, 1); font-size: 31rpx; }
.add-btn {
	width: 219rpx; height: 92rpx;
	background-color: rgba(89, 181, 165, 1);
	border-radius: 31rpx;
	display: flex; flex-direction: row; align-items: center; justify-content: center;
	margin-left: 15rpx;
	flex-shrink: 0;

	&__plus { font-size: 35rpx; color: #FFFFFF; font-weight: 500; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: #FFFFFF;
		margin-left: 4rpx;
	}
}
.add-btn--hover { opacity: 0.85; }

/* ============ 分类 chips ============ */
.chip-scroll {
	width: 750rpx;
	margin-top: 27rpx;
	white-space: nowrap;
}
.chip-row {
	display: inline-flex; flex-direction: row; align-items: center;
	padding: 4rpx 38rpx;
}
.chip {
	display: inline-flex; flex-direction: row; align-items: center;
	height: 77rpx;
	background-color: #FFFFFF;
	border: 3rpx solid rgba(229, 231, 235, 1);
	border-radius: 999rpx;
	padding: 0 21rpx 0 31rpx;
	margin-right: 19rpx;
	flex-shrink: 0;

	&.is-active {
		background-color: rgba(89, 181, 165, 1);
		border-color: rgba(49, 77, 72, 1);
		box-shadow: 0 4rpx 12rpx rgba(49, 77, 72, 0.18);
	}
	&--hover { opacity: 0.85; }

	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(87, 83, 78, 1);
		white-space: nowrap;
	}
	&__text--white { color: #FFFFFF; }
	&__count {
		min-width: 42rpx; height: 42rpx;
		background-color: rgba(241, 245, 242, 1);
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		margin-left: 12rpx;
		padding: 0 8rpx;
		box-sizing: border-box;
	}
	&__count--dark { background-color: rgba(49, 77, 72, 1); }
	&__count-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(87, 83, 78, 1);
	}
	&__count-text--white { color: #FFFFFF; }
}

/* ============ 回忆卡片 ============ */
.memory-card {
	width: 673rpx;
	margin: 31rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 31rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	padding: 29rpx;
	box-sizing: border-box;

	&__main { display: flex; flex-direction: row; }
	&__photo {
		width: 185rpx; height: 185rpx;
		border-radius: 15rpx;
		background-color: #E1EAE4;
		flex-shrink: 0;
	}
	&__info {
		flex: 1; min-width: 0;
		margin-left: 23rpx;
		display: flex; flex-direction: column;
	}
	&__meta-row { display: flex; flex-direction: row; align-items: center; }
	&__tag {
		background-color: #CAEAD7;
		border-radius: 999rpx;
		height: 58rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 21rpx;
		flex-shrink: 0;
	}
	&__tag-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(48, 77, 63, 1);
		white-space: nowrap;
	}
	&__meta {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(114, 121, 116, 1);
		margin-left: 15rpx;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 600;
		font-size: 33rpx; color: rgba(28, 25, 23, 1);
		margin-top: 12rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__desc {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(68, 64, 60, 1);
		line-height: 44rpx;
		margin-top: 8rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	&__tags { display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 19rpx; }
	&__mini-tag {
		background-color: rgba(234, 237, 233, 1);
		border-radius: 12rpx;
		height: 46rpx;
		display: flex; align-items: center; justify-content: center;
		padding: 0 15rpx;
		margin: 0 12rpx 8rpx 0;
	}
	&__mini-tag-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 23rpx; color: rgba(100, 116, 139, 1);
	}

	&__footer {
		width: 596rpx;
		margin: 23rpx auto 0;
		background-color: rgba(236, 246, 240, 0.4);
		border-radius: 15rpx;
		height: 73rpx;
		display: flex; flex-direction: row; align-items: center;
		padding: 0 23rpx;
		box-sizing: border-box;
	}
	&__footer-left { display: flex; flex-direction: row; align-items: center; flex: 1; }
	&__footer-icon { width: 25rpx; height: 25rpx; }
	&__updated {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(114, 121, 116, 1);
		margin-left: 12rpx;
	}
	&__footer-edit { display: flex; flex-direction: row; align-items: center; }
	&__edit-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(72, 101, 86, 1);
		margin-left: 12rpx;
	}
}
.card-hover { opacity: 0.85; }
.edit-hover { opacity: 0.6; }

/* ============ 空状态 ============ */
.empty-card {
	width: 673rpx;
	margin: 31rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 31rpx;
	padding: 77rpx 38rpx;
	box-sizing: border-box;
	display: flex; flex-direction: column; align-items: center;

	&__emoji { font-size: 62rpx; }
	&__text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(114, 121, 116, 1);
		margin-top: 19rpx;
	}
}
</style>
