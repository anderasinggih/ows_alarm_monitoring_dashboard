<template>
	<div class="card">
		<div class="row d-flex flex-row p-3 align-items-center">
			<img src="../../assets/img/card/plus.png" alt="" style="width: fit-content" />
			<p class="font-16 font-700 fit-content ps-0">{{ circle }}</p>
		</div>
		<!-- Set the width and height for the chart container -->
		<div class="echarts" style="width: 100%; height: 300px">
			<v-chart :option="option" autoresize></v-chart>
		</div>
	</div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TooltipComponent, GridComponent, TitleComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, TitleComponent, LegendComponent]);

export default {
	name: "LineChartSiteDownTrend",
	components: {
		VChart
	},
	props: {
		circle: String,
		datas: Object
	},
	data() {
		return {
			option: {
				tooltip: {
					trigger: "axis"
				},
				legend: {
					icon: "circle",
					data: []
				},
				grid: {
					left: "4%",
					right: "6%",
					bottom: "10%",
					top: "25%",
					containLabel: true
				},
				toolbox: {
					show: false
				},
				xAxis: {
					type: "category",
					boundaryGap: false,
					data: []
				},
				yAxis: {
					type: "value"
				},
				series: []
			}
		};
	},
	watch: {
		datas: {
			handler(newData) {
				this.updateChart(newData);
			},
			immediate: true
		}
	},
	methods: {
		updateChart(newData) {
			if (!newData || !newData.oneToFour || !newData.below1 || !newData.eightToTwentyFour || !newData.fourToEight || !newData.moreThanTwentyFour) {
				console.warn("Incomplete data provided.");
				this.option.series = [];
				this.option.xAxis.data = [];
				this.option.legend.data = [];
				return;
			}

			const colorMapping = {
				below1: "#2070F3",
				oneToFour: "#4FA700",
				eightToTwentyFour: "#ED1C24",
				fourToEight: "#F36900",
				moreThanTwentyFour: "#000000"
			};

			const formattedTimes = newData.oneToFour.map((item) => {
				const date = new Date(item.time.replace(" ", "T"));
				return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
			});

			const formattedTooltips = newData.oneToFour.map((item) => {
				const date = new Date(item.time.replace(" ", "T"));
				return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
			});

			const seriesData = [
				{
					name: "Below 1 hour",
					type: "line",
					// stack: "Total",
					smooth: true,
					label: {
						show: true,
						position: "top",
						color: "#000",
						fontSize: 11
					},
					data: newData.below1.map((item) => parseFloat(item.value)),
					itemStyle: {
						color: colorMapping.below1
					},
					lineStyle: {
						color: colorMapping.below1
					}
				},
				{
					name: "1-4 hours",
					type: "line",
					// stack: "Total",
					smooth: true,
					label: {
						show: true,
						position: "top",
						color: "#000",
						fontSize: 11
					},
					data: newData.oneToFour.map((item) => parseFloat(item.value)),
					itemStyle: {
						color: colorMapping.oneToFour
					},
					lineStyle: {
						color: colorMapping.oneToFour
					}
				},
				{
					name: "4-8 hours",
					type: "line",
					// stack: "Total",
					smooth: true,
					label: {
						show: true,
						position: "top",
						color: "#000",
						fontSize: 11
					},
					data: newData.fourToEight.map((item) => parseFloat(item.value)),
					itemStyle: {
						color: colorMapping.fourToEight
					},
					lineStyle: {
						color: colorMapping.fourToEight
					}
				},
				{
					name: "8-24 hours",
					type: "line",
					// stack: "Total",
					smooth: true,
					label: {
						show: true,
						position: "top",
						color: "#000",
						fontSize: 11
					},
					data: newData.eightToTwentyFour.map((item) => parseFloat(item.value)),
					itemStyle: {
						color: colorMapping.eightToTwentyFour
					},
					lineStyle: {
						color: colorMapping.eightToTwentyFour
					}
				},
				{
					name: "Above 24 hours",
					type: "line",
					// stack: "Total",
					smooth: true,
					label: {
						show: true,
						position: "top",
						color: "#000",
						fontSize: 11
					},
					data: newData.moreThanTwentyFour.map((item) => parseFloat(item.value)),
					itemStyle: {
						color: colorMapping.moreThanTwentyFour
					},
					lineStyle: {
						color: colorMapping.moreThanTwentyFour
					}
				}
			];

			this.option.tooltip = {
				trigger: "axis",
				formatter: function (params) {
					const timeIndex = params[0].dataIndex;
					return `${formattedTooltips[timeIndex]}<br/>` + params.map((item) => `${item.marker} ${item.seriesName}: ${item.value}`).join("<br/>");
				}
			};

			this.option.legend.data = seriesData.map((series) => series.name);

			this.option.xAxis.data = formattedTimes;

			this.option.series = seriesData;
		}
	}
};
</script>
