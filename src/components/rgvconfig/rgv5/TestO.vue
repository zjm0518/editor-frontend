<template>
  <div class="rgv-page-content">

   <div> 初次测试，需将轮子悬空；</div>
	<div>在仙工上位机中，地图与控制里面，查看I/O配置；</div>
	<div>触发雷达，观察DI状态是否变化；</div>
    <img loading="lazy" :src="imageUrl" />
   <div> 若DI无变化，检查接线或雷达是否正常；</div>
	<div>若DI输入正常，通过仙工上位机，手动控制轮子转动；</div>
    <img loading="lazy" :src="imageUrl2" />
	<div>然后分别触发前后雷达的减速和停止，观察是否正确触发；</div>
	<div>若触发相反，需修改触发方式。</div>

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv5/test-o.png';
import img2 from '/public/rgv5/test-o2.png';

const imageUrl = img1;
const imageUrl2 = img2;


</script>
<style scoped>


</style>
