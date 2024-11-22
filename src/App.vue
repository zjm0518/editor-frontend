<script setup lang="ts">
import MonacoEditor from "./components/MonacoEditor.vue";
import FileExplorer from "./components/FileExplorer.vue";
import FolderTree from "./components/FolderTree.vue";
import {ref} from 'vue'
import { useFileStore } from "./store";
interface Tree {
  label: string
  children?: Tree[]
  value?:string
}
const data:Tree[]=[
        {
          label: 'src',
          children: [
            {
              label: 'components',
              children: [
                {
                  label: 'FileTree.vue',
                  value: '<script setup lang="ts">'
                },
                {
                  label: 'FileTree2.vue',
                  value: '\ninterface Tree {\nlabel: string\nchildren?: Tree[]\nvalue?:string\n}'
                }
              ],
            },
          ],
        },
        {
          label: 'Level one 2',
          children: [
            {
              label: 'Level two 2-1',
              children: [
                {
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              label: 'Level two 2-2',
              children: [
                {
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
        {
          label: 'Level one 3',
          children: [
            {
              label: 'Level two 3-1',
              children: [
                {
                  label: 'Level three 3-1-1',
                },
              ],
            },
            {
              label: 'Level two 3-2',
              children: [
                {
                  label: 'Level three 3-2-1',
                },
              ],
            },
          ],
        },
      ]
//const filestore=useFileStore()
const text = ref('')
const changeTextValue=function(textvalue,treenode){
  console.log('changeTextValue:',textvalue,treenode)
  text.value=textvalue;
}
</script>

<template>
  <main class="container" >
    <FolderTree :data="data" @tchange="changeTextValue"/>
    <MonacoEditor class="editor" :text-value="text"/>
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
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "file editor editor"
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
</style>
