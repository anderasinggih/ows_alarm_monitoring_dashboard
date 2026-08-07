<template>
	<div class="accordion accordion-bg-statistic width-fit-content" :id="accordionId" style="position: absolute; bottom: 55px">
		<div class="accordion-item">
			<div :id="btnTarget" class="accordion-collapse collapse" :data-bs-parent="'#' + accordionId">
				<div class="accordion-body px-3">
					<div class="row pt-2">
						<slot name="accordionCardInside" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="accordion accordion-bg-statistic width-fit-content" :id="btnId">
		<div class="accordion-item">
			<h4 class="accordion-header">
				<button class="accordion-button accordion-btn-padding px-3 py-3" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + btnTarget" aria-expanded="true" :aria-controls="btnTarget" style="color: #fe4c30" @click="handlerTtCorrelation()">
					<slot name="accordionIcon" />
					<p class="accordion-title-text text-accordion-color me-5">{{ accordionTitle }}</p>
				</button>
			</h4>
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccordionLegend",
	props: {
		accordionTitle: String,
		accordionId: String,
		btnTarget: String,
		btnId: String
	},
	methods: {
		async handlerTtCorrelation() {
			const collapseMtteMttr = document.getElementById("collapseMtteMttr");
			const mtteMttrBtn = document.getElementById("mtteMttrBtn");

			if (collapseMtteMttr.classList.contains("show")) {
				const clickEvent = new Event("click");
				mtteMttrBtn.dispatchEvent(clickEvent);
			}
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
