<!-- 文件夹无法删除时弹出此框 -->
<template>
<el-dialog
      title="提示"
      v-model="visible"
      width="40%"
      height="70%"
      align-center>
<div>
  <span>文件夹：{{deletepath}}在终端中被打开，请先退出后再{{ isDelete?"删除":"重命名" }}</span>
</div>
  <template #footer>
        <span class="dialog-footer">
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

const isDelete=ref(true);
const handelConfirm=function(){

  visible.value=false
}
const showDeleteRenameFail=function(path:string,isDir:boolean,isdelete:boolean){
  visible.value=true
  deletepath.value=path;
  isDelete.value=isdelete;

}
defineExpose({
  showDeleteRenameFail,
});
</script>
<style scope>
</style>
