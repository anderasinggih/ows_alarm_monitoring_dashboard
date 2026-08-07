<template>
	<CardAccordion class="pe-0 ps-1" :show="''" :accordionTitle="'Region Wise'" :accordionId="'region-wise-card-accordion'" :btnTarget="'region-wise-card'">
		<template #accordionIcon>
			<i class="bi bi-globe-asia-australia accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row row-gap-12">
				<div class="px-2">
					<div class="chart-container d-flex flex-column gap-4">
						<div class="d-flex flex-row justify-content-around mb-1" v-for="region in regions" :key="region.label">
							<div class="d-flex flex-column gap-4 align-items-center align-self-center div-hover-region" @click="filterCircle(region.label)">
								<div class="d-flex flex-row gap-8 align-items-center">
									<p class="total-label font-12 font-500">{{ region.label.substring(0, 1) }}</p>
									<p class="font-14 font-500 region-label">{{ region.label }}</p>
								</div>
								<p class="region-label-location-subtitle font-12">
									<b class="text-ioh">{{ region.total }}</b>
									Sites Down
								</p>
							</div>
							<HorizontalBarChart :datas="region.barData" />
							<a class="button-preview-site-summary align-self-center font-20" :id="'all' + region.label" @click="getSummaryData(region.label)">
								<i class="bi bi-search"></i>
							</a>
						</div>
					</div>
				</div>
			</div>
		</template>
	</CardAccordion>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

import CardAccordion from "../../../../components/Card/CardAccordion.vue";
import ChartCircle from "../../../../components/Chart/ChartCircle.vue";
import HorizontalBarChart from "../../../../components/Chart/HorizontalBar.vue";

import { RegionWiseData } from "../../../Data/RegionWiseData.js";
import { getCountByRegion } from "../../../Api/counting/getCountByRegion.js";

import { IndexData } from "../../../Data/IndexData.js";
import { backgroundMapsPanZoom } from "../../../Helper/MapFunction/backgroundMapsPanZoom.js";
import { hideLayerMarker } from "../../../Helper/MarkerFunction/hideLayerMarker.js";
import { getSiteDownMarker } from "../../../Api/marker/getSiteDownMarker.js";
import { addLayerMarker } from "../../../Helper/MarkerFunction/addLayerMarker.js";
import { postMapsHit } from "../../../Api/session/postMapsHit.js";
// import { getSummaryByCircle } from "../../../Api/counting/getSummaryByCircle.js";

export default {
	name: "RegionWise",
	components: {
		ChartCircle,
		CardAccordion,
		HorizontalBarChart
	},
	props: {
		powerAlarm: Boolean,
		hubType: Array,
		state: Number,
		mcCluster: String,
		vip: {
			type: [Boolean, null],
			validator(value) {
				return value === true || value === false || value === null;
			}
		},
		mcClusterFilter: Array,
		regionSelected: String,
		siteType: Array,
		selectedArea: Array
	},
	watch: {
		regionSelected(newVal) {
			this.selectedRegion = newVal;
		},
		mcCluster(newMc) {
			this.mc = newMc;
		},
		powerAlarm(newPower) {
			this.power = newPower;
		},
		hubType(newValue) {
			this.hub = newValue;
		},
		vip(newValue) {
			this.vipSite = newValue;
		},
		mcClusterFilter(newVal) {
			this.mcFilter = newVal;
		},
		state(newValue, oldValue) {
			if (newValue > oldValue) {
				this.compState = newValue;
				this.getRegionWiseData();
			}
		},
		siteType(newValue) {
			this.siteTypeSelected = newValue;
		},
		selectedArea(newValue) {
			this.areaSelected = newValue;
		}
	},
	data() {
		return RegionWiseData;
	},
	async mounted() {
		await U.initCsrfToken();

		await this.getRegionWiseData();
		await this.updateLastUpdatedTime();
		await this.checkRefetchData();
	},
	methods: {
		async filterCircle(region) {
			const mapZoomLocation = [
				{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
				{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
				{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
				{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
			];

			const matchedLocation = mapZoomLocation.find((location) => location.area_name === region);

			IndexData.siteDown.state.siteDownHubType.clearFilter = true;

			await U.initCsrfToken();

			await this.getMarkerAndZoom(matchedLocation);
		},
		async getMarkerAndZoom(data) {
			let locationData = data;

			backgroundMapsPanZoom(locationData.lat, locationData.lon, locationData.zoom);

			IndexData.siteDown.checker.marker.oneHour = true;
			IndexData.siteDown.checker.marker.fourHour = true;
			IndexData.siteDown.checker.marker.eightHour = true;
			IndexData.siteDown.checker.marker.twentyFourHour = true;
			IndexData.siteDown.checker.marker.moreDay = true;

			IndexData.siteDown.checker.hub.core = true;
			IndexData.siteDown.checker.hub.big = true;
			IndexData.siteDown.checker.hub.medium = true;
			IndexData.siteDown.checker.hub.small = true;
			IndexData.siteDown.checker.hub.end = true;

			IndexData.siteDown.checker.vip.isVip = false;
			IndexData.siteDown.checker.vip.nonVip = false;

			IndexData.siteDown.checker.power.isPowerAlarm = false;

			IndexData.siteDown.checker.siteType.n3t = true;
			IndexData.siteDown.checker.siteType.uso = true;
			IndexData.siteDown.checker.siteType.all = true;

			IndexData.siteDown.selector.region.value = locationData;
			IndexData.siteDown.selector.region.selectedOption = locationData.area_name;

			try {
				const siteDownMarkerConfigs = [
					{ check: IndexData.siteDown.checker.marker.oneHour, param: "1" },
					{ check: IndexData.siteDown.checker.marker.fourHour, param: "1_4" },
					{ check: IndexData.siteDown.checker.marker.eightHour, param: "4_8" },
					{ check: IndexData.siteDown.checker.marker.twentyFourHour, param: "8_24" },
					{ check: IndexData.siteDown.checker.marker.moreDay, param: "m24" }
				];

				siteDownMarkerConfigs.forEach((config) => {
					const index = IndexData.siteDown.apiParams.siteDownChecker.indexOf(config.param);

					if (config.check) {
						if (index === -1) {
							IndexData.siteDown.apiParams.siteDownChecker.push(config.param);
						}
					} else {
						if (index !== -1) {
							IndexData.siteDown.apiParams.siteDownChecker.splice(index, 1);
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
					IndexData.siteDown.apiParams.hubType = hubValueMarkerConfig.filter((item) => IndexData.siteDown.checker.hub[item.check]).map((item) => item.param);
				};

				updateHubType();

				console.log(IndexData.siteDown.apiParams.hubType, "hub type");

				IndexData.siteDown.apiParams.vipCheck = IndexData.siteDown.checker.vip.isVip ? true : IndexData.siteDown.checker.vip.nonVip ? false : null;

				IndexData.siteDown.apiParams.powerAlarm = IndexData.siteDown.checker.power.isPowerAlarm;

				const siteTypeValueConfig = [
					{ check: "all", param: "NORMAL" },
					{ check: "n3t", param: "N3T" },
					{ check: "uso", param: "USO" }
				];

				const updateSiteType = () => {
					IndexData.siteDown.apiParams.siteType = siteTypeValueConfig.filter((item) => IndexData.siteDown.checker.siteType[item.check]).map((item) => item.param);
				};

				updateSiteType();

				// LOADING STATE
				IndexData.globalProcess.state.component.siteDownMarkerMessage = "Loading Site Down Marker";
				IndexData.globalProcess.state.component.siteDownMarkerLoading = true;
				IndexData.globalProcess.state.component.siteDownDataLoading = true;
				//

				// APPLY BADGE STATE
				IndexData.siteDown.state.modalExport.showHubBadge = true;
				IndexData.siteDown.state.modalExport.showRegionBadge = true;

				IndexData.siteDown.apiParams.circleString = locationData.area_name;
				IndexData.siteDown.apiParams.hubTypeString = IndexData.siteDown.apiParams.hubType.join(",");
				//

				hideLayerMarker(IndexData.siteDown.marker.aging.arraySiteDown);

				console.log(IndexData.siteDown.apiParams.hubType, "hub type before params");

				try {
					const { res } = await getSiteDownMarker(
						IndexData.siteDown.apiParams.siteDownChecker,
						IndexData.siteDown.apiParams.powerAlarm,
						IndexData.siteDown.apiParams.hubType,
						IndexData.siteDown.apiParams.vipCheck,
						IndexData.globalProcess.query.mc.searchQuery,
						"",
						IndexData.siteDown.selector.mcCluster.value,
						IndexData.siteDown.selector.region.selectedOption,
						IndexData.siteDown.apiParams.siteType,
						IndexData.siteDown.selector.area.value
					);
					IndexData.siteDown.marker.aging.arraySiteDown.data = res;
					addLayerMarker(IndexData.siteDown.marker.aging.arraySiteDown, IndexData.globalProcess.store.maps.backgroundMaps, IndexData);

					await postMapsHit("Apply Filter SiteDown", IndexData.siteDown.marker.aging.arraySiteDown.data.length, "Site Down Marker", new Date());
				} catch (error) {
					console.error(`Error fetching marker data for:`, error);
				}

				IndexData.componentState = IndexData.componentState + 1;

				IndexData.globalProcess.state.component.siteDownMarkerLoading = false;
				IndexData.globalProcess.state.component.siteDownDataLoading = false;
				IndexData.globalProcess.state.component.applyFilterLoading = false;
			} catch (error) {
				IndexData.globalProcess.state.component.applyFilterLoading = false;
				IndexData.globalProcess.state.component.siteDownMarkerLoading = false;
				IndexData.globalProcess.state.component.siteDownDataLoading = false;
				console.error("Error applying filter:", error);
			}
		},
		async getSummaryData(circle) {
			// let circleParams = circle;
			if (circle == "SMTR") {
				circle = "SUMATERA";
			}
			if (circle == "KSMP") {
				circle = "KALISUMAPA";
			}
			const modalElement = document.getElementById("exportSiteDownByCircle");
			if (modalElement) {
				const exportSiteDownByCircle = new bootstrap.Modal(modalElement, {
					backdrop: "static"
				});
				IndexData.siteDown.state.regionWise.step = circle;
				IndexData.siteDown.state.modalRegion.circle = circle;
				IndexData.siteDown.state.modalRegion.isOpen = true;
				IndexData.siteDown.state.modalRegion.openState = IndexData.siteDown.state.modalRegion.openState + 1;
				exportSiteDownByCircle.show();
			} else {
				console.error("Modal element with ID 'exportSiteDownByCircle' not found.");
			}
		},
		async getRegionWiseData() {
			try {
				this.regionLoading = true;
				const { res } = await getCountByRegion(this.power, this.hub, this.vipSite, this.mc, this.mcFilter, this.selectedRegion, this.siteTypeSelected, this.areaSelected);
				res.forEach((regionData) => {
					const region = this.regions.find((r) => r.label === regionData.location);
					if (region) {
						region.circleData = [{ value: regionData.unique_sitedown }, { value: regionData.total_4g_site + regionData.total_2g_site }];
						region.siteDownArray = [regionData.more_than_24_hours_unq, regionData.eight_to_24_hour_unq, regionData.four_to_8_hour_unq, regionData.one_to_4_hour_unq, regionData.less_than_1_hour_unq].reverse();
						region.barData = region.siteDownArray.map((item) => ({ value: item }));
						region.total = region.siteDownArray.reduce((sum, current) => sum + current, 0);
					}
				});
				this.regionLoading = false;
				IndexData.refetch = false;
			} catch (error) {
				IndexData.refetch = false;
				this.regionLoading = false;
				console.error("Error fetching data:", error);
			}
		},
		// REFETCH
		async updateLastUpdatedTime() {
			const now = new Date();
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const hours = now.getHours().toString().padStart(2, "0");
			const roundedMinutes = Math.floor(now.getMinutes() / 15) * 15;

			this.todayDate = today.toLocaleDateString();
			this.lastUpdated = `${hours}:${roundedMinutes.toString().padStart(2, "0")}`;
		},

		async checkRefetchData() {
			const now = new Date();
			const minutes = now.getMinutes();

			// if ([0, 15, 30, 45].includes(minutes)) {
			if ([0, 30].includes(minutes)) {
				this.regionWiseData = null;
				this.sdSMTR = 0;
				this.cdSMTR = 0;
				this.sdJBRO = 0;
				this.cdJBRO = 0;
				this.sdKSMP = 0;
				this.cdKSMP = 0;
				this.sdEJBN = 0;
				this.cdEJBN = 0;
				this.sdCJWJ = 0;
				this.cdCJWJ = 0;

				this.totalCjwj = 0;
				this.totalEjbn = 0;
				this.totalJbro = 0;
				this.totalKsmp = 0;
				this.totalSmtr = 0;

				this.cellDownArrayKSMP = [];
				this.siteDownArrayKSMP = [];
				this.cellDownArrayJBRO = [];
				this.siteDownArrayJBRO = [];
				this.cellDownArrayCJWJ = [];
				this.siteDownArrayCJWJ = [];
				this.cellDownArraySMTR = [];
				this.siteDownArraySMTR = [];
				this.cellDownArrayEJBN = [];
				this.siteDownArrayEJBN = [];

				this.arraySMTR = [];
				this.arrayKSMP = [];
				this.arrayJBRO = [];
				this.arrayCJWJ = [];
				this.arrayEJBN = [];

				this.regions = [
					{ label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
					{ label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 }
				];
				await this.getRegionWiseData();
				this.refetch = true;
			} else {
				this.refetch = false;
			}
		},

		// MOUNT THIS FUNCTION
		async startRefetchCheck() {
			this.fetching = setInterval(() => {
				this.checkRefetchData();
			}, 30 * 1000);
		}
	}
};
</script>

<style>
a.index-Region {
	font-weight: bold;
	font-size: 12px;
	color: #5b5b5b;
	text-decoration: none;
	font-family: "Inter", sans-serif;
	width: auto;
	padding: 0;
}

.transparant-chart {
	background-color: transparent !important;
	width: auto !important;
	margin-left: 0px;
	margin-right: 0px;
}

.chart-container {
	display: flex;
	justify-content: center;
	background-color: rgba(206, 206, 206, 0.15);
	border-radius: 8px;
	width: 100%;
	margin: 8px 0px;
}

.total-label {
	background: #f36900;
	border-radius: 4px;
	padding: 4px 9px;
	width: fit-content;
	border: 2px solid #fcd8ce;
	color: white !important;
}

.loader-30 {
	width: 30px !important;
}

.button-preview-site-summary {
	color: #f36900 !important;
	cursor: pointer;
}

.button-preview-site-summary:hover {
	color: #fcd8ce !important;
	/* cursor: pointer; */
}

#region-wise-card-accordion .accordion-body {
	padding-bottom: 0px !important;
}

.div-hover-region:hover {
	cursor: pointer;
	.region-label {
		color: #ed6d00;
	}
}
</style>
