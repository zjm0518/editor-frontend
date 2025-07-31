<template>
  <div>
     <el-form label-position="right" :model="formData">
          <el-form-item label="请输入plc ip">
            <el-input v-model="formData.plcip"></el-input>
          </el-form-item>
          <el-form-item label="请输入plc port">
                  <el-input v-model="formData.plcport"></el-input>
                  </el-form-item>
          <el-form-item label="请输入modbus ip">
            <el-input v-model="formData.modbusip"></el-input>
          </el-form-item>
          <el-form-item label="请输入modbus port">
            <el-input v-model="formData.modbusport"></el-input>
          </el-form-item>
      </el-form>
      <div class="plc-test">
       <span>address</span> <el-input v-model="address"></el-input>
       <span>value</span> <el-input v-model="value"></el-input>
       <el-button @click="sendPLC">发送</el-button>
      </div>
      <div class="plc-test">
       <span>address</span> <el-input v-model="address2"></el-input>
       <span>value</span> <el-input v-model="value2"></el-input>
       <el-button @click="sendPLC2">发送</el-button>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";

import { storeToRefs } from "pinia";
import { ref } from "vue";
import {writeModbus,writeModbus2} from "@/api/path";
const configstorage = useConfigStore();
const { formData } = storeToRefs(configstorage);
const address=ref('');
const value=ref('');
const address2=ref('');
const value2=ref('');
const sendPLC = () => {

   /* writeModbus({address:address.value,value:value.value}).then(res=>{
    console.log(res)
   }) */
  fetch(`/api/writeModbus?address=${address.value}&value=${value.value}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
};
const sendPLC2 = () => {
   writeModbus2({address:address2.value,value:value2.value})
};
</script>
<style scoped>
.plc-test{
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>