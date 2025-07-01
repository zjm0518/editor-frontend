<template>
  <div class="software-tiny-grid-container">
    <TinyGrid :data="tableData" bordered>
  <TinyGridColumn type="selection" width="20%"></TinyGridColumn>
  <TinyGridColumn field="software" title="软件名称" width="80%" />
</TinyGrid>
  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { TinyGrid,TinyGridColumn } from '@opentiny/vue'
const _table=[
  {software:"仙工控制器上位机 RoboshopPro"},
  {software:"扫码相机上位机 SVStudio"},
  {software:"步科伺服上位机 KincoServo3"},
  {software:"兴颂雷达上位机 Hinson V1.5.5"},
]
const tableData = ref(_table)
</script>
<style scoped>
.software-tiny-grid-container {

 width: 100%; /* 设置 Grid 容器宽度 */

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 5%;

}
:deep(.tiny-grid) {
  width: 350px;

}
</style>
