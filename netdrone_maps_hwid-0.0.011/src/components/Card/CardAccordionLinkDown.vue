<template>
	<div :class="type == 'Potential Emergency' ? 'card card-accordion-emergency px-3 py-3 gap-16' : 'card card-accordion-critical px-3 py-3 gap-16'">
		<div class="d-flex flex-row gap-8">
			<p class="font-500 font-16 text-white d-flex flex-row gap-8 align-self-center">
				<img v-if="type == 'Potential Emergency'" src="../../assets/svg/emergency-icon.svg" alt="" />
				<img v-else src="../../assets/svg/critical-icon.svg" alt="" />
				{{ type }}
			</p>
		</div>
		<div class="d-flex flex-column">
			<h3 class="font-600 font-28 text-white">{{ total }}</h3>
			<p class="font-400 font-14 text-white">{{ subtitle }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccordionLinkDown",
	props: {
		type: String,
		total: String,
		subtitle: String
	}
};
</script>

<style>
.h2-tech-type-4g {
	font-weight: 600;
	color: #ffffff;
	background-color: #4fa700;
	border-radius: 8px;
	border: 2px solid #71c14c;
	align-self: center;
	padding: 10px 8px;
}

.h2-tech-type-5g {
	font-weight: 600;
	color: #ffffff;
	background-color: #00a2b5;
	border-radius: 8px;
	border: 2px solid #54bcce;
	align-self: center;
	padding: 10px 8px;
}
.card-accordion-emergency {
	background-image: url("../../assets/img/card/emergency-bg.png");
	background-repeat: no-repeat;
	background-size: 100px;
	background-position: right;
	border: none !important;
	background-color: #c7000b;
	border-radius: 8px;
}

.card-accordion-critical {
	background-image: url("../../assets/img/card/critical-bg.png");
	background-repeat: no-repeat;
	background-size: 100px;
	background-position: right;
	border: none !important;
	background-color: #ed6d00;
	border-radius: 8px;
}

.accordion-card-counting {
	font-weight: 600;
}

.total-ne-down-loader {
	width: 40px;
}
</style>
