<template>
	<CardAccordion :accordionTitle="'Total Outages Down'" :accordionId="'outages-card-accordion'" :btnTarget="'outages-card'">
		<template #accordionIcon>
			<i class="bi bi-send-fill accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row row-gap-12">
				<div class="col-12">
					<CardAccordionSiteDown :totalSiteDown="this.total"  :subtitle="'Site Down'">
						<template #downloadTotalDataBtn>
							<button class="btn btn-download-ne-total" data-bs-toggle="modal" data-bs-target="#exportSiteDownDuration" @click="uniqueNeTrigger()">
								<i class="bi bi-download"></i>
							</button>
						</template>
					</CardAccordionSiteDown>
				</div>
			</div>
		</template>
	</CardAccordion>
	<CardAccordion :accordionTitle="'Total Cell Down'" :accordionId="'outages-card-cell'" :btnTarget="'outages-cell'" show="false">
		<template #accordionIcon>
			<i class="bi bi-send-fill accordion-btn-icon"></i>
		</template>

		<template #accordionCardInside>
			<div class="row row-gap-12">
				<div class="col-12">
					<CardAccordionSiteDown :totalSiteDown="this.totalCell"  :subtitle="'Total Cell Down'">
						<template #goToAlarmPageBtn>
							<button class="btn btn-download-ne-total" @click="goToAlarmPage()">
								<i class="bi bi-send-fill"></i>
							</button>
						</template>
					</CardAccordionSiteDown>
				</div>
			</div>
		</template>
	</CardAccordion>
</template>

<script>
import CardAccordion from "../../../../components/Card/CardAccordion.vue";
import CardAccordionSiteDown from "../../../../components/Card/CardAccordionSiteDown.vue";

import { DurationData } from "../../../Data/DurationData.js";
import { IndexData } from "../../../Data/IndexData.js";
import { Spl } from "@adc/vigour-ui/lib/spl";

export default {
	name: "TotalOutages",
	components: {
		CardAccordion,
		CardAccordionSiteDown
	},
	data() {
		return DurationData;
	},
	methods: {
		uniqueNeTrigger() {
			IndexData.siteDown.state.modalExport.title = "All Site Down";
			IndexData.siteDown.state.modalExport.step = "all-selected";
			IndexData.siteDown.state.modalExport.isRegionWise = false;
			IndexData.siteDown.state.modalExport.showing++;
		},
		goToAlarmPage(){
			Spl.Page.openTab(
				this.cellUrl,
				{ target: "_tab" },
				{}
			);
		}
	}
};
</script>
