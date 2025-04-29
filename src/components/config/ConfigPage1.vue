<template>
  <div class="ip-input">
    <el-form label-position="right" label-width="260px" :model="formData">
      <el-form-item label="请输入ip">
        <el-input v-model="formData.ip"></el-input>
      </el-form-item>
      <el-form-item label="选择机器型号">
        <el-select v-model="formData.model" placeholder="请选择" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目界面resource地址">
        <el-input v-model="formData.webpath"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";
import { onUnmounted } from "vue";
import { storeToRefs } from "pinia";

//import IPInput from './IPInput.vue';
const configstorage = useConfigStore();
const options = [
  {
    value: "JK3",
    label: "JK3",
  },
  {
    value: "JK5",
    label: "JK5",
  },
  {
    value: "JK10",
    label: "JK10",
  },
];
const { formData } = storeToRefs(configstorage);
onUnmounted(() => {
  // configstorage.updateFormData(formData.value);
});
</script>
<style scoped>
.ip-input {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family:"微软雅黑",Arial,sans-serif;
  color: #232222;
}

:deep(.el-input) {
  --el-input-border-radius: 8px;
  --el-input-focus-border-color: #232222;

  --el-input-hover-border-color: #232222;
}
:deep(){
  --el-color-primary: #232222;
}
:deep(.el-form-item__label) {
  font-size: 20px;
}
</style>
