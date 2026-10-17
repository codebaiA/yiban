<template>
	<view class="page" :class="[ybFontClass, serifReady ? 'yb-serif-ready' : '']">
		<view class="nav-safe" :style="{ height: statusBarHeight + 'px' }"></view>
		<text class="group__title">1 · 大按钮（三档尺寸 × 各变体）</text>

		<yb-big-button variant="primary" size="lg" text="呼叫女儿" icon-name="game"></yb-big-button>
		<yb-big-button variant="danger" text="删除这条回忆"></yb-big-button>
		<yb-big-button variant="green" text="已完成"></yb-big-button>
		<yb-big-button variant="soft" text="朗读目录"></yb-big-button>
		<yb-big-button variant="outline" text="返回目录"></yb-big-button>
		<yb-big-button variant="ghost" text="取消" size="sm"></yb-big-button>
		<yb-big-button variant="primary" text="禁用态" disabled></yb-big-button>

		<text class="group__title">2 · 卡片</text>
		<yb-card>
			<text class="demo__title">默认卡片</text>
			<text class="demo__desc">白底 + 圆角 28rpx + 轻投影</text>
		</yb-card>
		<yb-card tone="warm">
			<text class="demo__title">暖色卡片</text>
			<text class="demo__desc">#FFF6EF</text>
		</yb-card>
		<yb-card tone="teal">
			<text class="demo__title">青绿卡片</text>
			<text class="demo__desc">#E5F2EB</text>
		</yb-card>

		<text class="group__title">3 · 三态（空 / 加载 / 错误）</text>
		<yb-empty title="暂无用药提醒" desc="家人还没有为你设置用药计划"></yb-empty>
		<yb-loading text="正在加载回忆…"></yb-loading>
		<yb-error message="回忆内容没有加载出来" @retry="onRetry"></yb-error>

		<text class="group__title">4 · 标签编辑器（AI 建议 + 手动补充）</text>
		<yb-tag-editor
			:tags="tags"
			@add="onAddTag"
			@remove="onRemoveTag"
		></yb-tag-editor>

		<text class="group__title">5 · 表单字段</text>
		<yb-form-field label="药物名称" required :value="form.drugName" placeholder="请输入药物名称" @input="v => form.drugName = v"></yb-form-field>
		<yb-form-field label="回忆描述" type="textarea" :value="form.desc" placeholder="写几句关于这段回忆的话" tip="描述越具体，标签越准确" @input="v => form.desc = v"></yb-form-field>

		<text class="group__title">6 · 成员卡片 / 用药条目</text>
		<view class="members">
			<yb-member-card v-for="m in members" :key="m.id" :member="m"></yb-member-card>
		</view>
		<yb-medication-item :plan="demoPlan" status="PENDING"></yb-medication-item>

		<text class="group__title">7 · 字体对照（苹方 vs 宋体）</text>
		<yb-card tone="warm">
			<text class="demo__sans">苹方 PingFang SC · 我是谁 家人们 我住哪</text>
			<text class="yb-serif demo__serif">思源宋体 Noto Serif SC · 我的个人简介 认识我的家人</text>
			<text class="demo__hint">宋体状态：{{ serifReady ? '已加载（真 Noto Serif SC）' : '未加载（系统宋体回退）' }}</text>
		</yb-card>

		<text class="group__title">8 · 字号阶梯</text>
		<yb-card>
			<text class="s-xl">XL 28pt 问候语</text>
			<text class="s-l">L 22pt 页面主标题</text>
			<text class="s-mp">M+ 20pt 区块标题</text>
			<text class="s-m">M 18pt 正文强调</text>
			<text class="s-b">B 16pt 正文</text>
			<text class="s-s">S 15pt 次要说明</text>
			<text class="s-xs">XS 13pt 辅助标签</text>
			<text class="s-xxs">XXS 12pt 极小注</text>
		</yb-card>

		<text class="group__title">9 · 二次确认弹窗</text>
		<yb-big-button variant="danger" text="演示删除确认" @click="showDialog = true"></yb-big-button>

		<yb-confirm-dialog
			:visible="showDialog"
			title="确认删除？"
			content="删除后这段回忆将无法恢复。"
			confirm-text="确认删除"
			cancel-text="再想想"
			danger
			@cancel="showDialog = false"
			@confirm="onDialogConfirm"
		></yb-confirm-dialog>

		<view class="page__foot"></view>
	</view>
</template>

<script>
import { useStore } from '../../store/index.js'

export default {
	data() {
		return {
			showDialog: false,
			tags: [
				{ tagName: '秀兰', sourceType: 'USER', confirmed: true },
				{ tagName: '1982年', sourceType: 'AI', confirmed: true },
				{ tagName: '结婚', sourceType: 'AI', confirmed: true }
			],
			form: { drugName: '', desc: '' },
			demoPlan: { id: 'demo', drugName: '硝苯地平控释片', planTime: '12:30' }
		}
	},
	computed: {
		store() { return useStore() },
		serifReady() { return this.store.ui.serifReady },
		members() {
			return (this.store.family.members || []).slice(0, 4)
		}
	},
	onShow() {
		/* 样板页只读 store，无需刷新 */
	},
	methods: {
		onAddTag(t) {
			this.tags.push(t)
		},
		onRemoveTag(i) {
			this.tags.splice(i, 1)
		},
		onRetry() {
			uni.showToast({ title: '重新加载（演示）', icon: 'none' })
		},
		onDialogConfirm() {
			this.showDialog = false
			uni.showToast({ title: '已确认删除（演示）', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $yb-c-bg-page;
	padding: $yb-sp-md;
	padding-bottom: 160rpx;
}

.group__title {
	display: block;
	margin: $yb-sp-lg 0 $yb-sp-sm;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-s);
	font-weight: 500;
	color: $yb-c-brown-2;
}

.yb-btn,
.yb-card {
	margin-bottom: $yb-sp-sm;
}

.demo__title {
	display: block;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-mp);
	font-weight: 500;
	color: $yb-c-text-1;
}

.demo__desc {
	display: block;
	margin-top: 6rpx;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-s);
	color: $yb-c-text-sub;
}

.demo__sans {
	display: block;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-b);
	color: $yb-c-text-1;
}

.demo__serif {
	display: block;
	margin-top: $yb-sp-sm;
	font-size: var(--yb-fs-serif-b, 31rpx);
	color: $yb-c-brown-1;
}

.demo__hint {
	display: block;
	margin-top: $yb-sp-sm;
	font-family: $yb-font-sans;
	font-size: var(--yb-fs-xs);
	color: $yb-c-text-sub3;
}

.members {
	display: flex;
	flex-direction: row;
	margin-bottom: $yb-sp-sm;

	:deep(.yb-member) {
		flex: 1;
		margin-right: $yb-sp-xs;
	}
}

.s-xl  { display: block; font-size: var(--yb-fs-xl);  font-family: $yb-font-sans; color: $yb-c-text-1; }
.s-l   { display: block; font-size: var(--yb-fs-l);   font-family: $yb-font-sans; color: $yb-c-text-1; }
.s-mp  { display: block; font-size: var(--yb-fs-mp);  font-family: $yb-font-sans; color: $yb-c-text-1; }
.s-m   { display: block; font-size: var(--yb-fs-m);   font-family: $yb-font-sans; color: $yb-c-text-1; }
.s-b   { display: block; font-size: var(--yb-fs-b);   font-family: $yb-font-sans; color: $yb-c-text-1; }
.s-s   { display: block; font-size: var(--yb-fs-s);   font-family: $yb-font-sans; color: $yb-c-text-sub; }
.s-xs  { display: block; font-size: var(--yb-fs-xs);  font-family: $yb-font-sans; color: $yb-c-text-sub; }
.s-xxs { display: block; font-size: var(--yb-fs-xxs); font-family: $yb-font-sans; color: $yb-c-text-sub3; }

.page__foot {
	height: 60rpx;
}
</style>
