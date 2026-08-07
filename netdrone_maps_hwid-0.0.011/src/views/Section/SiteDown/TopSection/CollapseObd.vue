<template>
	<div class="position-absolute mt-2">
		<div class="collapse collapse-horizontal mt-2 collapsed" id="collapseObd" ref="collapseObd">
			<div class="card card-body card-width-500">
				<div class="row d-flex flex-row align-items-center mb-2 justify-content-between">
					<div class="row d-flex flex-row align-items-center width-fit-content">
						<i class="bi bi-car-front-fill width-fit-content text-ioh font-20"></i>
						<p class="width-fit-content font-700 font-16 text-ioh ps-0">Activity Overview</p>
					</div>
				</div>

				<div class="row d-flex row-gap-16 mb-2">
					<div class="col-6">
						<CardObd :type="'fme-busy'" :count="this.obd.store.collapseObd.data.busy_fme" :subtitle="'Busy FME'" />
					</div>
					<div class="col-6">
						<CardObd :type="'fme-idle'" :count="this.obd.store.collapseObd.data.idle_fme" :subtitle="'Idle FME'" />
					</div>
					<div class="col-6">
						<CardObd :type="'car-busy'" :count="this.obd.store.collapseObd.data.off_vehicle" :subtitle="'Off Vehicle'" />
					</div>
					<div class="col-6">
						<CardObd :type="'car-idle'" :count="this.obd.store.collapseObd.data.active_vehicle" :subtitle="'Active Vehicle'" />
					</div>
				</div>

				<div class="row d-flex flex-row align-items-center mb-2 justify-content-between">
					<div class="row d-flex flex-row align-items-center width-fit-content">
						<i class="bi bi-car-front-fill width-fit-content text-ioh font-20"></i>
						<p class="width-fit-content font-700 font-16 text-ioh ps-0">Summary By Circle</p>
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-12">
						<table class="table table-striped table-hover font-14" id="table-site-down-by-hub">
							<thead>
								<tr>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">Activity</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">JAYA</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">JAVA</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">SMTR</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">KSMP</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="data in this.obd.store.collapseObd.table">
									<td class="align-content-center font-inter font-600 text-ioh text-hoverable">{{ data.activity }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.JAYA !== undefined ? data.JAYA : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.JAVA !== undefined ? data.JAVA : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.SUMATERA !== undefined ? data.SUMATERA : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.KALISUMAPA !== undefined ? data.KALISUMAPA : "0" }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="row d-flex flex-row align-items-center mb-2 justify-content-between">
					<div class="row d-flex flex-row align-items-center width-fit-content">
						<i class="bi bi-car-front-fill width-fit-content text-ioh font-20"></i>
						<p class="width-fit-content font-700 font-16 text-ioh ps-0">Summary By Supplier</p>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<table class="table table-striped table-hover font-14" id="table-site-down-by-hub">
							<thead>
								<tr>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">Activity</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">PMT</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">CCSI</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">NW</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">MKU</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">ADW</th>
									<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px">PSD</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="data in this.obd.store.collapseObd.tableSupplier">
									<td class="align-content-center font-inter font-600 text-ioh text-hoverable">{{ data.activity }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.PMT !== undefined ? data.PMT : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.CCSI !== undefined ? data.CCSI : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.Nexwave !== undefined ? data.Nexwave : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.MKU !== undefined ? data.MKU : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.Adyawinsa !== undefined ? data.Adyawinsa : "0" }}</td>
									<td class="align-content-center text-center font-inter font-400 px-3">{{ data.Persada !== undefined ? data.Persada : "0" }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import CardObd from "../../../../components/Card/CardObd.vue";
import { IndexData } from "../../../Data/IndexData";

import { getObdActivityOverview } from "../../../Api/countingObd/getObdActivityOverview";
import { getObdBreakdownByCircle } from "../../../Api/countingObd/getObdBreakdownByCircle";
import { getObdBreakdownBySupplier } from "../../../Api/countingObd/getObdBreakdownBySupplier";

export default {
	name: "CollapseObd",
	components: {
		CardObd
	},
	data() {
		return IndexData;
	},
	watch: {
		"obd.state.isCollapse": function (newVal, oldVal) {
			if (newVal !== oldVal && newVal == true) {
				this.getData();
			}
		}
	},
	async mounted() {
		this.obd.state.observer = new MutationObserver(() => {
			if (this.$refs.collapseObd.classList.contains("show")) {
				this.obd.state.isCollapse = true;
			} else {
				this.obd.state.isCollapse = false;
			}
		});

		if (this.$refs.collapseObd) {
			this.obd.state.observer.observe(this.$refs.collapseObd, { attributes: true, attributeFilter: ["class"] });
		}
	},
	beforeUnmount() {
		if (this.obd.state.observer) {
			this.obd.state.observer.disconnect();
		}
	},
	methods: {
		async getData() {
			await getObdActivityOverview()
				.then((res) => {
					this.obd.store.collapseObd.data = res.res.results;
				})
				.catch((error) => {
					console.error("Error: ", error);
				});

			// get data table
			await getObdBreakdownByCircle()
				.then((res) => {
					this.obd.store.collapseObd.table = res.res.results;

					// const transformedData = {
					// 	busy_fme: 0,
					// 	idle_fme: 0,
					// 	off_vehicle: 0,
					// 	active_vehicle: 0
					// };

					// res.res.results.forEach((item) => {
					// 	if (item.activity === "Busy FME") {
					// 		transformedData.busy_fme += (item.JAVA || 0) + (item.JAYA || 0) + (item.KALISUMAPA || 0) + (item.SUMATERA || 0) + (item.undefined || 0);
					// 	}
					// 	if (item.activity === "Idle FME") {
					// 		transformedData.idle_fme += (item.JAVA || 0) + (item.JAYA || 0) + (item.KALISUMAPA || 0) + (item.SUMATERA || 0) + (item.undefined || 0);
					// 	}
					// 	if (item.activity === "Off Vehicle") {
					// 		transformedData.off_vehicle += (item.JAVA || 0) + (item.JAYA || 0) + (item.KALISUMAPA || 0) + (item.SUMATERA || 0) + (item.undefined || 0);
					// 	}
					// 	if (item.activity === "Active Vehicle") {
					// 		transformedData.active_vehicle += (item.JAVA || 0) + (item.JAYA || 0) + (item.KALISUMAPA || 0) + (item.SUMATERA || 0) + (item.undefined || 0);
					// 	}
					// });

					// Assign the transformed data to the state
					// this.obd.store.collapseObd.data = transformedData;
				})
				.catch((error) => {
					console.error("Error :", error);
				});

			await getObdBreakdownBySupplier()
				.then((res) => {
					this.obd.store.collapseObd.tableSupplier = res.res.results;
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
		// async getData() {
		// 	try {
		// 		// Run all three requests concurrently
		// 		const [obdActivityOverview, obdBreakdownByCircle, obdBreakdownBySupplier] = await Promise.all([getObdActivityOverview(), getObdBreakdownByCircle(), getObdBreakdownBySupplier()]);

		// 		// Handle the results
		// 		this.obd.store.collapseObd.data = obdActivityOverview.res.results;
		// 		this.obd.store.collapseObd.table = obdBreakdownByCircle.res.results;
		// 		this.obd.store.collapseObd.tableSupplier = obdBreakdownBySupplier.res.results;
		// 	} catch (error) {
		// 		// Handle any errors from any of the promises
		// 		console.error("Error: ", error);
		// 	}
		// }
	}
};
</script>
