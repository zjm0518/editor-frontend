<template>
  <div class="rgv-page-content">

    <div>启用设备battery，basic参数默认</div>
	<div>brand选YiHe-XZ-Protocol1363</div>
	<div>voltage选54.8V</div>
	<div>devName根据实际连接的485端口填写</div>
	<div>baudrate选9600</div>
    <img loading="lazy" :src="imageUrl" />
    <div>保存模型并推送后，在运行状态中看到电池电量即为配置成功</div>
    <img loading="lazy" :src="imageUrl2" />


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv4/battery-config.png';
import img2 from '/rgv4/battery-config2.png';

const imageUrl = img1;
const imageUrl2 = img2;


</script>
<style scoped>


</style>
