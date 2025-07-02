<template>
  <div class="rgv-page-content">

    <div>在专家模式中选择驱动器配置，修改设备站号，左边轮子的驱动器设为2，右边设为1。</div>
    <img :src="imageUrl" />
    <div>AN通讯看门狗参数及波特率配置
	在专家模式—ECAN配置——ECAN设置</div>
<div>- 选择“节点保护时间”将驱动器看门狗保护时间更改为 100 </div>
<div>- 选择“节点保护时间系数”将驱动器看门狗保护时间系数更改为 3</div>
<div>- 选择“ CAN 波特率”将驱动器 CAN 波特率更改为 250KHz </div>
<div>- 选择“通讯中断模式”将驱动器中断模式更改为 1。</div>
    <img :src="imageUrl2" />

    <div>注意，can波特率，25即为250K</div>


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv3/can-comm.png';
import img2 from '/public/rgv3/can-comm2.png';
const imageUrl = img1;
const imageUrl2 = img2;

</script>
<style scoped>


</style>
