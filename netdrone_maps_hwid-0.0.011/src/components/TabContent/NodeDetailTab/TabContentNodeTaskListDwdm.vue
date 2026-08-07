<template>
	<div class="tab-pane fade" id="task-list-dwdm-node-pane" role="tabpanel" aria-labelledby="task-list-dwdm-node-tab" tabindex="0">
		<div class="row mb-3">
			<div class="col-6">
				<div class="d-flex flex-row gap-12 align-items-center">
					<i class="bi bi-filter text-ioh font-700 font-24"></i>
					<div class="dropdown">
						<button class="btn btn-dropdown-multiselect dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Task Type</button>
						<ul class="dropdown-menu">
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" v-model="this.globalProcess.store.site.checker.siteDwdmTaskAll" />
										<label class="form-check-label" for="flexCheckDefault"> All </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" v-model="this.globalProcess.store.site.checker.siteDwdmTaskCm" />
										<label class="form-check-label" for="flexCheckDefault"> CM </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" v-model="this.globalProcess.store.site.checker.siteDwdmTaskPm" />
										<label class="form-check-label" for="flexCheckDefault"> PM </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" v-model="this.globalProcess.store.site.checker.siteDwdmTaskPlm" />
										<label class="form-check-label" for="flexCheckDefault"> PLM </label>
									</div>
								</a>
							</li>
						</ul>
					</div>
					<!-- <div class="dropdown opacity-50" disabled>
						<button class="btn btn-dropdown-multiselect dropdown-toggle" type="button"
							data-bs-toggle="dropdown" aria-expanded="false" disabled>Priority</button>
						<ul class="dropdown-menu">
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" />
										<label class="form-check-label" for="flexCheckDefault"> P1 </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" />
										<label class="form-check-label" for="flexCheckDefault"> P2 </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" />
										<label class="form-check-label" for="flexCheckDefault"> P3 </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" />
										<label class="form-check-label" for="flexCheckDefault"> P4 </label>
									</div>
								</a>
							</li>
						</ul>
					</div> -->
				</div>
			</div>
			<div class="col-6">
				<div class="d-flex flex-row gap-12 justify-content-end">
					<div class="input-group width-250">
						<span class="input-group-text"><i class="bi bi-search font-700"></i></span>
						<input type="text" class="form-control search-global-input" id="searchGlobalInput" aria-describedby="searchGlobal" aria-label="Upload" placeholder="Search Task" v-model="this.globalProcess.store.site.query.siteDwdmSearchQuery" />
					</div>
				</div>
			</div>
		</div>
		<div class="row row-gap-16 row-task-list justify-content-unset">
			<div class="col-12" v-if="filteredData == null || filteredData == undefined || filteredData.length == 0">
				<p class="text-center font-600 font-18 mt-4 mb-4">{{ this.globalProcess.store.site.information.siteTaskMessage }}</p>
			</div>
			<!-- FOR EACH COL-4 -->
			<div class="col-4" v-else v-for="data in filteredData" :key="data.wo_id">
				<div class="accordion accordion-tasklist-border" :id="'taskListAccordion' + data.wo_id">
					<div class="accordion-item">
						<h2 class="accordion-header py-1">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#taskListAcr' + data.wo_id" aria-expanded="false" :aria-controls="'taskListAcr' + data.wo_id">
								<div class="row">
									<div class="col-12">
										<div class="row px-2" style="gap: 10px">
											<p class="task-types-class mb-2">{{ data.task_type }}</p>
										</div>
										<div class="row justify-content-between">
											<p class="font-18 width-fit-content">{{ data.wo_id }}</p>
											<i class="bi bi-copy text-ioh font-18 width-fit-content" @click="copyWoIdSite(data.wo_id)"></i>
										</div>
									</div>
								</div>
							</button>
						</h2>
						<div :id="'taskListAcr' + data.wo_id" class="accordion-collapse collapse" :data-bs-parent="'#taskListAccordion' + data.wo_id">
							<div class="accordion-body">
								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Ticket ID</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">
											{{ data.ticket_id }}
											<i v-if="data.ticket_id" class="ms-3 bi bi-copy text-ioh font-16 c-pointer" @click="copyTicketIdSite(data.ticket_id)"></i>
										</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">FME</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-600 text-ioh text-decor-underline c-pointer" data-bs-dismiss="modal" @click="selectFmeById(data.fme_lat, data.fme_lon, data.username, this)">
											{{ data.full_name }}
										</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Phone Number</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">{{ data.phone }}</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Task Status</p>
									</div>
									<div class="col-8 overflow-break">
										<p class="font-12 font-500 text-dark">
											{{ data.task_status }}
										</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Title</p>
									</div>
									<div class="col-8 overflow-break">
										<p class="font-12 font-500 text-dark">
											{{ data.title }}
										</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">SLA Site Class</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">{{ data.sla_site_class }}</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">SLA Duration</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">{{ data.sla_duration }}</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">SLA Remain</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">
											{{ Math.abs(parseFloat(data.sla_remain)) != NaN ? Math.abs(parseFloat(data.sla_remain)) : data.sla_remain }}
										</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Status</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">{{ data.business_status }}</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Suspect Cause</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">{{ data.root_cause }}</p>
									</div>
								</div>

								<div class="row mb-3">
									<div class="col-4">
										<p class="font-12 font-500 text-grey">Update</p>
									</div>
									<div class="col-8">
										<p class="font-12 font-500 text-dark">{{ data.tt_update }}</p>
									</div>
								</div>

								<div class="row mb-2">
									<div class="col-12">
										<button class="btn btn-apply width-100" @click="openEtaModal(data.wo_id)" data-bs-dismiss="modal">ETA Details</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../../views/Data/IndexData.js";
import { etaDetailMapsInit } from "../../../views/Helper/MapFunction/etaDetailMapsInit.js";
import { coverageFme, fmeSearchMarker } from "../../../views/Data/GlobalData.js";
import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { toRaw } from "vue";

export default {
	name: "TabContentNodeTaskListDwdm",
	data() {
		return IndexData;
	},
	computed: {
		filteredData() {
			const searchTerm = this.globalProcess.store.site.query.siteDwdmSearchQuery ? this.globalProcess.store.site.query.siteDwdmSearchQuery.toLowerCase().trim() : "";

			if (!this.globalProcess.store.site.ticket.siteDwdmTicketList) {
				return [];
			}

			return this.globalProcess.store.site.ticket.siteDwdmTicketList.filter((item) => {
				const matchesTaskType =
					this.globalProcess.store.site.checker.siteDwdmTaskAll ||
					(this.globalProcess.store.site.checker.siteDwdmTaskCm && item.task_type === "CM") ||
					(this.globalProcess.store.site.checker.siteDwdmTaskPm && item.task_type === "PM") ||
					(this.globalProcess.store.site.checker.siteDwdmTaskPlm && item.task_type === "PLM");

				const matchesSearchQuery = !searchTerm || (item.title && item.title.toLowerCase().includes(searchTerm)) || (item.ticket_id && item.ticket_id.toLowerCase().includes(searchTerm)) || (item.wo_id && item.wo_id.toLowerCase().includes(searchTerm));

				return matchesTaskType && matchesSearchQuery;
			});
		}
	},
	methods: {
		copyWoIdSite(woId) {
			navigator.clipboard
				.writeText(woId)
				.then(() => {
					this.$swal({
						icon: "success",
						title: "WO ID copied to clipboard",
						showConfirmButton: false,
						timer: 1200
					});
				})
				.catch((err) => {
					console.error("Failed to copy text: ", err);
					this.$swal({
						icon: "error",
						title: "Failed to copy WO ID",
						showConfirmButton: false,
						timer: 1200
					});
				});
		},
		copyTicketIdSite(ticketId) {
			navigator.clipboard
				.writeText(ticketId)
				.then(() => {
					this.$swal({
						icon: "success",
						title: "Ticket ID copied to clipboard",
						showConfirmButton: false,
						timer: 1200
					});
				})
				.catch((err) => {
					console.error("Failed to copy text: ", err);
					this.$swal({
						icon: "error",
						title: "Failed to copy Ticket ID",
						showConfirmButton: false,
						timer: 1200
					});
				});
		},
		async openEtaModal(woId) {
			const ticketDetails = this.globalProcess.store.site.ticket.siteDwdmTicketList.find((item) => item.wo_id === woId);

			if (ticketDetails) {
				this.globalProcess.store.eta.ticketDetail = ticketDetails;
				this.globalProcess.store.eta.originData = { lat: ticketDetails.fme_lat, lng: ticketDetails.fme_lon };
				this.globalProcess.store.eta.destinationData = { lat: ticketDetails.site_lat, lng: ticketDetails.site_lon };
			}
			const modalElement = document.getElementById("etaDetails");
			if (modalElement) {
				const etaDetails = new bootstrap.Modal(modalElement, {
					backdrop: "static"
				});
				etaDetails.show();
			} else {
				console.error("Modal element with ID 'etaDetails' not found.");
			}
			etaDetailMapsInit(this.globalProcess.store.eta.originData, this.globalProcess.store.eta.destinationData);
		},
		async selectFmeById(fmeLat, fmeLon, fmeId, ref) {
			if (fmeLat !== "" && fmeLon !== "") {
				var coord = { lat: parseFloat(fmeLat), lng: parseFloat(fmeLon) };
			}

			this.globalProcess.store.maps.backgroundMaps.panTo(coord);
			this.globalProcess.store.maps.backgroundMaps.setZoom(10);

			if (coverageFme != null) {
				coverageFme.setMap(null);
			}
			coverageFme = new HWMapJsSDK.HWCircle({
				map: this.globalProcess.store.maps.backgroundMaps,
				center: coord, // LatLng object
				radius: 1, // in meters
				fillColor: "rgba(237, 109, 0, 0.1)",
				strokeColor: "rgba(237, 109, 0, 0.8)",
				strokeWeight: 2
			});

			if (fmeSearchMarker != null) {
				toRaw(fmeSearchMarker).setMap(null);
			}

			fmeSearchMarker = new HWMapJsSDK.HWMarker({
				map: this.globalProcess.store.maps.backgroundMaps,
				position: coord,
				zIndex: 10,
				icon: {
					scale: 0.9,
					url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/fme.png?_v=standard_1716903051654?t=1716927516520"
				}
			});

			fmeSearchMarker.addListener("click", async function () {
				ref.globalProcess.state.component.fmeDetailsLoading = true;
				var fmeDetail = {};
				var fmeWoList = {};
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_fme_basic_information",
					data: {
						user_id: fmeId
					},
					showErrorMessage: false,
					success: (json) => {
						fmeDetail = json.result;
						try {
							MessageProcessor.process({
								serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
								data: {
									user_id: fmeId,
									task_status: ["dispatched", "completed", "scheduled", "inprocess", "accepted"]
								},
								showErrorMessage: false,
								success: (json) => {
									fmeWoList = json.results;
									ref.globalProcess.store.fme.fmeDetailsSearch = fmeDetail;
									ref.globalProcess.store.fme.woListFmeSearch = fmeWoList;
									ref.globalProcess.store.fme.filteredWoListFmeSearch = fmeWoList;
									setTimeout(() => {
										const modalElement = document.getElementById("fmeDetails");
										if (modalElement) {
											const fmeDetails = new bootstrap.Modal(modalElement, {
												backdrop: "static"
											});
											fmeDetails.show();
										} else {
											console.error("Modal element with ID 'fmeDetails' not found.");
										}
										ref.globalProcess.state.component.fmeDetailsLoading = false;
									}, 3000);
								},
								error: (error) => {
									console.error(error, "error wo list");
								}
							});
						} catch (error) {
							console.error(error, "error fme details");
						}
					},
					error: (error) => {
						console.error(error, "error fme details");
					}
				});
			});
		}
	}
};
</script>

<style>
.row-task-list {
	height: 100%;
	max-height: 550px;
	overflow-x: hidden;
	overflow-y: scroll;
}
</style>
