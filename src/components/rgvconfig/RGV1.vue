<template>
<div class="rgv-page">
   <div class="second-steps">
    <!--  <component :is="Svgs[name] && Svgs[name]()" class="svgs-icon"></component> -->
     <tiny-steps line vertical :data="store.steps[0]" :active="store.innerActive" @click="advancedClick"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    
    <RouterView></RouterView>
  </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted} from 'vue'
import { useRouter } from "vue-router";
const router = useRouter();
import Svgs from '@opentiny/vue-icon'
import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();
const name="IconEditorUndo"

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
   display: flex;
   align-items: center;
   

}
.rgv-config-content {
  width: 100%;
  height: 70vh;

}
:deep(.tiny-steps){
  flex:1;
}
.svgs-icon{
  font-size: 30px;
  width: 5vw;
  cursor: pointer;
 
}
</style>
