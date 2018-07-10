<style scoped>

</style>

<template>

<div>

  <Modal
    v-model ="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="600">
    
    <Form ref="modalForm" :model="modalForm" :label-width="110"  value=true  style="padding: 3px 60px">
         <Form-item label="客源类型" >
          <RadioGroup v-model ="modalForm.CusType" type="button" size="large" >
              <Radio label="教练客源"></Radio>
              <Radio label="自然客源"></Radio>
            </RadioGroup>
        </Form-item>
      <Form-item label="标准价格" prop="StandardCost" v-if="modalForm.CusType=='自然客源'" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}">
      ￥<Input-number  v-model ="modalForm.StandardCost"></Input-number>元
      </Form-item>
      <Form-item label="成本价格" prop="BasicCost" v-if="modalForm.CusType=='教练客源'" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}">
       ￥<Input-number :max="9999" :min="1" v-model ="modalForm.BasicCost"></Input-number>
      </Form-item>
      <Form-item  label="满几小时可用" prop="StartHour"  :rules="{required: true, message: '必填,最小1小时，最大10小时', trigger:'blur',type:'number'}" >
      <InputNumber :max="10" :min="1" v-model ="modalForm.StartHour"></InputNumber>小时
      </Form-item>
           <Form-item label="单小时总优惠" prop="HourTotalDiscount" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}">
       ￥<Input-number :max="9999" :min="1" v-model ="modalForm.HourTotalDiscount"></Input-number>元
      </Form-item>
           <Form-item label="单小时驾校优惠" v-if="modalForm.CusType=='教练客源'" prop="HourSchoolDiscout" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}">
      ￥<Input-number :max="9999" :min="1" v-model ="modalForm.HourSchoolDiscout"></Input-number>元
      </Form-item>
      <Form-item label="是否立即生效" prop="Enabled" :rules="{required: true, message: '必填', trigger:'blur'}" >
          <RadioGroup v-model ="modalForm.Enabled" type="button" size="large" >
              <Radio label="立即生效"></Radio>
              <Radio label="暂不生效"></Radio>
            </RadioGroup>
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
import {addExamExpense,editExamExpense} from './../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
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
          AutoTypeCombo:[{key:1,value:'手动挡'},{key:2,value:'自动挡'}],
          PlateColorCombo:[{key:1,value:'黄牌'},{key:2,value:'蓝牌'}],
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        console.log( this.modalForm);
        this.IsModalShow = curVal;
      }
    },
    created(){
    },
    mounted(){
    
    },
    methods: {
      cancel() {
          this.$emit('listenModalForm');
      },
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = this.modalForm;
            try{
              let result;
              if (this.modalFormTitle ==='添加资费'){
                 result = await addExamExpense(params);
              }else{
                 result = await editExamExpense(params);
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
