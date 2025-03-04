<template>
  <div class="config-container">
  <div class="config-header">
    <span>配置</span>
  </div>
  <div class="config-page">
    <RouterView></RouterView>
  </div>
  <div class="config-footer">
    <el-button >保存配置</el-button>
    <el-button >重置</el-button>
  <el-button @click="previous">上一步</el-button>
    <el-button @click="next">下一步</el-button>
    <el-button >完成配置</el-button>
  </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter,useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const next = () => {
  const currentPathName=route.name as string;
  const currentPathNumber=parseInt(currentPathName);
  let nextPageNumber=currentPathNumber+1;
  if(nextPageNumber>5){
    nextPageNumber=5;
  }

  router.push(`/init/${nextPageNumber}`);
}
const previous = () => {
  const currentPathName=route.name as string;
  const currentPathNumber=parseInt(currentPathName);
  let previousPageNumber=currentPathNumber-1;
  if(previousPageNumber<1){
    previousPageNumber=1;
  }

  router.push(`/init/${previousPageNumber}`);
}
</script>
<style scoped>
.config-container {
  display: flex;
  flex-direction: column;

  height: 100vh;


}
.config-header{
  display: flex;
  font-size: 24px;
  height: 5vh;
  border: solid 1px #c74141;
}
.config-page {
  display: flex;
 
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  border: solid 1px #000;
}
.config-footer{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: solid 1px #4841c7;
  height: 5vh;
}
</style>
