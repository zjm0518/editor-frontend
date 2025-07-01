<template>
  <div class="connect-camera">
    <div class="connect-camera-item">
      <span>用网线连接相机，接到交换机或者直接电脑，打开上位机SVStudio，将相机IP修改为本机同一网段。</span>
    <img :src="imageUrl" alt="connect-camera" />
    </div>
    <div class="connect-camera-item">
      <span>在设备信息修改IP，子网掩码和网关与上面的接口信息一致。</span>
    <img :src="imageUrl2" alt="connect-camera" />
    </div>

  </div>
</template>
<script lang="ts" setup>

import img1 from '/public/connect-camera1.png';
import img2 from '/public/connect-camera2.png';
const imageUrl = img1;
const imageUrl2 = img2;
</script>
<style scoped>
.connect-camera {
  width: 100%;
  height: 100%;
  display: flex;

  align-items: center;
  justify-content: center;
  padding: 3%;
}
.connect-camera-item {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #333;
}
</style>
