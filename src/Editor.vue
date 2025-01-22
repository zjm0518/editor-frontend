<script setup lang="ts">
import MonacoEditor from "./components/MonacoEditor.vue";
import { onMounted } from "vue";
import { ref } from "vue";
import axios from "axios";
//import TerminalComponent from "./components/TerminalComponent.vue";
//import RemoteTreeFile from "./components/RemoteTreeFile.vue";
import VsCodeSlider from "./components/vs-tree";
//import { LaySplitPanel, LaySplitPanelItem } from "@layui/layui-vue";
//import "@layui/layui-vue/es/splitPanel/index.css";
import IXterm from "./components/IXterm.vue";
import { useLayoutStore } from "./stores/layout";
import { storeToRefs } from "pinia";
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
const layoutStore = useLayoutStore();
const {showTerminal}=storeToRefs(layoutStore)
interface TreeNode {
  label: string;
  children?: TreeNode[];
  path?: string;
  isDir?: boolean;
  key?: string;
  isNew?:boolean
}

const text = ref("");
const selectedPath = ref("");
const term = ref(null);

const getTextFromServer = function (path: string | undefined) {
  if (path === undefined) return;
  selectedPath.value = path;
  axios({
    method: "get",
    url: "/getTextFromPath",
    baseURL: "api/",
    headers: {
      Accept: "text/plain; charset=utf-8", // 确保前端的请求头是正确的
    },
    params: {
      path: path,
    },
  })
    .then((res) => {
      console.log(res.data);
      text.value = res.data["file-text"];
    })
    .catch((err) => {
      console.log(err);
    });
};
const saveTextToServer = function (text: string | undefined) {
  if (text === undefined) return;
  axios({
    method: "post",
    url: "/api/saveText",
    data: {
      path: selectedPath.value,
      text: text,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
const RunJKS = function () {
  term.value.Run(selectedPath.value);
};
const Stop = function () {
  term.value.Stop();
};


onMounted(() => {
  //getDirStructure(currentFolder.value);
  //StartTTYD()
});
</script>

<template>
  <div class="container">
    <splitpanes  class="Panel" >
      <pane size="15" min-size="10">
        <div class="folder">
          <!--      <FolderTree
            class="file"
            :data="treeData"
            @get-text-from-path="getTextFromServer"
          /> -->
          <VsCodeSlider
            class="file"
            theme="dark"
            @get-text-from-path="getTextFromServer"
          ></VsCodeSlider>
        </div>
      </pane>
      <pane>
        <splitpanes  horizontal >
          <pane min-size="20">
            <MonacoEditor
              class="editor"
              :text-value="text"
              :path="selectedPath"
              @save="saveTextToServer"
              @run="RunJKS"
              @stop="Stop"
            />
          </pane>
          <pane v-if="showTerminal" min-size="20" size="30">
            <!--  <TerminalComponent class="terminal" ref="term" />  -->
             <IXterm  class="terminal" ref="term"></IXterm>


          </pane>
        </splitpanes >
      </pane>
    </splitpanes >
  </div>
</template>

<style scoped lang="scss">
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
  width: 100vw;
  display: flex;
  overflow: hidden;
  height: 100vh;
}
.Panel {
  width: 100%;
  height: 100%;
}

.folder {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.Right {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 设置为垂直排列 */
}
.Left {
  width: 100%;
}
.editor,
.terminal {
  height: 100%;
  flex-grow: 0; /* 不允许组件扩展 */
  overflow: hidden;

  margin: 0; /* 去除间隙 */
}
.editor {
  width: 100%;
  word-wrap: break-word;
  height: 100%;
}
.terminal {
  width: 100%;
  height: 100%;
}
:deep(.lay-split-panel-line) {
  background-color: #626060;
  margin: 0;
  border: 0;
}
:deep(.lay-split-panel-item) {
  border: 0;
}

:deep(.lay-split-panel-vertical){
 >.lay-split-panel-line {
  width: 100%;
  height: 3px;
  &:hover{
    border: 3px solid #626060;
    cursor: s-resize;
  }
  &:active{
    border: 3px solid #626060;
    cursor: s-resize;

  }
 }}


:deep(.lay-split-panel-horizontal){
  >.lay-split-panel-line {
  &:hover{
    border: 3px solid #626060;
    cursor: w-resize;
  }
  &:active{
    border: 3px solid #626060;
    cursor: w-resize;

  }
}
}
:deep(.splitpanes--vertical)  {
  > .splitpanes__splitter{
      min-width: 3px;
  background: #626060;
  &:hover{
    border: 3px solid #626060;
    cursor: w-resize;
  }
  &:active{
    border: 3px solid #626060;
    cursor: w-resize;

  }
  }

}
:deep(.splitpanes--horizontal)  {
  > .splitpanes__splitter{
      min-height: 3px;
  background: #626060;
  &:hover{
    border: 3px solid #626060;
    cursor: s-resize;
  }
  &:active{
    border: 3px solid #626060;
    cursor: s-resize;

  }
  }
  > .splitpanes__pane{
    transition: none;
  }

}

</style>
