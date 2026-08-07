<template>
	<div class="modal fade" id="exportSiteDownByCircle" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-xxxl modal-dialog-centered" id="modal-export-site-down-by-circle">
			<div class="modal-content p-3">
				<div class="d-flex flex-row justify-content-between align-items-center">
					<div class="box-row gap-8">
						<h4 class="font-700 fit-content">Export - {{ this.circle }}</h4>
						<div v-if="this.siteDown.state.modalRegion.isOpen == true || transformedData.length == 0" class="bg-card-loader"></div>
					</div>
					<div class="box-row">
						<button class="btn btn-export-modal w-150" @click="exportToExcel()">Export All Data</button>

						<a v-if="siteDown.state.modalRegion.isMaximize == false" @click="maximizeModal()">
							<i class="bi bi-arrows-fullscreen font-24 text-grey"></i>
						</a>

						<a v-if="siteDown.state.modalRegion.isMaximize == true" @click="minimizeModal()">
							<i class="bi bi-fullscreen-exit font-24 text-grey"></i>
						</a>

						<button type="button" class="btn-close font-20" data-bs-dismiss="modal" aria-label="Close" ref="closeTtCorrelation"></button>
					</div>
				</div>
				<hr style="margin-bottom: 0 !important" />
				<div class="modal-body">
					<div class="row overflow-x-scroll" style="height: 355px; overflow-y: scroll" id="row-show-table-data-site-down-by-cirlce-export">
						<table class="table table-striped table-bordered table-hover font-14" ref="exprotSiteDownByCircle" style="white-space: nowrap; height: fit-content">
							<thead>
								<tr>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Region</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Below 1 Hr</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">1-4 Hr</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">4-8 Hr</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">8-24 Hr</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Above 24 Hr</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Total</th>
								</tr>
							</thead>
							<tbody v-if="this.siteDown.store.modalRegion.regionSummaryData.length != 0 || transformedData.length != 0">
								<template v-for="(data, index) in transformedData" :key="index">
									<tr v-for="(item, indexData) in data.data" :key="indexData">
										<td :class="indexData == 0 ? 'align-content-center font-inter font-500 text-ioh' : 'align-content-center font-inter font-400 ps-4'">{{ item.mc_cluster != undefined ? item.mc_cluster : "" }}</td>
										<td :class="indexData == 0 ? 'align-content-center text-center font-inter font-500 text-ioh' : 'align-content-center text-center font-inter font-400'">{{ item.below1 != undefined ? item.below1 : "" }}</td>
										<td :class="indexData == 0 ? 'align-content-center text-center font-inter font-500 text-ioh' : 'align-content-center text-center font-inter font-400'">{{ item.oneToFour != undefined ? item.oneToFour : "" }}</td>
										<td :class="indexData == 0 ? 'align-content-center text-center font-inter font-500 text-ioh' : 'align-content-center text-center font-inter font-400'">{{ item.fourToEight != undefined ? item.fourToEight : "" }}</td>
										<td :class="indexData == 0 ? 'align-content-center text-center font-inter font-500 text-ioh' : 'align-content-center text-center font-inter font-400'">{{ item.eightToTwentyFour != undefined ? item.eightToTwentyFour : "" }}</td>
										<td :class="indexData == 0 ? 'align-content-center text-center font-inter font-500 text-ioh' : 'align-content-center text-center font-inter font-400'">{{ item.moreThanTwentyFour != undefined ? item.moreThanTwentyFour : "" }}</td>
										<td :class="indexData == 0 ? 'align-content-center text-center font-inter font-500 text-ioh' : 'align-content-center text-center font-inter font-400'">{{ item.total_sitedown != undefined ? item.total_sitedown : "" }}</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getAllSiteDownDataTable } from "../../views/Api/counting/getAllSiteDownDataTable";
import { getSummaryByCircle } from "../../views/Api/counting/getSummaryByCircle";
import { IndexData } from "../../views/Data/IndexData";
import * as XLSX from "xlsx";

export default {
	name: "ModalExportSiteDownByCircle",
	data() {
		return IndexData;
	},
	props: {
		state: Number,
		circle: String
	},
	watch: {
		state(newVal) {
			if (newVal != 0) {
				this.getData(this.circle, this.siteDown.apiParams.siteType, this.siteDown.apiParams.hubType, this.siteDown.apiParams.powerAlarm, this.siteDown.apiParams.vipCheck);
			}
		}
	},
	computed: {
		transformedData() {
			if (this.siteDown.store.modalRegion.regionSummaryData.length != 0) {
				const result = this.siteDown.store.modalRegion.regionSummaryData.results.map((results) => {
					const aggregated = results.data.reduce(
						(acc, curr) => {
							acc.oneToFour += curr.oneToFour;
							acc.moreThanTwentyFour += curr.moreThanTwentyFour;
							acc.eightToTwentyFour += curr.eightToTwentyFour;
							acc.fourToEight += curr.fourToEight;
							acc.total_sitedown += curr.total_sitedown;
							acc.below1 += curr.below1;
							return acc;
						},
						{
							oneToFour: 0,
							moreThanTwentyFour: 0,
							eightToTwentyFour: 0,
							fourToEight: 0,
							total_sitedown: 0,
							below1: 0
						}
					);

					const updatedData = results.data.map((item) => {
						return {
							...item,
							mc_cluster: item.mc_cluster || results.region
						};
					});

					updatedData.sort((a, b) => b.total_sitedown - a.total_sitedown);

					return {
						region: results.region,
						data: [
							{
								...aggregated,
								mc_cluster: results.region
							},
							...updatedData
						]
					};
				});

				console.log(result, "transformed data");

				return result;
			} else {
				const result = [];
				return result;
			}
		},
		filteredRawTableData() {
			//API PARAMS
			var hubTypeFilter = this.siteDown.apiParams.hubType;
			var siteTypeFilter = this.siteDown.apiParams.siteType;
			var vipSiteFilter = this.siteDown.apiParams.vipCheck;

			// STEP
			var allSelectedData = this.siteDown.state.regionWise.data;

			var step = this.siteDown.state.regionWise.step;

			let filteredData = [];

			const filterRegionWise = (circle, hubType, siteType, vipSite) => {
				return allSelectedData.filter((data) => {
					const isCircleMatch = data.circle === circle;
					const isHubTypeMatch = hubType && hubType.length > 0 ? hubType.includes(data.hub_type) : true;
					const isSiteTypeMatch = siteType && siteType.length > 0 ? siteType.includes(data.site_type) : true;
					const isVipSiteMatch = vipSite === true ? data.vip_site === "Yes" : vipSite === "No" ? data.vip_site === false : true;
					// const isPowerMatch = power === true ? data.vip_site === "Yes" : vipSite === "No" ? data.vip_site === false : true;

					return isCircleMatch && isHubTypeMatch && isSiteTypeMatch && isVipSiteMatch;
				});
			};

			switch (step) {
				case "JAYA":
				case "JAVA":
				case "KALISUMAPA":
				case "SUMATERA":
					filteredData = filterRegionWise(step, hubTypeFilter, siteTypeFilter, vipSiteFilter);
					break;
			}

			return filteredData;
		}
	},
	methods: {
		async getData(circle, siteType, hubType, power, isVip) {
			var circleParams;
			if (circle == "SUMATERA") {
				circleParams = "SMTR";
			} else if (circle == "KALISUMAPA") {
				circleParams = "KSMP";
			} else {
				circleParams = circle;
			}

			this.siteDown.store.modalRegion.regionSummaryData = [];

			await getSummaryByCircle(circleParams, siteType, hubType, power, isVip)
				.then(({ res }) => {
					this.siteDown.store.modalRegion.regionSummaryData = res;
				})
				.catch((error) => {
					this.siteDown.state.modalRegion.isOpen = false;
					console.error("Error fetching data:", error);
				});

			await getAllSiteDownDataTable(power, hubType, [], [], circle, "", isVip, siteType)
				.then(({ res }) => {
					this.siteDown.state.modalRegion.isOpen = false;
					this.siteDown.state.regionWise.data = res;
					console.log(this.siteDown.state.regionWise.data, "get all site down data table");
				})
				.catch((error) => {
					this.siteDown.state.modalRegion.isOpen = false;
					console.error(error);
				});
		},
		maximizeModal() {
			this.siteDown.state.modalRegion.isMaximize = true;
			const modal = document.getElementById("modal-export-site-down-by-circle");
			const rowShowing = document.getElementById("row-show-table-data-site-down-by-cirlce-export");

			if (modal && rowShowing) {
				modal.style.setProperty("--bs-modal-width", "1800px");
				rowShowing.style.height = "730px";
			}
		},
		minimizeModal() {
			this.siteDown.state.modalRegion.isMaximize = false;
			const modal = document.getElementById("modal-export-site-down-by-circle");
			const rowShowing = document.getElementById("row-show-table-data-site-down-by-cirlce-export");
			if (modal && rowShowing) {
				modal.style.setProperty("--bs-modal-width", "1500px");
				rowShowing.style.height = "355px";
			}
		},
		exportToExcel() {
			// Create the first worksheet from the table (for "Counting" sheet)
			const wsCounting = XLSX.utils.table_to_sheet(this.$refs.exprotSiteDownByCircle);

			const range = XLSX.utils.decode_range(wsCounting["!ref"]);

			// Apply styles for cells that don't contain "MC"
			for (let row = range.s.r; row <= range.e.r; row++) {
				for (let col = range.s.c; col <= range.e.c; col++) {
					const cell = wsCounting[XLSX.utils.encode_cell({ r: row, c: col })];

					// Check if the cell is a string and does not contain "MC"
					if (cell && cell.v && typeof cell.v === "string" && !cell.v.includes("MC")) {
						cell.s = {
							font: {
								bold: true,
								color: { rgb: "ED6D00" }
							}
						};
					}
				}
			}

			// Create the second worksheet from JSON data (for "RawData" sheet)
			const rawData = this.filteredRawTableData;
			const wsRawData = XLSX.utils.json_to_sheet(rawData);

			// Set column widths for the RawData sheet based on the longest string in each column
			const colWidths = Object.keys(rawData[0] || {}).map((key) => {
				const maxLength = Math.max(...rawData.map((row) => (row[key] || "").toString().length));
				return maxLength;
			});

			wsRawData["!cols"] = colWidths.map((width) => ({ wch: width }));

			// Create a new workbook and append both sheets
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, wsCounting, "Counting");
			XLSX.utils.book_append_sheet(wb, wsRawData, "RawData");

			// Write the Excel file
			XLSX.writeFile(wb, "exported_table.xlsx");
		}
	}
};
</script>
