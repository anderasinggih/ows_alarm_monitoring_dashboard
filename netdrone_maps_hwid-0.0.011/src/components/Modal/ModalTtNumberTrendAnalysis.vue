<template>
	<div class="modal fade" id="ttNumberTrendAnalysis" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-xxxl modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="d-flex justify-content-between align-items-center">
						<h3 class="font-700 text-dark d-flex flex-row align-items-center gap-16">
							TT Number Trend Analysis
							<div class="d-flex flex-row justify-content-center" v-if="this.globalProcess.state.component.loadingLinkDownModal == true">
								<div class="bg-card-loader"></div>
							</div>
						</h3>
						<button ref="tableButtonExit" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<hr />
					<div class="d-flex flex-row gap-16">
						<div class="d-flex flex-row gap-8 align-items-center" style="width: 80%">
							<i class="bi bi-filter text-ioh font-700 font-24"></i>
							<select class="form-select" aria-label="Select TT Status" v-model="linkDown.store.modal.ttNumberTrend.ttStatus">
								<option disabled>Select TT Status</option>
								<option selected value="">All TT Status</option>
								<option value="running">Running</option>
								<option value="completed">Completed</option>
							</select>
							<VueDatePicker v-model="this.linkDown.store.modal.ttNumberTrend.datePickerSelected" range placeholder="Select Time Frame" :enable-time-picker="false" />
							<select class="form-select" aria-label="Select Severity" v-model="linkDown.store.modal.ttNumberTrend.severity">
								<option disabled>Select Severity</option>
								<option selected value="">All Severity</option>
								<option value="Potential Emergency">Potential Emergency</option>
								<option value="Potential Critical">Potential Critical</option>
							</select>
							<select class="form-select" aria-label="Circle Region" v-model="linkDown.store.modal.ttNumberTrend.circle">
								<option disabled>Circle Region</option>
								<option selected value="">Nation Wide</option>
								<option value="SUMATERA">SMTR</option>
								<option value="JAYA">JAYA</option>
								<option value="JAVA">JAVA</option>
								<option value="KALISUMAPA">KSMP</option>
							</select>
						</div>
						<div class="d-flex flex-row gap-8" style="width: 300px">
							<button class="btn btn-clear" @click="clearFilter()">Clear</button>
							<button class="btn btn-apply" @click="applyFilter()">Apply</button>
						</div>
					</div>
					<StackedBarChart :dataChart="this.linkDown.store.modal.ttNumberTrend.ttTrendData" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import StackedBarChart from "../Chart/StackedBarChart.vue";
import { IndexData } from "../../views/Data/IndexData";
import { U } from "@adc/vigour-ui/lib/spl";
import { getTtNumberTrend } from "../../views/Api/countLinkDown/getTtNumberTrend";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
	name: "ModalTtNumberTrendAnalysis",
	components: {
		VueDatePicker,
		StackedBarChart
	},
	props: {
		dataChart: Object,
		modalOpened: Number,
		hideModal: Function
	},
	watch: {
		modalOpened(newVal, oldVal) {
			if (newVal != oldVal) {
				U.initCsrfToken();
				this.globalProcess.state.component.loadingLinkDownModal = true;
				setTimeout(() => {
					this.getData();
				}, 3000);
			}
		}
	},
	data() {
		return IndexData;
	},
	methods: {
		async getData() {
			await getTtNumberTrend(
				this.linkDown.store.modal.ttNumberTrend.datePickerSelected[0],
				this.formatDate(this.linkDown.store.modal.ttNumberTrend.datePickerSelected[1]),
				this.linkDown.store.modal.ttNumberTrend.severity,
				this.linkDown.store.modal.ttNumberTrend.ttStatus,
				this.linkDown.store.modal.ttNumberTrend.circle
			)
				.then(({ res }) => {
					this.linkDown.store.modal.ttNumberTrend.ttTrendData = res.results;
					this.globalProcess.state.component.loadingLinkDownModal = false;
				})
				.catch((error) => {
					this.globalProcess.state.component.loadingLinkDownModal = false;
					console.error("Error fetching data:", error);
				});
		},
		formatDate(dateString) {
			const date = new Date(dateString);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		},
		async applyFilter() {
			this.globalProcess.state.component.loadingLinkDownModal = true;
			this.getData();
		},
		async clearFilter() {
			this.linkDown.modal.ttNumberTrend.datePickerSelected = [calculateDate(new Date().toString(), 7), new Date().toString()];
			this.linkDown.modal.ttNumberTrend.ttStatus = "";
			this.linkDown.modal.ttNumberTrend.severity = "";
			this.linkDown.modal.ttNumberTrend.circle = "";
			this.globalProcess.state.component.loadingLinkDownModal = true;
			this.getData();
		},
		calculateDate(dateString, interval) {
			const date = new Date(dateString);
			const newTimestamp = date.getTime() - interval * 24 * 60 * 60 * 1000;
			const newDate = new Date(newTimestamp);
			const newDateString = newDate.toISOString().slice(0, 10);
			console.log(newDateString, "new date string index data");
			return newDateString;
		}
	}
};
</script>
