<template>
  <div class="m-container">
     <div>
    机器码：{{ machineCode }}
  </div>
  <div>
    软件未激活,请联系对接人获取激活文件
  </div>
  </div>

</template>
<script setup lang="ts">
import {getMachineCode} from "@/api/path"
import {onMounted, ref} from "vue"
const machineCode=ref("")
onMounted(async ()=>{
  const res=await getMachineCode()
  machineCode.value=res.machineCode

})
</script>
<style scoped>


.m-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  color: #c74141;
}
</style>
