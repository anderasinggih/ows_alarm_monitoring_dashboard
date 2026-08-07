<template>
	<div class="modal fade" id="siteDetails" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details">
				<div class="d-flex flex-row justify-content-between px-3 py-4 pb-0">
					<h4><b>Site Details</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
				</div>
				<div class="modal-body pt-0">
					<ul class="nav nav-underline mt-2" id="siteDetailsTab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="site-detail-info-tab" data-bs-toggle="tab" data-bs-target="#site-detail-info-tab-pane" type="button" role="tab" aria-controls="site-detail-info-tab-pane" aria-selected="true">SITE INFORMATION</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption === 'dwdmCheckTab'" class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-dwdm-site-tab" data-bs-toggle="tab" data-bs-target="#task-list-dwdm-site-pane" type="button" role="tab" aria-controls="task-list-dwdm-site-pane" aria-selected="false">DWDM TASK LIST</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption === 'pgTracking'" class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-pg-site-tab" data-bs-toggle="tab" data-bs-target="#task-list-pg-site-pane" type="button" role="tab" aria-controls="task-list-pg-site-pane" aria-selected="false">PG TASK LIST</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-site-tab" data-bs-toggle="tab" data-bs-target="#task-list-site-pane" type="button" role="tab" aria-controls="task-list-site-pane" aria-selected="false">TASK LIST</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="tt-list-site-tab" data-bs-toggle="tab" data-bs-target="#tt-list-site-pane" type="button" role="tab" aria-controls="tt-list-site-pane" aria-selected="false">TT LIST</button>
						</li>
					</ul>
					<div class="tab-content mt-3" id="siteDetailsTabContent">
						<!-- TAB CONTENT SITE DETAIL -->
						<TabContentSiteInformation
							:siteName="this.globalProcess.store.site.information.siteItem"
							:siteId="this.globalProcess.store.site.information.siteItem"
							:siteAlarmList="this.globalProcess.store.site.alarm.siteAlarmList"
							:powerAlarmList="this.globalProcess.store.site.alarm.powerAlarmList"
							:isDwdm="this.dwdm.state.isDwdmSite"
							:isCoreRouter="this.coreRouter.state.isCoreRouterSite"
							:coreRouterUnmanaged="this.globalProcess.store.site.alarm.coreRouterUnmanaged"
							:coreRouterHardware="this.globalProcess.store.site.alarm.coreRouterHardware"
							:coreRouterPower="this.globalProcess.store.site.alarm.coreRouterPower"
							:coreRouterLinkDown="this.globalProcess.store.site.alarm.coreRouterLinkDown"
							:coreRouterHighTemp="this.globalProcess.store.site.alarm.coreRouterHighTemp"
							:coreRouterHighUtil="this.globalProcess.store.site.alarm.coreRouterHighUtil"
							:dwdmAlarmList="this.globalProcess.store.site.alarm.dwdmAlarmList"
							:dwdmTemperatureAlarmList="this.globalProcess.store.site.alarm.dwdmTemperatureAlarmList"
							:dwdmTransportAlarmList="this.globalProcess.store.site.alarm.dwdmTransportAlarmList"
							:tabState="this.globalProcess.state.tab.selectedOption"
						>
						</TabContentSiteInformation>

						<!-- TAB CONTENT PG TASK DETAIL -->
						<TabContentTaskListPg></TabContentTaskListPg>

						<!-- TAB CONTENT DWDM TASK DETAIL -->
						<TabContentTaskListDwdm></TabContentTaskListDwdm>

						<!-- TAB CONTENT ALL TASK DETAIL -->
						<TabContentTaskListSiteDetail></TabContentTaskListSiteDetail>

						<!-- TAB CONTENT SITE TT LIST -->
						<TabContentSiteTtList></TabContentSiteTtList>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// DATA
import { IndexData } from "../../views/Data/IndexData";

// COMPONENT
import TabContentSiteInformation from "../TabContent/SiteDetailTab/TabContentSiteInformation.vue";
import TabContentTaskListDwdm from "../TabContent/SiteDetailTab/TabContentTaskListDwdm.vue";
import TabContentTaskListPg from "../TabContent/SiteDetailTab/TabContentTaskListPg.vue";
import TabContentTaskListSiteDetail from "../TabContent/SiteDetailTab/TabContentTaskListSiteDetail.vue";
import TabContentSiteTtList from "../TabContent/SiteDetailTab/TabContentSiteTtList.vue";

export default {
	name: "ModalSiteDetails",
	data() {
		return IndexData;
	},
	components: {
		TabContentSiteInformation,
		TabContentTaskListSiteDetail,
		TabContentTaskListDwdm,
		TabContentTaskListPg,
		TabContentSiteTtList
	},
	methods: {
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
		}
	}
};
</script>

<style>
.width-250 {
	width: 250px !important;
}

.width-200 {
	width: 200px !important;
}
</style>
