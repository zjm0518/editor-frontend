<script setup lang="ts">
import MonacoEditor from "./components/MonacoEditor.vue";
import { onMounted } from "vue";
import { ref } from "vue";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import TerminalComponent from "./components/TerminalComponent.vue";
import RemoteTreeFile from "./components/RemoteTreeFile.vue";
import VsCodeSlider from "./components/vs-tree";
import { LaySplitPanel, LaySplitPanelItem } from "@layui/layui-vue";
import "@layui/layui-vue/es/splitPanel/index.css";
import IXterm from "./components/IXterm.vue";

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
    <lay-split-panel class="Panel" :min-size="200">
      <lay-split-panel-item :space="300">
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
      </lay-split-panel-item>
      <lay-split-panel-item>
        <lay-split-panel :vertical="true" :min-size="150">
          <lay-split-panel-item :space="400">
            <MonacoEditor
              class="editor"
              :text-value="text"
              :path="selectedPath"
              @save="saveTextToServer"
              @run="RunJKS"
              @stop="Stop"
            />
          </lay-split-panel-item>
          <lay-split-panel-item>
            <!--  <TerminalComponent class="terminal" ref="term" />  -->
             <IXterm  class="terminal" ref="term"></IXterm>
            <!-- <lay-split-panel>
              <lay-split-panel-item>
                <IXterm  class="terminal" ref="term"></IXterm>
              </lay-split-panel-item>
            </lay-split-panel> -->

          </lay-split-panel-item>
        </lay-split-panel>
      </lay-split-panel-item>
    </lay-split-panel>
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
  height: 2px; /* 垂直分隔线的初始高度 */
  &:hover{
    border: 3px solid #626060;
    cursor: s-resize;
  }
  &:active{
    border: 3px solid #626060;
    cursor: s-resize;

  }
}
}


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

</style>
