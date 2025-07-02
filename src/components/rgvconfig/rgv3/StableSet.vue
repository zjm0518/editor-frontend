<template>
  <div class="rgv-page-content">

    <div>在对象字典中搜索Keba
	将驱动器的 Keba PLC 模式（2340_0D）调整至打开状态， Value 配置为“ 1 ”。</div>
    <img :src="imageUrl" />
    <div>在对象字典中搜索斩波电压,
	将斩波电压改为55V</div>
    <img :src="imageUrl2" />
    <div>
      关闭驱动器上的PDO配置</div>
<div>通过“专家模式"-->" ECAN 配置"-->" TPDO "/" RPDO "</div>
<div>- 将 TPDO1--TPDO8 映射组改成 0</div>
<div>- 将 RPDO1--RPDO8 映射组改成 0</div>

    <img :src="imageUrl3" />
    <img :src="imageUrl4" />
 <div>   屏蔽“实际误差超过允许”报错 </div>
 <div>- 打开专家模式——控制环——位置环</div>
 <div>- 将 最大跟随误差 改成 655360</div>
    <img :src="imageUrl5" />

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv3/stable-set.png';
import img2 from '/public/rgv3/stable-set2.png';
import img3 from '/public/rgv3/stable-set3.png';
import img4 from '/public/rgv3/stable-set4.png';
import img5 from '/public/rgv3/stable-set5.png';



const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;
const imageUrl5 = img5;

</script>
<style scoped>


</style>
