<template>
	<aside class="offcanvas offcanvas-start" tabindex="-1" id="netdrone-sidebar" aria-labelledby="netdrone-sidebar-label">
		<div class="offcanvas-header px-40">
			<h5 class="offcanvas-title font-24 font-700" id="netdrone-sidebar-label">Menu</h5>
			<button type="button" class="btn-close" ref="offcanvasDismiss" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body pt-2 px-40">
			<!-- LIST MENU -->
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-house-door font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey" :href="this.href">IOH Dashboard</a>
			</div>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-list-ul font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" href="https://1057-sg.teleows.com/adc-static/static/procodeComp/1057/operation_dashboard/noc_dashboard/noc_dashboard/latest/dist/index.html#/" target="_blank">NOC Operation Dashboard</a>
			</div>
			<div class="d-flex flex-row gap-16 align-items-center">
				<i class="bi bi-calendar-check font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" data-bs-toggle="modal" data-bs-target="#calendarEventModal">KEA Calendar</a>
			</div>

			<!-- SITEDOWN -->
			<hr class="mb-2 mt-4" />
			<p class="text-grey font-12 mb-4">SITE DOWN</p>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-bar-chart font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openStatisticModal()" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#statisticModal">Site Statistic</a>
			</div>

			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-bar-chart font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openTabSiteList()" data-bs-dismiss="offcanvas">Site List Statistic</a>
			</div>

			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-graph-up font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openTrendModal()" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#siteDownTrendModal">Site Down Trend</a>
			</div>

			<div class="d-flex flex-row gap-16 align-items-center">
				<i class="bi bi-ticket-detailed font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" data-bs-toggle="modal" data-bs-dismiss="offcanvas" data-bs-target="#ttCorrelationModal" @click="openModalTtCorrelation()">TT Correlation</a>
			</div>

			<!-- NE DOWN -->
			<hr class="mb-2 mt-4" />
			<p class="text-grey font-12 mb-4">NE DOWN</p>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-bar-chart font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openStatisticModalNe()" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#statisticModalNe">Site Statistic</a>
			</div>

			<!-- PG -->
			<hr class="mb-2 mt-4" />
			<p class="text-grey font-12 mb-4">PG</p>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-bar-chart font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openTabExportPgSummary()" data-bs-dismiss="offcanvas">Export PG Summary</a>
			</div>
			<div class="d-flex flex-row gap-16 align-items-center">
				<i class="bi bi-ticket-detailed font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openTabExportPgBackup()" data-bs-dismiss="offcanvas">Export PG Ticket</a>
			</div>

			<!-- DWDM -->
			<hr class="mb-2 mt-4" />
			<p class="text-grey font-12 mb-4">DWDM</p>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<figure class="mb-0">
					<img src="../../assets/svg/fa-solid_broadcast-tower.svg" alt="" />
				</figure>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openDwdmStatisticModal()" data-bs-dismiss="offcanvas">DWDM Site Statistic</a>
			</div>

			<div class="d-flex flex-row gap-16 align-items-center">
				<i class="bi bi-bar-chart font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openTabExportDwdm()">Export DWDM All Alarm</a>
			</div>

			<!-- IP -->
			<hr class="mb-2 mt-4" />
			<p class="text-grey font-12 mb-4">IP</p>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<figure class="mb-0">
					<img src="../../assets/svg/core-router.svg" alt="" width="24" class="filter-191919" />
				</figure>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" @click="openCoreRouterDashboard()" data-bs-dismiss="offcanvas">Core Router Dashboard</a>
			</div>

			<hr class="mb-2 mt-4" />
			<p class="text-grey font-12 mb-4">Link Down</p>
			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<figure class="mb-0">
					<img src="../../assets/svg/segment-link-down.svg" alt="" />
				</figure>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" data-bs-toggle="modal" data-bs-dismiss="offcanvas" data-bs-target="#segmentLinkDown" @click="openSegmentModal()">Segment Link Down</a>
			</div>

			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<i class="bi bi-bar-chart font-20 font-700 text-grey"></i>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" data-bs-toggle="modal" data-bs-dismiss="offcanvas" data-bs-target="#ttNumberTrendAnalysis" @click="openTtTrendModal()">TT Number Trend Analysis</a>
			</div>

			<div class="d-flex flex-row gap-16 align-items-center mb-4">
				<figure class="mb-0">
					<img src="../../assets/svg/bi_clipboard2-data.svg" alt="" />
				</figure>
				<a class="font-16 font-700 text-grey text-decor-none c-pointer" data-bs-toggle="modal" data-bs-dismiss="offcanvas" data-bs-target="#ttAgingTrendAnalysis" @click="openTtAgingModal()">TT Aging Trend Analysis</a>
			</div>
			<!-- END -->
		</div>

		<slot />
	</aside>
	<!-- DISMISS OFFCANVAS -->
	<button type="button" ref="siteTableButton" class="btn download-button" data-bs-toggle="modal" data-bs-target="#siteStatisticTable" style="display: none; visibility: hidden"></button>

	<ModalSiteStatistic :handleHideModal="() => hideStatisticModal()" :modalOpened="this.showModal"> </ModalSiteStatistic>
	<!-- <ModalSiteStatisticDwdm :handleHideModal="() => hideDwdmStatisticModal()"></ModalSiteStatisticDwdm>
	<ModalSegmentLinkDown :handleHideModal="() => hideLinkDownSegmentModal()" :modalOpened="this.state.modal.linkDownSegment"></ModalSegmentLinkDown>
	<ModalTtNumberTrendAnalysis :handleHideModal="() => hideLinkDownTtTrendModal()" :modalOpened="this.state.modal.linkDownTtTrend"></ModalTtNumberTrendAnalysis>
	<ModalTtAgingTrendAnalysis :handleHideModal="() => hideLinkDownTtAgingModal()" :modalOpened="this.state.modal.linkDownTtAging"></ModalTtAgingTrendAnalysis>
	<ModalSiteStatisticNe :handleHideModal="() => hideStatisticModalNe()" :modalOpened="this.showModalNe"> </ModalSiteStatisticNe> -->
</template>

<script>
import ModalSiteStatistic from "../Modal/ModalSiteStatistic.vue";
// import ModalSiteStatisticDwdm from "../Modal/ModalSiteStatisticDwdm.vue";
import { SiteStatisticData } from "../../views/Data/SiteStatisticData";
import { IndexData } from "../../views/Data/IndexData";
// import ModalSegmentLinkDown from "../Modal/ModalSegmentLinkDown.vue";
// import ModalTtNumberTrendAnalysis from "../Modal/ModalTtNumberTrendAnalysis.vue";
// import ModalTtAgingTrendAnalysis from "../Modal/ModalTtAgingTrendAnalysis.vue";
// import ModalSiteStatisticNe from "../Modal/ModalSiteStatisticNe.vue";
// import ModalSiteDownTrend from "../Modal/ModalSiteDownTrend.vue";

export default {
	name: "Sidebar",
	components: {
		// ModalSiteDownTrend,
		ModalSiteStatistic,
		// ModalSiteStatisticDwdm,
		// ModalSegmentLinkDown,
		// ModalTtNumberTrendAnalysis,
		// ModalTtAgingTrendAnalysis,
		// ModalSiteStatisticNe
	},
	props: {
		region: String,
		mcCluster: Array,
		siteType: Array,
		hubTypeSiteDown: Array,
		isVipSiteDown: Boolean,
		hubTypeNeDown: Array,
		isVipNeDown: Boolean
	},
	watch: {
		region(newVal) {
			this.regionSelected = newVal;
		},
		mcCluster(newVal) {
			this.mcClusterSelected = newVal;
		},
		siteType(newVal) {
			this.state.export.siteType = newVal;
		},
		hubTypeSiteDown(newVal) {
			this.state.siteDown.hubType = newVal;
		},
		isVipSiteDown(newVal) {
			this.state.siteDown.isVip = newVal;
		},
		hubTypeNeDown(newVal) {
			this.state.neDown.hubType = newVal;
		},
		isVipNeDown(newVal) {
			this.state.neDown.isVip = newVal;
		}
	},
	data() {
		return SiteStatisticData;
	},
	methods: {
		openModalTtCorrelation() {
			IndexData.siteDown.state.ttCorrelation.modalState = IndexData.siteDown.state.ttCorrelation.modalState + 1;
		},
		openStatisticModal() {
			this.$refs.offcanvasDismiss.click();
			this.showModal = this.showModal + 1;
		},
		openSegmentModal() {
			this.$refs.offcanvasDismiss.click();
			this.state.modal.linkDownSegment = this.state.modal.linkDownSegment + 1;
		},
		openTtTrendModal() {
			this.$refs.offcanvasDismiss.click();
			this.state.modal.linkDownTtTrend = this.state.modal.linkDownTtTrend + 1;
		},
		openTtAgingModal() {
			this.$refs.offcanvasDismiss.click();
			this.state.modal.linkDownTtAging = this.state.modal.linkDownTtAging + 1;
		},
		openStatisticModalNe() {
			this.$refs.offcanvasDismiss.click();
			this.showModalNe = this.showModalNe + 1;
		},
		hideStatisticModal() {
			this.showModal = 0;
		},
		hideStatisticModalNe() {
			this.showModalNe = 0;
		},

		hideDwdmStatisticModal() {
			this.showDwdmModal = 0;
		},

		hideLinkDownSegmentModal() {
			this.state.modal.linkDownSegment = 0;
		},

		hideLinkDownTtTrendModal() {
			this.state.modal.linkDownTtTrend = 0;
		},
		hideLinkDownTtAgingModal() {
			this.state.modal.linkDownTtAging = 0;
		},
		openTabSiteList() {
			window.open("https://1057-sg.teleows.com/app/1057/spl/netdrone_maps_v3/netdrone_maps_v3/export_alarm.spl?circle=" + "" + "&hub_type=" + "" + "&is_vip=" + "" + "&site_type=" + "", "_blank");
		},
		openTabExportPgBackup() {
			window.open("https://1057-sg.teleows.com/adc-ui/spl-plus/PG_Backup/PG_Backup/pg_backup_export_grid", "_blank");
		},

		openDwdmStatisticModal() {
			this.$refs.offcanvasDismiss.click();
			this.showDwdmModal = this.showDwdmModal + 1;
			const modalElement = document.getElementById("dwdmStatisticModal");
			if (modalElement) {
				const modal = new bootstrap.Modal(modalElement, { backdrop: "static" });
				modal.show();
			} else {
				console.error(`Modal element with ID '${"dwdmStatisticModal"}' not found.`);
			}
		},

		openTabExportDwdm() {
			window.open("https://1057-sg.teleows.com/app/1057/spl/netdrone_maps_v3/netdrone_maps_v4/export_dwdm_alarm.spl?status=all_alarm", "_blank");
		},

		openTabExportPgSummary() {
			if (this.regionSelected == null || this.regionSelected == "" || this.regionSelected == undefined) {
				this.regionSelected = "national";
			}

			if (this.mcClusterSelected.length == 0 || this.mcClusterSelected == null) {
				this.mcClusterSelected = this.mcClusterSelected.toString();
			}
			window.open("https://1057-sg.teleows.com/app/1057/spl/netdrone_maps_v3/netdrone_maps_v4/export_pg_summary.spl?region=" + this.regionSelected + "&mc_cluster=" + this.mcClusterSelected, "_blank");
		},

		openCoreRouterDashboard() {
			window.open("https://1057-sg.teleows.com/adc-ui/spl-plus/core_router/core_router/hompage");
		}
	}
};
</script>

<style>
.offcanvas.offcanvas-start {
	width: 380px !important;
}
</style>
