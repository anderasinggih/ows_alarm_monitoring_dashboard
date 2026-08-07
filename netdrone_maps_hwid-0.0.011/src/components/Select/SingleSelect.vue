<template>
	<div class="input-group position-relative">
		<select class="form-select form-select-lg" :class="{ 'with-chevron': !showClearButton, 'no-chevron border-right-none': showClearButton }" v-model="selectedValue" @change="handleSelectChange" :id="selectorId">
			<option disabled value="">{{ defaultSelected }}</option>
			<option v-for="option in localOptions" :key="option.area_name" :value="option.area_name">{{ option.area_name }}</option>
		</select>
		<button v-if="showClearButton" @click="clearSelection" class="btn-clear-selected input-group-text" id="addon-wrapping">✖</button>
	</div>
</template>

<script>
export default {
	name: "SingleSelect",
	props: {
		defaultSelected: String,
		options: {
			type: Array,
			required: true
		},
		selectorId: String
	},
	data() {
		return {
			selectedValue: "",
			localOptions: []
		};
	},
	watch: {
		options: {
			handler(newVal) {
				this.localOptions = newVal;
				// If the current selected value is no longer in the options, clear the selection
				if (!newVal.some((option) => option.area_name === this.selectedValue)) {
					this.selectedValue = "";
				}
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		showClearButton() {
			return this.selectedValue !== "";
		}
	},
	methods: {
		handleSelectChange() {
			this.$emit("update:modelValue", this.selectedValue);
		},
		clearSelection() {
			this.selectedValue = "";
			this.$emit("update:modelValue", this.selectedValue);
		}
	}
};
</script>

<style>
select {
	font-family: "Inter", sans-serif !important;
	font-size: 14px !important;
}
option {
	font-family: "Inter", sans-serif !important;
}
.btn-clear-selected {
	/* height: 43px; */
	border-radius: 0px 8px 8px 0px !important;
	border-left: none !important;
}

.btn-clear-selected:hover {
	color: #ed6d00 !important;
}

.no-chevron {
	--bs-form-select-bg-img: "";
}

.with-chevron {
	--bs-form-select-bg-img: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
}

.border-right-none {
	border-right: none !important;
}
</style>
