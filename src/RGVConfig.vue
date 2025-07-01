<script lang="ts" setup>
import { TinySteps } from '@opentiny/vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const active = ref(0)
const data2 = reactive([
  {name: '准备工作',},
  { name: '扫码相机配置' },
  { name: '步科驱动器配置' },
  { name: '仙工控制器配置' },
  { name: '避障雷达配置' }
])
const jump = (index: number) => {
  //currentIndex.value = index;
  router.push(`/rgv/r${index}`);
};
const advancedClick = (index, node) => {
  active.value = index
  jump(index+1)
}
onMounted(() => {
   const segments = route.path.split('/'); // ['', 'rgv', 'r1', 'pre-soft']
  const rgvId = segments[2]; // 'r1'
 // console.log('currentPathName', currentPathName, 'currentPathNumber', currentPathNumber);
 const currentPathNumber = parseInt(rgvId.replace('r', '')); // 提取数字部分
  active.value = currentPathNumber - 1;
});
</script>

<template>
  <div class="rgv-config">
  <div >
     <tiny-steps line vertical :data="data2" :active="active" @click="advancedClick"></tiny-steps>
  </div>
<div>
  <RouterView></RouterView>
</div></div>
</template>
<style scoped>
.rgv-config {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
