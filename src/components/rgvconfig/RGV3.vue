<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="data" :active="innerActive" @click="advancedClick"
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
const router = useRouter();
const route = useRoute();
import axios from 'axios';
const data = reactive([
  {name: '连接上位机',},
  { name: '初始化驱动器参数' },
  { name: 'can通讯配置' },
  { name: '清理IO配置' },
  { name: '稳定工作配置' },
  { name: '工作模式配置' },
  { name: '保存配置参数' },

])
const advancedClick = (index, node) => {

  if(index==0){
    router.push("/rgv/r3/connect-s");  }
    else if(index==1){
      router.push("/rgv/r3/init-params");
    }else if(index==2){
      router.push("/rgv/r3/can-comm");
    }else if(index==3){
      router.push("/rgv/r3/clear-io");
    }else if(index==4){
      router.push("/rgv/r3/stable-set");
    }else if(index==5){
      router.push("/rgv/r3/work-mode");
    }else if(index==6){
      router.push("/rgv/r3/save-params");
    }
}

const props = defineProps<{ innerActive: number }>()
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
