<template>
	<section class="row row-map-bottom ps-2 pt-0 mt-2">
		<div class="col-12">
			<MapLegendSiteDown />
		</div>
	</section>
	<button class="btn btn-clear-search d-flex flex-row btn-floating font-500 font-16" @click="clearSearch()" v-if="this.globalProcess.state.searching.clearSearchBtn == true">
		Clear
		<i class="bi bi-x ms-2"></i>
	</button>
	<button class="btn btn-clear-search d-flex flex-row btn-floating font-500 font-16" @click="clearHubType()" v-if="this.siteDown.state.siteDownHubType.clearFilter == true">
		Clear
		<i class="bi bi-x ms-2"></i>
	</button>
</template>

<script>
import MapLegendSiteDown from "./MapLegendSiteDown.vue";
import { IndexData } from "../../../Data/IndexData.js";
import { toRaw } from "vue";
import { siteSearchMarker, coverageSite, coverageFme, fmeSearchMarker, coverageMcCluster } from "../../../Data/GlobalData.js";

// import { ClearFilter } from "../../../Helper/PgTracking/clearFilterFunction.js";
import { backgroundMapsPanZoom } from "../../../Helper/MapFunction/backgroundMapsPanZoom.js";
import { hideLayerMarker } from "../../../Helper/MarkerFunction/hideLayerMarker.js";
import { getSiteDownMarker } from "../../../Api/marker/getSiteDownMarker.js";
import { addLayerMarker } from "../../../Helper/MarkerFunction/addLayerMarker.js";
import { postMapsHit } from "../../../Api/session/postMapsHit.js";

export default {
	name: "BottomSectionSitedown",
	components: {
		MapLegendSiteDown
	},
	data() {
		return IndexData;
	},
	methods: {
		async clearHubType() {
			this.siteDown.state.siteDownHubType.clearFilter = false;
			backgroundMapsPanZoom(0.55942, 125.348276, 5.0);

			this.siteDown.checker.marker.oneHour = true;
			this.siteDown.checker.marker.fourHour = true;
			this.siteDown.checker.marker.eightHour = false;
			this.siteDown.checker.marker.twentyFourHour = false;
			this.siteDown.checker.marker.moreDay = false;

			this.siteDown.checker.hub.core = false;
			this.siteDown.checker.hub.big = false;
			this.siteDown.checker.hub.medium = false;
			this.siteDown.checker.hub.small = false;
			this.siteDown.checker.hub.end = false;

			this.siteDown.checker.vip.isVip = false;
			this.siteDown.checker.vip.nonVip = false;

			this.siteDown.checker.power.isPowerAlarm = false;

			this.siteDown.checker.siteType.n3t = false;
			this.siteDown.checker.siteType.uso = false;
			this.siteDown.checker.siteType.all = true;

			this.siteDown.selector.region.value = null;
			this.siteDown.selector.region.selectedOption = "";

			try {
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

				const hubValueMarkerConfig = [
					{ check: "core", param: "CORE SITE" },
					{ check: "big", param: "BIG HUB SITE" },
					{ check: "medium", param: "MEDIUM HUB SITE" },
					{ check: "small", param: "SMALL HUB SITE" },
					{ check: "end", param: "END SITE" }
				];

				const updateHubType = () => {
					this.siteDown.apiParams.hubType = hubValueMarkerConfig.filter((item) => this.siteDown.checker.hub[item.check]).map((item) => item.param);
				};

				updateHubType();

				console.log(this.siteDown.apiParams.hubType, "hub type");

				this.siteDown.apiParams.vipCheck = this.siteDown.checker.vip.isVip ? true : this.siteDown.checker.vip.nonVip ? false : null;

				this.siteDown.apiParams.powerAlarm = this.siteDown.checker.power.isPowerAlarm;

				const siteTypeValueConfig = [
					{ check: "all", param: "NORMAL" },
					{ check: "n3t", param: "N3T" },
					{ check: "uso", param: "USO" }
				];

				const updateSiteType = () => {
					this.siteDown.apiParams.siteType = siteTypeValueConfig.filter((item) => this.siteDown.checker.siteType[item.check]).map((item) => item.param);
				};

				updateSiteType();

				// LOADING STATE
				this.globalProcess.state.component.siteDownMarkerMessage = "Loading Site Down Marker";
				this.globalProcess.state.component.siteDownMarkerLoading = true;
				this.globalProcess.state.component.siteDownDataLoading = true;
				//

				// APPLY BADGE STATE
				this.siteDown.state.modalExport.showHubBadge = false;
				this.siteDown.state.modalExport.showRegionBadge = false;

				this.siteDown.apiParams.circleString = "";
				this.siteDown.apiParams.hubTypeString = "";
				//

				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);

				try {
					const { res } = await getSiteDownMarker(
						this.siteDown.apiParams.siteDownChecker,
						this.siteDown.apiParams.powerAlarm,
						this.siteDown.apiParams.hubType,
						this.siteDown.apiParams.vipCheck,
						this.globalProcess.query.mc.searchQuery,
						"",
						this.siteDown.selector.mcCluster.value,
						this.siteDown.selector.region.selectedOption,
						this.siteDown.apiParams.siteType,
						this.siteDown.selector.area.value
					);
					this.siteDown.marker.aging.arraySiteDown.data = res;
					addLayerMarker(this.siteDown.marker.aging.arraySiteDown, this.globalProcess.store.maps.backgroundMaps, this);

					await postMapsHit("Apply Filter SiteDown", this.siteDown.marker.aging.arraySiteDown.data.length, "Site Down Marker", new Date());
				} catch (error) {
					console.error(`Error fetching marker data for:`, error);
				}

				this.componentState = this.componentState + 1;

				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.globalProcess.state.component.siteDownDataLoading = false;
				this.globalProcess.state.component.applyFilterLoading = false;
			} catch (error) {
				this.globalProcess.state.component.applyFilterLoading = false;
				this.globalProcess.state.component.siteDownMarkerLoading = false;
				this.globalProcess.state.component.siteDownDataLoading = false;
				console.error("Error applying filter:", error);
			}
		},
		async clearSearch() {
			this.siteDown.state.ttCorrelation.showTtId = false;

			if (siteSearchMarker != null) {
				toRaw(siteSearchMarker).setMap(null);
			}

			if (fmeSearchMarker != null) {
				toRaw(fmeSearchMarker).setMap(null);
			}

			if (coverageFme != null) {
				coverageFme.setMap(null);
			}

			if (coverageMcCluster != null) {
				coverageMcCluster.setMap(null);
			}

			this.globalProcess.apiParams.mcClusterData = "";

			// STATE
			if (this.globalProcess.state.tab.selectedOption == "siteDown") {
				this.componentState = this.componentState + 1;
				this.globalProcess.state.searching.clearSearchBtn = false;
			} else if (this.globalProcess.state.tab.selectedOption == "pgTracking") {
				this.globalProcess.state.tab.selectedOption = "pgTracking";
				// this.globalProcess.state.component.loadingMarkerPg = true;

				// PAN MAP TO JAKARTA
				var coord = { lat: parseFloat(-6.173321), lng: parseFloat(106.840754) };
				this.globalProcess.store.maps.backgroundMaps.panTo(coord);
				this.globalProcess.store.maps.backgroundMaps.setZoom(11.7);

				// HIDE SEARCHING
				if (siteSearchMarker != null) {
					toRaw(siteSearchMarker).setMap(null);
				}
				if (coverageSite != null) {
					coverageSite.setMap(null);
				}

				if (siteSearchMarker != null) {
					toRaw(siteSearchMarker).setMap(null);
				}

				if (coverageFme != null) {
					coverageFme.setMap(null);
				}

				if (fmeSearchMarker != null) {
					toRaw(fmeSearchMarker).setMap(null);
				}

				if (coverageMcCluster != null) {
					coverageMcCluster.setMap(null);
				}
				this.globalProcess.state.searching.clearSearchBtn = false;
			}
		}
	}
};
</script>

<style>
.btn-floating {
	bottom: 15px;
	position: absolute;
	left: 47vw;
	font-size: 14px;
	padding: 10px 15px;
}
</style>
