<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="data" :active="innerActive" @click="advancedClick"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted} from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

const data = reactive([
  {name: '软件',},
  { name: '硬件' },
  { name: '开始配置' },

])
const advancedClick = (index, node) => {

  if(index==0){
    router.push("/rgv/r1/pre-soft");  }
    else if(index==1){
      router.push("/rgv/r1/pre-hard");
    }else if(index==2){
      router.push("/rgv/r1/pre-test");
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
</style>
