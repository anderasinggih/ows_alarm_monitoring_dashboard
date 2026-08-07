<template>
	<div class="row d-flex flex-row justify-content-between mb-3">
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
										<input class="form-check-input" type="checkbox" value="" v-model="pg.store.fme.fmePgOnlyAll" />
										<label class="form-check-label" for="flexCheckDefault"> All </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" v-model="pg.store.fme.fmePgOnlyCm" />
										<label class="form-check-label" for="flexCheckDefault"> CM </label>
									</div>
								</a>
							</li>
							<li>
								<a class="dropdown-item">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" v-model="pg.store.fme.fmePgOnlyPlm" />
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
						<input type="text" class="form-control search-global-input" id="searchGlobalInput" aria-describedby="searchGlobal" aria-label="Upload" placeholder="Search Task" v-model="pg.store.fme.woPgSearchQuery" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row row-ticket-list mb-3 row-gap-12 justify-content-unset">
		<div class="col-12" v-if="fmePgOnlyFilteredWoData == null || fmePgOnlyFilteredWoData == undefined || fmePgOnlyFilteredWoData.length == 0">
			<p class="text-center font-600 font-18 mt-4 mb-4">{{ this.pg.store.fme.fmePgWoMessage }}</p>
		</div>
		<div class="col-4" v-else v-for="data in fmePgOnlyFilteredWoData" :key="data.wo_id">
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
									<a data-bs-dismiss="modal" class="font-16 font-600 text-ioh text-decor-underline c-pointer" @click="selectSiteById(data.site_id_name, this.siteDown.apiParams.powerAlarm, data.site_lat, data.site_lon)">
										{{ data.site_id_name }}
									</a>
								</div>
							</div>

							<div v-if="data.task_type == 'CM'" class="row mb-2">
								<div class="col-4">
									<p class="font-16 font-500 text-grey">Title</p>
								</div>
								<div class="col-8 overflow-break">
									<p class="font-16 font-500 text-dark">{{ data.title }}</p>
								</div>
							</div>

							<div v-if="data.task_type == 'CM'" class="row mb-2">
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
</template>
<script>
import { IndexData } from "../../../views/Data/IndexData";
import { etaTaskDetailPgTrackingMapsInit } from "../../../views/Helper/MapFunction/etaTaskDetailPgTrackingMapsInit";
import { getPgTaskDetail } from "../../../views/Api/countingPg/getPgTaskDetail";
import { siteSearchMarker } from "../../../views/Data/GlobalData";
import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { toRaw } from "vue";

export default {
	name: "TabContentFmeWoPg",
	data() {
		return IndexData;
	},
	watch: {
		"pg.store.fme.filteredWoList": function (newVal) {
			this.pg.store.fme.filteredWoList = newVal;
		},
		"pg.store.fme.filteredWoListPg": function (newVal) {
			this.pg.store.fme.filteredWoListPg = newVal;
		}
	},
	computed: {
		fmePgOnlyFilteredWoData() {
			const searchTerm = this.pg.store.fme.woPgSearchQuery ? this.pg.store.fme.woPgSearchQuery.toLowerCase().trim() : "";

			if (!this.pg.store.fme.woPgList) {
				return [];
			}

			return this.pg.store.fme.woPgList.filter((item) => {
				const matchesTaskType = this.pg.store.fme.fmePgOnlyAll || (this.pg.store.fme.fmePgOnlyCm && item.task_type === "CM") || (this.pg.store.fme.fmePgOnlyPlm && item.task_type === "PLM");

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
			this.globalProcess.state.component.loadingEtaDataPg = true;

			const ticketDetails = this.pg.store.fme.woPgList.find((item) => item.wo_id === woId);

			getPgTaskDetail(ticketDetails.wo_id)
				.then(({ res }) => {
					const now = new Date();

					const options = {
						day: "numeric",
						month: "long",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit"
					};

					const formattedDateTime = now.toLocaleString("en-US", options).replace(",", "");

					this.pg.state.fme.fmePgModalLastUpdated = formattedDateTime;

					this.pg.store.ticket.getSingleTicket = res;

					const originData = { lat: parseFloat(res.site_lat), lng: parseFloat(res.site_lon) };
					const destinationData = { lat: parseFloat(res.fme_lat), lng: parseFloat(res.fme_lon) };

					const modalElement = document.getElementById("pgTrackingDetails");
					if (modalElement) {
						const etaDetails = new bootstrap.Modal(modalElement, {
							backdrop: "static"
						});

						this.pg.state.component.pg += 1;

						this.globalProcess.state.component.loadingEtaDataPg = false;

						etaDetails.show();
					} else {
						console.error("Modal element with ID 'etaDetails' not found.");
					}

					this.pg.state.fme.pgStateEta = this.pg.store.ticket.getSingleTicket.pg_status;

					if (this.pg.state.fme.pgStateEta == "pg_movement") {
						this.pg.state.fme.titleStatus = "PG Movement";
					} else if (this.pg.state.fme.pgStateEta == "pg_installed") {
						this.pg.state.fme.titleStatus = "PG Installed";
					} else {
						this.pg.state.fme.titleStatus = "ETA Details";
					}

					etaTaskDetailPgTrackingMapsInit(originData, destinationData);
				})
				.catch(console.error);
		},

		async selectSiteById(siteid, power, lat, lon) {
			if (lat !== "" && lon !== "") {
				var coord = { lat: parseFloat(lat), lng: parseFloat(lon) };
			}
			this.globalProcess.store.maps.backgroundMaps.panTo(coord);
			this.globalProcess.store.maps.backgroundMaps.setZoom(13);

			// coverageSite = new HWMapJsSDK.HWCircle({
			// 	map: this.globalProcess.store.maps.backgroundMaps,
			// 	center: coord, // LatLng object
			// 	radius: 12000, // in meters
			// 	fillColor: "rgba(237, 109, 0, 0.1)",
			// 	strokeColor: "rgba(237, 109, 0, 0.8)",
			// 	strokeWeight: 2
			// });

			if (siteSearchMarker != null) {
				toRaw(siteSearchMarker).setMap(null);
			}

			siteSearchMarker = new HWMapJsSDK.HWMarker({
				map: this.globalProcess.store.maps.backgroundMaps,
				position: coord,
				zIndex: 20,
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
