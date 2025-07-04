<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="store.steps.data4" :active="innerActive" @click="advancedClick"
     :visible-num="7"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <el-button class="floating-button" @click="openRobo">打开RoboshopPro</el-button>

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
import { openSoftware } from "@/api/path"
import axios from 'axios';
import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();
const openRobo =  () => {
axios.get('/api/OpenSoftware', {
  params: { type: 3 }
})
}
const advancedClick = (index, node) => {

 const route= store.steps.data4[index].url;
  if (route) {
    router.push(route)
  }
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
