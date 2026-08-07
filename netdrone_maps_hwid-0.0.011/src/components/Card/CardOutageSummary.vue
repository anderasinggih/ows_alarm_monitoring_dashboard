<template>
	<div class="card p-2" :style="'background-color:' + cardColor + ';' + 'border: 1px solid #eaeaea;'">
		<p class="font-14 text-center font-600">{{ title }}</p>
		<div class="row mt-2">
			<div class="col-4">
				<div class="d-flex flex-row justify-content-center" v-if="open === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center" style="color: #4fa700">
					{{ open }}
				</p>
				<p class="font-12 text-center">Open</p>
			</div>
			<div class="col-4">
				<div class="d-flex flex-row justify-content-center" v-if="closed === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center" style="color: #f36900">
					{{ closed }}
				</p>
				<p class="font-12 text-center">Closed</p>
			</div>
			<div class="col-4">
				<div class="d-flex flex-row justify-content-center" v-if="siteImpact === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center">
					{{ siteImpact }}
				</p>
				<p class="font-12 text-center">Site Impact</p>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "CardOutageSummary",
	props: {
		open: String,
		closed: String,
		siteImpact: String,
		title: String,
		cardColor: String
	}
};
</script>

<style>
.loader-25 {
	width: 25px !important;
}
</style>
