<template>
	<view class="panel">
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
						<!-- 头像：接口有 avatar 用真实图，空则用彩色底 + 姓氏首字兜底 -->
						<view class="member__avatar" :style="m.avatar ? '' : 'background-color:' + gen.color">
							<image v-if="m.avatar" class="member__avatar-img" :src="m.avatar" mode="aspectFill"></image>
							<text v-else class="member__avatar-text">{{ m.name.slice(0, 1) }}</text>
						</view>
						<text class="member__name">{{ displayName(m) }}</text>
						<text v-if="m.intro" class="member__desc">{{ m.intro }}</text>
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
import { useStore } from '../../store/index.js'
import tts from '../../services/tts.js'

// 蓝湖六世同堂代际文案 + 配色
const GEN_LABEL = {
	1: '第一代 · 祖辈',
	2: '第二代 · 父母辈 (父亲 母亲)',
	3: '第三代 · 本辈',
	4: '第四代 · 子女辈 (儿女与亲眷)',
	5: '第五代 · 孙辈 (心头肉)'
}
const GEN_COLOR = {
	1: '#8B6F5E',
	2: '#6B8A7A',
	3: '#58B5A5',
	4: '#E9A56A',
	5: '#9BC4A0'
}

export default {
	data() {
		return {
			speaking: false,
			speakTip: '',
			speakDuration: '0:45'
		}
	},
	computed: {
		store() { return useStore() },
		patient() { return this.store.patient },
		/** 按 generation 分组，第三代最前插入患者本人（王建国） */
		generations() {
			const list = (this.store.family.members || []).filter(m => m.status !== 'DELETED')
			const map = {}
			list.forEach(m => {
				const g = m.generation || 0
				if (!map[g]) map[g] = []
				map[g].push(m)
			})
			// 第三代本辈最前放患者本人
			const p = this.patient
			if (p && p.name) {
				const self = { name: p.name, relation: '', intro: '', isSelf: true }
				if (map[3]) map[3].unshift(self)
				else map[3] = [self]
			}
			return Object.keys(map).sort((a, b) => Number(a) - Number(b)).map(g => ({
				generation: Number(g),
				label: GEN_LABEL[g] || ('第' + g + '代'),
				color: GEN_COLOR[g] || '#58B5A5',
				members: map[g]
			}))
		},
		speakText() {
			return '这是你的家族图谱。' + this.generations.map(g =>
				g.label + '，' + g.members.map(m => this.displayName(m)).join('、')
			).join('。') + '。'
		}
	},
	methods: {
		displayName(m) {
			const base = m.relation ? m.relation + ' · ' + m.name : m.name
			return m.age ? base + ' (' + m.age + '岁)' : base
		},
		goDetail(m) {
			if (m.isSelf) return
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
.panel {
	width: 750rpx;
	display: flex;
	flex-direction: column;
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
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: rgba(72, 101, 86, 0.2);
}
.member__avatar-img {
	width: 100%;
	height: 100%;
}
.member__avatar-text {
	color: #fff;
	font-size: 44rpx;
	font-weight: 500;
	font-family: -apple-system, "PingFang SC", sans-serif;
	line-height: 1;
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
