<template>
  <div class="load-input">
    <el-form label-position="right" label-width="80px" :model="formData">
      <el-form-item label="负载1">
        <el-input v-model="formData.load[0]"></el-input>
      </el-form-item>
      <el-form-item label="负载2">
        <el-input v-model="formData.load[1]"></el-input>
      </el-form-item>
      <el-form-item label="负载3">
        <el-input v-model="formData.load[2]"></el-input>
      </el-form-item>
      <el-form-item label="负载4">
        <el-input v-model="formData.load[3]"></el-input>
      </el-form-item>
      <el-form-item label="负载5">
        <el-input v-model="formData.load[4]"></el-input>
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
</style>
