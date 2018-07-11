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
              <Input v-model="modalForm.Exam_CoachMobile"  ></Input>
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
                <Button :loading="modalForm_loading" type="warning" @click="getRateCode()">验证优惠</Button>
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
              <Row class="setting-row"><Col span="12" class="setting-title">车类型：</Col><Col span="12">{{modalForm.Exam_CarType===1?'手动挡':'自动挡'}}</Col></Row>
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

    </Form>
    <div slot="footer">
      <Button type="ghost" :loading="modalForm_loading" @click="cancel" >取消</Button>
      <Button type="ghost" :loading="modalForm_loading" @click="nextStep" v-show="currentStep==0" >下一步</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm" v-show="currentStep==1" >提交订单</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {getValidCarCombo,getExamExpense,validateCoachMobile,getRateCode,addExamOrder} from './../../api/getData'
import {clearObj} from './../../libs/util'
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
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加用户',
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
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        // this.modalForm=Object.assign(this.parentForm);
        this.getValidCarCombo();
        clearObj(this.modalForm);
        this.modalForm.CusType='自然客源';
        this.IsModalShow = curVal;
        this.currentStep = 0;
        this.rateCode={RateCode:'',Worth:0,StartHour:'',StartDate:'',EndDate:''};

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
                console.log(this.standCostMin)
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
                          this.modalForm.CoachPrice = this.modalForm.CostPerHour;
                          this.modalForm.TotalCost = this.orderOriginAmount-this.saveMoney;
                          this.modalForm.HourTotalDiscount = this.expense.HourTotalDiscount;
                          this.modalForm.HourSchoolDiscout = this.expense.HourSchoolDiscout;
                      }else{
                          this.modalForm.BasicCost = this.expense.BasicCost;
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
                this.$Message.success('提交成功!');
                this.$emit('listenModalForm');
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
          }else{
              this.$Message.error(res.msg);
          }
          console.log(this.rateCode)
          this.modalForm_loading=false;
      },
    }
}

</script>
