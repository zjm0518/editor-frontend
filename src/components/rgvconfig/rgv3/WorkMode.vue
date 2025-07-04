<template>
  <div class="rgv-page-content">

    <div>- 选择专家模式——基本操作</div>
    <div>- “工作模式选择0”将驱动器工作模式更改为“-3”</div>
    <img loading="lazy" :src="imageUrl"  />
   <div> 修改梯形加速度和梯形减速度</div>
	<div>- 选择驱动器D，基本操作</div>
	<div>- 将梯形加速度修改成 280rps/s</div>
	<div>- 将梯形减速度修改成 280rps/s</div>
	<div>如下图所示</div>
  <img loading="lazy" :src="imageUrl2" />
<div>注意：如果设置完成之后，操作舵轮转向时候，发现转向机构声音很大或者出现过流的问题，
      请将梯形加速度、梯形减速度调整到280rps/s，如果发现调整到280rps/s，
      仍然会出现这种抖动和异响的情况，请继续减小梯形加速度和梯形减速度（最小应该为200）。</div>
 <div>	此时应该注意，梯形加速度和减速度过小会导致转向电机转速过慢，影响到位精度。舵角转速不要小于80度/秒。</div>


  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv3/work-mode.png';
import img2 from '/rgv3/work-mode2.png';


const imageUrl = img1;
const imageUrl2 = img2;

</script>
<style scoped>


</style>
