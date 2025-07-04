<template>
<div class="com-set">
  <span>按照下图配置串口</span>
<img :src="imgUrl" style="width: 30%; height: auto; object-fit: cover;" loading="lazy">
</div>
</template>

<script lang="ts" setup>
import img from '/com-set.png'
const imgUrl=img;
</script>
<style scoped>
.com-set {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2%;
}
</style>
