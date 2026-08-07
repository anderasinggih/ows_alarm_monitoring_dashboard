<template>
	<Navbar :eventStatus="true" :eventName="this.keaCalendar.store.currentEvent">
		<Sidebar
			:region="this.pg.selector.region.selectedOption"
			:mcCluster="this.pg.selector.mcCluster.value"
			:siteType="this.siteDown.apiParams.siteType"
			:hubTypeSiteDown="this.siteDown.apiParams.hubType"
			:isVipSiteDown="this.siteDown.apiParams.vipCheck"
			:hubTypeNeDown="this.neDown.apiParams.hubType"
			:isVipNeDown="this.neDown.apiParams.vipCheck"
		/>
	</Navbar>

	<BackgroundMaps>
		<!-- MAIN SECTION -->
		<div ref="contentWrapper">
			<Filter></Filter>
			<div v-if="showSiteDown">
				<TopSection>
					<template #loadingSection>
						<NotificationBadge />
					</template>
				</TopSection>
				<RightSection />
			</div>
		</div>

		<!-- BOTTOM SECTION -->
		<BottomSectionSitedown v-if="this.globalProcess.state.tab.selectedOption == 'siteDown'" />
	</BackgroundMaps>

	<!-- MODAL -->
	<ModalSearching :searchQuery="this.globalProcess.query.searching.searchQueryAll" :searchState="this.globalProcess.state.searching.modalSearchState" />
	<ModalSiteDetails />
	<ModalNodeDetails />
	<ModalLineDetails />
	<ModalEtaDetails />

	<ModalFilter v-if="globalProcess.state.tab.selectedOption === 'siteDown'" :mcCluster="this.globalProcess.apiParams.mcClusterData" />

	<ModalSiteDownTrend :isOpen="this.siteDown.state.siteDownTrend.isOpen" />
	<ModalFmeDetails />

	<ModalTtCorrelation :state="this.siteDown.state.ttCorrelation.modalState" />
	<!-- <ModalExportNeDownByDuration /> -->
	<ModalExportSiteDownByDuration v-if="this.globalProcess.state.tab.selectedOption == 'siteDown'" />
	<ModalExportSiteDownByCircle :state="this.siteDown.state.modalRegion.openState" :circle="this.siteDown.state.modalRegion.circle" />

	<ModalObdVehicleDetails />
	<ModalCalendarEvent />

	<CollapseSummarySiteDown :modalOpened="this.siteDown.state.collapse.show" />
	<!-- <CollapseTicketOpenAnalysis :modalOpened="this.linkDown.state.modal.ticketOpenAnalysis" /> -->
	<!-- <CollapseSummaryNeDown :modalOpened="this.neDown.state.collapse.show" /> -->
</template>

<script>
// MODULE
import { U } from "@adc/vigour-ui/lib/spl";

// COMPONENT
import Navbar from "../../components/Layouts/Navbar.vue";
import Filter from "../Section/Filter/Filter.vue";
import Sidebar from "../../components/Layouts/Sidebar.vue";
import BackgroundMaps from "../../components/Maps/BackgroundMaps.vue";

//=== SECTION ===
// SITEDOWN
import TopSection from "../Section/SiteDown/TopSection/TopSection.vue";
import RightSection from "../Section/SiteDown/RightSection/RightSection.vue";
import BottomSectionSitedown from "../Section/SiteDown/BottomSection/BottomSectionSitedown.vue";
import NotificationBadge from "../Section/NotificationBadge/NotificationBadge.vue";

// MODAL
import ModalEtaDetails from "../../components/Modal/ModalEtaDetails.vue";

import ModalFilter from "../../components/Modal/ModalFilter.vue";

import ModalSearching from "../../components/Modal/ModalSearching.vue";

import ModalSiteDetails from "../../components/Modal/ModalSiteDetails.vue";
import ModalLineDetails from "../../components/Modal/ModalLineDetails.vue";
import ModalNodeDetails from "../../components/Modal/ModalNodeDetails.vue";

import ModalFmeDetails from "../../components/Modal/ModalFmeDetails.vue";
import ModalTtCorrelation from "../../components/Modal/ModalTtCorrelation.vue";
// import ModalExportNeDownByDuration from "../../components/Modal/ModalExportNeDownByDuration.vue";
import ModalExportSiteDownByCircle from "../../components/Modal/ModalExportSiteDownByCircle.vue";
import ModalSiteDownTrend from "../../components/Modal/ModalSiteDownTrend.vue";
import ModalExportSiteDownByDuration from "../../components/Modal/ModalExportSiteDownByDuration.vue";
import ModalObdVehicleDetails from "../../components/Modal/ModalObdVehicleDetails.vue";
import ModalCalendarEvent from "../../components/Modal/ModalCalendarEvent.vue";

// import CollapseSummaryNeDown from "../Section/NeDown/TopSection/CollapseSummaryNeDown.vue";
import CollapseSummarySiteDown from "../Section/SiteDown/TopSection/CollapseSummarySiteDown.vue";
// import CollapseTicketOpenAnalysis from "../Section/LinkDown/TopSection/CollapseTicketOpenAnalysis.vue";

// FUNCTION API
import { getSiteDownMarker } from "../Api/marker/getSiteDownMarker.js";
import { getDurationRangeBreakdown } from "../../views/Api/counting/getDurationRangeBreakdown.js";
import { getTotalCell } from "../../views/Api/counting/getTotalCell.js";
import { getCountTtCorrelation } from "../../views/Api/counting/getCountTtCorrelation.js";
import { getCountTtCorrelationDetails } from "../../views/Api/counting/getCountTtCorrelationDetails.js";
import { getAllSiteDownDataTable } from "../../views/Api/counting/getAllSiteDownDataTable.js";
import { getSiteDownByHubType } from "../../views/Api/counting/getSiteDownByHubType";
import { getAllSiteDownNumByInitialRca } from "../../views/Api/counting/getAllSiteDownNumByInitialRca";
import { getCountByVendor } from "../../views/Api/counting/getCountByVendor.js";

// HELPER
import { addLayerMarker } from "../Helper/MarkerFunction/addLayerMarker.js";
import { backgroundMapsInit } from "../Helper/MapFunction/backgroundMapsInit.js";
import { hideLayerMarker } from "../Helper/MarkerFunction/hideLayerMarker.js";

// DATA
import { IndexData } from "../Data/IndexData.js";
import { siteSearchMarker, coverageSite, fmeSearchMarker, coverageMcCluster } from "../Data/GlobalData.js";
import { DurationData } from "../../views/Data/DurationData";

// USER SESSION
import { getSessionData, processSessionData } from "../Api/session/getUserSession.js";

// KEA CALENDAR
import { getCurrentEvent } from "../Api/calendar/getEventNotification.js";

export default {
	name: "index",
	components: {
		// COMPONENT
		Navbar,
		Filter,
		Sidebar,
		BackgroundMaps,

		// SECTION ===================
		// SITEDOWN
		TopSection,
		RightSection,
		BottomSectionSitedown,
		NotificationBadge,

		// MODAL
		ModalEtaDetails,
		ModalFilter,
		ModalSearching,
		ModalSiteDetails,
		ModalLineDetails,
		ModalNodeDetails,
		ModalFmeDetails,
		ModalTtCorrelation,
		// ModalExportNeDownByDuration,

		ModalSiteDownTrend,
		ModalExportSiteDownByCircle,
		ModalExportSiteDownByDuration,

		ModalObdVehicleDetails,
		ModalCalendarEvent,

		// COLLAPSE
		// CollapseTicketOpenAnalysis,
		// CollapseSummaryNeDown,
		CollapseSummarySiteDown
	},
	computed: {
		showSiteDown() {
			return this.globalProcess.state.tab.selectedOption == "siteDown";
		}
	},
	data() {
		return IndexData;
	},
	async mounted() {
		await U.initCsrfToken();

		this.globalProcess.store.maps.backgroundMaps = backgroundMapsInit("background-maps");

		// this.globalProcess.store.maps.backgroundMaps.setPresetStyleId("night");

		// Set screen zoom to 80%
		const screenViewPort = window.screen.availWidth;
		this.globalProcess.screen = screenViewPort;

		if (screenViewPort < 1600) {
			this.setViewportScale(0.75);
		}
		if (screenViewPort < 1920) {
			this.setViewportScale(0.8);
		}
		if (screenViewPort > 1920 && screenViewPort < 2199) {
			this.setViewportScale(1);
		}
		if (screenViewPort > 2200) {
			this.setViewportScale(1.3);
		}

		// FETCH DATA
		await this.fetchMarkerData();
		await this.postUserData();

		// AUTO REFETCH
		await this.updateLastUpdatedTime();
		await this.startRefetchCheck();

		// KEA CALENDAR
		// await this.getCurrentEventFetch();
	},
	methods: {
		async getCurrentEventFetch() {
			await getCurrentEvent()
				.then(({ res }) => {
					this.keaCalendar.store.currentEvent = res[0].title;
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		},

		async fetchMarkerData() {
			if (this.globalProcess.state.tab.selectedOption == "siteDown") {
				this.globalProcess.state.component.siteDownMarkerMessage = "Loading Site Down Marker";
				this.globalProcess.state.component.siteDownMarkerLoading = true;
				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
				try {
					const { res } = await getSiteDownMarker(
						this.siteDown.apiParams.siteDownChecker,
						this.siteDown.apiParams.hubCheck,
						this.siteDown.apiParams.vipCheck,
						this.siteDown.apiParams.siteType,
						this.siteDown.selector.area.value,
						this.siteDown.apiParams.siteDownCheck,
						this.siteDown.start_time,
						this.siteDown.end_time,
						this.siteDown.inputSite
					);
					this.siteDown.marker.aging.arraySiteDown.data = res;
					addLayerMarker(this.siteDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);
				} catch (error) {
					console.error(`Error fetching marker data for:`, error);
				}

				// 新加调用所有面板
				await getDurationRangeBreakdown(
					this.siteDown.apiParams.siteDownChecker,
					this.siteDown.apiParams.hubCheck,
					this.siteDown.apiParams.vipCheck,
					this.siteDown.apiParams.siteType,
					this.siteDown.selector.area.value,
					this.siteDown.apiParams.siteDownCheck,
					this.siteDown.start_time,
					this.siteDown.end_time
				)
					.then(({ res }) => {
						DurationData.total = res.total_sitedown;
						DurationData.hour1Sd = res.less_than_1_hour;
						DurationData.hour14Sd = res.one_to_4_hour;
						DurationData.hour48Sd = res.four_to_8_hour;
						DurationData.hour824Sd = res.eight_to_24_hour;
						DurationData.hourM24Sd = res.more_than_24_hours;
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});
				await getTotalCell(
					this.siteDown.apiParams.siteDownChecker,
					this.siteDown.apiParams.hubCheck,
					this.siteDown.apiParams.vipCheck,
					this.siteDown.apiParams.siteType,
					this.siteDown.selector.area.value,
					this.siteDown.apiParams.siteDownCheck,
					this.siteDown.start_time,
					this.siteDown.end_time
				)
					.then(({ res }) => {
						DurationData.totalCell = res.total_celldown;
						DurationData.cellUrl = res.url;
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});

				await getCountTtCorrelation(this.siteDown.start_time, this.siteDown.end_time)
					.then(({ res }) => {
						this.siteDown.store.ttCorrelation.data = res.results;
						this.siteDown.store.ttCorrelation.data.sort((a, b) => {
							const severityOrder = {
								Emergency: 0,
								Critical: 1,
								Major: 2
							};
							return severityOrder[a.severity] - severityOrder[b.severity];
						});
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});

				await getCountTtCorrelationDetails(this.siteDown.start_time, this.siteDown.end_time)
					.then(({ res }) => {
						this.siteDown.store.ttCorrelation.tableData = res._values;
						// this.siteDown.state.ttCorrelation.ttTableLoading = false;
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
						// this.siteDown.state.ttCorrelation.ttTableLoading = false;
					});

				await getAllSiteDownDataTable(
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
						console.log(res, "result get data site down data table");
						this.siteDown.state.modalExport.data = res;
						// this.siteDown.state.modalExport.loading == false;
					})
					.catch((error) => {
						// this.siteDown.state.modalExport.loading == false;
						console.error(error);
					});
				await getSiteDownByHubType(
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
						this.siteDown.state.collapse.data = res;
						// this.siteDown.store.exportSiteDownAlarm.loading = false;
					})
					.catch((error) => {
						// this.siteDown.store.exportSiteDownAlarm.loading = false;
						console.error(error);
					});
				// ===== 新增：Initial RCA-FWA-RAN =====
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
					})
					.catch((error) => {
						console.error(error);
					});
				await getCountByVendor(
					this.siteDown.apiParams.siteDownChecker,
					this.siteDown.apiParams.hubCheck,
					this.siteDown.apiParams.vipCheck,
					this.siteDown.apiParams.siteDownCheck,
					this.siteDown.selector.area.value,
					this.siteDown.apiParams.siteType,
					this.siteDown.start_time,
					this.siteDown.end_time
				)
					.then(({ res }) => {
						this.siteDown.vendorWiseData = res.results;
					})
					.catch((error) => {
						// this.refetch = false;
						console.error("Error fetching data:", error);
					});

				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.refetch = false;
			}
		},

		// LINK DOWN ONLY
		// NEED TO SIMPLIFY
		removeInfoWindow() {
			hideLayerMarker(this.linkDown.marker.javaMarker);
			hideLayerMarker(this.linkDown.marker.jayaMarker);
			hideLayerMarker(this.linkDown.marker.ksmpMarker);
			hideLayerMarker(this.linkDown.marker.smtrMarker);

			const infoWindows = [
				{ id: "0", infoWindow: "smtr" },
				{ id: "1", infoWindow: "jaya" },
				{ id: "2", infoWindow: "java" },
				{ id: "3", infoWindow: "ksmp" }
			];

			infoWindows.forEach((window) => {
				if (this.linkDown.store.infoWindow[window.infoWindow] != null) {
					const element = document.getElementById("container-id-infowindow-" + window.id);
					if (element) {
						element.remove();
					}
					this.linkDown.store.infoWindow[window.infoWindow].close();
					this.linkDown.store.infoWindow[window.infoWindow] = null;
				}
			});
		},

		async resetDataState() {
			// Helper function to reset component apply states
			const resetComponentApply = (component) => {
				component.regionApply = false;
				component.mcApply = false;
			};

			// Reset component apply states
			["siteDown"].forEach((key) => resetComponentApply(this[key]));
			resetComponentApply(this.globalProcess.state);
			this.globalProcess.state.component.areaApply = false;

			// Helper function to reset selectors
			const resetSelector = (selector) => {
				Object.assign(selector.region, {
					selectedOption: "",
					selectedLat: "",
					selectedLon: "",
					selectedZoom: ""
				});
				Object.assign(selector.mcCluster, {
					option: [],
					selectedOption: [],
					value: []
				});
			};

			// Reset selectors
			["siteDown"].forEach((key) => resetSelector(this[key].selector));

			// Hide layer markers and lines
			const hideMarkersAndLines = () => {
				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
			};

			hideMarkersAndLines();

			// Hide all markers
			const allMarkers = [...Object.values(this.siteDown.marker.aging), ...Object.values(this.siteDown.marker.fme)];

			allMarkers.forEach(hideLayerMarker);

			// Hide search and coverage markers
			const markersToHide = [siteSearchMarker, coverageSite, fmeSearchMarker, coverageMcCluster];
			markersToHide.forEach((marker) => marker && toRaw(marker).setMap(null));

			// Remove info window
			this.removeInfoWindow();
		},
		//  ===============

		async postUserData() {
			try {
				this.url = window.location.href;
				const sessionData = await getSessionData(this.url.toString());
				sessionData.page_name = "Netdrone Map Site Down";
				processSessionData(sessionData);
			} catch (error) {
				console.error("Error fetching session data:", error);
			}
		},

		setViewportScale(scale) {
			this.$refs.contentWrapper.style.transform = `scale(${scale})`;
			this.$refs.contentWrapper.style.transformOrigin = "0 0";
			this.$refs.contentWrapper.style.width = `${100 / scale}%`;
			this.$refs.contentWrapper.style.height = `${100 / scale}%`;
		},

		// REFETCH
		async updateLastUpdatedTime() {
			const now = new Date();
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const hours = now.getHours().toString().padStart(2, "0");
			let minutes = now.getMinutes();

			this.todayDate = today.toLocaleDateString();
			this.lastUpdated = `${hours}:${minutes.toString().padStart(2, "0")}`;
		},

		async checkRefetchData() {
			// const now = new Date();
			// const minutes = now.getMinutes();

			// // if ([0, 15, 30, 45].includes(minutes)) {
			// if ([0, 30].includes(minutes)) {
			// REFETCH DATA HERE
			if (this.globalProcess.state.component.applyFilterLoading == false) {
				this.refetch = true;
				this.globalProcess.state.component.siteDownMarkerMessage = "Updating Data";
				await this.fetchMarkerData();
				await this.updateLastUpdatedTime();
			}
			// } else {
			// 	this.refetch = false;
			// }
		},

		// MOUNT THIS FUNCTION
		async startRefetchCheck() {
			this.fetching = setInterval(() => {
				this.checkRefetchData();
			}, 180 * 1000);
		}
	}
};
</script>

<style>
body {
	margin: 0;
	padding: 0;
	overflow: hidden;
}
</style>
