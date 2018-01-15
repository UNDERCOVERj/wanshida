<template>
    <div class="list">
        <ul>
            <router-link to="/company/stock/list" tag="li">
                <el-button :type="$route.path == '/company/stock/list' ? 'primary' : ''">出入库列表</el-button>
            </router-link>
            <router-link to="/company/stock/record" tag="li">
                <el-button :type="$route.path == '/company/stock/record' ? 'primary' : ''">出入库记录</el-button>
            </router-link>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        }
    }
</script>
<style scoped>
    ul{
        display: flex;
        height: 99px;
        margin: 0px;
        align-items: center;
        list-style-type: none;
    }
    li{
        padding: 5px 10px;
    }
</style>
