<template>
	<div :class="accordionId == 'outages-card-cell' ? 'accordion accordion-bg-statistic mt-6' : 'accordion accordion-bg-statistic'" :id="accordionId">
		<div class="accordion-item">
			<h4 class="accordion-header">
				<button :class="show == 'show' ? 'accordion-button px-3 py-4' : 'accordion-button px-3 py-4 collapsed'" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + btnTarget" aria-expanded="false" :aria-controls="btnTarget" style="color: #fe4c30">
					<slot name="accordionIcon" />
					{{ accordionTitle }}
				</button>
			</h4>
			<div :id="btnTarget" :class="show == 'show' ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'" :data-bs-parent="'#' + accordionId" aria-expanded="false">
				<div class="accordion-body px-3">
					<slot name="accordionCardInside" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccordion",
	props: {
		accordionTitle: {
			type: String,
			required: true
		},
		accordionId: {
			type: String,
			required: true
		},
		btnTarget: {
			type: String,
			required: true
		},
		show: {
			type: String,
			default: "show"
		}
	}
};
</script>
<style scoped>
.mt-6 {
	margin-top: 6px;
}
</style>
