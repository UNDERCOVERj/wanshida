<template>
  <div class="shengwanshi">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
*{
  box-sizing: border-box
}
html, body, .shengwanshi {
  width: 100%;
  height: 100%;
}
.clearfix::after{
  content: "";
  display: block;
  visibillity: hidden;
  clear: both;
  height: 0;
}
</style>
