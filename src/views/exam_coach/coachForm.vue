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
    <Form ref="modalForm" :model="modalForm" :label-width="80"  value=true  style="padding: 3px 60px">
      <Form-item label="车牌号" prop="CarPlate" :rules="{required: true, message: '必填,1-10位字符',min:1,max:10, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.CarPlate" ></Input>
      </Form-item>
      <Form-item label="车编号" prop="CarNum" :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.CarNum" ></Input>
      </Form-item>
      <Form-item  label="车架号" prop="CarFrame"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.CarFrame" ></Input>
      </Form-item>
      <Form-item label="电话"  >
        <Input v-model="modalForm.Mobile" ></Input>
      </Form-item>
      <Form-item label="车辆类型"  >
        <Select v-model="modalForm.AutoType" placeholder="请选择">
          <Option v-for="item in AutoTypeCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
      </Form-item>
      <Form-item  label="MAC地址" prop="MacAddr"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.MacAddr" ></Input>
      </Form-item>
      <Form-item  label="车牌颜色" prop="PlateColor"  >
        <Select v-model="modalForm.PlateColor" placeholder="请选择">
          <Option v-for="item in PlateColorCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
      </Form-item>
      <Form-item  label="生产厂家" prop="Manufacture"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.Manufacture" ></Input>
      </Form-item>
      <Form-item  label="品牌" prop="Brand"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.Brand" ></Input>
      </Form-item>
      <Form-item  label="车辆类型" prop="Model"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.Model" ></Input>
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
import {editUser} from './../../api/getData'
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
          AutoTypeCombo:[{key:1,value:'手动挡'},{key:2,value:'自动挡'}],
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
              if (this.modalFormTitle ==='添加教练车'){
                 result = await addUser(params);
              }else{
                 result = await editUser(params);
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
