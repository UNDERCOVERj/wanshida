<template>
  <div class="login">
    <div class="login-brand">
        <img :src="require('../../static/brand.jpg')" alt="brand">
        <h2>省万事产后调理中心门店管理系统</h2>
    </div>
    <div class="clearfix">
      <router-link :to="{path: '/login/store'}" tag="p" class="login-btn">门店登陆</router-link>
      <router-link :to="{path: '/login/company'}" tag="p" class="login-btn">公司登陆</router-link>
    </div>
    <div class="login-data">
      <el-form :model="formData" label-width="30%" ref="form" status-icon>
        <el-form-item
          label="账号"
          prop="username"
          :rules="[
            { validator: validateUsernameBlur, trigger: 'blur'},
            { validator: validateUsernameChange, trigger: 'change'}
          ]"
        >
          <el-input v-model="formData.username" size="small" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[
            { validator: validatePasswordChange, trigger: 'change'},
            { validator: validatePasswordBlur, trigger: 'blur'}
          ]"
        >
          <el-input v-model="formData.password" size="small" type="password" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div class="login-ft">
        <el-button type="primary" style="width: 100px" :disabled="!shouldSubmit" @click="submit">登陆</el-button>
        <h3>勤奋积累流水，管理创业利润！</h3>
      </div>
    </div>

  </div>
</template>

<script>
import {Message} from 'element-ui'
import Api from './api/api.js'
export default {
  name: 'login',
  data () {
    let uReg = /^[0-9]+$/;
    let validateUsernameBlur = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('账号不能为空'));
      }else if(!uReg.test(value)) {
        callback(new Error('账号格式错误'));
      }else {
        callback();
      }
    }
    let validateUsernameChange = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('账号不能为空'));
      }else if(isNaN(value)) {
        callback(new Error('账号格式错误'));
      }else {
        callback();
      }
    }
    let func =  (rule, value, callback) => {
      if(value === '') {
        callback(new Error('密码不能为空'));
      }else {
        callback();
      }
    }
    return {
      type: '',
      formData: {
        username: '',
        password: ''
      },
      validateUsernameBlur,
      validateUsernameChange,
      validatePasswordBlur: func,
      validatePasswordChange: func,
      uReg
    }
  },
  computed: {
    shouldSubmit() {// 是否置灰
      return this.formData.password.length  && this.uReg.test(this.formData.username);
    }
  },
  created (){
    let type = this.$route.params.type; //  判断params
    if(type === 'store') {
      this.type = 'store';
    }else if (type === 'company') {
      this.type = 'company'
    }else {
      this.$router.replace({path: '/error'})
    }
  },
  watch: {
    $route (newVal , oldVal) {
      if(newVal.params.type === 'store') {
        this.type = 'store';
      }else if (newVal.params.type === 'company') {
        this.type = 'company'
      }
    }
  },
  methods: {
    submit() {
      let type = this.type === 'store' ? 1 : 2;
      let params = {
        userId: this.formData.username,
        password: this.formData.password,
        type: type
      }
      var result = Api.login(params, this.$store, this.$router)
                    .then((info) => {
                      if(params.type == 1) {
                        localStorage.setItem('storeId', info.userId);
                        localStorage.removeItem('companyId');
                        //this.$store.commit('setStoreId', info.userId);
                      }else if(params.type == 2) {
                        localStorage.setItem('companyId', info.userId);
                        localStorage.removeItem("storeId");
                        //this.$store.commit('setCompanyId', params.userId);                        
                      }
                      localStorage.setItem('brandName', info.brandName);
                      this.$router.push({path: info.path});
                    })
                    .catch((result) => {
                      if(!result.flag) {
                        Message(result.text);
                        this.$refs.form.resetFields();
                      }
                    })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login{
    width: 400px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
  .login img{
    width: 50px;
    height: 50px;
  }
  .login-brand{
    text-align: center
  }
  .login-data{
    padding-top: 22px;
    border: 1px solid #b3d8ff;
    border-top: none;
  }
  .login-btn{
    width: 50%;
    float: left;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #b3d8ff;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    color: #409eff;
    background: #ecf5ff;
  }
  .login-btn:hover{
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .router-link-active{
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .login-ft{
    text-align: center;
  }
</style>
