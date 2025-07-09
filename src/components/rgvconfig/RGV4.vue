<template>
<div class="rgv-page">
   <div class="second-steps">
     <tiny-steps line vertical :data="store.steps[3]" :active="store.innerActive" @click="advancedClick"
     :visible-num="7"></tiny-steps>
  </div>
  <div class="rgv-config-content">
    <div  class="floating-button" >
      <el-button @click="openRobo">打开RoboshopPro</el-button>
    <el-button @click="triggerFileUpload">上传配置文件</el-button>
    </div>
    
     <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleFileUpload"
        />

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
import { openSoftware } from "@/api/path"
import axios from 'axios';
import { useConfigStepsStore } from '@/stores/stepsconfig';
const store = useConfigStepsStore();
const openRobo =  () => {
axios.get('/api/OpenSoftware', {
  params: { type: 3 }
})
}
const advancedClick = (index, node) => {

  const route = store.currentSteps[index].url;
  //store.innerActive=index
  if (route) {
    router.push(route)
  }
}
const handleFileUpload = async function (event) {
  const input = event.target as HTMLInputElement;
  const files = event.target.files;
  if (!files.length) return;

  const formData = new FormData();

formData.append("file", files[0]);

  await axios.post("/api/UploadModel", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
  input.value = ""; // 清空文件选择框的值
};
const fileInput = ref(null);
const triggerFileUpload = function () {
  fileInput.value.click();
};
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
  height: 80vh;

}

/* 悬浮按钮样式 */
.floating-button {
  position: absolute;
  top: 20vh;   /* 距离容器顶部 10px */
  left: 10px; /* 距离容器右边 10px */
  z-index: 10;
}
.hidden{
display: none;
}
</style>
