<template>
  <div class="container">
    <splitpanes class="Panel">
      <pane size="25" min-size="15">
        <div class="folder">
          <VsCodeSliderLog
            class="file"
            theme="light"
            @get-text-from-path="getTextFromServer"
          ></VsCodeSliderLog>
        </div>
      </pane>

        <pane min-size="40">
          <MonacoEditorLog
            class="logeditor"
            :text-value="text"
            :path="selectedPath"
          />
        </pane>

    </splitpanes>
  </div>
</template>
<script setup lang="ts">
import { Splitpanes, Pane } from "splitpanes";
import VsCodeSliderLog from "./components/vs-tree-log/VsCodeSliderLog.vue";
import MonacoEditorLog from "./components/MonacoEditorLog.vue";
import {getTextFromPath} from "./api/path";
import { ref } from "vue";
const text = ref("");
const selectedPath = ref("");
const getTextFromServer = function (path: string | undefined) {
  if (path === undefined) return;
  selectedPath.value = path;
  getTextFromPath({
      path: path,
    },
  )
    .then((res) => {

      text.value = res["file-text"];
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
<style scoped>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f2f2f2;
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
.logeditor,
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
  background-color: #d0cece;
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
    border: 3px solid #d6d6d6;
    cursor: s-resize;
  }
  &:active{
    border: 3px solid #b8b5b5;
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
  background: #cac8c8;
  &:hover{
    border: 3px solid #c0bebe;
    cursor: w-resize;
  }
  &:active{
    border: 3px solid #c0bebe;
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
