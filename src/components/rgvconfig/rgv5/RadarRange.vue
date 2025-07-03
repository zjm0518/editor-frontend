<template>
  <div class="rgv-page-content">

    <div>由于装配调试时，没有现场一致的环境，可大致调节区域，测试能够使车体减速和停止即可；</div>
	<div>注：建议导入现场的雷达配置，注意当前通道；</div>
	<div>选择正下方输入输出之间的数字，选择左边对应的通道；</div>
	<div>下边以输出1和2为例，居然输出以实际接线为准；</div>
    <img loading="lazy" :src="imageUrl" />
<div>点击输出1，即可编辑输出1的范围，点击输出2，即可编辑输出2的范围。</div>
<div>在独立模式里可以切换不同的预设形状。</div>
<div>输出1的范围即为停止区域，0-1m。</div>
<div>输出2为减速区域，大概0m-2m之间即可。</div>
<div>前后左右移动障碍物或者人，画出对应的范围。</div>
<div>点击上方的下载，然后再点重启即可。</div>

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv5/radar-range.png';

const imageUrl = img1;


</script>
<style scoped>


</style>
