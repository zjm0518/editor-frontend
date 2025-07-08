<script lang="ts" setup>
import { ref, reactive, onMounted,watch,provide } from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import { useConfigStepsStore } from './stores/stepsconfig';

const store = useConfigStepsStore();



// 下一步
const next = () => {
  
  const currentRoute= route.path
  store.updateStatusByUrl(currentRoute, 'doing')
  if (store.lastStepToMainPage[currentRoute as keyof typeof store.lastStepToMainPage]) {
   
    router.push("/rgv/main")
    //store.innerActive=0
    return
   }

   if (store.innerActive < store.currentSteps.length - 1) {
    const nextIndex = store.innerActive + 1
    //store.innerActive++
    router.push(store.currentSteps[nextIndex].url)
  }
}

const previous = () => {

  const currentRoute= route.path
  store.updateStatusByUrl(currentRoute, 'doing')
  if(store.innerActive==0){
    router.push("/rgv/main")
  }else{
    router.push(store.currentSteps[store.innerActive-1].url)
  }

}
const done=function(){
  const currentRoute= route.path
  store.updateStatusByUrl(currentRoute, 'done')
  next() 
}

const returnToMain=function(){
  router.push("/rgv/main")
}

onMounted(() => {
  store.updateActiveByRoute(route.path)
});

watch(() => route.path, () => {
  console.log('Route changed:', route.path)
  store.updateActiveByRoute(route.path)
 
})
</script>

<template>
  <div class="rgv-config">
  
<div class="rgv-content">
     <RouterView ></RouterView>
</div>

<div class="config-footer">
  <el-button @click="returnToMain">返回上一级</el-button>
      <el-button @click="previous">上一步</el-button>
      <el-button @click="done">完成当前步骤</el-button>
      <el-button @click="next" >下一步</el-button>
    </div>
</div>
</template>
<style scoped>
.rgv-config {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.rgv-steps{
  height: 10vh;
}
.rgv-content{
  height: 90vh;
}
.blank-content{
  height: 80vh;
}
.config-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 10vh;
}
</style>
