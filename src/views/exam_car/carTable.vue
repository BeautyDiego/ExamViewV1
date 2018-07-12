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
                          <Form-item label="车牌号"  >
                              <Input v-model="searchForm.car_Plate" ></Input>
                          </Form-item>
                      </Row>
                      <Row>
                          <Form-item label="MAC地址"  >
                              <Input v-model="searchForm.car_Mac" ></Input>
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
    <carForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></carForm>
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
      <!--车辆照片-->
      <Modal title="车辆照片" v-model="visible">
          <img :src="carPhotoSrc" v-if="visible" style="width: 100%">
          <div slot="footer">
          </div>
      </Modal>
  </div>

</template>

<script>
  import {getExamCarList,deleteExamCar} from './../../api/getData'
  import {clearObj} from './../../libs/util';
  import carForm from './carForm.vue'
  export default {
    name:'carTable',
    components:{
        carForm,
    },
    data() {
      return {
        tableLoading:false,//table是否在加载中
        tableColums: [
          {
            align:'center',
            title: '车牌号',
            key: 'CarPlate',
          },
          {
            align:'center',
            title: '车编号',
            key: 'CarNum',
          },
          {
            align:'center',
            title: '车架号',
            key: 'CarFrame',
          },
          {
              align:'center',
              title: '自动或手动',
              key: 'AutoType',
              render: (h, params) => {
                  let autoTypeTxt = params.row.AutoType===1?'手动挡':'自动挡';
                  return h('span', autoTypeTxt);
              }
          },
          {
            align:'center',
            title: '车辆状态',
            key: 'CarStatus',
              render: (h, params) => {
                  let CarStatusTxt = '';
                  switch(params.row.CarStatus)
                  {
                      case 1:
                          CarStatusTxt='空闲';
                          break;
                      case 2:
                          CarStatusTxt='考试中';
                          break;
                      case 3:
                          CarStatusTxt='离线';
                          break;
                      default:
                          CarStatusTxt='';
                  }
                  return h('span', CarStatusTxt);
              }
          },
          {
            align:'center',
            title: 'MAC地址',
            key: 'MacAddr',
          },
          {
            align:'center',
            title: '车牌颜色',
            key: 'PlateColor',
              render: (h, params) => {
                  let PlateColorTxt = '';
                  switch(params.row.PlateColor)
                  {
                      case 1:
                          PlateColorTxt='黄牌';
                          break;
                      case 2:
                          PlateColorTxt='蓝牌';
                          break;
                      default:
                          PlateColorTxt='';
                  }
                  return h('span', PlateColorTxt);
              }
          },
          {
            align:'center',
            title: '车辆照片',
            key: 'CarPhoto',
              render: (h, params) => {
                  let photoSrc = '';
                  if(params.row.CarPhoto)
                  {
                      photoSrc= this.UpLoadURL_PREFIX + params.row.CarPhoto;
                  }
                  return h('img',  {
                      attrs: {
                          src: photoSrc
                      },
                      on: {
                          click: () => {
                              this.showPhoto(photoSrc)
                          }
                      },
                      style: {
                          width: '60px'
                      }
                  });
              }
          },
          {
            align:'center',
            title: '生产厂家',
            key: 'Manufacture',
          },
          {
              align:'center',
              title: '品牌',
              key: 'Brand',
          },
          {
              align:'center',
              title: '模型',
              key: 'Model',
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
                          this.editCar(params.row)
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
                          this.delCar(params.row.Id)
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
        formTitle:'添加车辆',
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
          car_Plate:'',
          car_Mac: '',
          rows:10,
          page:1,
        },
        delModal:false,
        delId:'', //删除的Id
        carPhotoSrc:'',
        visible:false,

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
        const res = await getExamCarList(params);
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
          this.formTitle='添加教练车';
          this.formShow=true;
      },
      editCar(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改教练车';
        this.formShow=true;
      },
      addFlow(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.addFlowformShow=true;
      },
      hideModel(){
        this.formShow=false;
      },
      delCar(Id){
          this.delId=Id;
          this.delModal=true;
      },
      async comfirmDel(){
          this.btnLoading=true;
          try{
              const res= await deleteExamCar({Id:this.delId});
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
        showPhoto(src){
          this.visible=true;
          this.carPhotoSrc = src;
        },
    }
  }

</script>
