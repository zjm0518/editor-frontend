<template>
<div class="rgv-page">
  <div class="second-steps">
     <tiny-steps line vertical :data="data" :active="innerActive" @click="advancedClick"
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
import { openSoftware,getUserHomePath } from "@/api/path"
import axios from 'axios';
const router = useRouter();
const route = useRoute();
const active = ref(0)
const props = defineProps<{ innerActive: number }>()
const data = reactive([
  {name: '连接相机',},
  { name: '恢复出厂设置' },
  { name: '配置设备属性' },
  { name: '通讯设置' },
  { name: '修改曝光' },
  { name: '保存参数' },

])
const advancedClick = (index, node) => {

  if(index==0){
    router.push("/rgv/r2/connect-camera");
  }
  else if(index==1){
    router.push("/rgv/r2/reset");
  }else if(index==2){
    router.push("/rgv/r2/set-params");
  }else if(index==3){
    router.push("/rgv/r2/com-set");
  }else if(index==4){
    router.push("/rgv/r2/edit-expo");
  }else if(index==5){
    router.push("/rgv/r2/save-params2");
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
