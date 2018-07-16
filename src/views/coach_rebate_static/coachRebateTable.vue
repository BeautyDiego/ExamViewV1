<style>

    .simcardTable {
        padding:10px;
        min-height:600px;
    }

</style>

<template>

    <div class="salesTable">
        <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
            <Row>
              <Button class="top-right-btn" size="large" icon="plus" @click="toExcel">导出EXCEL</Button>
            
                <Button  class="top-right-btn" type="primary" icon="ios-search" size="large"  @click="doSearchTableList">搜  索</Button>
             <DatePicker  class="top-right-btn" type="daterange" :clearable="true" :options="options2" v-model="searchForm.ranges" placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>  

            </Row>
        </div>
        <!--table-->
        <Row>
            <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
        </Row>
        <Row>
            <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
        </Row>



    </div>

</template>

<script>
    import {getCoachRebate,getCoachRebateExcel} from './../../api/getData'
    import {clearObj} from './../../libs/util';
    export default {
        name:'salesTable',
        data() {
            return {
                tableLoading:false,//table是否在加载中
                tableColums: [
                    {
                        align:'center',
                        title: '教练员姓名',
                        key: 'CoachName'
                    },

                   {
                        align:'center',
                        title: '教练员手机号',
                        key: 'CoachMobile',
                    },
                    {
                        align:'center',
                        title: '考试时长(小时)',
                        key: 'TotalHour',
                    },
                    {
                        align:'center',
                        title: '营业额',
                        key: 'TotalCost',
                        render: (h, params) => { return   params.row.TotalCost!=null?'￥'+params.row.TotalCost.toFixed(2):''  ;}
                    },
                    {
                        align:'center',
                        title: '成本',
                        key: 'TotalBasicCost',
                        render: (h, params) => { return   params.row.TotalBasicCost!=null?'￥'+params.row.TotalBasicCost.toFixed(2):''  ;}
                    },
                    {
                        align:'center',
                        title: '教练返利',
                        key: 'TotalRebate',
                        render: (h, params) => { return   params.row.TotalRebate!=null?'￥'+params.row.TotalRebate.toFixed(2):''  ;}
                    }, 
                ],
                tableData: [
                ],
                total:0,
                currentPage:1,

                searchForm:{
                    rows:10,
                    page:1,
                    ranges:[new Date(),new Date()],
                },
                options2: {
                    shortcuts: [
                        {
                            text: '近一周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '本月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '近3个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                }
            }
        },
        created(){

        },
        mounted(){
            this.getTableList();
        },
        methods: {
            doSearchTableList(){
                this.currentPage=1;
                this.getTableList();
            },
            async getTableList(){
                if(this.searchForm.ranges[0]&&this.searchForm.ranges[1]){
                    this.searchForm.page = this.currentPage;
                    this.tableLoading=true;              
                    const res = await getCoachRebate({start:this.searchForm.ranges[0],end:this.searchForm.ranges[1],page:this.searchForm.page,rows:this.searchForm.rows});
                    this.total = res.total;
                    this.tableData = res.rows;
                    this.tableLoading=false;
                }else{
                    this.$Message.error('请选择查询时间段！');
                }
            },
            changeCurrentPage(num){
                this.currentPage=num;
                this.getTableList();
            },
            handleChange (date) {
                
            },
            async toExcel () {
                const res = await getCoachRebateExcel({start:this.searchForm.ranges[0],end:this.searchForm.ranges[1]});
                if(res.success){
                    const url= this.UpLoadURL_PREFIX+"/excel/"+res.filename;
                    window.open(url); 
                }else{

                }
            },
        }
    }

</script>
