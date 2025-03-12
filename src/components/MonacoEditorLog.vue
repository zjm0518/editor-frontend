<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";

// Import monaco
// https://github.com/vitejs/vite/discussions/1791
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

import CSSWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HTMLWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TSWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {
  useDarkGlobal,
  getFileLanguage,
} from "../utils";
import { useLayoutStore } from "@/stores/layout";
import "@/css/fonts.css";
const layoutStore = useLayoutStore();
const props = defineProps<{
  path: string;
  textValue: string;
}>();


self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "json") return new JSONWorker();

    if (label === "css" || label === "scss" || label === "less")
      return new CSSWorker();

    if (label === "html" || label === "handlebars" || label === "razor")
      return new HTMLWorker();

    if (label === "typescript" || label === "javascript") return new TSWorker();

    return new EditorWorker();
  },
};

const container = ref<HTMLDivElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor;

const isDark = useDarkGlobal();


onMounted(() => {
  editor = monaco.editor.create(container.value!, {
    readOnly: true,
    domReadOnly: true,
  });

  monaco.editor.defineTheme("myTheme", {
	base: "vs",
	inherit: true,
	rules: [],
	colors: {
		"editor.foreground": "#000000",
		"editor.background": "#f2f2f2",
		"editorCursor.foreground": "#8B0000",
		"editorLineNumber.foreground": "#008800",
		"editor.selectionBackground": "#88000030",
		"editor.inactiveSelectionBackground": "#88000015",
	},
});
monaco.editor.setTheme("myTheme");
});

watch(
  () => props.textValue,
  (newvalue, oldValue) => {
    if (typeof newvalue === "undefined") {
    } else {
      console.log("in monaco editor,text change");
      editor.setValue(newvalue);
      let label = props.path.replace(/\/$/, ""); // 去掉末尾的 \\
      label = label.split("/").pop() || "";
      console.log("language", getFileLanguage(label));
      monaco.editor.setModelLanguage(editor.getModel(), getFileLanguage(label));
    }
  }
);
watch(isDark, (value) => {
  editor.updateOptions({
    theme: value ? "vs-dark" : "vs",
  });
});

const editorObserver = useResizeObserver(container, () => {
  editor.layout();
});

onUnmounted(() => {
  editor?.dispose();
  editorObserver.stop();
});

</script>

<template>
  <div class="MonacoEditor">
    <div class="header">
      <div class="header-left">

      </div>
      <div class="header-right">

      </div>
    </div>

    <div ref="container" class="editor-container"></div>
  </div>
</template>

<style scoped>
.MonacoEditor {
  height: 100%;
  width: 100%;

}
:deep(el-button) {
  height: 50%;
  width: 100%;
}
.header {
  height: 25px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  background-color: #f2f2f2;

  color: #fff;
}
.header .header-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
}
.header .header-left i {
  font-size: 16px;
  margin-right: 15px; /* 可以根据需要调整间距 */
  cursor: pointer;
}

.header .header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.jks-lib {
  font-size: 13px;
  margin-right: 15px; /* 可以根据需要调整间距 */
  font-family: Consolas, "Courier New", monospace;
}
.editor-container {
  height: calc(102% - 25px);
  width: 100%;
}
:deep(.monaco-editor) {
  --vscode-focusBorder: #f2f2f2;
}
</style>
