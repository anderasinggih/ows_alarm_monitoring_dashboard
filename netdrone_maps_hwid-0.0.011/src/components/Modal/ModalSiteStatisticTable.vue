<template>
	<div class="modal fade" id="siteStatisticTable" aria-hidden="true" aria-labelledby="modalFilterNetdrone"
		tabindex="-1">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div class="d-flex justify-content-between">
						<h3 class="font-700 text-dark">
							<i class="bi bi-arrow-left-circle-fill me-2 bg-back-ico" data-bs-toggle="modal"
								data-bs-target="#statisticModal"></i>
							{{ this.titleModal }}
						</h3>
						<div class="d-flex flex-row">
							<button ref="tableButtonExit" type="button" class="btn-close" data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
					</div>
					<div class="d-flex flex-row justify-content-end">
						<button @click="openTabExport()"
							class="btn btn-apply btn-download-table width-fit-content me-0">
							<i class="fa-solid fa-download"></i>
							Download Data
						</button>
					</div>
					<div class="col-scroll-statistic">
						<table class="content-table">
							<thead>
								<tr>
									<td rowspan="2" style="text-align: center">Area Name</td>
									<td rowspan="2" style="text-align: center">Roh</td>
									<td colspan="2" style="text-align: center">Cell Down</td>
									<td colspan="2" style="text-align: center">NE Down</td>
								</tr>
								<tr>
									<td style="text-align: center">2G</td>
									<td style="text-align: center">4G</td>
									<td style="text-align: center">2G</td>
									<td style="text-align: center">4G</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in this.dataTable">
									<td>{{ item.area_name }}</td>
									<td>{{ item.roh_name }} {{ item.roh_phone }}</td>
									<td>{{ item.celldown_2g }}</td>
									<td>{{ item.celldown_4g }}</td>
									<td>{{ item.sitedown_2g }}</td>
									<td>{{ item.sitedown_4g }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import ModalSiteStatistic from "../Modal/ModalSiteStatistic.vue";
import { SiteStatisticData } from "../../views/Data/SiteStatisticData.js";

export default {
	name: "ModalSiteStatisticTable",
	data() {
		return SiteStatisticData;
	},
	components: {
		// ModalSiteStatistic
	},
	methods: {
		openTabExport() {
			window.open("https://1057-sg.teleows.com/app/1057/spl/netdrone_maps_v3/netdrone_maps_v3/export_alarm.spl?regions=" + this.currentRegionDetail, "_blank");
		},
		openStatisticModal() {
			this.$refs.tableButtonExit.click();
			this.showModal = this.showModal + 1;
		},
		hideStatisticModal() {
			this.showModal = 0;
		}
	}
};
</script>

<style>
.col-scroll-statistic {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 400px;
	overflow-y: scroll;
}

.btn-download-table {
	margin-right: 12px;
	font-size: 12px;
	width: 180px;
	height: 40px;
	font-weight: 600;
}

/* TABLE */
.content-table {
	margin: 25px 0;
	font-size: 0.9em;
	min-width: 400px;
	/* border-radius: 8px 8px 0 0; */
	overflow: hidden;
	width: 100%;
}

.content-table thead {
	border-color: #eaeaea;
	border-style: solid;
	border-width: 2px;
}

.content-table thead tr {
	background-color: #ffffff;
	color: #313131;
	text-align: left;
	font-weight: bold;
}

.content-table th,
.content-table td {
	padding: 10px 15px !important;
	border: 2px solid #eaeaea;
	text-align: center;
}

.content-table tbody tr {
	border: 2px solid #e4e6ea;
}

.content-table tbody tr:nth-of-type(even) {
	background-color: #cecece26;
}

.content-table tbody tr:last-of-type {
	border: 2px solid #cecece26;
}

.content-table tbody tr.active-row {
	font-weight: bold;
	color: #1d2433;
}

.bg-back-ico {
	color: #ed6d00 !important;
	cursor: pointer !important;
}
</style>
