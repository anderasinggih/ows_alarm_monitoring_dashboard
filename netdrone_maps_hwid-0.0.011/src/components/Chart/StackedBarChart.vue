<template>
	<div>
		<v-chart :option="option" autoresize style="width: 100%; height: 400px"></v-chart>
	</div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import { TooltipComponent, GridComponent, TitleComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
use([CanvasRenderer, BarChart, LineChart, TooltipComponent, GridComponent, TitleComponent, LegendComponent]);

export default {
	name: "StackedBarChart",
	components: {
		VChart
	},
	props: {
		dataChart: Array
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
				legend: {
					bottom: 0,
					data: ["SUMATERA", "JAYA", "JAVA", "KALISUMAPA", "Total"]
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "10%",
					top: "5%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: [], // Will be filled dynamically
					axisLine: {
						lineStyle: { color: "#969696", width: 0.3 }
					},
					axisTick: { show: false },
					axisLabel: {
						formatter: function (value) {
							const date = new Date(value);
							const options = { day: "2-digit", month: "short", year: "numeric" };
							return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
						}
					}
				},
				yAxis: {
					show: false,
					type: "value"
				},
				series: [
					{
						name: "SUMATERA",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#2D9CDB"
						},
						data: []
					},
					{
						name: "KALISUMAPA",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#ED6D00"
						},
						data: []
					},
					{
						name: "JAYA",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#90BE6D"
						},
						data: []
					},
					{
						name: "JAVA",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#F9C74F"
						},
						data: []
					},
					{
						name: "Total",
						type: "line",
						label: {
							show: true,
							position: "top",
							formatter: function (params) {
								return params.value;
							}
						},
						itemStyle: {
							color: "#000000"
						},
						data: []
					}
				]
			}
		};
	},
	watch: {
		dataChart: {
			immediate: true,
			handler(newData) {
				if (Array.isArray(newData) && newData.length) {
					const processedData = this.processChartData(newData);
					this.option.xAxis.data = processedData.dates;
					this.option.series[0].data = processedData.sumatera;
					this.option.series[1].data = processedData.ksmp;
					this.option.series[2].data = processedData.jabo;
					this.option.series[3].data = processedData.java;
					this.option.series[4].data = processedData.totals;
				} else {
					console.warn("dataChart is undefined or empty");
				}
			}
		}
	},
	methods: {
		processChartData(data) {
			// Prepare arrays for the x-axis and each series
			const dates = [...new Set(data.map((item) => item.date))];
			const sumatera = [];
			const ksmp = [];
			const jabo = [];
			const java = [];
			const totals = [];

			dates.forEach((date) => {
				// Filter data by date and circle, and calculate the totals
				const dateData = data.filter((item) => item.date === date);
				sumatera.push(this.getValueByCircle(dateData, "SUMATERA"));
				ksmp.push(this.getValueByCircle(dateData, "KALISUMAPA"));
				jabo.push(this.getValueByCircle(dateData, "JAYA"));
				java.push(this.getValueByCircle(dateData, "JAVA"));
				totals.push(sumatera[sumatera.length - 1] + ksmp[ksmp.length - 1] + jabo[jabo.length - 1] + java[java.length - 1]);
			});

			return { dates, sumatera, ksmp, jabo, java, totals };
		},
		getValueByCircle(data, circleName) {
			const circleData = data.find((item) => item.circle === circleName);
			return circleData ? circleData.value : 0;
		}
	}
};
</script>
