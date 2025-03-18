<template>
  <div class="load-input">
    <el-form label-position="right" label-width="80px" :model="formData">
      <el-form-item v-for="(item,index) in formData.load" :key="index" :label="'负载'+(index+1)">
        <el-input v-model="formData.load[index]"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";
import { storeToRefs } from "pinia";

const configstorage = useConfigStore();
const { formData } = storeToRefs(configstorage);
</script>
<style scoped>
:deep(.el-input) {
  --el-input-border-radius: 8px;
  --el-input-focus-border-color: #232222;

  --el-input-hover-border-color: #232222;

}
:deep(.el-form-item__label) {
  font-size: 20px;
}
.load-input {
  max-height: 80vh; /* 限制最大高度 */
  overflow-y: auto; /* 超出高度允许滚动 */
}

.el-form {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  align-content: flex-start; /* 让内容从上到下排列 */
  gap: 10px; /* 设置间距 */
  justify-content: center; /* 让内容居中 */
}

.el-form-item {
  width: 250px; /* 控制列宽，保证一行最多两个 */

}
.el-input{
  font-size: 20px;
}
</style>
