<template>
	<div class="modal fade" id="siteDownTrendModal" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="container-fluid">
						<div class="d-flex flex-row align-items-center justify-content-between">
							<h3 class="font-700 text-dark">Site Down Trend</h3>
							<button type="button" ref="siteDownTrendModalDismiss" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
						</div>
						<hr />
						<div class="row d-flex flex-row gap-8 mb-3">
							<i class="bi bi-filter font-700 font-24 fit-content align-self-center"></i>
							<VueMultiselect
								v-model="siteDown.store.siteDownTrend.selector.hubType.selectedOption"
								:options="siteDown.store.siteDownTrend.selector.hubType.option"
								placeholder="All"
								:allow-empty="true"
								track-by="hub_type"
								label="hub_type"
								:multiple="true"
								:taggable="true"
								@tag="addTagHub"
								select-label=""
								style="width: 200px !important"
							>
								<template slot="singleLabel">
									<strong>{{ siteDown.store.siteDownTrend.selector.hubType.option.hub_type }}</strong>
								</template>
							</VueMultiselect>

							<!-- <VueDatePicker
								v-if="this.siteDown.state.siteDownTrend.pickDate != false && siteDown.store.siteDownTrend.selector.interval.value != 'fifteen_min'"
								:min-date="new Date('2024-11-27')"
								:enable-time-picker="siteDown.store.siteDownTrend.selector.interval.value == 'fifteen_min' ? true : false"
								id="datePickerSiteDownTrend"
								v-model="siteDown.store.siteDownTrend.selector.datePickerSelected"
								range
								placeholder="Select Time Frame"
								enable-seconds
								style="width: 200px !important; padding-left: 0px !important; align-self: center !important"
							/> -->

							<VueDatePicker
								v-if="this.siteDown.state.siteDownTrend.pickDate != false && siteDown.store.siteDownTrend.selector.interval.value != 'fifteen_min'"
								:min-date="new Date('2024-11-27')"
								:enable-time-picker="true"
								id="datePickerSiteDownTrend"
								v-model="siteDown.store.siteDownTrend.selector.datePickerSelected"
								range
								placeholder="Select Time Frame"
								enable-seconds
								style="width: 200px !important; padding-left: 0px !important; align-self: center !important"
							/>

							<!-- <VueDatePicker
								v-if="this.siteDown.state.siteDownTrend.pickDateFifteen != false && this.siteDown.store.siteDownTrend.selector.interval.value == 'fifteen_min'"
								:min-date="new Date('2024-11-27')"
								:enable-time-picker="siteDown.store.siteDownTrend.selector.interval.value == 'fifteen_min' ? true : false"
								id="datePickerSiteDownTrend"
								v-model="siteDown.store.siteDownTrend.selector.datePickerSelected"
								range
								placeholder="Select Time Frame"
								enable-seconds
								style="width: 200px !important; padding-left: 0px !important; align-self: center !important"
							/> -->

							<VueDatePicker
								v-if="this.siteDown.state.siteDownTrend.pickDateFifteen != false && this.siteDown.store.siteDownTrend.selector.interval.value == 'fifteen_min'"
								:min-date="new Date('2024-11-27')"
								:enable-time-picker="true"
								id="datePickerSiteDownTrend"
								v-model="siteDown.store.siteDownTrend.selector.datePickerSelected"
								range
								placeholder="Select Time Frame"
								enable-seconds
								style="width: 200px !important; padding-left: 0px !important; align-self: center !important"
							/>

							<select
								v-if="siteDown.store.siteDownTrend.selector.interval.value == 'fifteen_min'"
								class="form-select"
								aria-label="Select Time Range"
								v-model="siteDown.store.siteDownTrend.selector.interval.timePicker"
								@change="handleSelectChangeFifteenMin"
								style="width: 150px !important; height: 40px !important; align-self: center !important"
							>
								<option v-if="!siteDown.state.siteDownTrend.pickDateFifteen" value="">Pick a Date</option>
								<option v-if="siteDown.state.siteDownTrend.pickDateFifteen" value="">Use Time Range</option>
								<option value="4">4 Hour</option>
								<option selected value="8">8 Hour</option>
								<option value="16">16 Hour</option>
								<option value="24">24 Hour</option>
							</select>

							<select
								v-if="siteDown.store.siteDownTrend.selector.interval.value == 'Hourly'"
								class="form-select"
								aria-label="Select Time Range"
								v-model="siteDown.store.siteDownTrend.selector.interval.timePicker"
								@change="handleSelectChange"
								style="width: 150px !important; height: 40px !important; align-self: center !important"
							>
								<option v-if="!siteDown.state.siteDownTrend.pickDate" value="">Pick a Date</option>
								<option v-if="siteDown.state.siteDownTrend.pickDate" value="">Use Time Range</option>
								<option value="4">4 Hour</option>
								<option selected value="8">8 Hour</option>
								<option value="16">16 Hour</option>
								<option value="24">24 Hour</option>
							</select>

							<select class="form-select" aria-label="Select TT Status" v-model="siteDown.store.siteDownTrend.selector.interval.value" style="width: 120px !important; height: 40px !important; align-self: center !important">
								<option disabled>Data Interval</option>
								<option value="fifteen_min">Fifteen Minutes</option>
								<option selected value="Hourly">Hourly</option>
							</select>

							<button class="btn btn-apply" style="width: fit-content; font-size: 14px !important; align-self: center !important" @click="clearFilter()">Clear Filter</button>
							<button
								class="btn btn-apply"
								style="width: fit-content; font-size: 14px !important; align-self: center !important"
								@click="siteDown.store.siteDownTrend.selector.interval.value != 'Hourly' ? applyFilter(this.siteDown.store.siteDownTrend.selector.interval.timePicker) : applyFilterHourly(this.siteDown.store.siteDownTrend.selector.interval.timePicker)"
							>
								Apply Filter
							</button>
						</div>
						<div class="row row-gap-16 modal-zoom-chart-dynamic">
							<div class="col-6">
								<LineChartSiteDownTrend :datas="this.siteDown.store.siteDownTrend.data.JAVA" :circle="'JAVA'" />
							</div>
							<div class="col-6">
								<LineChartSiteDownTrend :datas="this.siteDown.store.siteDownTrend.data.JAYA" :circle="'JAYA'" />
							</div>
							<div class="col-6">
								<LineChartSiteDownTrend :datas="this.siteDown.store.siteDownTrend.data.SUMATERA" :circle="'SUMATERA'" />
							</div>
							<div class="col-6">
								<LineChartSiteDownTrend :datas="this.siteDown.store.siteDownTrend.data.KALISUMAPA" :circle="'KALISUMAPA'" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import LineChartSiteDownTrend from "../Chart/LineChartSiteDownTrend.vue";
import { IndexData } from "../../views/Data/IndexData";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import VueMultiselect from "vue-multiselect";
import { getSiteDownTrend } from "../../views/Api/counting/getSiteDownTrend";

export default {
	name: "ModalSiteDownTrend",
	props: {
		isOpen: Number
	},
	watch: {
		"siteDown.store.siteDownTrend.selector.datePickerSelected": function (newVal, oldVal) {
			if (newVal == oldVal) {
				this.getTimeNow();
			}
		},
		"siteDown.store.siteDownTrend.selector.hubType.selectedOption": function (newVal, oldVal) {
			if (newVal != oldVal) {
				const hubTypes = newVal.map((item) => item.hub_type);

				this.siteDown.store.siteDownTrend.selector.hubType.apiParams = hubTypes;
			}
		},
		isOpen(newVal) {
			if (newVal != 0) {
				this.siteDown.store.siteDownTrend.selector.interval.timePicker = "8";
				this.getTimeNowLoading();
				this.getData(this.siteDown.store.siteDownTrend.selector.startDate, this.siteDown.store.siteDownTrend.selector.endDate, ["BIG HUB SITE", "MEDIUM HUB SITE", "CORE SITE", "SMALL HUB SITE", "END SITE"], "Hourly");
			}
		}
	},
	components: {
		LineChartSiteDownTrend,
		VueDatePicker,
		VueMultiselect
	},
	data() {
		return IndexData;
	},
	methods: {
		handleSelectChangeFifteenMin() {
			if (this.siteDown.store.siteDownTrend.selector.interval.timePicker === "") {
				if (this.siteDown.state.siteDownTrend.pickDateFifteen === false) {
					this.pickDateValFifteen();
				} else {
					this.pickTimeValFifteen();
				}
			} else {
				this.pickTimeValFifteen();
			}
		},

		handleSelectChange() {
			if (this.siteDown.store.siteDownTrend.selector.interval.timePicker === "") {
				if (this.siteDown.state.siteDownTrend.pickDate === false) {
					this.pickDateVal();
				} else {
					this.pickTimeVal();
				}
			} else {
				this.pickTimeVal();
			}
		},

		pickTimeValFifteen() {
			this.siteDown.state.siteDownTrend.pickDateFifteen = false;
		},

		pickDateValFifteen() {
			this.siteDown.state.siteDownTrend.pickDateFifteen = true;
		},

		pickTimeVal() {
			this.siteDown.state.siteDownTrend.pickDate = false;
		},

		pickDateVal() {
			this.siteDown.state.siteDownTrend.pickDate = true;
		},

		async applyFilterHourly(timeRange) {
			console.log("apply hourly");
			let startDate;
			let endDate;
			let apiStartDate;
			let apiEndDate;

			if (this.siteDown.state.siteDownTrend.pickDate == true) {
				console.log("using date picker");
				if (this.siteDown.store.siteDownTrend.selector.datePickerSelected == null) {
					this.getTimeNow();
					startDate = this.siteDown.store.siteDownTrend.selector.startDate;
					endDate = this.siteDown.store.siteDownTrend.selector.endDate;
				} else {
					startDate = this.formatDate(this.siteDown.store.siteDownTrend.selector.datePickerSelected[0]);
					endDate = this.formatDate(this.siteDown.store.siteDownTrend.selector.datePickerSelected[1]);
				}
			} else {
				console.log("using time range");
				const now = new Date();
				const timeRangeSelected = new Date(now.getTime() - timeRange * 60 * 60 * 1000);

				this.siteDown.store.siteDownTrend.selector.startDate = this.formatDate(timeRangeSelected) + ":00";
				this.siteDown.store.siteDownTrend.selector.endDate = this.formatDate(now) + ":59";

				startDate = this.siteDown.store.siteDownTrend.selector.startDate;
				endDate = this.siteDown.store.siteDownTrend.selector.endDate;
			}

			apiStartDate = startDate;
			apiEndDate = endDate;

			if (this.siteDown.store.siteDownTrend.selector.hubType.apiParams.length == 0) {
				await this.getData(apiStartDate, apiEndDate, ["BIG HUB SITE", "MEDIUM HUB SITE", "CORE SITE", "SMALL HUB SITE", "END SITE"], this.siteDown.store.siteDownTrend.selector.interval.value);
			} else {
				await this.getData(apiStartDate, apiEndDate, this.siteDown.store.siteDownTrend.selector.hubType.apiParams, this.siteDown.store.siteDownTrend.selector.interval.value);
			}
		},

		async applyFilter(timeRange) {
			let startDate;
			let endDate;
			let apiStartDate;
			let apiEndDate;

			if (this.siteDown.state.siteDownTrend.pickDateFifteen == true) {
				console.log("using date picker");
				if (this.siteDown.store.siteDownTrend.selector.datePickerSelected == null) {
					this.getTimeNow();
					startDate = this.siteDown.store.siteDownTrend.selector.startDate;
					endDate = this.siteDown.store.siteDownTrend.selector.endDate;
				} else {
					startDate = this.formatDate(this.siteDown.store.siteDownTrend.selector.datePickerSelected[0]);
					endDate = this.formatDate(this.siteDown.store.siteDownTrend.selector.datePickerSelected[1]);
				}
			} else {
				console.log("using time range");
				const now = new Date();
				const timeRangeSelected = new Date(now.getTime() - timeRange * 60 * 60 * 1000);

				this.siteDown.store.siteDownTrend.selector.startDate = this.formatDate(timeRangeSelected) + ":00";
				this.siteDown.store.siteDownTrend.selector.endDate = this.formatDate(now) + ":59";

				startDate = this.siteDown.store.siteDownTrend.selector.startDate;
				endDate = this.siteDown.store.siteDownTrend.selector.endDate;
			}

			apiStartDate = startDate;
			apiEndDate = endDate;

			if (this.siteDown.store.siteDownTrend.selector.hubType.apiParams.length == 0) {
				await this.getData(apiStartDate, apiEndDate, ["BIG HUB SITE", "MEDIUM HUB SITE", "CORE SITE", "SMALL HUB SITE", "END SITE"], this.siteDown.store.siteDownTrend.selector.interval.value);
			} else {
				await this.getData(apiStartDate, apiEndDate, this.siteDown.store.siteDownTrend.selector.hubType.apiParams, this.siteDown.store.siteDownTrend.selector.interval.value);
			}
		},

		async clearFilter() {
			this.siteDown.state.siteDownTrend.pickDate = false;
			this.siteDown.store.siteDownTrend.selector.interval.timePicker = "8";
			this.getTimeNowLoading();
			this.getData(this.siteDown.store.siteDownTrend.selector.startDate, this.siteDown.store.siteDownTrend.selector.endDate, ["BIG HUB SITE", "MEDIUM HUB SITE", "CORE SITE", "SMALL HUB SITE", "END SITE"], "Hourly");
		},

		formatDateOnly(date) {
			const d = new Date(date);

			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");

			return `${year}-${month}-${day}`;
		},

		formatDate(date) {
			const d = new Date(date);

			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			const hours = String(d.getHours()).padStart(2, "0");
			const minutes = String(d.getMinutes()).padStart(2, "0");
			const seconds = String(d.getSeconds()).padStart(2, "0");

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},

		getTimeNow() {
			const now = new Date();

			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			};

			this.siteDown.store.siteDownTrend.selector.startDate = formatDate(now) + " 00:00:00";
			this.siteDown.store.siteDownTrend.selector.endDate = formatDate(now) + " 23:59:59";
		},

		getTimeNowLoading() {
			const now = new Date();
			const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				const hours = String(date.getHours()).padStart(2, "0");
				const minutes = String(date.getMinutes()).padStart(2, "0");
				return `${year}-${month}-${day} ${hours}:${minutes}`;
			};
			this.siteDown.store.siteDownTrend.selector.startDate = formatDate(twentyFourHoursAgo) + ":00";
			this.siteDown.store.siteDownTrend.selector.endDate = formatDate(now) + ":59";
		},

		async getData(start, end, hubType, timeCat) {
			await getSiteDownTrend(start, end, hubType, timeCat)
				.then(({ res }) => {
					console.log(res, "result get data");
					this.siteDown.store.siteDownTrend.data = res;
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		},

		addTagHub(newTag) {
			const tag = {
				name: newTag,
				code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
			};
			this.siteDown.store.siteDownTrend.selector.hubType.option.push(tag);
			this.siteDown.store.siteDownTrend.selector.hubType.selectedOption.push(tag);
		}
	}
};
</script>

<style>
#datePickerSiteDownTrend div .dp__input_wrap .dp__input {
	height: 40px !important;
}

.modal-zoom-chart-dynamic {
	zoom: 100% !important;
}

@media screen and (min-width: 1500px) {
	.modal-zoom-chart-dynamic {
		zoom: 115% !important;
	}
}

@media screen and (min-width: 1800px) {
	.modal-zoom-chart-dynamic {
		zoom: 110% !important;
	}
}

@media screen and (min-width: 2100px) {
	.modal-zoom-chart-dynamic {
		zoom: 100% !important;
	}
}
</style>
