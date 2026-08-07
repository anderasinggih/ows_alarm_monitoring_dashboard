<template>
	<div :class="this.globalProcess.state.tab.selectedOption == 'linkDown' ? 'card card-flex py-4 px-2' : 'card card-flex py-3 px-2'" :style="this.globalProcess.state.tab.selectedOption == 'pgTracking' ? 'background-color: #fdf1ef !important' : 'background-color: #cecece26 !important;'">
		<p class="card-title-text mb-3 text-center font-600">{{ title }}</p>
		<div class="row">
			<div :class="this.globalProcess.state.tab.selectedOption == 'pgTracking' ? 'col-12' : 'col-6'">
				<h3 v-if="totalLeft != '...'" class="font-600 text-center" :style="'color:' + colorLeft + ';'">{{ totalLeft }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalLeft == '...'">
					<div class="bg-card-loader"></div>
				</div>
				<p class="text-center font-11">{{ subtitleLeft }}</p>
			</div>
			<div :class="this.globalProcess.state.tab.selectedOption == 'pgTracking' ? 'col-12' : 'col-6'" style="margin-top: 4px">
				<h3 v-if="totalRight != '...'" class="font-600 text-center" :style="'color:' + colorRight + ';'">{{ totalRight }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalRight == '...'">
					<div class="bg-card-loader"></div>
				</div>
				<p class="text-center font-11">{{ subtitleRight }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
export default {
	name: "CardAccordionPgHubType",
	props: {
		title: String,
		totalLeft: String,
		subtitleLeft: String,
		colorLeft: String,
		totalRight: String,
		subtitleRight: String,
		colorRight: String
	},
	data() {
		return IndexData;
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
