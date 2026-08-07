<template>
	<CardAccordion class="pe-0 ps-1" :accordionTitle="'Region Summary'" :accordionId="'site-down-hub-type-accordion'" :btnTarget="'site-down-hub-type'">
		<template #accordionIcon>
			<i class="bi bi-globe-asia-australia accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row px-2">
				<table class="table table-striped table-hover font-14" id="table-site-down-by-hub">
					<thead>
						<tr>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">Region</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">On Air</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">Site Down</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">NG Link Down(no service impact)</th>
							<!-- <th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">Circle</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">Core</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">Big</th>
							<th class="align-content-center text-center font-inter font-600" style="background: #f36900; color: #fff; font-size: 13px" rowspan="2">Medium</th> -->
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data,i) in siteDown.state.collapse.data" :key="i">
							<td class="align-content-center font-inter font-600 text-ioh text-hoverable">{{ data.region }}</td>
							<td class="align-content-center text-center font-inter font-400 px-3">{{ data.on_air_num }}</td>
							<td class="align-content-center text-center font-inter font-400 px-3">{{ data.site_down_num }}</td>
							<td class="align-content-center text-center font-inter font-400 px-3 ng_link" @click="goToAlarmPage(data.ng_url)">{{ data.ng_link_down_num }}</td>
							<!-- <td class="align-content-center font-inter font-600 text-ioh text-hoverable" @click="filterCircle(data.circle)">
								{{ data.circle }}
							</td>
							<td class="align-content-center text-center font-inter font-400 px-3">{{ data.core }}</td>
							<td class="align-content-center text-center font-inter font-400 px-3">{{ data.big }}</td>
							<td class="align-content-center text-center font-inter font-400 px-3">{{ data.medium }}</td> -->
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</CardAccordion>
</template>

<script>
import CardAccordion from "../../../../components/Card/CardAccordion.vue";

import { U,Spl } from "@adc/vigour-ui/lib/spl";
import { IndexData } from "../../../Data/IndexData";

import * as XLSX from "xlsx";

import { addLayerMarker } from "../../../Helper/MarkerFunction/addLayerMarker";
import { hideLayerMarker } from "../../../Helper/MarkerFunction/hideLayerMarker";
import { backgroundMapsPanZoom } from "../../../Helper/MapFunction/backgroundMapsPanZoom";
import { postMapsHit } from "../../../Api/session/postMapsHit";
import { getSiteDownMarker } from "../../../Api/marker/getSiteDownMarker";
import { getSiteDownByHubType } from "../../../Api/counting/getSiteDownByHubType";
import { getExportSiteDownAlarm } from "../../../Api/counting/getExportSiteDownAlarm";

export default {
	name: "SiteDownByHubType",
	data() {
		return IndexData;
	},
	components: {
		CardAccordion
	},
	async mounted() {
		await U.initCsrfToken();

		await this.getData();
	},
	methods: {
		async getData() {
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
					// this.siteDown.state.collapse.data = Object.entries(res).map(([circle, values]) => ({
					// 	circle,
					// 	...values
					// }));
					this.siteDown.state.collapse.data = res;
					this.siteDown.store.exportSiteDownAlarm.loading = false;
				})
				.catch((error) => {
					this.siteDown.store.exportSiteDownAlarm.loading = false;
					console.error(error);
				});

			// await getExportSiteDownAlarm()
			// 	.then(({ res }) => {
			// 		this.siteDown.store.exportSiteDownAlarm.data = res;
			// 		this.siteDown.state.collapse.loading = false;
			// 	})
			// 	.catch((error) => {
			// 		this.siteDown.state.collapse.loading = false;
			// 		console.error(error);
			// 	});
		},
		async filterCircle(region) {
			const mapZoomLocation = [
				{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
				{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
				{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
				{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
			];

			const matchedLocation = mapZoomLocation.find((location) => location.area_name === region);

			this.siteDown.state.siteDownHubType.clearFilter = true;

			await U.initCsrfToken();

			await this.getMarkerAndZoom(matchedLocation);
		},
		async getMarkerAndZoom(data) {
			let locationData = data;

			backgroundMapsPanZoom(locationData.lat, locationData.lon, locationData.zoom);

			this.siteDown.checker.marker.oneHour = true;
			this.siteDown.checker.marker.fourHour = true;
			this.siteDown.checker.marker.eightHour = true;
			this.siteDown.checker.marker.twentyFourHour = true;
			this.siteDown.checker.marker.moreDay = true;

			this.siteDown.checker.hub.core = true;
			this.siteDown.checker.hub.big = true;
			this.siteDown.checker.hub.medium = true;
			this.siteDown.checker.hub.small = false;
			this.siteDown.checker.hub.end = false;

			this.siteDown.checker.vip.isVip = false;
			this.siteDown.checker.vip.nonVip = false;

			this.siteDown.checker.power.isPowerAlarm = false;

			this.siteDown.checker.siteType.n3t = true;
			this.siteDown.checker.siteType.uso = true;
			this.siteDown.checker.siteType.all = true;

			this.siteDown.selector.region.value = locationData;
			this.siteDown.selector.region.selectedOption = locationData.area_name;

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
				this.siteDown.state.modalExport.showHubBadge = true;
				this.siteDown.state.modalExport.showRegionBadge = true;

				this.siteDown.apiParams.circleString = locationData.area_name;
				this.siteDown.apiParams.hubTypeString = this.siteDown.apiParams.hubType.join(",");
				//

				hideLayerMarker(this.siteDown.marker.aging.arraySiteDown);

				console.log(this.siteDown.apiParams.hubType, "hub type before params");

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
		goToAlarmPage(url){
			Spl.Page.openTab(
				url,
				{ target: "_tab" },
				{}
			);
		}
	}
};
</script>

<style>
#table-site-down-by-hub .table-striped > tbody > tr:nth-of-type(odd) > * {
	--bs-table-bg-type: #fdf1ef !important;
}

#site-down-hub-type .accordion-body {
	padding-bottom: 0px !important;
}

#site-down-hub-type .ng_link{
    cursor: pointer;
    color: #007bff;
}
</style>
