<template>
	<div class="card card-inside-pg">
		<div class="card-content p-2">
			<div class="row d-flex flex-row gap-8" style="padding-left: 10px; padding-right: 12px">
				<div class="col-4 ps-0 pe-0 d-flex flex-column flex-grow-1" style="width: 30%">
					<slot name="cardLeft"></slot>
				</div>
				<div class="col-4 ps-0 pe-0 d-flex flex-column flex-grow-1" style="width: 30%">
					<slot name="cardCenter"></slot>
				</div>
				<div class="col-4 ps-0 pe-0 d-flex flex-column flex-grow-1" style="width: 30%">
					<slot name="cardRight"></slot>
				</div>
			</div>
			<div class="row d-flex flex-row justify-content-between mt-2" style="padding-left: 10px; padding-right: 10px">
				<!-- <button class="box-pg-outlined ps-4 pe-4 justify-content-between">
					<p class="fit-content font-12 font-inter font-400">FM Office Impacted</p>
					<p class="fit-content font-12 font-inter font-600">{{ fmOfficeImpacted }}</p>
				</button> -->
				<button class="box-pg-outlined ps-4 pe-4 justify-content-between" :data-bs-toggle="openModal ? 'modal' : ''" :data-bs-target="openModal ? '#' + modalId : ''" @click="openModalFmOffice()">
					<p class="fit-content font-12 font-inter font-400">FM Office Impacted</p>
					<p class="fit-content font-12 font-inter font-600">{{ fmOfficeImpacted }}</p>
				</button>
				<button class="box-pg-colored ps-4 pe-4 justify-content-between" :data-bs-toggle="openModal2 ? 'modal' : ''" :data-bs-target="openModal2 ? '#' + modalId2 : ''" @click="openModalSiteImpact()">
					<p class="fit-content font-12 font-inter font-400">Site Impacted</p>
					<p class="fit-content font-12 font-inter font-600">{{ siteImpacted }}</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
export default {
	name: "CardBorderedInsideAccordionPg",
	props: {
		fmOfficeImpacted: String,
		siteImpacted: String,
		openModal: Boolean,
		openModal2: Boolean,
		modalId: String,
		modalId2: String
	},
	data() {
		return IndexData;
	},
	methods: {
		openModalFmOffice() {
			this.pg.state.fmOfficeModal.openModal++;
		},
		openModalSiteImpact() {
			this.pg.state.siteImpactModal.openModal++;
		}
	}
};
</script>

<style>
.card-inside-pg {
	border-radius: 8px;
}

.box-pg-outlined {
	display: flex;
	flex-direction: row;
	border: 1px solid #eaeaea;
	border-radius: 999px;
	width: 49%;
	padding-top: 3px;
	padding-bottom: 3px;
	cursor: pointer;
}

.box-pg-outlined:hover {
	background-color: #eaeaea;
}

.box-pg-colored {
	display: flex;
	flex-direction: row;
	background-color: #fdf1ef;
	border-radius: 999px;
	width: 49%;
	padding-top: 3px;
	padding-bottom: 3px;
}

.box-pg-colored:hover {
	background-color: #fad5cf;
}
</style>
