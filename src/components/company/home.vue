<template>
  <Home :name="companyName" :navs="navs"></Home>
</template>
<script>
  import Home from '../common/home.vue'
  export default {
    data() {
      return {
        companyName: '伊美荟（上海）健康科技有限公司',
        navs: []
      }
    },
    components: {
      Home
    },
    created() {
      let isShowPerformance = localStorage.getItem('isShowPerformance');
      if(isShowPerformance == 2) {
        this.navs = [
          {
            name: '库存管理',
            path: '/company/stock/list',
            flag: false
          }
        ]
      }else {
        this.navs = [
          {
            name: '账号管理',
            path: '/company/account/list',
            flag: false
          },
          {
            name: '库存管理',
            path: '/company/stock/list',
            flag: false
          },
          {
            name: '门店管理',
            path: '/company/store/list',
            flag: false
          }
        ]
      }
    }
  }
</script>
