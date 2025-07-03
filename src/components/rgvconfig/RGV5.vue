<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="data" :active="innerActive" @click="advancedClick"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <el-button class="floating-button" @click="openHinson">打开Hinson</el-button>

    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import axios from 'axios';
const openHinson =  () => {
  axios.get('/api/OpenSoftware', {
    params: { type: 4 }
  })
}
const data = reactive([
  {name: '连接雷达',},
  { name: '修改雷达输出逻辑' },
  { name: '调整雷达扫描范围' },
  { name: '避障测试' },

])
const advancedClick = (index, node) => {

  const paths = [
    "/rgv/r5/connect-radar",
    "/rgv/r5/modify-radar",
    "/rgv/r5/radar-range",
    "/rgv/r5/test-o"
  ];
  const path = paths[index];
  if (path) router.push(path);
}

const props = defineProps<{ innerActive: number }>()
onMounted(() => {

});
</script>
<style scoped>
.rgv-page{

  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.second-steps {
  width: 100%;
  height: 10vh;
   flex-shrink: 0;

}
.rgv-config-content {
  width: 100%;
  height: 70vh;

}
/* 悬浮按钮样式 */
.floating-button {
  position: absolute;
  top: 20vh;   /* 距离容器顶部 10px */
  left: 10px; /* 距离容器右边 10px */
  z-index: 10;
}
</style>
