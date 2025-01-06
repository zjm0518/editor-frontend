<template>
  <div class="agvInfo">
    <div class="batteryInfo">
      <p
        v-for="(value, key, index) in batteryData"
        :key="index"
        class="batteryInfoP"
      >
        {{ key }}: {{ value }}
      </p>
    </div>
    <div class="moveButtons">
      <i class="icon iconfont2 icon2-up"></i>
      <i class="icon iconfont2 icon2-down"></i>

      <i class="icon iconfont2 icon2-right"></i>
      <i class="icon iconfont2 icon2-left"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/iconfont2/iconfont.css';
import {getBatteryInfo} from "@/api/path"
import { onBeforeUnmount, onMounted, ref } from 'vue';
const batteryData = ref({
  auto_charge: false,
  battery_cycle: 9,
  battery_level: 0.87,
  battery_temp: 35,
  battery_user_data: "",
  charging: false,
  current: 2,
  manual_charge: false,
  max_charge_current: 5,
  max_charge_voltage: 48,
  ret_code: 0,
  voltage: 24.5,
  extra: "json string",
});
const fetchBatteryData=function(){
  getBatteryInfo({}).then(res=>{
   // console.log(res)
    batteryData.value=res.batteryInfo
  }).catch(err=>{
    console.log(err)
  })
}
let intervalid:number;
onMounted(()=>{
  intervalid=setInterval(fetchBatteryData,1500)
})
onBeforeUnmount(()=>{
  clearInterval(intervalid);
})
</script>

<style scoped>
.agvInfo{
  display: flex;
  flex-direction: column;

  width: 100%;

  height:  100%;
  margin: 15px 15px  15px 15px;
  overflow:hidden;
}
.batteryInfo {
  border: 1px solid #ccc;
  background-color: #434343;
  color: white;
  height: 60%;
  width: 400px;
  align-items: center;

  .batteryInfoP {
    align-items: center;
    margin: 3%;
    font-family: Consolas, "Courier New", monospace;
  }
}

.moveButtons{
  border: 1px solid #ccc;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-template-rows: repeat(3,1fr);
  height: 150px;
  width: 150px;
  align-items: center;
  text-align: center;
  margin-top: 30px;
  .icon{
    font-size: 30px;
    cursor: pointer;
  }
  .icon:hover{
    color: brown
  }

  .icon2-down{
    grid-row-start: 3;
    grid-column-start: 2;
  }
  .icon2-up{
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 1;
  }
  .icon2-right{
    grid-row-start: 2;
    grid-column-start: 3;
  }
  .icon2-left{
    grid-row-start: 2;
    grid-column-start: 1;
  }
}
</style>
