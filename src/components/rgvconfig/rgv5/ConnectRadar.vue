<template>
  <div class="rgv-page-content">

    <div>使用Micro USB数据线，连接雷达和电脑</div>
    <img loading="lazy" :src="imageUrl" />
    <div>打开兴颂的软件包，若未安装usb驱动，先安装驱动</div>
    <img loading="lazy" :src="imageUrl2" />
    <div>找到对应型号的上位机软件</div>
    <img loading="lazy" :src="imageUrl3" />
    <div>选择串口，刷新出来，若没有，检查是否安装驱动，不行可能是线材不支持数据传输.</div>
    <img loading="lazy" :src="imageUrl4" />

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv5/connect-radar.png';
import img2 from '/public/rgv5/connect-radar2.png';
import img3 from '/public/rgv5/connect-radar3.png';
import img4 from '/public/rgv5/connect-radar4.png';

const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;


</script>
<style scoped>


</style>
