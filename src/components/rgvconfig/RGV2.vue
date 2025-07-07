<template>
<div class="rgv-page">
  <div class="second-steps">
     <tiny-steps line vertical :data="store.steps[1]" :active="store.innerActive" @click="advancedClick"
     :visible-num="6"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <el-button class="floating-button" @click="openSVStudio">打开SVStudio</el-button>
    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();
import axios from 'axios';
const router = useRouter();



const advancedClick = (index, node) => {

  const route = store.currentSteps[index].url;
  //store.innerActive=index
  if (route) {
    router.push(route)
  }
}


const openSVStudio =  () => {
axios.get('/api/OpenSoftware', {
  params: { type: 1 }
})
}
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
