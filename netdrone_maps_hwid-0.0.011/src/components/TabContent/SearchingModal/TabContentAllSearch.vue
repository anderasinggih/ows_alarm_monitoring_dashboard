<template>
	<div class="tab-pane fade show" id="all-search-tab-pane" role="tabpanel" aria-labelledby="all-search-tab" tabindex="0">
		<div class="d-flex flex-column box-all-search-result">
			<!-- ROW MC -->
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
					<a class="mt-3 font-600 text-decor-none font-14 text-ioh btn-list-search width-100 d-block text-center" @click="handleActivateTab('mcCluster')">View More</a>
				</div>
			</div>

			<!-- ROW SITE -->
			<div class="row" v-if="loading == true">
				<div class="col-12 mt-3">
					<p class="font-600 font-14 mb-3">SITE</p>
					<div class="bg-card-loader mt-2"></div>
				</div>
			</div>
			<div class="row" v-else>
				<div class="col-12 mt-3" v-if="siteSearchResult.length == 0">
					<p class="font-600 font-14 mb-3">SITE</p>
					<p class="font-600 font-14 text-left">{{ emptySiteMessage }}</p>
				</div>
				<div class="col-12 mt-3" v-else>
					<p class="font-600 font-14 mb-3">SITE</p>
					<a class="d-flex flex-row btn-list-search text-decor-none mb-3" v-for="data in siteData" :key="data.title" :id="data.title" @click="handleSelectSiteById(data)" data-bs-dismiss="modal">
						<div class="img-column">
							<div class="accordion-ico-bg">
								<img src="../../.../../../assets/ico/ic_round-cell-tower.png" width="14" />
							</div>
						</div>
						<div class="col-12">
							<p class="search-result-p font-500 font-14 mb-2">{{ data.site_name }}</p>
							<div class="d-flex flex-row gap-8">
								<label class="search-result-label">{{ data.five_region }}</label>
								<label class="search-result-label">Site ID : {{ data.title }}</label>
							</div>
						</div>
					</a>
					<a class="mt-3 font-600 text-decor-none font-14 text-ioh btn-list-search width-100 d-block text-center" @click="handleActivateTab('siteTab')">View More</a>
				</div>
			</div>

			<!-- ROW FME -->
			<div class="row" v-if="loading == true">
				<div class="col-12 mt-3">
					<p class="font-600 font-14 mb-3">FME</p>
					<div class="bg-card-loader mt-2"></div>
				</div>
			</div>
			<div class="row" v-else>
				<div class="col-12 mt-3" v-if="fmeSearchResult.length == 0">
					<p class="font-600 font-14 mb-3">FME</p>
					<p class="font-600 font-14 text-left">{{ emptyFmeMessage }}</p>
				</div>
				<div class="col-12 mt-3" v-else>
					<p class="font-600 font-14 mb-3">FME</p>
					<a class="d-flex flex-row btn-list-search text-decor-none mb-3" v-for="data in fmeData" :key="data.user_id" :id="data.user_id" @click="selectFmeById(data)" data-bs-dismiss="modal" aria-label="Close">
						<div class="img-column">
							<i class="bi bi-person-fill accordion-btn-icon"></i>
						</div>
						<div class="col-12">
							<p class="search-result-p font-500 font-14 mb-2">{{ data.fme_name }}</p>
							<label class="search-result-label">FME ID : {{ data.username }}</label>
						</div>
					</a>
					<a class="mt-3 font-600 text-decor-none font-14 text-ioh btn-list-search width-100 d-block text-center" @click="handleActivateTab('fmeTab')">View More</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TabContentAllSearch",
	props: {
		loading: Boolean,
		mcClusterSearchResult: {
			type: Array,
			default: () => []
		},
		siteSearchResult: {
			type: Array,
			default: () => []
		},
		fmeSearchResult: {
			type: Array,
			default: () => []
		},
		emptyMcClusterMessage: String,
		emptySiteMessage: String,
		emptyFmeMessage: String,
		clusterData: {
			type: Array,
			default: () => []
		},
		siteData: {
			type: Array,
			default: () => []
		},
		fmeData: {
			type: Array,
			default: () => []
		},
		selectMcById: {
			type: Function,
			required: true
		},
		selectSiteById: {
			type: Function,
			required: true
		},
		selectFmeById: {
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
		handleSelectSiteById(data) {
			this.selectSiteById(data.latitude, data.longitude, data.src, data.title, data.site_name, data.site_class, data.five_region, data.circle, data.is_vip, data.hub_type, data.site_category != undefined ? data.site_category : "", data.site_address);
		},
		handleSelectFmeById(data) {
			this.selectFmeById(parseFloat(data.lat), parseFloat(data.lon), data.username, this);
		},
		handleActivateTab(tabId) {
			this.activateTab(tabId);
		}
	}
};
</script>
