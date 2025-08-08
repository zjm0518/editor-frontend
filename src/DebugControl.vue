<template>
  <div class="debug-control-container">
    <div class="first-row">
      <div class="debug-control-mass border">
        <div class="title">
          <span>量产空跑</span>
        </div>
        <div class="switch-row">
          <div class="debug-status-switch">
            <span class="label-name">停止</span>
            <el-switch
              class="do-switch"
              v-model="turnStatus[0]"
              :active-value="1"
              :inactive-value="0"
              @change="turnModbusStatus(0)"
            ></el-switch>
            <span class="label-name">开启</span>
          </div>
        </div>
      </div>
      <div class="debug-control-state border">
        <div class="title">
          <span>状态机调试</span>
        </div>
        <div class="debug-status-container">
          <div class="button-wrapper">
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(9, 1)"
                       @mouseup="changeModbusStatus(9, 0)">取消订单</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(10, 1)"
                       @mouseup="changeModbusStatus(10, 0)">状态机复位</el-button>
          </div>
        </div>
      </div>
      <div class="debug-control-state border">
        <div class="title">
          <span>点位配置</span>
        </div>
        <div class="debug-status-container">
          <div class="button-wrapper">
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(11, 1)"
                       @mouseup="changeModbusStatus(11, 0)">车体点位</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(12, 1)"
                       @mouseup="changeModbusStatus(12, 0)">视觉配置</el-button>
          </div>
        </div>
      </div>
      <div class="debug-control-mass border">
        <div class="title">
          <span>通讯连接</span>
        </div>
        <div class="debug-status-container">
          <div class="button-wrapper">
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(13, 1)"
                       @mouseup="changeModbusStatus(13, 0)">PLC重连</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="first-row">
      <div class="debug-control-mode border">
        <div class="title">
          <span>模式切换</span>
        </div>
        <div class="switch-row">
          <div class="debug-status-switch">
            <span class="label-name">手动</span>
            <el-switch
              class="do-switch"
              v-model="turnStatus[1]"
              :active-value="1"
              :inactive-value="0"
              @change="turnModbusStatus(1)"
            ></el-switch>
            <span class="label-name">自动</span>
          </div>
        </div>
      </div>
      <div class="debug-control-output border">
        <div class="title">
          <span>机器人控制</span>
        </div>
        <div class="debug-status-container">
          <div class="button-wrapper">
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(2, 1)"
                       @mouseup="changeModbusStatus(2, 0)">断点继续</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(3, 1)"
                       @mouseup="changeModbusStatus(3, 0)">运动暂停</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(4, 1)"
                       @mouseup="changeModbusStatus(4, 0)">运动继续</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(5, 1)"
                       @mouseup="changeModbusStatus(5, 0)">机器人复位</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(8, 1)"
                       @mouseup="changeModbusStatus(8, 0)">清除碰撞</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="first-row">
      <div class="debug-control-material border">
        <div class="title">
          <span>倒料控制</span>
        </div>
        <div class="debug-status-container">
          <div class="button-wrapper">
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(14, 1)"
                       @mouseup="changeModbusStatus(14, 0)">料盘数量复位</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(15, 1)"
                       @mouseup="changeModbusStatus(15, 0)">人工换料</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(16, 1)"
                       @mouseup="changeModbusStatus(16, 0)">料站换料</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(17, 1)"
                       @mouseup="changeModbusStatus(17, 0)">倒料</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(18, 1)"
                       @mouseup="changeModbusStatus(18, 0)">倒料暂停</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(19, 1)"
                       @mouseup="changeModbusStatus(19, 0)">倒料继续</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="first-row">
      <div class="debug-control-material border">
        <div class="title">
          <span>自定义功能</span>
        </div>
        <div class="debug-status-container">
          <div class="button-wrapper">
<!--            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(23, 1)"
                       @mouseup="changeModbusStatus(23, 0)">地址23</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(24, 1)"
                       @mouseup="changeModbusStatus(24, 0)">地址24</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(25, 1)"
                       @mouseup="changeModbusStatus(25, 0)">地址25</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(26, 1)"
                       @mouseup="changeModbusStatus(26, 0)">地址26</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(27, 1)"
                       @mouseup="changeModbusStatus(27, 0)">地址27</el-button>
            <el-button type="primary" class="robots-button" @mousedown="changeModbusStatus(28, 1)"
                       @mouseup="changeModbusStatus(28, 0)">地址28</el-button>-->
            <EditableButton
              v-for="btn in buttons"
              :key="btn.addr"
              :label="btn.label"
              :address="btn.addr"
              @press="onPress"
              @release="onRelease"
              @save="onSaveLabel"
            />
          </div>
        </div>
      </div>
    </div>
<!--    <div class="plc-buttons">
      <el-button @click="triggerFileUpload">上传配置文件</el-button>
      <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleFileUpload"
        />
    </div>-->
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";

import { storeToRefs } from "pinia";
import { onMounted, ref, reactive } from "vue";
import EditableButton from "@/components/EditableButton.vue";
import "@/css/debug-control.css"
import {
  getUserHomePath,
  uploadFiles,
  getPLCLabels,

} from "@/api/path";
import {ElMessage} from "element-plus";
const configstorage = useConfigStore();
const { formData } = storeToRefs(configstorage);
const modbusStatus = ref<number[]>(Array(30).fill(0));
const address = ref("");
const value = ref("");
const turnStatus = ref<number[]>(Array(30).fill(0));

const plcInput = ref({
  outputlabels:[],
  labels:[],
  status: [], // 初始化为32个元素的Uint8Array
  registers:[]
});

interface Btn {
  addr: number;
  label: string;
}

const addrs = [23, 24, 25, 26, 27, 28];

const buttons = reactive<Btn[]>(addrs.map(a => ({
  addr: a,
  label: localStorage.getItem('btn_' + a) || `地址${a}`
})));

function onPress(address: number) {
  changeModbusStatus(address, 1);
}

function onRelease(address: number) {
  changeModbusStatus(address, 0);
}

function onSaveLabel(payload: { address: number; label: string }) {
  const b = buttons.find(x => x.addr === payload.address);
  if (b) {
    b.label = payload.label;
    localStorage.setItem('btn_' + payload.address, payload.label);
    // 如果要保存到后端，这里调用接口
  }
}

const turnModbusStatus = (addr:number) => {
  fetch(`/api/writeModbus?address=${addr}&value=${turnStatus.value[addr]}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res)=>{
    const data=await res.json();
    if (res.status != 200 && data.error) {
      ElMessage.error(data.error);
    }
  });
};
const changeModbusStatus = (addr:number,value:number) => {
  fetch(`/api/writeModbus?address=${addr}&value=${value}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res)=>{
    const data=await res.json();
    if (res.status != 200 && data.error) {
      ElMessage.error(data.error);
    }
  });
};

/*const ws = new WebSocket(`ws://localhost:3669/readModbus?address=602&count=25`);

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
};*/

onMounted(async ()=>{
  await getPLCLabels({});
  // const data = await res.data;
  // plcInput.value.outputlabels = res.plcInputLabels;
  // plcInput.value.labels = res.modbusOutputLabels;
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
