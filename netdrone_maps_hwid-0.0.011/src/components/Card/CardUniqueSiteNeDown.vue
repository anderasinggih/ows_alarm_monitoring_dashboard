<template>
	<div class="card card-unique-ne p-3" @mouseover="hovered = true" @mouseleave="hovered = false">
		<div v-if="!hovered" class="d-flex flex-column">
			<p class="font-300 text-white mb-2">Unique Site with NE Down</p>
			<div v-if="this.uniqueNe == '...'" class="d-flex flex-row justify-content-left mt-3">
				<div class="bg-card-unique-ne-loader"></div>
			</div>
			<h2 v-else class="text-white font-700">{{ this.uniqueNe }}</h2>
			<p class="font-300 text-white">Site</p>
		</div>
		<div v-else class="d-flex flex-column align-items-center">
			<slot name="downloadTotalDataBtn" />
		</div>
	</div>
</template>

<script>
export default {
	name: "CardUniqueSiteNeDown",
	props: {
		uniqueNe: String
	},
	data() {
		return {
			hovered: false
		};
	}
};
</script>

<style>
.bg-card-unique-ne-loader {
	width: 50px;
	aspect-ratio: 2;
	--_g: no-repeat radial-gradient(circle closest-side, #ffffff 90%, #0000);
	background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
	background-size: calc(100% / 3) 50%;
	animation: l3 1s infinite linear;
}
.card-unique-ne {
	background-image: url("../../assets/svg/total-ne-bg-white.svg");
	background-repeat: no-repeat;
	background-position: right;
	border: none !important;
	border-radius: 8px;
	background-color: #ed6d00;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>
