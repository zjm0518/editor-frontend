<template>
  <div class="rgv-page-content">

    <div>a、启用DI，若没有相应的DI，选中任一DI，右键选择复制并添加即可</div>
    <img loading="lazy" :src="imageUrl" />
    <div>b、启用DISensor</div>
    <img loading="lazy" :src="imageUrl2" />
   <div> type选择infrared(红外)</div>
	<div> basic输入雷达连接的实际DI</div>
	<div> shape选择arc，具体参考下面配置</div>
	<div> 	func根据当前的DI输入选择，减速选slowdown，停止选stop</div>
	<div> c、前雷达减速输入</div>
    <img loading="lazy" :src="imageUrl3" />
   <div>  d、前雷达停止输入</div>
    <img loading="lazy" :src="imageUrl4" />
   <div>  e、后雷达减速输入</div>
    <img loading="lazy" :src="imageUrl5" />
   <div>  f、后雷达停止输入</div>
    <img loading="lazy" :src="imageUrl6" />
   <div> 注意：（务必在车轮悬空测试），为了保障安全，雷达务必采用常闭输入，所有的雷达DI都需要勾选inverse；</div>
    <img loading="lazy" :src="imageUrl7" />
    <div> 将相应DI的inverse勾上即可将输入信号反转</div>



  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv4/radar-config.png';
import img2 from '/rgv4/radar-config2.png';
import img3 from '/rgv4/radar-config3.png';
import img4 from '/rgv4/radar-config4.png';
import img5 from '/rgv4/radar-config5.png';
import img6 from '/rgv4/radar-config6.png';
import img7 from '/rgv4/radar-config7.png';


const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;
const imageUrl5 = img5;
const imageUrl6 = img6;
const imageUrl7 = img7;


</script>
<style scoped>


</style>
