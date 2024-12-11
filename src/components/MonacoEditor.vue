<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useResizeObserver, useStorage } from '@vueuse/core'

// Import monaco
// https://github.com/vitejs/vite/discussions/1791
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { StorageName, initialEditorValue, useDarkGlobal } from '../utils'

const props = defineProps<{
  path: string
  textValue: string
}>()

const emit
  = defineEmits<{
  (e: 'change', payload: typeof editorValue.value) : void
  (e: 'save' , text:string) : void
  (e: 'run') : void
  (e: 'stop') : void
   } >()

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
     if (label === 'json')
      return new JSONWorker()

    if (label === 'css' || label === 'scss' || label === 'less')
      return new CSSWorker()

    if (label === 'html' || label === 'handlebars' || label === 'razor')
      return new HTMLWorker()

    if (label === 'typescript' || label === 'javascript')
      return new TSWorker()

    return new EditorWorker()
  },
}

const container = ref<HTMLDivElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor

const isDark = useDarkGlobal()

//const { activeTab,textValue } = toRefs(props)
//activeTab.value="javascript";


const editorValue = useStorage<Record<string, any>>(
  StorageName.EDITOR_VALUE,
  initialEditorValue,
)

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
    language: 'python',
    //theme: isDark.value ? 'vs-dark' : 'vs',
    theme: 'vs-dark',
  })

  emit('change', editorValue.value)
})


watch(()=>props.textValue,(newvalue,oldValue)=>{
  if(typeof newvalue === 'undefined'){

  }else{
    console.log("in monaco editor,text change")
    editor.setValue(newvalue)
  }

})
watch(isDark, (value) => {
  editor.updateOptions({
    theme: value ? 'vs-dark' : 'vs',
  })
})

const editorObserver = useResizeObserver(container, () => {
  editor.layout()
})

onUnmounted(() => {
  editor?.dispose()
  editorObserver.stop()
})

const Save=function(){
  console.log("save")
  emit('save',editor.getValue())
}
const Run=function(){
  console.log("run")
  emit('run')
}
const Stop=function(){
  console.log("stop")
  emit('stop')
}
</script>

<template>
  <div class="MonacoEditor">
    <div style="height: 7%;width: 100%">
      <el-button class="save" @click="Save" >Save</el-button>
      <el-button class="run" @click="Run">Run</el-button>
      <el-button class="stop" @click="Stop">Stop</el-button>
    </div>

    <div ref="container" style="height: 93%;"></div>
  </div>

</template>


<style scoped>
.MonacoEditor{
  height: 100%;
  width: 100%;
}
:deep(el-button){
  height: 50%;
  width: 100%;
}

</style>
