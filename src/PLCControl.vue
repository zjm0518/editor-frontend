<template>
  <div class="plc-control-container">
    <div class="first-col">
    <div class="plc-config border">
      <div class="title">
        PLC配置
      </div>
      <div class="plc-config-content">
        <div class="plc-config-ip-port">
          <span>PLC ip</span>
          <el-input style="width: 30%;"></el-input>
          <span>端口</span>
          <el-input style="width: 20%;"></el-input>
          <el-button>连接</el-button>
        </div>
        <div>
          <span>设备状态</span>
          <span>自动运行状态</span>
        </div>
        <div>
          <span>当前模式</span>
          <span>空闲状态</span>
        </div>
        <div>
          <span>提示信息</span>
          <span>倒料1盘完成</span>
        </div>
      </div>
    </div>
    <div class="plc-tray-convey border">
        <div class="title">
        料盘运输
      </div>
      <div class="plc-tray-convey-content">
      <div class="plc-tray-convey-speed">
        <span>手动速度</span>
        <el-input style="width: 40%;">
          <template #append>脉冲/秒</template>
        </el-input>
        <span>自动速度</span>
        <el-input style="width: 40%;">
          <template #append>脉冲/秒</template>
        </el-input>
      </div>
      <div class="plc-tray-convey-buttons">
        <el-button @click="WriteModbus(322,1)">传送带正转</el-button>
        <el-button @click="WriteModbus(323,1)">传送带反转</el-button>
      </div>
    </div>

  </div>
  <div class="plc-operate border">
    <div class="title">
      操作
    </div>
    <div class="plc-operate-content">
      <div class="plc-operate-switchs">
        <div>
        <span>自动/手动</span>
        <el-switch></el-switch></div>
        <div><span>倒料空跑</span>
        <el-switch></el-switch></div>
      </div>
      <div class="plc-operate-switchs">
        <div>
        <span>料框上料</span>
        <el-switch></el-switch></div>
        <div><span>料框下料</span>
        <el-switch></el-switch></div>
      </div>
      <div class="plc-operate-buttons">
        <el-button>启动</el-button>
        <el-button>暂停</el-button>
        <el-button>报警复位</el-button>
        <el-button>倒料</el-button>
      </div>
    </div>
    </div>
    <div class="plc-buttons">
      <el-button>车体控制</el-button>
      <el-button>IO监控</el-button>

    </div>
  </div>
  <div class="second-col">
    <div class="first-row2">
    <div class="cylinder-control border">
      <div class="title">
        料仓控制
      </div>
      <div class="cylinder-control-content">
      <div class="cylinder-control-item" v-for="item in cylinder_config" :key="item.name">
        <div class="cylinder-label">{{ item.name }}</div>
        <div class="cylinder-content">
          <div v-for="value in item.cylinders" :key="value.name" class="cylinder-item">
            <el-button>{{ value.name }}</el-button>
            <span
                    class="di-circle"
                    :class="true ? 'online' : 'offline'"
            ></span>
            <span>{{ value.status[0].name }}</span>
            <span
                    class="di-circle"
                    :class="true ? 'online' : 'offline'"
            ></span>
            <span>{{ value.status[1].name }}</span>
          </div>
        </div></div>
      </div>
    </div>
</div>
<div class="second-row">


    <div class="motor-control">
      <div class="left-motor border" v-for="(motor_item,i) in plc_config.motor_position_config" :key="i">
        <div class="title">{{i==0?'左':'右'}}顶升电机</div>
        <div class="motor-control-content">
          <div class="motor-status">
           <span class="di-circle"
                    :class="true ? 'online' : 'offline'"
            ></span><span>到位</span>
            <span class="di-circle"
                    :class="true ? 'online' : 'offline'"
            ></span><span>正限位</span>
            <span class="di-circle"
                    :class="true ? 'online' : 'offline'"
            ></span><span>负限位</span>
            <span class="di-circle"
                    :class="true ? 'online' : 'offline'"
            ></span><span>原点</span>
        </div>
        <div class="motor-speed">
          <div>
           <span>当前位置</span>
        <el-input style="width: 30%;">
          <template #append>mm</template>
        </el-input>
        <span>步进量</span>
        <el-input style="width: 30%;">
          <template #append>mm</template>
        </el-input></div>
       <div> <span>手动速度</span>
        <el-input style="width: 30%;">
          <template #append>mm/s</template>
        </el-input>
       <span>自动速度</span>
        <el-input style="width: 30%;">
          <template #append>mm/s</template>
        </el-input></div>
        </div>
        <div class="motor-buttons">
          <el-button>步进电动</el-button>
          <el-button>回零</el-button>
          <el-button @click="WriteModbus(motor_item.button[2],1)">向上</el-button>
          <el-button @click="WriteModbus(motor_item.button[3],1)">向下</el-button>
        </div>
        <div class="motor-position">
          <div v-for="item in motor_item.points" :key="item.name" class="motor-row">
            <span style="width: 20%;">{{ item.name }}</span>
            <el-input style="width: 30%;">
          <template #append>mm</template>
        </el-input>
        <el-button>示教</el-button>
        <el-button>点位追踪</el-button>
        </div>
        </div>
      </div>
      </div>

    </div>
   </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import "@/css/plc-control.css";
import { cylinder_config,useConfig } from "./utils/plcConfig";
import { WriteModbusM} from "@/api/path";
import { usePLCStore } from "./stores/PLCstatus";
import { onMounted, watch,ref } from "vue";
const { config, initConfig } = useConfig();
const store = usePLCStore();
const plc_config = ref({});

onMounted(() => {
  initConfig();
  store.connectWebSocket();
  plc_config.value = config.value.plc_config;
});

const WriteModbus = (address: number, value: number) => {
  WriteModbusM({ address: address, value: value })
    .then((response) => {
      console.log("写入成功:", response);
    })
    .catch((error) => {
      console.error("写入失败:", error);
    });
};

</script>

