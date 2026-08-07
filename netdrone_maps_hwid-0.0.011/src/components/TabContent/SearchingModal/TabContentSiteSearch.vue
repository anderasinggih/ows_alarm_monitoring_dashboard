<template>
	<div :class="isCoreRouter == true ? 'tab-pane fade show active' : 'tab-pane fade'" id="site-tab-pane" role="tabpanel" aria-labelledby="site-tab" tabindex="0">
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
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TabContentSiteSearch",
	props: {
		isCoreRouter: Boolean,
		loading: Boolean,
		siteSearchResult: {
			type: Array,
			default: () => []
		},
		emptySiteMessage: String,
		siteData: {
			type: Array,
			default: () => []
		},
		selectSiteById: {
			type: Function,
			required: true
		},
		activateTab: {
			type: Function,
			required: true
		}
	},
	methods: {
		handleSelectSiteById(data) {
			this.selectSiteById(data.latitude, data.longitude, data.src, data.title, data.site_name, data.site_class, data.five_region, data.circle, data.is_vip, data.hub_type, data.site_category != undefined ? data.site_category : "", data.site_address);
		},
		handleActivateTab(tabId) {
			this.activateTab(tabId);
		}
	}
};
</script>
