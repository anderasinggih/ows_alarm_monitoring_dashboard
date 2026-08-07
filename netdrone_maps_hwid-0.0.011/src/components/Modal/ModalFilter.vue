<template>
	<div class="modal fade zoom-filter" id="filterModal" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="d-flex justify-content-between">
						<h3 class="font-700 text-dark mb-4">Filters</h3>
						<button type="button" ref="filterModalDismiss" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
					</div>

					<hr />
					<div class="d-flex flex-column filter-scroll mb-3">
						<!-- yxl
						<h3 class="font-700 text-dark mb-3 font-22">Alarm Standard</h3>

						!-- Power Alarm --
						<h4 class="mt-3 mb-2 font-16 font-700">Power Alarm</h4>
						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkPowerAlarm($event)" v-model="siteDown.apiParams.powerAlarm" />
									<span class="text"> Power Alarm </span>
								</label>
							</div>
						</div>

						<hr />
						-->

						<h3 class="font-700 text-dark mb-3 font-22">Site Filters</h3>

						<!-- yxl Site Down -->
						<h4 class="mt-3 mb-2 font-16 font-700">Site Down</h4>
						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSiteDown($event)" v-model="siteDown.checker.siteDown.isSiteDown" />
									<span>
										<i class="ico font-14 font-normal">Down</i>
										Yes
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkNonSiteDown($event)" v-model="siteDown.checker.siteDown.nonSiteDown" />
									<span> No </span>
								</label>
							</div>
						</div>
						<h4 class="mt-3 mb-2 font-16 font-700">Time</h4>
						<div>
							<el-date-picker v-model="indexData.siteDown.start_time" align="right" type="datetime" placeholder="" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker> -
							<el-date-picker v-model="indexData.siteDown.end_time" align="right" type="datetime" placeholder="" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
						</div>
						<!--
						!-- Site Down --
						<h4 class="mt-3 mb-2 font-16 font-700">Power Alarm</h4>
						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkPowerAlarm($event)" v-model="siteDown.apiParams.powerAlarm" />
									<span class="text"> Power Alarm </span>
								</label>
							</div>
						</div>
						-->
						<!-- SITE TYPE -->
						<h4 class="mt-3 mb-2 font-16 font-700">Site Type</h4>
						<!-- yxl
						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkAllSiteType($event)" v-model="siteDown.checker.siteType.all" />
									<span> Normal </span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkN3tSiteType($event)" v-model="siteDown.checker.siteType.n3t" />
									<span> N3T </span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkUsoSiteType($event)" v-model="siteDown.checker.siteType.uso" />
									<span> USO </span>
								</label>
							</div>
						</div>
						-->
						<div class="d-flex flex-row gap-12">
							<VueMultiselect v-model="siteDown.selector.siteType.selectedOption" :options="siteDown.selector.siteType.option" placeholder="Select Site Type:" :allow-empty="true" track-by="site_type" label="site_type" :multiple="true" :taggable="true" select-label="">
								<template slot="singleLabel">
									<strong>{{ siteDown.selector.siteType.option.site_type }}</strong>
								</template>
							</VueMultiselect>
						</div>
						<!-- DURATION -->
						<h4 class="mt-3 mb-2 font-16 font-700">Down Duration</h4>
						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSites1Hr($event)" v-model="siteDown.checker.marker.oneHour" />
									<span>
										<i class="bi bi-square-fill" style="color: #0076ce"></i>
										Below 1 Hour
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSites14Hr($event)" v-model="siteDown.checker.marker.fourHour" />
									<span>
										<i class="bi bi-square-fill" style="color: #ed6d00"></i>
										1-4 Hour
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSites48Hr($event)" v-model="siteDown.checker.marker.eightHour" />
									<span>
										<i class="bi bi-square-fill" style="color: #ec008c"></i>
										4-8 Hour
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSites824Hr($event)" v-model="siteDown.checker.marker.twentyFourHour" />
									<span>
										<i class="bi bi-square-fill" style="color: #ed1c24"></i>
										8-24 Hour
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSites24Hr($event)" v-model="siteDown.checker.marker.moreDay" />
									<span>
										<i class="bi bi-square-fill" style="color: #313131"></i>
										Above 24 Hour
									</span>
								</label>
							</div>
						</div>

						<!-- HUB TYPE -->
						<h4 class="mt-3 mb-2 font-16 font-700">is Hub</h4>
						<!--
						<h4 class="mt-3 mb-2 font-16 font-700">Hub Type</h4>

						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkCoreHub($event)" v-model="siteDown.checker.hub.core" />
									<span>
										<i class="ico font-14 font-normal">C</i>
										Core Site
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkBigHub($event)" v-model="siteDown.checker.hub.big" />
									<span>
										<i class="ico font-14 font-normal">B</i>
										Big Hub Site
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkMediumHub($event)" v-model="siteDown.checker.hub.medium" />
									<span>
										<i class="ico font-14 font-normal">M</i>
										Medium Hub Site
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkSmallHub($event)" v-model="siteDown.checker.hub.small" />
									<span>
										<i class="ico font-14 font-normal">S</i>
										Small Hub Site
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkEndHub($event)" v-model="siteDown.checker.hub.end" />
									<span>
										<i class="ico font-14 font-normal">E</i>
										End Site
									</span>
								</label>
							</div>
						</div>
						-->

						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkCoreHub($event)" v-model="siteDown.checker.hub.isHub" />
									<span>
										<i class="ico font-14 font-normal">Hub</i>
										Yes
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkNonHub($event)" v-model="siteDown.checker.hub.nonHub" />
									<span> No </span>
								</label>
							</div>
						</div>

						<!-- VIP SITE -->
						<h4 class="mt-3 mb-2 font-16 font-700">VIP Site</h4>
						<div class="d-flex flex-row gap-12">
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkVip($event)" v-model="siteDown.checker.vip.isVip" />
									<span>
										<i class="ico font-14 font-normal">VIP</i>
										Yes
									</span>
								</label>
							</div>
							<div class="cat action">
								<label>
									<input type="checkbox" @change="checkNonVip($event)" v-model="siteDown.checker.vip.nonVip" />
									<span> No </span>
								</label>
							</div>
						</div>

						<h4 class="mt-3 mb-2 font-16 font-700">Location</h4>
						<div class="d-flex flex-row gap-12">
							<VueMultiselect v-model="siteDown.selector.area.selectedOption" :options="siteDown.selector.area.option" placeholder="Select Region" :allow-empty="true" track-by="region_name" label="region_name" :multiple="true" :taggable="true" select-label="">
								<template slot="singleLabel">
									<strong>{{ siteDown.selector.area.option.area_name }}</strong>
								</template>
							</VueMultiselect>
							<!-- yxl
							<VueMultiselect v-model="siteDown.selector.region.value" :options="siteDown.selector.region.option" placeholder="Select Circle" :allow-empty="true" track-by="area_name" label="area_name" select-label="">
								<template slot="singleLabel">
									<strong>{{ siteDown.selector.region.option.area_name }}</strong>
								</template>
							</VueMultiselect>
							<VueMultiselect v-model="siteDown.selector.area.selectedOption" :options="siteDown.selector.area.option" placeholder="Select Region" :allow-empty="true" track-by="area_name" label="area_name" :multiple="true" :taggable="true" @tag="addTagArea" select-label="">
								<template slot="singleLabel">
									<strong>{{ siteDown.selector.area.option.area_name }}</strong>
								</template>
							</VueMultiselect>
							<VueMultiselect v-model="siteDown.selector.mcCluster.selectedOption" :options="siteDown.selector.mcCluster.option" placeholder="Select MC Cluster" :allow-empty="true" track-by="area_name" label="area_name" :multiple="true" :taggable="true" @tag="addTag" select-label="">
								<template slot="singleLabel">
									<strong>{{ siteDown.selector.area.option.area_name }}</strong>
								</template>
							</VueMultiselect>
							-->
						</div>

						<!-- yxl
						<hr />
						<h3 class="font-700 text-dark mb-3 font-22">FME Filters</h3>

						!-- FME --
						<div class="row">
							<div class="col-7">
								<h4 class="mt-3 mb-2 font-16 font-700">FME Status</h4>
								<div class="d-flex flex-row gap-12">
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkFmeBusy($event)" v-model="this.siteDown.checker.fme.busy" />
											<span>
												<i class="bi bi-square-fill" style="color: #ed1c24"></i>
												Busy
											</span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkFmeIdle($event)" v-model="this.siteDown.checker.fme.idle" />
											<span>
												<i class="bi bi-square-fill" style="color: #089000"></i>
												Idle
											</span>
										</label>
									</div>
								</div>

								<h4 class="mt-3 mb-2 font-16 font-700">Supplier</h4>
								<div class="d-flex flex-row gap-12">
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdPmt($event)" v-model="this.obd.checker.supplier.pmt" />
											<span> PMT </span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdCcsi($event)" v-model="this.obd.checker.supplier.ccsi" />
											<span> CCSI </span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdNw($event)" v-model="this.obd.checker.supplier.nw" />
											<span> NW </span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdMku($event)" v-model="this.obd.checker.supplier.mku" />
											<span> MKU </span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdAdw($event)" v-model="this.obd.checker.supplier.adw" />
											<span> ADW </span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdPsd($event)" v-model="this.obd.checker.supplier.psd" />
											<span> PSD </span>
										</label>
									</div>
								</div>
							</div>
							<div class="col-5">
								<h4 class="mt-3 mb-2 font-16 font-700">Vehicle Status</h4>
								<div class="d-flex flex-row gap-12">
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdInactive($event)" v-model="this.obd.checker.vehicle.off" />
											<span>
												<i class="bi bi-square-fill" style="color: #ed1c24"></i>
												In-Active
											</span>
										</label>
									</div>
									<div class="cat action">
										<label>
											<input type="checkbox" @change="checkObdActive($event)" v-model="this.obd.checker.vehicle.supplier" />
											<span>
												<i class="bi bi-square-fill" style="color: #089000"></i>
												Active
											</span>
										</label>
									</div>
								</div>
							</div>
						</div>
						-->
					</div>
					<div class="d-flex flex-row gap-12 mt-3">
						<button class="btn btn-clear btn-clear-width" @click="handleClearFilter()">
							<span class="text">Clear Filter</span>
						</button>
						<button class="btn btn-apply btn-apply-width" @click="handleApplyFilter()" data-bs-dismiss="modal">
							<span class="text">Apply Filter</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

// DATA
import { IndexData } from "../../views/Data/IndexData";

// FUNCTION
import { addLayerMarker } from "../../views/Helper/MarkerFunction/addLayerMarker.js";
import { hideLayerMarker } from "../../views/Helper/MarkerFunction/hideLayerMarker";

// API
import { getSiteDownMarker } from "../../views/Api/marker/getSiteDownMarker";
import { getFmeMarker } from "../../views/Api/marker/getFmeMarker";
import { postMapsHit } from "../../views/Api/session/postMapsHit.js";

// COMPONENT
import VueMultiselect from "vue-multiselect";
import Multiselect from "vue-multiselect";
import { getMcClusterByFourCircle } from "../../views/Api/filterSelector/getMcClusterByFourCircle.js";
import { getRegionByCircle } from "../../views/Api/filterSelector/getRegionByCircle.js";
import { getSiteTypeData } from "../../views/Api/filterSelector/getSiteTypeData.js";
import { getObdVehicleMarkers } from "../../views/Api/markerObd/getObdVehicleMarkers.js";

import { getDurationRangeBreakdown } from "../../views/Api/counting/getDurationRangeBreakdown.js";
import { getTotalCell } from "../../views/Api/counting/getTotalCell.js";
import { getCountTtCorrelation } from "../../views/Api/counting/getCountTtCorrelation.js";
import { getCountTtCorrelationDetails } from "../../views/Api/counting/getCountTtCorrelationDetails.js";
import { getAllSiteDownDataTable } from "../../views/Api/counting/getAllSiteDownDataTable.js";
import { getSiteDownByHubType } from "../../views/Api/counting/getSiteDownByHubType";
import { getAllSiteDownNumByInitialRca } from "../../views/Api/counting/getAllSiteDownNumByInitialRca";
import { getCountByVendor } from "../../views/Api/counting/getCountByVendor.js";

import { DurationData } from "../../views/Data/DurationData";

export default {
	name: "ModalFilter",
	data() {
		return {
			...IndexData,
			indexData: IndexData,
			durationData: DurationData
		};
	},
	components: {
		VueMultiselect,
		Multiselect
	},
	async mounted() {
		await U.initCsrfToken();
		await this.getDataArea([]);
		await this.getSiteType([]);
		// await this.getDataMcCluster([], []);
		// 监听模态框显示事件
		const modalElement = document.getElementById("filterModal");
		if (modalElement) {
			modalElement.addEventListener("show.bs.modal", async () => {
				await this.getDataArea([]);
				await this.getSiteType([]);
			});
		}
	},
	beforeDestroy() {
		// 清理事件监听器
		const modalElement = document.getElementById("filterModal");
		if (modalElement) {
			modalElement.removeEventListener("show.bs.modal", this.handleModalShow);
		}
	},
	watch: {
		// "siteDown.selector.region.value": function (newVal) {
		// 	if (newVal != null) {
		// 		this.siteDown.selector.region.selectedOption = newVal.area_name;
		// 		this.handleItemSelectedRegion(newVal.area_name, newVal.lat, newVal.lon, newVal.zoom);
		// 		this.getDataArea([this.siteDown.selector.region.selectedOption]);
		// 		this.getDataMcCluster([this.siteDown.selector.region.selectedOption], []);
		// 	} else {
		// 		this.siteDown.selector.area.option = [];
		// 		this.siteDown.selector.area.selectedOption = [];
		// 		this.handleItemClearedRegion();
		// 		this.getDataArea([]);
		// 		this.getDataMcCluster([], []);
		// 	}
		// },
		// "siteDown.selector.area.selectedOption": function (newVal, oldVal) {
		// 	if (newVal.length > 20) {
		// 		this.$swal({
		// 			icon: "warning",
		// 			title: "Selection Limit Reached",
		// 			text: "You've reached the maximum selection of Region",
		// 			showConfirmButton: false,
		// 			timer: 1200
		// 		});
		// 		this.siteDown.selector.area.selectedOption = oldVal;
		// 		return;
		// 	}
		// 	this.updateSelectedArea(newVal);
		// },
		// "siteDown.selector.mcCluster.selectedOption": function (newVal, oldVal) {
		// 	if (newVal.length > 20) {
		// 		this.$swal({
		// 			icon: "warning",
		// 			title: "Selection Limit Reached",
		// 			text: "You've reached the maximum selection of MC Cluster",
		// 			showConfirmButton: false,
		// 			timer: 1200
		// 		});
		// 		this.siteDown.selector.mcCluster.selectedOption = oldVal;
		// 		return;
		// 	}
		// 	this.updateSelectedMcCluster(newVal);
		// }
	},
	props: {
		// 定义处理函数
		async handleModalShow() {
			await this.getDataArea([]);
			await this.getSiteType([]);
		},
		mcCluster(newVal) {
			this.globalProcess.query.mc.searchQuery = newVal;
			this.handleApplyFilter();
		}
	},
	methods: {
		// APPLY FILTER
		async handleApplyFilter() {
			if (this.globalProcess.state.component.applyFilterLoading == false && this.globalProcess.state.component.siteDownDataLoading == false && this.globalProcess.state.component.siteDownMarkerLoading == false) {
				if (this.refetch != true) {
					this.globalProcess.state.component.applyFilterLoading = true;
					// if (this.siteDown.selector.region.selectedOption != "") {
					// 	var coord = { lat: parseFloat(this.siteDown.selector.region.selectedLat), lng: parseFloat(this.siteDown.selector.region.selectedLon) };

					// 	this.siteDown.component.regionApply = true;

					// 	this.globalProcess.store.maps.backgroundMaps.panTo(coord);
					// 	this.globalProcess.store.maps.backgroundMaps.setZoom(parseFloat(this.siteDown.selector.region.selectedZoom));

					// 	if (this.siteDown.selector.area.value.length != 0) {
					// 		this.siteDown.component.areaApply = true;

					// 		if (this.siteDown.selector.mcCluster.value.length != 0) {
					// 			this.siteDown.component.mcApply = true;
					// 		}
					// 	}

					// 	if (this.siteDown.selector.area.value.length == 0) {
					// 		this.siteDown.component.areaApply = false;

					// 		if (this.siteDown.selector.mcCluster.value.length != 0) {
					// 			this.siteDown.component.mcApply = true;
					// 		}
					// 	}
					// }

					try {
						// ----------------------------------------------------------------------------------------
						// SITEDOWN
						const siteDownMarkerConfigs = [
							{ check: this.siteDown.checker.marker.oneHour, param: "1" },
							{ check: this.siteDown.checker.marker.fourHour, param: "1_4" },
							{ check: this.siteDown.checker.marker.eightHour, param: "4_8" },
							{ check: this.siteDown.checker.marker.twentyFourHour, param: "8_24" },
							{ check: this.siteDown.checker.marker.moreDay, param: "m24" }
						];

						siteDownMarkerConfigs.forEach((config) => {
							const index = this.siteDown.apiParams.siteDownChecker.indexOf(config.param);

							if (config.check) {
								if (index === -1) {
									this.siteDown.apiParams.siteDownChecker.push(config.param);
								}
							} else {
								if (index !== -1) {
									this.siteDown.apiParams.siteDownChecker.splice(index, 1);
								}
							}
						});

						// FME
						// const fmeMarkerConfig = [
						// 	{ check: this.siteDown.checker.fme.busy, marker: this.siteDown.marker.fme.fmeBusy, param: "busy" },
						// 	{ check: this.siteDown.checker.fme.idle, marker: this.siteDown.marker.fme.fmeIdle, param: "idle" }
						// ];

						// OBD
						// const obdSupplierConfig = [
						// 	{ check: "adw", param: "ADW" },
						// 	{ check: "ccsi", param: "CCSI" },
						// 	{ check: "mku", param: "MKU" },
						// 	{ check: "nw", param: "NW" },
						// 	{ check: "pmt", param: "PMT" },
						// 	{ check: "psd", param: "PERSADA" }
						// ];

						// const obdVehicleConfig = [
						// 	{ check: "inactive", param: "inactive" },
						// 	{ check: "active", param: "active" }
						// ];

						// const updateObdSupplier = () => {
						// 	this.obd.apiParams.supplierChecker = obdSupplierConfig.filter((item) => this.obd.checker.supplier[item.check]).map((item) => item.param);
						// };

						// const updateObdVehicleStatus = () => {
						// 	this.obd.apiParams.carStatus = obdVehicleConfig.filter((item) => this.obd.checker.vehicle[item.check]).map((item) => item.param);
						// };

						// updateObdSupplier();
						// updateObdVehicleStatus();
						// -----------------------------------------------------
						// HUB VALUE
						// const hubValueMarkerConfig = [
						// 	{ check: "core", param: "CORE SITE" },
						// 	{ check: "big", param: "BIG HUB SITE" },
						// 	{ check: "medium", param: "MEDIUM HUB SITE" },
						// 	{ check: "small", param: "SMALL HUB SITE" },
						// 	{ check: "end", param: "END SITE" }
						// ];

						// yxl
						// const updateHubType = () => {
						// 	this.siteDown.apiParams.hubType = hubValueMarkerConfig.filter((item) => this.siteDown.checker.hub[item.check]).map((item) => item.param);
						// };

						// updateHubType();

						// -----------------------------------------------------

						// -----------------------------------------------------
						// yxl hub CHECKER
						this.siteDown.apiParams.hubCheck = this.siteDown.checker.hub.isHub ? true : this.siteDown.checker.hub.nonHub ? false : null;

						// yxl SITE DOWN CHECKER
						this.siteDown.apiParams.siteDownCheck = this.siteDown.checker.siteDown.isSiteDown ? true : this.siteDown.checker.siteDown.nonSiteDown ? false : null;

						// VIP SITE CHECKER
						this.siteDown.apiParams.vipCheck = this.siteDown.checker.vip.isVip ? true : this.siteDown.checker.vip.nonVip ? false : null;

						// POWER ALARM CHECKER
						this.siteDown.apiParams.powerAlarm = this.siteDown.checker.power.isPowerAlarm;
						// -----------------------------------------------------

						// SITE TYPE
						// const siteTypeValueConfig = [
						// 	{ check: "all", param: "NORMAL" },
						// 	{ check: "n3t", param: "N3T" },
						// 	{ check: "uso", param: "USO" }
						// ];

						// const updateSiteType = () => {
						// 	this.siteDown.apiParams.siteType = siteTypeValueConfig.filter((item) => this.siteDown.checker.siteType[item.check]).map((item) => item.param);
						// };

						// updateSiteType();
						this.siteDown.apiParams.siteType = this.siteDown.selector.siteType.selectedOption.map((item) => item.site_type);
						this.siteDown.selector.area.value = this.siteDown.selector.area.selectedOption.map((item) => item.region_name);
						// -----------------------------------------------------

						// HIT MARKER LOOP
						hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
						try {
							const { res } = await getSiteDownMarker(
								this.siteDown.apiParams.siteDownChecker,
								this.siteDown.apiParams.hubCheck,
								this.siteDown.apiParams.vipCheck,
								this.siteDown.apiParams.siteType,
								this.siteDown.selector.area.value,
								this.siteDown.apiParams.siteDownCheck,
								this.indexData.siteDown.start_time,
								this.indexData.siteDown.end_time,
								this.indexData.siteDown.inputSite
							);
							this.siteDown.marker.aging.arraySiteDown.data = res;
							addLayerMarker(this.siteDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);

							// LOG MAPS HIT
							// await postMapsHit("Apply Filter SiteDown", this.siteDown.marker.aging.arraySiteDown.data.length, "Site Down Marker", new Date());
						} catch (error) {
							console.error(`Error fetching marker data for:`, error);
						}

						// 新加调用所有面板
						await getDurationRangeBreakdown(
							this.siteDown.apiParams.siteDownChecker,
							this.siteDown.apiParams.hubCheck,
							this.siteDown.apiParams.vipCheck,
							this.siteDown.apiParams.siteType,
							this.siteDown.selector.area.value,
							this.siteDown.apiParams.siteDownCheck,
							this.indexData.siteDown.start_time,
							this.indexData.siteDown.end_time
						)
							.then(({ res }) => {
								this.durationData.total = res.total_sitedown;
								this.durationData.hour1Sd = res.less_than_1_hour;
								this.durationData.hour14Sd = res.one_to_4_hour;
								this.durationData.hour48Sd = res.four_to_8_hour;
								this.durationData.hour824Sd = res.eight_to_24_hour;
								this.durationData.hourM24Sd = res.more_than_24_hours;
								// IndexData.globalProcess.state.component.siteDownDataLoading = false;
								// IndexData.refetch = false;
							})
							.catch((error) => {
								// IndexData.refetch = false;
								// IndexData.globalProcess.state.component.siteDownDataLoading = false;
								console.error("Error fetching data:", error);
							});
						await getTotalCell(
							this.siteDown.apiParams.siteDownChecker,
							this.siteDown.apiParams.hubCheck,
							this.siteDown.apiParams.vipCheck,
							this.siteDown.apiParams.siteType,
							this.siteDown.selector.area.value,
							this.siteDown.apiParams.siteDownCheck,
							this.indexData.siteDown.start_time,
							this.indexData.siteDown.end_time
						)
							.then(({ res }) => {
								this.durationData.totalCell = res.total_celldown;
								this.durationData.cellUrl = res.url;
							})
							.catch((error) => {
								console.error("Error fetching data:", error);
							});

						await getCountTtCorrelation(this.indexData.siteDown.start_time, this.indexData.siteDown.end_time)
							.then(({ res }) => {
								this.indexData.siteDown.store.ttCorrelation.data = res.results;
								this.indexData.siteDown.store.ttCorrelation.data.sort((a, b) => {
									const severityOrder = {
										Emergency: 0,
										Critical: 1,
										Major: 2
										// POT: 3
									};
									return severityOrder[a.severity] - severityOrder[b.severity];
								});
							})
							.catch((error) => {
								console.error("Error fetching data:", error);
							});

						await getCountTtCorrelationDetails(this.indexData.siteDown.start_time, this.indexData.siteDown.end_time)
							.then(({ res }) => {
								this.indexData.siteDown.store.ttCorrelation.tableData = res._values;
								// this.siteDown.state.ttCorrelation.ttTableLoading = false;
							})
							.catch((error) => {
								console.error("Error fetching data:", error);
								// this.siteDown.state.ttCorrelation.ttTableLoading = false;
							});

						await getAllSiteDownDataTable(
							this.indexData.siteDown.apiParams.siteDownChecker,
							this.indexData.siteDown.apiParams.hubCheck,
							this.indexData.siteDown.selector.area.value,
							this.indexData.siteDown.apiParams.vipCheck,
							this.indexData.siteDown.apiParams.siteType,
							this.siteDown.apiParams.siteDownCheck,
							this.indexData.siteDown.start_time,
							this.indexData.siteDown.end_time
						)
							.then(({ res }) => {
								console.log(res, "result get data site down data table");
								this.indexData.siteDown.state.modalExport.data = res;
								// this.siteDown.state.modalExport.loading == false;
							})
							.catch((error) => {
								// this.siteDown.state.modalExport.loading == false;
								console.error(error);
							});
						await getSiteDownByHubType(
							this.siteDown.apiParams.siteDownChecker,
							this.siteDown.apiParams.hubCheck,
							this.siteDown.selector.area.value,
							this.siteDown.apiParams.vipCheck,
							this.siteDown.apiParams.siteType,
							this.siteDown.apiParams.siteDownCheck,
							this.siteDown.start_time,
							this.siteDown.end_time
						)
							.then(({ res }) => {
								this.siteDown.state.collapse.data = res;
								// this.siteDown.store.exportSiteDownAlarm.loading = false;
							})
							.catch((error) => {
								// this.siteDown.store.exportSiteDownAlarm.loading = false;
								console.error(error);
							});
						// ===== 新增：Initial RCA-FWA-RAN =====
						await getAllSiteDownNumByInitialRca(
							this.siteDown.apiParams.siteDownChecker,
							this.siteDown.apiParams.hubCheck,
							this.siteDown.selector.area.value,
							this.siteDown.apiParams.vipCheck,
							this.siteDown.apiParams.siteType,
							this.siteDown.apiParams.siteDownCheck,
							this.siteDown.start_time,
							this.siteDown.end_time
						)
							.then(({ res }) => {
								this.siteDown.state.collapseInitialRca.data = res;
							})
							.catch((error) => {
								console.error(error);
							});
						await getCountByVendor(
							this.siteDown.apiParams.siteDownChecker,
							this.siteDown.apiParams.hubCheck,
							this.siteDown.apiParams.vipCheck,
							this.siteDown.apiParams.siteDownCheck,
							this.siteDown.selector.area.value,
							this.siteDown.apiParams.siteType,
							this.siteDown.start_time,
							this.siteDown.end_time
						)
							.then(({ res }) => {
								this.siteDown.vendorWiseData = res.results;
							})
							.catch((error) => {
								// this.refetch = false;
								console.error("Error fetching data:", error);
							});
						// for (const { check, marker, param } of fmeMarkerConfig) {
						// 	hideLayerMarker(marker);
						// 	if (check) {
						// 		try {
						// 			const { res } = await getFmeMarker(param);
						// 			marker.data = res;
						// 			addLayerMarker(marker, this.globalProcess.store.maps.backgroundMaps, this);

						// 			// LOG MAPS HIT
						// 			// await postMapsHit("Apply Filter SiteDown", marker.data.length, "Site Down Marker", new Date());
						// 		} catch (error) {
						// 			console.error(`Error fetching marker data for:`, error);
						// 		}
						// 	}
						// }

						// OBD
						// hideLayerMarker(this.obd.marker.obdCarMarker);
						// if (this.obd.apiParams.supplierChecker.length != 0 || this.obd.apiParams.carStatus.length != 0) {
						// 	await getObdVehicleMarkers(this.obd.apiParams.carStatus, this.obd.apiParams.supplierChecker)
						// 		.then((res) => {
						// 			this.obd.marker.obdCarMarker.data = res.res.results;
						// 			addLayerMarker(this.obd.marker.obdCarMarker, this.globalProcess.store.maps.backgroundMaps, this);
						// 		})
						// 		.catch((error) => {
						// 			console.error("Error: ", error);
						// 		});
						// }

						// UPDATE COMPONENT STATE TO LOAD DATA
						this.componentState = this.componentState + 1;

						this.globalProcess.state.component.applyFilterLoading = false;
					} catch (error) {
						this.globalProcess.state.component.applyFilterLoading = false;
						console.error("Error applying filter:", error);
					}
				} else {
					this.$swal({
						icon: "warning",
						title: "Please Wait Updating Data",
						showConfirmButton: false,
						timer: 3000
					});
				}
			} else {
				this.$swal({
					icon: "warning",
					title: "Please Wait Applying Filter",
					showConfirmButton: false,
					timer: 3000
				});
			}
		},

		// CLEAR FILTER
		async handleClearFilter() {
			// SITEDOWN MARKER
			this.siteDown.checker.marker.oneHour = false;
			this.siteDown.checker.marker.fourHour = false;
			this.siteDown.checker.marker.eightHour = false;
			this.siteDown.checker.marker.twentyFourHour = false;
			this.siteDown.checker.marker.moreDay = false;

			// yxl
			this.siteDown.checker.siteDown.isSiteDown = null;
			this.siteDown.start_time = "";
			this.siteDown.end_time = "";
			this.siteDown.selector.siteType.selectedOption = [];
			this.siteDown.selector.siteType.option = [];
			this.siteDown.apiParams.siteType = [];
			this.siteDown.checker.hub.isHub = false;
			this.siteDown.checker.hub.nonHub = false;

			this.siteDown.component.regionApply = false;
			this.siteDown.component.mcApply = false;
			this.siteDown.component.areaApply = false;

			this.siteDown.selector.region.selectedOption = "";
			this.siteDown.selector.region.selectedLat = "";
			this.siteDown.selector.region.selectedLon = "";
			this.siteDown.selector.region.selectedZoom = "";
			this.siteDown.selector.region.value = null;

			this.siteDown.selector.area.option = [];
			this.siteDown.selector.area.selectedOption = [];
			this.siteDown.selector.area.value = [];

			this.siteDown.selector.mcCluster.option = [];
			this.siteDown.selector.mcCluster.selectedOption = [];
			this.siteDown.selector.mcCluster.value = [];

			// FME MARKER
			this.siteDown.checker.fme.busy = false;
			this.siteDown.checker.fme.idle = false;

			// POWER ALARM
			this.siteDown.apiParams.powerAlarm = false;
			this.siteDown.checker.power.isPowerAlarm = false;

			// HUB TYPE
			this.siteDown.checker.hub.core = false;
			this.siteDown.checker.hub.big = false;
			this.siteDown.checker.hub.medium = false;
			this.siteDown.checker.hub.small = false;
			this.siteDown.checker.hub.end = false;
			this.siteDown.apiParams.hubType = [];

			// VIP CHECKER
			this.siteDown.apiParams.vipCheck = null;
			this.siteDown.checker.vip.isVip = false;
			this.siteDown.checker.vip.nonVip = false;

			// HIDE SITEDOWN
			hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);
			hideLayerMarker(this.siteDown.marker.aging.multipleSiteDown);
			hideLayerMarker(this.siteDown.marker.aging.moreDay);

			// HIDE FME
			hideLayerMarker(this.siteDown.marker.fme.fmeBusy);
			hideLayerMarker(this.siteDown.marker.fme.fmeIdle);

			await this.getDataArea([]);
			await this.getSiteType([]);
		},

		// REMOVE BACKDROP
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

		// SITE DOWN CHECKER
		async setDurationCheckValue(check, property) {
			this.siteDown.checker.marker[property] = check;
		},
		async checkSites1Hr(event) {
			var check = event.target.checked;
			this.setDurationCheckValue(check, "oneHour");
		},
		async checkSites14Hr(event) {
			var check = event.target.checked;
			this.setDurationCheckValue(check, "fourHour");
		},
		async checkSites48Hr(event) {
			var check = event.target.checked;
			this.setDurationCheckValue(check, "eightHour");
		},
		async checkSites824Hr(event) {
			var check = event.target.checked;
			this.setDurationCheckValue(check, "twentyFourHour");
		},
		async checkSites24Hr(event) {
			var check = event.target.checked;
			this.setDurationCheckValue(check, "moreDay");
		},

		// FME CHECKER
		async setFmeCheckValue(check, property) {
			this.siteDown.checker.fme[property] = check;
		},
		async checkFmeBusy(event) {
			var check = event.target.checked;
			this.setFmeCheckValue(check, "busy");
		},
		async checkFmeIdle(event) {
			var check = event.target.checked;
			this.setFmeCheckValue(check, "idle");
		},

		// OBD STATUS CHECKER
		async setObdStatusChecker(check, property) {
			this.obd.checker.vehicle[property] = check;
		},
		async checkObdInactive(event) {
			var check = event.target.checked;
			this.setObdStatusChecker(check, "inactive");
		},
		async checkObdActive(event) {
			var check = event.target.checked;
			this.setObdStatusChecker(check, "active");
		},

		// OBD SUPPLIER CHECKER
		async setObdSupplierChecker(check, property) {
			this.obd.checker.supplier[property] = check;
		},
		async checkObdPmt(event) {
			var check = event.target.checked;
			this.setObdSupplierChecker(check, "pmt");
		},
		async checkObdCcsi(event) {
			var check = event.target.checked;
			this.setObdSupplierChecker(check, "ccsi");
		},
		async checkObdNw(event) {
			var check = event.target.checked;
			this.setObdSupplierChecker(check, "nw");
		},
		async checkObdMku(event) {
			var check = event.target.checked;
			this.setObdSupplierChecker(check, "mku");
		},
		async checkObdAdw(event) {
			var check = event.target.checked;
			this.setObdSupplierChecker(check, "adw");
		},
		async checkObdPsd(event) {
			var check = event.target.checked;
			this.setObdSupplierChecker(check, "psd");
		},

		// POWER ALARM CHECKER
		async checkPowerAlarm(event) {
			var check = event.target.checked;
			if (check == true) {
				this.siteDown.checker.power.isPowerAlarm = true;
			} else {
				this.siteDown.checker.power.isPowerAlarm = false;
			}
		},

		// SITE TYPE CHECKER
		// async setSiteTypeChecker(check, property) {
		// 	this.siteDown.checker.siteType[property] = check;
		// },
		// async checkAllSiteType(event) {
		// 	var check = event.target.checked;
		// 	this.setSiteTypeChecker(check, "all");
		// },
		// async checkN3tSiteType(event) {
		// 	var check = event.target.checked;
		// 	this.setSiteTypeChecker(check, "n3t");
		// },
		// async checkUsoSiteType(event) {
		// 	var check = event.target.checked;
		// 	this.setSiteTypeChecker(check, "uso");
		// },

		// HUB VALUE CHECKER
		async setHubValue(check, property) {
			// // yxl
			// this.siteDown.checker.hub[property] = check;
			if (property === "isHub") {
				this.siteDown.checker.hub.isHub = check;
				if (check) {
					this.siteDown.checker.hub.nonHub = false;
				}
			} else if (property === "nonHub") {
				this.siteDown.checker.hub.nonHub = check;
				if (check) {
					this.siteDown.checker.hub.isHub = false;
				}
			}
		},
		async checkCoreHub(event) {
			var check = event.target.checked;
			this.setHubValue(check, "isHub");
		},
		async checkNonHub(event) {
			var check = event.target.checked;
			this.setHubValue(check, "nonHub");
		},
		async checkBigHub(event) {
			var check = event.target.checked;
			this.setHubValue(check, "big");
		},
		async checkMediumHub(event) {
			var check = event.target.checked;
			this.setHubValue(check, "medium");
		},
		async checkSmallHub(event) {
			var check = event.target.checked;
			this.setHubValue(check, "small");
		},
		async checkEndHub(event) {
			var check = event.target.checked;
			this.setHubValue(check, "end");
		},

		// VIP CHECKER
		async setVipSite(check, property) {
			if (property === "isVip") {
				this.siteDown.checker.vip.isVip = check;
				if (check) {
					this.siteDown.checker.vip.nonVip = false;
				}
			} else if (property === "nonVip") {
				this.siteDown.checker.vip.nonVip = check;
				if (check) {
					this.siteDown.checker.vip.isVip = false;
				}
			}
		},

		// yxl Site CHECKER
		async setSiteDown(check, property) {
			if (property === "isSiteDown") {
				this.siteDown.checker.siteDown.isSiteDown = check;
				if (check) {
					this.siteDown.checker.siteDown.nonSiteDown = false;
				}
			} else if (property === "nonSiteDown") {
				this.siteDown.checker.siteDown.nonSiteDown = check;
				if (check) {
					this.siteDown.checker.siteDown.isSiteDown = false;
				}
			}
		},

		async checkVip(event) {
			var check = event.target.checked;
			this.setVipSite(check, "isVip");
		},

		async checkSiteDown(event) {
			var check = event.target.checked;
			this.setSiteDown(check, "isSiteDown");
		},

		async checkNonSiteDown(event) {
			var check = event.target.checked;
			this.setSiteDown(check, "nonSiteDown");
		},

		async checkNonVip(event) {
			var check = event.target.checked;
			this.setVipSite(check, "nonVip");
		},

		async getDataArea() {
			await getRegionByCircle()
				.then(({ res }) => {
					this.siteDown.selector.area.option = res;
					console.log(res, this.siteDown.selector.area.option, "area");
				})
				.catch((error) => {
					console.error(error);
				});
		},
		async getSiteType() {
			await getSiteTypeData()
				.then(({ res }) => {
					this.siteDown.selector.siteType.option = res;
					console.log(res, this.siteDown.selector.siteType.option, "siteType");
				})
				.catch((error) => {
					console.error(error);
				});
		},
		// async getDataArea(circle) {
		// 	await getRegionByCircle(circle)
		// 		.then(({ res }) => {
		// 			this.siteDown.selector.area.option = res.filter((region) => region.area_name);
		// 			console.log(this.siteDown.selector.area.option, "area");
		// 		})
		// 		.catch((error) => {
		// 			console.error(error);
		// 		});
		// },

		async getDataMcCluster(region, circle) {
			await getMcClusterByFourCircle(circle, region)
				.then(({ res }) => {
					this.siteDown.selector.mcCluster.option = res.filter((mc) => mc.area_name);
				})
				.catch((error) => {
					console.error(error);
				});
		},

		// SELECTOR
		handleItemSelected(item) {
			this.siteDown.selector.mcCluster.selectedOption = item;
		},
		handleItemCleared() {
			this.siteDown.selector.mcCluster.selectedOption = [];
		},

		handleItemSelectedRegion(item, lat, lon, zoom) {
			this.siteDown.selector.region.selectedOption = item;
			this.siteDown.selector.region.selectedLat = lat;
			this.siteDown.selector.region.selectedLon = lon;
			this.siteDown.selector.region.selectedZoom = zoom;
		},
		handleItemClearedRegion() {
			this.siteDown.selector.region.selectedOption = "";
			this.siteDown.selector.region.selectedLat = "";
			this.siteDown.selector.region.selectedLon = "";
			this.siteDown.selector.region.selectedZoom = "";
		},

		// MULTISELECT TAGGING
		addTag(newTag) {
			if (this.siteDown.selector.mcCluster.selectedOption.length >= 20) {
				this.$swal({
					icon: "warning",
					title: "Selection Limit Reached",
					text: "You've reached the maximum selection of MC Cluster",
					showConfirmButton: false,
					timer: 1200
				});
				return;
			} else {
			}
			const tag = {
				name: newTag,
				code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
			};
			this.siteDown.selector.mcCluster.option.push(tag);
			this.siteDown.selector.mcCluster.selectedOption.push(tag);
		},

		// MULTISELECT TAGGING
		addTagArea(newTag) {
			if (this.siteDown.selector.area.selectedOption.length >= 20) {
				this.$swal({
					icon: "warning",
					title: "Selection Limit Reached",
					text: "You've reached the maximum selection of MC Cluster",
					showConfirmButton: false,
					timer: 1200
				});
				return;
			}
			const tag = {
				name: newTag,
				code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
			};
			this.siteDown.selector.area.option.push(tag);
			this.siteDown.selector.area.selectedOption.push(tag);
		},
		updateSelectedArea(newVal) {
			const mapping = newVal.map((option) => option.area_name);
			this.siteDown.selector.area.value = mapping;

			if (newVal.length !== 0) {
				if (this.siteDown.selector.region.selectedOption) {
					this.getDataMcCluster([this.siteDown.selector.region.selectedOption], this.siteDown.selector.area.value);
				} else {
					this.getDataMcCluster([], this.siteDown.selector.area.value);
				}
				this.globalProcess.query.mc.searchQuery = "";
			} else {
				const regionOption = this.siteDown.selector.region.selectedOption || [];
				this.getDataMcCluster([regionOption], []);
			}
		},
		updateSelectedMcCluster(newVal) {
			const mapping = newVal.map((option) => option.area_name);
			this.siteDown.selector.mcCluster.value = mapping;

			if (this.siteDown.selector.mcCluster.value.length !== 0) {
				this.globalProcess.query.mc.searchQuery = "";
			}

			if (newVal.length !== 0) {
				this.getDataMcCluster([this.siteDown.selector.region.selectedOption] || [], this.siteDown.selector.area.value);
			} else {
				this.getDataMcCluster([this.siteDown.selector.region.selectedOption] || [], []);
			}
		}
	}
};
</script>

<style>
.cat {
	cursor: pointer;
	background: #ffffff;
	color: #595757;
	font-weight: 600;
	overflow: hidden;
	float: left;
	width: fit-content;
	padding: 0;
}

.cat label {
	cursor: pointer;
	float: left;
	line-height: 3em;
	width: fit-content;
}

.cat label span {
	cursor: pointer;
	text-align: center;
	display: block;
}

.cat label input {
	cursor: pointer;
	position: absolute;
	display: none;
	color: #fff !important;
}

.cat label input + span {
	cursor: pointer;
	color: #595757;
}

.cat input:checked + span {
	cursor: pointer;
	color: #ffffff;
}

.action input + span {
	border: 1px solid #dcdddd;
	border-radius: 8px;
	color: #595757;
	padding: 0px 12px;
}

.action input + span .ico {
	padding: 5px 6px;
	border-radius: 20px;
	background-color: #e1e1e1;
	color: #595757;
}

.action input:checked + span .ico {
	padding: 5px 6px;
	border-radius: 20px;
	background-color: #f8e2ce;
	color: #ed6d00;
}

.action input:checked + span {
	cursor: pointer;
	background-color: #fff9f3;
	color: #ed6d00;
	border: 1px solid #ed6d00;
	border-radius: 8px;
	font-weight: 700;
	padding: 0px 12px;
}

.cat input:hover + span {
	cursor: pointer;
	color: #ffffff;
}

.action input:hover + span .ico {
	padding: 5px 6px;
	border-radius: 20px;
	background-color: #f8e2ce;
	color: #ed6d00;
}

.action input:hover + span {
	cursor: pointer;
	background-color: #fff9f3;
	color: #ed6d00;
	border: 1px solid #ed6d00;
	border-radius: 8px;
	font-weight: 700;
	padding: 0px 12px;
}

.zoom-filter {
	zoom: 100%;
}

.filter-scroll {
	height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
	max-height: 700px;
}

@media screen and (max-width: 1919px) {
	.zoom-filter {
		zoom: 85%;
	}
}

.btn-clear-width {
	width: 50% !important;
}

.btn-apply-width {
	width: 50% !important;
}
</style>
