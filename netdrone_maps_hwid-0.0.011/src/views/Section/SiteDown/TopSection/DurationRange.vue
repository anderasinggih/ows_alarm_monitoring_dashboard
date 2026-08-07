<template>
	<CardAccordion :accordionTitle="'Duration Range'" :accordionId="'duration-card-accordion'" :btnTarget="'duration-card'">
		<template #accordionIcon>
			<i class="bi bi-clock-fill accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row row-gap-12">
				<div class="col-12 d-flex flex-row justify-content-between gap-8">
					<CardAccordionDuration type="'SiteDown'" :color="this.color1" :totalSiteDown="this.hour1Sd" :subtitle="'Sites Down'" :duration="this.duration1">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="belowOneHourTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</CardAccordionDuration>
					<CardAccordionDuration type="'SiteDown'" :color="this.color14" :totalSiteDown="this.hour14Sd" :subtitle="'Sites Down'" :duration="this.duration14">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="oneToFourHourTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</CardAccordionDuration>
					<CardAccordionDuration type="'SiteDown'" :color="this.color48" :totalSiteDown="this.hour48Sd" :subtitle="'Sites Down'" :duration="this.duration48">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="fourToEightHourTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</CardAccordionDuration>
					<CardAccordionDuration type="'SiteDown'" :color="this.color824" :totalSiteDown="this.hour824Sd" :subtitle="'Sites Down'" :duration="this.duration824">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="eightToTwentyFourHourTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</CardAccordionDuration>
					<CardAccordionDuration type="'SiteDown'" :color="this.colorm24" :totalSiteDown="this.hourM24Sd" :subtitle="'Sites Down'" :duration="this.durationm24">
						<template #downloadDataBtn>
							<button class="btn btn-download-ne-orange" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="moreDayTrigger()">
								<i class="bi bi-download text-white"></i>
							</button>
						</template>
					</CardAccordionDuration>
				</div>
			</div>
		</template>
	</CardAccordion>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

import CardAccordion from "../../../../components/Card/CardAccordion.vue";
import CardAccordionDuration from "../../../../components/Card/CardAccordionDuration.vue";

import { getDurationRangeBreakdown } from "../../../Api/counting/getDurationRangeBreakdown.js";

import { DurationData } from "../../../Data/DurationData";
import { IndexData } from "../../../Data/IndexData";
export default {
	name: "DurationRange",
	components: {
		CardAccordion,
		CardAccordionDuration
	},
	props: {
		powerAlarm: Boolean,
		hubType: Array,
		state: Number,
		mcCluster: String,
		mcSelected: Array,
		regionSelected: String,
		vip: {
			type: [Boolean, null],
			validator(value) {
				return value === true || value === false || value === null;
			}
		},
		siteType: Array,
		selectedArea: Array
	},
	watch: {
		mcSelected(newVal) {
			this.mcClusterSelected = newVal;
		},
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
		state(newValue, oldValue) {
			if (newValue > oldValue) {
				this.compState = newValue;
				this.getDurationRange();
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
		return DurationData;
	},
	async mounted() {
		await U.initCsrfToken();
		await this.getDurationRange();

		await this.updateLastUpdatedTime();
		await this.checkRefetchData();
	},
	methods: {
		async getDurationRange() {
			IndexData.globalProcess.state.component.siteDownDataLoading = true;
			await getDurationRangeBreakdown(
				// this.hub, 
				// this.vipSite,
				// this.selectedRegion, 
				// this.siteTypeSelected, 
				// this.areaSelected, 
				IndexData.siteDown.apiParams.siteDownChecker,
				IndexData.siteDown.apiParams.hubCheck,
				IndexData.siteDown.apiParams.vipCheck,
				IndexData.siteDown.apiParams.siteType,
				IndexData.siteDown.selector.area.value,
				IndexData.siteDown.apiParams.siteDownCheck,
				IndexData.siteDown.start_time, 
				IndexData.siteDown.end_time
			)
				.then(({ res }) => {
					this.total = res.total_sitedown;
					this.hour1Sd = res.less_than_1_hour;
					this.hour14Sd = res.one_to_4_hour;
					this.hour48Sd = res.four_to_8_hour;
					this.hour824Sd = res.eight_to_24_hour;
					this.hourM24Sd = res.more_than_24_hours;
					IndexData.globalProcess.state.component.siteDownDataLoading = false;
					IndexData.refetch = false;
				})
				.catch((error) => {
					IndexData.refetch = false;
					IndexData.globalProcess.state.component.siteDownDataLoading = false;
					console.error("Error fetching data:", error);
				});
		},

		belowOneHourTrigger() {
			IndexData.siteDown.state.modalExport.title = "Below One Hour";
			IndexData.siteDown.state.modalExport.step = "duration-range1";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		oneToFourHourTrigger() {
			IndexData.siteDown.state.modalExport.title = "One to Four Hours";
			IndexData.siteDown.state.modalExport.step = "duration-range2";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		fourToEightHourTrigger() {
			IndexData.siteDown.state.modalExport.title = "Four to Eight Hours";
			IndexData.siteDown.state.modalExport.step = "duration-range3";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		eightToTwentyFourHourTrigger() {
			IndexData.siteDown.state.modalExport.title = "Eight to Twenty Four Hours";
			IndexData.siteDown.state.modalExport.step = "duration-range4";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		moreDayTrigger() {
			IndexData.siteDown.state.modalExport.title = "More Than Twenty Four Hours";
			IndexData.siteDown.state.modalExport.step = "duration-range5";
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
				this.hour1Sd = "...";
				this.hour14Sd = "...";
				this.hour48Sd = "...";
				this.hour824Sd = "...";
				this.hourM24Sd = "...";

				await this.getDurationRange();
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
