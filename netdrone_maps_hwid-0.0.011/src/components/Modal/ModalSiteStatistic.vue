<template>
	<div class="modal fade" id="statisticModal" aria-hidden="true" aria-labelledby="modalFilterNetdrone" tabindex="-1">
		<div class="modal-dialog modal-xxl modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="d-flex justify-content-between">
						<div class="d-flex flex-row align-items-center gap-12 mb-4">
							<h3 class="font-700 text-dark">Site Statistic</h3>
							<div class="bg-card-loader bg-loader-details-modal" v-if="this.buttonState == 1"></div>
						</div>
						<button @click="handleHideModal()" type="button" class="btn-close" data-bs-dismiss="modal"
							aria-label="Close"></button>
					</div>
					<div class="d-flex flex-row width-100 gap-12">
						<CardSiteStatistic :cardState="this.cardState" :cardTitle="'National'"
							:onClick="() => openTabExportOutside('NATIONAL')" :uniqueSiteDown="this.uniqSdNationalSd"
							:percentNeDown2G="this.pct2gNeDownNationalSd" :neDown2G="this.neDown2gNationalSd"
							:siteImpacted2G="this.siteImpacted2gNationalSd" :cellDown2G="this.cellDown2gNationalSd"
							:totalSite2G="this.total2gSiteNationalSd" :percentageNeDown4G="this.pct4gNeDownNationalSd"
							:neDown4G="this.neDown4gNationalSd" :siteImpacted4G="this.siteImpacted4gNationalSd"
							:cellDown4G="this.cellDown4gNationalSd" :totalSite4G="this.total4gSiteNationalSd">
						</CardSiteStatistic>

						<CardSiteStatistic :cardState="this.cardState" :cardTitle="'JAYA'"
							:onClick="() => openTabExportOutside('JAYA')" :uniqueSiteDown="this.uniqSdJayaSd"
							:percentNeDown2G="this.pct2gNeDownJayaSd" :neDown2G="this.neDown2gJayaSd"
							:siteImpacted2G="this.siteImpacted2gJayaSd" :cellDown2G="this.cellDown2gJayaSd"
							:totalSite2G="this.total2gSiteJayaSd" :percentageNeDown4G="this.pct4gNeDownJayaSd"
							:neDown4G="this.neDown4gJayaSd" :siteImpacted4G="this.siteImpacted4gJayaSd"
							:cellDown4G="this.cellDown4gJayaSd" :totalSite4G="this.total4gSiteJayaSd">
						</CardSiteStatistic>

						<CardSiteStatistic :cardState="this.cardState" :cardTitle="'JAVA'"
							:onClick="() => openTabExportOutside('JAVA')" :uniqueSiteDown="this.uniqSdJavaSd"
							:percentNeDown2G="this.pct2gNeDownJavaSd" :neDown2G="this.neDown2gJavaSd"
							:siteImpacted2G="this.siteImpacted2gJavaSd" :cellDown2G="this.cellDown2gJavaSd"
							:totalSite2G="this.total2gSiteJavaSd" :percentageNeDown4G="this.pct4gNeDownJavaSd"
							:neDown4G="this.neDown4gJavaSd" :siteImpacted4G="this.siteImpacted4gJavaSd"
							:cellDown4G="this.cellDown4gJavaSd" :totalSite4G="this.total4gSiteJavaSd">
						</CardSiteStatistic>

						<CardSiteStatistic :cardState="this.cardState" :cardTitle="'KSMP'"
							:onClick="() => openTabExportOutside('KALISUMAPA')" :uniqueSiteDown="this.uniqSdKsmpSd"
							:percentNeDown2G="this.pct2gNeDownKsmpSd" :neDown2G="this.neDown2gKsmpSd"
							:siteImpacted2G="this.siteImpacted2gKsmpSd" :cellDown2G="this.cellDown2gKsmpSd"
							:totalSite2G="this.total2gSiteKsmpSd" :percentageNeDown4G="this.pct4gNeDownKsmpSd"
							:neDown4G="this.neDown4gKsmpSd" :siteImpacted4G="this.siteImpacted4gKsmpSd"
							:cellDown4G="this.cellDown4gKsmpSd" :totalSite4G="this.total4gSiteKsmpSd">
						</CardSiteStatistic>

						<CardSiteStatistic :cardState="this.cardState" :cardTitle="'SMTR'"
							:onClick="() => openTabExportOutside('SUMATERA')" :uniqueSiteDown="this.uniqSdSmtrSd"
							:percentNeDown2G="this.pct2gNeDownSmtrSd" :neDown2G="this.neDown2gSmtrSd"
							:siteImpacted2G="this.siteImpacted2gSmtrSd" :cellDown2G="this.cellDown2gSmtrSd"
							:totalSite2G="this.total2gSiteSmtrSd" :percentageNeDown4G="this.pct4gNeDownSmtrSd"
							:neDown4G="this.neDown4gSmtrSd" :siteImpacted4G="this.siteImpacted4gSmtrSd"
							:cellDown4G="this.cellDown4gSmtrSd" :totalSite4G="this.total4gSiteSmtrSd">
						</CardSiteStatistic>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- TRIGGER MODAL -->
	<button type="button" ref="siteTableButton" class="btn download-button" data-bs-toggle="modal"
		data-bs-target="#siteStatisticTable" style="display: none; visibility: hidden"></button>

	<ModalSiteStatisticTable></ModalSiteStatisticTable>
</template>

<script>
import { U } from "@adc/vigour-ui/lib/spl";

import { SiteStatisticData } from "../../views/Data/SiteStatisticData.js";
import { getSiteDownSiteStatistic } from "../../views/Api/counting/getSiteDownSiteStatistic.js";
import { getSiteStatisticByRegion } from "../../views/Api/counting/getSiteStatisticByRegion.js";

import CardSiteStatistic from "../Card/CardSiteStatistic.vue";
import ModalSiteStatisticTable from "./ModalSiteStatisticTable.vue";

export default {
	name: "ModalSiteStatistic",
	components: {
		CardSiteStatistic,
		ModalSiteStatisticTable
	},
	props: {
		modalOpened: Number,
		hideModal: Function
	},
	watch: {
		modalOpened(newVal, oldVal) {
			if (newVal != oldVal) {
				U.initCsrfToken();
				// setTimeout(() => {
				// 	this.getSiteStatsData();
				// }, 3000);
			}
		},
		"state.export.siteType": function (newVal) {
			this.state.export.siteTypeStat = newVal;
		}
	},
	data() {
		return SiteStatisticData;
	},
	async mounted() {
		await U.initCsrfToken();

		await this.updateLastUpdatedTime();
		// await this.checkRefetchData();
	},
	methods: {
		handleHideModal() {
			if (typeof this.hideModal === "function") {
				this.hideModal();
			}
			this.cardState = 0;
		},
		async getSiteStatsData() {
			if (this.cardState == 0) {
				await getSiteDownSiteStatistic()
					.then(({ res }) => {
						const locationMapping = {
							JAYA: "Jaya",
							JAVA: "Java",
							KSMP: "Ksmp",
							SMTR: "Smtr",
							NATIONAL: "National"
						};

						for (let i = 0; i < res.length; i++) {
							const locationKey = locationMapping[res[i].location];
							if (locationKey) {
								this[`uniqSd${locationKey}Sd`] = res[i].unique_sitedown;
								this[`pct2gNeDown${locationKey}Sd`] = res[i].pct_down_2g.toFixed(3);
								this[`neDown2g${locationKey}Sd`] = res[i].nedown_2g;
								this[`siteImpacted2g${locationKey}Sd`] = res[i].site_impacted_2g;
								this[`cellDown2g${locationKey}Sd`] = res[i].celldown_2g;
								this[`total2gSite${locationKey}Sd`] = res[i].total_2g_site;
								this[`pct4gNeDown${locationKey}Sd`] = res[i].pct_down_4g.toFixed(3);
								this[`neDown4g${locationKey}Sd`] = res[i].nedown_4g;
								this[`siteImpacted4g${locationKey}Sd`] = res[i].site_impacted_4g;
								this[`cellDown4g${locationKey}Sd`] = res[i].celldown_4g;
								this[`total4gSite${locationKey}Sd`] = res[i].total_4g_site;
							}
						}
						this.cardState = 1;
						this.refetch = false;
					})
					.catch((error) => {
						this.refetch = false;
						console.error("Error fetching data:", error);
					});
			}
		},
		openTabExportOutside(region) {
			this.exportRegionDetail = region.replace("&", "%26");

			// SITE TYPE
			const siteTypeSelected = this.state.export.siteTypeStat;
			const siteTypeString = siteTypeSelected.join("_");

			// HUB TYPE
			const hubTypeSelected = this.state.siteDown.hubType;

			const hubTypeString = hubTypeSelected
				.map((type) => type.replace(/( SITE| HUB)/g, "")) // remove "SITE" and "HUB"
				.join("_")
				.toUpperCase(); // convert to uppercase if required

			const finalOutput = `${hubTypeString}`;
			console.log(finalOutput, "hub type string");

			// IS VIP
			const isVipSelected = this.state.siteDown.isVip;
			const isVipString = isVipSelected != null ? isVipSelected.toString() : "";

			window.open("https://1057-sg.teleows.com/app/1057/spl/netdrone_maps_v3/netdrone_maps_v3/export_alarm.spl?circle=" + this.exportRegionDetail + "&hub_type=" + finalOutput + "&is_vip=" + isVipString + "&site_type=" + siteTypeString, "_blank");
		},

		async showTableModal(title, region) {
			this.currentRegionDetail = region.replace("&", "%26");
			this.titleModal = title;
			this.dataTable = null;
			this.cardState == 0;
			this.buttonState = 1;
			if (this.buttonState == 1) {
				await getSiteStatisticByRegion(region)
					.then(({ res }) => {
						this.dataTable = res;
						this.$refs.siteTableButton.click();
						this.loadingModal = false;
						this.buttonState = 2;
					})
					.catch((error) => {
						console.error("Error fetching data:", error);
						this.loadingModal = false;
					});
			}
		},
		// REFETCH
		async updateLastUpdatedTime() {
			const now = new Date();
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const hours = now.getHours().toString().padStart(2, "0");
			const roundedMinutes = Math.floor(now.getMinutes() / 15) * 15;

			this.todayDate = today.toLocaleDateString();
			this.lastUpdated = `${hours}:${roundedMinutes.toString().padStart(2, "0")}`;
		},

		async checkRefetchData() {
			const now = new Date();
			const minutes = now.getMinutes();

			if ([2, 17, 32, 47].includes(minutes)) {
				await this.getSiteStatsData();
				this.refetch = true;
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

<style>
.bg-loader-details-modal {
	width: 40px !important;
}
</style>
