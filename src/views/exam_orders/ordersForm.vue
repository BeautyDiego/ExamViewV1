<style scoped>
  .current-setting{font-size: 12px;}

  .current-setting .setting-row{
    line-height: 26px;
  }
  .current-setting .setting-title{
    color:#bbbbbb;
  }
</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <Row>
      <div style="padding-left:65px;padding-bottom:20px;">
        <Steps :current="currentStep" >
          <Step title="客源"></Step>
          <Step title="订单"></Step>
          <Step title="打印"></Step>
        </Steps>
      </div>
    </Row>
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 3px 30px">
      <div v-show="currentStep==0">
          <Form-item label="顾客来源：" >
              <RadioGroup v-model="modalForm.CusType" type="button" size="large" >
                <Radio label="教练客源"></Radio>
                <Radio label="自然客源"></Radio>
              </RadioGroup>
          </Form-item>
          <Form-item label="教练手机号："  v-if="IsCoachSource">
              <Input v-model="modalForm.Exam_CoachMobile" style="width:200px;" maxlength="11"></Input>
          </Form-item>

      </div>
      <div v-show="currentStep==1">
        <Row >
          <Col span="14"  >
          <Form-item label="每小时价格：" >
            <InputNumber v-model="modalForm.CostPerHour" :readonly="!IsCoachSource" :min="standCostMin"></InputNumber>
          </Form-item>
          <Form-item label="学习时长：" >
            <InputNumber  v-model="modalForm.ExamHour" :min="0"></InputNumber >
          </Form-item>
          <Form-item label="教练车：" >
            <Select v-model="modalForm.CarId" placeholder="请选择" @on-change="onCarChange">
              <Option v-for="item in carCombo" :value="item.Id" :key="item.Id">{{ item.CarPlate }}</Option>
            </Select>
          </Form-item>
          <Form-item label="优惠码：" v-if="!IsCoachSource" >
            <Row>
              <Col span="16">
                <Input v-model="modalForm.RateCode" ></Input>
              </Col>
              <Col offset="1" span="6">
                <Button :loading="modalForm_loading" type="warning" @click="getRateCode()" :disabled="IsDiscounted">验证优惠</Button>
              </Col>
            </Row>

          </Form-item>
          </Col>
          <Col offset="2" span="8">
          <Card :bordered="true" style="background-color: #fafafa">
            <p slot="title">订单详情</p>
            <div class="current-setting">
              <Row class="setting-row"><Col span="12" class="setting-title">客源：</Col><Col span="12">{{modalForm.CusType}}</Col> </Row>
              <Row class="setting-row" v-if="IsCoachSource"><Col span="12" class="setting-title">教练员：</Col><Col span="12">{{modalForm.Exam_CoachName}}</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">车牌：</Col><Col span="12">{{modalForm.Exam_CarPlate}}</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">车号：</Col><Col span="12">{{modalForm.Exam_CarNum}}</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">车类型：</Col><Col span="12">{{modalForm.Exam_CarType}}</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">学习时长：</Col><Col span="12">{{modalForm.ExamHour}}小时</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">每个小时单价：</Col><Col span="12">￥{{modalForm.CostPerHour}}</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">单个钟优惠：</Col><Col span="12">￥{{expense.HourTotalDiscount}}</Col></Row>
              <Row class="setting-row" v-if="!IsCoachSource"><Col span="12" class="setting-title">优惠券优惠：</Col><Col span="12">￥{{rateCode.Worth}}</Col></Row>
              <Row class="setting-row"><Col span="12" class="setting-title">订单金额：</Col><Col span="12">￥{{orderOriginAmount}}</Col></Row>
              <Row style="font-size:28px;color:#ea6219;">￥{{orderOriginAmount-saveMoney}}</Row>
              <Row style="font-size:18px;color:#47b348;">省￥{{saveMoney}}</Row>
            </div>
          </Card>
          </Col>
        </Row>

      </div>
      <div v-if="currentStep==2">
        <Card :bordered="true" style="background-color: #fafafa" id="order-print">
          <p slot="title">订单详情</p>
          <div class="current-setting">
            <Row class="setting-row"><Col span="12" class="setting-title">订单编号：</Col><Col span="12">{{order.OrderNum}}</Col> </Row>
            <Row class="setting-row"><Col span="12" class="setting-title">客源：</Col><Col span="12">{{order.CusType}}</Col> </Row>
            <Row class="setting-row" v-if="IsCoachSource"><Col span="12" class="setting-title">教练员：</Col><Col span="12">{{order.Exam_CoachName}}</Col></Row>
            <Row class="setting-row" v-if="IsCoachSource"><Col span="12" class="setting-title">教练员：</Col><Col span="12">{{order.Exam_CoachMobile}}</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">车牌：</Col><Col span="12">{{order.Exam_CarPlate}}</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">车号：</Col><Col span="12">{{order.Exam_CarNum}}</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">车类型：</Col><Col span="12">{{order.Exam_CarType}}</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">学习时长：</Col><Col span="12">{{order.ExamHour}}小时</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">开始时间：</Col><Col span="12">{{order.ExamStart}}</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">结束时间：</Col><Col span="12">{{order.ExamEnd}}</Col></Row>
            <Row class="setting-row"><Col span="12" class="setting-title">订单金额：</Col><Col span="12">￥{{order.TotalCost}}</Col></Row>
          </div>
        </Card>
      </div>

    </Form>
    <div slot="footer">
      <Button type="ghost" :loading="modalForm_loading" @click="cancel" >取消</Button>
      <Button type="ghost" :loading="modalForm_loading" @click="nextStep" v-show="currentStep==0" >下一步</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm" v-show="currentStep==1" >提交订单</Button>
      <Button type="warning" :loading="modalForm_loading" @click="printOrder" v-show="currentStep==2" >打印</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {getValidCarCombo,getExamExpense,validateCoachMobile,getRateCode,addExamOrder} from './../../api/getData'
import {clearObj} from './../../libs/util'
import {getLodop} from './../../libs/LodopFuncs'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            UserName: '',
            LoginName: '',
            Pwd:'',
            PhoneNum:'',
            Mobile:'',
            Sys_RoleId:0,
          }
        }
      },
      parentCusType:{
          type: String,
          default: '教练客源',
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加订单',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
              CusType:'自然客源',
              OrderNum:'',
              Exam_CoachName:'',
              Exam_CoachMobile:'',
              CarId:'',
              Exam_CarPlate:'',
              Exam_CarNum:'',
              Exam_CarType:'',
              OrderStatus:'',
              ExamHour:'',
              ExamStart:'',
              ExamEnd:'',
              CostPerHour:'', //  每小时价格
              StandardCost:'',
              CoachPrice:'',
              TotalCost:'',
              BasicCost:'',
              HourTotalDiscount:'',
              HourSchoolDiscout:'',
              TotalDiscount:'',
              SchoolDiscout:'',
              RateCode:'',
              RateCodeWorth:'',
          },
          modalForm_loading:false,
          currentStep:0,
          carCombo:[], // 教练车Combo
          expenseList:[{CusType:'自然客源',BasicCost:'',StandardCost:'',StartHour:'',HourTotalDiscount:'',HourSchoolDiscout:'',DiscountBasicCost:''}], // 计费规则
          rateCode:{RateCode:'',Worth:0,StartHour:'',StartDate:'',EndDate:''},
          coach:{},
          standCostMin:0,
          IsDiscounted:false,
          order:{OrderNum:'',CusType:'',Exam_CoachName:'',Exam_CoachMobile:'',Exam_CarPlate:'',Exam_CarNum:'',Exam_CarType:'',ExamHour:'',ExamStart:'',ExamEnd:'',TotalCost:'',},//提交完成后的订单
        }
    },
    watch:{
      modalShow(curVal,oldVal){
          if(this.modalFormTitle=='打印订单'){
              this.currentStep = 2;
              this.order=Object.assign(this.parentForm);
              this.modalForm.CusType=this.order.CusType;
              this.IsModalShow = curVal;
          }else{
              this.getValidCarCombo();
              clearObj(this.modalForm);
              this.modalForm.CusType=this.parentCusType;
              this.IsModalShow = curVal;
              this.currentStep = 0;
              this.rateCode={RateCode:'',Worth:0,StartHour:'',StartDate:'',EndDate:''};
              this.IsDiscounted=false;
          }

      }
    },
    computed:{
      IsCoachSource:function () {
          return this.modalForm.CusType==='教练客源';
      },
      expense:function () {
          if (this.modalForm.CusType==='教练客源'){
              return this.expenseList.find((expense)=>expense.CusType==='教练客源')
          }else{
              return this.expenseList.find((expense)=>expense.CusType==='自然客源')
          }

      },
        // 订单原来金额
      orderOriginAmount:function () {
          if (this.modalForm.CostPerHour&&this.modalForm.ExamHour){

              return this.modalForm.CostPerHour*this.modalForm.ExamHour

          }else{
              return 0;
          }
      },
        //驾校 给省的钱
        schoolSaveMoney:function () {
            if (this.modalForm.CusType==='教练客源'){
                let moneySave=0;
                if (this.modalForm.ExamHour>=this.expense.StartHour){
                    moneySave+=(this.modalForm.ExamHour-this.expense.StartHour+1)*this.expense.HourSchoolDiscout
                }
                return moneySave;
            }else{
                return 0;
            }
        },
        saveMoney:function () {
            if (this.modalForm.CusType==='教练客源'){
                let moneySave=0;
                if (this.modalForm.ExamHour>=this.expense.StartHour){
                    moneySave+=(this.modalForm.ExamHour-this.expense.StartHour+1)*this.expense.HourTotalDiscount
                }
                return moneySave;
            }else{
                let moneySave=0;
                if (this.modalForm.ExamHour>=this.expense.StartHour){
                    moneySave+=(this.modalForm.ExamHour-this.expense.StartHour+1)*this.expense.HourTotalDiscount
                }
                if (this.rateCode.Worth&&this.modalForm.ExamHour>=this.rateCode.StartHour){
                    moneySave+=this.rateCode.Worth
                }
                return moneySave;
            }
        }
    },
    created(){
        this.getValidCarCombo();
        this.getExamExpense();
    },
    mounted(){
    
    },
    methods: {
      cancel() {
          this.$emit('listenModalForm');
      },
      async nextStep(){
        if (this.IsCoachSource){
            let result = await validateCoachMobile({Exam_CoachMobile:this.modalForm.Exam_CoachMobile});
            if (result.success){
                this.modalForm.Exam_CoachName=result.coach.CoachName;
                this.standCostMin = this.expense.BasicCost;
                this.currentStep=1;
            }else{
                this.$Message.error(result.msg);
            }
        }else{
            this.currentStep=1;
            this.modalForm.CostPerHour = this.expense.StandardCost;
        }
      },
      async saveForm() {

            this.modalForm_loading=true;
            try{
              let result;
              if (this.modalFormTitle ==='新增订单'){
                  if (this.validateOrder()){
                      if (this.IsCoachSource){ // 是教练客源
                          if (this.modalForm.CostPerHour<=this.expense.BasicCost){
                              this.$Message.error('每小时价格不得低于成本价');
                              this.modalForm_loading=false;
                              return
                          }
                          if (this.modalForm.ExamHour>=this.expense.StartHour){
                              this.modalForm.BasicCost = this.expense.BasicCost*(this.expense.StartHour-1)+this.expense.DiscountBasicCost*(this.modalForm.ExamHour-this.expense.StartHour+1); //算出总成本
                          }else{
                              this.modalForm.BasicCost = this.expense.BasicCost*(this.expense.StartHour-1)
                          }

                          this.modalForm.CoachPrice = this.modalForm.CostPerHour;
                          this.modalForm.TotalCost = this.orderOriginAmount-this.saveMoney;
                          this.modalForm.HourTotalDiscount = this.expense.HourTotalDiscount;
                          this.modalForm.HourSchoolDiscout = this.expense.HourSchoolDiscout;
                          this.TotalDiscount=this.saveMoney; // 总的优惠的价格
                          this.TotalShoolDiscount=this.schoolSaveMoney; // 驾校优惠的价格
                      }else{
                          this.modalForm.BasicCost = this.expense.BasicCost;
                          this.modalForm.TotalCost = this.orderOriginAmount-this.saveMoney;
                          this.modalForm.HourTotalDiscount = this.expense.HourTotalDiscount;
                          this.modalForm.RateCode = this.rateCode.RateCode;
                          this.modalForm.RateCodeWorth = this.rateCode.Worth;
                      }
                      result = await addExamOrder(this.modalForm);
                  }else{
                      this.$Message.error('请填写完整');
                      this.modalForm_loading=false;
                      return
                  }

              }else{

              }
              if (result.success) {
                this.order=result.order;
                this.currentStep=2;
                debugger;
                this.$Message.success('提交成功!');
                this.$emit('refreshTableList');
              }else{
                this.$Message.error(result.msg);
              }
            }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
            }
            this.modalForm_loading=false;


      },
      validateOrder(){
        return this.modalForm.CostPerHour&&this.modalForm.ExamHour&&this.modalForm.CarId
      },
      onCarChange(){
        if (this.modalForm.CarId){
            let car = this.carCombo.find(c => c.Id===this.modalForm.CarId)
            this.modalForm.Exam_CarPlate = car.CarPlate;
            this.modalForm.Exam_CarNum = car.CarNum;
            this.modalForm.Exam_CarType = car.AutoType;
        }
      },
      async getValidCarCombo(){
          this.carCombo = await getValidCarCombo();
      },
      async getExamExpense(){
          this.expenseList = await getExamExpense();
      },
      async getRateCode(){
          this.modalForm_loading=true;
          let res = await getRateCode({RateCode:this.modalForm.RateCode});
          if (res.success) {
              this.rateCode = res.rateCode;
              this.IsDiscounted = true; // 只能优惠一次
          }else{
              this.$Message.error(res.msg);
          }
          this.modalForm_loading=false;
      },
      printOrder(){
          this.CreateOneFormPage();
          LODOP.PRINT();
        //  LODOP.PREVIEW();

      },
        CreateOneFormPage() {
            LODOP = getLodop();
            LODOP.PRINT_INITA(0, 0, 230, 230, "订单详情");
            LODOP.SET_PRINT_STYLE("FontSize", 8);
            LODOP.SET_PRINT_STYLE("Bold", 1);
            LODOP.ADD_PRINT_TEXT(20, 10, 230, 20, "订单编号："+this.order.OrderNum);
            LODOP.ADD_PRINT_TEXT(40, 10, 230, 20, "客源："+this.order.CusType);
            if (this.IsCoachSource){
                LODOP.ADD_PRINT_TEXT(60, 10, 230, 20, "教练员："+this.order.Exam_CoachName);
                LODOP.ADD_PRINT_TEXT(80, 10, 230, 20, "教练手机："+this.order.Exam_CoachMobile);
                LODOP.ADD_PRINT_TEXT(100, 10, 230, 20, "车牌："+this.order.Exam_CarPlate);
                LODOP.ADD_PRINT_TEXT(120, 10, 230, 20, "车号："+this.order.Exam_CarNum);
                LODOP.ADD_PRINT_TEXT(140, 10, 230, 20, "车类型："+this.order.Exam_CarType);
                LODOP.ADD_PRINT_TEXT(160, 10, 230, 20, "学习时长："+this.order.ExamHour+"小时");
                LODOP.ADD_PRINT_TEXT(180, 10, 230, 20, "开始时间："+this.order.ExamStart);
                LODOP.ADD_PRINT_TEXT(200, 10, 230, 20, "结束时间："+this.order.ExamEnd);
                LODOP.ADD_PRINT_TEXT(220, 10, 230, 20, "订单金额：￥"+this.order.TotalCost);
            }else{
                LODOP.ADD_PRINT_TEXT(60, 10, 230, 20, "车牌："+this.order.Exam_CarPlate);
                LODOP.ADD_PRINT_TEXT(80, 10, 230, 20, "车号："+this.order.Exam_CarNum);
                LODOP.ADD_PRINT_TEXT(100, 10, 230, 20, "车类型："+this.order.Exam_CarType);
                LODOP.ADD_PRINT_TEXT(120, 10, 230, 20, "学习时长："+this.order.ExamHour+"小时");
                LODOP.ADD_PRINT_TEXT(140, 10, 230, 20, "开始时间："+this.order.ExamStart);
                LODOP.ADD_PRINT_TEXT(160, 10, 230, 20, "结束时间："+this.order.ExamEnd);
                LODOP.ADD_PRINT_TEXT(180, 10, 230, 20, "订单金额：￥"+this.order.TotalCost);
            }


        },
    }
}

</script>
