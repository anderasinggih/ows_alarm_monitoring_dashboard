<template>
	<div class="col-site">
		<span class="d-flex justify-content-between mb-2">
			<b class="card-title-site align-self-center">{{ cardTitle }}</b>
			<button @click="handleClick()" class="btn-export-data-excel px-2 py-1">
				<i class="bi bi-file-arrow-down-fill font-14"></i>
			</button>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Unique Site Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ uniqueSiteDown }}</a>
		</span>
		<span class="d-flex justify-content-between my-2">
			<b class="card-subtitle-site">2G</b>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Percentage NE Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ percentNeDown2G }}%</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">NE Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ neDown2G }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Site Impacted</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ siteImpacted2G }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Cell Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ cellDown2G }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Total Site</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ totalSite2G }}</a>
		</span>
		<span class="d-flex justify-content-between my-2">
			<b class="card-subtitle-site">4G</b>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Percentage NE Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ percentageNeDown4G }}%</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">NE Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ neDown4G }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Site Impacted</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ siteImpacted4G }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Cell Down</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ cellDown4G }}</a>
		</span>
		<span class="d-flex justify-content-between">
			<a class="font-11 text-medium-grey text-decor-none">Total Site</a>
			<a class="font-11 text-darker text-decor-none" v-if="this.newState == 0">
				<div class="bg-card-loader bg-loader-statistic"></div>
			</a>
			<a class="font-11 text-darker text-decor-none" v-else>{{ totalSite4G }}</a>
		</span>
		<!-- <span class="d-flex justify-content-between mt-2">
			<button v-if="this.newState == 0" class="btn btn-apply btn-details d-flex flex-row gap-8 width-100" disabled @click="handleDetail()">Show Details</button>
			<button v-else class="btn btn-apply btn-details d-flex flex-row gap-8 width-100" @click="handleDetail()">Show Details</button>
		</span> -->
	</div>
</template>
<script>
export default {
	name: "CardSiteStatistic",
	props: {
		cardState: Number,
		cardTitle: String,
		uniqueSiteDown: Number,
		percentNeDown2G: String,
		neDown2G: String,
		siteImpacted2G: Number,
		cellDown2G: Number,
		totalSite2G: Number,
		percentageNeDown4G: String,
		neDown4G: String,
		siteImpacted4G: Number,
		cellDown4G: Number,
		totalSite4G: Number,
		onClick: Function
		// onDetail: Function
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
		handleClick() {
			if (typeof this.onClick === "function") {
				this.onClick();
			}
		},
		handleDetail() {
			if (typeof this.onDetail === "function") {
				this.onDetail();
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
