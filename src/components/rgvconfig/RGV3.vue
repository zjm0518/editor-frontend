<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="store.steps[2]" :active="store.innerActive" @click="advancedClick"
     :visible-num="7"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <el-button class="floating-button" @click="openKin">打开KincoServo3</el-button>

    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();
const router = useRouter();
const route = useRoute();
import axios from 'axios';


const advancedClick = (index, node) => {

  const route = store.currentSteps[index].url;
  //store.innerActive=index
  if (route) {
    router.push(route)
  }
}


const openKin =  () => {
axios.get('/api/OpenSoftware', {
  params: { type: 2 }
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
