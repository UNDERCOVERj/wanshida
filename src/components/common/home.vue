<template>
    <div class="home">
        <Headertop :name="name"></Headertop>
        <div class="container">
            <div class="content">
                <router-view></router-view>
            </div>
            <div class="home-nav">
                <Navbar :navs="navs"></Navbar>
            </div>
        </div>
        <Footerbot></Footerbot>
    </div>
</template>
<script>
    import Navbar from '../common/nav.vue'
    import Headertop from '../common/header.vue'
    import Footerbot from '../common/footer.vue'
    export default {
        data () {
            return {
            }
        },
        props: ['name', 'navs'],
        components: {
            Navbar,
            Headertop,
            Footerbot
        }
    }
</script>
<style>
    .home{
        width: 100%;
        min-height: 100%;
        position: relative;
    }
    .container{
        display: flex;
        align-items: stretch;
        min-height: 100%;
        width: 100%;
        padding: 80px 0;
    }
    .home-nav{
        flex: 0 0 80px;
        order: -1;
    }
    .content{
        width: 100%;
    }
</style>
