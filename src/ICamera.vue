<template>
  <div class="camera-container">

    <camera-card></camera-card>
     <camera-card></camera-card>
     
  </div>
</template>
<script setup lang="ts">
import CameraCard from './components/CameraCard.vue';
</script>
<style scoped>
.camera-container {
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow:auto;
}


</style>
