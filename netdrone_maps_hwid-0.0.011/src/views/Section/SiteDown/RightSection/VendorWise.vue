<template>
	<CardAccordion class="pe-0 ps-1" :accordionTitle="'Vendor Wise'" :accordionId="'vendor-card-accordion'" :btnTarget="'vendor-card'">
		<template #accordionIcon>
			<i class="bi bi-people-fill accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row row-gap-12">
				<div class="d-flex gap-2">
					<div>test</div>
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
					<!-- <ChartCircleVendor :parentClass="'py-2'" :datas="[{ value: this.siteDownHuawei }, { value: this.cellDownHuawei }]" :loading="this.loading" :img="imgHuawei" :descriptionsText="this.siteDownHuawei + ' Sites Down'">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="huaweiSiteDownTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</ChartCircleVendor>
					<ChartCircleVendor :parentClass="'py-2'" :datas="[{ value: this.siteDownNokia }, { value: this.cellDownNokia }]" :loading="this.loading" :img="imgNokia" :descriptionsText="this.siteDownNokia + ' Sites Down'">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="nokiaSiteDownTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</ChartCircleVendor>
					<ChartCircleVendor :parentClass="'py-2'" :datas="[{ value: this.siteDownEricsson }, { value: this.cellDownEricsson }]" :loading="this.loading" :img="imgEricsson" :descriptionsText="this.siteDownEricsson + ' Sites Down'">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="ericssonSiteDownTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</ChartCircleVendor> -->
				</div>
			</div>
		</template>
	</CardAccordion>
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
				this.getVendorWiseData();
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
		return {
			loading: false,
			imgHuawei: require("../../../../assets/img/logo/huawei-logo-square.png"),
			imgNokia: require("../../../../assets/img/logo/nokia-logo-square.png"),
			imgEricsson: require("../../../../assets/img/logo/ericsson-logo-square.png"),
			vendorWiseData: null,
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
			compState: 0,
			vipSite: null,
			mc: "",
			siteTypeSelected: ["NORMAL"],
			areaSelected: [],
			selectedRegion: "",

			imgHuawei: require("../../../../assets/img/logo/huawei-logo-square.png"),
			imgNokia: require("../../../../assets/img/logo/nokia-logo-square.png"),
			imgEricsson: require("../../../../assets/img/logo/ericsson-logo-square.png")
		};
	},
	async mounted() {
		await U.initCsrfToken();

		await this.getVendorWiseData();

		await this.updateLastUpdatedTime();
		await this.checkRefetchData();
	},
	methods: {
		async getVendorWiseData() {
			await getCountByVendor(this.power, this.hub, this.vipSite, this.mc, this.mcFilter, this.selectedRegion, this.siteTypeSelected, this.areaSelected)
				.then(({ res }) => {
					this.vendorWiseData = res.results;
					for (var i = 0; i < this.vendorWiseData.length; i++) {
						if (this.vendorWiseData[i].vendor == "Huawei") {
							this.cellDownHuawei = this.vendorWiseData[i].celldown_2g + this.vendorWiseData[i].celldown_4g;
							this.siteDownHuawei = this.vendorWiseData[i].unique_sitedown;
						} else if (this.vendorWiseData[i].vendor == "Nokia") {
							this.cellDownNokia = this.vendorWiseData[i].celldown_2g + this.vendorWiseData[i].celldown_4g;
							this.siteDownNokia = this.vendorWiseData[i].unique_sitedown;
						} else if (this.vendorWiseData[i].vendor == "Ericsson") {
							this.cellDownEricsson = this.vendorWiseData[i].celldown_2g + this.vendorWiseData[i].celldown_4g;
							this.siteDownEricsson = this.vendorWiseData[i].unique_sitedown;
						}
					}
					this.refetch = false;
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
		}
	}
};
</script>
