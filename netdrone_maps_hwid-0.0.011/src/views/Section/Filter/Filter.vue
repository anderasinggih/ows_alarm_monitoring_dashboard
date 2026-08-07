<template>
	<section class="row mt-3 px-3" style="z-index: 1; position: relative">
		<div class="col-6">
			<div class="d-flex flex-row gap-12">
				<i class="bi bi-filter text-ioh font-700 font-24"></i>
				<!-- <div class="button">
					<input type="radio" :disabled="isDisabled" @change="siteDownCheck()" v-model="globalProcess.state.tab.selectedOption" id="siteDown" value="siteDown" />
					<label class="btn btn-default" for="siteDown">Site Down</label>
				</div> -->
				<!-- <div class="button">
					<input type="radio" :disabled="isDisabled" @change="oltDownCheck()" v-model="globalProcess.state.tab.selectedOption" id="oltDown" value="oltDown" />
					<label class="btn btn-default" for="oltDown">Olt Down</label>
				</div>
				<div class="button" style="width: 250px !important">
					<input type="radio" :disabled="isDisabled" @click="linkDownCheck()" v-model="globalProcess.state.tab.selectedOption" id="linkDown" value="linkDown" />
					<label class="btn btn-default" for="linkDown">Link Down & Potential Incident</label>
				</div> -->
				<!-- yxl
				<div class="button" id="ne-down-filter">
					<input type="radio" :disabled="isDisabled" @click="neDownCheck()" v-model="globalProcess.state.tab.selectedOption" value="neDown" />
					<label class="btn btn-default" for="siteDown">NE Down</label>
				</div>
				<div class="button">
					<input type="radio" :disabled="isDisabled" @click="pgTrackCheck()" v-model="globalProcess.state.tab.selectedOption" id="pgTracking" value="pgTracking" />
					<label class="btn btn-default" for="pgTracking">PG Tracking</label>
				</div>
				<div class="button">
					<input type="radio" :disabled="isDisabled" @click="dwdmCheck()" v-model="globalProcess.state.tab.selectedOption" id="dwdmCheckTab" value="dwdmCheckTab" />
					<label class="btn btn-default" for="dwdmCheckTab">DWDM</label>
				</div>
				<div class="button">
					<input type="radio" :disabled="isDisabled" @click="coreRouterCheck()" v-model="globalProcess.state.tab.selectedOption" id="coreRouter" value="coreRouter" />
					<label class="btn btn-default" for="coreRouter">Core Router</label>
				</div>
				<div class="button" style="width: 250px !important">
					<input type="radio" :disabled="isDisabled" @click="linkDownCheck()" v-model="globalProcess.state.tab.selectedOption" id="linkDown" value="linkDown" />
					<label class="btn btn-default" for="linkDown">Link Down & Potential Incident</label>
				</div>
				-->
			</div>
		</div>
		<div class="col-6">
			<div class="d-flex flex-row gap-12 justify-content-end" style="height: 100%">
				<button v-if="globalProcess.state.tab.selectedOption === 'siteDown'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button>
				<button v-if="globalProcess.state.tab.selectedOption === 'oltDown'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button>
				<button v-if="globalProcess.state.tab.selectedOption === 'neDown'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterNeModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button>
				<button v-if="globalProcess.state.tab.selectedOption === 'pgTracking'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterPgModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button>
				<button v-if="globalProcess.state.tab.selectedOption === 'dwdmCheckTab'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterDwdmModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button>
				<button v-if="globalProcess.state.tab.selectedOption === 'coreRouter'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterCoreRouterModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button>
				<!-- <button v-if="globalProcess.state.tab.selectedOption === 'linkDown'" class="btn btn-filter" data-bs-toggle="modal" data-bs-target="#filterLinkDownModal">
					<i class="bi bi-sliders2 font-700 font-24 text-dark"></i>
					Filter
				</button> -->
				<!-- <div class="input-group width-35">
					<span class="input-group-text"><i class="bi bi-search font-700"></i></span>
					<input @click="openModal()" type="text" class="form-control search-global-input" placeholder="Search" />
				</div> -->
				<div class="input-group width-35">
					<input type="text" class="form-control search-global-input" :placeholder="globalProcess.state.tab.selectedOption == 'siteDown' ? 'Site ID' : 'Site ID or Device'" v-model="siteDown.inputSite" />
					<button @click="searchSite()" class="btn btn-dark">Search</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

// DATA
import { IndexData } from "../../Data/IndexData";
import { siteSearchMarker, coverageSite, fmeSearchMarker, coverageMcCluster } from "../../Data/GlobalData.js";

// HELPER
import { addLayerMarker } from "../../Helper/MarkerFunction/addLayerMarker";
import { addLayerLine } from "../../Helper/LineFunction/addLayerLine.js";
import { hideLayerMarker } from "../../Helper/MarkerFunction/hideLayerMarker";
import { backgroundMapsPanZoom } from "../../Helper/MapFunction/backgroundMapsPanZoom.js";
import { toRaw } from "vue";

// SERVICE
import { getSiteDownMarker } from "../../Api/marker/getSiteDownMarker";
import { getOltDownMarker } from "../../Api/marker/getOltDownMarker";
import { getFmeMarker } from "../../Api/marker/getFmeMarker";
import { getFmePgMarker } from "../../Api/markerPg/getFmePgMarker.js";
import { getSiteDownPgMarker } from "../../Api/markerPg/getSiteDownPgMarker.js";
import { getAllDwdmMarkers } from "../../Api/markerDwdm/getAllDwdmMarkers.js";
import { getAllCoreRouterMarker } from "../../Api/markerCoreRouter/getAllCoreRouterMarker.js";
import { getDurationRangeBreakOltdown } from "../../Api/counting/getDurationRangeBreakOltdown.js";
import { DurationData } from "../../Data/DurationData";
import { getOltDownByHubType } from "../../Api/counting/getOltDownByHubType";
import { getCountTtCorrelationDetailsOlt } from "../../Api/counting/getCountTtCorrelationDetailsOlt.js";
import { getCountTtCorrelationOlt } from "../../Api/counting/getCountTtCorrelationOlt.js";
import { getDurationRangeBreakdown } from "../../Api/counting/getDurationRangeBreakdown.js";
import { getTotalCell } from "../../Api/counting/getTotalCell.js";
import { getSiteDownByHubType } from "../../Api/counting/getSiteDownByHubType";
import { getAllSiteDownNumByInitialRca } from "../../Api/counting/getAllSiteDownNumByInitialRca";
import { getCountTtCorrelationDetails } from "../../Api/counting/getCountTtCorrelationDetails.js";
import { getCountTtCorrelation } from "../../Api/counting/getCountTtCorrelation.js";
import { getAllSiteDownDataTable } from "../../Api/counting/getAllSiteDownDataTable.js";
import { getAllOltDownDataTable } from "../../Api/counting/getAllOltDownDataTable.js";

// FUNCTION
import { createInfoWindow } from "../../Helper/InfoWindowFunction/createInfoWindow.js";
import { postMapsHit } from "../../Api/session/postMapsHit.js";
import { getLineDwdm } from "../../Api/line/getLineDwdm.js";
import { hideLayerLine } from "../../Helper/LineFunction/hideLayerLine.js";
import { getNeDownMarker } from "../../Api/markerNe/getNeDownMarker.js";
import { getLineLinkDown } from "../../Api/line/getLineLinkDown.js";
import { getAllLinkDownMarkers } from "../../Api/markerLinkDown/getMarkerLinkDown.js";

export default {
	name: "NetdroneFilter",
	data() {
		return IndexData;
	},
	computed: {
		isDisabled() {
			return (
				this.globalProcess.state.component.loadingDataPg ||
				this.globalProcess.state.component.loadingDataBreakdownPg ||
				this.globalProcess.state.component.loadingEtaDataPg ||
				this.globalProcess.state.component.loadingMarkerPg ||
				this.globalProcess.state.component.loadingRefreshPgTrack ||
				this.globalProcess.state.component.loadingMarkerNe ||
				this.globalProcess.state.component.siteDownMarkerLoading ||
				this.globalProcess.state.component.siteDownDataLoading ||
				this.globalProcess.state.component.applyFilterLoading ||
				this.globalProcess.state.component.neDownMarkerLoading ||
				this.globalProcess.state.component.neDownDataLoading ||
				this.globalProcess.state.component.loadingDwdmMarker ||
				this.globalProcess.state.component.loadingDwdmData ||
				this.globalProcess.state.component.loadingLinkDownData
			);
		}
	},
	methods: {
		async siteDownCheck() {
			this.removeInfoWindow();
			this.coreRouter.state.isCoreRouterTab = false;

			this.globalProcess.state.searching.clearSearchBtn = false;
			this.globalProcess.state.tab.selectedOption = "siteDown";
			this.globalProcess.state.component.applyFilterLoading = true;
			this.siteDown.inputSite = "";

			this.resetDataState();

			// PAN TO WHOLE INDONESIA
			backgroundMapsPanZoom(0.55942, 125.348276, 5);

			// try {
			// 	const siteDownMarkerConfigs = [
			// 		{ check: this.siteDown.checker.marker.oneHour, param: "1" },
			// 		{ check: this.siteDown.checker.marker.fourHour, param: "1_4" },
			// 		{ check: this.siteDown.checker.marker.eightHour, param: "4_8" },
			// 		{ check: this.siteDown.checker.marker.twentyFourHour, param: "8_24" },
			// 		{ check: this.siteDown.checker.marker.moreDay, param: "m24" }
			// 	];

			// 	siteDownMarkerConfigs.forEach((config) => {
			// 		const index = this.siteDown.apiParams.siteDownChecker.indexOf(config.param);

			// 		if (config.check) {
			// 			if (index === -1) {
			// 				this.siteDown.apiParams.siteDownChecker.push(config.param);
			// 			}
			// 		} else {
			// 			if (index !== -1) {
			// 				this.siteDown.apiParams.siteDownChecker.splice(index, 1);
			// 			}
			// 		}
			// 	});

			// 	const fmeMarkerConfig = [
			// 		{ check: this.siteDown.checker.fme.busy, marker: this.siteDown.marker.fme.fmeBusy, param: "busy" },
			// 		{ check: this.siteDown.checker.fme.idle, marker: this.siteDown.marker.fme.fmeIdle, param: "idle" }
			// 	];

			// 	this.siteDown.apiParams.hubType = [
			// 		{ check: "critical", param: "CRITICAL" },
			// 		{ check: "core", param: "CORE SITE" },
			// 		{ check: "big", param: "BIG HUB SITE" },
			// 		{ check: "medium", param: "MEDIUM HUB SITE" },
			// 		{ check: "small", param: "SMALL HUB SITE" },
			// 		{ check: "end", param: "END SITE" }
			// 	]
			// 		.filter((item) => this[item.check])
			// 		.map((item) => item.param);

			// 	const siteTypeValueConfig = [
			// 		{ check: "all", param: "NORMAL" },
			// 		{ check: "n3t", param: "N3T" },
			// 		{ check: "uso", param: "USO" }
			// 	];

			// 	const updateSiteType = () => {
			// 		this.siteDown.apiParams.siteType = siteTypeValueConfig.filter((item) => this.siteDown.checker.siteType[item.check]).map((item) => item.param);
			// 	};

			// 	updateSiteType();

			// 	// VIP CHECK
			// 	this.siteDown.apiParams.vipCheck = this.siteDown.checker.vip.isVip ? true : this.siteDown.checker.vip.nonVip ? false : null;

			// 	// POWER ALARM CHECK
			// 	this.siteDown.apiParams.powerAlarm = this.siteDown.checker.power.isPowerAlarm;

			// 	for (const { check, marker, param } of fmeMarkerConfig) {
			// 		hideLayerMarker(marker);
			// 		if (check) {
			// 			try {
			// 				const { res } = await getFmeMarker(param);
			// 				marker.data = res;
			// 				addLayerMarker(marker, this.globalProcess.store.maps.backgroundMaps, this);

			// 				// LOG MAPS HIT
			// 				// await postMapsHit("Apply Filter SiteDown", marker.data.length, "Site Down Marker", new Date());
			// 			} catch (error) {
			// 				console.error(`Error fetching marker data for ${param}:`, error);
			// 			}
			// 		}
			// 	}

			// 	// HIT MARKER LOOP
			// 	hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
			// 	try {
			// 		const { res } = await getSiteDownMarker(
			// 			this.siteDown.apiParams.siteDownChecker,
			// 			this.siteDown.apiParams.powerAlarm,
			// 			this.siteDown.apiParams.hubType,
			// 			this.siteDown.apiParams.vipCheck,
			// 			this.globalProcess.query.mc.searchQuery,
			// 			"",
			// 			this.siteDown.selector.mcCluster.value,
			// 			this.siteDown.selector.region.value,
			// 			this.siteDown.apiParams.siteType,
			// 			this.siteDown.selector.area.value
			// 		);
			// 		this.globalProcess.state.component.siteDownMarkerLoading = false;
			// 		this.siteDown.marker.aging.arraySiteDown.data = res;
			// 		addLayerMarker(this.siteDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);

			// 		// LOG MAPS HIT
			// 		// await postMapsHit("Apply Filter SiteDown", this.siteDown.marker.aging.arraySiteDown.data.length, "Site Down Marker", new Date());
			// 	} catch (error) {
			// 		this.globalProcess.state.component.siteDownMarkerLoading = false;
			// 		this.globalProcess.state.component.applyFilterLoading = false;
			// 		console.error(`Error fetching marker data for :`, error);
			// 	}

			// 	this.globalProcess.state.component.applyFilterLoading = false;
			// 	this.componentState += 1;
			// } catch (error) {

			try {
				// HIT MARKER LOOP
				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
				hideLayerMarker(this.oltDown.marker.aging.arraySiteDown);
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
				this.globalProcess.state.component.applyFilterLoading = false;
				this.componentState += 1;
			} catch (error) {
				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.siteDownMarkerLoading = false;
				console.error("Error applying filter:", error);
			} finally {
				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.siteDownMarkerLoading = false;
			}
		},
		async oltDownCheck() {
			this.removeInfoWindow();
			this.coreRouter.state.isCoreRouterTab = false;

			this.globalProcess.state.searching.clearSearchBtn = false;
			this.globalProcess.state.tab.selectedOption = "oltDown";
			this.globalProcess.state.component.applyFilterLoading = true;
			this.siteDown.inputSite = "";

			this.resetDataState();
			backgroundMapsPanZoom(0.55942, 125.348276, 5);

			hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
			hideLayerMarker(this.oltDown.marker.aging.arraySiteDown);
			try {
				const { res } = await getOltDownMarker(
					this.oltDown.apiParams.siteDownChecker,
					this.oltDown.apiParams.hubCheck,
					this.oltDown.apiParams.vipCheck,
					this.oltDown.apiParams.siteType,
					this.oltDown.selector.area.value,
					this.oltDown.apiParams.siteDownCheck,
					this.oltDown.start_time,
					this.oltDown.end_time,
					this.siteDown.inputSite
				);
				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.oltDown.marker.aging.arraySiteDown.data = res;
				addLayerMarker(this.oltDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);

				// LOG MAPS HIT
				// await postMapsHit("Apply Filter SiteDown", this.siteDown.marker.aging.arraySiteDown.data.length, "Site Down Marker", new Date());
			} catch (error) {
				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.globalProcess.state.component.applyFilterLoading = false;
				console.error(`Error fetching marker data for :`, error);
			}

			// 新加调用所有面板
			await getDurationRangeBreakOltdown(
				this.oltDown.apiParams.siteDownChecker,
				this.oltDown.apiParams.hubCheck,
				this.oltDown.apiParams.vipCheck,
				this.oltDown.apiParams.siteType,
				this.oltDown.selector.area.value,
				this.oltDown.apiParams.siteDownCheck,
				this.oltDown.start_time,
				this.oltDown.end_time
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

			await getCountTtCorrelationOlt(this.oltDown.start_time, this.oltDown.end_time)
				.then(({ res }) => {
					this.oltDown.store.ttCorrelation.data = res.results;
					this.oltDown.store.ttCorrelation.data.sort((a, b) => {
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

			await getCountTtCorrelationDetailsOlt(this.oltDown.start_time, this.oltDown.end_time)
				.then(({ res }) => {
					this.oltDown.store.ttCorrelation.tableData = res._values;
					// this.oltDown.state.ttCorrelation.ttTableLoading = false;
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
					// this.oltDown.state.ttCorrelation.ttTableLoading = false;
				});

			await getAllOltDownDataTable(this.oltDown.apiParams.hubCheck, this.oltDown.selector.area.value, this.oltDown.apiParams.vipCheck, this.oltDown.apiParams.siteType, this.oltDown.apiParams.siteDownCheck, this.oltDown.start_time, this.oltDown.end_time)
				.then(({ res }) => {
					console.log(res, "result get data site down data table");
					this.oltDown.state.modalExport.data = res;
					// this.oltDown.state.modalExport.loading == false;
				})
				.catch((error) => {
					// this.oltDown.state.modalExport.loading == false;
					console.error(error);
				});
			await getOltDownByHubType(this.oltDown.apiParams.siteDownChecker, this.oltDown.apiParams.hubCheck, this.oltDown.selector.area.value, this.oltDown.apiParams.vipCheck, this.oltDown.apiParams.siteType, this.oltDown.apiParams.siteDownCheck, this.oltDown.start_time, this.oltDown.end_time)
				.then(({ res }) => {
					this.oltDown.state.collapse.data = res;
					// this.oltDown.store.exportSiteDownAlarm.loading = false;
				})
				.catch((error) => {
					// this.oltDown.store.exportSiteDownAlarm.loading = false;
					console.error(error);
				});

			this.globalProcess.state.component.applyFilterLoading = false;
			this.globalProcess.state.component.siteDownMarkerLoading = false;
		},

		async neDownCheck() {
			this.removeInfoWindow();
			this.coreRouter.state.isCoreRouterTab = false;

			this.globalProcess.state.searching.clearSearchBtn = false;
			this.globalProcess.state.tab.selectedOption = "neDown";
			this.globalProcess.state.component.applyFilterLoading = true;
			this.neDown.component.bannerState = this.neDown.component.bannerState + 1;

			this.resetDataState();

			// PAN TO WHOLE INDONESIA
			backgroundMapsPanZoom(0.55942, 125.348276, 4.85);

			try {
				const neDownMarkerConfig = [
					{ check: this.neDown.checker.marker.oneHour, param: "1" },
					{ check: this.neDown.checker.marker.fourHour, param: "1_4" },
					{ check: this.neDown.checker.marker.eightHour, param: "4_8" },
					{ check: this.neDown.checker.marker.twentyFourHour, param: "8_24" },
					{ check: this.neDown.checker.marker.moreDay, param: "m24" }
				];

				neDownMarkerConfig.forEach((config) => {
					const index = this.neDown.apiParams.neDownChecker.indexOf(config.param);

					if (config.check) {
						if (index === -1) {
							this.neDown.apiParams.neDownChecker.push(config.param);
						}
					} else {
						if (index !== -1) {
							this.neDown.apiParams.neDownChecker.splice(index, 1);
						}
					}
				});

				const neFmeMarkerConfig = [
					{ check: this.neDown.checker.fme.busy, marker: this.neDown.marker.fme.fmeBusy, param: "busy" },
					{ check: this.neDown.checker.fme.idle, marker: this.neDown.marker.fme.fmeIdle, param: "idle" }
				];

				this.neDown.apiParams.hubType = [
					{ check: "critical", param: "CRITICAL" },
					{ check: "core", param: "CORE SITE" },
					{ check: "big", param: "BIG HUB SITE" },
					{ check: "medium", param: "MEDIUM HUB SITE" },
					{ check: "small", param: "SMALL HUB SITE" },
					{ check: "end", param: "END SITE" }
				]
					.filter((item) => this[item.check])
					.map((item) => item.param);

				// VIP CHECK
				this.neDown.apiParams.vipCheck = this.neDown.checker.vip.isVip ? true : this.neDown.checker.vip.nonVip ? false : null;

				const siteTypeValueConfig = [
					{ check: "all", param: "NORMAL" },
					{ check: "n3t", param: "N3T" },
					{ check: "uso", param: "USO" }
				];

				const updateSiteType = () => {
					this.neDown.apiParams.siteType = siteTypeValueConfig.filter((item) => this.neDown.checker.siteType[item.check]).map((item) => item.param);
				};

				updateSiteType();

				// HIT MARKER LOOP
				hideLayerMarker(this.neDown.marker.aging.arrayNeDown);
				const { res } = await getNeDownMarker(
					this.neDown.apiParams.neDownChecker,
					this.neDown.apiParams.hubType,
					this.neDown.apiParams.vipCheck,
					this.globalProcess.query.mc.searchQuery,
					"",
					this.neDown.selector.mcCluster.value,
					this.neDown.selector.area.value,
					this.neDown.selector.region.selectedOption,
					this.neDown.apiParams.neType,
					this.neDown.apiParams.siteType
				);

				this.neDown.marker.aging.arrayNeDown.data = res;
				addLayerMarker(this.neDown.marker.aging.arrayNeDown, this.globalProcess.store.maps.backgroundMaps, this);

				// LOG MAPS HIT
				await postMapsHit("Apply Filter NE Down", this.neDown.marker.aging.arrayNeDown.data.length, "NE Down Marker", new Date());

				for (const { check, marker, param } of neFmeMarkerConfig) {
					hideLayerMarker(marker);
					if (check) {
						try {
							const { res } = await getFmeMarker(param);
							marker.data = res;
							addLayerMarker(marker, this.globalProcess.store.maps.backgroundMaps, this);

							// LOG MAPS HIT
							await postMapsHit("Apply Filter NE DOWN", marker.data.length, "FME NE Down Marker", new Date());
						} catch (error) {
							console.error(`Error fetching marker data for ${param}:`, error);
						}
					}
				}
				this.componentState += 1;
			} catch (error) {
				console.error("Error applying filter:", error);
			} finally {
				this.globalProcess.state.component.applyFilterLoading = false;
			}
		},

		async pgTrackCheck() {
			this.removeInfoWindow();
			this.coreRouter.state.isCoreRouterTab = false;

			this.globalProcess.state.searching.clearSearchBtn = false;
			this.globalProcess.state.tab.selectedOption = "pgTracking";
			this.globalProcess.state.component.loadingMarkerPg = true;

			this.resetDataState();

			// PAN MAP TO JAKARTA
			backgroundMapsPanZoom(-6.173321, 106.840754, 11.7);

			// HIDE SEARCHING AND COVERAGE MARKERS
			const siteDownPgConfigs = [
				{ check: this.pg.checker.site.oneHour, marker: this.pg.marker.site.oneHour, param: "1" },
				{ check: this.pg.checker.site.fourHour, marker: this.pg.marker.site.fourHour, param: "1_4" },
				{ check: this.pg.checker.site.eightHour, marker: this.pg.marker.site.eightHour, param: "4_8" },
				{ check: this.pg.checker.site.twentyFourHour, marker: this.pg.marker.site.twentyFourHour, param: "8_24" },
				{ check: this.pg.checker.site.moreDay, marker: this.pg.marker.site.moreDay, param: "m24" }
			];

			const isAllSiteDownMarker = siteDownPgConfigs.every((config) => config.check);

			try {
				if (isAllSiteDownMarker == true) {
					hideLayerMarker(this.pg.marker.site.all);
					const { res } = await getSiteDownPgMarker("", this.pg.apiParams.hubType, this.pg.apiParams.vipCheckPg, this.pg.apiParams.genset, this.pg.selector.region.selectedOption, this.pg.selector.area.value, this.pg.selector.mcCluster.value);
					this.pg.marker.site.all.data = res;

					// LOG MAPS HIT
					await postMapsHit("Tab PG Check", this.pg.marker.site.all.data.length, "PG Site Down Marker", new Date());

					addLayerMarker(this.pg.marker.site.all, this.globalProcess.store.maps.backgroundMaps, this);
				} else {
					for (const { check, marker, param } of siteDownPgConfigs) {
						hideLayerMarker(marker);
						if (check) {
							try {
								const { res } = await getSiteDownPgMarker(param, this.pg.apiParams.hubType, this.pg.apiParams.vipCheckPg, this.pg.apiParams.genset, this.pg.selector.region.selectedOption, this.pg.selector.area.value, this.pg.selector.mcCluster.value);
								marker.data = res;

								addLayerMarker(marker, this.globalProcess.store.maps.backgroundMaps, this);

								// LOG MAPS HIT
								await postMapsHit("Tab PG Check", marker.data.length, "PG Site Down Marker", new Date());
							} catch (error) {
								console.error(`Error fetching marker data for ${param}:`, error);
							}
						}
					}
				}
			} finally {
				this.globalProcess.state.component.loadingMarkerPg = false;
			}

			const fmePgConfig = [
				{ check: this.pg.checker.fme.idle, marker: this.pg.marker.fme.idle, param: "idle" },
				{ check: this.pg.checker.fme.movement, marker: this.pg.marker.fme.movementPg, param: "pg_movement" },
				{ check: this.pg.checker.fme.installed, marker: this.pg.marker.fme.installedPg, param: "pg_installed" }
			];

			fmePgConfig.forEach((config) => {
				if (config.check) {
					this.pg.apiParams.pgParams.push(config.param);
				}
			});

			hideLayerMarker(this.pg.marker.fme.pgAll);

			try {
				const { res } = await getFmePgMarker(this.pg.apiParams.pgParams, this.pg.selector.region.value, this.pg.selector.area.value, this.pg.selector.mcCluster.selectedOption, this.pg.apiParams.hubType);
				this.pg.marker.fme.pgAll.data = res;

				addLayerMarker(this.pg.marker.fme.pgAll, this.globalProcess.store.maps.backgroundMaps, this);
				// LOG MAPS HIT
				await postMapsHit("Tab PG Check", this.pg.marker.fme.pgAll.data.length, "PG Marker", new Date());
			} catch (error) {
				console.error(`Error fetching marker data for ${param}:`, error);
			}
		},

		async dwdmCheck() {
			this.removeInfoWindow();
			this.coreRouter.state.isCoreRouterTab = false;

			this.globalProcess.state.searching.clearSearchBtn = false;
			this.globalProcess.state.tab.selectedOption = "dwdmCheckTab";

			// UPDATE STATE
			this.dwdm.state.dwdmBanner = this.dwdm.state.dwdmBanner + 1;

			// LOADING
			this.globalProcess.state.component.loadingDwdmData = true;
			this.globalProcess.state.component.loadingDwdmMarker = true;

			this.resetDataState();

			// PAN TO WHOLE INDONESIA
			backgroundMapsPanZoom(0.55942, 125.348276, 5);

			// LINE DWDM
			try {
				const { res } = await getLineDwdm(this.dwdm.apiParams.dwdmLinkVendor);
				this.dwdm.line.dwdmLine.data = res;
				this.dwdm.marker.vertex.vertexLine.data = this.dwdm.line.dwdmLine.data.flatMap((item) =>
					item.lineCoords
						.filter((coord) => coord.lat !== null && coord.lng !== null)
						.map((coord) => ({
							lat: coord.lat,
							lon: coord.lng,
							siteId: coord.site_id,
							src: "https://1057-sg-studio.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v4/dwdm/Ellipse.png"
						}))
				);

				if (this.dwdm.checker.map.showLine == true) {
					addLayerLine(this.dwdm.line.dwdmLine, this.globalProcess.store.maps.backgroundMaps, this);
				}
				if (this.dwdm.checker.map.showNode == true) {
					addLayerMarker(this.dwdm.marker.vertex.vertexLine, this.globalProcess.store.maps.backgroundMaps, this);
				}
			} catch (error) {
				console.error("Error : ", error);
			}

			// CALL DWDM MARKER SERVICE
			const dwdmStatusConfig = [
				{ check: this.dwdm.checker.status.normalCheck, params: "normal" },
				{ check: this.dwdm.checker.status.withAlarmCheck, params: "all_alarm" },
				{ check: this.dwdm.checker.status.powerAlarmCheck, params: "power" },
				{ check: this.dwdm.checker.status.powerDgCheck, params: "power_dg" },
				{ check: this.dwdm.checker.status.temperatureCheck, params: "temp" },
				{ check: this.dwdm.checker.status.unmanagedCheck, params: "unmanaged" },
				{ check: this.dwdm.checker.status.suspectDown, params: "down" },
				{ check: this.dwdm.checker.status.transportCheck, params: "transport" }
			];

			this.dwdm.apiParams.dwdmStatus = [];

			dwdmStatusConfig.forEach((item) => {
				if (item.check) {
					this.dwdm.apiParams.dwdmStatus.push(item.params);
				}
			});

			hideLayerMarker(this.dwdm.marker.site.dwdmMarker);
			try {
				const { res } = await getAllDwdmMarkers(this.dwdm.apiParams.dwdmStatus, this.dwdm.apiParams.dwdmHubType, this.dwdm.selector.mcCluster.value, this.dwdm.selector.area.value, this.dwdm.apiParams.dwdmGenset, this.dwdm.apiParams.dwdmSiteType, this.dwdm.selector.region.selectedOption);

				this.dwdm.marker.site.dwdmMarker.data = res;

				if (this.dwdm.checker.map.showSite == true) {
					addLayerMarker(this.dwdm.marker.site.dwdmMarker, this.globalProcess.store.maps.backgroundMaps, this);
				}
				// LOG MAPS HIT
				await postMapsHit("Tab DWDM Check", this.dwdm.marker.site.dwdmMarker.data.length, "DWDM Site Down Marker", new Date());

				this.globalProcess.state.component.loadingDwdmData = false;
				this.globalProcess.state.component.loadingDwdmMarker = false;
			} catch (error) {
				this.globalProcess.state.component.loadingDwdmData = false;
				this.globalProcess.state.component.loadingDwdmMarker = false;
				console.error(`Error fetching marker data for dwdm`, error);
			}
		},

		async linkDownCheck() {
			this.removeInfoWindow();
			this.resetDataState();
			this.coreRouter.state.isCoreRouterTab = false;

			this.globalProcess.state.tab.selectedOption = "linkDown";
			this.globalProcess.state.component.loadingLinkDownData = true;
			this.linkDown.component.bannerState = this.linkDown.component.bannerState + 1;

			backgroundMapsPanZoom(0.55942, 121.348276, 5);

			// GET DATA LINK DOWN LINE
			// await getLineLinkDown()
			// 	.then(({ res }) => {
			const res = {
				SMTR: {
					line: [
						{
							lineCoords: [
								{
									lat: "0.49014",
									lng: "101.39419"
								},
								{
									lat: "0.5327",
									lng: "101.43425"
								}
							],
							strokeColor: "#376422",
							source_site_id: "04PBR0044",
							destination_site_id: "04PBR0187"
						},
						{
							lineCoords: [
								{
									lat: "0.49014",
									lng: "101.39419"
								},
								{
									lat: "0.49014",
									lng: "101.39419"
								}
							],
							strokeColor: "#376422",
							source_site_id: "04PBR0044",
							destination_site_id: "04PBR0044"
						},
						{
							lineCoords: [
								{
									lat: "-5.36464",
									lng: "105.25833"
								},
								{
									lat: "-5.36464",
									lng: "105.25833"
								}
							],
							strokeColor: "#376422",
							source_site_id: "09TJK0113",
							destination_site_id: "09TJK0113"
						}
					],
					total_ticket: 3
				},
				KSMP: {
					line: [
						{
							lineCoords: [
								{
									lat: "-0.04767",
									lng: "109.32418"
								},
								{
									lat: "-0.04767",
									lng: "109.32418"
								}
							],
							strokeColor: "#376422",
							source_site_id: "20PTK0067",
							destination_site_id: "20PTK0067"
						},
						{
							lineCoords: [
								{
									lat: "-0.04767",
									lng: "109.32418"
								},
								{
									lat: "0.19536",
									lng: "109.14914"
								}
							],
							strokeColor: "#376422",
							source_site_id: "20PTK0067",
							destination_site_id: "20MPW0044"
						},
						{
							lineCoords: [
								{
									lat: "-0.51021",
									lng: "117.14319"
								},
								{
									lat: "-0.51021",
									lng: "117.14319"
								}
							],
							strokeColor: "#376422",
							source_site_id: "22SMR0088",
							destination_site_id: "22SMR0088"
						},
						{
							lineCoords: [
								{
									lat: "-0.51021",
									lng: "117.14319"
								},
								{
									lat: "-0.7866",
									lng: "117.23006"
								}
							],
							strokeColor: "#376422",
							source_site_id: "22SMR0088",
							destination_site_id: "22TRG0171"
						}
					],
					total_ticket: 4
				},
				JAYA: {
					line: [],
					total_ticket: 0
				},
				JAVA: {
					line: [],
					total_ticket: 0
				}
			};
			this.linkDown.store.polyLineData.smtr = res.SMTR.line;
			this.linkDown.store.polyLineData.ksmp = res.KSMP.line;
			this.linkDown.store.polyLineData.java = res.JAVA.line;
			this.linkDown.store.polyLineData.jaya = res.JAYA.line;

			this.linkDown.store.infoWindow.ticketSmtr = parseFloat(res.SMTR.total_ticket);
			this.linkDown.store.infoWindow.ticketKsmp = parseFloat(res.KSMP.total_ticket);
			this.linkDown.store.infoWindow.ticketJava = parseFloat(res.JAVA.total_ticket);
			this.linkDown.store.infoWindow.ticketJaya = parseFloat(res.JAYA.total_ticket);
			// })
			// .catch((error) => {
			// 	console.error("Error fetching data:", error);
			// });

			// FETCH MARKER DATA
			// await getAllLinkDownMarkers()
			// 	.then(({ res }) => {
			let res1 = [
				{
					site_id: "13CMI0081",
					title: "13CMI0081",
					site_name: "13CMI0081_GUNUNGBATUINDONESIANTOWER_TB",
					site_class: "CRITICAL",
					lessor_name: "MC-CIMAHI",
					circle: "JAYA",
					five_region: "WEST JAVA & CENTRAL JAVA",
					sitecode: "13CMI0081",
					site_type: "RAN",
					transport_type: "DWDM",
					lat: "-6.88511",
					lon: "107.56428",
					site_address: "KAMPUNG RANCABALI RT/RW 06/03KEL PASIR KALIKI KEC CIMAHICIMAHIJAWA BARAT",
					hub_type: "BIG HUB SITE",
					is_vip: "No",
					src: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v4/dwdm/DWDMPowerAlarmWithDG_Land.png?_v=standard_1726746087318?t=1726759430098"
				},
				{
					site_id: "13CMI0083",
					title: "13CMI0083",
					site_name: "13CMI0083_MESINSARIWANGI_PL",
					site_class: "CRITICAL",
					lessor_name: "MC-CIMAHI",
					circle: "JAYA",
					five_region: "WEST JAVA & CENTRAL JAVA",
					sitecode: "13CMI0083",
					site_type: "RAN",
					transport_type: "DWDM",
					lat: "-6.87575",
					lon: "107.56478",
					site_address: "JL MESIN NO 61C PERUM DOSEN POLBAN RT 02 RW 01 DS SARIWANGI KEC PARONGPONG BANDUNG",
					hub_type: "BIG HUB SITE",
					is_vip: "No",
					src: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v4/dwdm/DWDMPowerAlarmWithDG_Land.png?_v=standard_1726746087318?t=1726759430098"
				},
				{
					site_id: "27TLI0006",
					title: "27TLI0006",
					site_name: "27TLI0006_LAULALANG_TELUKAGUNG_PL",
					site_class: "CRITICAL",
					lessor_name: "MC-PARIGI",
					circle: "KALISUMAPA",
					five_region: "KALIMANTAN & SULAMPAPUA",
					sitecode: "27TLI0006",
					site_type: "RAN",
					transport_type: "DWDM",
					lat: "1.3319",
					lon: "120.9286",
					site_address: "JL. KESEHATAN NO. 292, RT 005 RW 000, DUSUN BABANDANG, DS. LAULALANG, KEC. TOLI TOLI UTARA, KAB. TOLI - TOLI, PROV. SULAWESI TENGAH",
					hub_type: "BIG HUB SITE",
					is_vip: "No",
					src: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v4/dwdm/DWDMPowerAlarmWithDG_Land.png?_v=standard_1726746087318?t=1726759430098"
				}
			];
			this.linkDown.marker.smtrMarker.data = res1.filter((data) => data.circle == "SUMATERA");
			this.linkDown.marker.jayaMarker.data = res1.filter((data) => data.circle == "JAYA");
			this.linkDown.marker.javaMarker.data = res1.filter((data) => data.circle == "JAVA");
			this.linkDown.marker.ksmpMarker.data = res1.filter((data) => data.circle == "KALISUMAPA");
			this.globalProcess.state.component.loadingLinkDownData = false;
			// })
			// .catch((error) => {
			// 	this.globalProcess.state.component.loadingLinkDownData = false;
			// 	console.error("Error fetching data:", error);
			// });

			// INFO WINDOW CONFIG
			const infoWindows = [
				{
					lat: -0.457054,
					lng: 101.805728,
					name: "SMTR",
					totalTicket: this.linkDown.store.infoWindow.ticketSmtr,
					color: "#30B5C5",
					id: "0",
					infoWindow: "smtr",
					lineData: this.linkDown.store.polyLineData.smtr,
					lineStore: this.linkDown.line.linkSmtr,
					markerData: this.linkDown.marker.smtrMarker
				},
				{
					lat: -6.546265,
					lng: 106.925406,
					name: "JAYA",
					totalTicket: this.linkDown.store.infoWindow.ticketJaya,
					color: "#2D9CDB",
					id: "1",
					infoWindow: "jaya",
					lineData: this.linkDown.store.polyLineData.jaya,
					lineStore: this.linkDown.line.linkJaya,
					markerData: this.linkDown.marker.jayaMarker
				},
				{
					lat: -8.332781,
					lng: 114.686932,
					name: "JAVA",
					totalTicket: this.linkDown.store.infoWindow.ticketJava,
					color: "#ED6D00",
					id: "2",
					infoWindow: "java",
					lineData: this.linkDown.store.polyLineData.java,
					lineStore: this.linkDown.line.linkJava,
					markerData: this.linkDown.marker.javaMarker
				},
				{
					lat: -1.036092,
					lng: 116.131078,
					name: "KSMP",
					totalTicket: this.linkDown.store.infoWindow.ticketKsmp,
					color: "#62B230",
					id: "3",
					infoWindow: "ksmp",
					lineData: this.linkDown.store.polyLineData.ksmp,
					lineStore: this.linkDown.line.linkKsmp,
					markerData: this.linkDown.marker.ksmpMarker
				}
			];

			// CREATE INFO WINDOW
			infoWindows.forEach((window) => {
				if (this.linkDown.store.infoWindow[window.infoWindow] == null) {
					this.linkDown.store.infoWindow[window.infoWindow] = createInfoWindow(
						window.lat,
						window.lng,
						this.globalProcess.store.maps.backgroundMaps,
						window.lineData,
						window.name,
						window.totalTicket,
						window.lineStore,
						window.color,
						window.id,
						this.linkDown.store.infoWindow[window.infoWindow],
						window.markerData
					);
				}
			});
		},

		async coreRouterCheck() {
			this.removeInfoWindow();
			this.coreRouter.state.isCoreRouterTab = true;
			this.globalProcess.state.searching.clearSearchBtn = false;
			this.globalProcess.state.tab.selectedOption = "coreRouter";
			this.globalProcess.state.component.applyFilterLoading = true;

			// BANNER STATE
			this.coreRouter.state.coreRouterBanner = this.coreRouter.state.coreRouterBanner + 1;

			// LOADING
			this.globalProcess.state.component.loadingCoreRouterData = true;
			this.globalProcess.state.component.loadingCoreRouterMarker = true;
			this.resetDataState();

			// PAN TO WHOLE INDONESIA
			backgroundMapsPanZoom(0.55942, 125.348276, 5);

			const coreRouterStatusConfig = [
				{ check: this.coreRouter.checker.siteAlarm.unmanaged, params: "unmanaged" },
				{ check: this.coreRouter.checker.siteAlarm.hardwareFault, params: "hardware" },
				{ check: this.coreRouter.checker.siteAlarm.powerAlarm, params: "power" },
				{ check: this.coreRouter.checker.siteAlarm.linkDown, params: "linkdown" },
				{ check: this.coreRouter.checker.siteAlarm.highUtilization, params: "highutil" },
				{ check: this.coreRouter.checker.siteAlarm.highTemperature, params: "hightemp" }
			];

			this.coreRouter.apiParams.coreRouterStatus = [];

			coreRouterStatusConfig.forEach((item) => {
				if (item.check) {
					this.coreRouter.apiParams.coreRouterStatus.push(item.params);
				}
			});

			hideLayerMarker(this.coreRouter.marker.site.coreRouterMarker);
			try {
				const { res } = await getAllCoreRouterMarker(this.coreRouter.apiParams.coreRouterStatus, this.coreRouter.apiParams.coreRouterHubType, this.coreRouter.selector.mcCluster.value, this.coreRouter.selector.region.selectedOption, null, null);

				this.coreRouter.marker.site.coreRouterMarker.data = res;

				addLayerMarker(this.coreRouter.marker.site.coreRouterMarker, this.globalProcess.store.maps.backgroundMaps, this);

				// LOG MAPS HIT
				await postMapsHit("Tab Core Router Check", this.coreRouter.marker.site.coreRouterMarker.data.length, "Core Router Site Marker", new Date());

				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.loadingCoreRouterData = false;
				this.globalProcess.state.component.loadingCoreRouterMarker = false;
			} catch (error) {
				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.loadingCoreRouterData = false;
				this.globalProcess.state.component.loadingCoreRouterMarker = false;
				console.error(`Error fetching marker data for dwdm`, error);
			}
			this.globalProcess.state.component.applyFilterLoading = false;
		},

		openModal() {
			const modalElement = document.getElementById("searchingModal");
			if (modalElement) {
				const searchingModal = new bootstrap.Modal(modalElement, {
					backdrop: "static"
				});
				this.globalProcess.state.searching.modalSearchState = this.globalProcess.state.searching.modalSearchState + 1;
				searchingModal.show();
			} else {
				console.error("Modal element with ID 'searchingModal' not found.");
			}
		},

		async searchSite() {
			if (this.globalProcess.state.tab.selectedOption == "siteDown") {
				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
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
			}
			if (this.globalProcess.state.tab.selectedOption == "oltDown") {
				hideLayerMarker(this.oltDown.marker.aging.arraySiteDown);
				const { res } = await getOltDownMarker(
					this.oltDown.apiParams.siteDownChecker,
					this.oltDown.apiParams.hubCheck,
					this.oltDown.apiParams.vipCheck,
					this.oltDown.apiParams.siteType,
					this.oltDown.selector.area.value,
					this.oltDown.apiParams.siteDownCheck,
					this.oltDown.start_time,
					this.oltDown.end_time,
					this.siteDown.inputSite
				);
				this.oltDown.marker.aging.arraySiteDown.data = res;
				addLayerMarker(this.oltDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);
			}
		},

		async resetDataState() {
			const resetComponentApply = (component) => {
				component.regionApply = false;
				component.mcApply = false;
			};

			["pg", "dwdm", "siteDown", "neDown", "coreRouter"].forEach((key) => resetComponentApply(this[key]));
			resetComponentApply(this.globalProcess.state);
			this.globalProcess.state.component.areaApply = false;

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

			["siteDown", "neDown", "pg", "dwdm"].forEach((key) => resetSelector(this[key].selector));

			const hideMarkersAndLines = () => {
				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
				hideLayerMarker(this.neDown.marker.aging.arrayNeDown);
				hideLayerMarker(this.dwdm.marker.vertex.vertexLine);
				hideLayerMarker(this.coreRouter.marker.site.coreRouterMarker);
				hideLayerLine(this.dwdm.line.dwdmLine);
				hideLayerLine(this.linkDown.line.linkSmtr);
				hideLayerLine(this.linkDown.line.linkJava);
				hideLayerLine(this.linkDown.line.linkJaya);
				hideLayerLine(this.linkDown.line.linkKsmp);
				hideLayerMarker(this.linkDown.marker.smtrMarker);
				hideLayerMarker(this.linkDown.marker.jayaMarker);
				hideLayerMarker(this.linkDown.marker.ksmpMarker);
				hideLayerMarker(this.linkDown.marker.javaMarker);
				hideLayerMarker(this.obd.marker.obdCarMarker);
			};

			hideMarkersAndLines();

			const allMarkers = [
				...Object.values(this.siteDown.marker.aging),
				...Object.values(this.siteDown.marker.fme),
				...Object.values(this.neDown.marker.aging),
				...Object.values(this.neDown.marker.fme),
				...Object.values(this.pg.marker.site),
				...Object.values(this.pg.marker.fme),
				...Object.values(this.dwdm.marker.site),
				...Object.values(this.dwdm.marker.fme),
				...Object.values(this.coreRouter.marker.site),
				this.dwdm.marker.site.dwdmMarker
			];

			allMarkers.forEach(hideLayerMarker);

			const markersToHide = [siteSearchMarker, coverageSite, fmeSearchMarker, coverageMcCluster];
			markersToHide.forEach((marker) => marker && toRaw(marker).setMap(null));

			this.siteDown.component.regionApply = false;
			this.siteDown.component.mcApply = false;
			this.siteDown.component.areaApply = false;

			this.neDown.component.regionApply = false;
			this.neDown.component.mcApply = false;
			this.neDown.component.areaApply = false;

			this.pg.component.regionApply = false;
			this.pg.component.mcApply = false;
			this.pg.component.areaApply = false;

			this.dwdm.component.regionApply = false;
			this.dwdm.component.mcApply = false;
			this.dwdm.component.areaApply = false;

			this.removeInfoWindow();
		},

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
		}
	}
};
</script>

<style>
.button {
	float: left;
	margin: 0 5px 0 0;
	width: 115px;
	height: 40px;
	position: relative;
	cursor: pointer;
}

.button label,
.button input {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	cursor: pointer;
}

.button input[type="radio"] {
	opacity: 0.011;
	z-index: 100;
	cursor: pointer;
}

.button input[type="radio"]:checked + label {
	background: #fff9f3;
	border-radius: 8px;
	border: 2px solid #ed6d00;
	font-weight: 600;
	color: #ed6d00;
	cursor: pointer;
}

.button label {
	cursor: pointer;
	line-height: 1.8em;
	background: #ffffff;
	color: #dcdddd;
	font-weight: 600;
	border: 1px solid #dcdddd;
	border-radius: 8px;
}

.button:hover label {
	background: #fff9f3;
	border-radius: 8px;
	border: 2px solid #ed6d00;
	font-weight: 600;
	color: #ed6d00;
	cursor: pointer;
}

.btn-filter {
	margin: 0 5px 0 0;
	width: 95px;
	height: 40px;
	cursor: pointer;
	line-height: 1.8em;
	background: #ffffff;
	color: #313131;
	font-weight: 600;
	border: 1px solid #dcdddd;
	border-radius: 8px;
	cursor: pointer;
	align-self: center;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}

.btn-filter:hover {
	background: #fff9f3;
	border-radius: 8px;
	border: 2px solid #ed6d00;
	font-weight: 600;
	color: #ed6d00;
	cursor: pointer;
}

.input-group-text {
	background-color: white !important;
	border-right: none !important;
	border-radius: 8px 0px 0px 8px;
}

.search-global-input {
	border-left: none !important;
}

.width-35 {
	width: 35% !important;
}

@media screen and (max-width: 1536px) and (min-width: 1366px) {
	.width-35 {
		width: 32.2% !important;
	}
}

@media screen and (max-width: 1756px) and (min-width: 1536px) {
	.width-35 {
		width: 34.5% !important;
	}
}
</style>
