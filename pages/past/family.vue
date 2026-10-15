<template>
	<view class="page">
		<!-- ========== 自定义导航栏 ========== -->
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>

		<view class="nav">
			<view class="nav__back" @tap="onBack">
				<image class="nav__back-arrow" src="/static/s1开发/看看从前 · 二级界面素材/看看从前-我在哪_slices/返回iocn.png" mode="aspectFit"></image>
				<text class="nav__back-text">返回</text>
			</view>

			<text class="nav__title">看看从前</text>

			<view class="nav__placeholder"></view>
		</view>

		<!-- ========== Tab 胶囊组 ========== -->
		<view class="tabs">
			<view class="tab" :class="{ 'is-selected': activeTab === 'whoami' }" @tap="switchTab('whoami')">
				<text class="tab__text">我是谁</text>
			</view>
			<view class="tab" :class="{ 'is-selected': activeTab === 'family' }" @tap="switchTab('family')">
				<text class="tab__text">家人们</text>
			</view>
			<view class="tab" :class="{ 'is-selected': activeTab === 'residence' }" @tap="switchTab('residence')">
				<text class="tab__text">我在哪</text>
			</view>
		</view>

		<!-- ========== 家族图谱 ========== -->
		<view class="tree">
			<!-- 标题卡 -->
			<view class="tree__head">
				<image class="tree__head-icon" src="/static/s1开发/家人们.png" mode="aspectFit"></image>
				<text class="tree__head-text">六世同堂温情图谱&nbsp;·&nbsp;家族世代相传的爱</text>
			</view>

			<!-- 每一代 -->
			<view v-for="(gen, gi) in generations" :key="gi" class="gen">
				<view class="gen__label">
					<text class="gen__label-text">{{ gen.label }}</text>
				</view>

				<view class="gen__members">
					<view v-for="(m, mi) in gen.members" :key="mi" class="member" @tap="goDetail(m)">
						<image class="member__avatar" :src="avatarOf(gen.color)" mode="aspectFill"></image>
						<text class="member__name">{{ m.relation ? m.relation + ' · ' + m.name : m.name }}</text>
						<text v-if="m.desc" class="member__desc">{{ m.desc }}</text>
					</view>
				</view>

				<!-- 代与代之间的连接线 -->
				<view v-if="gi < generations.length - 1" class="gen__line"></view>
			</view>
		</view>

		<!-- ========== 底部区 ========== -->
		<view class="bottom">
			<view class="speak-btn" :class="{ 'is-speaking': speaking }" @tap="onSpeak">
				<image class="speak-btn__icon" src="/static/s1开发/阅读.png" mode="aspectFit"></image>
				<text class="speak-btn__text">{{ speaking ? '正在朗读…' : '朗读以上内容' }}</text>
				<view class="speak-btn__badge">
					<text class="speak-btn__time">{{ speakDuration }}</text>
				</view>
			</view>

			<view class="more" @tap="onViewMore">
				<image class="more__icon" src="/static/s1开发/看看从前 · 二级界面素材/更多回忆.png" mode="aspectFit"></image>
				<text class="more__text">查看更多回忆</text>
				<image class="more__arrow" src="/static/s1开发/看看从前 · 二级界面素材/进入更多回忆.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { useStore, actions } from '../../store/index.js'
import tts from '../../services/tts.js'

// 六世同堂温情图谱（蓝湖设计稿静态内容）
const FAMILY_TREE = [
	{
		label: '第一代 · 祖辈',
		color: '#8B6F5E',
		members: [
			{ name: '王承德', relation: '祖父', desc: '德高望重 · 严谨笃实' },
			{ name: '赵玉兰', relation: '祖母', desc: '慈眉善目 · 勤劳持家' }
		]
	},
	{
		label: '第二代 · 父母辈 (父亲 母亲)',
		color: '#6B8A7A',
		members: [
			{ name: '王振华', relation: '父亲', desc: '' },
			{ name: '周淑芬', relation: '母亲', desc: '' }
		]
	},
	{
		label: '第三代 · 本辈',
		color: '#58B5A5',
		members: [
			{ name: '王建国', relation: '', desc: '' },
			{ name: '秀兰', relation: '老伴', desc: '' },
			{ name: '建军', relation: '弟弟', desc: '' }
		]
	},
	{
		label: '第四代 · 子女辈 (儿女与亲眷)',
		color: '#E9A56A',
		members: [
			{ name: '芳芳', relation: '女儿', desc: '每周六陪你' },
			{ name: '志强', relation: '女婿', desc: '孝顺常操持家务' },
			{ name: '浩然', relation: '侄子', desc: '' }
		]
	},
	{
		label: '第五代 · 孙辈 (心头肉)',
		color: '#9BC4A0',
		members: [
			{ name: '天天', relation: '外孙 (10岁)', desc: '爱笑常给姥爷敲背' },
			{ name: '朵朵', relation: '外孙女 (7岁)', desc: '' }
		]
	}
]

export default {
	data() {
		return {
			speaking: false,
			speakTip: '',
			speakDuration: '0:45',
			statusBarHeight: 20,
			generations: FAMILY_TREE
		}
	},
	computed: {
		store() { return useStore() },
		activeTab() { return 'family' },
		speakText() {
			return '这是你的家族图谱。' + this.generations.map(g =>
				g.label + '，' + g.members.map(m => (m.relation ? m.relation + ' ' : '') + m.name).join('、')
			).join('。') + '。'
		}
	},
	onLoad() {
		try {
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
		} catch (e) {}
	},
	onShow() {
		actions.refreshFamily()
		actions.refreshPatient()
	},
	methods: {
		/** 生成圆形头像（SVG data URI：彩色底 + 白色人形剪影） */
		avatarOf(color) {
			const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'>" +
				"<circle cx='75' cy='75' r='75' fill='" + color + "'/>" +
				"<circle cx='75' cy='57' r='26' fill='rgba(255,255,255,0.96)'/>" +
				"<path d='M30 132 Q30 88 75 88 Q120 88 120 132 Z' fill='rgba(255,255,255,0.96)'/>" +
				"</svg>"
			return "data:image/svg+xml;utf8," + svg.replace(/#/g, '%23')
		},
		onBack() {
			uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/index/index' }) })
		},
		switchTab(key) {
			const map = {
				whoami: '/pages/past/whoami',
				family: '/pages/past/family',
				residence: '/pages/past/residence'
			}
			if (key === 'family') return
			uni.redirectTo({ url: map[key] })
		},
		goDetail(m) {
			// 静态人物按名字匹配 store 成员，有 id 则跳详情，无则提示
			const member = (this.store.family.members || []).find(x => x.name === m.name)
			if (member) {
				uni.navigateTo({ url: '/pages/past/member-detail?id=' + encodeURIComponent(member.id) })
			} else {
				uni.showToast({ title: m.name + '的详情开发中', icon: 'none' })
			}
		},
		onSpeak() {
			if (this.speaking) { tts.stop(); return }
			const text = this.speakText
			if (!text) { this.speakTip = '暂无可朗读内容'; return }
			this.speakTip = ''
			tts.speak(text, {
				onStart: () => { this.speaking = true },
				onDone: () => { this.speaking = false; this.speakTip = '朗读完成' },
				onFallback: (msg) => { this.speakTip = msg }
			})
		},
		onViewMore() {
			uni.switchTab({ url: '/pages/memory/memoir', fail: () => uni.navigateTo({ url: '/pages/memory/memoir' }) })
		}
	}
}
</script>

<style lang="scss" scoped>
/* 像素还原参考 whoami.vue，内容换为家族图谱 */

.page {
	background-color: rgba(245, 249, 246, 1);
	min-height: 100vh;
	width: 750rpx;
	display: flex;
	flex-direction: column;
}

.nav-safe {
	width: 750rpx;
	flex-shrink: 0;
}

/* ========= 导航栏 ========= */
.nav {
	position: relative;
	width: 750rpx;
	height: 92rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	box-sizing: border-box;
}

.nav__back {
	background-color: rgba(230, 240, 234, 1);
	border-radius: 19229rpx;
	width: 140rpx;
	height: 78rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.nav__back-arrow {
	width: 36rpx;
	height: 36rpx;
	margin-right: 6rpx;
}
.nav__back-text {
	color: rgba(21, 29, 26, 1);
	font-size: 32rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 42rpx;
}

.nav__title {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	text-align: center;
	color: rgba(21, 29, 26, 1);
	font-size: 42rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 62rpx;
	white-space: nowrap;
	pointer-events: none;
}

.nav__placeholder {
	width: 108rpx;
	height: 108rpx;
	flex-shrink: 0;
}

/* ========= Tab 胶囊组 ========= */
.tabs {
	width: 675rpx;
	height: 92rpx;
	display: flex;
	flex-direction: row;
	margin: 20rpx 0 29rpx 38rpx;
}

.tab {
	height: 92rpx;
	border-radius: 19229rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;

	&:nth-child(1) { width: 215rpx; }
	&:nth-child(2) {
		width: 215rpx;
		margin-left: 15rpx;
	}
	&:nth-child(3) {
		width: 215rpx;
		margin-left: 13rpx;
	}

	&__text {
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		white-space: nowrap;
	}

	&:not(.is-selected) {
		background-color: rgba(225, 234, 228, 1);
	}
	&:not(.is-selected) &__text {
		color: rgba(66, 72, 68, 1);
		font-size: 31rpx;
		line-height: 42rpx;
	}

	&.is-selected {
		background-color: rgba(88, 181, 165, 1);
	}
	&.is-selected &__text {
		color: rgba(255, 255, 255, 1);
		font-size: 35rpx;
		line-height: 46rpx;
	}
}

/* ========= 家族图谱 ========= */
.tree {
	width: 673rpx;
	margin: -2rpx 0 0 38rpx;
	display: flex;
	flex-direction: column;
}

/* 标题卡 */
.tree__head {
	box-shadow: 0 1rpx 2rpx 0 rgba(0, 0, 0, 0.05);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 31rpx;
	height: 108rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.tree__head-icon {
	width: 62rpx;
	height: 62rpx;
	flex-shrink: 0;
}
.tree__head-text {
	color: rgba(21, 29, 26, 1);
	font-size: 35rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 48rpx;
	margin-left: 20rpx;
}

/* 每一代 */
.gen {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 24rpx;
}

.gen__label {
	background-color: rgba(72, 101, 86, 0.95);
	border-radius: 19229rpx;
	height: 62rpx;
	padding: 0 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.gen__label-text {
	color: rgba(255, 255, 255, 1);
	font-size: 29rpx;
	letter-spacing: 1rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 38rpx;
	white-space: nowrap;
}

.gen__members {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 20rpx;
}

.member {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 8rpx;
	box-sizing: border-box;
}
.member__avatar {
	width: 104rpx;
	height: 104rpx;
	border-radius: 50%;
	box-shadow: 0 4rpx 12rpx 0 rgba(72, 101, 86, 0.18);
	flex-shrink: 0;
}
.member__name {
	margin-top: 12rpx;
	color: rgba(21, 29, 26, 1);
	font-size: 29rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 38rpx;
	white-space: nowrap;
	text-align: center;
}
.member__desc {
	margin-top: 6rpx;
	color: rgba(66, 72, 68, 1);
	font-size: 25rpx;
	font-family: -apple-system, "PingFang SC", sans-serif;
	font-weight: 500;
	line-height: 34rpx;
	white-space: nowrap;
	text-align: center;
}

/* 代之间连接线 */
.gen__line {
	width: 4rpx;
	height: 40rpx;
	background-color: rgba(88, 181, 165, 0.35);
	margin-top: 20rpx;
}

/* ========= 底部区 ========= */
.bottom {
	display: flex;
	flex-direction: column;
	margin-top: 24rpx;
}

.speak-btn {
	background-color: rgba(87, 181, 165, 1);
	border-radius: 19229rpx;
	width: 673rpx;
	height: 108rpx;
	margin: 0 0 0 38rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 113rpx 0 113rpx;
	box-sizing: border-box;

	&__icon { width: 62rpx; height: 62rpx; }
	&__text {
		color: rgba(255, 255, 255, 1);
		font-size: 42rpx;
		letter-spacing: 1rpx;
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		line-height: 62rpx;
		margin-left: 22rpx;
		flex: 1;
	}
	&__badge {
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 19229rpx;
		width: 98rpx;
		height: 46rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__time {
		color: rgba(255, 255, 255, 0.9);
		font-size: 23rpx;
		letter-spacing: 1rpx;
		font-family: "Liberation Mono", monospace;
		font-weight: normal;
		line-height: 31rpx;
	}

	&.is-speaking { background-color: rgba(72, 101, 86, 1); }
}

.more {
	width: 260rpx;
	height: 42rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 21rpx 0 325rpx 250rpx;

	&__icon { width: 33rpx; height: 33rpx; }
	&__text {
		color: rgba(66, 72, 68, 1);
		font-size: 31rpx;
		font-family: -apple-system, "PingFang SC", sans-serif;
		font-weight: 500;
		line-height: 42rpx;
		margin-left: 12rpx;
	}
	&__arrow { width: 16rpx; height: 16rpx; margin-left: 12rpx; }
}
</style>
