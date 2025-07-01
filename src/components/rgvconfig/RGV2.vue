<template>
<div>
  <div>
     <tiny-steps line vertical :data="data" :active="active" @click="advancedClick"
     :visible-num="6"></tiny-steps>
  </div>
  <div>
    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted,inject,watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const active = ref(0)
const data = reactive([
  {name: '连接相机',},
  { name: '恢复出厂设置' },
  { name: '配置设备属性' },
  { name: '通讯设置' },
  { name: '修改曝光' },
  { name: '保存参数' },

])
const advancedClick = (index, node) => {
  active.value = index
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
    router.push("/rgv/r2/save-params");
  }
}
const innerActive = inject('innerActive')
const outerActive = inject('outerActive')
watch(()=>{return [innerActive.value,outerActive.value]},
()=>{
  if(outerActive.value==1){
    active.value=innerActive.value
  }
}
)
</script>
