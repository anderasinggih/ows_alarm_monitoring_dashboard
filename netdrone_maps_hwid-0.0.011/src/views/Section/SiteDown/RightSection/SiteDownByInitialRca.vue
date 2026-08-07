<template>
	<CardAccordion class="pe-0 ps-1" :accordionTitle="'Initial RCA-FWA-RAN'" :accordionId="'site-down-initial-rca-accordion'" :btnTarget="'site-down-initial-rca'">
		<template #accordionIcon>
			<i class="bi bi-clipboard-data accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row px-2">
				<table class="table table-striped table-hover font-14" id="table-site-down-initial-rca">
					<thead>
						<tr>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">Description</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">No</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in siteDown.state.collapseInitialRca.data" :key="index">
							<td class="align-content-center text-center font-inter font-400 px-3 text-ioh">{{ data.description }}</td>
							<td class="align-content-center text-center font-inter font-400 px-3">{{ data.no }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</CardAccordion>
</template>

<script>
import CardAccordion from "../../../../components/Card/CardAccordion.vue";

import { U } from "@adc/vigour-ui/lib/spl";
import { IndexData } from "../../../Data/IndexData";
import { getAllSiteDownNumByInitialRca } from "../../../Api/counting/getAllSiteDownNumByInitialRca";

export default {
	name: "SiteDownByInitialRca",
	data() {
		return IndexData;
	},
	components: {
		CardAccordion
	},
	async mounted() {
		await U.initCsrfToken();
		await this.getData();
	},
	methods: {
		async getData() {
			this.siteDown.state.collapseInitialRca.loading = true;
			await getAllSiteDownNumByInitialRca(
				this.siteDown.apiParams.siteDownChecker,
				this.siteDown.apiParams.hubCheck,
				this.siteDown.selector.area.value,
				this.siteDown.apiParams.vipCheck,
				this.siteDown.apiParams.siteType,
				this.siteDown.apiParams.siteDownCheck,
				this.siteDown.start_time,
				this.siteDown.end_time
			)
				.then(({ res }) => {
					this.siteDown.state.collapseInitialRca.data = res;
					this.siteDown.state.collapseInitialRca.loading = false;
				})
				.catch((error) => {
					this.siteDown.state.collapseInitialRca.loading = false;
					console.error(error);
				});
		}
	}
};
</script>
