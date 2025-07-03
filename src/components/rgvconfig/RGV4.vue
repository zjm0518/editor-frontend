<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="data" :active="innerActive" @click="advancedClick"
     :visible-num="7"></tiny-steps>
  </div>
  <div class="rgv-config-content">
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

const data = reactive([
  {name: '连接控制器',},
  { name: '模型配置' },
  { name: '电机配置' },
  { name: 'PGV配置' },
  { name: '电池配置' },
  { name: '车体参数配置' },
  { name: '急停参数' },
  { name: '避障雷达' },

  { name: '触发配置' },
  { name: 'DI控制导航' },
  { name: '语音播报器' },
  { name: '控制器配置' },

  { name: '保存推送' },



])
const advancedClick = (index, node) => {

  const routes = [
    '/rgv/r4/connect-c',
    '/rgv/r4/model-config',
    '/rgv/r4/motor-config',
    '/rgv/r4/pgv-config',
    '/rgv/r4/battery-config',
    '/rgv/r4/vehicle-config',
    '/rgv/r4/stop-config',
    '/rgv/r4/radar-config',
    '/rgv/r4/trigger-config',
    '/rgv/r4/di-nav',
    '/rgv/r4/voice-b',
    '/rgv/r4/control-config',
    '/rgv/r4/save-config',
  ]
  if (routes[index]) {
    router.push(routes[index])
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
