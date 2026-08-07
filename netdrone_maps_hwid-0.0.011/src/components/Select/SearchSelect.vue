<template>
	<div class="dropdown input-group position-relative">
		<button class="form-select form-select-lg form-select-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
			{{ selectedItem ? selectedItem : defaultButtonText }}
		</button>
		<ul class="dropdown-menu p-2 dropdown-menu-end" style="min-width: 200px; overflow-y: hidden">
			<li>
				<input type="text" class="form-control" placeholder="Search..." v-model="searchQuery" @input="filterItems" />
			</li>
			<div class="scroll-box">
				<li v-for="item in filteredItems" :key="item.area_name">
					<a class="dropdown-item" @click="selectItem(item.area_name)">{{ item.area_name }}</a>
				</li>
			</div>
		</ul>
		<button v-if="showClearButton" @click="clearSelection" class="btn-clear-selected input-group-text" id="addon-wrapping">✖</button>
	</div>
</template>

<script>
export default {
	name: "SearchSelect",
	props: {
		items: {
			type: Array,
			required: true
		},
		defaultButtonText: {
			type: String,
			default: "Choose MC Cluster"
		}
	},
	data() {
		return {
			searchQuery: "",
			filteredItems: [],
			selectedItem: ""
		};
	},
	computed: {
		showClearButton() {
			return this.selectedItem !== "";
		}
	},
	methods: {
		filterItems() {
			const query = this.searchQuery.toLowerCase();
			// this.filteredItems = this.items.filter((item) => item.area_name.toLowerCase().includes(query));
			this.filteredItems = this.items.filter((item) => item.area_name && item.area_name.toLowerCase().includes(query));
		},
		selectItem(item) {
			this.selectedItem = item;
			this.$emit("itemSelected", item);
		},
		clearSelection() {
			this.selectedItem = null;
			this.searchQuery = "";
			this.filterItems();
			this.$emit("itemCleared");
		}
	},
	watch: {
		items: {
			handler(newItems) {
				this.filteredItems = newItems;
				this.filterItems();
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		this.filteredItems = this.items;
	}
};
</script>

<style scoped>
.dropdown-menu {
	max-height: 200px;
	overflow-y: auto;
}
.dropdown {
	font-family: "Inter", sans-serif !important;
}
.form-select-dropdown {
	font-size: 13px;
	border-radius: 6px !important;
	text-align: justify !important;
}
.btn-clear-selected {
	border-radius: 0 6px 6px 0 !important;
	border-left: none !important;
}
.scroll-box {
	height: 100%;
	max-height: 200px;
	overflow-y: scroll;
	overflow-x: hidden;
}
</style>
