<template>
	<div class="tab-pane fade" id="mc-cluster-pane" role="tabpanel" aria-labelledby="mc-cluster-tab" tabindex="0">
		<div class="row" v-if="loading == true">
			<div class="col-12 mt-3">
				<p class="font-600 font-14 mb-3">MC CLUSTER</p>
				<div class="bg-card-loader mt-2"></div>
			</div>
		</div>
		<div class="row" v-else>
			<div class="col-12 mt-3" v-if="mcClusterSearchResult.length == 0">
				<p class="font-600 font-14 mb-3">MC CLUSTER</p>
				<p class="font-600 font-14 text-left">{{ emptyMcClusterMessage }}</p>
			</div>
			<div class="col-12 mt-3" v-else>
				<p class="font-600 font-14 mb-3">MC CLUSTER</p>
				<a class="font-500 font-14 mb-3 btn-list-search text-decor-none width-100 d-block" v-for="data in clusterData" @click="handleSelectMcById(data)" :key="data.mc_cluster" :id="data.mc_cluster" data-bs-dismiss="modal">
					<i class="bi bi-map-fill me-3 accordion-btn-icon"></i>
					{{ data.mc_cluster }}
				</a>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "TabContentMcClusterSearch",
	props: {
		loading: Boolean,
		mcClusterSearchResult: {
			type: Array,
			default: () => []
		},
		emptyMcClusterMessage: String,
		clusterData: {
			type: Array,
			default: () => []
		},
		selectMcById: {
			type: Function,
			required: true
		},
		activateTab: {
			type: Function,
			required: true
		}
	},
	methods: {
		handleSelectMcById(data) {
			this.selectMcById(data.latitude, data.longitude, data.mc_cluster);
		},
		handleActivateTab(tabId) {
			this.activateTab(tabId);
		}
	}
};
</script>
