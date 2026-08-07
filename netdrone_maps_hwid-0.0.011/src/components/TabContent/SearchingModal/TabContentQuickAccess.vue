<template>
	<div :class="isCoreRouter == true ? 'tab-pane fade' : 'tab-pane fade show active'" id="quick-access-tab-pane" role="tabpanel" aria-labelledby="quick-access-tab" tabindex="0">
		<div class="d-flex flex-column box-all-search-result">
			<!-- ROW SITE -->
			<div class="row">
				<div class="col-12 mt-3">
					<p class="font-600 font-14 mb-3">SITE</p>
					<a class="d-flex flex-row btn-list-search text-decor-none mb-3" v-for="data in dataInput" :key="data.title" :id="data.title" @click="handleClick(data)" data-bs-dismiss="modal">
						<div class="img-column">
							<div class="accordion-ico-bg">
								<img src="../../../assets/ico/ic_round-cell-tower.png" width="14" />
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
	</div>
</template>

<script>
export default {
	name: "QuickAccessTab",
	props: {
		isCoreRouter: Boolean,
		onClick: {
			type: Function,
			required: true
		},
		dataInput: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		handleClick(data) {
			this.onClick(data.latitude, data.longitude, data.src, data.title, data.site_name, data.site_class, data.five_region, data.circle, data.is_vip, data.hub_type, data.site_category || "", data.site_address);
		}
	}
};
</script>
