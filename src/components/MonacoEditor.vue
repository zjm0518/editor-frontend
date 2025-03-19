<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useResizeObserver, useStorage } from "@vueuse/core";

// Import monaco
// https://github.com/vitejs/vite/discussions/1791
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

import CSSWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HTMLWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TSWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {
  StorageName,
  initialEditorValue,
  useDarkGlobal,
  getFileLanguage,
} from "../utils";

import "@/css/fonts.css";

const props = defineProps<{
  path: string;
  textValue: string;
}>();

const emit = defineEmits<{
  (e: "change", payload: typeof editorValue.value): void;
  (e: "save"): void;
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

//const { activeTab,textValue } = toRefs(props)
//activeTab.value="javascript";

const editorValue = useStorage<Record<string, any>>(
  StorageName.EDITOR_VALUE,
  initialEditorValue
);

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
    language: "python",
    theme: "vs-dark",
  });


  container.value?.addEventListener("keydown", saveHandler);
});
const saveHandler = (event) => {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault(); // 阻止默认的保存行为
    Save();
  }
};
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
  container.value?.removeEventListener("keydown", saveHandler);
});

const Save = function () {
  console.log("save");
  emit("save");

};
defineExpose({
  getEditorValue: () => editor?.getValue() || "",
});
</script>

<template>
  <div class="MonacoEditor">

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

.editor-container {
  height: calc(102% - 25px);
  width: 100%;
}
:deep(.monaco-editor) {
  --vscode-focusBorder: #333232;
}
</style>
