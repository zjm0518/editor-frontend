
<template>
<div class="rgv-config">
  <div class="rgv-steps">
     <tiny-steps line vertical :data="store.outerData" :active="store.outerActive" @click="advancedClick"></tiny-steps>
  </div>
<div class="rgv-content" >

</div>

<div class="config-footer">

      <el-button @click="previous">上一步</el-button>
      <el-button @click="done">完成当前步骤</el-button>
      <el-button @click="handleNext">下一步</el-button>
    </div>
</div>
</template>
<script lang="ts" setup>
import { TinySteps  } from '@opentiny/vue'

import {  onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import { useConfigStepsStore } from './stores/stepsconfig';
const store = useConfigStepsStore();



const advancedClick = (index, node) => {
  store.outerActive=index
  store.innerActive=0
  if(index==0){

    router.push("/rgv/r1");
  }
  else if(index==1){
    router.push("/rgv/r2");
  }else if(index==2){
    router.push("/rgv/r3");
  }else if(index==3){
    router.push("/rgv/r4");
  }else if(index==4){
    router.push("/rgv/r5");
  }
  
}


// 下一步
const handleNext = ()=> {
 //console.log("aaaa")
 let nIndex=store.outerActive+1
 if(store.outerData[store.outerActive].status!="done"){
  nIndex=store.outerActive+1
 }else{
  //store.outerActive++
  nIndex=store.outerActive+2
 }
 
 store.innerActive=0

 router.push(`/rgv/r${nIndex}`)
  
}

const previous = () => {
  let nIndex
  if(store.outerActive==0){
  nIndex=1
 }else{
  store.outerActive--
  nIndex=store.outerActive+1
 }
 store.innerActive=0
 router.push(`/rgv/r${nIndex}`)
}
const done=function(){
  
  store.outerData[store.outerActive].status="done"
 store.markCurrentStepGroupDone()


}


onMounted(() => {
  //检查是否都为done
  if(store.isCurrentStepGroupDone){
    store.outerData[store.outerActive].status="done"
  }
  

});


</script>

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
