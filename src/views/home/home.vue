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
                            :end-val="count.createUser"
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
                            :end-val="count.visit"
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
                            :end-val="count.collection"
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
                            :end-val="count.transfer"
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
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import carCircle from './components/carCircle.vue';
import coachRebateLine from './components/coachRebateLine.vue';
import cusResource from './components/cusResource.vue';
import otherStaticTable from './components/otherStaticTable.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import calendar from './components/calendar.vue';

export default {
    name: 'home',
    components: {
        homeMap,
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
                createUser: 496,
                visit: 326,
                collection: 243,
                transfer: 395
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: '',
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        }
    }
};
</script>
