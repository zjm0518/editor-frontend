<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="store.steps.data" :active="innerActive" @click="advancedClick"></tiny-steps>
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
import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();

const advancedClick = (index, node) => {

  const route = store.steps.data[index].url;
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
</style>
