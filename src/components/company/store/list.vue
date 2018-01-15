<!--  内含新增 -->
<template>
  <div class="store-list">
    <div class="store-item" v-for="store in stores">
      <span class="store-item-block">
        {{store.name}}
      </span>
      <el-button type="primary" size="mini" class="store-item-block" @click="goToStorePerformance(store)">门店业绩</el-button>
      <el-button type="primary" size="mini" class="store-item-block" @click="goToStoreIndex(store)">门店库存</el-button>
    </div>
  </div>
</template>
<script>
    import API from '../../api/api.js';
    export default {
        data() {
          return {
            stores: []
          }
        },
        methods: {
            goToStorePerformance(store) {
                localStorage.setItem('storeName', store.name);
                localStorage.setItem('storeId', store.storeId);
                this.$router.push('/company/store/performance');
            },
            goToStoreIndex(store) {
                localStorage.setItem('storeId', store.storeId);
                this.$store.commit('companyStore/changeStoreName', store.name);
                this.$router.push('/company/store/stock/list');
            },
            getList() {// 门店列表
                this.companyId = localStorage.getItem('companyId');
                API.fetch('/api/administration/store/list/query', {companyId: this.companyId})
                    .then((data) => {
                        this.stores = data instanceof Array ? data : [];
                    })                
            }
        },
        mounted() {
            this.companyId = localStorage.getItem('companyId');
            this.getList();
        }
    }

</script>
<style scoped>
    .store-item{
        display: flex;
        height: 80px;
        align-items: center;
        border-bottom: 1px solid #d8dce5;
    }
    .store-item-block{
        margin-left: 5em;
    }
    span.store-item-block{
        width: 15em;
    }
</style>
