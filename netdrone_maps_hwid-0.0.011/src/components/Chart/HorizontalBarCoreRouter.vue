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
    var colors = ["#62B2FD", "#9BDFC4", "#F99BAB", "#FDC000"];

    export default {
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
                        show: false
                    },
                    grid: {
                        width: "70%", // Set the width of the grid
                        height: "80%", // Set the height of the grid
                        left: "0%", // Set the left margin
                        top: "11.5%", // Set the top margin
                        containLabel: false
                    },
                    yAxis: {
                        type: "category",
                        axisTick: { show: false },
                        axisLabel: { show: false }, // Hide the labels

                        axisLine: { show: true } // Show the axis line
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
                            data: []
                        }
                    ]
                },
                total: 0
            };
        },
        watch: {
            datas() {
                this.option.series[0].data = this.datas.map((data, index) => {
                    return {
                        value: data.value,
                        itemStyle: {
                            color: colors[index]
                        }
                    };
                });
                this.total = this.datas.reduce((sum, data) => {
                    return sum + data.value;
                }, 0);
            }
        },
        created() {
            this.option.series[0].data = this.datas.map((data, index) => {
                return {
                    value: data.value,
                    itemStyle: {
                        color: colors[index]
                    }
                };
            });
            this.total = this.datas.reduce((sum, data) => {
                return sum + data.value;
            }, 0);
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
