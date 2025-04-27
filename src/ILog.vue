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

        <pane size="75" min-size="40">
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
import { ref ,watchEffect} from "vue";
import { useLayoutStore } from "./stores/layout";
const text = ref("");
const selectedPath = ref("");
const layoutStore = useLayoutStore();
watchEffect(() => {
  document.documentElement.style.setProperty("--header-height", layoutStore.headerHeight);
  document.documentElement.style.setProperty("--tab-fontsize", layoutStore.tabFontSize);
  document.documentElement.style.setProperty("--split-zone", layoutStore.touchZone);
  document.documentElement.style.setProperty("--header-font-size", layoutStore.headerFontSize);
});

import "@/css/splitpanes.css"
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


</style>
