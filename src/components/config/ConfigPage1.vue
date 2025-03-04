<template>
  <div >
  <span>请输入ip</span>  <el-input
  placeholder="ip"
  v-model="ip"
  clearable>
</el-input>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue';

const ip=ref('')
</script>

