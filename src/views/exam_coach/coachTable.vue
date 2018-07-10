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
          <Button class="top-right-btn" size="large" icon="plus" @click="addCar">添加</Button>

          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
              <Button type="primary" icon="ios-search" size="large" >搜  索</Button>
              <div style="text-align:center" slot="content">
                  <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                      <Row>
                          <Form-item label="教练名"  >
                              <Input v-model="searchForm.coach_Name" ></Input>
                          </Form-item>
                      </Row>
                      <Row>
                          <Form-item label="手机号"  >
                              <Input v-model="searchForm.coach_mobile" ></Input>
                          </Form-item>
                      </Row>
                      <Row>
                          <Form-item label="所属驾校"  >
                              <Input v-model="searchForm.school" ></Input>
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
    <coachForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></coachForm>
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
  import {getExamCoachList,deleteExamCoach} from './../../api/getData'
  import {clearObj} from './../../libs/util';
  import coachForm from './coachForm.vue'
  export default {
    name:'coachTable',
    components:{
        coachForm,
    },
    data() {
      return {
        tableLoading:false,//table是否在加载中
        tableColums: [
          {
            align:'center',
            title: '教练名',
            key: 'CoachName',
          },
          {
            align:'center',
            title: '电话',
            key: 'CoachMobile',
          },
          {
            align:'center',
            title: '所属驾校',
            key: 'DrivingSchName',
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
                          this.editCoach(params.row)
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
                          this.delCoach(params.row.Id)
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
        formTitle:'添加教练员',
        parentForm:{
            Id:'',
            CoachName: '',
            CoachMobile: '',
            DrivingSchName: '',
            Remark: '',
        },
        searchForm:{
          coach_Name: '',
          coach_mobile:'',
          school: '',
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
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getExamCoachList(params);
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
          this.formTitle='添加教练员';
          this.formShow=true;
      },
      editCoach(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改教练员';
        this.formShow=true;
      },
      hideModel(){
        this.formShow=false;
      },
      delCoach(Id){
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
