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
            <i-circle :percent="80" :size="180" stroke-color="#00923f" trail-color="#99d5ca">
                <span class="demo-Circle-inner" style="font-size:24px">80%</span>
            </i-circle>
        </div>

        <Row style="border-top:1px solid #e3e8ee">
            <Col span="8" style="border-right:1px solid #f3f3f3">
                <div class="carCircle-Number">245</div>
                <p class="carCircle-text">考试中车辆</p>
            </Col>
            <Col span="8" style="border-right:1px solid #f3f3f3">
            <div class="carCircle-Number">245</div>
             <p class="carCircle-text">考试中车辆</p>
            </Col>
            <Col span="8">
            <div class="carCircle-Number">245</div>
             <p class="carCircle-text">考试中车辆</p>
            </Col>
        </Row>
    </div>
</template>

<script>

export default {
    name: 'carCircle',
    data () {
        return {

        };
    },
    mounted () {
    }
};
</script>
