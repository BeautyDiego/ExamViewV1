<template>
    <div style="width:100%;height:100%;" id="coachRebateLine"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'coachRebateLine',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            let coachRebateLine = echarts.init(document.getElementById('coachRebateLine'));
            let xAxisData = [];
            let data1 = [];
            let data2 = [];
            for (let i = 0; i < 20; i++) {
                xAxisData.push('类目' + i);
                data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
            }

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['赵子龙', '关云长', '曹孟德', '吕奉先', '刘玄德'],
                    nameTextStyle: {
                        color: '#c3c3c3'
                    }
                },
                series: [
                    {
                        name: '访问量',
                        type: 'bar',
                        barWidth: 25,
                        data: [
                            {value: 5432, name: '赵子龙',  itemStyle: {normal: {color: '#d8f1ed'}}},
                            {value: 3598, name: '关云长', itemStyle: {normal: {color: '#a8cbcf'}}},
                            {value: 2100, name: '曹孟德', itemStyle: {normal: {color: '#479585'}}},
                            {value: 1321, name: '吕奉先', itemStyle: {normal: {color: '#01b750'}}},
                            {value: 998, name: '刘玄德', itemStyle: {normal: {color: '#00923f'}}}
                        ]
                    }
                ]
            };

            coachRebateLine.setOption(option);

            window.addEventListener('resize', function () {
                coachRebateLine.resize();
            });
        });
    }
};
</script>
