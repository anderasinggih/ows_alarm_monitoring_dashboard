<template>
	<div v-if="subtitle == 'Site Down'" class="card card-accordion-inside px-3 py-3" id="card-accordion-outages" @mouseover="hovered = true" @mouseleave="hovered = false">
		<!-- <div v-if="!hovered" class="d-flex flex-column"> -->
		<p class="card-title-text mb-3 text-center font-600 text-white">{{ subtitle }}</p>
		<div v-if="!hovered" class="row">
			<div class="col-12">
				<h3 v-if="totalSiteDown != '...'" class="site-down-ctext font-600 text-center text-white">{{ totalSiteDown }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
					<div class="bg-card-loader-white"></div>
				</div>
				<p class="text-center font-12 text-white">Total {{ subtitle }}</p>
			</div>
		</div>
		<div v-else class="d-flex flex-column align-items-center mt-1">
			<slot name="downloadTotalDataBtn" />
		</div>
	</div>
	<div v-else class="card card-accordion-inside px-3 py-3" id="card-cell-outages" @mouseover="hovered = true" @mouseleave="hovered = false">
		<p class="card-title-text mb-3 text-center font-600 text-white">{{ subtitle }}</p>
		<div v-if="!hovered" class="row">
			<div class="col-12">
				<h3 v-if="totalSiteDown != '...'" class="site-down-ctext font-600 text-center text-white">{{ totalSiteDown }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
					<div class="bg-card-loader-white"></div>
				</div>
			</div>
		</div>
		<div v-else class="d-flex flex-column align-items-center mt-1">
			<slot name="goToAlarmPageBtn" />
		</div>
	</div>

	<!-- </div> -->
</template>

<script>
export default {
	name: "CardAccordionSiteDown",
	props: {
		totalSiteDown: String,
		subtitle: String
	},
	data() {
		return {
			hovered: false
		};
	}
};
</script>

<style>
.card-accordion-inside {
	background-image: url("../../assets/svg/bg-outages-sitedown.svg");
	background-size: cover;
	border: none;
}

.accordion-card-counting {
	font-weight: 600;
}
.card-title-text {
    font-size: 18px;
    margin-bottom: 6px !important;
}
.site-down-ctext{
	font-size: 28px;
}
</style>
