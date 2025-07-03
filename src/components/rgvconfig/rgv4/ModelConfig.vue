<template>
  <div class="rgv-page-content">

    <div>可使用默认的模型配置，或者导入已经配置好的模型</div>
    <img loading="lazy" :src="imageUrl" />

    <div>1. 进入机器人界面的【模型文件】页面</div>
<div>2. 对文件的操作：</div>
  		<div>a. 【拉取】：从机器人端拉取模型文件到本地</div>
  		<div>b. 【推送】：从本地推送修改后的模型文件到机器人</div>
<div>3. 机器人模型类型</div>
<div>4. 显示当前机器人模型布局图</div>
<div>5. 【属性窗口】：在属性窗口中点击【启用设备】可以开启使用该模型，并在布局图上显示。可对机器人模型参数进行具体配置</div>
	<div>若没有模型导入，可使用默认的AMB-150开始配置</div>
	<div>注意：模型图中朝上方向为车头，也车体坐标X轴正方向。</div>
  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/model-config.png';

const imageUrl = img1;


</script>
<style scoped>


</style>
