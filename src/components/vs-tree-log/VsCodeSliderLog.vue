heme
<script setup lang="ts">
import { computed, watch, reactive, ref, onMounted } from "vue";
import { getFileIcon, convertToTreeData, sortDirTree } from "./utils/utils";
import { ElTree, ElInput } from "element-plus";
import { ArrowRightBold } from "@element-plus/icons-vue";

import { type FileData } from "@/utils";
import axios from "axios";
import { getDir,getLogtPath_,setLogPath_,getSearchByTime } from "@/api/path";
import LogButton from "../LogButton.vue";
import { useLayoutStore } from "@/stores/layout";
import LoadingMask from "@/components/LoadingMask.vue";
const layoutStore = useLayoutStore();
interface Tree {
  [key: string]: any;
}

const props = defineProps<{
  theme: string;
}>();

const emits = defineEmits<{
  (e: "fileClick"): void;
  (e: "getTextFromPath", path: string | undefined): void;
  (e: "exportLogXLSX",label:string): void;
}>();

const elTreeRef = ref(null);

const errorInfoRef = ref(null);
const errorInfoPosition = reactive({
  left: 0,
  top: 0,
  width: 0,
});
const searchText = ref("");
const showSearchStatus = ref(false);

const openAllState = ref(false);
const defaultExpandKeys = ref([]);
const currentNodeData = reactive({
  data: null,
  node: null,
});
const createError = ref("");

const defaultProps = {
  children: "children",
  label: "label",
};
const treeData = ref<Array<FileData>>([]);
const currentFolder = ref("");
const selectedFolder = ref("");

const theme = computed(() => {
  if (["dark", "light"].includes(props.theme)) {
    return props.theme;
  }
  return "";
});

function handleNodeClick(obj, node, TreeNode, Event) {
  currentNodeData.data = obj;
  currentNodeData.node = node;

  if (!obj.isDir) {
    emits("getTextFromPath", obj.path);
    console.log("fileClick", obj.path);
    selectedFolder.value = obj.path.substring(0, obj.path.lastIndexOf("\\"));
  } else {
    selectedFolder.value = obj.path;
  }
  //emits('fileClick', obj, node, TreeNode, Event);
}

function openAll() {
  openAllState.value = true;
  expandRecursive(elTreeRef.value.store.root, openAllState.value);
}

function closeAll() {
  openAllState.value = false;
  expandRecursive(elTreeRef.value.store.root, openAllState.value);
}

function expandRecursive(node, value) {
  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach((child) => {
      child.expanded = value;
      expandRecursive(child, value);
    });
  }
}
const getDirStructure = function (path: string, refresh = false) {
  currentFolder.value = path;
  selectedFolder.value = path;
  getDir({
    path: path,
  })
    .then((res) => {
      const dir = res.data;
      sortDirTree(dir);
      treeData.value = convertToTreeData(dir);
      if (refresh) {
        defaultExpandKeys.value = [treeData.value[0].path];
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const logPath=ref("");
const setLogPath=function(path: string){
  getDirStructure(path)
  setLogPath_({log_path:path})
  logPath.value=path;
}
/**
 * 取消选中状态
 * @param event
 */
function cancelCurrentClick() {
  currentNodeData.data = null;
  currentNodeData.node = null;
  elTreeRef.value.setCurrentKey(null);
}


/**
 * 定位文件
 */
function locationFile() {}

watch(searchText, (val) => {
  elTreeRef.value!.filter(val);
});

function filterNode(value: string, data: Tree, node) {
  if (!value) return true;
  return data.label.includes(value);
}

function showSearch() {
  showSearchStatus.value = true;
}

function hiddenSearch() {
  searchText.value = "";
  showSearchStatus.value = false;
}

const readFiles = async function (item, currentPath = "") {
  if (item.isDirectory) {
    // 是一个文件夹
    console.log("=======文件夹=======");
    const directoryReader = item.createReader();
    // readEntries是一个异步方法
    const entries = await new Promise((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });

    let files = [];
    for (const entry of entries) {
      const resultFiles = await readFiles(entry, currentPath + item.name + "/");
      files = files.concat(resultFiles);
    }
    return files;
  } else {
    // 是一个文件

    // file也是一个异步方法
    const file = await new Promise((resolve, reject) => {
      item.file(resolve, reject);
    });
    const fileRelativePath = currentPath + file.name;

    //console.log('fileRelativePath', fileRelativePath);
    const fileItems = {
      fullPath: fileRelativePath,
      file: file,
    };

    return [fileItems];
  }
};

const handleNodeCollapse = function (data, node, instance) {
  const index = defaultExpandKeys.value.findIndex((item) => item === data.path);

  if (index !== -1) {
    defaultExpandKeys.value.splice(index, 1); // 删除该元素
  }
  console.log(" defaultExpandKeys.value", defaultExpandKeys.value);
};
const handleNodeExpand = function (data, node, instance) {
  defaultExpandKeys.value.push(data.path);
  //console.log(" defaultExpandKeys.value", defaultExpandKeys.value);
};
const handleDownload=function() {
  if(currentNodeData.data==null) return;
  const selectedPath=currentNodeData.data.path;
  const label= selectedPath.split("\\").pop() || ""
  const isDir=currentNodeData.data.isDir;
  axios({
    method: "get",
    url: "/DownloadFile",
    baseURL: "api/",
    params:{path:selectedPath,name:label},
    responseType: 'blob',
  })
    .then((response) => {
      const blob = new Blob([response.data]); // 创建Blob对象
      const a = document.createElement('a');
      if(isDir){
        a.download = label+".zip";
      }else{
        a.download = label;
      }

      a.style.display = 'none';
      const url = URL.createObjectURL(blob);
      a.href = url;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url); // 释放URL
      document.body.removeChild(a);
    })
    .catch(error => {
      console.error('下载失败:', error);
    });
}
onMounted(() => {
  getLogtPath_().then((res) => {
    console.log(res)
    logPath.value=res.log_path;
    getDirStructure(res.log_path, true);
  });
});
import dayjs from 'dayjs'
import {type SearchFileData } from "@/utils";
const timeRange = ref();
const searchResult=ref<Array<SearchFileData>>([]);
const searchLoading=ref(false);
const isFilterTime=computed(()=>{

  if(timeRange.value){
    return true;
  }
  return false;

})
const clearTime = function () {
  timeRange.value = '';
}

async function searchFilesByTime(value) {

  if (!value || value.length !== 2) {
    console.warn('请选择起始时间和结束时间')

    return
  }
  const startTime = dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss')
  const endTime = dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')
  console.log('开始时间:', startTime,endTime)
  getSearchByTime({
    path:logPath.value,
    startTime: startTime,
    endTime: endTime,
  })
    .then((res) => {
     console.log(res)
     searchResult.value = res.result;
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleNodeClick2(obj, node, TreeNode, Event){
  Event.stopPropagation();
  emits("getTextFromPath", obj.path);
  selectedFolder.value = obj.path.substring(0, obj.path.lastIndexOf("\\"));
}

const shortcuts = [
  {
    text: '一周内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '一个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近3个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]
function getFileNameWithoutExtension(filename) {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return filename; // 没有后缀
  return filename.substring(0, lastDot);
}
const handleExport=function() {
  if(currentNodeData.data==null) return;
  const selectedPath=currentNodeData.data.path;
  const label= selectedPath.split("\\").pop() || ""
  //console.log("label",label,getFileNameWithoutExtension(label))
  const isDir=currentNodeData.data.isDir;
  if(isDir){
    alert("请先选择文件")
    return;
  }
  emits("exportLogXLSX",getFileNameWithoutExtension(label))
  //parseLog(getFileNameWithoutExtension(label))
}
</script>

<template>
  <div class="vs-slider light">
    <div class="header" :style="{height:layoutStore.logHeaderHeight,fontSize:layoutStore.headerFontSize}">

      <div class="base-button">
        <i class="icon iconfont2 icon2-export cursor-pointer" title="导出XLSX" @click="handleExport"></i>
        <i class="icon iconfont2 icon2-xiazai cursor-pointer" title="下载文件" @click="handleDownload"></i>
        <LogButton @select-log-path="setLogPath" :fontsize="layoutStore.headerFontSize"></LogButton>
        <i
          class="icon iconfont vs-find cursor-pointer"
          title="查找文件"
          @click="showSearch"
        ></i>
        <i
          class="icon iconfont vs-target cursor-pointer"
          title="定位文件"
          @click="locationFile"
        ></i>
        <i
          v-if="!openAllState"
          class="icon iconfont vs-open-all cursor-pointer"
          title="展开所有文件"
          @click="openAll"
        ></i>
        <i
          v-else
          class="icon iconfont vs-close-all cursor-pointer"
          title="关闭所有文件"
          @click="closeAll"
        ></i>
      </div>
      <div class="time-select">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          @change="searchFilesByTime"
          :shortcuts="shortcuts"
        />
    <el-button @click="clearTime"
          >取消</el-button>
      </div>
      <div v-if="showSearchStatus" class="search">
        <ElInput v-model="searchText" placeholder="输入文件名称" />
        <el-button size="mini" type="text" @click="hiddenSearch"
          >取消</el-button
        >
      </div>
    </div>
    <div class="el-tree-view" @contextmenu.prevent @click="cancelCurrentClick">
      <ElTree
        ref="elTreeRef"
        v-show="!isFilterTime"
        :data="treeData"
        :default-expanded-keys="defaultExpandKeys"
        :filter-node-method="filterNode"
        :icon="ArrowRightBold"
        node-key="path"
        :highlight-current="true"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        draggable
        :allow-drag="
          () => {
            return false;
          }
        "
      >
        <template #default="{ node, data }">
          <span
            class="custom-tree-node"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleNodeDrop($event, node, data)"
          >
            <i v-if="!data.isDir" :class="getFileIcon(data.label)"></i>
            <i
              v-else
              class="icon iconfont"
              :class="theme === 'light' ? 'vs-folder-line' : 'vs-folder'"
            ></i>
            <span v-if="!data.isNew && !data.isRename" class="label">{{
              data.label
            }}</span>

            <span></span>
          </span>
        </template>
      </ElTree>
      <LoadingMask :show="isFilterTime && searchLoading">
      <ElTree
      v-show="isFilterTime && !searchLoading"
        :data="searchResult"
        node-key="path"
        @node-click="handleNodeClick2"
      >
      <template #default="{ node, data }">
          <span
            class="custom-tree-node"
          >
            <i :class="getFileIcon(data.label)"></i>

            <span class="label">{{
              data.label
            }}</span>


          </span>
        </template>
      </ElTree>
      </LoadingMask>
      <div
        v-if="createError"
        ref="errorInfoRef"
        class="error-info"
        :style="{
          left: errorInfoPosition.left + 'px',
          top: errorInfoPosition.top + 'px',
          width: errorInfoPosition.width + 'px',
        }"
      >
        {{ createError }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vs-slider {
  position: relative;
  background-color: #222222;
  font-family: Consolas, "Courier New", monospace;
}

.error-info {
  font-size: 14px;
  background-color: rgb(255, 210, 210);
  position: fixed;
  width: 100%;
  padding: 5px;
  color: #616162;
  border: 1px solid red;
}

.base-dir {
  font-weight: bold;
}

.vs-slider {
  height: 100%;
  width: 100%;
}

:deep(.el-tree-node) {
  &:focus > .el-tree-node__content {
    background-color: rgba(200, 200, 200, 0.2);
  }

  &:hover > .el-tree-node__content {
    background-color: rgba(200, 200, 200, 0.15);
  }

  &.is-current > .el-tree-node__content {
    background-color: rgba(170, 189, 250, 0.3) !important;
    border: 1px solid #9bc0f4;
    color: white;
  }

  &.is-drop > .el-tree-node__content {
    background-color: rgba(182, 194, 234, 0.3) !important;

    color: white;
  }
}


.light {
  background-color: #f2f2f2;
  color: #303133;

  .icon-w {
    color: #616162;
  }
}
::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(111, 113, 117, 0.4);
}
.vscode-theme {
  background-color: #f2f2f2;
  color: #333333;

  .icon-w {
    color: #616162;
  }
}

.header {
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  padding: 0 10px;
  background-color: #f2f2f2;
  color: #303133;
  .search {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    width: 100%;
    background-color: #f2f2f2;

    :deep(.el-input__wrapper) {
      border-radius: 0;
    }

    :deep(.el-button) {
      margin: 0 5px;
    }
  }
}

.header .icon {
  margin: 0 4px;
  font-size: inherit;
}

:deep(.el-tree) {
  background-color: inherit;
  color: inherit;
}

.custom-tree-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  .iconfont {
    margin-right: 4px;

  }

  .name {
    padding-right: 8px;
  }

  :deep(.el-input) {
    height: 26px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 0;
  }

  .create_file {
    width: 100%;
    position: relative;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.el-tree-view {
  width: 100%;
  height: calc(100% - 100px);
  overflow-y: scroll;
  overflow-x: hidden;

  :deep(.el-tree) {
    min-width: max-content;
    width: 100%;
  }
}
.hidden {
  display: none;
}
.icon-y {
  color: #f4ea2a;
}

.icon-r {
  color: #d81e06;
}

.icon-b {
  color: #1296db;
}

.icon-g {
  color: #42b883;
}

.icon-w {
  color: white;
}

.icon-pink {
  color: #df744a;
}

.icon-purple {
  color: #a239ca;
}

.icon-wine-red {
  color: #d4237a;
}

.icon-cyan {
  color: #6b8e23;
}

.highlight {
  background-color: #f2f2f2;
}
.time-select{
  display: flex;
  flex-direction: row;
}
.base-button{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
}
</style>
