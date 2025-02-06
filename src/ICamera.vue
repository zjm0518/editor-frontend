<template>
  <div class="camera-container">
    <camera-card
      v-for="index in cameraNum"
      :key="index"
      @add-camera="addCamera"
    ></camera-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import CameraCard from "./components/CameraCard.vue";
const cameraNum = ref(1);
const addCamera = () => {
  cameraNum.value++;
};
</script>
<style scoped>
.camera-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: auto;
}
</style>
