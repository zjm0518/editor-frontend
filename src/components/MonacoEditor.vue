<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
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
import { completion } from "@/utils/completion";
import "@/css/fonts.css";
import { useLayoutStore } from "../stores/layout";
const layoutStore = useLayoutStore();
const props = defineProps<{
  path: string;
  isBinary: boolean;
  noData:boolean;
}>();

const emit = defineEmits<{
  (e: "change", payload: typeof editorValue.value): void;
  (e: "save"): void;
}>();
let isSettingValue = false;
const headerTabs=inject("headerTabs");
const currentTab=inject("currentTab");
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
    language: "c",
    theme: "vs-dark",
    unusualLineTerminators:"off",
    fontSize:layoutStore.editorFontSize,
    contextmenu:true,
    suggest: {
    preview: true,
  },
  });
  editor.onDidChangeModelContent(() => {

  if (!isSettingValue) {
    // 用户主动编辑内容，发出更新事件

    const currentValue = editor.getValue();
    headerTabs.value[currentTab.value].text = currentValue;
    headerTabs.value[currentTab.value].modified = true;
   ;
  }
});
  container.value?.addEventListener("keydown", saveHandler);
  monaco.languages.registerCompletionItemProvider("c",{
    provideCompletionItems:completion
  })
});
const saveHandler = (event) => {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault(); // 阻止默认的保存行为
    Save();
  }
};
function openFindWithSearchText(searchText:string) {
  editor.focus();
  //const findController = editor.getContribution('editor.contrib.findController');
  editor.trigger("find", "editor.actions.findWithArgs", { searchString: searchText,
  triggerSearch: true
  })
};
const closeFindWidget=function() {
  if(props.noData || props.isBinary) return;
  editor?.focus();
  const findController = editor?.getContribution('editor.contrib.findController');
  findController.closeFindWidget();
}
watch(
  () => {
    const tab = headerTabs.value[currentTab.value];
    return tab ? [currentTab.value, tab.path,tab.lineNumber,tab.column] : [null, null,null,null];
  },
  () => {
    const current = headerTabs.value[currentTab.value];
    if (current) {
      isSettingValue = true;
      editor.setValue(current.text);
      isSettingValue = false;


      const label = current.path.replace(/\/$/, "").split("/").pop() || "";
      monaco.editor.setModelLanguage(editor.getModel(), getFileLanguage(label));
    }
    console.log("currentTab changed", current);
    if(current?.isSearch){
      openFindWithSearchText(current.searchText);
      editor.revealPositionInCenter({ lineNumber: Number(current?.lineNumber), column: current?.column || 1 });
    }else{
      closeFindWidget();
      editor?.revealPositionInCenter({ lineNumber: 0, column: 0 });
    }
  },
  { immediate: true }
);
watch(isDark, (value) => {
  editor.updateOptions({
    theme: value ? "vs-dark" : "vs",
  });
});
watch(
  () => layoutStore.editorFontSize,
  (value) => {
    editor.updateOptions({
      fontSize: value,
    });
  }
);
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
const foldAll= function () {
  editor?.focus();
  editor?.trigger('', 'editor.foldAll',{});
};
const unfoldAll= function () {
  editor?.focus();
  editor?.trigger('', 'editor.unfoldAll',{});
};
const updateEditorValue = () => {
  const current = headerTabs.value[currentTab.value];
    if (current) {
      isSettingValue = true;
      editor.setValue(current.text);
      isSettingValue = false;


      const label = current.path.replace(/\/$/, "").split("/").pop() || "";
      monaco.editor.setModelLanguage(editor.getModel(), getFileLanguage(label));
    }

    if(current?.isSearch){
      openFindWithSearchText(current.searchText);
      editor.revealPositionInCenter({ lineNumber: Number(current?.lineNumber), column: current?.column || 1 });
    }else{
      closeFindWidget();
      editor?.revealPositionInCenter({ lineNumber: 0, column: 0 });
    }
};
defineExpose({
  getEditorValue: () => editor?.getValue() || "",
  foldAll,
  unfoldAll,
  updateEditorValue
});

</script>

<template>
  <div class="MonacoEditor">

    <div v-show="!isBinary && !noData" ref="container" class="editor-container"></div>
    <div v-show="isBinary" class="editor-binary">
      <i class="icon iconfont2  icon2-warn "></i>
      <span>Binary file, can't be displayed</span>
    </div>
    <div v-show="noData" class="editor-noData">
      <span>No Data</span>
    </div>
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
  width: 100%;


  height: calc(102% - var(--header-height));
}
.editor-binary{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: aliceblue;
  font-family: 'Courier New', Courier, monospace;
  height: 100%;
  width: 100%;
}
.editor-noData{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: aliceblue;
  font-family: 'Courier New', Courier, monospace;
  height: 100%;
  width: 100%;
}
.icon{
  font-size: 50px;
  color:rgb(238, 98, 47);
}
:deep(.monaco-editor) {
  --vscode-focusBorder: #333232;
}

</style>
