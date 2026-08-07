<template>
	<div class="modal fade" id="nodeDetails" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details">
				<div class="d-flex flex-row justify-content-between px-3 py-4 pb-0">
					<h4><b>Site Details</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
				</div>
				<div class="modal-body pt-0">
					<ul class="nav nav-underline mt-2" id="nodeDetailsTab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="node-detail-info-tab" data-bs-toggle="tab" data-bs-target="#node-detail-info-tab-pane" type="button" role="tab" aria-controls="node-detail-info-tab-pane" aria-selected="true">SITE INFORMATION</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption === 'dwdmCheckTab'" class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-dwdm-node-tab" data-bs-toggle="tab" data-bs-target="#task-list-dwdm-node-pane" type="button" role="tab" aria-controls="task-list-dwdm-node-pane" aria-selected="false">DWDM TASK LIST</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption === 'pgTracking'" class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-pg-node-tab" data-bs-toggle="tab" data-bs-target="#task-list-pg-node-pane" type="button" role="tab" aria-controls="task-list-pg-node-pane" aria-selected="false">PG TASK LIST</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-node-tab" data-bs-toggle="tab" data-bs-target="#task-list-node-pane" type="button" role="tab" aria-controls="task-list-node-pane" aria-selected="false">TASK LIST</button>
						</li>
						<li v-if="this.globalProcess.state.tab.selectedOption != 'coreRouter'" class="nav-item" role="presentation">
							<button class="nav-link" id="tt-list-node-tab" data-bs-toggle="tab" data-bs-target="#tt-list-node-pane" type="button" role="tab" aria-controls="tt-list-node-pane" aria-selected="false">TT LIST</button>
						</li>
					</ul>
					<div class="tab-content mt-3" id="nodeDetailsTabContent">
						<!-- TAB CONTENT SITE DETAIL -->
						<TabContentNodeInformation
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
						</TabContentNodeInformation>

						<!-- TAB CONTENT PG TASK DETAIL -->
						<TabContentNodeTaskListPg></TabContentNodeTaskListPg>

						<!-- TAB CONTENT DWDM TASK DETAIL -->
						<TabContentNodeTaskListDwdm></TabContentNodeTaskListDwdm>

						<!-- TAB CONTENT ALL TASK DETAIL -->
						<TabContentNodeTaskListSiteDetail></TabContentNodeTaskListSiteDetail>

						<!-- TAB CONTENT SITE TT LIST -->
						<TabContentNodeTtList></TabContentNodeTtList>
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
import TabContentNodeInformation from "../TabContent/NodeDetailTab/TabContentNodeInformation.vue";
import TabContentNodeTaskListPg from "../TabContent/NodeDetailTab/TabContentNodeTaskListPg.vue";
import TabContentNodeTaskListDwdm from "../TabContent/NodeDetailTab/TabContentNodeTaskListDwdm.vue";
import TabContentNodeTaskListSiteDetail from "../TabContent/NodeDetailTab/TabContentNodeTaskListSiteDetail.vue";
import TabContentNodeTtList from "../TabContent/NodeDetailTab/TabContentNodeTtList.vue";

export default {
	name: "ModalNodeDetails",
	data() {
		return IndexData;
	},
	components: {
		TabContentNodeInformation,
		TabContentNodeTaskListPg,
		TabContentNodeTaskListDwdm,
		TabContentNodeTaskListSiteDetail,
		TabContentNodeTtList
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
