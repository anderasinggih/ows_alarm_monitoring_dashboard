<template>
	<div class="modal fade" id="ttCorrelationModal" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-xxxl modal-dialog-centered">
			<div class="modal-content p-3">
				<div class="d-flex flex-row justify-content-between align-items-center">
					<div class="box-row">
						<h4 class="font-700 fit-content">TT Correlation</h4>
						<div class="d-flex flex-row justify-content-center" v-if="this.siteDown.state.ttCorrelation.ttTableLoading == true">
							<div class="bg-card-loader"></div>
						</div>
					</div>
					<div class="box-row">
						<button class="btn btn-clear w-150" @click="exportTableData()">Export Table</button>
						<button type="button" class="btn-close font-20" data-bs-dismiss="modal" aria-label="Close" ref="closeTtCorrelation"></button>
					</div>
				</div>
				<hr />
				<div class="modal-body">
					<div class="row d-flex flex-row mb-3" v-if="this.siteDown.store.ttCorrelation.data.length != 0">
						<div class="col-show-3 pe-1 ps-1" v-for="(data, index) in this.siteDown.store.ttCorrelation.data" :key="index">
							<CardTicketCounting :title="data.severity" :mtte="Math.abs(data.mtte)" :mttr="data.mttr" :closed="data.closed_count" :running="data.running_count" :cardColor="siteDown.store.ttCorrelation.cardColors[index]"></CardTicketCounting>
						</div>
					</div>
					<div class="row d-flex flex-row mb-3" v-else>
						<div class="col-3 pe-1 ps-0">
							<CardTicketCounting :title="'Emergency'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(199, 0, 11, 0.05)'"></CardTicketCounting>
						</div>
						<div class="col-3 pe-1 ps-1">
							<CardTicketCounting :title="'Critical'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(237, 109, 0, 0.05)'"></CardTicketCounting>
						</div>
						<div class="col-3 pe-1 ps-1">
							<CardTicketCounting :title="'Major'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(252, 200, 0, 0.05)'"></CardTicketCounting>
						</div>
						<!-- <div class="col-3 pe-1 ps-1">
							<CardTicketCounting :title="'POT'" :mtte="'...'" :mttr="'...'" :closed="'...'" :running="'...'" :cardColor="'rgb(206, 206, 206, 0.2)'"></CardTicketCounting>
						</div> -->
					</div>
					<div class="row d-flex flex-row mb-2 box-row" style="overflow-x: scroll">
						<table class="table table-striped table-bordered table-hover font-14" ref="ttTable">
							<thead>
								<tr>
									<th class="align-content-center text-center" style="font-size: 14px">No</th>
									<th class="align-content-center text-center" style="font-size: 14px">TT Number</th>
									<th class="align-content-center text-center" style="font-size: 14px">TT Type</th>
									<th class="align-content-center text-center" style="font-size: 14px">Ticket Status</th>
									<th class="align-content-center text-center" style="font-size: 14px">Severity</th>
									<th class="align-content-center text-center" style="font-size: 14px">Region</th>
									<th class="align-content-center text-center" style="font-size: 14px">Root Cause</th>
									<th class="align-content-center text-center" style="font-size: 14px">MC Cluster</th>
									<th class="align-content-center text-center" style="font-size: 14px">Start</th>
									<th class="align-content-center text-center" style="font-size: 14px">Close</th>
									<th class="align-content-center text-center" style="font-size: 14px">Last Update Time</th>
									<th class="align-content-center text-center" style="font-size: 14px">Title</th>
									<th class="align-content-center text-center" style="font-size: 14px">Aging</th>
									<!-- <th class="align-content-center text-center" style="font-size: 14px">Root Cause</th> -->
									<th class="align-content-center text-center" style="font-size: 14px">Associate Ticket</th>
									<!-- <th class="align-content-center text-center" style="font-size: 14px">Site Affected</th> -->
								</tr>
							</thead>
							<tbody v-if="this.siteDown.store.ttCorrelation.tableData != null || this.siteDown.store.ttCorrelation.tableData != undefined">
								<tr v-for="(data, index) in filteredData" :key="index">
									<td class="align-content-center font-12">{{ index + 1 }}</td>
									<td class="align-content-center font-12">
										<p class="text-ioh c-pointer btn-link-click" @click="linkToDetail(data.orderid)">
											{{ data.orderid }}
										</p>
									</td>
									<td class="align-content-center font-12">{{ data.tt_type }}</td>
									<td class="align-content-center font-12">{{ data.ticket_status.toUpperCase() }}</td>
									<td class="align-content-center font-12">{{ data.severity }}</td>
									<td class="align-content-center font-12">{{ data.four_circle }}</td>
									<td class="align-content-center font-12">
										{{ data.root_cause }}
									</td>
									<td class="align-content-center font-12">{{ data.mc_cluster }}</td>
									<td class="align-content-center font-12">{{ data.start_time }}</td>
									<td class="align-content-center font-12">{{ data.close_time }}</td>
									<td class="align-content-center font-12">{{ data.last_update_time }}</td>
									<td class="align-content-center font-12" style="width: 400px !important">{{ data.title }}</td>
									<td class="align-content-center font-12">{{ data.aging }}</td>
									<!-- <td class="align-content-center font-12">{{ data.root_cause }}</td> -->
									<td class="align-content-center font-12">
										{{ data.associate_orderid ? data.associate_orderid : "No Associate Ticket" }}
									</td>
									<!-- <td class="align-content-center font-14 text-ioh c-pointer text-center" @click="zoomToMap(data.orderid)">
										<i class="bi bi-search"></i>
									</td> -->
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
import * as XLSX from "xlsx";
import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

import { getCountTtCorrelationDetails } from "../../views/Api/counting/getCountTtCorrelationDetails.js";
import { getSiteDownMarker } from "../../views/Api/marker/getSiteDownMarker.js";

import { IndexData } from "../../views/Data/IndexData";

import CardTicketCounting from "../../components/Card/CardTicketCounting.vue";
import { hideLayerMarker } from "../../views/Helper/MarkerFunction/hideLayerMarker.js";
import { addLayerMarker } from "../../views/Helper/MarkerFunction/addLayerMarker.js";

export default {
	name: "ModalTtCorrelation",
	components: {
		CardTicketCounting
	},
	props: {
		state: Number
	},
	watch: {
		state(newVal, oldVal) {
			if (newVal > oldVal) {
				this.siteDown.state.ttCorrelation.modalState = newVal;
				this.getTableData();
			}
		}
	},
	computed: {
		filteredData() {
			return [...this.siteDown.store.ttCorrelation.tableData].sort((a, b) => {
				if (a.ticket_status === "running" && b.ticket_status !== "running") return -1;
				if (a.ticket_status !== "running" && b.ticket_status === "running") return 1;
				return 0;
			});
		}
	},
	data() {
		return IndexData;
	},
	methods: {
		async zoomToMap(ttId) {
			this.siteDown.store.ttCorrelation.ttCorrelationId = ttId;
			this.globalProcess.state.component.applyFilterLoading = true;
			this.siteDown.state.ttCorrelation.showTtId = true;
			this.globalProcess.state.searching.clearSearchBtn = true;

			await getSiteDownMarker([], false, [], null, "", ttId, [], "", ["NORMAL", "N3T", "USO"], [])
				.then(({ res }) => {
					var coord = { lat: parseFloat(res[0].lat), lng: parseFloat(res[0].lon) };

					this.$refs.closeTtCorrelation.click();

					this.globalProcess.store.maps.backgroundMaps.panTo(coord);
					this.globalProcess.store.maps.backgroundMaps.setZoom(11.7);

					this.siteDown.marker.aging.multipleSiteDown.data = res;

					hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);

					addLayerMarker(this.siteDown.marker.aging.multipleSiteDown, this.globalProcess.store.maps.backgroundMaps, this);

					this.globalProcess.state.component.applyFilterLoading = false;
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
					this.globalProcess.state.component.applyFilterLoading = false;
				});
		},
		async getTableData() {
			this.siteDown.state.ttCorrelation.ttTableLoading = true;
			await getCountTtCorrelationDetails(this.siteDown.start_time, this.siteDown.end_time)
				.then(({ res }) => {
					this.siteDown.store.ttCorrelation.tableData = res._values;
					this.siteDown.state.ttCorrelation.ttTableLoading = false;
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
					this.siteDown.state.ttCorrelation.ttTableLoading = false;
				});
		},
		async linkToDetail(orderid) {
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
		async exportTableData() {
			const table = this.$refs.ttTable;
			const ws = XLSX.utils.table_to_sheet(table);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
			XLSX.writeFile(wb, "TT_Correlation_Netdrone.xlsx");
		}
	}
};
</script>

<style>
.box-row {
	height: 100%;
	max-height: 500px;
	overflow-y: scroll;
	overflow-x: hidden;
	zoom: 75%;
}

@media screen and (min-width: 2560px) {
	.modal-xxxl {
		--bs-modal-width: 2000px;
	}

	.box-row {
		zoom: 100%;
	}
}

@media screen and (min-width: 1920px) {
	.modal-xxxl {
		--bs-modal-width: 1800px;
	}

	.box-row {
		zoom: 90%;
	}
}

.modal-xxxl {
	--bs-modal-width: 1500px;
}

.box-row {
	display: flex;
	flex-direction: row;
	gap: 20px;
	align-items: center;
}

.w-150 {
	width: 150px !important;
}
.row .col-show-3 {
	width: 33%;
}
</style>
