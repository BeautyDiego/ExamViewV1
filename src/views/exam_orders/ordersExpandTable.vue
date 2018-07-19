<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row v-if="row.CusType=='教练客源'" class="expand-row">

            <Col span="8">
            <span class="expand-key">应收金额: </span>
            <span class="expand-value">￥{{ row.TotalCost }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">成本价格: </span>
            <span class="expand-value">￥{{ row.BasicCost }}</span>
            </Col>
        </Row>
        <Row v-else class="expand-row">

            <Col span="8">
            <span class="expand-key">应收金额: </span>
            <span class="expand-value">￥{{ row.TotalCost }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">单小时总优惠: </span>
            <span class="expand-value">￥{{ row.HourTotalDiscount }}</span>
            </Col>
        </Row>
        <Row v-if="row.CusType=='教练客源'" class="expand-row">
            <Col span="8">
            <span class="expand-key">教练价格: </span>
            <span class="expand-value">￥{{ row.CoachPrice }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">单小时总优惠: </span>
            <span class="expand-value">￥{{ row.HourTotalDiscount }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">单小时驾校优惠: </span>
            <span class="expand-value">￥{{ row.HourSchoolDiscout }}</span>
            </Col>
        </Row>
        <Row v-if="row.CusType=='自然客源'" class="expand-row">
            <Col span="8">
            <span class="expand-key"> 标准价: </span>
            <span class="expand-value">￥{{ row.StandardCost }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">优惠码: </span>
            <span class="expand-value">{{ row.RateCode }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">优惠价格: </span>
            <span class="expand-value">￥{{ row.RateCodeWorth }}</span>
            </Col>

        </Row>
    </div>
</template>
<script>
export default {
    props: {
        row: Object
    },
}
</script>