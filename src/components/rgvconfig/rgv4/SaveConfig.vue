<template>
  <div class="rgv-page-content">

    <div>配置完成的模型如图所示</div>
    <img loading="lazy" :src="imageUrl" />
  <div>  点击保存，然后推送即可</div>
	<div>将模型另存为，可直接为另一台控制器导入配置完成的模型</div>
	<div>注意：配置完成之后连接控制器，若提示模型不一致，要先拉取机器人模型</div>
  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/save-config.png';

const imageUrl = img1;


</script>
<style scoped>


</style>
