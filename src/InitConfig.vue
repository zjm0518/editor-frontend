<template>
  <div class="config-container">
    <div class="config-header">
      <span>配置</span>
    </div>
    <div class="config-page">
      <div class="config-steps">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
          <el-step title="步骤 4"></el-step>
          <el-step title="步骤 5"></el-step>
        </el-steps>
      </div>

      <RouterView></RouterView>
    </div>
    <div class="config-footer">
      <el-button @click="save">保存配置</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="previous" :disabled="currentIndex == 1"
        >上一步</el-button
      >
      <el-button @click="next" :disabled="currentIndex == 5">下一步</el-button>
      <el-button @click="save">完成配置</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { useConfigStore } from "@/stores/config";
import { ref, onMounted } from "vue";

const configstorage = useConfigStore();
const router = useRouter();
const route = useRoute();
const active = ref(0);
const currentIndex = ref(1);
const next = () => {
  const currentPathName = route.name as string;
  const currentPathNumber = parseInt(currentPathName);
  let nextPageNumber = currentPathNumber + 1;
  if (nextPageNumber > 5) {
    nextPageNumber = 5;
  }
  active.value = nextPageNumber - 1;
  currentIndex.value = nextPageNumber;
  router.push(`/init/${nextPageNumber}`);
};
const previous = () => {
  const currentPathName = route.name as string;
  const currentPathNumber = parseInt(currentPathName);
  let previousPageNumber = currentPathNumber - 1;
  if (previousPageNumber < 1) {
    previousPageNumber = 1;
  }
  active.value = previousPageNumber - 1;
  currentIndex.value = previousPageNumber;
  router.push(`/init/${previousPageNumber}`);
};
const save = () => {
  configstorage.updateToServer();
};
const reset = () => {
  configstorage.$reset();
};
onMounted(() => {
  const currentPathName = route.name as string;
  const currentPathNumber = parseInt(currentPathName);
  active.value = currentPathNumber - 1;
  currentIndex.value = currentPathNumber;
});
</script>
<style scoped>
.config-container {
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.config-header {
  display: flex;
  font-size: 24px;
  align-items: center;
  height: 10vh;

}
.config-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  flex-grow: 1;
  width: 100vw;

  .config-steps {
    width: 80%;
    height: 20%;
    margin-top: 20px;
  }

}
.config-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 10vh;
}
:deep(.el-step__head.is-success) {
  border-color: #4085fc;
  color: #4085fc;
}
:deep(.el-step__title.is-success) {
  color: #4085fc;
}
</style>
