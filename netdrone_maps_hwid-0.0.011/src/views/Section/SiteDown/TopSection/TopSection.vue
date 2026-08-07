<template>
	<section class="row row-map ps-2 pt-0 mt-2">
		<div class="col-3 pe-1">
			<TotalOutages />
		</div>
		<div class="col-9 ps-1 pe-1">
			<DurationRange
				:powerAlarm="this.siteDown.apiParams.powerAlarm"
				:hubType="this.siteDown.apiParams.hubType"
				:state="this.componentState"
				:vip="this.siteDown.apiParams.vipCheck"
				:mcCluster="this.globalProcess.apiParams.mcClusterData"
				:mcSelected="this.siteDown.selector.mcCluster.value"
				:regionSelected="this.siteDown.selector.region.selectedOption"
				:siteType="this.siteDown.apiParams.siteType"
				:selectedArea="this.siteDown.selector.area.value"
			/>
		</div>
		<div class="col-1 pe-1 mt-2 width-fit-content">
			<!-- <CollapseMtteMttr /> -->
			<VendorWise :vendorWiseData="this.siteDown.vendorWiseData"/>
			<!-- <VendorWise
				:hubType="this.siteDown.apiParams.hubCheck"
				:state="this.siteDown.apiParams.siteDownChecker"
				:vip="this.siteDown.apiParams.vipCheck"
				:regionSelected="this.siteDown.selector.area.value"
				:siteType="this.siteDown.apiParams.siteType"
				:siteDown="this.siteDown.apiParams.siteDownCheck"
				:start_time="this.siteDown.start_time"
				:end_time="this.siteDown.end_time"
			/> -->
			<!-- <CollapseObd />
			<CollapseDemarcation /> -->
		</div>
		<slot name="loadingSection" />
	</section>
</template>

<script>
import TotalOutages from "./TotalOutages.vue";
import DurationRange from "./DurationRange.vue";
import CollapseMtteMttr from "./CollapseMtteMttr.vue";
import CollapseObd from "./CollapseObd.vue";

import { IndexData } from "../../../Data/IndexData";
import VendorWise from "./VendorWise.vue";
// import CollapseDemarcation from "./CollapseDemarcation.vue";

export default {
	name: "TopSection",
	components: {
		TotalOutages,
		DurationRange,
		CollapseMtteMttr,
		CollapseObd,
		VendorWise,
		// CollapseDemarcation
	},
	data() {
		return IndexData;
	}
};
</script>
