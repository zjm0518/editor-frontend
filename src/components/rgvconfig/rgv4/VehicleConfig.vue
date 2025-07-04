<template>
  <div class="rgv-page-content">

   <div>模型中选中chassis</div>
   <div>mode选differential</div>
   <div>wheelNum选2</div>
   <div>shape选rectangle</div>
   <div>width填车体宽度</div>
   <div>head填驱动轮圆心到车头长度</div>
   <div>tail填驱动轮圆心到车尾长度</div>
   <div>height填车体高度</div>
    <img loading="lazy" :src="imageUrl" />


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv4/vehicle-config.png';

const imageUrl = img1;


</script>
<style scoped>


</style>
