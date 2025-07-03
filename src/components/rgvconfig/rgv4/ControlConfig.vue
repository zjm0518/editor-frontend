<template>
  <div class="rgv-page-content">

    <div>启用controller</div>
    <img :src="imageUrl" />
    <div>根据实际安装位置填写x、y、z即可，其他参数默认</div>


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/control-config.png';

const imageUrl = img1;


</script>
<style scoped>


</style>
