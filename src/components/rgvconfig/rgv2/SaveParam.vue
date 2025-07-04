<template>
<div class="save-params">
  <span>保存到用户配置1,启动配置选择用户配置1,重启设备</span>
  <img loading="lazy" :src="imgUrl" alt="保存参数"  style="width: 35%; height: auto;"/>
</div>
</template>

<script lang="ts" setup>
import img from '/save-params.png';
const imgUrl=img;
</script>
<style scoped>
.save-params {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
</style>
