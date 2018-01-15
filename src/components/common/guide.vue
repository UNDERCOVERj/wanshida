<template>
    <div class="guide" @click="guideClick" :class="isDisabled">
        <div :class="'card ' + outerDirectionClass">
            <div :class="'card ' + innerDirectionClass"></div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            }
        },
        props: ['direction', 'isStart', 'isEnd'],
        computed: {
            outerDirectionClass() {
                let direction = this.direction;
                if(direction === 'left') {
                    return 'outer-left';
                }else if(direction === 'right') {
                    return 'outer-right';
                }
            },
            innerDirectionClass() {
                let direction = this.direction;
                if(direction === 'left') {
                    return 'inner-left';
                }else if(direction === 'right') {
                    return 'inner-right';
                }
            },
            isDisabled() {
                if(this.direction === 'left' && this.isStart || this.direction === 'right' && this.isEnd) {
                    return 'btn-disabled'
                }
                return false;
            }
        },
        methods: {
            guideClick() {
                if(!this.isDisabled) {
                    this.$emit('guideClick', this.direction);
                }
            }
        }
    }
</script>
<style>
    .guide{
        position: relative;
        width: 80px;
        height: 80px;
        cursor: pointer;
    }
    .card{
        width: 50px;
        height: 50px;
        border-width: 2px 0 0 2px;
        border-style: solid;
        border-color: #409eff;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    .card:hover{
        border-color:#66b1ff;
    }
    .outer-left{
        left: 15px;
        top: 15px;
        transform: rotate(-45deg);
    }
    .outer-right{
        top: 15px;
        transform: rotate(135deg);
    }
    .btn-disabled .card{
        border-color: #eee;
    }
</style>
