<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'cusResource',
    mounted () {
        const option = {
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
                top: '3%',
                left: '1.2%',
                right: '1%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
                    data: [120, 321, 298, 134, 321, 230, 210]
                },
                {
                    name: '自然客源',
                    type: 'line',
                    stack: '总量',
                    markPoint: {
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
                    data: [257, 56, 98, 234, 290, 330, 310]
                }
            ]
        };
        const cusResourceCharts = echarts.init(document.getElementById('service_request_con'));
        cusResourceCharts.setOption(option);

        window.addEventListener('resize', function () {
            cusResourceCharts.resize();
        });
    }
};
</script>