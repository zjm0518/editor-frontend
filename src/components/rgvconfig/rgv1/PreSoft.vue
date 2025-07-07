<template>
  <div class="software-tiny-grid-container">
    <TinyGrid :data="tableData" bordered >
  <TinyGridColumn type="selection" width="10%"></TinyGridColumn>
  <TinyGridColumn field="software" title="软件名称" width="40%" />
      <tiny-grid-column
        field="path"
        title="软件路径"
        width="50%"
      >  <template #default="{ row }">
        <div class="edit-path">
          <el-input v-model="row.path" @blur="inputPath"></el-input>
         <!--  <i class="icon iconfont2 icon2-wenjianguanliqi" @click="triggerFileSelect"  title="打开文件管理器"></i>
          <input
          ref="fileInput"
          type="file"
         
          class="hidden"
          @change="handleFileUpload"
        /> -->
        </div>
      </template></tiny-grid-column>
</TinyGrid>
  </div>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { TinyGrid,TinyGridColumn } from '@opentiny/vue'
import { useConfigStore } from "@/stores/config";

const fileInput = ref(null);
const configstorage = useConfigStore();
const _table=[
  {software:"仙工控制器上位机 RoboshopPro", path: ""},
  {software:"扫码相机上位机 SVStudio", path: ""},
  {software:"步科伺服上位机 KincoServo3", path: ""},
  {software:"兴颂雷达上位机 Hinson V1.5.5", path: ""},
]
const tableData = ref(_table)
const inputPath=function(){
  console.log("路径被修改了")
  configstorage.formData.roboshopProPath = tableData.value[0].path;
  configstorage.formData.svstudioPath = tableData.value[1].path;
  configstorage.formData.kincoservoPath = tableData.value[2].path;
  configstorage.formData.hinsonPath = tableData.value[3].path;
  configstorage.formData.restart = false; // 设置重启标志
  configstorage.updateToServer();
}
onMounted(async () => {
   const ok = await configstorage.getFromServer();
  tableData.value[0].path = configstorage.formData.roboshopProPath as string;
  tableData.value[1].path = configstorage.formData.svstudioPath as string;
  tableData.value[2].path = configstorage.formData.kincoservoPath as  string;
  tableData.value[3].path = configstorage.formData.hinsonPath as string;
});
const triggerFileSelect = function () {
  fileInput.value.click();
};
const handleFileUpload = async function (event) {
  const file = event.target.files[0];
  console.log(file.name);     // 文件名
  console.log(file.type);     // MIME 类型
  console.log(file.size);     // 文件大小（字节）
  console.log(file);          // File 对象，可用于上传
};

</script>
<style scoped>
.software-tiny-grid-container {

 width: 100%; /* 设置 Grid 容器宽度 */

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 2%;

}
:deep(.tiny-grid) {
  width: 600px;

}
:deep(.tiny-grid .tiny-grid-cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.edit-path{
  display: flex;
  align-items: center;
}
.icon2-wenjianguanliqi{
  font-size: large !important;
  cursor: pointer;
}
.hidden{
  display: none;
}
</style>
