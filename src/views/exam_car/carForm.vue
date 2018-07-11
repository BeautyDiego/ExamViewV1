<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
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
      <Row>
        <Col span="12">
          <Form-item label="车牌号" prop="CarPlate" :rules="{required: true, message: '必填,请输入正确的车牌号',min:1,max:10, trigger:'blur',type:'string',pattern:/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/}" >
            <Input v-model="modalForm.CarPlate" ></Input>
          </Form-item>
          <Form-item label="车编号" prop="CarNum" :rules="{required: true, message: '必填,1-6位数字或字母', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{1,6}$/}" >
            <Input v-model="modalForm.CarNum" ></Input>
          </Form-item>
          <Form-item  label="车架号" prop="CarFrame"  :rules="{required: true, message: '必填,6-20位数字或字母', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,20}$/}" >
            <Input v-model="modalForm.CarFrame" ></Input>
          </Form-item>
        </Col>
        <Col span="12">
          <Form-item label="车辆照片"  >
          <div class="smallImg">
            <div  v-if="modalForm.CarPhoto" class="demo-upload-list" >
              <img :src="UpLoadURL_PREFIX+modalForm.CarPhoto">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
              </div>
            </div>
            <!-- type 2 参数代表是商品-->
            <Upload
                    ref="upload"
                    v-if="!modalForm.CarPhoto"
                    :headers="Headers"
                    :data="{type:1}"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    multiple
                    type="drag"
                    :action="UpLoadURL_PREFIX+'/UpLoadImage/UpLoadImage'"
                    style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
          <div>(宽高需为1:1)</div>
        </Form-item>
        </Col>
      </Row>

      <Form-item label="车辆类型"  >
        <Select v-model="modalForm.AutoType" placeholder="请选择">
          <Option v-for="item in AutoTypeCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
      </Form-item>
      <Form-item  label="MAC地址" prop="MacAddr"   >
        <Input v-model="modalForm.MacAddr" ></Input>
      </Form-item>
      <Form-item  label="车牌颜色" prop="PlateColor"  >
        <Select v-model="modalForm.PlateColor" placeholder="请选择">
          <Option v-for="item in PlateColorCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
      </Form-item>
      <Form-item  label="生产厂家" prop="Manufacture"  :rules="{required: true, message: '必填,最多20位', trigger:'blur',type:'string',max:20}" >
        <Input v-model="modalForm.Manufacture" ></Input>
      </Form-item>
      <Form-item  label="品牌" prop="Brand"  :rules="{required: true, message: '必填,最多20位', trigger:'blur',type:'string',max:20}" >
        <Input v-model="modalForm.Brand" ></Input>
      </Form-item>
      <Form-item  label="车辆类型" prop="Model"  :rules="{required: true, message: '必填,最多20位', trigger:'blur',type:'string',max:20}" >
        <Input v-model="modalForm.Model" ></Input>
      </Form-item>
      <Form-item  label="备注"    >
        <Input v-model="modalForm.Remark"  type="textarea"  :rows="2" maxlength="200" ></Input>
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
import {addExamCar,editExamCar} from './../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
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
          Headers:{
              Authorization:sessionStorage.getItem("token")
          }
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
                      console.log(params);
                      if (this.modalFormTitle ==='添加教练车'){
                          result = await addExamCar(params);
                      }else{
                          result = await editExamCar(params);
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
      handleView(){
          this.PicVisible=true;
      },
      handleRemove () {
          // 从 upload 实例删除数据
          debugger;
          this.modalForm.CarPhoto='';
      },
      handleSuccess (res, file) {
          // 因为上传过程为实例，这里模拟添加 url
          debugger;
          this.modalForm.CarPhoto=file.response.Url
      },
      handleFormatError (file) {
          this.$Notice.warning({
              title: '文件格式不正确',
              desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
          });
      },
      handleMaxSize (file) {
          this.$Notice.warning({
              title: '超出文件大小限制',
              desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
          });
      },
      handleBeforeUpload () {
          if (this.modalForm.CarPhoto) {
              this.$Notice.warning({
                  title: '已上传图片'
              });
              return false;
          }
          return true;
      },
    }
}

</script>
