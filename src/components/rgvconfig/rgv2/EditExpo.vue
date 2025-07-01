<template>
<div class="edit-expo">
<span>打开图像预览窗口,可以观察到识别到二维码的清晰度,观察是否有过曝或欠曝,若过曝或曝光不足,调节曝光和增益,若正常则跳过。</span>
<div class="img-container">
<img :src="imgSrc" style="width: 25%; height: auto; object-fit: cover;">
<img :src="imgSrc2" style="width: 25%; height: auto; object-fit: cover;">
<img :src="imgSrc4" style="width: 35%; height: auto; object-fit: cover;">
</div>
</div>
</template>

<script lang="ts" setup>
import img from '/public/expo1.png';
import img2 from '/public/expo2.png';
import img4 from '/public/expo4.png';
const imgSrc = img;
const imgSrc2 = img2;
const imgSrc4 = img4;
</script>
<style scoped>
.edit-expo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #333;
  padding: 2%;
}
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 5px;
}
</style>
