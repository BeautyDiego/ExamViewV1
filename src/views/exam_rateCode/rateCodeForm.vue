<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="600">
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 3px 60px">
 
      <Form-item label="优惠码" prop="RateCode" :rules="{required: true, message: '必填,1-10位字符', trigger:'blur',type:'string'}" >
      <Row>
      <Col span="15">
       <Input v-model="modalForm.RateCode"  ></Input>
      </Col>
        <Col span="6"  style="float:right">
      <Button type="warning" @click='GenerateCode'>生成优惠码</Button>
      </Col>      
      </Row>
      </Form-item>

      <Form-item label="价值" prop="Worth" :rules="{required: true, message: '必填,请输入优惠券的价值', trigger:'blur',type:'number' }" >
         <InputNumber :max="999" :min="1" v-model="modalForm.Worth"></InputNumber>元
      </Form-item>
      <Form-item  label="满几小时可用" prop="StartHour"  :rules="{required: true, message: '必填,最小1小时，最大10小时', trigger:'blur',type:'number' }" >
      <InputNumber :max="10" :min="1" v-model="modalForm.StartHour"></InputNumber>小时
      </Form-item>
    <Form-item  label="开始日期" prop="StartDate"  :rules="{required: true, message: '必填', trigger:'blur',type:'date' }" >
         <DatePicker type="date" v-model="modalForm.StartDate" placeholder="开始日期" style="width: 200px"></DatePicker>
      </Form-item>
          <Form-item  label="结束日期" prop="EndDate"  :rules="{required: true, message: '必填', trigger:'blur',type:'date' }" >
        <DatePicker type="date" v-model="modalForm.EndDate" placeholder="结束日期" style="width: 200px"></DatePicker>
      </Form-item>

      <Form-item label="是否立即生效" prop="Enabled" :rules="{required: true, message: '必填', trigger:'blur'}" >
          <RadioGroup v-model="modalForm.Enabled" type="button" size="large" >
              <Radio label="立即生效"></Radio>
              <Radio label="暂不生效"></Radio>
            </RadioGroup>
        </Form-item>
      <Form-item  label="所属公司" prop="OwenCompany"  :rules="{required: true, message: '必填',min:1,max:20, trigger:'blur',type:'string' }" >
        <Input v-model="modalForm.OwenCompany" ></Input>
      </Form-item>
      <Form-item  label="负责人" prop="Owener"  :rules="{required: true, message: '必填',min:1,max:10, trigger:'blur',type:'string' }" >
        <Input v-model="modalForm.Owener" ></Input>
      </Form-item>
      <Form-item  label="负责人电话" prop="OwenPhone"  :rules="{required: true, message: '必填,如18628888888这样11位手机号', trigger:'blur',type:'string',pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/}" >
        <Input v-model="modalForm.OwenPhone" ></Input>
      </Form-item>
 <Form-item  label="备注"    >
        <Input v-model="modalForm.Remark"  type="textarea" placeholder="最多输入50字。" :rows="2" maxlength="50" ></Input>
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {addExamRateCode,editExamRateCode} from './../../api/getData'
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
          },
          modalForm_loading:false,
          EnabledCombo:[{key:1,value:'有效'},{key:2,value:'暂不生效'}],
          PlateColorCombo:[{key:1,value:'黄牌'},{key:2,value:'蓝牌'}],
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
      }
    },
    created(){
    },
    mounted(){
    
    },
    methods: {
      GenerateCode(){
             var chars = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
            
            var str = "";
            for(var i = 0; i < 6; i++)
            {
              var randomNum = parseInt(Math.random()*chars.length);
                str += chars[randomNum];
            }
            this.modalForm.RateCode=str;
      },
      cancel() {
          this.$emit('listenModalForm');
      },
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = this.modalForm;
            debugger;
            try{
              let result;
              if (this.modalFormTitle ==='添加优惠券'){
                 result = await addExamRateCode(params);
              }else{
                 result = await editExamRateCode(params);
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
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
}

</script>
