<template>
	<div class="accordion accordion-bg-statistic width-fit-content">
		<div class="accordion-item">
			<h4 class="accordion-header">
				<button class="accordion-button accordion-btn-padding px-3 py-3" id="accordionLegendBtn" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + btnTarget" aria-expanded="true" :aria-controls="btnTarget" style="color: #fe4c30" @click="handlerMapLegendPg()">
					<slot name="accordionIcon" />
					<p class="accordion-title-text text-accordion-color me-5">{{ accordionTitle }}</p>
				</button>
			</h4>
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccodionLegendBreakdown",
	props: {
		accordionTitle: String,
		accordionId: String,
		btnTarget: String
	},
	methods: {
		async handlerMapLegendPg() {
			const breakdownCollapse = document.getElementById("break-down-card");
			const pgLegendBtn = document.getElementById("pgLegendBtn");
			const mapLegend = document.getElementById("map-legend-accordion");

			setTimeout(() => {
				if (breakdownCollapse.classList.contains("show")) {
					pgLegendBtn.style.display = "none";
					mapLegend.style.display = "none";
				} else {
					pgLegendBtn.style.display = "block";
					mapLegend.style.display = "block";
				}
			}, 400);
		}
	}
};
</script>

<style>
.text-accordion-color {
	color: rgb(254, 76, 48) !important;
}

.accordion-btn-padding {
	padding: 5px 20px !important;
}

@media screen and (max-width: 1919px) {
	.accordion-title-text {
		font-size: 13px !important;
	}
}
</style>
