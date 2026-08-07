<template>
	<div class="modal fade" id="modalTicketOpenAnalysis" aria-hidden="true" aria-labelledby="modalTicketOpenAnalysis" tabindex="-1">
		<div class="modal-dialog modal-xxxl modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="d-flex justify-content-between">
						<h3 v-if="this.linkDown.store.modal.ticketOpenAnalysis.tableData == null" class="font-18 font-700 text-dark mb-4 d-flex flex-row align-items-center gap-16">
							Ticket Open analysis (Multi Site Down, PE, Link Down)
							<div class="d-flex flex-row justify-content-center">
								<div class="bg-card-loader"></div>
							</div>
						</h3>
						<h3 v-if="this.linkDown.store.modal.ticketOpenAnalysis.tableData != null" class="font-18 font-700 text-dark mb-4 d-flex flex-row align-items-center gap-16">Ticket Open analysis (Multi Site Down, PE, Link Down)</h3>

						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
					</div>
					<div class="d-flex flex-row mb-3">
						<div class="col-6 d-flex flex-row gap-16 align-items-center">
							<i class="bi bi-filter text-ioh font-700 font-24"></i>
							<select class="form-select" aria-label="Default select example" v-model="linkDown.store.modal.ticketOpenAnalysis.circle">
								<option disabled>Select Region</option>
								<option selected value="">Nation Wide</option>
								<option value="SUMATERA">SMTR</option>
								<option value="JAYA">JAYA</option>
								<option value="JAVA">JAVA</option>
								<option value="KALISUMAPA">KSMP</option>
							</select>
							<select class="form-select" aria-label="Default select example" v-model="linkDown.store.modal.ticketOpenAnalysis.ttStatus">
								<option disabled>Select Ticket Status</option>
								<option selected value="">All Ticket Status</option>
								<option value="running">Running</option>
								<option value="completed">Completed</option>
							</select>
							<select class="form-select" aria-label="Default select example" v-model="linkDown.store.modal.ticketOpenAnalysis.severity">
								<option disabled>Select Potential Severity</option>
								<option selected value="">All Potential Severity</option>
								<option value="Potential Emergency">Potential Emergency</option>
								<option value="Potential Critical">Potential Critical</option>
							</select>
						</div>
						<div class="col-6 d-flex flex-row gap-16 justify-content-end">
							<button class="btn btn-clear" style="width: 200px" @click="exportTableData()">Export Data</button>
							<button class="btn btn-clear" style="width: 200px" @click="openTtQuery()">Link To TT Query</button>
						</div>
					</div>
					<div class="row d-flex flex-row mb-2 box-row-ticket-open">
						<table class="table table-striped table-bordered table-hover font-20" ref="ttOpenAnalysis">
							<thead>
								<tr>
									<th class="align-content-center text-center font-14">No</th>
									<th class="align-content-center text-center font-14">TT Number</th>
									<th class="align-content-center text-center font-14">Title</th>
									<th class="align-content-center text-center font-14">Ticket Status</th>
									<th class="align-content-center text-center font-14">Potential Severity</th>
									<th class="align-content-center text-center font-14">Circle</th>
									<th class="align-content-center text-center font-14">Start</th>
									<th class="align-content-center text-center font-14">Last Update Time</th>
									<th class="align-content-center text-center font-14">Aging</th>
								</tr>
							</thead>
							<tbody v-if="this.linkDown.store.modal.ticketOpenAnalysis.tableData != null || this.linkDown.store.modal.ticketOpenAnalysis.tableData != undefined">
								<tr v-for="(data, index) in filteredData" :key="index">
									<td class="align-content-center font-12">{{ index + 1 }}</td>
									<td class="align-content-center font-12">
										<p class="text-ioh c-pointer btn-link-click" @click="linkToDetail(data.orderid)">
											{{ data.orderid }}
										</p>
									</td>
									<td class="align-content-center font-12" style="width: 400px !important">{{ data.title }}</td>
									<td class="align-content-center font-12">{{ data.ticket_status.toUpperCase() }}</td>
									<td class="align-content-center font-12">{{ data.potential_severity }}</td>
									<td class="align-content-center font-12">{{ data.four_circle }}</td>
									<td class="align-content-center font-12">{{ data.start_time }}</td>
									<td class="align-content-center font-12">{{ data.last_update_time }}</td>
									<td class="align-content-center font-12">{{ data.aging }}</td>
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
import { getTicketOpenAnalysis } from "../../views/Api/countLinkDown/getTicketOpenAnalysis";
import { IndexData } from "../../views/Data/IndexData";
import { U } from "@adc/vigour-ui/lib/spl";

import * as XLSX from "xlsx";

export default {
	name: "ModalTicketOpenAnalysis",
	data() {
		return IndexData;
	},
	props: {
		modalOpened: Number,
		hideModal: Function
	},
	watch: {
		modalOpened(newVal, oldVal) {
			if (newVal != oldVal) {
				U.initCsrfToken();
				this.getData();
			}
		}
	},
	computed: {
		filteredData() {
			let data = [...this.linkDown.store.modal.ticketOpenAnalysis.tableData];

			// Filter by selected region
			if (this.linkDown.store.modal.ticketOpenAnalysis.circle) {
				data = data.filter((ticket) => ticket.four_circle === this.linkDown.store.modal.ticketOpenAnalysis.circle);
			}

			// Filter by ticket status
			if (this.linkDown.store.modal.ticketOpenAnalysis.ttStatus) {
				data = data.filter((ticket) => ticket.ticket_status === this.linkDown.store.modal.ticketOpenAnalysis.ttStatus);
			}

			// Filter by potential severity
			if (this.linkDown.store.modal.ticketOpenAnalysis.severity) {
				data = data.filter((ticket) => ticket.potential_severity === this.linkDown.store.modal.ticketOpenAnalysis.severity);
			}

			// Sort to prioritize running tickets
			return data.sort((a, b) => {
				if (a.ticket_status === "running" && b.ticket_status !== "running") return -1;
				if (a.ticket_status !== "running" && b.ticket_status === "running") return 1;
				return 0;
			});
		}
	},
	methods: {
		async getData() {
			this.globalProcess.state.component.loadingLinkDownModal = true;
			await getTicketOpenAnalysis()
				.then(({ res }) => {
					console.log(res, "result ticket open analysis");
					this.linkDown.store.modal.ticketOpenAnalysis.tableData = res.results;
					this.globalProcess.state.component.loadingLinkDownModal = false;
				})
				.catch((error) => {
					this.globalProcess.state.component.loadingLinkDownModal = false;
					console.error("Error fetching data:", error);
				});
		},
		async linkToDetail(orderid) {
			window.open(
				"https://1057-sg.teleows.com/adc-ui/spl/TroubleTicket/sid-ID_1450489199984-TT11.spl?processstatus=Completed&orderid=" +
					orderid +
					"&currentphase=&task_id=&ticketid=" +
					orderid +
					"&taskid=&processdefkey=ID_208_1502274240291&faultno=&current_user=&process_key=ID_208_1502274240291&order_id=" +
					orderid +
					"&uid=1717353178986",
				"_blank"
			);
		},
		removeBackdrop() {
			var backdrops = document.getElementsByClassName("modal-backdrop fade show");
			Array.from(backdrops).forEach(function (backdrop) {
				backdrop.classList.remove("modal-backdrop");
				backdrop.classList.remove("fade");
				backdrop.classList.remove("show");
			});
		},
		async exportTableData() {
			const table = this.$refs.ttOpenAnalysis;
			const ws = XLSX.utils.table_to_sheet(table);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
			XLSX.writeFile(wb, "Netdrone_LinkDown_Ticket_Open_Analysis.xlsx");
		},
		openTtQuery() {
			window.open("https://1057-sg.teleows.com/adc-ui/spl/TroubleTicket/tt_troubleticket_grid_advanced.spl", "_blank");
		}
	}
};
</script>

<style>
.box-row-ticket-open {
	height: 100%;
	max-height: 500px;
	overflow-y: scroll;
	overflow-x: hidden;
	zoom: 85%;
}
</style>
