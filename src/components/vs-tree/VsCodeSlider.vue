heme
<script setup lang="ts">
import { computed, watch, reactive, ref, nextTick, onMounted, inject,onUnmounted, provide } from "vue";
import { getFileIcon, convertToTreeData, sortDirTree } from "./utils/utils";
import { ElTree, ElInput } from "element-plus";
import { ArrowRightBold, Search } from "@element-plus/icons-vue";
import RightContentMenu from "./components/RightContentMenu.vue";
import { errorInfo } from "./config/config";
import { v4 as uuidv4 } from "uuid";
import { type FileData,type SearchFileData } from "@/utils";
import { useLayoutStore } from "../../stores/layout";
const layoutStore = useLayoutStore();
import axios from "axios";
import {
  deleteFile,
  postFile,
  renameFile,
  getUserHomePath,
  uploadFiles,
  uploadDir,
  getSearchText
} from "@/api/path";

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
  (e:"deleteFile",path:string):void;
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
const searchFilterText = ref("");
const searchFileText = ref("");
const isSearchFilter = ref(false);//过滤
const isSearchText = ref(false);//全局搜索
const showSearchResult=ref(false);
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
const searchResult=ref<Array<SearchFileData>>([]);
const currentFolder = ref("");
const selectedFolder = ref("");

const theme = computed(() => {
  if (["dark", "light"].includes(props.theme)) {
    return props.theme;
  }
  return "";
});

const showAddFolder = computed(() => {
  return currentNodeData.data;
  //return currentNodeData.data;
});
function handleNodeClick2(obj, node, TreeNode, Event){
  Event.stopPropagation();
  emits("getTextFromPath", obj.path);
  selectedFolder.value = obj.path.substring(0, obj.path.lastIndexOf("\\"));
}
function handleNodeClick(obj, node, TreeNode, Event) {
  Event.stopPropagation();
  if(obj.isNew || obj.isRename){
    return;
  }
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
const rightTarget= ref(null);
const rightData=ref(null);
provide("rightTarget", rightTarget);
watch(
  () => rightTarget.value,
  (newVal, oldVal) => {
    console.log("watch triggered:", newVal, oldVal);
    let oldNode,newNode;
    // 移除上一个被右键点击的节点的类
    if (oldVal) {
      oldNode = oldVal.closest(".el-tree-node");

    }

    // 给新的添加 is-right-click
    if (newVal) {
      newNode = newVal.closest(".el-tree-node");

    }
    console.log("watch triggered:", newNode, oldNode,oldNode == newNode);
    if(oldNode && newNode && oldNode == newNode){
      newNode && newNode.classList.add("is-right-click");
      return;
    }
    oldNode && oldNode.classList.remove("is-right-click");
    newNode && newNode.classList.add("is-right-click");
  },
  { flush: "post" } // 确保 DOM 更新后执行
);
function handleContentMenuClick(event, data, node, TreeNode) {
  if(data.isNew || data.isRename){
    return;
  }
  //elTreeRef.value.setCurrentKey(data.path);
  currentNodeData.data = data;
  currentNodeData.node = node;
  console.log("handleContentMenuClick",data,treeData.value)

  rightTarget.value=event.target;
  rightData.value=data;

  if (rightContentMenuRef.value && rightContentMenuRef.value) {
    rightContentMenuRef.value.showMenu(event, data, node, TreeNode);
  }else{
    //el_node.classList.remove("is-right-click");
  }
}

function openAll() {
  openAllState.value = true;
  expandRecursive(elTreeRef.value.store.root, openAllState.value);
}

function closeAll() {
  openAllState.value = false;
  expandRecursive(elTreeRef.value.store.root.childNodes[0], openAllState.value);
}

function expandRecursive(node, value) {
  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach((child) => {
      child.expanded = value;
      expandRecursive(child, value);
    });
  }
}

const  getDirStructure = function (path: string, refresh = false) {
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
      //treeData.value = [];

      treeData.value = convertToTreeData(dir);

    //  elTreeRef.value?.reload();
      if (refresh) {
        defaultExpandKeys.value = [treeData.value[0].path];
      }

    })
    .catch((err) => {
      console.log(err);
    });
};
function openNode() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const currentNode = elTreeRef.value.getCurrentNode();
      const node=elTreeRef.value.getNode(currentNode.path);
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
  const currentNode =elTreeRef.value.getCurrentNode();
  if (currentNode) {
    isAddingDir.value=true;
    if (currentNode.isDir){
      const existingNewFile = currentNode.children.find(child => child.isNew);
      if (existingNewFile) {
        // 如果有正在创建的文件，直接聚焦输入框
        addInputRef.value && addInputRef.value.focus();
        return;
      }
    const child = currentNode.children[0];
    if (child) {
      // 非空目录
      const node = elTreeRef.value.getNode(child.path);
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

  } else {

    const currnode=elTreeRef.value.getNode(currentNode.path);
    const parentnode=elTreeRef.value.getNode(currnode.parent.data.path);
    //is file
    const existingNewFile = parentnode.data.children.find(child => child.isNew);
      if (existingNewFile) {
        // 如果有正在创建的文件，直接聚焦输入框
        addInputRef.value && addInputRef.value.focus();
        return;
      }
      elTreeRef.value.insertAfter(
        {
          children: [],
          isNew: true,
          isRename: false,
          key: uuidv4(),
          isDir: true,
          label: "",
          path: `${parentnode.data.path}\\__default__`,
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
}
}



/**
 * 添加文件
 */
function addFile() {
//  setCurrentNode(currentFolder.value.replace(/\//g, "\\"));
 // elTreeRef.value.currentNode=elTreeRef.value.root.childNodes[0]

  const currentNode = elTreeRef.value.getCurrentNode();

  if (currentNode) {
    isAddingFile.value=true;
    if (currentNode.isDir) {
      // 查找是否已经有正在创建的文件
      const existingNewFile = currentNode.children.find(child => child.isNew);
      if (existingNewFile) {
        // 如果有正在创建的文件，直接聚焦输入框
        console.log("already exist",existingNewFile)
        addInputRef.value && addInputRef.value.focus();
        return;
      }

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

      //console.log("addInputRef",currentNode, addInputRef.value)
      //console.log("exist",currentNode.data.children.find(child => child.isNew));

      openNode().then((res) => {

        addInputRef.value && addInputRef.value.focus();
        const rect = addInputRef.value.input.getBoundingClientRect();
        errorInfoPosition.left = rect.left - 12;
        errorInfoPosition.top = rect.top + 26;
        errorInfoPosition.width = rect.width + 22;
      });
    } else {
      //isfile
      const currnode=elTreeRef.value.getNode(currentNode.path);
      const parentnode=elTreeRef.value.getNode(currnode.parent.data.path);

      const existingNewFile = parentnode.data.children.find(child => child.isNew);
      if (existingNewFile) {
        // 如果有正在创建的文件，直接聚焦输入框
        addInputRef.value && addInputRef.value.focus();
        return;
      }
      elTreeRef.value.insertAfter(
        {
          children: [],
          isNew: true,
          isRename: false,
          key: uuidv4(),
          isDir: false,
          label: "",
          path: `${parentnode.data.path}\\__default__`,
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
    }
  }
}
/**
 * 取消选中状态
 * @param event
 */
function cancelCurrentClick() {
  //currentNodeData.data = null;
  //currentNodeData.node = null;
  //elTreeRef.value.setCurrentKey(null);
  console.log("cancelCurrentClick")
  setCurrentNode(currentFolder.value.replace(/\//g, "\\"));
}
const addFileRef=ref(null)
const addDirRef=ref(null)
const isAddingFile=ref(false)
const isAddingDir=ref(false)
const lastMouseDownTarget = ref(null); // 记录 `mousedown` 目标
// 记录 `mousedown` 目标
function handleMouseDown(event) {
  lastMouseDownTarget.value = event.target;
}

const handleBlur=function(data, node){
  //blur
        // 如果 `blur` 发生时，最近的 `mousedown` 目标是 `addFileRef`，则阻止删除
        console.log("lastMouseDownTarget.value",lastMouseDownTarget.value,addFileRef.value)
        if (isAddingFile.value&&lastMouseDownTarget.value === addFileRef.value) {
          console.log("isAddingFile",isAddingFile.value,lastMouseDownTarget.value === addFileRef.value)
          return;
        }
        if (isAddingDir.value&&lastMouseDownTarget.value === addDirRef.value) {
          return;
        }
        createFile(data,node,"blur")

}
const handleBlur2=function(data,node){
  console.log("handleBlur2",data,node)
}
/**
 * 创建文件
 * @param data
 * @param node
 */
function createFile(data, node, type) {
  const currentNodeData = elTreeRef.value.getCurrentNode();
  if (newFileName.value && newFileName.value.trim()) {
    const newName = newFileName.value.trim();
    //查看同名
    const currnode=elTreeRef.value.getNode(currentNodeData.path);
    const parentnode=elTreeRef.value.getNode(currnode.parent.data.path);
    const samename=currentNodeData.isDir?currentNodeData.children.find((item) => item.label === newName):
    parentnode.data.children.find((item) => item.label === newName);
    //parentisdir
    if (samename) {
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
          console.log(res);
        /*   data.isNew = false;
          data.isRename=false;
          data.label = newName;
          data.path = data.path.replace("__default__", newName); */
          elTreeRef.value.remove(node);
          newFileName.value = "";
          createError.value = "";
         // getDirStructure(currentFolder.value);
           getDirStructure(currentFolder.value);

          lastMouseDownTarget.value=elTreeRef.value
          //console.log(elTreeRef.value.currentNode.data.path)
         //setCurrentNode(selectedPath.value.replace(/\//g, "\\"))

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
  isAddingDir.value=false;
  isAddingFile.value=false;

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
         /*  data.isRename = false;
          data.label = reName;
          data.path = data.path.replace(/(\\|\/)([^\\\/]+)$/, `$1${reName}`); */

              if(elTreeRef.value.getCurrentNode().path==currentNodeData.data.path){

             setCurrentNode(currentFolder.value.replace(/\//g, "\\"));
            }
             emits("deleteFile",data.path);
             elTreeRef.value.remove(node);
               getDirStructure(currentFolder.value);
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



function clickMenu(key) {
  switch (key) {
    case "DELETE":
      deleteFile222();
      break;
    case "RENAME":
      showRenameInput();
      break;
    case "CLOSE":
      closeNode();
      break;
    case "DOWNLOAD":
      handleDownload();
      break;
  }
}
const closeNode=function(){
  elTreeRef.value.remove(currentNodeData.node);

}
const deleteFile222 = function () {
  //console.log("deleteFile",currentNodeData.data,rightData.value)
  const postdata = {
    path: currentNodeData.data.path,
    isDir: currentNodeData.data.isDir,
  };
  deleteFile(postdata).then((res) => {


   // console.log("issss",elTreeRef.value.getCurrentNode().path,currentNodeData.data.path)
    if(elTreeRef.value.getCurrentNode().path==currentNodeData.data.path){

      setCurrentNode(currentFolder.value.replace(/\//g, "\\"));
    }
    emits("deleteFile",currentNodeData.data.path,currentNodeData.data.isDir);
    elTreeRef.value.remove(currentNodeData.node);
    currentNodeData.data = "";
    currentNodeData.node = "";
    rightData.value=null;
  });
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
const showRenameInput = function() {

  const node = elTreeRef.value.getNode(rightData.value.path);
  //console.log("showRenameInput",node,rightData.value)
  node.data.isRename = true;

  renameFileName.value = node.data.label;

  nextTick(() => {
    if (renameInputRef.value) {
      renameInputRef.value.select();
    }
  });
};

watch(searchFilterText, (val) => {
    console.log("filter")
    elTreeRef.value!.filter(val);

});
import { debounce } from "lodash";
const latestRequestId = ref("")
// 使用 lodash 的 debounce，设置 500ms 延迟
const fetchSearchResults = debounce((val) => {
  const requestId = uuidv4(); // 生成当前请求的 ID（时间戳）
  latestRequestId.value = requestId; // 更新最新的请求 ID
  if(val==""){
    searchResult.value=[];
    return;
  }

  console.log("search");
  getSearchText({ path: currentFolder.value, searchText: val }).then((res) => {
    if(requestId===latestRequestId.value){
      console.log(res);
      searchResult.value = res.result;
    }else {
      console.log(`请求过期: ${requestId}, 丢弃数据`);
    }
  });
}, 500); // 500ms 延迟
watch(searchFileText,(val)=>{
 fetchSearchResults(val);
})
function filterNode(value: string, data: Tree, node) {
  if (!value) return true;
  return data.label.includes(value);
}

function showSearch() {
  isSearchFilter.value = true;


}
function showSearchText() {
  isSearchText.value = true;
}
function hiddenSearch() {
  isSearchFilter.value = false;
  searchFilterText.value="";
  closeAll();

}
function hiddenSearch2(){
  isSearchText.value = false;

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
  console.log(" Collapse defaultExpandKeys.value", defaultExpandKeys.value);
};
const handleNodeExpand = function (data, node, instance) {
  defaultExpandKeys.value.push(data.path);
  console.log(" Expand defaultExpandKeys.value", defaultExpandKeys.value);
};
onMounted(() => {
  getUserHomePath().then((res) => {
    getDirStructure(res.userHomePath, true);

  });
  document.addEventListener("mousedown", handleMouseDown,true);
  document.addEventListener("mousedown",rightContentMenuRef.value.hiddenMenuStatus ,true);
  setTimeout(()=>{
    setCurrentNode(currentFolder.value.replace(/\//g, "\\"));
    elTreeRef.value.currentNode=elTreeRef.value.root.childNodes[0]
  },1000)

});

// 在 `unmounted` 时移除全局 `mousedown` 事件，防止内存泄漏
onUnmounted(() => {
  document.removeEventListener("mousedown", handleMouseDown,true);
  document.removeEventListener("mousedown",rightContentMenuRef?.value?.hiddenMenuStatus ,true);
});
const setCurrentNode=function(path:string){

  const node = elTreeRef.value?.getNode(path);
  elTreeRef.value?.setCurrentKey(node.key);

}
const selectedPath=inject("selectedPath")
watch(()=>selectedPath.value,(val)=>{
  setCurrentNode(val)
})

const handleCurrentChange=function(data, node){
  //console.log("handleCurrentChange",data,node)
  if(data == null || node == null){
       setCurrentNode(currentFolder.value.replace(/\//g, "\\"));
       elTreeRef.value.currentNode=elTreeRef.value.root.childNodes[0]
  }
}
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
    <div class="header" :style="{height:layoutStore.headerHeight,fontSize:layoutStore.headerFontSize}">
      <span class="base-dir"><!-- {{ baseDirName }} --></span>
      <div >

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
        <FileBroswerButton @select-dir="getDirStructure" :fontsize="layoutStore.headerFontSize"></FileBroswerButton>
        <i
          class="icon iconfont vs-find cursor-pointer"
          title="查找文件"
          @click="showSearch"
        ></i>

        <i
          class="icon iconfont2 icon2-search-all cursor-pointer"
          title="全局搜索"
          @click="showSearchText"
        ></i>
        <i

          class="icon iconfont vs-add-file cursor-pointer"
          title="添加文件"
          @click="addFile"
          ref="addFileRef"
        ></i>
        <i

          class="icon iconfont vs-add-folder cursor-pointer"
          title="添加目录文件"
          @click="addFolder"
          ref="addDirRef"
        ></i>
       <!--  <i
          v-if="!openAllState"
          class="icon iconfont vs-open-all cursor-pointer"
          title="展开所有文件"
          @click="openAll"
        ></i> -->
        <i
          class="icon iconfont vs-close-all cursor-pointer"
          title="关闭所有文件"
          @click="closeAll"
        ></i>
      </div>
      <div v-if="isSearchFilter" class="search">
        <ElInput v-model="searchFilterText" placeholder="输入文件名称" />
        <el-button  @click="hiddenSearch"
          >取消</el-button>
      </div>
      <div v-if="isSearchText" class="search">
        <ElInput v-model="searchFileText" placeholder="输入文件名称" />
        <el-button  @click="hiddenSearch2"
          >取消</el-button>
      </div>
    </div>
    <div class="el-tree-view" @contextmenu.prevent @click="cancelCurrentClick">
      <ElTree
        ref="elTreeRef"
        v-show="!isSearchText"
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
        :allow-drag="() => {return false;}"
        @current-change="handleCurrentChange"

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
            <span
              v-else-if="data.isNew && !data.isRename"
              class="create_file"
              :class="createError ? 'error' : ''"

            >
              <ElInput
                v-model="newFileName"
                @keyup.enter.stop.prevent="createFile(data, node, 'entry')"
                @blur="handleBlur(data, node)"
                 ref="addInputRef"
                @click.stop
                @mousedown.stop
              />
          </span>
            <span
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
        </span>

          </span>
        </template>
      </ElTree>
      <ElTree
      v-show="isSearchText"
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
  font-family: Consolas, "Courier New";
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
.is-current__{
  >.el-tree-node__content {
    background-color: rgba(50, 88, 213, 0.3) !important;
    border: 1px solid #9bc0f4;
    color: white;
  }
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
  &.is-right-click > .el-tree-node__content {
    background-color: rgba(47, 89, 225, 0.3) !important;

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

  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .search {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    width: 100%;
    background-color: #222222;

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
  font-size: inherit ;
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
  overflow: hidden;

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
    border-radius: 1;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.el-tree-view {
  width: 100%;
  height: calc(100% - var(--header-height));
  overflow-y: scroll;
  overflow-x: hidden;

  :deep(.el-tree) {
    width: 100%; /* 让 tree 宽度始终与外层匹配 */
    min-width: 100%; /* 避免随 node 内容变长而撑开 */
    white-space: nowrap; /* 防止换行 */

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

.el-input{
  background-color: #222222;
  --el-input-border-color: #0a85f8 !important;
}
:deep(.el-input__wrapper){
  background-color: #222222 !important;
}
:deep(.el-input__wrapper.is-focus) {
  transition: none !important;
  border: 1px solid #0a85f8 !important;
  box-shadow: none !important;

}
:deep(.el-input__inner ){
  color: #fff !important;
}
:deep(.search .el-button){
  background-color: #222222 !important;
  --el-button-bg-color: #222222 !important;
}
</style>
