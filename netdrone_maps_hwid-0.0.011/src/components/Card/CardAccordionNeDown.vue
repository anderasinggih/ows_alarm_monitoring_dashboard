<template>
	<div :class="cardClassType[type]" @mouseover="hovered = true" @mouseleave="hovered = false">
		<div v-if="!hovered" class="d-flex flex-row gap-8">
			<h2 v-if="type != 'unique'" :class="headingClassType[type]">{{ type }}</h2>
			<img v-else src="../../assets/svg/icon-unique-ne-down.svg" alt="" style="width: 54px" />
			<div class="d-flex flex-column justify-content-around gap-8">
				<h3 v-if="totalNeDown != '...'" :class="type != 'unique' ? 'font-700 text-dark' : 'font-700 text-white'">{{ totalNeDown }}</h3>
				<div v-else class="d-flex flex-row justify-content-left">
					<div class="bg-card-loader total-ne-down-loader"></div>
				</div>
				<p :class="type == 'unique' ? 'text-white' : 'text-dark'">
					{{ type == "unique" ? "Unq NE Down" : `${type} NE Down` }}
				</p>
			</div>
		</div>

		<div v-else class="d-flex flex-row gap-8 justify-content-center" style="padding-top: 0.68rem; padding-bottom: 0.68rem">
			<slot name="downloadDataBtn" />
		</div>
	</div>
</template>

<script>
export default {
	name: "CardAccordionNeDown",
	props: {
		type: String,
		totalNeDown: String
	},
	setup() {
		let hovered = false;

		const cardClassType = {
			"5G": "card card-accordion-inside-ne-down-5g px-2 py-2",
			"4G": "card card-accordion-inside-ne-down-4g px-2 py-2",
			"2G": "card card-accordion-inside-ne-down-2g px-2 py-2",
			unique: "card card-accordion-inside-ne-down-unique px-2 py-2"
		};

		const headingClassType = {
			"5G": "h2-tech-type-5g-ne",
			"4G": "h2-tech-type-4g-ne",
			"2G": "h2-tech-type-2g-ne"
		};

		return {
			cardClassType,
			headingClassType,
			hovered
		};
	}
};
</script>

<style>
.h2-tech-type-5g-ne {
	font-weight: 600;
	color: #ffffff;
	background-color: #ec008c;
	border-radius: 8px;
	border: 2px solid #ee8ddb;
	align-self: center;
	padding: 10px 8px;
}

.h2-tech-type-4g-ne {
	font-weight: 600;
	color: #ffffff;
	background-color: #4fa700;
	border-radius: 8px;
	border: 2px solid #71c14c;
	align-self: center;
	padding: 10px 8px;
}

.h2-tech-type-2g-ne {
	font-weight: 600;
	color: #ffffff;
	background-color: #00a2b5;
	border-radius: 8px;
	border: 2px solid #54bcce;
	align-self: center;
	padding: 10px 8px;
}

.card-accordion-inside-ne-down-unique {
	background-color: #2070f3;
	background-repeat: no-repeat;
	background-position: right;
	border: none;
	border: 2px solid #2070f3;
	border-radius: 8px;
	transition: ease-in 3s ease;
}

.card-accordion-inside-ne-down-2g {
	/* background-image: url("../../assets/svg/total-ne-bg-blue.svg"); */
	background-color: #eff4f680;
	background-repeat: no-repeat;
	background-position: right;
	border: none;
	border: 2px solid #c6e5ec;
	border-radius: 8px;
	transition: ease-in 3s ease;
}

.card-accordion-inside-ne-down-4g {
	/* background-image: url("../../assets/svg/total-ne-bg-green.svg"); */
	background-color: #eef6eb40;
	background-repeat: no-repeat;
	background-position: right;
	border: none;
	border: 2px solid #bcedac;
	border-radius: 8px;
}

.card-accordion-inside-ne-down-5g {
	/* background-image: url("../../assets/svg/total-ne-bg-green.svg"); */
	background-color: #eff4f680;
	background-repeat: no-repeat;
	background-position: right;
	border: none;
	border: 2px solid #efb9e3;
	border-radius: 8px;
}

.accordion-card-counting {
	font-weight: 600;
}

.total-ne-down-loader {
	width: 40px;
}
</style>
