<!-- 入库和出库窗口未弄，还有点击某一个一级商品出现二级商品未弄-->
<template>
  <div class="stock">
    <ul>
      <router-link to="/store/stock/list" tag="li">
        <el-button :type="$route.path == '/store/stock/list' ? 'primary' : ''">出入库列表</el-button>
      </router-link>
      <router-link to="/store/stock/record" tag="li">
        <el-button :type="$route.path == '/store/stock/record' ? 'primary' : ''">出入库记录</el-button>
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
  .stock ul{
    display: flex;
    list-style-type: none;
  }
  li{
    padding: 5px 10px;
  }
</style>
