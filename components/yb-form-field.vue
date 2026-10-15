<template>
	<view class="yb-field">
		<text class="yb-field__label">{{ label }}<text v-if="required" class="yb-field__star">*</text></text>

		<textarea
			v-if="type === 'textarea'"
			class="yb-field__input yb-field__input--area"
			:value="value"
			:placeholder="placeholder"
			:maxlength="maxlength"
			placeholder-class="yb-field__ph"
			@input="onInput"
		></textarea>

		<input
			v-else
			class="yb-field__input"
			:value="value"
			:type="type"
			:placeholder="placeholder"
			:maxlength="maxlength"
			placeholder-class="yb-field__ph"
			@input="onInput"
		/>

		<text v-if="tip" class="yb-field__tip">{{ tip }}</text>
	</view>
</template>

<script>
export default {
	name: 'yb-form-field',
	props: {
		label: { type: String, default: '' },
		value: { type: [String, Number], default: '' },
		type: { type: String, default: 'text' },
		placeholder: { type: String, default: '' },
		tip: { type: String, default: '' },
		required: { type: Boolean, default: false },
		maxlength: { type: Number, default: 200 }
	},
	methods: {
		onInput(e) {
			this.$emit('input', e.detail.value)
			this.$emit('update:value', e.detail.value)
		}
	}
}
</script>

<style lang="scss" scoped>
.yb-field {
	display: flex;
	flex-direction: column;
	margin-bottom: $yb-sp-md;

	&__label {
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-s);
		color: $yb-c-text-sub;
		margin-bottom: $yb-sp-xs;
	}

	&__star {
		color: $yb-c-danger;
		margin-left: 6rpx;
	}

	&__input {
		min-height: 88rpx;
		background: $yb-c-bg-white;
		border: 2rpx solid $yb-c-line;
		border-radius: $yb-r-md;
		padding: 0 $yb-sp-md;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-b);
		color: $yb-c-text-2;
	}

	&__input--area {
		padding: $yb-sp-sm $yb-sp-md;
		min-height: 200rpx;
		width: auto;
	}

	&__ph {
		color: #B5AEA3;
		font-size: var(--yb-fs-s);
	}

	&__tip {
		margin-top: $yb-sp-xs;
		font-family: $yb-font-sans;
		font-size: var(--yb-fs-xs);
		color: $yb-c-text-sub3;
		line-height: 1.5;
	}
}
</style>
