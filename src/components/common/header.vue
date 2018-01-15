<template>
    <div class="header">
        <div class="bd-left">
            <img :src="require('../../../static/brand.jpg')" alt="brand">
            <span>{{name}}</span>
        </div>
        <div class="bd-right">
            <el-button type="primary" size="mini" @click="loginOut">退出</el-button>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    props: ['name'],
    methods: {
        loginOut() {
            localStorage.removeItem('storeId');
            localStorage.removeItem('companyId');
            localStorage.removeItem('brandName');
            localStorage.removeItem('userId');
            localStorage.removeItem('technicianDetails')
            this.$router.replace('/login/store');
        }
    }
  }
</script>
<style scoped>
    .header{
        width: 100%;
        position: absolute;
        top: 0px;
        height: 80px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #d8dce5;
    }
    .bd-left{
        display: flex;
        align-items: center;
        margin-left: 30px;
    }
    .bd-right{
        display: flex;
        align-items: center;
        margin-right: 50px;
    }
    img{
        width: 60px;
        height: auto;
        margin-right: 30px;
    }
    .login-out{
        cursor: pointer;
    }
</style>
