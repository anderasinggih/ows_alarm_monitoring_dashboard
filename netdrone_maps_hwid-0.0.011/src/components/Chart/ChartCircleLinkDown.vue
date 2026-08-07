<template>
	<div :class="parentClass + ' circle-chart-container-link-down'">
		<div class="echarts">
			<v-chart autoresize :option="option" />
			<img v-if="img" class="img-charts" :src="img" alt="" style="max-height: 40px !important" />
			<p v-if="labelText" class="label-charts">{{ labelText }}</p>
		</div>
		<p v-if="descriptionsText !== ''" class="text-center pb-1 mb-0 under-chart-text pt-1">{{ descriptionsText }}</p>
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
	name: "ChartCircleLinkDown",
	components: {
		VChart
	},
	props: {
		parentClass: String,
		datas: Array,
		loading: Boolean,
		img: String,
		descriptionsText: String,
		labelText: String
	},
	data() {
		return {
			option: {
				layout: {
					padding: 10
				},
				tooltip: {
					show: false,
					trigger: "item"
				},
				series: [
					{
						name: "",
						type: "pie",
						radius: ["70%", "86%"],
						center: ["50%", "50%"],
						itemStyle: {
							borderRadius: 5
						},
						minAngle: 4,
						startAngle: 90,
						labelLine: { show: false },
						label: { show: false },
						data: [] // This will be updated reactively
					}
				]
			}
		};
	},
	computed: {
		// Compute the pie chart data reactively
		pieChartData() {
			return [
				{ value: this.datas[0] || 0, itemStyle: { color: "#BE161D" } },
				{ value: this.datas[1] || 0, itemStyle: { color: "#4FA700" } }
			];
		}
	},
	watch: {
		// Watch for changes in the datas prop
		datas: {
			handler(newValue) {
				this.option.series[0].data = this.pieChartData; // Update series data
			},
			deep: true // Watch for deep changes in the array
		}
	},
	created() {
		// Initialize the series data when component is created
		this.option.series[0].data = this.pieChartData;
	}
};
</script>

<style>
.circle-chart-container-link-down {
	padding: 10px 0px;
	margin-left: 0px;
	margin-right: 0px;
	background-color: rgba(206, 206, 206, 0.15);
	border-radius: 8px;
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
	max-height: 40px;
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
	min-height: 70px;
	min-width: 70px;
	width: 100%;
	overflow: visible;
}
</style>
