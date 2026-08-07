<template>
	<div class="tab-pane fade" id="fme-tab-pane" role="tabpanel" aria-labelledby="fme-tab" tabindex="0">
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
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TabContentFmeSearch",
	props: {
		loading: Boolean,
		fmeSearchResult: {
			type: Array,
			default: () => []
		},
		emptyFmeMessage: String,
		fmeData: {
			type: Array,
			default: () => []
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
		handleSelectFmeById(data) {
			this.selectFmeById(data.lat, data.lon, data.username, this);
		},
		handleActivateTab(tabId) {
			this.activateTab(tabId);
		}
	}
};
</script>
