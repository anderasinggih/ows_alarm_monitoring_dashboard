<template>
	<button class="btn btn-collapse-mtte" title="TT Correlation" id="mtteMttrBtn" @click="getDataTt()" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMtteMttr" aria-expanded="false" aria-controls="collapseMtteMttr">
		<i class="bi bi-clipboard2-data font-22"></i>
	</button>

	<div class="position-absolute mt-2">
		<div class="collapse collapse-horizontal mt-2 collapsed" id="collapseMtteMttr" ref="collapseMtteMttr">
			<div class="card card-body card-width-500">
				<div class="row d-flex flex-row align-items-center mb-2 justify-content-between">
					<div class="row d-flex flex-row align-items-center width-fit-content">
						<i class="bi bi-ticket-detailed width-fit-content text-ioh font-20"></i>
						<p class="width-fit-content font-700 font-16 text-ioh ps-0">TT Correlation to Site Down</p>
					</div>
					<div class="width-fit-content">
						<a class="btn btn-link-click" data-bs-toggle="modal" data-bs-target="#ttCorrelationModal" @click="toggleCollapse()">Show Detail TT</a>
					</div>
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
					<!-- <div class="col-12">
						<CardTicketCounting :title="'POT'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(206, 206, 206, 0.2)'" />
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import CardTicketCounting from "../../../../components/Card/CardTicketCounting.vue";

import { IndexData } from "../../../Data/IndexData";

import { getCountTtCorrelation } from "../../../Api/counting/getCountTtCorrelation.js";
export default {
	name: "CollapseMtteMttr",
	components: {
		CardTicketCounting
	},
	watch: {
		"siteDown.store.ttCorrelation.data": function (newVal) {
			this.siteDown.store.ttCorrelation.data = newVal;
		}
	},
	data() {
		return IndexData;
	},
	methods: {
		async getDataTt() {
			// UDPATE STATE
			this.siteDown.state.ttCorrelation.modalState = this.siteDown.state.ttCorrelation.modalState + 1;

			const collapseMttr = document.getElementById("collapseSummarySiteDown");
			if (collapseMttr.classList.contains("show")) {
				collapseMttr.classList.remove("show");
			}

			const mapLegendCard = document.getElementById("map-legend-card");
			const mapLegendButton = document.getElementById("mapLegendBtn");

			if (mapLegendCard.classList.contains("show")) {
				const clickEvent = new Event("click");
				mapLegendButton.dispatchEvent(clickEvent);
			}

			// GET DATA TT
			await getCountTtCorrelation(this.siteDown.start_time, this.siteDown.end_time)
				.then(({ res }) => {
					this.siteDown.store.ttCorrelation.data = res.results;
					this.siteDown.store.ttCorrelation.data.sort((a, b) => {
						const severityOrder = {
							Emergency: 0,
							Critical: 1,
							Major: 2
							// POT: 3
						};
						return severityOrder[a.severity] - severityOrder[b.severity];
					});
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		},
		toggleCollapse() {
			const collapseElement = this.$refs.collapseMtteMttr;
			if (collapseElement) {
				const bsCollapse = new bootstrap.Collapse(collapseElement, {
					toggle: false
				});
				if (collapseElement.classList.contains("show")) {
					bsCollapse.hide();
				} else {
					bsCollapse.show();
				}
			}
		}
	}
};
</script>

<style>
.position-absolute {
	position: absolute !important;
}

.card-width-500 {
	width: 500px !important;
	border: none !important;
	border-radius: 8px;
}
</style>
