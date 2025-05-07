<template>
  <div class="container">
    <splitpanes class="Panel">
      <pane size="25" min-size="15">
        <div class="folder">
          <VsCodeSliderLog
            class="file"
            theme="light"
            @get-text-from-path="getTextFromServer"
            @export-log-x-l-s-x="exportLog"
          ></VsCodeSliderLog>
        </div>
      </pane>

        <pane size="75" min-size="40">
          <MonacoEditorLog
            class="logeditor"
            :text-value="text"
            :path="selectedPath"
            ref="monacologeditor"
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
const monacologeditor = ref<InstanceType<typeof MonacoEditorLog> | null>(null);
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

import * as XLSX from 'xlsx';

function parseLog(logText:string,label:string) {
  const lines = logText.split('\n');
  const data = [["日期", "时间", "内容"]];

  lines.forEach(line => {
    const parts = line.split('#');
    if (parts.length >= 3) {
      const part1 = parts[0].trim(); // 第一个 #
      const part2 = parts[1].trim(); // 第二个 #
      const part3 = parts.slice(2).join('#').trim(); // 剩余部分，避免内容里有 #

      data.push([part1, part2, part3]);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "日志");

  XLSX.writeFile(workbook, label+".xlsx", { compression: true });
}
function exportLog(label:string) {
  const logtext: string | undefined=monacologeditor.value.getLogEditorValue()

  parseLog(logtext,label)
}
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
