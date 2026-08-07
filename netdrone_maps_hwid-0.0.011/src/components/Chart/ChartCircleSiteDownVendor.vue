<template>
	<div class="d-flex flex-row justify-content-between" style="flex-grow: 1" @mouseover="hovered = true" @mouseleave="hovered = false">
		<div v-if="!hovered" :class="parentClass + ' circle-chart-container px-3 py-2 d-flex flex-column justify-content-between'">
			<figure class="d-flex flex-row align-self-center mt-3">
				<img :src="img" alt="" style="max-height: 60px" />
			</figure>
			<div class="d-flex flex-column gap-4" style="margin-top: 7px">
				<div class="d-flex flex-row justify-content-between">
					<p>Total</p>
					<p class="font-600 text-dark" v-if="total != 9999999">{{ total }}</p>
					<div class="d-flex flex-row justify-content-center" v-else>
						<div class="bg-card-loader loader-30"></div>
					</div>
				</div>
				<!-- <div class="d-flex flex-row justify-content-between">
					<p>2G</p>
					<p class="font-600 text-ioh-blue" v-if="ne2G != 9999999">{{ ne2G }}</p>
					<div class="d-flex flex-row justify-content-center" v-else>
						<div class="bg-card-loader loader-30"></div>
					</div>
				</div>
				<div class="d-flex flex-row justify-content-between">
					<p>4G</p>
					<p class="font-600 text-green" v-if="ne4G != 9999999">{{ ne4G }}</p>
					<div class="d-flex flex-row justify-content-center" v-else>
						<div class="bg-card-loader loader-30"></div>
					</div>
				</div> -->
			</div>
		</div>
		<div v-else :class="parentClass + ' circle-chart-container px-3 py-5 d-flex flex-column justify-content-between align-items-center '">
			<slot name="downloadDataBtn" />
		</div>
	</div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, PieChart, TooltipComponent]);

export default {
	name: "ChartCircleSiteDownVendor",
	components: {
		VChart
	},
	props: {
		parentClass: String,
		// datas: Array,
		// loading: Boolean,
		img: String,
		// descriptionsText: String,
		// labelText: String,
		// ne4G: Number,
		// ne2G: Number,
		total: Number
	},
	data() {
		return {
			hovered: false
			// option: {
			// 	layout: {
			// 		padding: 10
			// 	},
			// 	tooltip: {
			// 		show: false,
			// 		trigger: "item"
			// 	},
			// 	series: [
			// 		{
			// 			name: "",
			// 			type: "pie",
			// 			radius: ["70%", "90%"],
			// 			center: ["50%", "50%"],
			// 			itemStyle: {
			// 				borderRadius: 5
			// 			},
			// 			minAngle: 4,
			// 			startAngle: 90,
			// 			labelLine: { show: false },
			// 			label: { show: false },
			// 			data: []
			// 		},
			// 		// second circle
			// 		{
			// 			name: "",
			// 			type: "pie",
			// 			radius: ["70%", "90%"],
			// 			center: ["50%", "50%"],
			// 			itemStyle: {
			// 				borderRadius: 5
			// 			},
			// 			minAngle: 4,
			// 			startAngle: 90,
			// 			labelLine: { show: false },
			// 			label: { show: false },
			// 			data: []
			// 		},
			// 		{
			// 			name: "",
			// 			type: "pie",
			// 			radius: ["70%", "90%"],
			// 			center: ["50%", "50%"],
			// 			itemStyle: {
			// 				borderRadius: 5
			// 			},
			// 			minAngle: 4,
			// 			startAngle: 90,
			// 			labelLine: { show: false },
			// 			label: { show: false },
			// 			data: []
			// 		}
			// 	]
			// }
		};
	}
	// watch: {
	// 	datas() {
	// 		this.option.series[0].data = [
	// 			{ value: this.datas[0]?.value, itemStyle: { color: "#4FA700" } },
	// 			{ value: this.datas[1]?.value, itemStyle: { color: "#D9D9D9" } },
	// 			{ value: this.datas[2]?.value, itemStyle: { color: "#54BCCE" } }
	// 		];
	// 	}
	// },
	// created() {
	// 	this.option.series[0].data = [
	// 		{ value: this.datas[0]?.value || 0, itemStyle: { color: "#4FA700" } },
	// 		{ value: this.datas[1]?.value, itemStyle: { color: "#D9D9D9" } },
	// 		{ value: this.datas[2]?.value, itemStyle: { color: "#54BCCE" } }
	// 	];
	// }
};
</script>

<style>
.circle-chart-container {
	padding: 10px 0px;
	/* margin-left: auto;
	margin-right: auto; */
	background-color: rgba(206, 206, 206, 0.15);
	border-radius: 8px;
	width: 100%;
}

.circle-chart-container:hover {
	padding: 10px 0px;
	/* margin-left: auto;
	margin-right: auto; */
	background-color: rgba(206, 206, 206, 0.15);
	border-radius: 8px;
	border: 1px solid #ed6d00;
	width: 100%;
}

.under-chart-text {
	font-size: 11px;
	font-weight: 500;
	width: 100%;
}

.img-charts {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	max-height: 25px;
}

.label-charts {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-family: "Inter";
	font-size: 12px;
	font-weight: 600;
	line-height: 15px;
	text-align: center;
}

.echarts {
	position: relative;
	min-height: 80px;
	min-width: 70px;
	width: 100%;
	overflow: visible;
}
</style>
