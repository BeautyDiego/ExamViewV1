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
      <Form-item label="教练名" prop="CoachName" :rules="{required: true, message: '必填,1-10位字符',min:1,max:10, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.CoachName" ></Input>
      </Form-item>
      <Form-item label="手机号" prop="CoachMobile" :rules="{required: true, message: '必填,如18628888888这样11位手机号', trigger:'blur',type:'string',pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/}" >
        <Input v-model="modalForm.CoachMobile" ></Input>
      </Form-item>
      <Form-item  label="所属驾校名" prop="DrivingSchName"  :rules="{required: true, message: '必填,1-20位字符',min:1,max:20, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.DrivingSchName" ></Input>
      </Form-item>
      <Form-item  label="备注"    >
        <Input v-model="modalForm.Remark"   type="textarea" placeholder="最多输入50字。" :rows="2" maxlength="50" ></Input>
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
import {addExamCoach,editExamCoach} from './../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
              Id:'',
              CoachName: '',
              CoachMobile: '',
              DrivingSchName: '',
              Remark: '',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加教练员',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
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
              if (this.modalFormTitle ==='添加教练员'){
                 result = await addExamCoach(params);
              }else{
                 result = await editExamCoach(params);
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
