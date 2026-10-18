<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">

		<!-- ============ 个人信息卡（蓝湖 section_1） ============ -->
		<view class="profile-card">
			<!-- 右上角装饰淡绿圆（蓝湖 block_2，超出裁切） -->
			<view class="profile-card__deco"></view>

			<view class="profile-card__head">
				<!-- 头像：淡绿圆环 + 内圆头像 -->
				<view class="profile-card__avatar-ring">
					<image class="profile-card__avatar" :src="avatarSrc" mode="aspectFill"></image>
				</view>
				<view class="profile-card__info">
					<view class="profile-card__name-row">
						<text class="profile-card__name">{{ patient.name || '王建国' }}</text>
						<view class="profile-card__age-chip">
							<text class="profile-card__age">{{ patient.age ? patient.age + '岁' : '74岁' }}</text>
						</view>
					</view>
					<view class="profile-card__status">
						<view class="profile-card__status-dot"></view>
						<text class="profile-card__status-text">长者关怀模式已开启</text>
					</view>
				</view>
			</view>

			<text class="profile-card__slogan">这是属于您的忆伴 · 守护安宁日常</text>
		</view>

		<!-- ============ 使用设置（蓝湖 text_5 + section_2） ============ -->
		<text class="section-label">使用设置</text>

		<view class="settings-card">
			<!-- 字体大小 -->
			<view class="settings-row" hover-class="row-hover" @tap="goSoon('字体大小')">
				<view class="settings-row__icon settings-row__icon--cream">
					<image class="settings-row__icon-img" src="/static/mine/icon_font.png" mode="aspectFit"></image>
				</view>
				<view class="settings-row__texts">
					<text class="settings-row__title">字体大小</text>
					<text class="settings-row__sub">大字清晰阅读体验</text>
				</view>
				<text class="settings-row__value settings-row__value--green">大字适老</text>
				<image class="settings-row__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
			</view>

			<view class="settings-divider"></view>

			<!-- 声音调节 -->
			<view class="settings-row" hover-class="row-hover" @tap="goSoon('声音调节')">
				<view class="settings-row__icon settings-row__icon--green">
					<image class="settings-row__icon-img" src="/static/mine/icon_voice.png" mode="aspectFit"></image>
				</view>
				<view class="settings-row__texts">
					<text class="settings-row__title">声音调节</text>
					<text class="settings-row__sub">说话语速与音量</text>
				</view>
				<text class="settings-row__value settings-row__value--green">温和朗读</text>
				<image class="settings-row__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
			</view>

			<view class="settings-divider"></view>

			<!-- 使用帮助 -->
			<view class="settings-row" hover-class="row-hover" @tap="goSoon('使用帮助')">
				<view class="settings-row__icon settings-row__icon--orange">
					<image class="settings-row__icon-img" src="/static/mine/icon_help.png" mode="aspectFit"></image>
				</view>
				<view class="settings-row__texts">
					<text class="settings-row__title">使用帮助</text>
					<text class="settings-row__sub">怎么跟小忆说话</text>
				</view>
				<text class="settings-row__value">查看指南</text>
				<image class="settings-row__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ============ 关于忆伴（蓝湖 section_3） ============ -->
		<view class="about-card" hover-class="row-hover" @tap="goSoon('关于忆伴')">
			<view class="about-card__icon">
				<image class="about-card__icon-img" src="/static/mine/icon_about.png" mode="aspectFit"></image>
			</view>
			<text class="about-card__title">关于忆伴</text>
			<view class="about-card__right">
				<text class="about-card__version">版本 1.2.0</text>
				<image class="about-card__arrow" src="/static/mine/arrow.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- ============ 家属管理（蓝湖 section_4 青绿卡） ============ -->
		<view class="family-card" hover-class="row-hover" @tap="goSoon('家属管理')">
			<view class="family-card__icon">
				<image class="family-card__icon-img" src="/static/mine/icon_family.png" mode="aspectFit"></image>
			</view>
			<view class="family-card__texts">
				<text class="family-card__title">家属管理</text>
				<text class="family-card__desc">需要家人协助调整？女儿芳芳也可帮您设置，请放心使用。</text>
			</view>
		</view>

		<!-- 底部 TabBar（自定义组件） -->
		<yb-tab-bar></yb-tab-bar>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'

export default {
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		serifReady() { return this.store.ui.serifReady },
		avatarSrc() { return this.patient.avatar || '/static/mine/avatar.png' }
	},
	onShow() {
		actions.refreshPatient()
	},
	methods: {
		goSoon(name) {
			uni.showToast({ title: name + '（即将开放）', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
/* ============ 页面：浅绿灰底，自然滚动（多机型自适应） ============ */
.page {
	min-height: 100vh;
	background: #F5F9F6;
	padding-bottom: calc(98rpx + env(safe-area-inset-bottom) + 10rpx); /* 给 88pt TabBar 留位 */
}

/* ============ 个人信息卡（蓝湖 350×168 → 673rpx，高度由内容撑开） ============ */
.profile-card {
	position: relative;
	width: 673rpx;
	margin: 38rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 38rpx -4rpx rgba(44, 53, 49, 0.06);
	overflow: hidden; /* 裁掉超出卡片的装饰圆 */
	padding: 38rpx 38rpx 38rpx;

	/* 装饰淡绿圆（蓝湖 144px → 277rpx，右侧超出裁切） */
	&__deco {
		position: absolute;
		right: -46rpx; top: 123rpx;
		width: 277rpx; height: 277rpx;
		background-color: rgba(202, 234, 215, 0.3);
		border-radius: 50%;
		pointer-events: none;
	}

	&__head {
		display: flex; flex-direction: row; align-items: center;
		position: relative;
	}

	/* 淡绿圆环 154rpx + 内头像 138rpx */
	&__avatar-ring {
		width: 154rpx; height: 154rpx;
		background-color: #E1EAE4;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	&__avatar {
		width: 138rpx; height: 138rpx;
		border-radius: 50%;
		background-color: #E1EAE4;
	}

	&__info {
		margin-left: 38rpx;
		display: flex; flex-direction: column; justify-content: center;
		flex: 1; min-width: 0;
	}
	&__name-row {
		display: flex; flex-direction: row; align-items: center;
	}
	&__name {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 42rpx; letter-spacing: -1rpx;
		color: rgba(21, 29, 26, 1);
		max-width: 400rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__age-chip {
		background-color: #E6F0EA;
		border-radius: 999rpx;
		padding: 0 24rpx;
		height: 46rpx;
		display: flex; align-items: center; justify-content: center;
		margin-left: 16rpx;
		flex-shrink: 0;
	}
	&__age {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
	}
	&__status {
		display: flex; flex-direction: row; align-items: center;
		margin-top: 12rpx;
	}
	&__status-dot {
		width: 15rpx; height: 15rpx;
		background-color: rgba(72, 101, 86, 1);
		border-radius: 50%;
		flex-shrink: 0;
	}
	&__status-text {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(72, 101, 86, 1);
		margin-left: 12rpx;
	}
	&__slogan {
		display: block;
		position: relative;
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		line-height: 50rpx;
		margin-top: 42rpx;
	}
}

/* ============ 分组标题（蓝湖 18px → 35rpx） ============ */
.section-label {
	display: block;
	margin: 23rpx 0 0 46rpx;
	font-family: "PingFang SC", sans-serif; font-weight: 500;
	font-size: 35rpx; color: rgba(66, 72, 68, 1);
}

/* ============ 设置卡（蓝湖 section_2） ============ */
.settings-card {
	width: 673rpx;
	margin: 19rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	padding: 12rpx 0;
}
.settings-row {
	display: flex; flex-direction: row; align-items: center;
	padding: 23rpx 37rpx;

	/* 彩色圆底 icon：48px → 92rpx */
	&__icon {
		width: 92rpx; height: 92rpx;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon--cream  { background-color: #F6DFC0; }
	&__icon--green  { background-color: #CAEAD7; }
	&__icon--orange { background-color: #FFDCC5; }
	&__icon-img { width: 44rpx; height: 44rpx; }

	&__texts {
		margin-left: 38rpx;
		display: flex; flex-direction: column;
		flex: 1; min-width: 0;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; letter-spacing: 1rpx;
		color: rgba(21, 29, 26, 1);
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__sub {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
		margin-top: 4rpx;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	&__value {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		flex-shrink: 0;
	}
	&__value--green { color: rgba(72, 101, 86, 1); }
	&__arrow {
		width: 15rpx; height: 23rpx;
		margin-left: 12rpx;
		flex-shrink: 0;
	}
}
.settings-divider {
	height: 2rpx;
	background-color: rgba(229, 229, 229, 0.6);
	margin: 0 37rpx;
}
.row-hover { opacity: 0.7; }

/* ============ 关于忆伴（蓝湖 section_3：68px → 131rpx） ============ */
.about-card {
	width: 673rpx;
	height: 131rpx;
	margin: 23rpx auto 0;
	background-color: #FFFFFF;
	border-radius: 23rpx;
	box-shadow: 0 8rpx 31rpx -4rpx rgba(44, 53, 49, 0.05);
	display: flex; flex-direction: row; align-items: center;

	&__icon {
		width: 85rpx; height: 85rpx;
		background-color: #E6F0EA;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		margin-left: 38rpx;
		flex-shrink: 0;
	}
	&__icon-img { width: 38rpx; height: 38rpx; }
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 38rpx; color: rgba(21, 29, 26, 1);
		margin-left: 38rpx;
		flex: 1;
	}
	&__right {
		display: flex; flex-direction: row; align-items: center;
		margin-right: 37rpx;
		flex-shrink: 0;
	}
	&__version {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 29rpx; color: rgba(66, 72, 68, 1);
	}
	&__arrow { width: 15rpx; height: 23rpx; margin-left: 8rpx; }
}

/* ============ 家属管理（蓝湖 section_4 青绿卡：118px → 227rpx） ============ */
.family-card {
	width: 673rpx;
	margin: 23rpx auto 0;
	background-color: #81E2D1;
	border: 1rpx solid rgba(17, 191, 161, 1);
	border-radius: 23rpx;
	box-shadow: 0 8rpx 23rpx rgba(129, 226, 209, 0.45);
	display: flex; flex-direction: row; align-items: flex-start;
	padding: 42rpx 38rpx;
	box-sizing: border-box;

	&__icon {
		width: 77rpx; height: 77rpx;
		background-color: #CAEAD7;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	&__icon-img { width: 38rpx; height: 38rpx; }
	&__texts {
		margin-left: 23rpx;
		display: flex; flex-direction: column;
		flex: 1; min-width: 0;
	}
	&__title {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(21, 29, 26, 1);
	}
	&__desc {
		font-family: "PingFang SC", sans-serif; font-weight: 500;
		font-size: 31rpx; color: rgba(66, 72, 68, 1);
		line-height: 50rpx;
		margin-top: 8rpx;
	}
}
</style>
