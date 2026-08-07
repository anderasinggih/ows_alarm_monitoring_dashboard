<template>
	<CardAccordion class="pe-0 ps-1" :accordionTitle="'TT Incident Status'" :accordionId="'tt-correlation-card-accordion'" :btnTarget="'tt-correlation-card'" :show="false">
		<template #accordionIcon>
			<i class="bi bi-people-fill accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="d-flex flex-row">
				<!-- <a class="btn btn-link-click btn-tt-correlation-show" data-bs-toggle="modal" data-bs-target="#ttCorrelationModal" @click="toggleCollapse()">Show Detail TT</a> -->
				<a class="btn btn-link-click btn-tt-correlation-show" data-bs-toggle="modal" data-bs-target="#ttCorrelationModal">Show Detail TT</a>
			</div>
			<div class="row row-gap-12" v-if="this.siteDown.store.ttCorrelation.data.length != 0">
				<div class="col-12" v-for="(data, index) in this.siteDown.store.ttCorrelation.data" :key="index">
					<CardTicketCounting :title="data.severity" :mtte="Math.abs(data.mtte)" :mttr="data.mttr" :closed="data.closed_count" :running="data.running_count" :cardColor="siteDown.store.ttCorrelation.cardColors[index]" />
				</div>
			</div>
			<div class="row row-gap-12" v-else>
				<div class="col-12">
					<CardTicketCounting :title="'Emergency'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(199, 0, 11, 0.05)'" />
				</div>
				<div class="col-12">
					<CardTicketCounting :title="'Critical'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(237, 109, 0, 0.05)'" />
				</div>
				<div class="col-12">
					<CardTicketCounting :title="'Major'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(252, 200, 0, 0.05)'" />
				</div>
				<!-- yxl
				<div class="col-12">
					<CardTicketCounting :title="'POT'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(206, 206, 206, 0.2)'" />
				</div>
				-->
			</div>
		</template>
	</CardAccordion>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

import CardAccordion from "../../../../components/Card/CardAccordion.vue";
import ChartCircleVendor from "../../../../components/Chart/ChartCircleVendor.vue";
import ChartCircleSiteDownVendor from "../../../../components/Chart/ChartCircleSiteDownVendor.vue";

import { IndexData } from "../../../Data/IndexData.js";
import CardTicketCounting from "../../../../components/Card/CardTicketCounting.vue";
import { getCountTtCorrelation } from "../../../Api/counting/getCountTtCorrelation.js";

export default {
	name: "TtCorrelation",
	components: {
		CardAccordion,
		ChartCircleVendor,
		ChartCircleSiteDownVendor,
		CardTicketCounting
	},
	data() {
		return IndexData;
	},
	async mounted() {
		await U.initCsrfToken();

		await this.getDataTt();

		// await this.updateLastUpdatedTime();
		// await this.checkRefetchData();
	},
	methods: {
		async getDataTt() {
			// UDPATE STATE
			this.siteDown.state.ttCorrelation.modalState = this.siteDown.state.ttCorrelation.modalState + 1;

			// GET DATA TT
			await getCountTtCorrelation(this.siteDown.start_time, this.siteDown.end_time)
				.then(({ res }) => {
					this.siteDown.store.ttCorrelation.data = res.results;
					this.siteDown.store.ttCorrelation.data.sort((a, b) => {
						const severityOrder = {
							Emergency: 0,
							Critical: 1,
							Major: 2,
							// POT: 3
						};
						return severityOrder[a.severity] - severityOrder[b.severity];
					});
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		}
	}
};
</script>
