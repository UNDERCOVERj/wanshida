<template>
  <div class="store-index">
    <ul>
      <router-link to="/company/store/stock/list" tag="li">
        <el-button :type="$route.path == '/company/store/stock/list' ? 'primary' : ''">出入库列表</el-button>
      </router-link>
      <router-link to="/company/store/stock/record" tag="li">
        <el-button :type="$route.path == '/company/store/stock/record' ? 'primary' : ''">出入库记录</el-button>
      </router-link>
    </ul>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>
<style scoped>
  .store-index ul{
    display: flex;
    list-style-type: none;
  }
  li{
    padding: 5px 10px;
  }
</style>
