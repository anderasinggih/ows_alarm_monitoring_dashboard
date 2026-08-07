<template>
	<div class="modal fade" id="exportSiteDownDurationOlt" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-xxxl modal-dialog-centered" id="modal-export-site-down-duration">
			<div class="modal-content p-3">
				<div class="d-flex flex-row justify-content-between align-items-center">
					<div class="box-row gap-8">
						<h4 class="font-700 fit-content">Export - {{ this.oltDown.state.modalExport.title }}</h4>
						<div v-if="this.oltDown.state.modalExport.loading == true" class="bg-card-loader"></div>
					</div>
					<div class="box-row">
						<a v-if="oltDown.state.modalExport.isMaximize == false" @click="maximizeModal()">
							<i class="bi bi-arrows-fullscreen font-24 text-grey"></i>
						</a>

						<a v-if="oltDown.state.modalExport.isMaximize == true" @click="minimizeModal()">
							<i class="bi bi-fullscreen-exit font-24 text-grey"></i>
						</a>

						<button type="button" class="btn-close font-20" data-bs-dismiss="modal" aria-label="Close" ref="closeTtCorrelation"></button>
					</div>
				</div>
				<hr style="margin-bottom: 0 !important" />
				<div class="modal-body">
					<div class="row d-flex justify-content-end mb-3">
						<div class="col-6 gap">
							<div class="input-group width-35">
								<span class="input-group-text"><i class="bi bi-search font-700"></i></span>
								<input type="text" class="form-control search-global-input" placeholder="Search by Site ID" v-model="this.oltDown.state.modalExport.searchQuery" />
							</div>
						</div>
						<div class="col-6 d-flex justify-content-end gap-8">
							<button class="btn btn-export-modal w-150" @click="exportAllData()">Export All</button>
							<button class="btn btn-export-modal" @click="exportTableData()" style="width: 200px">Export Current Page</button>
						</div>
					</div>
					<div class="row overflow-x-scroll" style="height: 355px; overflow-y: scroll" id="row-show-table-data-site-down-export">
						<table class="table table-striped table-bordered table-hover font-14" ref="exportSiteDownDetailTable" style="white-space: nowrap; height: fit-content">
							<thead>
								<tr>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">No.</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Site ID</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Site Name</th>
									<!-- <th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">is Hub</th> -->
									<!-- <th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Category</th> -->
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Alarm Source</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Alarm Name</th>
									<!-- <th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px; display: none">Alarm Source</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px; display: none">Tech</th> -->
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Last Occurence</th>
									<!-- <th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px; display: none">Alarm Down Duration</th> -->
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Aging (Hour)</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Impacted Subs</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">TT</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">WO</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">FM Office</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Vendor</th>
									<!-- <th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">MC Cluster</th> -->
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Region</th>
									<!-- <th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Circle</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Supplier</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">FME Name</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">FME Phone</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">GH Name</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">GH Phone</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">ROH Name</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">ROH Phone</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RTS Name</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RTS Phone</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Ticket Creation Results</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RCA 1</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RCA 2</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RCA 3</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RCA 4</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">ETA</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">ETR</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">Remark</th>
									<th class="align-content-center text-center font-inter font-700" style="color: #313131; font-size: 14px">RMA</th> -->
								</tr>
							</thead>
							<tbody>
								<tr v-for="(data, index) in paginatedData" :key="index">
									<td class="align-content-center text-left font-inter font-400">{{ (oltDown.state.modalExport.currentPage - 1) * oltDown.state.modalExport.rowsPerPage + (index + 1) }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.site_id != null ? data.site_id : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.site_name != null ? data.site_name : "" }}</td>
									<!-- <td class="align-content-center text-left font-inter font-400">{{ data.hub_type != null ? data.hub_type : "" }}</td> -->
									<!-- <td class="align-content-center text-left font-inter font-400">{{ data.category != null ? data.category : "" }}</td> -->
									<td class="align-content-center text-left font-inter font-400">{{ data.alarmsource != null ? data.alarmsource : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.alarm_name != null ? data.alarm_name : "" }}</td>
									<!-- <th class="align-content-center text-left font-inter font-400" style="display: none">{{ data.alarm_source != null ? data.alarm_source : "" }}</th>
									<th class="align-content-center text-left font-inter font-400" style="display: none">{{ data.tech != null ? data.tech : "" }}</th> -->
									<td class="align-content-center text-left font-inter font-400">{{ data.last_occurrence != null ? data.last_occurrence : "" }}</td>
									<!-- <th class="align-content-center text-left font-inter font-400" style="display: none">{{ data.alarm_down_duration != null ? data.alarm_down_duration : "" }}</th> -->
									<td class="align-content-center text-left font-inter font-400">{{ data.aging != null ? data.aging : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.total_impacted_subscribers != null ? data.total_impacted_subscribers : "" }}</td>
									<td class="align-content-center text-left font-inter font-400" @click="openTt(data.tt)">{{ data.tt != null ? data.tt : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.wo != null ? data.wo : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.fm_office != null ? data.fm_office : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.vendor != null ? data.vendor : "" }}</td>
									<!-- <td class="align-content-center text-left font-inter font-400">{{ data.mc_cluster != null ? data.mc_cluster : "" }}</td> -->
									<td class="align-content-center text-left font-inter font-400">{{ data.region != null ? data.region : "" }}</td>
									<!-- <td class="align-content-center text-left font-inter font-400 text-ioh c-pointer btn-link-click">
										{{ data.circle != null ? data.circle : "" }}
									</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.supplier != null ? data.supplier : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.fme_username != null ? data.fme_username : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.fme_phone != null ? data.fme_phone : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.gh_name != null ? data.gh_name : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.gh_phone != null ? data.gh_phone : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.roh_name != null ? data.roh_name : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.roh_phone != null ? data.roh_phone : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.rts_name != null ? data.rts_name : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.rts_phone != null ? data.rts_phone : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.wo_remarks != null ? data.wo_remarks : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.rca1 != null ? data.rca1 : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.rca2 != null ? data.rca2 : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.rca3 != null ? data.rca3 : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.rca4 != null ? data.rca4 : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.eta != null ? data.eta : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">{{ data.etr != null ? data.etr : "" }}</td>
									<td class="align-content-center text-left font-inter font-400">
										<p class="align-content-center text-left font-inter font-400" style="width: 1000px !important; white-space: normal">
											{{ data.remark != null ? data.remark : "" }}
										</p>
									</td>
									<td class="align-content-center text-left font-inter font-400">
										<p class="align-content-center text-left font-inter font-400" style="width: 1000px !important; white-space: normal">
											{{ data.rma != null ? data.rma : "" }}
										</p>
									</td> -->
								</tr>
							</tbody>
						</table>
					</div>
					<div class="pagination-container">
						<select class="form-select form-select-sm" aria-label="Rows per page" v-model="oltDown.state.modalExport.rowsPerPage" style="width: 150px !important">
							<option value="10">10 per page</option>
							<option value="20">20 per page</option>
							<option value="50">50 per page</option>
						</select>
						<button @click="this.previousPage()" :disabled="oltDown.state.modalExport.currentPage === 1" class="btn btn-export-modal" style="width: fit-content">Previous</button>
						<span class="page-number">{{ oltDown.state.modalExport.currentPage }} of {{ this.totalPages }}</span>
						<button @click="this.nextPage()" :disabled="oltDown.state.modalExport.currentPage === this.totalPages" class="btn btn-export-modal" style="width: fit-content">Next</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
import * as XLSX from "xlsx";
import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { U } from "@adc/vigour-ui/lib/spl";
import { getAllOltDownDataTable } from "../../views/Api/counting/getAllOltDownDataTable.js";

export default {
	name: "exportSiteDownDurationOlt",
	data() {
		return IndexData;
	},
	watch: {
		"oltDown.state.modalExport.step": function (newVal) {
			this.oltDown.state.modalExport.step = newVal;
		},
		"oltDown.state.modalExport.showing": function (newVal, oldVal) {
			if (newVal > oldVal) {
				this.oltDown.state.modalExport.currentPage = 1;
				this.oltDown.state.modalExport.loading == true;
				U.initCsrfToken();
				this.oltDown.state.modalExport.showing = newVal;
				this.getData();
			}
		}
	},
	computed: {
		isDurationStep() {
			const step = this.oltDown.state.modalExport.step;
			return step === "duration-range1" || step === "duration-range2" || step === "duration-range3" || step === "duration-range4" || step === "duration-range5";
		},
		filteredTableData() {
			// STEP
			var allSelectedData = this.oltDown.state.modalExport.data;
			var step = this.oltDown.state.modalExport.step;
			//API PARAMS
			var durationModel = this.oltDown.state.modalExport.durationModel;
			let searchQuery = this.oltDown.state.modalExport.searchQuery?.toLowerCase() || "";

			const durationMapping = {
				"all-duration": "",
				"duration-range1": "1",
				"duration-range2": "1_4",
				"duration-range3": "4_8",
				"duration-range4": "8_24",
				"duration-range5": "m24"
			};

			let filteredData = [];

			const filterDurationRange = (data, duration) => {
				return data.filter((data) => {
					const isDurationMatch = !duration || data.duration_range === duration;

					return isDurationMatch;
				});
			};

			const filterVendorWise = (vendor) => {
				return allSelectedData.filter((data) => {
					const isVendorMatch = data.site_vendor === vendor;

					return isVendorMatch;
				});
			};

			switch (step) {
				case "all-selected":
					filteredData = allSelectedData;

				case "duration-range1":
				case "duration-range2":
				case "duration-range3":
				case "duration-range4":
				case "duration-range5":
					filteredData = filterDurationRange(allSelectedData, durationMapping[step]);
					console.log(filteredData, "filtered data");
					break;

				case "NOKIA":
				case "HUAWEI":
				case "ERICSSON":
					const vendor = step;
					filteredData = filterVendorWise(vendor);
					break;

				default:
					filteredData = allSelectedData;
					break;
			}

			if (searchQuery) {
				filteredData = filteredData.filter((item) => item.site_id && item.site_id.toLowerCase().includes(searchQuery));
			}

			return filteredData;
		},
		paginatedData() {
			let pageRows = parseFloat(this.oltDown.state.modalExport.rowsPerPage);
			const start = (this.oltDown.state.modalExport.currentPage - 1) * pageRows;
			const end = start + pageRows;
			console.log(this.filteredTableData.slice(start, end), "paginated data");
			return this.filteredTableData.slice(start, end);
		},
		totalPages() {
			let pageRows = parseFloat(this.oltDown.state.modalExport.rowsPerPage);
			return Math.ceil(this.filteredTableData.length / pageRows);
		}
	},
	methods: {
		maximizeModal() {
			this.oltDown.state.modalExport.isMaximize = true;
			const modal = document.getElementById("modal-export-site-down-duration");
			const rowShowing = document.getElementById("row-show-table-data-site-down-export");

			if (modal && rowShowing) {
				modal.style.setProperty("--bs-modal-width", "1800px");
				rowShowing.style.height = "650px";
			}
		},
		minimizeModal() {
			this.oltDown.state.modalExport.isMaximize = false;
			const modal = document.getElementById("modal-export-site-down-duration");
			const rowShowing = document.getElementById("row-show-table-data-site-down-export");
			if (modal && rowShowing) {
				modal.style.setProperty("--bs-modal-width", "1500px");
				rowShowing.style.height = "355px";
			}
		},
		async getData() {
			this.oltDown.state.modalExport.data = [];
			// await getAllOltDownDataTable(this.oltDown.apiParams.powerAlarm, this.oltDown.apiParams.hubType, [], [], "", "", this.oltDown.apiParams.vipCheck, this.oltDown.apiParams.siteType);
			await getAllOltDownDataTable(this.oltDown.apiParams.hubCheck, this.oltDown.selector.area.value, this.oltDown.apiParams.vipCheck, this.oltDown.apiParams.siteType, this.oltDown.apiParams.siteDownCheck, this.oltDown.start_time, this.oltDown.end_time)
				.then(({ res }) => {
					console.log(res, "result get data site down data table");
					this.oltDown.state.modalExport.data = res;
					this.oltDown.state.modalExport.loading == false;
				})
				.catch((error) => {
					this.oltDown.state.modalExport.loading == false;
					console.error(error);
				});
		},
		async exportTableData() {
			const table = this.$refs.exportSiteDownDetailTable;
			const ws = XLSX.utils.table_to_sheet(table);

			const colWidths = [];
			table.querySelectorAll("thead th").forEach((th, index) => {
				const maxLength = Math.max(...Array.from(table.querySelectorAll(`td:nth-child(${index + 1})`)).map((td) => td.innerText.length));
				colWidths[index] = maxLength;
			});

			ws["!cols"] = colWidths.map((width) => ({ wch: width }));

			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
			XLSX.writeFile(wb, "NE_" + this.oltDown.state.modalExport.title + "_Summary_Export.xlsx");
		},
		async exportAllData() {
			const fullData = this.filteredTableData;
			const ws = XLSX.utils.json_to_sheet(fullData);

			const colWidths = Object.keys(fullData[0] || {}).map((key) => {
				const maxLength = Math.max(...fullData.map((row) => (row[key] || "").toString().length));
				return maxLength;
			});

			ws["!cols"] = colWidths.map((width) => ({ wch: width }));

			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "FullData");
			XLSX.writeFile(wb, "NE_" + this.oltDown.state.modalExport.title + "_Full_Export.xlsx");
		},

		async openTt(orderid) {
			let dataObj = {
				is_archived: false,
				app_name: "TroubleTicket",
				module_name: "TroubleTicket",
				process_name: "ID_799_1510131121023",
				order_id: orderid
			};
			MessageProcessor.process({
				url: "/adc-service/web/rest/v1/services/OrderQuery/OrderQuery/oq_order_page_query",
				data: dataObj,
				success: (result) => {
					if (!result || !result.valid) {
						Nf.promptAlert({
							message: Nf.res("processNoExist")
						});
						return;
					}

					result.parameters.process_name = "ID_799_1510131121023";
					result.parameters.order_status = result.parameters.processstatus;
					if (result.isLegacy === "legacy") {
						delete result.parameters.taskid;
						const url = this.addParamsByObject("https://30f9-sg.teleows.com/adc-web/bpm/order-process/order-submit-panel.html", result.parameters);
						window.open(url, "_blank");
					} else {
						const url = this.addParamsByObject(`https://30f9-sg.teleows.com/adc-web/ui/standalone/index-plus.html#/spl2/${result.url}`, result.parameters);
						window.open(url, "_blank");
					}
				}
			});
			// window.open(
			// 	"https://30f9-sg.teleows.com/adc-ui/spl/TroubleTicket/sid-ID_1450489199984-TT11.spl?processstatus=Completed&orderid=" +
			// 		orderid +
			// 		"&currentphase=&task_id=&ticketid=" +
			// 		orderid +
			// 		"&taskid=&processdefkey=ID_799_1510131121023&faultno=&current_user=&process_key=ID_799_1510131121023&order_id=" +
			// 		orderid +
			// 		"&uid=1717353178986",
			// 	"_blank"
			// );
			// window.open(
			// 	"https://30f8-sg-studio.teleows.com/adc-ui/spl/TroubleTicket/sid-ID_1450489199984-TT11.spl?processstatus=Completed&orderid=" +
			// 		orderid +
			// 		"&currentphase=&task_id=&ticketid=" +
			// 		orderid +
			// 		"&taskid=&processdefkey=ID_799_1510131121023&faultno=&current_user=&process_key=ID_799_1510131121023&order_id=" +
			// 		orderid +
			// 		"&uid=1717353178986",
			// 	"_blank"
			// );
			// window.open(
			// 	"https://1057-sg.teleows.com/adc-ui/spl/TroubleTicket/sid-ID_1450489199984-TT11.spl?processstatus=Completed&orderid=" +
			// 		orderid +
			// 		"&currentphase=&task_id=&ticketid=" +
			// 		orderid +
			// 		"&taskid=&processdefkey=ID_208_1502274240291&faultno=&current_user=&process_key=ID_208_1502274240291&order_id=" +
			// 		orderid +
			// 		"&uid=1717353178986",
			// 	"_blank"
			// );
		},
		addParamsByObject(e, t) {
			if (!t) return e;
			var n = [],
				r = e;
			for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && n.push(o + "=" + encodeURIComponent(t[o]));
			return n.length > 0 && (-1 !== r.indexOf("?") ? (r += "&") : (r += "?"), (r += n.join("&"))), r;
		},
		previousPage() {
			if (this.oltDown.state.modalExport.currentPage > 1) {
				this.oltDown.state.modalExport.currentPage--;
			}
		},
		nextPage() {
			if (this.oltDown.state.modalExport.currentPage < this.totalPages) {
				this.oltDown.state.modalExport.currentPage++;
			}
		},

		// REFRESH
		async updateLastUpdatedTime() {
			const now = new Date();
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const hours = now.getHours().toString().padStart(2, "0");
			let minutes = now.getMinutes();

			this.todayDate = today.toLocaleDateString();
			this.lastUpdated = `${hours}:${minutes.toString().padStart(2, "0")}`;
		},

		async checkRefetchData() {
			const now = new Date();
			const minutes = now.getMinutes();

			// if ([0, 15, 30, 45].includes(minutes)) {
			if ([0, 30].includes(minutes)) {
				// REFETCH DATA HERE
				if (this.globalProcess.state.component.applyFilterLoading == false) {
					this.refetch = true;
					await this.getData();
					await this.updateLastUpdatedTime();
				}
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

<style scoped>
.pagination-container {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	margin-top: 10px;
}

.page-number {
	font-size: 14px;
	font-weight: bold;
}
</style>
