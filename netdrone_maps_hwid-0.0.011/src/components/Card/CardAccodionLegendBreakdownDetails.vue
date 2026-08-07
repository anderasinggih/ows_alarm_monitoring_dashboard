<template>
	<div class="accordion accordion-bg-statistic" :id="accordionId">
		<div class="accordion-item">
			<div :id="btnTarget" class="accordion-collapse collapse" :data-bs-parent="'#' + accordionId">
				<div class="accordion-body px-3">
					<div class="row pt-2">
						<slot name="accordionLegendBreakdownInside" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccodionLegendBreakdownDetails",
	props: {
		accordionTitle: String,
		accordionId: String,
		btnTarget: String
	}
};
</script>
