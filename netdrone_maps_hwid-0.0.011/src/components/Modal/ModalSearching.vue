<template>
	<div class="modal fade" id="searchingModal" aria-hidden="true" aria-labelledby="modalSearchingNetdrone" tabindex="-1">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="d-flex justify-content-between">
						<h3 class="font-700 text-dark mb-4">Search</h3>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
					</div>
					<div class="input-group">
						<span class="input-group-text"><i class="bi bi-search font-700"></i></span>
						<input type="text" class="form-control search-global-input" v-model="this.modalSearchQuery" @keyup.enter="modalGetSearch(this.modalSearchQuery)" id="searchGlobalInput" aria-describedby="searchGlobal" aria-label="Upload" placeholder="Search" />
						<button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="modalGetSearch(this.modalSearchQuery)">
							<i class="bi bi-search"></i>
							Search
						</button>
					</div>
					<ul class="nav nav-underline mt-2" id="myTab" role="tablist">
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button
								:class="this.globalProcess.state.tab.selectedOption != 'coreRouter' ? 'nav-link active' : 'nav-link'"
								id="quick-access-tab"
								data-bs-toggle="tab"
								data-bs-target="#quick-access-tab-pane"
								type="button"
								role="tab"
								aria-controls="quick-access-tab-pane"
								aria-selected="false"
							>
								QUICK ACCESS
							</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="all-search-tab" data-bs-toggle="tab" data-bs-target="#all-search-tab-pane" ref="allSearch" type="button" role="tab" aria-controls="all-search-tab-pane" aria-selected="true">ALL SEARCH</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="mc-cluster-tab" data-bs-toggle="tab" data-bs-target="#mc-cluster-pane" ref="mcCluster" type="button" role="tab" aria-controls="mc-cluster-pane" aria-selected="false">MC CLUSTER</button>
						</li>
						<li class="nav-item" role="presentation">
							<button :class="this.globalProcess.state.tab.selectedOption != 'coreRouter' ? 'nav-link' : 'nav-link active'" id="site-tab" data-bs-toggle="tab" data-bs-target="#site-tab-pane" ref="siteTab" type="button" role="tab" aria-controls="site-tab-pane" aria-selected="false">
								SITE
							</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="fme-tab" data-bs-toggle="tab" data-bs-target="#fme-tab-pane" ref="fmeTab" type="button" role="tab" aria-controls="fme-tab-pane" aria-selected="false">FME</button>
						</li>
					</ul>
					<div class="tab-content" id="myTabContent">
						<!-- QUICK ACCESS -->

						<TabContentQuickAccess :isCoreRouter="this.coreRouter.state.isCoreRouterTab" :onClick="selectSiteById" :dataInput="this.globalProcess.store.searching.siteQuickAccess" />

						<!-- ALL SEARCH -->
						<TabContentAllSearch
							:loading="this.globalProcess.state.component.searchingLoading"
							:mcClusterSearchResult="this.globalProcess.store.searching.mcClusterSearchResult"
							:siteSearchResult="this.globalProcess.store.searching.siteSearchResult"
							:fmeSearchResult="this.globalProcess.store.searching.fmeSearchResult"
							:emptyMcClusterMessage="this.globalProcess.store.searching.emptyClusterMessage"
							:emptySiteMessage="this.globalProcess.store.searching.emptySiteMessage"
							:emptyFmeMessage="this.globalProcess.store.searching.emptyFmeMessage"
							:clusterData="this.globalProcess.store.searching.clusterData"
							:siteData="this.globalProcess.store.searching.siteData"
							:fmeData="this.globalProcess.store.searching.fmeData"
							:selectMcById="selectMcClusterById"
							:selectSiteById="selectSiteById"
							:selectFmeById="selectFmeById"
							:activateTab="activateTab"
						/>

						<!-- MC SEARCH -->
						<TabContentMcClusterSearch
							:loading="this.globalProcess.state.component.searchingLoading"
							:mcClusterSearchResult="this.globalProcess.store.searching.mcClusterSearchResult"
							:emptyMcClusterMessage="this.globalProcess.store.searching.emptyClusterMessage"
							:clusterData="this.globalProcess.store.searching.clusterData"
							:selectMcById="selectMcClusterById"
							:activateTab="activateTab"
						/>

						<!-- SITE SEARCH -->
						<TabContentSiteSearch
							:isCoreRouter="this.coreRouter.state.isCoreRouterTab"
							:loading="this.globalProcess.state.component.searchingLoading"
							:siteSearchResult="this.globalProcess.store.searching.siteSearchResult"
							:emptySiteMessage="this.globalProcess.store.searching.emptySiteMessage"
							:siteData="this.globalProcess.store.searching.siteData"
							:selectSiteById="selectSiteById"
							:activateTab="activateTab"
						/>

						<!-- FME SEARCH -->
						<TabContentFmeSearch
							:loading="this.globalProcess.state.component.searchingLoading"
							:fmeSearchResult="this.globalProcess.store.searching.fmeSearchResult"
							:emptyFmeMessage="this.globalProcess.store.searching.emptyFmeMessage"
							:fmeData="this.globalProcess.store.searching.fmeData"
							:selectFmeById="selectFmeById"
							:activateTab="activateTab"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { toRaw } from "vue";
import { siteSearchMarker, coverageFme, fmeSearchMarker, coverageMcCluster } from "../../views/Data/GlobalData";

// API
import { getMcClusterSearch } from "../../views/Api/searching/getMcClusterSearch.js";
import { getFmeNameSearch } from "../../views/Api/searching/getFmeNameSearch.js";
import { getSiteNameSearch } from "../../views/Api/searching/getSiteNameSearch.js";
import { getSelectedMcCluster } from "../../views/Api/marker/getSelectedMcCluster.js";

// FUNCTION
import { addLayerMarker } from "../../views/Helper/MarkerFunction/addLayerMarker.js";
import { backgroundMapsPanZoom } from "../../views/Helper/MapFunction/backgroundMapsPanZoom.js";

// DATA
import { IndexData } from "../../views/Data/IndexData";

// TAB CONTENT
import TabContentQuickAccess from "../TabContent/SearchingModal/TabContentQuickAccess.vue";
import TabContentAllSearch from "../TabContent/SearchingModal/TabContentAllSearch.vue";
import TabContentMcClusterSearch from "../TabContent/SearchingModal/TabContentMcClusterSearch.vue";
import TabContentSiteSearch from "../TabContent/SearchingModal/TabContentSiteSearch.vue";
import TabContentFmeSearch from "../TabContent/SearchingModal/TabContentFmeSearch.vue";

export default {
	name: "ModalSearching",
	components: {
		TabContentQuickAccess,
		TabContentAllSearch,
		TabContentMcClusterSearch,
		TabContentSiteSearch,
		TabContentFmeSearch
	},
	props: {
		searchQuery: {
			type: String,
			default: undefined
		},
		searchState: {
			type: Number,
			default: 0
		}
	},
	data() {
		return IndexData;
	},
	watch: {
		searchQuery(newVal) {
			this.globalProcess.state.searching.queryToSearch = newVal;
		},
		searchState(newVal, oldVal) {
			this.globalProcess.state.searching.queryState = newVal;
			if (this.globalProcess.state.searching.queryState != oldVal) {
				this.modalGetSearch(this.globalProcess.state.searching.queryToSearch);
			}
		}
	},
	methods: {
		activateTab(tabId) {
			this.$refs[tabId].click();
		},
		handleEscape(event) {
			if (event.key === "Escape" || event.keyCode === 27) {
				this.removeBackdrop();
			}
		},
		removeBackdrop() {
			var backdrops = document.getElementsByClassName("modal-backdrop fade show");
			Array.from(backdrops).forEach(function (backdrop) {
				backdrop.classList.remove("modal-backdrop");
				backdrop.classList.remove("fade");
				backdrop.classList.remove("show");
			});
		},

		async selectMcClusterById(lat, lon, siteName) {
			// SHOW CLEAR SEARCH
			this.globalProcess.state.searching.clearSearchBtn = true;

			// UPDATE COUNTING ON CARD
			this.globalProcess.apiParams.mcClusterData = siteName;

			this.componentState = this.componentState + 1;

			// SET ROUNDED COVERAGE
			var coord = { lat: parseFloat(lat), lng: parseFloat(lon) };

			if (coverageMcCluster != null) {
				coverageMcCluster.setMap(null);
			}

			coverageMcCluster = new HWMapJsSDK.HWCircle({
				map: this.globalProcess.store.maps.backgroundMaps,
				center: coord,
				radius: 7000, // in meters
				fillColor: "rgba(237, 109, 0, 0.1)",
				strokeColor: "rgba(237, 109, 0, 0.8)",
				strokeWeight: 2
			});

			this.globalProcess.store.maps.backgroundMaps.panTo(coord);
			this.globalProcess.store.maps.backgroundMaps.setZoom(10);

			await getSelectedMcCluster(siteName)
				.then(({ res }) => {
					try {
						res.forEach((data) => {
							data.latitude = parseFloat(data.latitude);
							data.longitude = parseFloat(data.longitude);
						});
					} catch (error) {
						console.error(error);
					} finally {
						this.globalProcess.marker.selectMcClusterById.data = res;
						addLayerMarker(this.globalProcess.marker.selectMcClusterById);
					}
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		},

		formatTimestamp(timestamp) {
			const date = new Date(timestamp);
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
		},

		async selectSiteById(resultLat, resultLng, src, siteid, sitename, getSiteClass, getFiveReg, getCircle, getVipSite, getHubType, getSiteCat, getSiteAddr) {
			// SHOW CLEAR SEARCH
			this.globalProcess.state.searching.clearSearchBtn = true;
			this.dwdm.state.isDwdmSite = false;
			this.pg.state.component.isPgSite = false;
			this.coreRouter.state.isCoreRouterSite = false;

			var sitedetailitem = {
				site_name: sitename,
				title: siteid,
				site_class: getSiteClass,
				five_region: getFiveReg,
				circle: getCircle,
				is_vip: getVipSite,
				hub_type: getHubType,
				site_category: getSiteCat,
				site_address: getSiteAddr
			};

			this.globalProcess.store.site.information.siteItem = sitedetailitem;
			this.siteItemSearch.siteid = siteid.toString();
			this.siteItemSearch.sitename = sitename.toString();
			if (resultLat !== "" && resultLng !== "") {
				var coord = { lat: parseFloat(resultLat), lng: parseFloat(resultLng) };
			}

			backgroundMapsPanZoom(coord.lat, coord.lng, 10);

			if (siteSearchMarker != null) {
				toRaw(siteSearchMarker).setMap(null);
			}

			siteSearchMarker = new HWMapJsSDK.HWMarker({
				map: this.globalProcess.store.maps.backgroundMaps,
				position: { lat: parseFloat(resultLat), lng: parseFloat(resultLng) },
				zIndex: 10,
				icon: {
					scale: 0.15,
					url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/site-search-res.png"
				}
			});

			siteSearchMarker.addListener("click", async () => {
				this.loading = true;
				var alarmIdList = "";
				var tabOption = this.globalProcess.state.tab.selectedOption;
				this.getAlarmList(siteid)
					.then(({ getAlarmList, getAlarmPowerList }) => {
						for (var i = 0; i < getAlarmList.length; i++) {
							if (i != getAlarmList.length - 1) {
								alarmIdList += "'" + getAlarmList[i].alarmid + "',";
							} else {
								alarmIdList += "'" + getAlarmList[i].alarmid + "'";
							}
						}

						for (var i = 0; i < getAlarmPowerList.length; i++) {
							if (i != getAlarmPowerList.length - 1) {
								alarmIdList += "'" + getAlarmPowerList[i].alarmid + "',";
							} else {
								alarmIdList += "'" + getAlarmPowerList[i].alarmid + "'";
							}
						}

						if (tabOption === "dwdmCheckTab") {
							this.pg.state.component.isPgSite = false;
							this.dwdm.state.isDwdmSite = true;

							this.getDwdmAlarmList(siteid)
								.then(({ powerDwdm, unmanagedDwdm }) => {
									this.globalProcess.store.site.alarm.powerAlarmList = powerDwdm.map((power) => ({ ...power, lastoccurrence: this.formatTimestamp(power.lastoccurrence) }));
									this.globalProcess.store.site.alarm.dwdmAlarmList = unmanagedDwdm.map((dwdm) => ({ ...dwdm, lastoccurrence: this.formatTimestamp(dwdm.lastoccurrence) }));
								})
								.catch(console.error);
						}

						if (alarmIdList == "" || alarmIdList == null || alarmIdList == undefined) {
							this.showSiteDetailModal();
						}

						this.getTicketList(siteid)
							.then(({ ticketList }) => {
								this.globalProcess.store.site.alarm.siteAlarmList = getAlarmList;

								for (let i = 0; i < this.globalProcess.store.site.alarm.siteAlarmList.length; i++) {
									const timestamp = this.globalProcess.store.site.alarm.siteAlarmList[i].lastoccurrence;
									const date = new Date(timestamp);
									const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
										.getSeconds()
										.toString()
										.padStart(2, "0")}`;
									this.globalProcess.store.site.alarm.siteAlarmList[i].lastoccurrence = formattedDate;
								}

								this.globalProcess.store.site.ticket.siteTicketList = ticketList;
								this.globalProcess.store.site.alarm.powerAlarmList = getAlarmPowerList;
								console.log(this.globalProcess.store.site.alarm.powerAlarmList, "power alarm list site searcb");

								this.globalProcess.store.site.alarm.powerAlarmList.forEach((item) => {
									item.lastoccurrence = this.formatTimestamp(item.lastoccurrence);
									item.firstoccurrence = this.formatTimestamp(item.firstoccurrence);
								});
								console.log(this.globalProcess.store.site.alarm.powerAlarmList, "power alarm list site searcb");
								if (tabOption === "pgTracking") {
									this.pg.state.component.isPgSite = true;
									this.dwdm.state.isDwdmSite = false;

									this.getPgTicketList(siteid)
										.then(({ pgTicketList }) => {
											this.globalProcess.store.site.ticket.sitePgTicketList = pgTicketList;
											this.showSiteDetailModal();
										})
										.catch(console.error, (this.loading = false));
								} else if (tabOption === "dwdmCheckTab") {
									this.pg.state.component.isPgSite = false;
									this.dwdm.state.isDwdmSite = true;
									this.getDwdmTicketList(siteid)
										.then(({ dwdmTicketList }) => {
											this.globalProcess.store.site.ticket.siteDwdmTicketList = dwdmTicketList;
											this.showSiteDetailModal();
										})
										.catch(console.error, (this.loading = false));
								} else {
									this.pg.state.component.isPgSite = false;
									this.dwdm.state.isDwdmSite = false;
									this.showSiteDetailModal();
								}
							})
							.catch(console.error);
					})
					.catch(console.error);
			});
		},

		async selectFmeById(data, ref) {
			ref = this;
			// SHOW CLEAR SEARCH
			this.globalProcess.state.searching.clearSearchBtn = true;

			if (data.lat !== "" && data.lon !== "") {
				var coord = { lat: parseFloat(data.lat), lng: parseFloat(data.lon) };
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
						user_id: data.username
					},
					showErrorMessage: false,
					success: (json) => {
						fmeDetail = json.result;
						try {
							MessageProcessor.process({
								serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
								data: {
									user_id: data.user_id,
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
		},

		async modalGetSearch(searchQuery) {
			if (this.coreRouter.state.isCoreRouterTab == false) {
				this.$refs.allSearch.click();
			} else {
				this.$refs.siteTab.click();
			}
			var queryLength = searchQuery.toString().length;

			if (queryLength != 0) {
				this.globalProcess.state.component.searchingLoading = true;
				// HIT MC CLUSTER
				await getMcClusterSearch(searchQuery)
					.then(({ res }) => {
						this.globalProcess.store.searching.mcClusterSearchResult = res;
						if (this.globalProcess.store.searching.mcClusterSearchResult.length != 0) {
							this.globalProcess.store.searching.clusterData = res.slice(0, 5);
						} else {
							this.globalProcess.store.searching.emptyClusterMessage = "No result found";
						}
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});

				// HIT SITE SEARCH
				await getSiteNameSearch(searchQuery)
					.then(({ res }) => {
						this.globalProcess.store.searching.siteSearchResult = res;
						if (res.length != 0) {
							this.globalProcess.store.searching.siteData = res.slice(0, 5);
						} else {
							this.globalProcess.store.searching.emptyClusterMessage = "No result found";
						}
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});
				// HIT FME NAME

				await getFmeNameSearch(searchQuery, searchQuery)
					.then(({ res }) => {
						this.globalProcess.store.searching.fmeSearchResult = res;
						if (res.length != 0) {
							this.globalProcess.store.searching.fmeData = res.slice(0, 5);
						} else {
							this.globalProcess.store.searching.emptyClusterMessage = "No result found";
						}
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
					});

				this.globalProcess.state.component.searchingLoading = false;
			}
		},

		// MODAL
		showSiteDetailModal() {
			const modalElement = document.getElementById("siteDetails");
			if (modalElement) {
				const siteDetailsModal = new bootstrap.Modal(modalElement, {
					backdrop: "static"
				});
				siteDetailsModal.show();
			} else {
				console.error("Modal element with ID 'siteDetails' not found.");
			}
		},

		// API FUNCTION
		async dwdmGetListAlarm(power, hubType, vip, mcCluster, mcClusterFilter) {
			return new Promise((resolve, reject) => {
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_count_site_down_cell_down_aging_by_region",
					data: {
						hub_type: hubType,
						power: power,
						is_vip: vip,
						mc_cluster_search: mcCluster,
						mc_cluster: mcClusterFilter
					},
					showErrorMessage: false,
					success: (json) => {
						resolve({ res: json.results });
					},
					error: (error) => {
						console.error(error, "error region site down count");
						reject(error);
					}
				});
			});
		},

		async getAlarmList(siteId) {
			return new Promise((resolve, reject) => {
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_list_alarm_by_site",
					data: { siteid: siteId },
					showErrorMessage: false,
					success: (json) => {
						resolve({
							getAlarmList: json.results,
							getAlarmPowerList: json.power
						});
					},
					error: reject
				});
			});
		},

		async getDwdmAlarmList(siteId) {
			return new Promise((resolve, reject) => {
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_dwdm_alarm_list_by_site_id",
					data: { siteid: siteId },
					showErrorMessage: false,
					success: (json) => {
						resolve({
							powerDwdm: json.results.power,
							unmanagedDwdm: json.results.unmanaged
						});
					},
					error: reject
				});
			});
		},

		async getTicketList(siteId) {
			return new Promise((resolve, reject) => {
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
					data: {
						site_id: siteId,
						task_status: ["dispatched", "completed", "scheduled", "inprocess", "accepted"]
					},
					showErrorMessage: false,
					success: (json) => {
						resolve({
							ticketList: json.results
						});
					},
					error: reject
				});
			});
		},

		async getPgTicketList(siteId) {
			return new Promise((resolve, reject) => {
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
					data: {
						site_id: siteId,
						user_id: "",
						update_description: "PGB",
						task_status: ["dispatched", "scheduled", "inprocess", "accepted", "completed"]
					},
					showErrorMessage: false,
					success: (json) => {
						resolve({
							pgTicketList: json.results
						});
					},
					error: reject
				});
			});
		},

		async getDwdmTicketList(siteId) {
			return new Promise((resolve, reject) => {
				MessageProcessor.process({
					serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list_for_dwdm",
					data: {
						site_id: siteId,
						task_status: ["dispatched", "scheduled", "inprocess", "accepted"]
					},
					showErrorMessage: false,
					success: (json) => {
						resolve({
							dwdmTicketList: json.results
						});
					},
					error: reject
				});
			});
		}
	}
};
</script>

<style>
.input-group-text {
	background-color: white !important;
	border-right: none !important;
	border-radius: 8px 0px 0px 8px;
}

.search-global-input {
	border-left: none !important;
}

.btn-outline-secondary {
	background-color: #ed6d00;
	border: none;
	color: white !important;
	padding-left: 30px;
	padding-right: 30px;
}

.nav-underline {
	border-bottom: 1px solid #dcdddd;
}

.nav-underline .nav-link.active {
	border-bottom: 3px solid #ed6d00;
	color: #ed6d00;
}

.nav-underline .nav-link {
	color: #7d7d7d;
	padding: 15px 0px;
}

.btn-list-search {
	color: #000000;
}

.btn-list-search {
	cursor: pointer;
	transition: color 0.2s ease, text-decoration 0.2s ease;
}

.btn-list-search:hover {
	color: #ed6d00;
	font-weight: 600 !important;
}

.box-search-result {
	height: 450px;
	overflow-y: scroll;
	overflow-x: hidden;
}

.box-all-search-result {
	height: 550px;
	overflow-y: scroll;
	overflow-x: hidden;
}

.btn-list-search:hover .search-result-label {
	text-decoration: none !important;
	background-color: #ed6d00;
	color: white !important;
	font-weight: 600 !important;
	cursor: pointer;
	transition: color 0.2s ease;
}

.btn-list-search:hover .search-result-p {
	text-decoration: none !important;
	color: #ed6d00;
	font-weight: 600 !important;
	cursor: pointer;
	transition: color 0.2s ease;
}

.search-result-label {
	border: 1px solid #ed6d00;
	padding: 5px 16px;
	border-radius: 20px;
	color: #ed6d00;
}
</style>
