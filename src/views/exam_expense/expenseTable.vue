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
          <Button class="top-right-btn" size="large" icon="plus" @click="addExp">添加</Button>

      </Row>
    </div>
    
    <Row>
      <Table stripe size="small" :loading="tableLoading" :columns="newTableCols" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>

    <expenseForm :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></expenseForm>

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
  import {getExamExpenseList,delExamExpense} from './../../api/getData'
  import {clearObj} from './../../libs/util';
  import expenseForm from './expenseForm.vue'
  export default {
    name:'expenseTable',
    components:{
        expenseForm,
    },
    data() {
      return {
        tableLoading:false,//table是否在加载中
        newTableCols:[
          {
            align:'center',
            title: '客源类型',
            key: 'CusType',
          },
          {
            align:'center',
            title: '成本价(元/小时)',
            key: 'BasicCost',render: (h, params) => { return  params.row.BasicCost!=null?'￥'+params.row.BasicCost.toFixed(2):''  ;}
          },
          {
              align:'center',
              title: '优惠起始小时',
              key: 'StartHour',render: (h, params) => { return  params.row.StartHour.toFixed(2)+'小时';}
          },
          {
            align:'center',
            title: '单小时总优惠(元)',
            key: 'HourTotalDiscount',render: (h, params) => { return  params.row.HourTotalDiscount!=null?'￥'+params.row.HourTotalDiscount.toFixed(2):''  ;}
          },
          {
            align:'center',
            title: '单小时驾校优惠(元)',
            key: 'HourSchoolDiscout',render: (h, params) => { return  params.row.HourSchoolDiscout!=null?'￥'+params.row.HourSchoolDiscout.toFixed(2):''  ;}
          },
          {
            align:'center',
            title: '优惠后成本价(元/小时)',
            key: 'DiscountBasicCost',render: (h, params) => { return   params.row.DiscountBasicCost!=null?'￥'+params.row.DiscountBasicCost.toFixed(2):''  ;}
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
                          this.editExp(params.row)
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
                          this.delExp(params.row.Id)
                      }
                  }
              }, '删除'));
              return h('div', actions);
            }
          }
        ],
        naturalCols:[{
            align:'center',
            title: '客源类型',
            key: 'CusType',
          },
          {
            align:'center',
            title: '标准价格(元/小时)',
            key: 'StandardCost',render: (h, params) => { return  params.row.StandardCost!=null?'￥'+params.row.StandardCost.toFixed(2):''  ;}
          },
          {
              align:'center',
              title: '优惠起始小时',
              key: 'StartHour',render: (h, params) => { return  params.row.StartHour.toFixed(2)+'小时';}
          },
          {
            align:'center',
            title: '单小时总优惠(元)',
            key: 'HourTotalDiscount',render: (h, params) => { return  params.row.HourTotalDiscount!=null?'￥'+params.row.HourTotalDiscount.toFixed(2):''  ;}
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
                          this.editExp(params.row)
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
                          this.delExp(params.row.Id)
                      }
                  }
              }, '删除'));
              return h('div', actions);
            }
          }
        ],
        coachColums: [
          {
            align:'center',
            title: '客源类型',
            key: 'CusType',
          },
          {
            align:'center',
            title: '成本价(元/小时)',
            key: 'BasicCost',render: (h, params) => { return  params.row.BasicCost!=null?'￥'+params.row.BasicCost.toFixed(2):'' ;}
          },
          {
              align:'center',
              title: '优惠起始小时',
              key: 'StartHour',render: (h, params) => { return  params.row.StartHour.toFixed(2)+'小时';}
          },
          {
            align:'center',
            title: '单小时总优惠(元)',
            key: 'HourTotalDiscount',render: (h, params) => { return  params.row.HourTotalDiscount!=null?'￥'+params.row.HourTotalDiscount.toFixed(2):''  ;}
          },
          {
            align:'center',
            title: '单小时驾校优惠(元)',
            key: 'HourSchoolDiscout',render: (h, params) => { return  params.row.HourSchoolDiscout!=null?'￥'+params.row.HourSchoolDiscout.toFixed(2):''  ;}
          },
          {
            align:'center',
            title: '优惠后成本价(元/小时)',
            key: 'DiscountBasicCost',render: (h, params) => { return   params.row.DiscountBasicCost!=null?'￥'+params.row.DiscountBasicCost.toFixed(2):''  ;}
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
                          this.editExp(params.row)
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
                          this.delExp(params.row.Id)
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
        formTitle:'添加计费规则',
        parentForm:{
          Id:'',
          CusType:'教练客源',
          StartHour:1,
          BasicCost:1,
          StandardCost:1,
          HourSchoolDiscout:1,
          HourTotalDiscount:1,
          Remark:'',
        },
        resetForm:{
          Id:'',
          CusType:'教练客源',
          StartHour:1,
          BasicCost:1,
          StandardCost:1,
          HourSchoolDiscout:1,
          HourTotalDiscount:1,
          Enabled:'立即生效',
          Remark:'',
        },
        searchForm:{
          cusType:'教练客源',
          rows:10,
          page:1,

        },
        delModal:false,
        delId:'', //删除的Id
      }
    },
    created(){
       // this.newTableCols=this.coachColums;
    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
        this.searchForm.cusType='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getExamExpenseList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
       addExp(){
         this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
          this.formTitle='添加计费规则';
          this.formShow=true;
      },
      editExp(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改计费规则';
        debugger;
        this.formShow=true;
      },
      addFlow(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.addFlowformShow=true;
      },
      hideModel(){
        this.formShow=false;
      },
      delExp(Id){
        this.delId=Id;
        this.delModal=true;
      },
      doChangeCusType(){
          this.currentPage=1;
          if(this.searchForm.cusType=='教练客源')
          this.newTableCols=this.coachColums;
          else
           this.newTableCols=this.naturalCols;
        this.getTableList();
      },
      async comfirmDel(){
          this.btnLoading=true;
          try{
              const res= await delExamExpense({Id:this.delId});
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
