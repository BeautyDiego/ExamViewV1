<style>
  
  .simcardTable {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="simcardTable">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
          <RadioGroup v-model="searchForm.cusType" type="button" size="large"  @on-change='doChangeCusType' >
              <Radio label="教练客源"></Radio>
              <Radio label="自然客源"></Radio>
          </RadioGroup>
          <Button class="top-right-btn" size="large" icon="plus" @click="addCar">添加</Button>

          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
              <Button type="primary" icon="ios-search" size="large" >搜  索</Button>
              <div style="text-align:center" slot="content">
                  <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                      <Row>
                          <Form-item label="教练员名"  >
                              <Input v-model="searchForm.coachName" ></Input>
                          </Form-item>
                      </Row>
                      <Row>
                          <Form-item label="车牌号"  >
                              <Input v-model="searchForm.carPlate" ></Input>
                          </Form-item>
                      </Row>
                  </Form>
                  <Row >
                      <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
                      <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
                  </Row>
              </div>
          </Poptip>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--&lt;!&ndash;新增编辑&ndash;&gt;-->
    <ordersForm :modalShow="formShow"
                :parentCusType="searchForm.cusType"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></ordersForm>
    <!--是否删除框-->
    <Modal v-model="delModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmDel">删除</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getExamOrderList} from './../../api/getData'
  import {clearObj} from './../../libs/util';
  import ordersForm from './ordersForm.vue'
  import orderExpandTable from './ordersExpandTable.vue';
  export default {
    name:'ordersTable',
    components:{
        ordersForm,
        orderExpandTable
    },
    data() {
      return {
        tableLoading:false,//table是否在加载中
        tableColums: [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(orderExpandTable, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
          {
            align:'center',
            title: '订单号',
            key: 'OrderNum',
          },
          {
            align:'center',
            title: '教练员',
            key: 'Exam_CoachName',
          },
          {
            align:'center',
            title: '教练手机',
            key: 'Exam_CoachMobile',
          },
            {
                align:'center',
                title: '车牌号',
                key: 'Exam_CarPlate',
            },
            {
                align:'center',
                title: '车编号',
                key: 'Exam_CarNum',
            },
          {
              align:'center',
              title: '自动或手动',
              key: 'Exam_CarType',
          },
          {
            align:'center',
            title: '订单状态',
            key: 'OrderStatus',
          },
          {
            align:'center',
            title: '学习时长',
            key: 'ExamHour',
          },
          {
            align:'center',
            title: '开始时间',
            key: 'ExamStart',
          },
          {
            align:'center',
            title: '结束时间',
            key: 'ExamEnd',
          },
//          {
//            align:'center',
//            title: '教练价格',
//            key: 'CoachPrice',
//          },
//          {
//              align:'center',
//              title: '总价格',
//              key: 'TotalCost',
//          },
//          {
//              align:'center',
//              title: '成本价格',
//              key: 'BasicCost',
//          },
//          {
//              align:'center',
//              title: '单小时总优惠',
//              key: 'HourTotalDiscount',
//          },
//          {
//            align:'center',
//            title: '单小时驾校优惠',
//            key: 'HourSchoolDiscout',
//          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              actions.push( h('Button', {
                  props: {
                      type: 'warning',
                      size: 'small'
                  },
                  style: {
                      marginRight: '5px'
                  },
                  on: {
                      click: () => {
                          this.printOrder(params.row)
                      }
                  }
              }, '打印'));
//              actions.push(  h('Button', {
//                  props: {
//                      type: 'error',
//                      size: 'small'
//                  },
//                  style: {
//                      marginRight: '5px'
//                  },
//                  on: {
//                      click: () => {
//                          this.delCar(params.row.Id)
//                      }
//                  }
//              }, '删除'));
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'新增订单',
        parentForm:{
          Id:'',
          CarPlate: '',
          CarNum: '',
          CarFrame: '',
          AutoType: '',
          CarStatus: '',
          MacAddr: '',
          PlateColor: '',
          CarPhoto:'',
          Manufacture:'',
          Brand:'',
          Model:'',
          Remark:'',
        },
        searchForm:{
          cusType:'教练客源',
          coachName:'',
          carPlate:'',
          rows:10,
          page:1,
        },
        delModal:false,
        delId:'', //删除的Id
      }
    },
    created(){

    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
        this.searchForm.PoolNum='';
        this.searchForm.SimNum='';
        this.searchForm.SimStatus='全部';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
        doChangeCusType(){
            this.currentPage=1;
            this.searchForm.coachName='';
            this.searchForm.carPlate='';
//            if(this.searchForm.cusType=='教练客源')
//                this.newTableCols=this.coachColums;
//            else
//                this.newTableCols=this.naturalCols;
            this.getTableList();
        },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getExamOrderList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addCar(){
          clearObj(this.parentForm);
          this.formTitle='新增订单';
          this.formShow=true;
      },
        printOrder(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='打印订单';
        this.formShow=true;
      },
      addFlow(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.addFlowformShow=true;
      },
      hideModel(){
        this.formShow=false;
      },
      delUser(Id){
          this.delId=Id;
          this.delModal=true;
      },
      async comfirmDel(){
          this.btnLoading=true;
          try{
              const res= await delUser({Id:this.delId});
              if (res.success) {
                  this.$Message.success('删除成功!');
                  this.getTableList();
                  this.delModal=false;
              }else{
                  this.$Message.error(res.msg);
              }
          }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
          }
          this.btnLoading=false;
      },
    }
  }

</script>
