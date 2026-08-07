<template>
	<CardAccordionLegend class="pe-0 ps-1" :btnId="'sitedownLegendBtn'" :accordionTitle="'Map Legends'" :accordionId="'map-legend-accordion'" :btnTarget="'map-legend-card'">
		<template #accordionIcon>
			<div class="accordion-ico-bg">
				<img src="../../../../assets/ico/map-legend.png" alt="" class="legend-accordion-ico" />
			</div>
		</template>

		<template #accordionCardInside>
			<div class="d-flex flex-column gap-12 pt-3 body-legends sitedown-legend">
				<p class="font-14 font-500 text-grey">LEGENDS</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/SiteDown-Green.png" alt="" class="image-legends" />
					Normal
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/SiteDown-Blue.png" alt="" class="image-legends" />
					Site Down Below 1 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/SiteDown-Orange.png" alt="" class="image-legends" />
					Site Down 1-4 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/SiteDown-Pink.png" alt="" class="image-legends" />
					Site Down 4-8 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/SiteDown-Red.png" alt="" class="image-legends" />
					Site Down 8-24 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/SiteDown-Black.png" alt="" class="image-legends" />
					Site Down Above 24 Hr
				</p>
				<!-- yxl
				!-- SITE DOWN DURATION --
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/1.png" alt="" class="image-legends" />
					Site Down Below 1 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/1-4.png" alt="" class="image-legends" />
					Site Down 1-4 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/4-8.png" alt="" class="image-legends" />
					Site Down 4-8 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/8-24.png" alt="" class="image-legends" />
					Site Down 8-24 Hr
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/img/map-legend-sd-ne/m24.png" alt="" class="image-legends" />
					Site Down Above 24 Hr
				</p>

				<hr class="my-1" />

				!-- FME --
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/ico/fme-idle.png" alt="" class="image-legends" />
					FME Idle
				</p>
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/ico/fme-busy.png" alt="" class="image-legends" />
					FME Busy
				</p>

				<hr class="my-1" />

				!-- SITE SEARCH RESULT --
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/ico/site-marker.png" alt="" class="image-legends" />
					Selected Site Search Result
				</p>

				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/ico/fme-marker.png" alt="" class="image-legends" />
					FME Search Result
				</p>

				<hr class="my-1" />

				!-- PG --
				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/ico/PG-Available.png" alt="" class="image-legends" />
					PG Idle
				</p>

				<p class="maps-legend-font d-flex flex-row gap-8 align-items-center">
					<img src="../../../../assets/ico/PG-OTWSite.png" alt="" class="image-legends" />
					PG During PG
				</p>
				-->
			</div>
		</template>
	</CardAccordionLegend>
</template>

<script>
import CardAccordionLegend from "../../../../components/Card/CardAccodionLegend.vue";
export default {
	name: "MapLegendSiteDown",
	components: {
		CardAccordionLegend
	},
	methods: {}
};
</script>

<style>
.body-legends {
	height: 100%;
	max-height: 300px;
	overflow-y: scroll;
	overflow-x: hidden;
}

.maps-legend-font {
	font-size: 14px;
	font-weight: 500;
}

.image-legends {
	width: 24px;
}

.sitedown-legend{
	width: 16rem;
}

@media screen and (max-width: 1919px) {
	.maps-legend-font {
		font-size: 12px;
	}
}
</style>
