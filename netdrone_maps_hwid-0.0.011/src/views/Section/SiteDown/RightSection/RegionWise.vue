<template>
	<CardAccordion class="pe-0 ps-1" :accordionTitle="'Region Wise'" :accordionId="'region-card-accordion'" :btnTarget="'region-card'">
		<template #accordionIcon>
			<i class="bi bi-globe-asia-australia accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row row-gap-12">
				<div class="justify-content-between d-flex">
					<a class="index-Region"><i class="bi bi-square-fill" style="color: #0076ce"></i> {{ "<1 Hr" }}</a>
					<a class="index-Region"><i class="bi bi-square-fill" style="color: #62b230"></i> 1-4 Hr</a>
					<a class="index-Region"><i class="bi bi-square-fill" style="color: #ed6d00"></i> 4-8 Hr</a>
					<a class="index-Region"><i class="bi bi-square-fill" style="color: #ed1c24"></i> 8-24 Hr</a>
					<a class="index-Region"><i class="bi bi-square-fill" style="color: #313131"></i> Above 24Hr</a>
				</div>
				<div class="px-2">
					<div class="chart-container d-flex flex-column gap-4">
						<div class="d-flex flex-row justify-content-around" v-for="region in regions" :key="region.label">
							<ChartCircle :datas="region.circleData" :loading="loading" :labelText="region.label" :parentClass="'transparant-chart'">
								<template #downloadDataBtn>
									<button class="btn btn-download-ne-total" :id="'all' + region.label" @click="getSummaryData(region.label)">
										<i class="bi bi-download"></i>
									</button>
								</template>
							</ChartCircle>
							<!-- <div class="d-flex flex-column align-self-center align-items-center">
								<p class="font-700 font-18">{{ region.label }}</p>
							</div> -->
							<HorizontalBarChart :datas="region.barData" />
							<div class="d-flex flex-column align-self-center align-items-center">
								<p class="text-center font-16 font-600 text-grey">Total</p>
								<p class="text-center font-16 font-800 text-white total-label" v-if="!this.regionLoading">
									{{ region.total }}
								</p>
								<div class="d-flex flex-row justify-content-center" v-else>
									<div class="bg-card-loader loader-30"></div>
								</div>
							</div>
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

		async getSummaryData(circle) {
			const modalElement = document.getElementById("exportSiteDownByCircle");
			if (modalElement) {
				const exportSiteDownByCircle = new bootstrap.Modal(modalElement, {
					backdrop: "static"
				});
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
	background: #ed6d00;
	border-radius: 4px;
	padding: 4px 4px;
	width: fit-content;
}

.loader-30 {
	width: 30px !important;
}
</style>
