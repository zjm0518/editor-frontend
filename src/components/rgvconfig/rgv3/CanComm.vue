<template>
  <div class="rgv-page-content">

    <div>在专家模式中选择驱动器配置，修改设备站号，如果当前连接的是左边轮子，设备站号设为2，右边则设为1。</div>
    <img loading="lazy" :src="imageUrl3" />
    <img loading="lazy" :src="imageUrl" />
    <div>
	打开在专家模式—>ECAN配置—>ECAN设置</div>
<div>- 选择“节点保护时间”将驱动器保护时间更改为 100 </div>
<div>- 选择“节点保护时间系数”将驱动器保护时间系数更改为 3</div>
<div>- 选择“ CAN 波特率”将驱动器 CAN 波特率更改为 250KHz。注意，can波特率，25即为250K </div>
<div>- 选择“通讯中断模式”将驱动器中断模式更改为 1。</div>
    <img loading="lazy" :src="imageUrl2" />




  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv3/can-comm.png';
import img2 from '/rgv3/can-comm2.png';
import img3 from '/rgv3/can-comm3.png';
const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
</script>
<style scoped>


</style>
