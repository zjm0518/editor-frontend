<template>
  <div class="rgv-page-content">

  <div>启用一个实际接线的DI端口，使用常闭输入 </div>
      <img loading="lazy" :src="imageUrl" />
   <div>添加一个DISensor，</div>
    <div> id使用上面的di</div>
    <div> type必须是ignoreTask</div>
    <div> shape为vertex</div>
    <div> func为stop</div>
      <img loading="lazy" :src="imageUrl2" />
     <div>  注意：只有在无法实现硬件接线的情况下，采取这种方式</div>
     <div>启用第一个虚拟DI，添加DI10</div>
      <img loading="lazy" :src="imageUrl3" />
     <div>  添加一个DISensor，</div>
     <div>id为10</div>
    <div> type必须是ignoreTask</div>
    <div> shape为vertex</div>
    <div> func为stop</div>
      <img loading="lazy" :src="imageUrl4" />


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/di-nav.png';
import img2 from '/public/rgv4/di-nav2.png';
import img3 from '/public/rgv4/di-nav3.png';
import img4 from '/public/rgv4/di-nav4.png';


const imageUrl = img1;

const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;


</script>
<style scoped>


</style>
