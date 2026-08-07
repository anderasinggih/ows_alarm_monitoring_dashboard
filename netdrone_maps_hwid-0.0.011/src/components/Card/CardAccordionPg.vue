<template>
	<div class="card card-flex py-3 px-2 justify-content-center" style="height: 100%">
		<p class="card-title-text mb-3 text-center font-600">{{ duration }} <i v-if="tooltipTitle || tooltipTitle != ''" class="bi bi-info-circle text-dark" data-bs-toggle="tooltip" data-bs-placement="top" :title="tooltipTitle"></i></p>
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<h3 v-if="totalSiteDown != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown }}</h3>
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
	name: "CardAccordidonPg",
	props: {
		color: String,
		totalSiteDown: String,
		duration: String,
		subtitle: String,
		tooltipTitle: String
	}
};
</script>

<style>
.card-flex {
	width: 100%;
	border: none;
	background-color: #cecece26;
}
</style>
