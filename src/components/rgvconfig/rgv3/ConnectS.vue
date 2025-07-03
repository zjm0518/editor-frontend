<template>
  <div class="rgv-page-content">

      <div>使用usb转485调试线连接驱动器，在KincoServo3.exe的通信中刷新串口打开。</div>
    <img loading="lazy" :src="imageUrl"  />
    <div>注意：若连接不上，需要确认串口线是否免安装驱动，若否，需要安装驱动；其次确认调试线的连接是否正确。</div>

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/connect-s.png';

const imageUrl = img1;

</script>
<style scoped>


</style>
