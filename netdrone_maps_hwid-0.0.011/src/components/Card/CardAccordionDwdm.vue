<template>
	<div class="card card-accordion-inside-dwdm px-3 py-3">
		<p class="card-title-text mb-3 text-center font-600">{{ title }}</p>
		<div class="row">
			<div class="col-12">
				<h3 v-if="totalSiteDown != '...'" class="font-600 text-center">{{ totalSiteDown }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
					<div class="bg-card-loader"></div>
				</div>
				<p class="text-center font-11">{{ subtitle }}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccordionDwdm",
	props: {
		totalSiteDown: String,
		title: String,
		subtitle: String
	}
};
</script>

<style>
.card-accordion-inside-dwdm {
	background-color: #cecece26;
	border: none;
}

.accordion-card-counting {
	font-weight: 600;
}
</style>
