<template>

  <div class="reset">
    <span>恢复出厂设置,按下图操作</span>
    <img loading="lazy" :src="imageUrl" alt="Reset Image"  style="width: 40%; height: auto;"/>
  </div>

</template>
<script lang="ts" setup>
import img from '/public/reset.png';
const imageUrl = img;
</script>
<style scoped>
.reset {
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
</style>
