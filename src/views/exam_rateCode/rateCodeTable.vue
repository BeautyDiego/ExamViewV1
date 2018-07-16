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
          <Button class="top-right-btn" size="large" icon="plus" @click=" addRate">添加</Button>

          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
              <Button type="primary" icon="ios-search" size="large" >搜  索</Button>
              <div style="text-align:center" slot="content">
                  <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                      <Row>
                          <Form-item label="所属公司"  >
                              <Input v-model="searchForm.OwenCompany" ></Input>
                          </Form-item>
                      </Row>
                      <Row>
                          <Form-item label="负责人"  >
                              <Input v-model="searchForm.Owener" ></Input>
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
    <rateCodeForm :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></rateCodeForm>
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
  import {getExamRateCodeList,delExamRateCode} from './../../api/getData'
  import {clearObj} from './../../libs/util';
  import rateCodeForm from './rateCodeForm.vue'
  export default {
    name:'rateCodeTable',
    components:{
        rateCodeForm,
    },
    data() {
      return {
        tableLoading:false,//table是否在加载中
        tableColums: [
           {
             type: 'index',
             width: 60,
             title:'序号',
             align: 'center'
          },
          {
            align:'center',
            title: '优惠卷编号',
            key: 'RateCode',
          },
          {
            align:'center',
            title: '价值（元）',
            key: 'Worth',render: (h, params) => { return '￥'+params.row.Worth.toFixed(2);}
          },
          {
            align:'center',
            title: '优惠起始小时',
            key: 'StartHour',
          },
          {
            align:'center',
            title: '是否生效',
            key: 'Enabled', render: (h, params) => {
                            const row = params.row;
                            const color = row.Enabled === '立即生效' ? 'green': 'red';
                            const text = row.Enabled;

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
          },
          {
            align:'center',
            title: '开始时间',
            key: 'StartDate',
             
          },
          {
            align:'center',
            title: '结束时间',
            key: 'EndDate',
          },
          {
            align:'center',
            title: '所属公司',
            key: 'OwenCompany',
          },
          {
            align:'center',
            title: '负责人',
            key: 'Owener',
          },
          {
            align:'center',
            title: '负责人电话',
            key: 'OwenPhone',
          },
          {
              align:'center',
              title: '备注',
              key: 'Remark',
          },
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
                          this.editRate(params.row)
                      }
                  }
              }, '修改'));
              actions.push(  h('Button', {
                  props: {
                      type: 'error',
                      size: 'small'
                  },
                  style: {
                      marginRight: '5px'
                  },
                  on: {
                      click: () => {
                          this.delRate(params.row.Id)
                      }
                  }
              }, '删除'));
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'添加优惠卷',
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
          OwenCompany: '',
          Owener: '',
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
        this.searchForm.OwenCompany='';
        this.searchForm.Owener='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getExamRateCodeList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
       addRate(){
          clearObj(this.parentForm);
          this.formTitle='添加优惠卷';
          this.formShow=true;
      },
      editRate(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改优惠卷';
        this.formShow=true;
      },

      hideModel(){
        this.formShow=false;
      },
      delRate(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmDel(){
          this.btnLoading=true;
          try{
              const res= await delExamRateCode({Id:this.delId});
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
