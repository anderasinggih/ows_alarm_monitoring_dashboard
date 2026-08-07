<template>
	<div class="barplot-container">
		<v-chart class="chart" autoresize :option="option" />
	</div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TooltipComponent, GridComponent, TitleComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, BarChart, TooltipComponent, GridComponent, TitleComponent]);

const colors = ["#4FA700", "#C7000B"];
colors.reverse();

export default {
	name: "HorizontalBarLinkDown",
	components: {
		VChart
	},
	props: {
		datas: Array,
		loading: Boolean
	},
	data() {
		return {
			option: {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow"
					}
				},
				xAxis: {
					type: "value",
					show: false
				},
				grid: {
					width: "70%",
					height: "80%",
					left: "0%",
					top: "11.5%",
					containLabel: false
				},
				yAxis: {
					type: "category",
					data: ["Open Ticket", "Closed Ticket"],
					axisTick: { show: false },
					axisLabel: { show: true, color: "#000", fontSize: 12 },
					axisLine: { show: true }
				},
				series: [
					{
						type: "bar",
						label: {
							show: true,
							position: "right",
							formatter: function (params) {
								return params.value;
							},
							color: "black",
							fontWeight: "bold",
							fontSize: "11px"
						},
						data: [] // This will be updated reactively
					}
				]
			}
		};
	},
	computed: {
		// Compute the bar chart data reactively
		barChartData() {
			return this.datas.map((value, index) => ({
				value,
				itemStyle: {
					color: colors[index % colors.length] // Cycle through colors
				}
			}));
		}
	},
	watch: {
		// Watch for changes in the datas prop
		datas: {
			handler(newValue) {
				this.option.series[0].data = this.barChartData; // Update series data
			},
			deep: true // Watch for deep changes in the array
		}
	},
	created() {
		// Initialize the series data when component is created
		this.option.series[0].data = this.barChartData;
	}
};
</script>

<style scoped>
.barplot-container {
	width: max-content;
}

.chart {
	padding-left: 10px;
	padding-right: 10px;
	min-width: 125px;
	max-height: 80px;
}
</style>
