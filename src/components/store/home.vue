<template>
  <Home :navs="navs" :name="storeName"></Home>
</template>
<script>
  import Home from '../common/home.vue'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        navs: [
          {
            name: '客户管理',
            path: '/store/client/list',
            flag: false
          },
          {
            name: '库存管理',
            path: '/store/stock/list',
            flag: false
          },
          {
            name: '技师管理',
            path: '/store/technician/list',
            flag: false
          },
          {
            name: '项目管理',
            path: '/store/project/list',
            flag: false
          }
        ]
      }
    },
    computed: {
      storeName() {
        return localStorage.getItem('brandName')
      }
    },
    components: {
      Home
    }
  }
</script>
<style>

  .container{
    display: flex;
    align-items: stretch;
  }
  .home-nav{
    flex: 0 0 80px;
    order: -1;
  }
  .content{
    width: 100%;
  }

</style>
