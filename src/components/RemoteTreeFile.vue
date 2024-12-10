<template>
  <div>
    <el-button type="" @click="handelTree" :icon="Plus"></el-button>
    <el-dialog title="请选择脚本库" v-model="visible" width="50%" align-center>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        accordion
        :filter-node-method="filterNode"
        ref="tree"
        node-key
        @node-click="handleNodeClick"
        lazy
        :load="loadNode"
      >
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ElDialog, ElButton } from "element-plus";
import { getDisk, getDesktopPath, getPathAndFile } from "@/api/path";
import { ref,watch } from "vue";
const visible = ref(false);
const selectNode = ref<Tree>();
const selectPath = ref("");
const filterText = ref("");
const tree = ref(null)
const defaultProps = {
  children: "children",
  label: "label",
};
interface Tree {
  label: string;
  children?: Tree[];
  path?: string;
  isDir?: boolean;
  folder?: string;
}
const treeData = ref<Tree[]>([]);
const emit = defineEmits<{
  (e: "selectDir", dirPath: string): void;
}>();
const filterNode = function (value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
const handelTree = function () {
  visible.value = true;
  selectNode.value = "";
  selectPath.value = "";
  GetDisk();
};
const GetDisk = function () {
  getDisk({}).then((res) => {
    console.log(res);
    treeData.value = res.data.map((item) => {
      return {
        label: item.device,
        path: item.device + "\\",
        folder: item.device,
      };
    });
    getDesktop();
  });
};
const getDesktop = function () {
  getDesktopPath({}).then((res) => {
    treeData.value.push({
      label: "desktop",
      path: res.data + "\\",
      folder: res.data,
    });
  });
};
const loadNode = function (node, resolve) {
  const value = node.data.path;
  console.log(node.data.path);
  if (node.level == 0) return;
  getPathAndFile({ pathName: value }).then((res) => {
    let data = res.data;
    if (data) {
      data = data.map((item) => {
        return {
          label: item.fileName,
          path: item.filePath,
          folder: item.folder,
          isDir: item.isDir,
        };
      });
      resolve(data);
    } else {
      resolve([]);
    }
  });
};
const handleNodeClick = function (data: Tree) {
  selectNode.value = data;
  console.log(data);
  //const workPath = data.folder.split("\\" + data.label);
  selectPath.value = data.path;
};
const handelConfirm = function () {
  if (!selectNode.value) {
    return;
  }
  if (!selectNode.value.isDir) {
    return;
  }
  emit("selectDir", selectPath.value);
  visible.value = false;
};
watch(
    filterText,(val)=> {
      tree.value.filter(val);
    },
  )
</script>

<style lang="css" scoped>
.filter-tree {
  height: 500px;
  overflow-y: auto;
}
.filter-tree::-webkit-scrollbar {
  width: 5px;
  height: 3px;
}
.filter-tree::-webkit-scrollbar-track {
  background: rgba(255, 255, 255);
}
.filter-tree::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 3px;
}
.el-dialog {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  margin-top: 0 !important;
}

.el-tree-node__label {
  font-size: 20px;
}
</style>
