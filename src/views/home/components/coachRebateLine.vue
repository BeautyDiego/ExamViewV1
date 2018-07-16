<template>
    <div style="width:100%;height:100%;" id="coachRebateLine"></div>
</template>

<script>
//import echarts from 'echarts';
import {getCoachRebateTopFive} from './../../../api/getData'
export default {
    name: 'coachRebateLine',
    data () {
        return {
            rebateList:[{Exam_CoachName:'',RebateMoney:0}],
        };
    },
    created(){


    },
    mounted () {
         this.getCoachRebate();


    },
    methods: {
        initEchats(){
             this.$nextTick(() => {

                 let coachRebateLine = echarts.init(document.getElementById('coachRebateLine'));
                 let colorArr = ['#00923f','#01b750', '#479585','#a8cbcf','#d8f1ed'];
                 let seriesData = [];
                 let yAxisData=[];
                 let len=this.rebateList.length;
                 for (let i = 0; i < len; i++) {
                     let item=this.rebateList[i];
                     seriesData.push({
                         name:item.Exam_CoachName,
                         value:item.RebateMoney,
                         itemStyle: {
                             normal: {
                                 color: colorArr[len-i]
                                 },
                                 label: {
                                     show: true,
                                     positiion:'right',
                                     formatter: item.RebateMoney
                                 }
                             }
                      });
                 yAxisData.push(item.Exam_CoachName);
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
                         data: yAxisData,
                         nameTextStyle: {
                             color: '#c3c3c3'
                         }
                     },
                     series: [
                         {
                             name: '返利金额',
                             type: 'bar',
                             barWidth: 25,
                             data:seriesData
                         }
                     ]
                 };

                 coachRebateLine.setOption(option);

                 window.addEventListener('resize', function () {
                     coachRebateLine.resize();
                 });

             });

        },
        async getCoachRebate(){
            this.rebateList= await getCoachRebateTopFive();
            this.initEchats()
        },
    },
};
</script>
