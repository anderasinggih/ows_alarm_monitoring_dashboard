<template>
	<!-- <div :class="hovered == true && this.pg.state.pgNotAllocated.openDropdown != false ? 'card card-flex py-3 px-2 dropdown dropbtn' : 'card card-flex py-3 px-2'" :style="'background-color:' + backgroundColor + ';' + 'border: 1px solid' + borderColor + ';'">
		<p :class="this.globalProcess.screen > 1600 ? 'card-title-text mb-3 text-center font-600' : 'card-title-text mb-3 text-center font-600 font-14'">{{ duration }}</p>
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<h3 v-if="totalSiteDown != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
					<div class="bg-card-loader"></div>
				</div>
				<p class="text-center font-11">{{ subtitle }}</p>
			</div>
		</div>
	</div> -->
	<div
		:class="hovered == true && this.pg.state.pgNotAllocated.openDropdown != false ? 'card card-flex py-3 px-2 dropdown dropbtn' : 'card card-flex py-3 px-2'"
		:style="'background-color:' + backgroundColor + ';' + 'border: 1px solid' + borderColor + ';'"
		:data-bs-toggle="openModal == true ? 'modal' : ''"
		:data-bs-target="openModal == true ? '#' + modalId : ''"
		@click="openModal == true ? handleOpenModal() : ''"
	>
		<p :class="this.globalProcess.screen > 1800 ? 'card-title-text mb-3 text-center font-600' : 'card-title-text mb-3 text-center font-600 font-12'" :style="'color:' + color + ';'">
			{{ duration }} <i v-if="tooltipTitle || tooltipTitle != ''" class="bi bi-info-circle text-dark" data-bs-toggle="tooltip" data-bs-placement="top" :title="tooltipTitle" :style="'color:' + color + ';'"></i>
		</p>
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<h3 v-if="totalSiteDown != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown }}</h3>
				<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
					<div class="bg-card-loader"></div>
				</div>
				<p class="text-center font-11">{{ subtitle }}</p>
			</div>
		</div>
		<!-- <div v-if="fmOfficeData != null || fmOfficeData != undefined" class="dropdown" style="float: left">
			<div class="dropdown-content row flex-row p-3" style="left: 0">
				<div class="container-fluid">
					<div class="row d-flex flex-row gap-8">
						<div class="container-pg-fm-office pe-0 ps-0" v-for="(data, index) in fmOfficeData" :key="index">
							<div class="card card-fm-office-pg p-1 px-2">
								<p class="font-12 text-ioh">{{ data }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";

export default {
	name: "CardAccordidonPgOutlined",
	props: {
		color: String,
		totalSiteDown: String,
		duration: String,
		subtitle: String,
		backgroundColor: String,
		borderColor: String,
		hovered: Boolean,
		openModal: Boolean,
		openModalProps: Function,
		modalId: String,
		fmOfficeData: Array,
		tooltipTitle: String
	},
	data() {
		return IndexData;
	},
	methods: {
		handleOpenModal() {
			this.pg.state.pgNotAllocated.openModal++;
		}
	}
};
</script>

<style>
.container-pg-fm-office {
	display: flex;
	flex-direction: row;
	width: fit-content !important;
}

.card-fm-office-pg {
	background-color: #fdf1ef;
	border-radius: 9999px;
	border: none;
}

.card-flex {
	width: 100%;
	border: none;
	background-color: #cecece26;
}

.dropbtn {
	background-color: #04aa6d;
	color: white;
	padding: 16px;
	font-size: 16px;
	border: none;
	cursor: pointer;
}

.dropdown {
	position: relative;
	display: inline-block;
}

.dropdown-content {
	display: none;
	position: absolute;
	right: 0;
	background-color: #ffff;
	min-width: 1000px;
	/* box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2); */
	border: 1px solid #c9c9c9;
	z-index: 1;
	border-radius: 8px;
	top: 75px;
}

.dropdown-content a {
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
}

.dropdown-content a:hover {
	background-color: #f1f1f1;
}
.dropdown:hover .dropdown-content {
	display: block;
}
.dropdown:hover .dropbtn {
	background-color: #3e8e41;
}
</style>
