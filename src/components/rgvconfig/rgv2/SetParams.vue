<template>
  <div class="rgv-page-content">

   <div>触发模式设为自由触发，帧率设为100Hz</div>
	
    <img loading="lazy" :src="imageUrl" />
   <div> 二维码配置如下图</div>

    <img loading="lazy" :src="imageUrl2" />
	<div>AGV控制配置按下图配置，注意核对，需一致</div>
    <img loading="lazy" :src="imageUrl3" />

  </div>
</template>

<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv2/p.png';
import img2 from '/public/rgv2/p2.png';
import img3 from '/public/rgv2/p3.png';

const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
</script>
<style scoped>
</style>
