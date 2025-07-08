<template>
  <div class="rgv-page-content">
<div>进入驱动->初始化/保存/重启，在弹出的窗口中依次点击存储电机参数、初始化控制参数、存储控制参数、重启</div>

    <img loading="lazy" :src="imageUrl" alt="connect-camera" />
    

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv3/init-params.png';

const imageUrl = img1;

</script>
<style scoped>


</style>
