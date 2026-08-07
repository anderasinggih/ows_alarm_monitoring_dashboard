<template>
	<div class="modal fade" id="fmeDetails" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details">
				<div class="d-flex flex-row justify-content-between px-3 py-4 pb-0">
					<h4><b>FME Details</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="closeFmeDetails"></button>
				</div>
				<div class="modal-body pt-2 mt-2 mb-3">
					<p class="font-16 text-dark font-600 mb-2">FME Basic Information</p>
					<div class="row mb-3">
						<!-- CONTENT LEFT -->
						<div class="col-3">
							<p class="font-16 text-grey font-400 mb-2">Name</p>
							<p class="font-16 text-grey font-400 mb-2">Status</p>
							<p class="font-16 text-grey font-400 mb-2">User Name</p>
							<p class="font-16 text-grey font-400 mb-2">Default FM Office</p>
							<p class="font-16 text-grey font-400 mb-2">Contractor</p>
							<p class="font-16 text-grey font-400 mb-2">Skills</p>
							<p class="font-16 text-grey font-400 mb-2">Task Type</p>
							<p class="font-16 text-grey font-400 mb-2">Phone Number</p>
						</div>

						<!-- CONTENT RIGHT -->
						<div class="col-9">
							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].fullname ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].fme_status ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].username ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].default_fm_office ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].contractor_name ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].skills ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].task_types ?? "Undefined" }}
							</p>

							<p class="font-16 text-dark font-400 mb-2" v-if="this.globalProcess.store.fme.fmeDetailsSearch && this.globalProcess.store.fme.fmeDetailsSearch[0]">
								{{ this.globalProcess.store.fme.fmeDetailsSearch[0].mobile ?? "Undefined" }}
							</p>
						</div>
					</div>

					<div class="row d-flex flex-row justify-content-between mb-3">
						<p class="font-16 text-dark font-600 mb-3 width-250">Work Order</p>
						<div class="row">
							<div class="col-6">
								<div class="d-flex flex-row gap-12 align-items-center">
									<i class="bi bi-filter text-ioh font-700 font-24"></i>
									<div class="dropdown">
										<button class="btn btn-dropdown-multiselect dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Task Type</button>
										<ul class="dropdown-menu">
											<li>
												<a class="dropdown-item">
													<div class="form-check">
														<input class="form-check-input" type="checkbox" value="" v-model="globalProcess.checker.fme.fmeAll" />
														<label class="form-check-label" for="flexCheckDefault"> All </label>
													</div>
												</a>
											</li>
											<li>
												<a class="dropdown-item">
													<div class="form-check">
														<input class="form-check-input" type="checkbox" value="" v-model="globalProcess.checker.fme.fmeCm" />
														<label class="form-check-label" for="flexCheckDefault"> CM </label>
													</div>
												</a>
											</li>
											<li>
												<a class="dropdown-item">
													<div class="form-check">
														<input class="form-check-input" type="checkbox" value="" v-model="globalProcess.checker.fme.fmePm" />
														<label class="form-check-label" for="flexCheckDefault"> PM </label>
													</div>
												</a>
											</li>
											<li>
												<a class="dropdown-item">
													<div class="form-check">
														<input class="form-check-input" type="checkbox" value="" v-model="globalProcess.checker.fme.fmePlm" />
														<label class="form-check-label" for="flexCheckDefault"> PLM </label>
													</div>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="d-flex flex-row gap-12 justify-content-end">
									<div class="input-group width-250">
										<span class="input-group-text"><i class="bi bi-search font-700"></i></span>
										<input type="text" class="form-control search-global-input" id="searchGlobalInput" aria-describedby="searchGlobal" aria-label="Upload" placeholder="Search Task" v-model="globalProcess.query.fme.woSearchQuery" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="row row-ticket-list mb-3 row-gap-12 justify-content-unset">
						<div class="col-12" v-if="fmeFilteredWoData == null || fmeFilteredWoData == undefined || fmeFilteredWoData.length == 0">
							<p class="text-center font-600 font-18 mt-4 mb-4">{{ this.globalProcess.store.fme.fmeWoMessage }}</p>
						</div>
						<div class="col-4" v-else v-for="data in fmeFilteredWoData" :key="data.wo_id">
							<div class="accordion accordion-tasklist-border" id="taskListAccordion">
								<div class="accordion-item">
									<h2 class="accordion-header py-1">
										<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#woFme' + data.wo_id" aria-expanded="false" :aria-controls="'woFme' + data.wo_id">
											<div class="row">
												<div class="col-12">
													<div class="row px-2" style="gap: 10px">
														<p class="task-types-class mb-2">{{ data.task_type }}</p>
													</div>
													<div class="row justify-content-between">
														<p class="font-18 width-fit-content">{{ data.wo_id }}</p>
														<i class="bi bi-copy text-ioh font-18 width-fit-content c-pointer" @click="copyWoIdFme(data.wo_id)"></i>
													</div>
												</div>
											</div>
										</button>
									</h2>
									<div :id="'woFme' + data.wo_id" class="accordion-collapse collapse" :data-bs-parent="'#woFme' + data.wo_id">
										<div class="accordion-body">
											<div class="row mb-2">
												<div class="col-4">
													<p class="font-16 font-500 text-grey">Site ID</p>
												</div>
												<div class="col-8">
													<p class="font-16 font-600 text-ioh text-decor-underline c-pointer" @click="selectSiteById(data.site_id_name, this.siteDown.apiParams.powerAlarm, data.site_lat, data.site_lon)">
														{{ data.site_id_name }}
													</p>
												</div>
											</div>

											<div class="row mb-2">
												<div class="col-4">
													<p class="font-16 font-500 text-grey">Title</p>
												</div>
												<div class="col-8 overflow-break">
													<p class="font-16 font-500 text-dark">{{ data.title }}</p>
												</div>
											</div>

											<div class="row mb-2">
												<div class="col-4">
													<p class="font-16 font-500 text-grey">Ticket Id</p>
												</div>
												<div class="col-8">
													<p class="font-16 font-500 text-dark me-2">
														{{ data.ticket_id }}
														<i v-if="data.ticket_id" class="ms-3 bi bi-copy text-ioh font-16 c-pointer" @click="copyTicketIdFme(data.ticket_id)"></i>
													</p>
												</div>
											</div>

											<div class="row mb-2">
												<div class="col-4">
													<p class="font-16 font-500 text-grey">Task Type</p>
												</div>
												<div class="col-8">
													<p class="font-16 font-500 text-dark">{{ data.task_type }}</p>
												</div>
											</div>

											<div class="row mb-3">
												<div class="col-4">
													<p class="font-16 font-500 text-grey">Task Status</p>
												</div>
												<div class="col-8">
													<p class="font-16 font-500 text-dark">{{ data.task_status }}</p>
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
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
import { etaDetailMapsInit } from "../../views/Helper/MapFunction/etaDetailMapsInit.js";
import { siteSearchMarker, coverageSite } from "../../views/Data/GlobalData";
import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { toRaw } from "vue";

export default {
	name: "ModalFmeDetails",
	data() {
		return IndexData;
	},
	watch: {
		"globalProcess.store.fme.fmeDetailsSearch": function (newVal) {
			this.globalProcess.store.fme.fmeDetailsSearch = newVal;
		},
		"globalProcess.store.fme.woListFmeSearch": function (newVal) {
			this.globalProcess.store.fme.woListFmeSearch = newVal;
		},
		"globalProcess.store.fme.filteredWoListFmeSearch": function (newVal) {
			this.globalProcess.store.filteredWoListFmeSearch = newVal;
		}
	},
	computed: {
		fmeFilteredWoData() {
			const searchTerm = this.globalProcess.query.fme.woSearchQuery ? this.globalProcess.query.fme.woSearchQuery.toLowerCase().trim() : "";

			if (!this.globalProcess.store.fme.woListFmeSearch) {
				return [];
			}

			return this.globalProcess.store.fme.woListFmeSearch.filter((item) => {
				const matchesTaskType = this.globalProcess.checker.fme.fmeAll || (this.globalProcess.checker.fme.fmeCm && item.task_type === "CM") || (this.globalProcess.checker.fme.fmePm && item.task_type === "PM") || (this.globalProcess.checker.fme.fmePlm && item.task_type === "PLM");

				const matchesSearchQuery = !searchTerm || (item.title && item.title.toLowerCase().includes(searchTerm)) || (item.ticket_id && item.ticket_id.toLowerCase().includes(searchTerm)) || (item.wo_id && item.wo_id.toLowerCase().includes(searchTerm));

				return matchesTaskType && matchesSearchQuery;
			});
		}
	},
	methods: {
		copyWoIdFme(woId) {
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
						title: "WO ID copied to clipboard",
						showConfirmButton: false,
						timer: 1200
					});
				});
		},
		copyTicketIdFme(ticketId) {
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
						title: "Ticket ID copied to clipboard",
						showConfirmButton: false,
						timer: 1200
					});
				});
		},
		async openEtaModal(woId) {
			const ticketDetails = this.globalProcess.store.fme.woListFmeSearch.find((item) => item.wo_id === woId);
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

		async selectSiteById(siteid, power, lat, lon) {
			// CLOSE MODAL
			this.$refs.closeFmeDetails.click();

			if (lat !== "" && lon !== "") {
				var coord = { lat: parseFloat(lat), lng: parseFloat(lon) };
			}
			this.globalProcess.store.maps.backgroundMaps.panTo(coord);
			this.globalProcess.store.maps.backgroundMaps.setZoom(10);

			coverageSite = new HWMapJsSDK.HWCircle({
				map: this.globalProcess.store.maps.backgroundMaps,
				center: coord, // LatLng object
				radius: 12000, // in meters
				fillColor: "rgba(237, 109, 0, 0.1)",
				strokeColor: "rgba(237, 109, 0, 0.8)",
				strokeWeight: 2
			});

			if (siteSearchMarker != null) {
				toRaw(siteSearchMarker).setMap(null);
			}

			siteSearchMarker = new HWMapJsSDK.HWMarker({
				map: this.globalProcess.store.maps.backgroundMaps,
				position: coord,
				zIndex: 10,
				icon: {
					scale: 0.15,
					url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/site-search-res.png"
				}
			});

			MessageProcessor.process({
				serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_site_by_id",
				data: {
					site_id: siteid
				},
				showErrorMessage: false,
				success: (json) => {
					var getSiteInfo;
					getSiteInfo = json.results;
					this.globalProcess.store.site.information.siteItem = getSiteInfo;

					siteSearchMarker.addListener("click", async () => {
						this.globalProcess.state.component.siteDetailsLoading = true;
						var alarmListSearch = [];
						var powerListSearch = [];
						var alarmIdListSearch = "";
						MessageProcessor.process({
							serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_list_alarm_by_site",
							data: {
								power: power,
								siteid: siteid
							},
							showErrorMessage: false,
							success: (json) => {
								alarmListSearch = json.results;
								powerListSearch = json.power;
								// SITE NAME GET FROM HERE site_name
								for (var i = 0; i < alarmListSearch.length; i++) {
									if (i != alarmListSearch.length - 1) {
										alarmIdListSearch += "'" + alarmListSearch[i].alarmid + "',";
									} else {
										alarmIdListSearch += "'" + alarmListSearch[i].alarmid + "'";
									}
								}
								for (var i = 0; i < powerListSearch.length; i++) {
									if (i != powerListSearch.length - 1) {
										alarmIdListSearch += "'" + powerListSearch[i].alarmid + "',";
									} else {
										alarmIdListSearch += "'" + powerListSearch[i].alarmid + "'";
									}
								}
								if (alarmIdListSearch == "" || alarmIdListSearch == null || alarmIdListSearch == undefined || alarmListSearch.length == 0) {
									const modalElement = document.getElementById("siteDetails");
									if (modalElement) {
										const siteDetailsModal = new bootstrap.Modal(modalElement, {
											backdrop: "static"
										});
										siteDetailsModal.show();
										this.globalProcess.state.component.siteDetailsLoading = false;
									} else {
										this.globalProcess.state.component.siteDetailsLoading = false;
										console.error("Modal element with ID 'siteDetails' not found.");
									}
								} else {
									var ticketListSearch = [];
									MessageProcessor.process({
										serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_list_ticket",
										data: {
											start: 0,
											limit: 3,
											siteid: siteid,
											alarmid: alarmIdListSearch
										},
										showErrorMessage: false,
										success: (json) => {
											ticketListSearch = json.results;

											for (let i = 0; i < this.siteAlarmListSearch.length; i++) {
												const timestamp = this.siteAlarmListSearch[i].lastoccurrence;
												const date = new Date(timestamp);
												const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
													.getSeconds()
													.toString()
													.padStart(2, "0")}`;
												this.siteAlarmListSearch[i].lastoccurrence = formattedDate;
											}

											for (let i = 0; i < this.powerAlarmListSearch.length; i++) {
												const timestamp = this.powerAlarmListSearch[i].lastoccurrence;
												const date = new Date(timestamp);
												const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
													.getSeconds()
													.toString()
													.padStart(2, "0")}`;
												this.powerAlarmListSearch[i].lastoccurrence = formattedDate;
											}

											this.globalProcess.store.site.alarm.siteAlarmList = alarmListSearch;
											this.globalProcess.store.site.alarm.powerAlarmList = powerListSearch;
											this.siteTicketListSearch = ticketListSearch;

											if (this.siteAlarmListSearch != null || this.siteTicketListSearch != null) {
												const modalElement = document.getElementById("siteDetails");
												if (modalElement) {
													const siteDetailsModal = new bootstrap.Modal(modalElement, {
														backdrop: "static"
													});
													siteDetailsModal.show();
													this.globalProcess.state.component.siteDetailsLoading = false;
												} else {
													this.globalProcess.state.component.siteDetailsLoading = false;
													console.error("Modal element with ID 'siteDetails' not found.");
												}
											}
											this.globalProcess.state.component.siteDetailsLoading = false;
										},
										error: (error) => {
											this.globalProcess.state.component.siteDetailsLoading = false;
											console.error(error, "error site down layer");
										}
									});
								}
							},
							error: (error) => {
								this.globalProcess.state.component.siteDetailsLoading = false;
								console.error(error, "json ALARM GET LIST");
							}
						});
					});
				}
			});
		}
	}
};
</script>

<style>
.row-ticket-list {
	max-height: 300px;
	height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
}

.overflow-break {
	max-width: 100%;
	overflow-wrap: break-word;
}
</style>
