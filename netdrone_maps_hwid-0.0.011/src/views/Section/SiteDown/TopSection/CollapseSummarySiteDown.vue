<template>
	<div id="card-site-down-summary" class="position-absolute responsive-absolute-sd">
		<div class="collapse collapse mt-4 pt-2 collapsed" id="collapseSummarySiteDown" ref="collapseSummarySiteDown">
			<div class="card card-body">
				<div class="row d-flex flex-row align-items-center mb-2 justify-content-between" style="zoom: 85%; width: 550px">
					<div class="row d-flex flex-row align-items-center width-fit-content">
						<div class="site-down-summary-drag-handle fit-content">
							<i class="bi bi-list font-28 text-lighter-grey"></i>
						</div>
						<i class="bi bi-ticket-detailed width-fit-content text-ioh font-20"></i>
						<p class="width-fit-content font-700 font-16 text-ioh ps-0">Summary Site Down</p>
					</div>
					<div class="row d-flex flex-row align-items-center mb-2 pe-3" style="width: fit-content">
						<button :disabled="this.siteDown.store.exportSiteDownAlarm.loading == true" class="btn btn-clear btn-clear-width" @click="exportTableData()" style="width: 135px !important; font-size: 12px">Export All Data</button>
					</div>
				</div>
				<div v-if="this.siteDown.state.collapse.loading == true" class="row d-flex flex-row mb-2 box-row-ticket-open">
					<div class="d-flex flex-row justify-content-center">
						<div class="bg-card-loader"></div>
					</div>
				</div>
				<div v-if="this.siteDown.state.collapse.loading == false" class="row d-flex flex-row mb-2 box-row-ticket-open">
					<table class="table table-striped table-bordered table-hover font-14">
						<thead>
							<tr>
								<th class="align-content-center text-center font-inter font-600" style="color: #313131; font-size: 13px" rowspan="2">No</th>
								<th class="align-content-center text-center font-inter font-600" style="color: #313131; font-size: 13px" rowspan="2">Circle</th>
								<th class="align-content-center text-center font-inter font-600" style="color: #313131; font-size: 13px" rowspan="2">Core</th>
								<th class="align-content-center text-center font-inter font-600" style="color: #313131; font-size: 13px" rowspan="2">Big</th>
								<th class="align-content-center text-center font-inter font-600" style="color: #313131; font-size: 13px" rowspan="2">Medium</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(data, index) in siteDown.state.collapse.data" :key="data.circle">
								<td class="align-content-center text-center font-inter font-400 px-3">{{ index + 1 }}</td>
								<td class="align-content-center text-center font-inter font-400 px-5 text-ioh text-hoverable" @click="filterCircle(data.circle)">
									{{ data.circle }}
								</td>
								<td class="align-content-center text-center font-inter font-400 px-3">{{ data.core }}</td>
								<td class="align-content-center text-center font-inter font-400 px-3">{{ data.big }}</td>
								<td class="align-content-center text-center font-inter font-400 px-3">{{ data.medium }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<!-- EXPORT DUMP DATA -->
	<div class="row" style="display: none !important">
		<table class="table table-striped table-bordered table-hover font-20" ref="exportSiteDownListSummary">
			<thead>
				<tr>
					<th>Site ID</th>
					<th>Site Name</th>
					<th>Four Circle</th>
					<th>Five Region</th>
					<th>12 Region</th>
					<th>Hub Type</th>
					<th>Down Duration</th>
					<th>Alarm Name</th>
					<th>Last Occurence</th>
					<th>Alarm Source</th>
					<th>Aging</th>
					<th>Power Alarm</th>
					<th>Power Alarm Last Occurence</th>
					<th>ROH Name</th>
					<th>ROH Phone</th>
					<th>Site Type</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="data in this.siteDown.store.exportSiteDownAlarm.data">
					<td>{{ data.sitecode != undefined ? data.sitecode : "" }}</td>
					<td>{{ data.site_name != undefined ? data.site_name : "" }}</td>
					<td>{{ data.circle != undefined ? data.circle : "" }}</td>
					<td>{{ data.five_region != undefined ? data.five_region : "" }}</td>
					<td>{{ data.region != undefined ? data.region : "" }}</td>
					<td>{{ data.hub_type != undefined ? data.hub_type : "" }}</td>
					<td>{{ data.down_duration != undefined ? data.down_duration : "" }}</td>
					<td>{{ data.alarmname != undefined ? data.alarmname : "" }}</td>
					<td>{{ data.lastoccurence != undefined ? data.lastoccurence : "" }}</td>
					<td>{{ data.alarmsource != undefined ? data.alarmsource : "" }}</td>
					<td>{{ data.alarmid != undefined ? data.alarmid : "" }}</td>
					<td>{{ data.projectid != undefined ? data.projectid : "" }}</td>
					<td>{{ data.cleartime != undefined ? data.cleartime : "" }}</td>
					<td>{{ data.emsname != undefined ? data.emsname : "" }}</td>
					<td>{{ data.mc_cluster != undefined ? data.mc_cluster : "" }}</td>
					<td>{{ data.tt_number != undefined ? data.tt_number : "" }}</td>
					<td>{{ data.wo_id != undefined ? data.wo_id : "" }}</td>
					<td>{{ data.alarmserialnumber != undefined ? data.alarmserialnumber : "" }}</td>
					<td>{{ data.alertkey != undefined ? data.alertkey : "" }}</td>
					<td>{{ data.summary != undefined ? data.summary : "" }}</td>
					<td>{{ data.extendedattr != undefined ? data.extendedattr : "" }}</td>
					<td>{{ data.aging != undefined ? data.aging : "" }}</td>
					<td>{{ data.power != undefined ? data.power : "" }}</td>
					<td>{{ data.power_lastoccurrence != undefined ? data.power_lastoccurrence : "" }}</td>
					<td>{{ data.roh_name != undefined ? data.roh_name : "" }}</td>
					<td>{{ data.roh_phone != undefined ? data.roh_phone : "" }}</td>
					<td>{{ data.site_type != undefined ? data.site_type : "" }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { IndexData } from "../../../Data/IndexData";
import { U } from "@adc/vigour-ui/lib/spl";
import { getSiteDownByHubType } from "../../../Api/counting/getSiteDownByHubType";
import { getExportSiteDownAlarm } from "../../../Api/counting/getExportSiteDownAlarm";

import { backgroundMapsPanZoom } from "../../../Helper/MapFunction/backgroundMapsPanZoom";
import { addLayerMarker } from "../../../Helper/MarkerFunction/addLayerMarker";
import { getSiteDownMarker } from "../../../Api/marker/getSiteDownMarker";
import { hideLayerMarker } from "../../../Helper/MarkerFunction/hideLayerMarker";
import { postMapsHit } from "../../../Api/session/postMapsHit";

import $ from "jquery";
window.$ = window.jQuery = $;
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";

import * as XLSX from "xlsx";

export default {
	name: "CollapseSummarySiteDown",
	data() {
		return IndexData;
	},
	props: {
		modalOpened: Number
	},
	watch: {
		modalOpened(newVal, oldVal) {
			if (newVal != oldVal) {
				U.initCsrfToken();
				this.siteDown.store.exportSiteDownAlarm.loading = true;
				this.siteDown.state.collapse.loading = true;
				this.getData();
			}
		},
		"globalProcess.state.tab.selectedOption": function (newVal) {
			if (newVal != "siteDown") {
				this.toggleCollapseSummarySiteDown();
			}
		}
	},
	async mounted() {
		$("#card-site-down-summary").draggable({
			handle: ".site-down-summary-drag-handle"
		});
	},
	methods: {
		async exportTableData() {
			const headers = [
				"Site ID",
				"Site Name",
				"Four Circle",
				"Five Region",
				"12 Region",
				"Hub Type",
				"Down Duration",
				"Alarm Name",
				"Last Occurence",
				"Alarm Source",
				"Alarm ID",
				"Alarm ID",
				"Clear Time",
				"EMS name",
				"MC Cluster",
				"TT number",
				"WO number",
				"Alarm SN",
				"Alarm location info",
				"Summary",
				"Extended Attribute",
				"Aging",
				"Power Alarm",
				"Power Alarm Last Occurence",
				"ROH Name",
				"ROH Phone",
				"Site Type"
			];

			const rows = this.siteDown.store.exportSiteDownAlarm.data.map((data) => [
				data.sitecode || "",
				data.site_name || "",
				data.circle || "",
				data.five_region || "",
				data.region || "",
				data.hub_type || "",
				data.down_duration || "",
				data.alarmname || "",
				data.lastoccurence || "",
				data.alarmsource || "",
				data.alarmid || "",
				data.projectid || "",
				data.cleartime || "",
				data.emsname || "",
				data.mc_cluster || "",
				data.tt_number || "",
				data.tt_number || "",
				data.alarmserialnumber || "",
				data.alertkey || "",
				data.summary || "",
				data.extendedattr || "",
				data.aging || "",
				data.power || "",
				data.power_lastoccurrence || "",
				data.roh_name || "",
				data.roh_phone || "",
				data.site_type || ""
			]);

			const wsData = [headers, ...rows];
			const ws = XLSX.utils.aoa_to_sheet(wsData);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Site Down Alarm List");

			XLSX.writeFile(wb, "Site_Down_Alarm_List_Export.xlsx");
		},
		async getData() {
			await getSiteDownByHubType()
				.then(({ res }) => {
					this.siteDown.state.collapse.data = Object.entries(res).map(([circle, values]) => ({
						circle,
						...values
					}));
					this.siteDown.store.exportSiteDownAlarm.loading = false;
				})
				.catch((error) => {
					this.siteDown.store.exportSiteDownAlarm.loading = false;
					console.error(error);
				});

			await getExportSiteDownAlarm()
				.then(({ res }) => {
					this.siteDown.store.exportSiteDownAlarm.data = res;
					this.siteDown.state.collapse.loading = false;
				})
				.catch((error) => {
					this.siteDown.state.collapse.loading = false;
					console.error(error);
				});
		},

		removeBackdrop() {
			var backdrops = document.getElementsByClassName("modal-backdrop fade show");
			Array.from(backdrops).forEach(function (backdrop) {
				backdrop.classList.remove("modal-backdrop");
				backdrop.classList.remove("fade");
				backdrop.classList.remove("show");
			});
		},

		toggleCollapseSummarySiteDown() {
			const collapseElement = this.$refs.collapseSummarySiteDown;
			if (collapseElement) {
				const bsCollapse = new bootstrap.Collapse(collapseElement, {
					toggle: false
				});
				if (collapseElement.classList.contains("show")) {
					bsCollapse.hide();
				} else {
					bsCollapse.hide();
				}
			}
		},

		async filterCircle(region) {
			const mapZoomLocation = [
				{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
				{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
				{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
				{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
			];

			const matchedLocation = mapZoomLocation.find((location) => location.area_name === region);

			await U.initCsrfToken();

			await this.getMarkerAndZoom(matchedLocation);
		},
		async getMarkerAndZoom(data) {
			let locationData = data;

			backgroundMapsPanZoom(locationData.lat, locationData.lon, locationData.zoom);

			this.siteDown.checker.marker.oneHour = true;
			this.siteDown.checker.marker.fourHour = true;
			this.siteDown.checker.marker.eightHour = true;
			this.siteDown.checker.marker.twentyFourHour = true;
			this.siteDown.checker.marker.moreDay = true;

			this.siteDown.checker.hub.core = true;
			this.siteDown.checker.hub.big = true;
			this.siteDown.checker.hub.medium = true;
			this.siteDown.checker.hub.small = false;
			this.siteDown.checker.hub.end = false;

			this.siteDown.checker.vip.isVip = false;
			this.siteDown.checker.vip.nonVip = false;

			this.siteDown.checker.power.isPowerAlarm = false;

			this.siteDown.checker.siteType.n3t = true;
			this.siteDown.checker.siteType.uso = true;
			this.siteDown.checker.siteType.all = true;

			this.siteDown.selector.region.value = locationData;
			this.siteDown.selector.region.selectedOption = locationData.area_name;

			try {
				const siteDownMarkerConfigs = [
					{ check: this.siteDown.checker.marker.oneHour, param: "1" },
					{ check: this.siteDown.checker.marker.fourHour, param: "1_4" },
					{ check: this.siteDown.checker.marker.eightHour, param: "4_8" },
					{ check: this.siteDown.checker.marker.twentyFourHour, param: "8_24" },
					{ check: this.siteDown.checker.marker.moreDay, param: "m24" }
				];

				siteDownMarkerConfigs.forEach((config) => {
					const index = this.siteDown.apiParams.siteDownChecker.indexOf(config.param);

					if (config.check) {
						if (index === -1) {
							this.siteDown.apiParams.siteDownChecker.push(config.param);
						}
					} else {
						if (index !== -1) {
							this.siteDown.apiParams.siteDownChecker.splice(index, 1);
						}
					}
				});

				const hubValueMarkerConfig = [
					{ check: "core", param: "CORE SITE" },
					{ check: "big", param: "BIG HUB SITE" },
					{ check: "medium", param: "MEDIUM HUB SITE" },
					{ check: "small", param: "SMALL HUB SITE" },
					{ check: "end", param: "END SITE" }
				];

				const updateHubType = () => {
					this.siteDown.apiParams.hubType = hubValueMarkerConfig.filter((item) => this.siteDown.checker.hub[item.check]).map((item) => item.param);
				};

				updateHubType();

				console.log(this.siteDown.apiParams.hubType, "hub type");

				this.siteDown.apiParams.vipCheck = this.siteDown.checker.vip.isVip ? true : this.siteDown.checker.vip.nonVip ? false : null;

				this.siteDown.apiParams.powerAlarm = this.siteDown.checker.power.isPowerAlarm;

				const siteTypeValueConfig = [
					{ check: "all", param: "NORMAL" },
					{ check: "n3t", param: "N3T" },
					{ check: "uso", param: "USO" }
				];

				const updateSiteType = () => {
					this.siteDown.apiParams.siteType = siteTypeValueConfig.filter((item) => this.siteDown.checker.siteType[item.check]).map((item) => item.param);
				};

				updateSiteType();

				// LOADING STATE
				this.globalProcess.state.component.siteDownMarkerMessage = "Loading Site Down Marker";
				this.globalProcess.state.component.siteDownMarkerLoading = true;
				this.globalProcess.state.component.siteDownDataLoading = true;
				//

				// APPLY BADGE STATE
				this.siteDown.state.modalExport.showHubBadge = true;
				this.siteDown.state.modalExport.showRegionBadge = true;

				this.siteDown.apiParams.circleString = locationData.area_name;
				this.siteDown.apiParams.hubTypeString = this.siteDown.apiParams.hubType.join(",");
				//

				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);

				console.log(this.siteDown.apiParams.hubType, "hub type before params");

				try {
					const { res } = await getSiteDownMarker(
						this.siteDown.apiParams.siteDownChecker,
						this.siteDown.apiParams.powerAlarm,
						this.siteDown.apiParams.hubType,
						this.siteDown.apiParams.vipCheck,
						this.globalProcess.query.mc.searchQuery,
						"",
						this.siteDown.selector.mcCluster.value,
						this.siteDown.selector.region.selectedOption,
						this.siteDown.apiParams.siteType,
						this.siteDown.selector.area.value
					);
					this.siteDown.marker.aging.arraySiteDown.data = res;
					addLayerMarker(this.siteDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);

					await postMapsHit("Apply Filter SiteDown", this.siteDown.marker.aging.arraySiteDown.data.length, "Site Down Marker", new Date());
				} catch (error) {
					console.error(`Error fetching marker data for:`, error);
				}

				this.componentState = this.componentState + 1;

				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.globalProcess.state.component.siteDownDataLoading = false;
				this.globalProcess.state.component.applyFilterLoading = false;
			} catch (error) {
				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.globalProcess.state.component.siteDownDataLoading = false;
				console.error("Error applying filter:", error);
			}
		}
	}
};
</script>

<style>
.responsive-absolute-sd {
	left: 5px;
	top: 37.5%;
}

@media screen and (max-height: 820px) {
	.responsive-absolute-sd {
		left: 5px;
		top: 45%;
	}
}

@media screen and (max-height: 1080px) {
	.responsive-absolute-sd {
		left: 5px;
		top: 30%;
	}
}
</style>
