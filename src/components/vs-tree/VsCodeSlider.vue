heme
<script setup lang="ts">
import { computed, watch, reactive, ref, nextTick, onMounted } from "vue";
import { getFileIcon, convertToTreeData, sortDirTree } from "./utils/utils";
import { ElTree, ElInput } from "element-plus";
import { ArrowRightBold } from "@element-plus/icons-vue";
import RightContentMenu from "./components/RightContentMenu.vue";
import { errorInfo } from "./config/config";
import { v4 as uuidv4 } from "uuid";
import { type FileData } from "@/utils";

import axios from "axios";
import {
  deleteFile,
  postFile,
  renameFile,
  getUserHomePath,
  uploadFiles,
  uploadDir,
} from "@/api/path";
//import RemoteTreeFile from "../RemoteTreeFile.vue";
import FileBroswerButton from "../FileBroswerButton.vue";
interface Tree {
  [key: string]: any;
}

const props = defineProps<{
  baseDir?: string;
  theme: string;
  width?: number;
  files?: Array<FileData>;
  allowDrag?: boolean;
  bgColor?: string;
  defaultOpen?: string;
  currentFile?: string;
}>();

const emits = defineEmits<{
  (e: "fileClick"): void;
  (e: "addFile", data: object): void;
  (e: "addFolder", data: FileData): void;
  (e: "getTextFromPath", path: string | undefined): void;
}>();

const elTreeRef = ref(null);
const addInputRef = ref(null);
const renameInputRef = ref(null);
const rightContentMenuRef = ref(null);
const errorInfoRef = ref(null);
const errorInfoPosition = reactive({
  left: 0,
  top: 0,
  width: 0,
});
const searchText = ref("");
const showSearchStatus = ref(false);

const width = ref(props.width || 280);
const openAllState = ref(false);
const defaultExpandKeys = ref([]);
const currentNodeData = reactive({
  data: null,
  node: null,
});
const createError = ref("");
const newFileName = ref("");
const renameFileName = ref("");
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

const showAddFolder = computed(() => {
  return currentNodeData.data && currentNodeData.data.isDir;
  //return currentNodeData.data;
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

function handleContentMenuClick(event, data, node, TreeNode) {
  elTreeRef.value.setCurrentKey(data.key);
  currentNodeData.data = data;
  currentNodeData.node = node;
  //console.log("handleContentMenuClick",data)
  if (rightContentMenuRef.value && rightContentMenuRef.value) {
    rightContentMenuRef.value.showMenu(event, data, node, TreeNode);
  }
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
  axios({
    method: "get",
    url: "/GetDirStructure",
    baseURL: "api/",
    params: {
      path: path,
    },
  })
    .then((res) => {
      const dir = res.data.data;
      sortDirTree(dir);
      treeData.value = convertToTreeData(dir);
      if (refresh) {
        defaultExpandKeys.value = [treeData.value[0].path];
      }

      //console.log("treeData.value",treeData.value);
    })
    .catch((err) => {
      console.log(err);
    });
};
function openNode() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentNode = elTreeRef.value.getCurrentNode();
      const node = elTreeRef.value.getNode(currentNode.key);
      node.expanded = true;

      setTimeout(() => {
        resolve();
      }, 50);
    }, 50);
  });
}

/**
 * 添加目录
 */
function addFolder() {
  const currentNode = elTreeRef.value.getCurrentNode();
  if (currentNode) {
    const child = currentNode.children[0];
    if (child) {
      // 非空目录
      const node = elTreeRef.value.getNode(child.key);
      elTreeRef.value.insertBefore(
        {
          children: [],
          key: uuidv4(),
          isNew: true,
          isRename: false,
          isDir: true,
          label: "",
          path: `${currentNode.path}\\__default__`,
        },
        node
      );
    } else {
      //空目录
      elTreeRef.value.append(
        {
          children: [],
          isNew: true,
          isRename: false,
          key: uuidv4(),
          isDir: true,
          label: "",
          path: `${currentNode.path}\\__default__`,
        },
        currentNode
      );
    }
    openNode().then((res) => {
      addInputRef.value && addInputRef.value.focus();
      const rect = addInputRef.value.input.getBoundingClientRect();
      errorInfoPosition.left = rect.left - 12;
      errorInfoPosition.top = rect.top + 26;
      errorInfoPosition.width = rect.width + 22;
    });
  } else {
  }
}

/**
 * 添加文件
 */
function addFile() {
  const currentNode = elTreeRef.value.getCurrentNode();
  if (currentNode) {
    if (currentNodeData.data.isDir) {
      elTreeRef.value.append(
        {
          children: [],
          isNew: true,
          isRename: false,
          key: uuidv4(),
          isDir: false,
          label: "",
          path: `${currentNode.path}\\__default__`,
        },
        currentNode
      );

      openNode().then((res) => {
        addInputRef.value && addInputRef.value.focus();
        const rect = addInputRef.value.input.getBoundingClientRect();
        errorInfoPosition.left = rect.left - 12;
        errorInfoPosition.top = rect.top + 26;
        errorInfoPosition.width = rect.width + 22;
      });
    } else {
    }
  }
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
 * 创建文件
 * @param data
 * @param node
 */
function createFile(data, node, type) {
  if (newFileName.value && newFileName.value.trim()) {
    const newName = newFileName.value.trim();
    if (currentNodeData.data.children.find((item) => item.label === newName)) {
      if (type === "entry") {
        createError.value = errorInfo.EXIT_FILE;
      } else {
        elTreeRef.value.remove(node);
        newFileName.value = "";
        createError.value = "";
      }
    } else {
      const postdata = {
        path: data.path.replace("__default__", newName),
        isDir: data.isDir,
      };
      postFile(postdata)
        .then((res) => {
          data.isNew = false;
          data.label = newName;
          data.path = data.path.replace("__default__", newName);
          newFileName.value = "";
          createError.value = "";
        })
        .catch((err) => {
          elTreeRef.value.remove(node);
          newFileName.value = "";
          createError.value = "";
        });
    }
  } else if (data.isNew) {
    elTreeRef.value.remove(node);
    newFileName.value = "";
    createError.value = "";
  }
}

function renameFileFunc(data, node, type) {
  if (renameFileName.value && renameFileName.value.trim()) {
    const reName = renameFileName.value.trim();
    const parentNode = node.parent;
    if (
      parentNode.data.children.find(
        (item) => item.label === reName && item.key != data.key
      )
    ) {
      if (type === "entry") {
        createError.value = errorInfo.EXIT_FILE;
      } else {
        data.isRename = false;
        renameFileName.value = "";
        createError.value = "";
      }
    } else {
      const postdata = {
        oldPath: data.path,
        newPath: data.path.replace(/(\\|\/)([^\\\/]+)$/, `$1${reName}`),
      };
      console.log(postdata);

      renameFile(postdata)
        .then((res) => {
          //success
          console.log(res);
          data.isRename = false;
          data.label = reName;
          data.path = data.path.replace(/(\\|\/)([^\\\/]+)$/, `$1${reName}`);
          renameFileName.value = "";
          createError.value = "";
        })
        .catch((err) => {
          console.log(err);
          data.isRename = false;
          renameFileName.value = "";
          createError.value = "";
        });
    }
  } else if (data.isRename) {
    data.isRename = false;
    renameFileName.value = "";
    createError.value = "";
  }
}

/**
 * 定位文件
 */
function locationFile() {}

function clickMenu(key) {
  switch (key) {
    case "DELETE":
      deleteFile222();
      break;
    case "RENAME":
      showRenameInput();
      break;
  }
}
const deleteFile222 = function () {
  //console.log("deleteFile",currentNodeData.data)
  const postdata = {
    path: currentNodeData.data.path,
    isDir: currentNodeData.data.isDir,
  };
  deleteFile(postdata).then((res) => {
    elTreeRef.value.remove(currentNodeData.node);
    currentNodeData.data = "";
    currentNodeData.node = "";
  });
};
const showRenameInput = function () {
  const currentNode = elTreeRef.value.getCurrentNode();
  const node = elTreeRef.value.getNode(currentNode.key);
  node.data.isRename = true;

  renameFileName.value = node.data.label;
  console.log(renameInputRef.value);
  nextTick(() => {
    if (renameInputRef.value) {
      renameInputRef.value.select();
    }
  });
};

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
const fileInput = ref(null);
const dirInput = ref(null);
const triggerFileUpload = function () {
  fileInput.value.click();
};
const triggerDirUpload = function () {
  dirInput.value.click();
};
const handleFileUpload = async function (event) {
  const files = event.target.files;
  if (!files.length) return;
  console.log("files", files);
  const formData = new FormData();
  formData.append("targetPath", selectedFolder.value);
  console.log("selectedFolder.value", selectedFolder.value);
  for (const file of files) {
    formData.append("files", file);
  }

  uploadFiles(formData, { "Content-Type": "multipart/form-data" }).then(
    (res) => {
      console.log(res);
      getDirStructure(currentFolder.value); //刷新目录
    }
  );
};

const handleDirUpload = async function (event: Event) {
  const files = event.target.files;
  if (!files.length) return;
  console.log("files", files);
  const formData = new FormData();
  formData.append("targetPath", selectedFolder.value);
  console.log("selectedFolder.value", selectedFolder.value);
  for (const file of files) {
    formData.append("files", file);
    formData.append("paths", file.webkitRelativePath); // 额外传递路径
  }

  uploadDir(formData, { "Content-Type": "multipart/form-data" }).then((res) => {
    console.log(res);
    getDirStructure(currentFolder.value); //刷新目录
  });
};
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
    //console.log('[ file ] >', fileItems);
    return [fileItems];
  }
};
const handleDrop = async function (event: DragEvent) {
  event.preventDefault();

  const promises = [];
  for (const item of event.dataTransfer.items) {
    const entry = item.webkitGetAsEntry();
    promises.push(readFiles(entry));
  }

  const resultFilesArrays = await Promise.all(promises);
  const allFiles = resultFilesArrays.flat();

  console.log("[ All files ] >", allFiles);
  const formData = new FormData();
  formData.append("targetPath", selectedFolder.value);
  for (const file of allFiles) {
    formData.append("files", file.file);
    formData.append("paths", file.fullPath); // 额外传递路径
  }
  uploadDir(formData, { "Content-Type": "multipart/form-data" }).then((res) => {
    console.log(res);
    getDirStructure(currentFolder.value); //刷新目录
  });
};
const handleDragOver = function (event: Event) {
  event.preventDefault();
  event.stopPropagation();

  const el_node = event.target.closest(".el-tree-node");

  el_node.classList.add("is-drop");
};
const handleDragLeave = function (event: Event) {
  event.preventDefault();
  event.stopPropagation();

  const el_node = event.target.closest(".el-tree-node");

  el_node.classList.remove("is-drop");
};
const handleNodeDrop = async function (
  event: DragEvent,
  node: Tree,
  data: FileData
) {
  event.preventDefault();

  console.log("handleNodeDrop", event, node, data);
  let targetpath = "";
  if (data.isDir) {
    targetpath = data.path;
  } else {
    targetpath = data.path.substring(0, data.path.lastIndexOf("\\"));
  }
  const promises = [];
  for (const item of event.dataTransfer.items) {
    const entry = item.webkitGetAsEntry();
    promises.push(readFiles(entry));
  }

  const resultFilesArrays = await Promise.all(promises);
  const allFiles = resultFilesArrays.flat();

  console.log("[ All files ] >", allFiles);
  const formData = new FormData();
  formData.append("targetPath", targetpath);
  for (const file of allFiles) {
    formData.append("files", file.file);
    formData.append("paths", file.fullPath); // 额外传递路径
  }
  uploadDir(formData, { "Content-Type": "multipart/form-data" }).then((res) => {
    console.log(res);
    getDirStructure(currentFolder.value); //刷新目录
  });
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
  console.log(" defaultExpandKeys.value", defaultExpandKeys.value);
};
onMounted(() => {
  getUserHomePath().then((res) => {
    getDirStructure(res.userHomePath, true);
  });
});
</script>

<template>
  <div
    class="vs-slider dark"
    :style="{
      backgroundColor: props.bgColor,
    }"
    @drop="handleDrop"
    @dragover.prevent
  >
    <div class="header">
      <span class="base-dir"><!-- {{ baseDirName }} --></span>
      <div>

        <i
          class="icon iconfont2 icon2-upload_file cursor-pointer"
          title="上传文件"
          @click="triggerFileUpload"
        ></i>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileUpload"
        />
        <i
          class="icon iconfont2 icon2-upload-folder cursor-pointer"
          title="上传文件夹"
          @click="triggerDirUpload"
        ></i>
        <input
          ref="dirInput"
          type="file"
          webkitdirectory
          class="hidden"
          @change="handleDirUpload"
        />
        <FileBroswerButton @select-dir="getDirStructure"></FileBroswerButton>
        <i
          class="icon iconfont vs-find cursor-pointer"
          title="查找文件"
          @click="showSearch"
        ></i>
        <i
          v-if="showAddFolder"
          class="icon iconfont vs-add-file cursor-pointer"
          title="添加文件"
          @click="addFile"
        ></i>
        <i
          v-if="showAddFolder"
          class="icon iconfont vs-add-folder cursor-pointer"
          title="添加目录文件"
          @click="addFolder"
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
      <div v-if="showSearchStatus" class="search">
        <ElInput v-model="searchText" size="mini" placeholder="输入文件名称" />
        <el-button size="mini" type="text" @click="hiddenSearch"
          >取消</el-button
        >
      </div>
    </div>
    <div class="el-tree-view" @contextmenu.prevent @click="cancelCurrentClick">
      <ElTree
        ref="elTreeRef"
        :data="treeData"
        :default-expanded-keys="defaultExpandKeys"
        :filter-node-method="filterNode"
        :icon="ArrowRightBold"
        node-key="path"
        :highlight-current="true"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @node-contextmenu="handleContentMenuClick"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        draggable
        :allow-drag="() => {return false;}
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
            <div
              v-else-if="data.isNew && !data.isRename"
              class="create_file"
              :class="createError ? 'error' : ''"
            >
              <ElInput
                ref="addInputRef"
                v-model="newFileName"
                @keyup.enter="createFile(data, node, 'entry')"
                @blur="createFile(data, node, 'blur')"
              />
            </div>
            <div
              v-else-if="!data.isNew && data.isRename"
              class="rename_file"
              :class="createError ? 'error' : ''"
            >
              <ElInput
                ref="renameInputRef"
                v-model="renameFileName"
                @keyup.enter="renameFileFunc(data, node, 'entry')"
                @blur="renameFileFunc(data, node, 'blur')"
              />
            </div>
            <span></span>
          </span>
        </template>
      </ElTree>
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
    <RightContentMenu ref="rightContentMenuRef" @handleMenu="clickMenu" />
  </div>
</template>

<style lang="scss" scoped>
.vs-slider {
  position: relative;
  background-color: #222222;
  font-family: Consolas, "Courier New", monospace;
  height: 100%;
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

.dark {
  background-color: #222222;
  color: #fff;
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
  flex-direction: row;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

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
  height: calc(100% - 30px);
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
</style>
