<template>
  <div class="rgv-page-content">

      <div>使用usb转485调试线连接驱动器，打开KincoServo3.exe</div>
      <div>打开通信->通信设置</div>
     
    <img loading="lazy" :src="imageUrl2"  />
    <div>在通信设置中点击刷新，选择对应的串口，波特率设置为38400，点击打开</div>
    <img loading="lazy" :src="imageUrl"  />
    <div>连接成功后，图标显示绿色</div>
    <div>注意：若连接不上，需要确认串口线是否免安装驱动，若否，需要安装驱动；其次确认调试线的连接是否正确。</div>
    <img loading="lazy" :src="imageUrl3"  />

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv3/connect-s.png';
import img2 from '/rgv3/connect-s2.png';
import img3 from '/rgv3/connect-s3.png';
const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
</script>
<style scoped>


</style>
