<template>
  <el-tree
    class="jktree"
    :data="props.data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup>
import { ElTree } from "element-plus";
interface Tree {
  label: string;
  children?: Tree[];
  path?: string;
  isDir?: boolean;
}
const emit = defineEmits<{
  (e: "tchange", payload: string | undefined): void;
  (e: "getTextFromPath", path: string | undefined): void;
}>();

const handleNodeClick = (data: Tree) => {
  console.log(data.path);
  if (!data.isDir) {
    console.log("emit");
    emit("getTextFromPath", data.path);
  }
};
const props = defineProps<{
  data: Tree[];
}>();

const defaultProps = {
  children: "children",
  label: "label",
};
</script>

<style lang="css" scoped>
el-tree .jktree {
  width: 100%;
  overflow-y: auto;
}
</style>
