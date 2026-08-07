<template>
	<div class="col-site">
		<span class="d-flex justify-content-between mb-2">
			<b class="card-title-site align-self-center">{{ cardTitle }}</b>
			<button @click="exportDataByType(region)" class="btn-export-data-excel px-2 py-1">
				<i class="bi bi-file-arrow-down-fill font-14"></i>
			</button>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Total Site</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == true">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ totalSite }}</a>
		</span>
		<span class="d-flex justify-content-between my-2">
			<b class="card-subtitle-site">Region</b>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">National</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == true">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ national }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">SMTR</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == true">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ smtr }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">KSMP</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == true">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ ksmp }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">JAYA</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == true">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ jaya }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">JAVA</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == true">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ java }}</a>
		</span>
	</div>
</template>
<script>
export default {
	name: "CardSiteStatisticDwdm",
	props: {
		cardState: Number,
		cardTitle: String,
		totalSite: String,
		national: String,
		smtr: String,
		jaya: String,
		java: String,
		ksmp: String,
		region: String
	},
	watch: {
		cardState(newVal) {
			this.newState = newVal;
		}
	},
	data() {
		return {
			newState: 0,
			detailBtnState: 0
		};
	},
	methods: {
		exportDataByType(type) {
			if (this.national != "0" || this.national != 0) {
				window.open("https://1057-sg.teleows.com/app/1057/spl/netdrone_maps_v3/netdrone_maps_v4/export_dwdm_alarm.spl?status=" + type, "_blank");
			} else {
				this.$swal({
					icon: "warning",
					title: "No Data to Download",
					text: "Currently, there’s no data available for download",
					showConfirmButton: false,
					timer: 3000
				});
			}
		}
	}
};
</script>

<style>
.col-site {
	width: inherit;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
	background-color: #cecece26;
	padding: 12px 12px 12px 12px;
}

.btn-details {
	font-size: 14px !important;
	font-weight: 500;
}

.btn-export-data-excel {
	cursor: pointer;
	background-color: #ed6d00;
	color: white;
	font-family: "Montserrat", sans-serif;
	font-size: 13px;
	border-radius: 4px;
}

.btn-export-data-excel:hover {
	cursor: pointer;
	background-color: #ed6d00;
	color: white;
	font-family: "Montserrat", sans-serif;
	font-size: 13px;
	border-radius: 4px;
}

.bg-loader-statistic {
	width: 30px !important;
}
</style>
