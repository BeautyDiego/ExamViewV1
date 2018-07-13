<style scoped>
    .circle-wrapper{
        height:230px;
        line-height: 230px;
        vertical-align: middle;
    }
    .carCircle-text{
        color:#d1d1d1;
    }
    .carCircle-Number{
        color:#7a7a7a;
        font-size: 22px;
        padding-top:5px;
    }
</style>
<template>
    <div style="text-align:center;">
        <div class="circle-wrapper">
            <i-circle :percent="utilRatio" :size="180" stroke-color="#00923f" trail-color="#99d5ca">
                <span class="demo-Circle-inner" style="font-size:24px">{{utilRatio}}%</span>
            </i-circle>
        </div>

        <Row style="border-top:1px solid #e3e8ee">
            <Col span="8" style="border-right:1px solid #f3f3f3">
                <div class="carCircle-Number">{{carStatusTable.examing}}</div>
                <p class="carCircle-text">考试中车辆</p>
            </Col>
            <Col span="8" style="border-right:1px solid #f3f3f3">
            <div class="carCircle-Number">{{carStatusTable.free}}</div>
             <p class="carCircle-text">空闲车辆</p>
            </Col>
            <Col span="8">
            <div class="carCircle-Number">{{carStatusTable.offLine}}</div>
             <p class="carCircle-text">离线车辆</p>
            </Col>
        </Row>
    </div>
</template>

<script>
import {getCarStatusGroup} from './../../../api/getData'
export default {
    name: 'carCircle',
    data () {
        return {
            carStatusTable:{examing:0,free:0,offLine:0},
        };
    },
    computed:{
      utilRatio:function(){
          let totalCar = this.carStatusTable.examing+this.carStatusTable.free+this.carStatusTable.offLine;
          if (totalCar){
              return (this.carStatusTable.examing*100/totalCar).toFixed(2);
          }else{
              return 100;
          }
      } ,
    },
    mounted () {
        this.getCarStatusGroupTable();
    },
    methods: {
        async getCarStatusGroupTable(){
          let res = await getCarStatusGroup();
          if (res.find(r => r.CarStatus===1)){
              this.carStatusTable.free = res.find((r => r.CarStatus==1)).statusCount;
          }else{
              this.carStatusTable.free = 0
          }
            if (res.find(r => r.CarStatus===2)){
                this.carStatusTable.examing = res.find((r => r.CarStatus==2)).statusCount;
            }else{
                this.carStatusTable.examing = 0
            }
            if (res.find(r => r.CarStatus===3)){
                this.carStatusTable.offLine = res.find((r => r.CarStatus==3)).statusCount;
            }else{
                this.carStatusTable.offLine = 0
            }

       },
    },
};
</script>
