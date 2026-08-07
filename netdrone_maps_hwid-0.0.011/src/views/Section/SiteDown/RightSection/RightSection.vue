<template>
	<section class="row row-right ps-0 pt-0 mt-2 pe-1">
		<TtCorrelation />
		<!-- <VendorWise
			:powerAlarm="this.siteDown.apiParams.powerAlarm"
			:hubType="this.siteDown.apiParams.hubType"
			:state="this.componentState"
			:vip="this.siteDown.apiParams.vipCheck"
			:mcCluster="this.globalProcess.apiParams.mcClusterData"
			:mcClusterFilter="this.siteDown.selector.mcCluster.value"
			:regionSelected="this.siteDown.selector.region.selectedOption"
			:siteType="this.siteDown.apiParams.siteType"
			:selectedArea="this.siteDown.selector.area.value"
		/> -->
		<SiteDownByHubType />
		<SiteDownByInitialRca />
		<!-- yxl 隐藏 RegionWise 
		<RegionWise
			:powerAlarm="this.siteDown.apiParams.powerAlarm"
			:hubType="this.siteDown.apiParams.hubType"
			:state="this.componentState"
			:vip="this.siteDown.apiParams.vipCheck"
			:mcCluster="this.globalProcess.apiParams.mcClusterData"
			:mcClusterFilter="this.siteDown.selector.mcCluster.value"
			:regionSelected="this.siteDown.selector.region.selectedOption"
			:siteType="this.siteDown.apiParams.siteType"
			:selectedArea="this.siteDown.selector.area.value"
		/>
		-->
	</section>
</template>

<script>
import RegionWise from "./RegionWiseNew.vue";
import VendorWise from "./VendorWise.vue";
import SiteDownByHubType from "./SiteDownByHubType.vue";
import SiteDownByInitialRca from "./SiteDownByInitialRca.vue";

import { IndexData } from "../../../Data/IndexData";
import TtCorrelation from "./TtCorrelation.vue";
// import ModalExportSiteDownByCircle from "../../../../components/Modal/ModalExportSiteDownByCircle.vue";

export default {
	name: "RightSection",
	components: {
		RegionWise,
		VendorWise,
		SiteDownByHubType,
		SiteDownByInitialRca,
		TtCorrelation
		// ModalExportSiteDownByCircle
	},
	data() {
		return IndexData;
	}
};
</script>
