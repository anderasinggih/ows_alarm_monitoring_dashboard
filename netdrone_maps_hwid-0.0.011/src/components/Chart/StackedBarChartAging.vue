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
	name: "StackedBarChartAging",
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
					data: ["SUMATERA", "JAYA", "JAVA", "KALISUMAPA", "Average"]
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
						name: "Average",
						type: "line",
						label: {
							show: true,
							position: "top",
							formatter: function (params) {
								return params.value;
							},
							fontSize: 16
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
					this.option.series[4].data = processedData.average;
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
			const average = [];

			dates.forEach((date) => {
				// Filter data by date and circle, and calculate the totals
				const dateData = data.filter((item) => item.date === date);
				const sumateraValue = this.getAgingByCircle(dateData, "SUMATERA");
				const ksmpValue = this.getAgingByCircle(dateData, "KALISUMAPA");
				const jaboValue = this.getAgingByCircle(dateData, "JAYA");
				const javaValue = this.getAgingByCircle(dateData, "JAVA");

				// Push values to respective series
				sumatera.push(sumateraValue);
				ksmp.push(ksmpValue);
				jabo.push(jaboValue);
				java.push(javaValue);

				// Calculate total for the day and divide by 4
				const averageValue = (sumateraValue + ksmpValue + jaboValue + javaValue) / 4;
				average.push(averageValue);
			});

			return { dates, sumatera, ksmp, jabo, java, average };
		},

		getAgingByCircle(data, circleName) {
			const circleData = data.find((item) => item.circle === circleName);
			return circleData ? circleData.aging : 0;
		}
	}
};
</script>

<!-- <template>
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
					data: ["Sumatera", "JABO", "JAVA & BN", "KSMP", "Total"]
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "10%",
					top: 0,
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: ["2024-08-10", "2024-08-11", "2024-08-12", "2024-08-13"],
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
						name: "Sumatera",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#2D9CDB"
						},
						data: [120, 132, 101, 134] // Example data
					},
					{
						name: "KSMP",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#ED6D00"
						},
						data: [98, 77, 101, 99] // Example data
					},
					{
						name: "JABO",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#90BE6D"
						},
						data: [220, 182, 191, 234] // Example data
					},
					{
						name: "JAVA & BN",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#F9C74F"
						},
						data: [150, 232, 201, 154] // Example data
					},
					{
						name: "Total",
						type: "line",
						label: {
							show: true,
							position: "top",
							formatter: function (params) {
								const total = params.value;
								return total;
							}
						},
						itemStyle: {
							color: "#000000"
						},
						data: [
							120 + 98 + 220 + 150, // Total for 2024-08-10
							132 + 77 + 182 + 232, // Total for 2024-08-11
							101 + 101 + 191 + 201, // Total for 2024-08-12
							134 + 99 + 234 + 154 // Total for 2024-08-13
						]
					}
				]
			}
		};
	}
};
</script> -->

<!-- <template>
	<div class="chart-container">
		<div v-if="loading" class="loading">Loading...</div>
		<v-chart v-else class="echarts" autoresize :option="option" />
	</div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TooltipComponent, GridComponent, TitleComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, BarChart, TooltipComponent, GridComponent, TitleComponent, LegendComponent]);

export default {
	name: "StackedBarChart",
	components: {
		VChart
	},
	data() {
		return {
			loading: false,
			datas: [
				{ value: [320, 332, 301, 334, 390], name: "Forest" },
				{ value: [220, 182, 191, 234, 290], name: "Steppe" },
				{ value: [150, 232, 201, 154, 190], name: "Desert" },
				{ value: [98, 77, 101, 99, 40], name: "Wetland" }
			],
			option: {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow"
					}
				},
				legend: {
					data: ["Forest", "Steppe", "Desert", "Wetland"]
				},
				grid: {
					width: "70%",
					height: "80%",
					left: "0%",
					top: "11.5%",
					containLabel: false
				},
				xAxis: [
					{
						type: "category",
						axisTick: { show: false },
						data: ["2012", "2013", "2014", "2015", "2016"]
					}
				],
				yAxis: [
					{
						type: "value"
					}
				],
				series: []
			}
		};
	},
	watch: {
		datas() {
			const labelOption = {
				show: true,
				position: "insideBottom",
				distance: 15,
				align: "left",
				verticalAlign: "middle",
				rotate: 90,
				formatter: "{c}",
				fontSize: 16,
				rich: {
					name: {}
				}
			};

			this.option.series = this.datas.map((data, index) => {
				return {
					name: data.name,
					type: "bar",
					stack: "total", // This ensures the bars are stacked
					label: labelOption,
					emphasis: {
						focus: "series"
					},
					data: data.value
				};
			});
		}
	},
	created() {
		this.$watch(
			"datas",
			() => {
				this.datas.forEach((data) => {
					this.option.legend.data.push(data.name);
				});
			},
			{ immediate: true }
		);
	}
};
</script>

<style scoped>
.chart-container {
	width: max-content;
}

.chart {
	padding-left: 10px;
	padding-right: 10px;
	min-width: 500px;
	max-height: 80px;
}

.loading {
	color: #999;
	text-align: center;
	padding: 20px;
	font-size: 18px;
}
</style> -->
