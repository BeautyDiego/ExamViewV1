<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Card >
        <Row style="background:#fff;">

            <div style="text-align: center;width:80%;margin:0 auto">
                <Row>
                    <Col span="6">
                    <infor-card
                            id-name="user_created_count"
                            :end-val="count.ExamTotalHour"
                            iconType="clock"
                            color="#ff7801"
                            iconColor="#d7d7d7"
                            iconSize="28"
                            unitText="小时"
                            intro-text="当日考试时间长:"
                    ></infor-card>
                    </Col>
                    <Col span="6">
                    <infor-card
                            id-name="visit_count"
                            :end-val="count.TodaySales"
                            iconType="arrow-graph-up-right"
                            color="#ff7801"
                            iconSize="35"
                            iconColor="#d7d7d7"
                            unitText="元"
                            intro-text="当日营业额:"
                    ></infor-card>
                    </Col>
                    <Col span="6">
                    <infor-card
                            id-name="collection_count"
                            :end-val="count.TodayExamedCount"
                            iconType="ios-people"
                            color="#ff7801"
                            iconSize="35"
                            iconColor="#d7d7d7"
                            unitText="人"
                            intro-text="当日考试人数:"
                    ></infor-card>
                    </Col>
                    <Col span="6">
                    <infor-card
                            id-name="transfer_count"
                            :end-val="count.TodayExamingCount"
                            iconType="person-stalker"
                            color="#ff7801"
                            iconSize="30"
                            iconColor="#d7d7d7"
                            unitText="人"
                            intro-text="正在考试人数:"
                    ></infor-card>
                    </Col>
                </Row>
            </div>
        </Row>
        </Card>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="7">
            <Card>
                <div style="height: 331px;">
                    <calendar ></calendar>
                </div>
            </Card>
            </Col>

            <Col :md="24" :lg="7" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        车辆使用率
                    </p>
                    <div class="data-source-row">
                        <carCircle></carCircle>
                    </div>
                </Card>
            </Col>

            <Col :md="24" :lg="10" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-map"></Icon>
                    教练返利排行前五
                </p>
                <div class="data-source-row">
                    <coachRebateLine></coachRebateLine>
                </div>
            </Card>
            </Col>

        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="7" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    其他累计数据
                </p>
                <div class="data-source-row">
                    <otherStaticTable></otherStaticTable>
                </div>
            </Card>
            </Col>

            <Col :md="24" :lg="17" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    近30天客源情况
                </p>
                <div class="data-source-row">
                    <cusResource></cusResource>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import carCircle from './components/carCircle.vue';
import coachRebateLine from './components/coachRebateLine.vue';
import cusResource from './components/cusResource.vue';
import otherStaticTable from './components/otherStaticTable.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import calendar from './components/calendar.vue';
import {getTodayStatic} from './../../api/getData'

export default {
    name: 'home',
    components: {
        carCircle,
        coachRebateLine,
        cusResource,
        otherStaticTable,
        countUp,
        inforCard,
        calendar
    },
    data () {
        return {
            count: {
                ExamTotalHour: 0,
                TodaySales: 0,
                TodayExamedCount: 0,
                TodayExamingCount: 0
            },
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    created(){

    },
    mounted(){
        this.getInfoCardData();
    },
    methods: {
       async getInfoCardData(){
           let res = await getTodayStatic();
           this.count =  res[0]
       },


    }
};
</script>
