<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="store.steps[4]" :active="store.innerActive" @click="advancedClick"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <el-button class="floating-button" @click="openHinson">打开Hinson</el-button>

    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { onMounted } from 'vue'
import { useRouter } from "vue-router";
const router = useRouter();

import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();
import axios from 'axios';
const openHinson =  () => {
  axios.get('/api/OpenSoftware', {
    params: { type: 4 }
  })
}

const advancedClick = (index, node) => {

  const route = store.currentSteps[index].url;
 // store.innerActive=index
  if (route) {
    router.push(route)
  }
}



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
  height: 80vh;

}
/* 悬浮按钮样式 */
.floating-button {
  position: absolute;
  top: 20vh;   /* 距离容器顶部 10px */
  left: 10px; /* 距离容器右边 10px */
  z-index: 10;
}
</style>
