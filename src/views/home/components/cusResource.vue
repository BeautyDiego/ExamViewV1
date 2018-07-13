<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
import {getCusResource} from './../../../api/getData'
export default {
    name: 'cusResource',
    data () {
        return {
            cusResourceList:[{dates:'',NatureSum:0,CoachSum:''}],
        };
    },
    created(){


    },
    mounted () {
        this.getCusResourceList();


    },
    methods: {
        initEchats(){
            let NatureData=[];
            let CoachData=[];
            let xAxisData=[];
            let len=this.cusResourceList.length;
            for (let i = 0; i < len; i++) {
                let item=this.cusResourceList[i];
                NatureData.push(item.NatureSum);
                CoachData.push(item.CoachSum);
                xAxisData.push(item.dates);
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data:['教练客源','自然客源']
                },
                grid: {
                    top: '15%',
                    left: '1.2%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                color:['#fe7b05','#1874f0'],
                series: [
                    {
                        name: '教练客源',
                        type: 'line',
                        stack: '总量',
                        markPoint: {
                            symbolSize: 40,
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        },
                        data: CoachData
                    },
                    {
                        name: '自然客源',
                        type: 'line',
                        stack: '总量',
                        markPoint: {
                            symbolSize: 40,
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        },
                        data: NatureData
                    }
                ]
            };
            const cusResourceCharts = echarts.init(document.getElementById('service_request_con'));
            cusResourceCharts.setOption(option);

            window.addEventListener('resize', function () {
                cusResourceCharts.resize();
            });

        },
        async getCusResourceList(){
            this.cusResourceList= await getCusResource();
            this.initEchats()
        },
    },
};
</script>