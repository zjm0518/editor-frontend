<template>
  <div class="agv-input">
    <el-form label-position="right" :model="formData">
      <el-form-item label="请输入小车ip">
        <el-input v-model="formData.agvip"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";

import { storeToRefs } from "pinia";

//import IPInput from './IPInput.vue';
const configstorage = useConfigStore();
const { formData } = storeToRefs(configstorage);
</script>
<style scoped>
.agv-input {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family:"微软雅黑",Arial,sans-serif;
  color: #232222;
}
.el-input{
  font-size: 20px;
}
:deep(.el-form-item__label) {
  font-size: 20px;
}
.el-input{
  font-size: 20px;
}
</style>
