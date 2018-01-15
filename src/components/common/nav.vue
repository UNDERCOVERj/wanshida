<template>
    <div class="nav">
        <ul>
            <router-link v-for="nav in navs" :to="nav.path" tag="li" :key="nav.path" :class="[{'nav-active': nav.flag}, 'nav-li']">{{nav.name}}</router-link>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    props: ['navs'],
    watch: {
        $route(to, from) {
            let path = to.path;
            this.checkActive(path);
        }
    },
    methods: {
        checkActive(path) {
            let arr = path.split('/');
            arr.pop();
            path = arr.join('/');
            this.navs.forEach((nav, idx) => {
                nav.path.indexOf(path) !== -1 ? nav.flag = true: nav.flag = false;
            })
        }
    },
    created() {
        this.checkActive(this.$route.path)
    }

}
</script>
<style scoped>
    .nav ul{
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .nav-li{
        width: 120px;
        padding: 40px 0;
        text-align: center;
        background: #fff;
        border: 1px solid #d8dce5;
        border-top: none;
        color: #5a5e66;
        cursor: pointer;
    }
    .router-link-active{
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        box-shadow: -1px 0 0 0 #409eff;
    }
    .nav-active{
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        box-shadow: -1px 0 0 0 #409eff;
    }
</style>
