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
import JKSLibButton from "./JKSLibButton2.vue";

import { setJKSScriptPath, getJKSScriptPath } from "@/api/path";
const props = defineProps<{
  path: string;
  textValue: string;
}>();

const emit = defineEmits<{
  (e: "change", payload: typeof editorValue.value): void;
  (e: "save", text: string): void;
  (e: "run"): void;
  (e: "stop"): void;
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
    //theme: isDark.value ? 'vs-dark' : 'vs',
    theme: "vs-dark",
  });


  getJKSScriptPath().then((res) => {
    jksLibPath.value = res["jks_script_path"];
  });

  container.value?.addEventListener("keydown", saveHandler);
});
const saveHandler=(event) => {
        if (event.ctrlKey && event.key === "s") {
          event.preventDefault(); // 阻止默认的保存行为
          Save();
          saved.value="已保存"
          setTimeout(()=>{
            saved.value=""

          },2000)
        }
      }
watch(
  () => props.textValue,
  (newvalue, oldValue) => {
    if (typeof newvalue === "undefined") {
    } else {
      console.log("in monaco editor,text change");
      editor.setValue(newvalue);
      let label=props.path.replace(/\/$/, ""); // 去掉末尾的 \\
      label=label.split("/").pop() || "";
      console.log("language",getFileLanguage(label))
      monaco.editor.setModelLanguage(editor.getModel(),getFileLanguage(label))
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
  container.value?.removeEventListener("keydown",saveHandler)
});

const Save = function () {
  console.log("save");
  emit("save", editor.getValue());
};
const Run = function () {
  console.log("run");
  emit("run");
};
const Stop = function () {
  console.log("stop");
  emit("stop");
};
const jksLibPath = ref<string>("");
const getLibPath = function (libPath: string) {
  libPath = libPath.replace(/\\$/, ""); // 去掉末尾的 \\
  const postdata = {
    jks_script_path: libPath,
  };
  setJKSScriptPath(postdata).then((res) => {
    jksLibPath.value = libPath;
  });
};
const saved=ref("")
</script>

<template>
  <div class="MonacoEditor">
    <div class="header">
      <div class="header-left">
        <i
          class="icon iconfont2 icon2-baocun"
          title="保存文件"
          @click="Save"
        ></i>
        <i class="icon iconfont2 icon2-yunhang" title="运行" @click="Run"></i>
        <i class="icon iconfont2 icon2-tingzhi" title="停止" @click="Stop"></i>
        <i >{{ saved }}</i>
      </div>
      <div class="header-right">
        <span class="jks-lib" title="脚本库路径">{{ jksLibPath }}</span>
        <JKSLibButton @select-lib="getLibPath"></JKSLibButton>
      </div>
    </div>

    <div ref="container" style="height: 94%"></div>
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
  height: 7%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  background-color: #333232;
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
</style>
