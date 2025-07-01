<template>
<div>
   <div>
     <tiny-steps line vertical :data="data" :active="active" @click="advancedClick"></tiny-steps>
  </div>
  <div>
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
const active = ref(0)
const data = reactive([
  {name: '软件',},
  { name: '硬件' },
  { name: '开始配置' },

])
const advancedClick = (index, node) => {
  active.value = index
  if(index==0){
    router.push("/rgv/r1/pre-soft");  }
    else if(index==1){
      router.push("/rgv/r1/pre-hard");
    }else if(index==2){
      router.push("/rgv/r1/pre-test");
    }
}
onMounted(() => {
   const segments = route.path.split('/'); // ['', 'rgv', 'r1', 'pre-soft']
   const path = segments[3]; // 'pre-soft'
   if(path=='pre-soft'){
    active.value = 0;
   }else if(path=='pre-hard'){
    active.value = 1;
   }else if(path=='pre-test'){
    active.value = 2;
   }
});
</script>
