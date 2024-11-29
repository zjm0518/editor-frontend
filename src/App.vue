<script setup lang="ts">
import MonacoEditor from "./components/MonacoEditor.vue";
import { onMounted } from "vue";
import FolderTree from "./components/FolderTree.vue";
import {ref} from 'vue'
import { Plus } from '@element-plus/icons-vue'
import axios from "axios"

interface Tree {
  label: string
  children?: Tree[]
  path?:string
  isDir?:boolean
}
const treeData=ref<Tree[]>([
        {
          label: 'src',
          children: [
            {
              label: 'components',
              children: [
                {
                  label: 'FileTree.vue',
                  path: 'src/components/FileTree.vue'
                },
                {
                  label: 'FileTree2.vue',
                  path: 'src/components/FileTree2.vue'
                }
              ],
            },
          ],
        },
      ])


const text = ref('')
const selectedPath = ref('')

// 转换目录结构为树形数据
const convertToTreeData = (data: any) => {
  return data.map((item: any) => {
    const treeNode: Tree = {
      label: item.path.split('\\').pop() || '', // 仅取文件或目录的名称作为 label
      path: item.path,
    };

    if (item.is_directory && item.children && item.children.length > 0) {
      treeNode.children = convertToTreeData(item.children); // 递归处理子目录
    }else if(item.is_directory){ //空目录
      treeNode.children=[]
    }
    treeNode.isDir=item.is_directory
    //treeNode.isLeaf=item.is_directory?"leaf":""
    return treeNode;
  });
}
const getTextFromServer=function(path:string|undefined){
  if(path === undefined) return
  selectedPath.value=path
  axios({
  method: 'get',
  url: '/getTextFromPath',
  baseURL:'api/',
  headers: {
        'Accept': 'text/plain; charset=utf-8'  // 确保前端的请求头是正确的
    },
  params:{
    "path":path
  }
}).then(res => {
    console.log(res.data)
    text.value=res.data["file-text"]

}).catch(err => {
    console.log(err)
})
}
const saveTextToServer=function(text:string|undefined){
  if(text === undefined) return
  axios({
    method: 'post',
    url:'/api/saveText',
  data:{
    "path":selectedPath.value,
    "text":text
  },
  headers: {
      'Content-Type': 'application/json'
    },
}).then(res => {
    console.log(res)

}).catch(err => {
    console.log(err)
})
}
const RunJKS=function(){
  axios({
  method: 'get',
  url: '/RunJKS',
  baseURL:'api/',
  params:{
    "path":selectedPath.value
  }
}).then(res => {
    console.log(res.data)

}).catch(err => {
    console.log(err)
})
}
const getDirStructure=function(){
  axios({
  method: 'get',
  url: '/getDirStructure',
  baseURL:'api/',
  params:{
    "path":"C:\\Users\\wy156\\Desktop\\Go\\jk_robot_app_windows\\example_script\\Thread"
  }
}).then(res => {
    console.log(res.data)
    treeData.value=convertToTreeData(res.data.data)
   console.log(convertToTreeData(res.data.data))

}).catch(err => {
    console.log(err)
})
}

onMounted(() => {
  getDirStructure()
})
</script>

<template>
  <main class="container" >
    <div class="nav">
      <el-button type="" :icon="Plus" />

    </div>
    <FolderTree class="file" :data="treeData" @get-text-from-path="getTextFromServer"/>
    <MonacoEditor class="editor" :text-value="text" :path="selectedPath" @save="saveTextToServer" @run="RunJKS"/>
  </main>
</template>

<style scoped>
/* 确保视口高度从根元素继承 */
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
  font-family: Consolas, "Courier New", monospace;
  color: #d4d4d4;
}
.container {
  display: grid;
  grid-template-columns: 0.6fr 1.1fr 1.3fr;
  grid-template-rows: 0.3fr 1.7fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "nav editor editor"
    "file editor editor"
    "file editor editor";
  width: 100%;
  height: 100vh;
}

.editor {
  grid-area: editor;
}

.file {
  grid-area: file;
}
.nav { grid-area: nav;
margin: 2%;
}
</style>
