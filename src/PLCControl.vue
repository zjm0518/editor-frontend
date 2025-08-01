<template>
  <div class="plc-control-container">
       <div class="plc-control-output border">
          <div class="title">
            <span>Modbus写入</span>
          </div>
            <div class="plc-status-container">
              <div v-for="i in plcInput.labels.length" :key="i" class="plc-item">
                <span class="plc-address">{{ "M"+(plcInput.labels[i-1].address) }}</span>


                <el-switch
                class="do-switch"
                  v-model="plcStatus[i-1]"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changePLC(plcInput.labels[i-1].address , plcStatus[i-1])"
                  ></el-switch>
                  <el-input
                  v-model="plcInput.labels[i-1].labels"
                />
              </div>

          </div>
        </div>
       <div class="plc-control-input border">
          <div class="title">
            <span>Modbus读取</span>

          </div>
          <div class="plc-status-container">

              <div v-for="(item,i) in plcInput.outputlabels" :key="i" class="plc-input-item">

                  <span class="di-label">{{ "M"+(item.address) }}</span>

                <div>
                   <span
                    class="di-circle"
                    :class="plcInput.status[item.address-plcInput.outputlabels[0].address] ? 'online' : 'offline'"
                  ></span>
                </div>

                  <el-input
                  v-model="item.labels"
                  />
              </div>
              <div v-for="i in 3" :key="i" class="plc-input-item">
                <span>D200{{ i-1 }}</span>
                <el-input v-model="plcInput.registers[i-1]"></el-input>
              </div>

            </div>
        </div>


    <div class="plc-buttons">

      <el-button @click="sendPLC2(0,1)">新机空跑</el-button>
      <el-button @click="sendPLC2(0,0)">新机空跑停止</el-button>
      <el-button @click="triggerFileUpload">上传配置文件</el-button>
      <input
          ref="fileInput"
          type="file"

          class="hidden"
          @change="handleFileUpload"
        />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";

import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import "@/css/plc-control.css"
import {
  getUserHomePath,
  uploadFiles,

} from "@/api/path";
const configstorage = useConfigStore();
const { formData } = storeToRefs(configstorage);
const plcStatus = ref<number[]>(Array(30).fill(0));
const address = ref("");
const value = ref("");

const plcInput = ref({

  outputlabels:[],
  labels:[],

  status: [], // 初始化为32个元素的Uint8Array
  registers:[]


});
const sendPLC = () => {

  fetch(`/api/writeModbus?address=${address.value}&value=${value.value}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};
const sendPLC2 = (addr:number,value:number) => {

  fetch(`/api/writeModbus2?address=${addr}&value=${value}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

const changePLC= (addr: number, value: number) =>{
  console.log(`PLC ${addr} changed to ${value}`);
  fetch(`/api/writeModbus?address=${addr}&value=${value}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
const ws = new WebSocket(`ws://192.168.10.1:3669/readModbus?address=602&count=25`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.error) {
    console.error("Modbus Error:", data.error);
  } else {
    //console.log(data);
    plcInput.value.status=data.coils
    plcInput.value.registers=data.registers

  }
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};
onMounted(()=>{
   fetch(`/api/getPLCLabels`, {
    method: "GET",
  }).then(async (res)=>{
   const data=await res.json();

    plcInput.value.outputlabels = data.plcInputLabels;
    plcInput.value.labels = data.plcOutputLabels;
  });
})

const fileInput = ref(null);

const triggerFileUpload = function () {
  fileInput.value.click();
};
const handleFileUpload = async function (event) {
  const input = event.target as HTMLInputElement;
  const files = event.target.files;
  if (!files.length) return;
  let userhomepath=""
  await getUserHomePath().then((res) => {
    console.log("获取用户目录", res);
    userhomepath = res.userHomePath;
  });
  const formData = new FormData();
  formData.append("targetPath", userhomepath);
  console.log("userhomepath", userhomepath);
  for (const file of files) {
    formData.append("files", file);
  }

  uploadFiles(formData, { "Content-Type": "multipart/form-data" }).then(
    (res) => {
      console.log(res);

    }
  );
  input.value = ""; // 清空文件选择框的值
};

</script>
