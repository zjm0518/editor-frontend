<template>
  <div class="mask-wrapper">
    <!-- 被遮罩的内容 -->
    <slot />

    <!-- 遮罩层 -->
    <div v-if="show" class="mask-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  show: Boolean
})
</script>

<style scoped>
.mask-wrapper {
  position: relative;
}

.mask-overlay {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: auto;
}

/* 简单 spinner */
.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #999;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
