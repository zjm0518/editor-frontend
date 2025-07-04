<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted,watch,provide } from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import { useConfigStepsStore } from './stores/stepsconfig';
const store = useConfigStepsStore();
const data2 = reactive([
  {name: '准备工作',},
  { name: '扫码相机配置' },
  { name: '驱动器配置' },
  { name: '控制器配置' },
  { name: '避障雷达配置' }
])

// 跳转到 stepPaths[index]
const jump = (index: number) => {
  const path = stepPaths[index]
  if (path) router.push(path)
}

const advancedClick = (index, node) => {
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
const stepPaths=store.extractAllUrls()

// 下一步
const next = () => {
  const currentIndex = stepPaths.findIndex(p => p === route.path)
  const currentRoute= route.path
  store.updateStatusByUrl(currentRoute, 'doing')
  if (currentIndex < stepPaths.length - 1) {
    const nextIndex = currentIndex + 1
    jump(nextIndex)
  }
}

const previous = () => {
  const currentIndex = stepPaths.findIndex(p => p === route.path)
  const currentRoute= route.path
  store.updateStatusByUrl(currentRoute, 'doing')
  if (currentIndex > 0) {
    const prevPath = stepPaths[currentIndex - 1]
    const groupIndex = outerStepGroups.findIndex(group => group.includes(prevPath))
    const innerIndex = outerStepGroups[groupIndex].indexOf(prevPath)

    outerActive.value = groupIndex
    innerActive.value = innerIndex

    router.push(prevPath)
  }
}
const done=function(){
  const currentRoute= route.path
  store.updateStatusByUrl(currentRoute, 'done')
  const currentIndex = stepPaths.findIndex(p => p === route.path)
  if (currentIndex < stepPaths.length - 1) {
    const nextIndex = currentIndex + 1
    jump(nextIndex)
  }

}
const outerActive = ref(0)          // 外层主步骤
const innerActive = ref(0)          // 当前子步骤在该主步骤下的索引
provide('outerActive', outerActive)
provide('innerActive', innerActive)
// 主步骤列表，r1, r2 分组
const outerStepGroups = [
  stepPaths.filter(p => p.startsWith('/rgv/r1')),
  stepPaths.filter(p => p.startsWith('/rgv/r2')),
  stepPaths.filter(p => p.startsWith('/rgv/r3')),
  stepPaths.filter(p => p.startsWith('/rgv/r4')),
  stepPaths.filter(p => p.startsWith('/rgv/r5'))
]
// 更新 active 值（包括外层和内层）
const updateActiveFromRoute = () => {
  const currentPath = route.path
  const index = stepPaths.findIndex(p => p === currentPath)
  if (index !== -1) {
    // 主步骤编号
    const groupIndex = outerStepGroups.findIndex(group =>
      group.includes(currentPath)
    )
    outerActive.value = groupIndex

    // 子步骤编号
    if (groupIndex !== -1) {
      const innerIndex = outerStepGroups[groupIndex].indexOf(currentPath)
      innerActive.value = innerIndex
    }
  }
}
onMounted(() => {
  updateActiveFromRoute()
});

watch(() => route.path, () => {
  console.log('Route changed:', route.path)
  updateActiveFromRoute()
})
</script>

<template>
  <div class="rgv-config">
  <div class="rgv-steps">
     <tiny-steps line vertical :data="data2" :active="outerActive" @click="advancedClick"></tiny-steps>
  </div>
<div class="rgv-content">
  <RouterView :inner-active="innerActive"></RouterView>
</div>
<div class="config-footer">

      <el-button @click="previous"
        >上一步</el-button
      >
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
