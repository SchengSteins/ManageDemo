<template>
  <div ref="echartBox"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        isAxisChart: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object,
            default() {
                return {
                    xData: [],
                    series: []
                }
            }
        }
    },
    watch: {
        chartData: {
            //传入数据改变后，调用initChart重新绘图
            handler: function (){
                this.initChart()
            },
            deep: true
        }
    },
    methods: {
        //初始化Echart
        initChart() {
            this.initChartData()
            if(this.echartObj) {
                //Echart实例已存在但数据改变了
                this.echartObj.setOption(this.options)
            } else {
                //Echart实例未初始化
                this.echartObj = echarts.init(this.$refs.echartBox)
                this.echartObj.setOption(this.options)
            }
        },
        initChartData() {
            if(this.isAxisChart) {
                this.axisOption.xAxis.data = this.chartData.xData
                this.axisOption.series = this.chartData.series
            } else {
                this.normalOption.series = this.chartData.series
            }
        }
    },
    data() {
        return {
            axisOption:{
                legend: {
                // 图例文字颜色
                textStyle: {
                    color: "#333",
                },
                },
                grid: {
                left: "20%",
                },
                // 提示框
                tooltip: {
                trigger: "axis",
                },
                xAxis: {
                type: "category", // 类目轴
                data: [],
                axisLine: {
                    lineStyle: {
                    color: "#17b3a3",
                    },
                },
                axisLabel: {
                    interval: 0,
                    color: "#333",
                },
                },
                yAxis: [
                {
                    type: "value",
                    axisLine: {
                    lineStyle: {
                        color: "#17b3a3",
                    },
                    },
                },
                ],
                color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
                series: [],
            },
            normalOption: {
                tooltip: {
                    trigger: "item",
                },
                color: [
                    "#0f78f4",
                    "#dd536b",
                    "#9462e5",
                    "#a6a6a6",
                    "#e1bb22",
                    "#39c362",
                    "#3ed1cf",
                ],
                series: [],
            },
            echartObj: null
        }
    },
    computed: {
        //根据传入参数，对不同图表类型的options
        options () {
            return this.isAxisChart ? this.axisOption : this.normalOption
        }
    }
}
</script>

<style>
</style>