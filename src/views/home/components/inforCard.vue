<style lang="less">
    @import './styles/infor-card.less';
</style>

<template>
    <div class="infor-card-con">
            <count-up
                class="infor-card-count user-created-count"
                :iconType="iconType"
                :iconSize="iconSize"
                :iconColor="iconColor"
                :id-name="idName"
                :end-val="endVal"
                :color="color"
                :countSize="countSize"
                :countWeight="countWeight"
            >
            <span class="infor-intro-text" slot="intro">{{ introText }}</span>
            <span class="infor-intro-text" slot="unit">{{ unitText }}</span>
                </count-up>
    </div>
</template>

<script>
import countUp from './countUp.vue';

export default {
    name: 'inforCard',
    components: {
        countUp
    },
    props: {
        idName: String,
        endVal: Number,
        color: String,
        iconColor: String,
        iconType: String,
        introText: String,
        unitText: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 100
        },
        iconSize: {
            type: Number,
            default: 40
        }
    }
};
</script>

