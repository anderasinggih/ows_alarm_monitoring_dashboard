<template>
	<section :class="this.globalProcess.state.tab.selectedOption == 'siteDown' || this.globalProcess.state.tab.selectedOption == 'pgTracking' ? 'col-11 pe-1 mt-2 d-flex flex-row flex-wrap gap-8 width-fit-content ps-1' : 'col-11 pe-1 mt-2 d-flex flex-row flex-wrap gap-8 width-fit-content'">
		<button
			v-if="this.globalProcess.state.tab.selectedOption == 'neDown'"
			class="btn btn-collapse-mtte-svg"
			title="Summary NE Down"
			id="summaryNeDownBtn"
			@click="showNeDownSummary()"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#collapseSummaryNeDown"
			aria-expanded="false"
			aria-controls="collapseSummaryNeDown"
		>
			<img src="../../../assets/svg/tabler_building-broadcast-tower.svg" alt="" class="svg-ed6d00" />
		</button>

		<!-- IF V4 ONLY -->
		<!-- <button
			v-if="this.globalProcess.state.tab.selectedOption == 'siteDown'"
			class="btn btn-collapse-mtte-svg"
			title="Summary Site Down"
			id="summarySiteDownBtn"
			@click="showSiteDownSummary()"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#collapseSummarySiteDown"
			aria-expanded="false"
			aria-controls="collapseSummarySiteDown"
		>
			<img src="../../../assets/svg/tabler_building-broadcast-tower.svg" alt="" class="svg-ed6d00" />
		</button> -->

		<!-- SITE DOWN TREND IF HWID -->
		<!-- OBD -->
		<!-- OBD TEST -->
		<!-- <button v-if="this.globalProcess.state.tab.selectedOption == 'siteDown' || this.globalProcess.state.tab.selectedOption == 'pgTracking'" class="btn btn-collapse-mtte-svg" title="OBD" type="button" data-bs-dismiss="offcanvas" @click="testObdModal()">
			<i class="bi bi-controller font-22"></i>
		</button> -->

		<!-- yxl
		<button
			v-if="this.globalProcess.state.tab.selectedOption == 'siteDown' || this.globalProcess.state.tab.selectedOption == 'pgTracking'"
			class="btn btn-collapse-mtte-svg"
			title="OBD"
			id="obdButton"
			@click="showObd()"
			type="button"
			data-bs-dismiss="offcanvas"
			data-bs-toggle="collapse"
			data-bs-target="#collapseObd"
		>
			<i class="bi bi-car-front-fill font-22"></i>
		</button>
		-->

		<!-- yxl
		<button
			v-if="this.globalProcess.state.tab.selectedOption == 'siteDown'"
			class="btn btn-collapse-mtte-svg"
			title="Site Down Demarcation"
			id="siteDownDemarcation"
			@click="showSiteDownDemarcation()"
			type="button"
			data-bs-dismiss="offcanvas"
			data-bs-toggle="collapse"
			data-bs-target="#collapseDemarcation"
		>
			<i class="bi bi-table font-22"></i>
		</button>
		-->

		<!-- yxl
		<button v-if="this.globalProcess.state.tab.selectedOption == 'siteDown'" class="btn btn-collapse-mtte-svg" title="Site Down Trend" id="siteDownTrendBtn" @click="showSiteDownTrend()" type="button" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#siteDownTrendModal">
			<i class="bi bi-graph-up font-22"></i>
		</button>
		-->

		<!-- <button
			v-if="this.globalProcess.state.tab.selectedOption == 'pgTracking'"
			class="btn btn-collapse-mtte-svg"
			title="Outage Distribution"
			id="summaryPgBtn"
			@click="showPgSummary()"
			type="button"
			data-bs-toggle="modal"
			data-bs-target="#modalPgSummary"
			aria-expanded="false"
			aria-controls="modalPgSummary"
		>
			<i class="bi bi-clipboard2-data font-22"></i>
		</button> -->

		<!-- RESET ZOOM -->
		<button class="btn btn-collapse-mtte" title="Reset Zoom" @click="resetZoom()">
			<i class="bi bi-fullscreen-exit font-22"></i>
		</button>

		<button
			v-if="this.globalProcess.state.tab.selectedOption == 'linkDown'"
			class="btn btn-collapse-mtte-svg"
			title="Ticket Open analysis (Multi Site Down, PE, Link Down)"
			id="ticketOpenAnalysisBtn"
			@click="showTicketOpen()"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#collapseTicketOpenAnalysis"
			aria-expanded="false"
			aria-controls="collapseTicketOpenAnalysis"
		>
			<img src="../../../assets/svg/table-icon.svg" alt="" />
		</button>

		<!-- LOADING -->
		<BackgroundLoading v-if="this.globalProcess.state.component.siteDownMarkerLoading == true" :title="this.globalProcess.state.component.siteDownMarkerMessage" />
		<BackgroundLoading v-if="this.globalProcess.state.component.siteDownDataLoading == true" :title="'Loading Site Down Data'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.neDownMarkerLoading == true" :title="this.globalProcess.state.component.neDownMarkerMessage" />
		<BackgroundLoading v-if="this.globalProcess.state.component.neDownDataLoading == true" :title="'Loading NE Down Data'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.applyFilterLoading == true" :title="'Applying Filter'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.fmeDetailsLoading == true" :title="'Opening FME Details'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.siteDetailsLoading == true" :title="'Opening Site Details'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.loadingDataPg == true" :title="'Loading PG Tracking Data'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.loadingEtaDataPg == true" :title="'Calculating ETA'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.loadingMarkerPg == true" :title="'Loading PG Tracking Marker'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.loadingDataBreakdownPg == true" :title="'Loading Breakdown Data'" />

		<BackgroundLoading v-if="this.globalProcess.state.component.loadingDwdmData == true" :title="'Loading DWDM Data'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.loadingDwdmMarker == true" :title="'Loading DWDM Marker'" />

		<BackgroundLoading v-if="this.globalProcess.state.component.loadingCoreRouterData == true" :title="'Loading Core Router Data'" />
		<BackgroundLoading v-if="this.globalProcess.state.component.loadingCoreRouterMarker == true" :title="'Loading Core Router Marker'" />

		<BackgroundLoading v-if="this.globalProcess.state.component.loadingLinkDownData == true" :title="'Loading Link Down Data'" />

		<!-- BADGE -->
		<TtCorrelationBadge v-if="this.siteDown.state.ttCorrelation.showTtId" :ttId="siteDown.store.ttCorrelation.ttCorrelationId" />

		<McClusterBadge v-if="this.siteDown.component.regionApply" :title="'Circle'" :subtitle="this.siteDown.selector.region.selectedOption" />
		<McClusterBadge v-if="this.siteDown.component.areaApply" :title="'Region'" :subtitle="this.siteDown.selector.area.selectedOptionString" />
		<McClusterBadge v-if="this.siteDown.component.mcApply" :title="'MC-Cluster'" :subtitle="this.siteDown.selector.mcCluster.selectedOptionString" />
		<McClusterBadge v-if="this.siteDown.state.modalExport.showHubBadge" :title="'Hub'" :subtitle="this.siteDown.apiParams.hubTypeString" />
		<McClusterBadge v-if="this.siteDown.state.modalExport.showRegionBadge" :title="'Circle'" :subtitle="this.siteDown.apiParams.circleString" />

		<McClusterBadge v-if="this.dwdm.component.regionApply" :title="'Circle'" :subtitle="this.dwdm.selector.region.selectedOption" />
		<McClusterBadge v-if="this.dwdm.component.areaApply" :title="'Region'" :subtitle="this.dwdm.selector.area.selectedOptionString" />
		<McClusterBadge v-if="this.dwdm.component.mcApply" :title="'MC-Cluster'" :subtitle="this.dwdm.selector.mcCluster.selectedOptionString" />

		<McClusterBadge v-if="this.neDown.component.regionApply" :title="'Circle'" :subtitle="this.neDown.selector.region.selectedOption" />
		<McClusterBadge v-if="this.neDown.component.areaApply" :title="'Region'" :subtitle="this.neDown.selector.area.selectedOptionString" />
		<McClusterBadge v-if="this.neDown.component.mcApply" :title="'MC-Cluster'" :subtitle="this.neDown.selector.mcCluster.selectedOptionString" />
		<McClusterBadge v-if="this.neDown.state.modalExport.showHubBadge" :title="'Hub'" :subtitle="this.neDown.apiParams.hubTypeString" />
		<McClusterBadge v-if="this.neDown.state.modalExport.showRegionBadge" :title="'Circle'" :subtitle="this.neDown.apiParams.circleString" />

		<McClusterBadge v-if="this.pg.component.regionApply" :title="'Circle'" :subtitle="this.pg.selector.region.selectedOption" />
		<McClusterBadge v-if="this.pg.component.areaApply" :title="'Region'" :subtitle="this.pg.selector.area.selectedOptionString" />
		<McClusterBadge v-if="this.pg.component.mcApply" :title="'MC-Cluster'" :subtitle="this.pg.selector.mcCluster.selectedOptionString" />

		<McClusterBadge v-if="this.coreRouter.component.regionApply && this.coreRouter.selector.region.value.area_name != null" :title="'Region'" :subtitle="this.coreRouter.selector.region.value.area_name" />
		<McClusterBadge v-if="this.coreRouter.component.mcApply && this.coreRouter.selector.mcCluster.selectedOptionString != ''" :title="'MC-Cluster'" :subtitle="this.coreRouter.selector.mcCluster.selectedOptionString" />
	</section>
</template>

<script>
import BackgroundLoading from "../../../components/Loading/BackgroundLoading.vue";
import TtCorrelationBadge from "../../../components/Badge/TtCorrelationBadge.vue";
import McClusterBadge from "../../../components/Badge/McClusterBadge.vue";

import { IndexData } from "../../Data/IndexData";

export default {
	name: "NotificationBadge",
	components: {
		BackgroundLoading,
		TtCorrelationBadge,
		McClusterBadge
	},
	data() {
		return IndexData;
	},
	watch: {
		"siteDown.selector.area.selectedOption": function (newVal) {
			this.siteDown.selector.area.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"siteDown.selector.mcCluster.selectedOption": function (newVal) {
			this.siteDown.selector.mcCluster.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"dwdm.selector.area.selectedOption": function (newVal) {
			this.dwdm.selector.area.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"dwdm.selector.mcCluster.selectedOption": function (newVal) {
			this.dwdm.selector.mcCluster.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"pg.selector.area.selectedOption": function (newVal) {
			this.pg.selector.area.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"pg.selector.mcCluster.selectedOption": function (newVal) {
			this.pg.selector.mcCluster.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"neDown.selector.area.selectedOption": function (newVal) {
			this.neDown.selector.area.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"neDown.selector.mcCluster.selectedOption": function (newVal) {
			this.neDown.selector.mcCluster.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		},
		"coreRouter.selector.mcCluster.selectedOption": function (newVal) {
			this.coreRouter.selector.mcCluster.selectedOptionString = newVal.map((item) => item.area_name).join(", ");
		}
	},

	methods: {
		showSiteDownDemarcation() {
			this.siteDownDemarcation.state.isCollapse = true;
		},
		showObd() {
			this.obd.state.isCollapse = true;
		},
		resetZoom() {
			// if (this.globalProcess.state.tab.selectedOption != "pgTracking") {
				var coord = { lat: -6.50127, lng: 111.46372 };
				this.globalProcess.store.maps.backgroundMaps.panTo(coord);
				this.globalProcess.store.maps.backgroundMaps.setZoom(7.7);
			// } else {
				// var coord = { lat: -6.173321, lng: 106.840754 };
				// this.globalProcess.store.maps.backgroundMaps.panTo(coord);
				// this.globalProcess.store.maps.backgroundMaps.setZoom(11.7);
			// }
		},
		showTicketOpen() {
			this.globalProcess.state.component.loadingLinkDownModal = true;
			this.linkDown.state.modal.ticketOpenAnalysis = this.linkDown.state.modal.ticketOpenAnalysis + 1;
		},
		showNeDownSummary() {
			this.neDown.state.collapse.show = this.neDown.state.collapse.show + 1;
		},
		showSiteDownSummary() {
			const collapseMttr = document.getElementById("collapseMtteMttr");
			if (collapseMttr.classList.contains("show")) {
				collapseMttr.classList.remove("show");
			}
			this.siteDown.state.collapse.show = this.siteDown.state.collapse.show + 1;
		},
		showPgSummary() {
			this.pg.state.component.pgModalSummary++;
		},
		showSiteDownTrend() {
			this.siteDown.state.siteDownTrend.isOpen++;
		}
	}
};
</script>

<style>
.svg-ed6d00 {
	filter: brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(410%) hue-rotate(-19deg) brightness(100%) contrast(101%);
}
</style>
