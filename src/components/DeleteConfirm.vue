<template>
<el-dialog
title="请确认"
      v-model="visible"
      width="40%"
      height="70%"
      align-center>
<div>
  <span>是否删除该{{isdeleteDir?"文件夹":"文件"}}：{{deletepath}}？</span>
</div>
  <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button @click="handelConfirm">确 定</el-button>
        </span>
      </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElDialog, ElButton } from "element-plus";
import { ref } from "vue";
const visible=ref(false);
const deletepath=ref("");
const isdeleteDir=ref(false);
const emit = defineEmits<{
  (e: "deleteConfirm"): void;
}>();
const handelConfirm=function(){
  emit("deleteConfirm");
  visible.value=false
}
const showDeleteConfirm=function(path:string,isDir:boolean){
  visible.value=true
  deletepath.value=path;
  isdeleteDir.value=isDir;
}
defineExpose({
  showDeleteConfirm,
});
</script>
<style scope>
</style>
