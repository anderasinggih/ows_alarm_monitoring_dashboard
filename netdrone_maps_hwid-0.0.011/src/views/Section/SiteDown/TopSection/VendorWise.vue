<template>
	<button class="btn btn-collapse-mtte" title="TT Correlation" id="mtteMttrBtn" @click="getVendorWiseData()" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMtteMttr" aria-expanded="false" aria-controls="collapseMtteMttr">
		<i class="bi bi-clipboard2-data font-22"></i>
	</button>

	<div class="position-absolute mt-2">
		<div class="collapse collapse-horizontal mt-2 collapsed" id="collapseMtteMttr" ref="collapseMtteMttr">
			<div class="card card-body card-width-500">
				<div class="row d-flex flex-row align-items-center width-fit-content">
					<i class="bi bi-ticket-detailed width-fit-content text-ioh font-20"></i>
					<p class="width-fit-content font-700 font-16 text-ioh ps-0">Vendor Wise</p>
				</div>
				<div class="row row-gap-12">
					<div class="d-flex gap-2" style="flex-wrap: wrap">
						<div class="vendor-item" v-for="(item, index) in vendorWiseData" :key="index">
							<div class="vendor-name">{{ item.vendor_name }}</div>
							<div class="vendor-count">{{ item.unique_sitedown }}</div>
						</div>
						<!-- yxl <ChartCircleSiteDownVendor :parentClass="'py-2'" :img="this.imgHuawei" :total="this.siteDownHuawei">
							<template #downloadDataBtn>
								<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="huaweiSiteDownTrigger()">
									<i class="bi bi-download text-white"></i>
								</button>
							</template>
						</ChartCircleSiteDownVendor>
						<ChartCircleSiteDownVendor :parentClass="'py-2'" :img="this.imgNokia" :total="this.siteDownNokia">
							<template #downloadDataBtn>
								<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="nokiaSiteDownTrigger()">
									<i class="bi bi-download text-white"></i>
								</button>
							</template>
						</ChartCircleSiteDownVendor>
						<ChartCircleSiteDownVendor :parentClass="'py-2'" :img="this.imgEricsson" :total="this.siteDownEricsson">
							<template #downloadDataBtn>
								<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="ericssonSiteDownTrigger()">
									<i class="bi bi-download text-white"></i>
								</button>
							</template>
						</ChartCircleSiteDownVendor> -->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

import CardAccordion from "../../../../components/Card/CardAccordion.vue";
import ChartCircleVendor from "../../../../components/Chart/ChartCircleVendor.vue";
import ChartCircleSiteDownVendor from "../../../../components/Chart/ChartCircleSiteDownVendor.vue";

import { getCountByVendor } from "../../../Api/counting/getCountByVendor.js";
import { IndexData } from "../../../Data/IndexData.js";

export default {
	name: "VendorWise",
	components: {
		CardAccordion,
		ChartCircleVendor,
		ChartCircleSiteDownVendor
	},
	props: {
		vendorWiseData: {
			type: [Array, null],
			default: null
		}
	},
	watch: {},
	data() {
		return {
			loading: false,
			imgHuawei: require("../../../../assets/img/logo/huawei-logo-square.png"),
			imgNokia: require("../../../../assets/img/logo/nokia-logo-square.png"),
			imgEricsson: require("../../../../assets/img/logo/ericsson-logo-square.png"),
			cellDownHuawei: 0,
			cellDownNokia: 0,
			cellDownEricsson: 0,
			siteDownHuawei: 9999999,
			siteDownNokia: 9999999,
			siteDownEricsson: 9999999,

			// REFETCH
			todayDate: null,
			lastUpdated: null,
			fetching: null,
			refetch: false,

			// POWER
			power: false,
			hub: [],
			compState: [],
			vipSite: null,
			mc: "",
			siteTypeSelected: [],
			areaSelected: [],
			selectedRegion: "",
			start_time: "",
			end_time: "",
			siteDown: "",
			indexData: IndexData,
			imgHuawei: require("../../../../assets/img/logo/huawei-logo-square.png"),
			imgNokia: require("../../../../assets/img/logo/nokia-logo-square.png"),
			imgEricsson: require("../../../../assets/img/logo/ericsson-logo-square.png")
		};
	},
	methods: {
		async getVendorWiseData() {
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
			await getCountByVendor(
				this.indexData.siteDown.apiParams.siteDownChecker,
				this.indexData.siteDown.apiParams.hubCheck,
				this.indexData.siteDown.apiParams.vipCheck,
				this.indexData.siteDown.apiParams.siteDownCheck,
				this.indexData.siteDown.selector.area.value,
				this.indexData.siteDown.apiParams.siteType,
				this.indexData.siteDown.start_time,
				this.indexData.siteDown.end_time
			)
				.then(({ res }) => {
					this.vendorWiseData = res.results;
					this.indexData.siteDown.vendorWiseData = res.results;
				})
				.catch((error) => {
					this.refetch = false;
					console.error("Error fetching data:", error);
				});
		},

		ericssonSiteDownTrigger() {
			IndexData.siteDown.state.modalExport.title = "Ericsson Site Down";
			IndexData.siteDown.state.modalExport.step = "ERICSSON";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		nokiaSiteDownTrigger() {
			IndexData.siteDown.state.modalExport.title = "Nokia Site Down";
			IndexData.siteDown.state.modalExport.step = "NOKIA";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		huaweiSiteDownTrigger() {
			IndexData.siteDown.state.modalExport.title = "Huawei Site Down";
			IndexData.siteDown.state.modalExport.step = "HUAWEI";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
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
				this.vendorWiseData = null;
				this.cellDownHuawei = 0;
				this.cellDownNokia = 0;
				this.cellDownEricsson = 0;
				this.siteDownHuawei = 0;
				this.siteDownNokia = 0;
				this.siteDownEricsson = 0;
				await this.getVendorWiseData();
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
.vendor-item {
	padding: 6px 10px;
	border-radius: 4px;
	background: #f8f8f8;
}
.vendor-item .vendor-name {
	color: #4c4c4c;
	font-size: 14px;
	font-weight: bold;
	margin-top: 4px;
}
.vendor-item .vendor-count {
	font-size: 16px;
	font-weight: bold;
	color: #ed6d00;
	text-align: center;
	margin-top: 4px;
}
</style>
