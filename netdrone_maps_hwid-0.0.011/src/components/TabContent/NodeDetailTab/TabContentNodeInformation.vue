<template>
	<div class="tab-pane fade show active" id="node-detail-info-tab-pane" role="tabpanel" aria-labelledby="node-detail-info-tab" tabindex="0">
		<p class="font-20 text-dark font-600">Site</p>
		<div class="row">
			<!-- CONTENT LEFT -->
			<div class="col-8">
				<div class="row">
					<div class="col-12">
						<div class="row">
							<div class="col-4 mt-3 font-400 text-grey font-16">Site Name</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-else>
								{{ this.siteItem.sitename }}
							</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Site ID</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-else>
								{{ this.siteItem.site_id }}
							</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Site Type</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-else>
								{{ this.siteItem.site_type }}
							</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Site Class</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.site_class }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Site Latitude</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.latitude }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Site Longitude</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.longitude }}</div>

							<!-- <div class="col-4 mt-3 font-400 text-grey font-16">Region</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.five_region }}</div> -->

							<div class="col-4 mt-3 font-400 text-grey font-16">Circle</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.circle }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Region</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.region }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">MC Cluster</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.lessor_name }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Is VIP</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.is_vip }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Hub Type</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.hub_type }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">Address</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.site_addr }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">ROH Name</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.roh_name }}</div>

							<div class="col-4 mt-3 font-400 text-grey font-16">ROH Phone</div>
							<div class="col-8 mt-3 text-dark font-400 font-16" v-if="this.siteItem == undefined || this.siteItem == null">Loading</div>
							<div v-else class="col-8 mt-3 text-dark font-400 font-16">{{ this.siteItem.roh_phone }}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- CONTENT RIGHT -->
			<!--
			<div class="col-4">
				<div class="row">
					<div class="col-12">
						<div v-if="this.batteryLoading == true">
							<div class="card p-2">
								<div class="box-grey px-3 py-2">
									<div class="row">
										<div class="col-7">
											<p class="text-grey font-600 font-16 mt-3">Battery Status</p>
											<p class="text-dark font-400 font-16 mt-3">Loading</p>
										</div>
										<div class="col-5">
											<div class="d-flex justify-content-end align-items-start">
												<img src="../../../assets/img/genset/ic_round-electric-bolt-4.png" />
											</div>
										</div>
									</div>
								</div>
								<div class="row mt-2">
									<div class="col-6">
										<div class="box-grey flex-battery-box p-3">
											<p class="font-600 font-14 text-dark mb-3">Max Battery Backup Duration</p>
											<p class="font-24 font-600 text-dark">Loading</p>
											<p class="font-12 font-400 text-grey">Hrs</p>
										</div>
									</div>
									<div class="col-6">
										<div class="box-yellow flex-battery-box p-3">
											<p class="font-600 font-14 text-dark mb-3">Est Remaining Backup Duration</p>
											<p class="font-24 font-600 text-dark">Loading</p>
											<p class="font-12 font-400 text-grey">Hrs</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-if="this.batteryLoading == false">
							<div v-if="this.batteryData.battery_status != undefined || this.batteryData.battery_status != null" class="card p-2">
								<div :class="this.batteryData.battery_status == 'FULL CHARGE' ? 'box-green px-3 py-2' : this.batteryData.battery_status == 'DISCHARGING' ? 'box-orange px-3 py-2' : this.batteryData.battery_status == 'LOW VOLTAGE' ? 'box-red px-3 py-2' : 'box-grey px-3 py-2'">
									<div class="row">
										<div class="col-7">
											<p class="text-grey font-600 font-16 mt-3">Battery Status</p>
											<p class="text-dark font-400 font-16 mt-3">{{ capitalizeWords(this.batteryData.battery_status) }}</p>
										</div>
										<div class="col-5">
											<div class="d-flex justify-content-end align-items-start">
												<img v-if="this.batteryData.battery_status == 'FULL CHARGE'" src="../../../assets/img/genset/ic_round-electric-bolt.png" />
												<img v-if="this.batteryData.battery_status == 'DISCHARGING'" src="../../../assets/img/genset/ic_round-electric-bolt-2.png" />
												<img v-if="this.batteryData.battery_status == 'LOW VOLTAGE'" src="../../../assets/img/genset/ic_round-electric-bolt-1.png" />
												<img v-if="this.batteryData.battery_status == ''" src="../../../assets/img/genset/ic_round-electric-bolt-4.png" />
											</div>
										</div>
									</div>
								</div>
								<div class="row mt-2">
									<div class="col-6">
										<div class="box-grey flex-battery-box p-3">
											<p class="font-600 font-14 text-dark mb-3">Max Battery Backup Duration</p>
											<p class="font-24 font-600 text-dark">{{ this.batteryData.max_backup_time != "" ? this.batteryData.max_backup_time : "No Data" }}</p>
											<p class="font-12 font-400 text-grey">Hrs</p>
										</div>
									</div>
									<div class="col-6">
										<div class="box-yellow flex-battery-box p-3">
											<p class="font-600 font-14 text-dark mb-3">Est Remaining Backup Duration</p>
											<p class="font-24 font-600 text-dark">{{ this.batteryData.max_backup_time != "" ? this.batteryData.estimate_remaining_time : "No Data" }}</p>
											<p class="font-12 font-400 text-grey">Hrs</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			-->
		</div>
		<hr class="mt-3" />

		<div :class="this.dwdmSite == true ? 'row mb-4 row-gap-8' : this.isCoreRouter == true ? 'row mb-4 row-gap-8' : 'row mb-4 row-gap-20'">
			<p class="font-20 text-dark font-600">Alarm List</p>
			<div v-if="this.dwdmSite == true" class="d-flex flex-row gap-12 mb-3">
				<ButtonChecker :change="checkSiteIssue" :checker="this.checker.siteIssue" :title="'Site Issue'" :count="this.siteAlarm"></ButtonChecker>
				<ButtonChecker :change="checkPowerAlarm" :checker="this.checker.powerAlarm" :title="'DWDM Power Alarm'" :count="this.powerAlarm"></ButtonChecker>
				<ButtonChecker :change="checkUnmanaged" :checker="this.checker.unmanaged" :title="'DWDM Unmanaged'" :count="this.dwdmAlarm"></ButtonChecker>
				<ButtonChecker :change="checkTemperature" :checker="this.checker.temperature" :title="'DWDM Temperature Alarm'" :count="this.temperatureAlarm" v-if="this.tabState != 'linkDown'"> </ButtonChecker>
				<ButtonChecker :change="checkTransport" :checker="this.checker.transport" :title="'DWDM Transport Alarm'" :count="this.transportAlarm" v-if="this.tabState != 'linkDown'"> </ButtonChecker>
			</div>

			<div v-if="this.isCoreRouter == true" class="d-flex flex-row gap-12 mb-3">
				<ButtonChecker :change="checkCoreUnmanaged" :checker="this.checkerCoreRouter.unmanaged" :title="'Unmanaged Alarm'" :count="this.coreRouterAlarmData.unmanaged"></ButtonChecker>
				<ButtonChecker :change="checkHardwareFault" :checker="this.checkerCoreRouter.hardwareFault" :title="'Hardware Fault'" :count="this.coreRouterAlarmData.hardwareFault"></ButtonChecker>
				<ButtonChecker :change="checkPower" :checker="this.checkerCoreRouter.powerAlarm" :title="'Power Alarm'" :count="this.coreRouterAlarmData.powerAlarm"></ButtonChecker>
				<ButtonChecker :change="checkLinkDown" :checker="this.checkerCoreRouter.linkDown" :title="'Link Down (Bundle)'" :count="this.coreRouterAlarmData.linkDown"></ButtonChecker>
				<ButtonChecker :change="checkHighTemperature" :checker="this.checkerCoreRouter.highTemperature" :title="'High Temperature'" :count="this.coreRouterAlarmData.highTemperature"></ButtonChecker>
				<ButtonChecker :change="checkHighUtil" :checker="this.checkerCoreRouter.highUtil" :title="'High Utilization'" :count="this.coreRouterAlarmData.highUtil"></ButtonChecker>
			</div>

			<div :class="this.dwdmSite == true ? 'row mb-4 row-gap-20' : 'row'">
				<!-- CONTENT LEFT SITE ISSUE -->
				<div :class="this.dwdmSite == true ? 'col-12' : 'col-6'" v-if="this.showSiteIssue == true && this.coreRouterSite == false">
					<StepsVertical :isCoreRouter="this.coreRouterSite" :isDwdm="this.dwdmSite" :title="'Site Issue'" :emptyMessage="'There is no sites issue'" :alarmData="this.siteAlarm"></StepsVertical>
				</div>

				<!-- CONTENT RIGHT POWER ALARM -->
				<div :class="this.dwdmSite == true ? 'col-12' : 'col-6'" v-if="this.showPowerAlarm == true && this.coreRouterSite == false">
					<StepsVertical :isCoreRouter="this.coreRouterSite" :isDwdm="this.dwdmSite" :title="this.dwdmSite == true ? 'DWDM Power Alarm' : 'Power Alarm'" :emptyMessage="'There is no Power Alarm Issue'" :alarmData="this.powerAlarm"></StepsVertical>
				</div>

				<!-- CONTENT ONLY DWDM ALARM -->
				<div v-if="this.dwdmSite == true && this.showUnmanaged == true" class="col-12">
					<StepsVertical :isCoreRouter="this.coreRouterSite" :isDwdm="true" :title="'DWDM Unmanaged Alarm'" :emptyMessage="'There is no Unmanaged Alarm Issue'" :alarmData="this.dwdmAlarm"></StepsVertical>
				</div>

				<div v-if="this.dwdmSite == true && this.showTemperatureAlarm == true" class="col-12">
					<StepsVertical :isCoreRouter="this.coreRouterSite" :isDwdm="true" :title="'DWDM Temperature Alarm'" :emptyMessage="'There is no Temperature Alarm Issue'" :alarmData="this.temperatureAlarm"> </StepsVertical>
				</div>

				<div v-if="this.dwdmSite == true && this.showTransportAlarm == true" class="col-12">
					<StepsVertical :isCoreRouter="this.coreRouterSite" :isDwdm="true" :title="'DWDM Transport Alarm'" :emptyMessage="'There is no Transport Alarm Issue'" :alarmData="this.transportAlarm"> </StepsVertical>
				</div>
				<!--  -->

				<!-- CONTENT CORE ROUTER ONLY -->
				<div v-if="this.coreRouterSite == true && this.showCoreRouter.unmanaged == true" class="col-12">
					<StepsVertical :isCoreRouter="true" :isDwdm="false" :title="'Site Issue'" :emptyMessage="'There is no Unmanaged Issue'" :alarmData="this.coreRouterAlarmData.unmanaged"> </StepsVertical>
				</div>
				<div v-if="this.coreRouterSite == true && this.showCoreRouter.hardwareFault == true" class="col-12">
					<StepsVertical :isCoreRouter="true" :isDwdm="false" :title="'Site Issue'" :emptyMessage="'There is no Hardware Fault Issue'" :alarmData="this.coreRouterAlarmData.hardwareFault"> </StepsVertical>
				</div>
				<div v-if="this.coreRouterSite == true && this.showCoreRouter.powerAlarm == true" class="col-12">
					<StepsVertical :isCoreRouter="true" :isDwdm="false" :title="'Site Issue'" :emptyMessage="'There is no Power Alarm Issue'" :alarmData="this.coreRouterAlarmData.powerAlarm"> </StepsVertical>
				</div>
				<div v-if="this.coreRouterSite == true && this.showCoreRouter.linkDown == true" class="col-12">
					<StepsVertical :isCoreRouter="true" :isDwdm="false" :title="'Site Issue'" :emptyMessage="'There is no Link Down Issue'" :alarmData="this.coreRouterAlarmData.linkDown"> </StepsVertical>
				</div>
				<div v-if="this.coreRouterSite == true && this.showCoreRouter.highUtil == true" class="col-12">
					<StepsVertical :isCoreRouter="true" :isDwdm="false" :title="'Site Issue'" :emptyMessage="'There is no High Utilization Issue'" :alarmData="this.coreRouterAlarmData.highUtil"> </StepsVertical>
				</div>
				<div v-if="this.coreRouterSite == true && this.showCoreRouter.highTemperature == true" class="col-12">
					<StepsVertical :isCoreRouter="true" :isDwdm="false" :title="'Site Issue'" :emptyMessage="'There is no High Temperature Issue'" :alarmData="this.coreRouterAlarmData.highTemperature"> </StepsVertical>
				</div>
				<!--  -->
			</div>
		</div>
	</div>
</template>

<script>
// import { getGensetStatus } from "../../../views/Api/genset/getGensetStatus.js";
import { getPgTaskDetail } from "../../../views/Api/countingPg/getPgTaskDetail.js";
import { etaTaskDetailPgTrackingMapsInit } from "../../../views/Helper/MapFunction/etaTaskDetailPgTrackingMapsInit.js";
import { getSiteBatteryStatus } from "../../../views/Api/battery/getSiteBatteryStatus.js";

// COMPONENTS
import StepsVertical from "../../Steps/StepsVertical.vue";
import ButtonChecker from "../../Button/ButtonChecker.vue";
import { getDwdmSiteInfo } from "../../../views/Api/countingDwdm/getDwdmSiteInfo.js";

export default {
	name: "TabContentNodeInformation",
	components: {
		StepsVertical,
		ButtonChecker
	},
	props: {
		siteName: Object,
		siteId: Object,
		siteAlarmList: Array,
		powerAlarmList: Array,
		dwdmAlarmList: Array,
		dwdmTemperatureAlarmList: Array,
		dwdmTransportAlarmList: Array,
		isDwdm: Boolean,
		isCoreRouter: Boolean,
		coreRouterUnmanaged: Array,
		coreRouterHardware: Array,
		coreRouterPower: Array,
		coreRouterLinkDown: Array,
		coreRouterHighTemp: Array,
		coreRouterHighUtil: Array,
		tabState: String
	},
	data() {
		return {
			siteDataInfo: {},
			siteItem: {},
			siteAlarm: [],
			powerAlarm: [],
			dwdmAlarm: [],
			temperatureAlarm: [],
			transportAlarm: [],
			gensetData: {},
			batteryLoading: false,
			batteryData: {},
			dwdmSite: false,
			coreRouterSite: false,
			showTab: false,
			selectedAlarm: "siteIssue", // Default selection
			checker: {
				siteIssue: true,
				powerAlarm: false,
				hardwareFault: false,
				unmanaged: false,
				temperature: false,
				transport: false
			},
			checkerCoreRouter: {
				unmanaged: true,
				hardwareFault: false,
				powerAlarm: false,
				linkDown: false,
				highUtil: false,
				highTemperature: false
			},
			coreRouterAlarmData: {
				unmanaged: [],
				hardwareFault: [],
				powerAlarm: [],
				linkDown: [],
				highUtil: [],
				highTemperature: []
			},
			showCoreRouter: {
				unmanaged: true,
				hardwareFault: false,
				powerAlarm: false,
				linkDown: false,
				highUtil: false,
				highTemperature: false
			},
			showSiteIssue: true,
			showPowerAlarm: true,
			showUnmanaged: false,
			showTemperatureAlarm: false,
			showTransportAlarm: false
		};
	},
	watch: {
		dwdmSite(newVal) {
			if (newVal) {
				// When dwdmSite is true, show only Site Issue by default
				this.showSiteIssue = true;
				this.showPowerAlarm = false;
				this.showTemperatureAlarm = false;
				this.showTransportAlarm = false;
				this.showUnmanaged = false;
			} else {
				// When dwdmSite is false, show both Site Issue and Power Alarm
				this.showSiteIssue = true;
				this.showPowerAlarm = true;
				this.showTemperatureAlarm = false;
				this.showTransportAlarm = false;
				this.showUnmanaged = false;
			}
		},
		siteName(newVal, oldVal) {
			this.siteItem = newVal;
			// console.log('this.siteItem',this.siteItem)
			// if (newVal != oldVal) {
			// 	this.getSiteInformation();
			// 	// this.getGensetData();
			// 	this.getBatteryData();
			// }
		},
		isDwdm(newVal) {
			this.dwdmSite = newVal;
		},
		siteAlarmList(newVal) {
			this.siteAlarm = newVal;
		},
		dwdmAlarmList(newVal) {
			this.dwdmAlarm = newVal;
		},
		powerAlarmList(newVal) {
			this.powerAlarm = newVal;
		},
		dwdmTemperatureAlarmList(newVal) {
			this.temperatureAlarm = newVal;
		},
		dwdmTransportAlarmList(newVal) {
			this.transportAlarm = newVal;
		},
		isCoreRouter(newVal) {
			this.coreRouterSite = newVal;
		},
		coreRouterUnmanaged(newVal) {
			console.log(newVal);
			this.coreRouterAlarmData.unmanaged = newVal;
		},
		coreRouterHardware(newVal) {
			this.coreRouterAlarmData.hardwareFault = newVal;
		},
		coreRouterPower(newVal) {
			this.coreRouterAlarmData.powerAlarm = newVal;
		},
		coreRouterLinkDown(newVal) {
			this.coreRouterAlarmData.linkDown = newVal;
		},
		coreRouterHighTemp(newVal) {
			this.coreRouterAlarmData.highTemperature = newVal;
		},
		coreRouterHighUtil(newVal) {
			this.coreRouterAlarmData.highUtil = newVal;
		}
	},
	methods: {
		// CORE ROUTER
		async setCheckerCoreRouter(check, property) {
			Object.keys(this.checkerCoreRouter).forEach((key) => {
				this.checkerCoreRouter[key] = false;
			});
			this.checkerCoreRouter[property] = check;

			this.updateVisibilityCoreRouter(property);
		},

		updateVisibilityCoreRouter(property) {
			// Reset all visibility flags
			this.showCoreRouter.hardwareFault = false;
			this.showCoreRouter.highTemperature = false;
			this.showCoreRouter.highUtil = false;
			this.showCoreRouter.linkDown = false;
			this.showCoreRouter.powerAlarm = false;
			this.showCoreRouter.unmanaged = false;

			// Set visibility based on the selected property
			if (property === "hardwareFault") this.showCoreRouter.hardwareFault = true;
			if (property === "highTemperature") this.showCoreRouter.highTemperature = true;
			if (property === "highUtil") this.showCoreRouter.highUtil = true;
			if (property === "linkDown") this.showCoreRouter.linkDown = true;
			if (property === "powerAlarm") this.showCoreRouter.powerAlarm = true;
			if (property === "unmanaged") this.showCoreRouter.unmanaged = true;
		},

		async checkCoreUnmanaged(event) {
			await this.setCheckerCoreRouter(event.target.checked, "unmanaged");
		},
		async checkHardwareFault(event) {
			await this.setCheckerCoreRouter(event.target.checked, "hardwareFault");
		},
		async checkPower(event) {
			await this.setCheckerCoreRouter(event.target.checked, "powerAlarm");
		},
		async checkLinkDown(event) {
			await this.setCheckerCoreRouter(event.target.checked, "linkDown");
		},
		async checkHighUtil(event) {
			await this.setCheckerCoreRouter(event.target.checked, "highUtil");
		},
		async checkHighTemperature(event) {
			await this.setCheckerCoreRouter(event.target.checked, "highTemperature");
		},

		// ---
		async setChecker(check, property) {
			Object.keys(this.checker).forEach((key) => {
				this.checker[key] = false;
			});
			this.checker[property] = check;

			this.updateVisibility(property);
		},

		updateVisibility(property) {
			// Reset all visibility flags
			this.showSiteIssue = false;
			this.showPowerAlarm = false;
			this.showTemperatureAlarm = false;
			this.showTransportAlarm = false;
			this.showUnmanaged = false;

			// Set visibility based on the selected property
			if (property === "siteIssue") this.showSiteIssue = true;
			if (property === "powerAlarm") this.showPowerAlarm = true;
			if (property === "temperature") this.showTemperatureAlarm = true;
			if (property === "transport") this.showTransportAlarm = true;
			if (property === "unmanaged") this.showUnmanaged = true;
		},

		async checkSiteIssue(event) {
			await this.setChecker(event.target.checked, "siteIssue");
		},
		async checkPowerAlarm(event) {
			await this.setChecker(event.target.checked, "powerAlarm");
		},
		async checkUnmanaged(event) {
			await this.setChecker(event.target.checked, "unmanaged");
		},
		async checkTemperature(event) {
			await this.setChecker(event.target.checked, "temperature");
		},
		async checkTransport(event) {
			await this.setChecker(event.target.checked, "transport");
		},
		async openTaskDetailsPg(cmId) {
			this.globalProcess.state.component.loadingEtaDataPg = true;

			await getPgTaskDetail(cmId)
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
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		},

		async getSiteInformation() {
			await getDwdmSiteInfo(this.siteItem.siteId)
				.then(({ res }) => {
					this.siteDataInfo = res;
					console.log("this site data info: ", this.siteDataInfo);
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		},
		async getBatteryData() {
			this.batteryLoading = true;
			await getSiteBatteryStatus(this.siteItem.siteId)
				.then(({ res }) => {
					this.batteryLoading = false;
					this.batteryData = res;
				})
				.catch((error) => {
					this.batteryLoading = false;
					console.error(error);
				});
		},
		capitalizeWords(sentence) {
			if (!sentence) return "";
			return sentence.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
		}
	}
};
</script>

<style>
.box-pg-movement {
	background-color: #ffefc1;
	border-radius: 8px;
	border: 1px solid #fee085;
}

.box-no-pg-movement {
	border-radius: 8px;
	border: 1px solid #dcdddd;
}

.flex-battery-box {
	display: flex;
	flex-direction: column;
	/* gap: 12px; */
	justify-content: center;
	height: 100%;
	justify-content: center;
}

.box-yellow {
	background-color: #ffcb050d;
	border-radius: 8px;
}

.box-red {
	background-color: rgba(237, 28, 36, 0.05);
	border-radius: 8px;
}

.box-green {
	background-color: rgba(98, 178, 48, 0.05);
	border-radius: 8px;
}

.box-orange {
	background-color: rgba(253, 136, 23, 0.05);
	border-radius: 8px;
}

.box-grey {
	background-color: rgb(206, 206, 206, 0.05);
	border-radius: 8px;
}

.text-yellow {
	color: var(--autin-yellow);
}

/* Timeline */
.timeline {
	position: relative;
	max-width: 600px;
	margin: 0 auto;
}

.timeline::before {
	content: "";
	position: absolute;
	width: 3px;
	background-color: #ed6d00;
	top: 22px;
	bottom: 0;
	left: 20px;
	margin-left: -2px;
}

.timeline-item {
	padding: 10px 40px;
	position: relative;
	background-color: inherit;
	width: 100%;
	text-align: left;
}

.timeline-item::after {
	content: "";
	position: absolute;
	width: 20px;
	height: 20px;
	left: 9px;
	background-color: #ed6d00;
	top: 20px;
	border-radius: 50%;
	z-index: 1;
	/* background: blue; */
	box-shadow: 0px 0px 0px 33px rgba(255, 132, 0, 0.75);
	-webkit-box-shadow: 0px 0px 0px 8px rgba(255, 132, 0, 0.25);
	-moz-box-shadow: 0px 0px 0px 33px rgba(255, 132, 0, 0.75);
}

.timeline-item::before {
	content: " ";
	height: 0;
	position: absolute;
	top: 22px;
	width: 0;
	z-index: 1;
	left: 20px;
	border: medium solid white;
	border-width: 10px 10px 10px 0;
	border-color: transparent white transparent transparent;
}

.col-scroll {
	height: 100%;
	max-height: 275px;
	overflow-y: scroll;
}

.zoom-filter {
	zoom: 100%;
}

.filter-scroll {
	height: 100%;
	overflow-y: scroll;
	max-height: 700px;
}

@media screen and (max-width: 1919px) {
	.zoom-filter {
		zoom: 85%;
	}
}
</style>
