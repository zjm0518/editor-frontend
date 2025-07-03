<template>
  <div class="rgv-page-content">

      <div>用网线连接相机，接到交换机或者直接电脑，打开上位机SVStudio，将相机IP修改为本机同一网段。</div>
    <img loading="lazy" :src="imageUrl" alt="connect-camera" />

      <span>在设备信息修改IP，子网掩码和网关与上面的接口信息一致。</span>
    <img :src="imageUrl2" alt="connect-camera" loading="lazy" />


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/connect-camera1.png';
import img2 from '/public/connect-camera2.png';
const imageUrl = img1;
const imageUrl2 = img2;
</script>
<style scoped>


</style>
