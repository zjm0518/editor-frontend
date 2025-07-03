<template>
  <div class="pre-test">
    <span>开始配置，务必把车轮悬空，确认无误再下地测试。
	车体方向定义如下图，后续配置注意。</span>
   <img :src="imageUrl" loading="lazy" />
  </div>
</template>
<script lang="ts" setup>
import img from '/public/pre-test.png';
const imageUrl = img;
</script>
<style scoped>
.pre-test {
  width: 100%;
  height: 100%;
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #333;
}
</style>
