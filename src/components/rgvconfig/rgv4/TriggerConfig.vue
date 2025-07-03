<template>
  <div class="rgv-page-content">

  <div>在模型中启用Trigger，用于雷达避障停止时，直接暂停当前导航；</div>
	<div>source为雷达的停止输入DI，以及EMC</div>
	<div>type为risingEdge，</div>
	<div>func为suspendTask</div>
	<div>前雷达停止，电平上升触发</div>
    <img loading="lazy" :src="imageUrl" />
<div>后雷达停止，电平上升触发</div>
    <img loading="lazy" :src="imageUrl2" />
   <div> 为了保证触发概率，在di信号复位时也进行触发暂停</div>
	<div>type为fallingEdge，</div>
	<div>func为suspendTask</div>
<div>	前雷达停止DI1为</div>
  <img loading="lazy" :src="imageUrl3" />
  <div>后雷达停止DI3为</div>
  <img loading="lazy" :src="imageUrl4" />
 <div> 急停EMC，若急停恢复后会暂停当前导航，可不加</div>
  <img loading="lazy" :src="imageUrl5" />


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/trigger-config.png';
import img2 from '/public/rgv4/trigger-config2.png';
import img3 from '/public/rgv4/trigger-config3.png';
import img4 from '/public/rgv4/trigger-config4.png';
import img5 from '/public/rgv4/trigger-config5.png';


const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;
const imageUrl5 = img5;

</script>
<style scoped>


</style>
