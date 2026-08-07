<template>
	<div class="d-flex flex-row justify-content-between" @mouseover="hovered = true" @mouseleave="hovered = false">
		<div v-if="!hovered" :class="parentClass + ' circle-chart-container'">
			<div class="echarts">
				<v-chart autoresize :option="option" />
				<img v-if="img" class="img-charts" :src="img" alt="" style="max-height: 40px !important" />
				<p v-if="labelText" class="label-charts">{{ labelText }}</p>
			</div>
			<p v-if="descriptionsText !== ''" class="text-center pb-1 mb-0 under-chart-text pt-1">{{ descriptionsText }}</p>
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
	name: "ChartCircle",
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
			hovered: false,
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
						data: []
					},
					// second circle
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
						data: []
					}
				]
			}
		};
	},
	watch: {
		datas() {
			this.option.series[0].data = [
				{ value: this.datas[0]?.value, itemStyle: { color: "#BE161D" } },
				{ value: this.datas[1]?.value, itemStyle: { color: "#D9D9D9" } }
			];
		}
	},
	created() {
		this.option.series[0].data = [
			{ value: this.datas[0]?.value || 0, itemStyle: { color: "#BE161D" } },
			{ value: this.datas[1]?.value, itemStyle: { color: "#D9D9D9" } }
		];
	}
};
</script>

<style>
.circle-chart-container {
	padding: 10px 0px;
	margin-left: auto;
	margin-right: auto;
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
