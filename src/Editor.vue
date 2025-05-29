<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import MonacoEditor from "./components/MonacoEditor.vue";

import { provide, ref, computed, watch, onMounted, watchEffect } from "vue";
import axios from "axios";
//import TerminalComponent from "./components/TerminalComponent.vue";
//import RemoteTreeFile from "./components/RemoteTreeFile.vue";
import VsCodeSlider from "./components/vs-tree";
//import { LaySplitPanel, LaySplitPanelItem } from "@layui/layui-vue";
//import "@layui/layui-vue/es/splitPanel/index.css";
import IXterm from "./components/IXterm.vue";
import { useLayoutStore } from "./stores/layout";
import { storeToRefs } from "pinia";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import "./css/terminal.css"
import "./css/editor-tab.css"
import "./css/splitpanes.css"

import { setJKSScriptPath, getJKSScriptPath,getOpenVscode } from "@/api/path";
import { v4 as uuidv4 } from "uuid";
import JKSLibButton from "./components/JKSLibButton2.vue";
const layoutStore = useLayoutStore();
const { TerminalSize } = storeToRefs(layoutStore);


const text = ref("");
const isBinary = ref(false);  // 是否是二进制文件
const selectedPath = ref("");

const getTextFromServer = function (path: string | undefined) {
  if (path === undefined) return;
  selectedPath.value = path;
  const tabIndex = headerTabs.value.findIndex(tab => tab.path === path);
  if(tabIndex != -1){
    currentTab.value=tabIndex;
    isBinary.value=false;
    return;
  }
  axios({
    method: "get",
    url: "/getTextFromPath",
    baseURL: "api/",
    headers: {
      Accept: "text/plain;", // 确保前端的请求头是正确的
    },
    params: {
      path: path,
    },
  })
    .then((res) => {
      console.log(res);
      isBinary.value = res.data["is-binary"];
      if (isBinary.value) {
        text.value = "";
        return;
      }
      text.value = res.data["file-text"];


      if (tabIndex === -1) {
        headerTabs.value.push({
          name: path.split("\\").pop() || "",
          path: path,
          text: text.value,
          modified: false,
        });
        currentTab.value = headerTabs.value.length - 1;

      }
      //console.log("headerTabs", headerTabs.value)
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteFile=function(path:string,isDir:boolean){
  //console.log("deleteFile",path,isDir)
  if(path=="" ||!path ) return;
    path = path.replace(/\//g, "\\");

    if(isDir){
       // 统一目录路径格式，确保以 \ 结尾，避免误删同名文件或目录
       if (!path.endsWith("\\")) {
            path += "\\";
        }

        // 找出所有在该目录下的 tab
        const indicesToDelete: number[] = [];
        headerTabs.value.forEach((item, index) => {
            if (item.path.startsWith(path)) {
                indicesToDelete.push(index);
            }
        });

        // 倒序删除，避免 index 混乱
        for (let i = indicesToDelete.length - 1; i >= 0; i--) {
            console.log(indicesToDelete[i])
            deleteTab(indicesToDelete[i]);
        }
    }else{
      const headerTabIndex = headerTabs.value.findIndex(item => item.path == path);
      console.log("headerTabIndex",headerTabIndex)
      if(headerTabIndex!=-1) {
        deleteTab(headerTabIndex);
      }
    }
}
const saveTextToServer = function () {
  console.log("selectedPath.value",selectedPath.value)
  const text: string | undefined=monacoeditor.value.getEditorValue()
  if (text === undefined || selectedPath.value=="") return;
  axios({
    method: "post",
    url: "/api/saveText",
    data: {
      path: headerTabs.value[currentTab.value].path,
      text: text,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);
      headerTabs.value[currentTab.value].modified = false;
      saved.value = "已保存";
  setTimeout(() => {
    saved.value = "";
  }, 2000);
    })
    .catch((err) => {
      console.log(err);
      saved.value = "保存失败";
  setTimeout(() => {
    saved.value = "";
  }, 2000);
    });
};
const RunJKS = function () {
  const groupIndex = groupPanes.value.findIndex(group => group.groupId === currentGroupId.value);
  const paneIndex = groupPanes.value[groupIndex].panes.findIndex(pane => pane.sessionId === currentSessionID.value);
  console.log("RunJKS", groupIndex, paneIndex)
  xtermRefs.value[groupIndex][paneIndex].Run(selectedPath.value);
};
const Stop = function () {
  const groupIndex = groupPanes.value.findIndex(group => group.groupId === currentGroupId.value);
  const paneIndex = groupPanes.value[groupIndex].panes.findIndex(pane => pane.sessionId === currentSessionID.value);

  xtermRefs.value[groupIndex][paneIndex].Stop();
};
const selectedTerm = ref(0);
const toggleTerm = function (index: number) {
  selectedTerm.value = index;
};
interface TabPane {
  name: string,
  sessionId: string

}
interface GroupPane {
  groupId: string,
  panes: Array<TabPane>
}
const terminalNum = ref(6)

const groupPanes = ref<Array<GroupPane>>([])
onMounted(() => {
  const groupPanesStr = localStorage.getItem("GroupPanes");
  if (groupPanesStr) {
    groupPanes.value = JSON.parse(groupPanesStr);
    currentName.value = localStorage.getItem("currentName") || "";
  currentGroupId.value = localStorage.getItem("currentGroupId") || "";
  currentSessionID.value = localStorage.getItem("currentSessionID") || "";
  if(currentName.value==""||currentGroupId.value==""||currentSessionID.value==""){
    currentName.value=groupPanes.value[0].panes[0].name
    currentGroupId.value=groupPanes.value[0].groupId
    currentSessionID.value=groupPanes.value[0].panes[0].sessionId
  }
  } else {
    groupPanes.value.push({
      groupId: uuidv4(),
      panes: [{
        name: "term1",
        sessionId: uuidv4()
      }]
    });
    localStorage.setItem("GroupPanes", JSON.stringify(groupPanes.value));
    terminalNum.value = 1
    currentName.value = "term1"
    currentGroupId.value = groupPanes.value[0].groupId
    currentSessionID.value = groupPanes.value[0].panes[0].sessionId
    localStorage.setItem("currentGroupId", currentGroupId.value);
    localStorage.setItem("currentName", currentName.value);
    localStorage.setItem("currentSessionID", currentSessionID.value);
  }

  window.addEventListener("resize", updateWindowSize);
  updateWindowSize(); // 初始化时更新一次

  getJKSScriptPath().then((res) => {
    jksLibPath.value = res["jks_script_path"];
  });


  addTouchListeners()
})

// 监听窗口变化并更新 Pinia 状态
const updateWindowSize = () => {
  layoutStore.updateSize();
};
const currentName = ref("")
const currentGroupId = ref("")
const currentSessionID = ref("")
// 计算当前 groupId 在 groupPanes 中的索引
const groupIndex = computed(() => {
  return groupPanes.value.findIndex(group => group.groupId === currentGroupId.value);
});
provide("currentName", currentName)
provide("currentGroupId", currentGroupId)
const setCurrentName = function (name: string) {
  currentName.value = name
}
const setCurrentGroupId = function (groupid: string, name: string, sessionId: string) {
  currentGroupId.value = groupid
  currentName.value = name

  currentSessionID.value = sessionId
  localStorage.setItem("currentGroupId", currentGroupId.value);
  localStorage.setItem("currentName", currentName.value);
  localStorage.setItem("currentSessionID", currentSessionID.value);
}
const addSplitPane = function (groupId: string, sessionId: string) {
  terminalNum.value++;
  const groupIndex = groupPanes.value.findIndex(group => group.groupId === groupId);
  if (groupIndex === -1) {
    console.error(`Group ${groupId} not found`);
    return;
  }
  const sessionIndex = groupPanes.value[groupIndex].panes.findIndex(pane => pane.sessionId === sessionId);
  if (sessionIndex === -1) {
    console.error(`Session ${sessionId} not found in group ${groupId}`);
    return;
  }
  groupPanes.value[groupIndex].panes.splice(sessionIndex + 1, 0, {
    name: `term${terminalNum.value}`,
    sessionId: uuidv4()
  });
  localStorage.setItem("GroupPanes", JSON.stringify(groupPanes.value));


}
const addGroupPane = function () {
  terminalNum.value++
  const groupId = uuidv4();
  groupPanes.value.push({
    groupId: groupId,
    panes: [{
      name: `term${terminalNum.value}`,
      sessionId: uuidv4()
    }]
  });
  localStorage.setItem("GroupPanes", JSON.stringify(groupPanes.value));
}
watch(currentGroupId, (newVal) => {
  console.log("currentGroupId changed:", newVal);
});
const deletePane = async function (groupId: string, sessionId: string) {



  const groupIndex = groupPanes.value.findIndex(group => group.groupId === groupId);
  const paneIndex = groupPanes.value[groupIndex].panes.findIndex(pane => pane.sessionId === sessionId);
  console.log(groupIndex, paneIndex)
  // If only one pane left, don't delete
  if (groupPanes.value.length === 1 && groupPanes.value[groupIndex].panes.length == 1) return;
  // Destroy the terminal instance
  console.log(xtermRefs.value[groupIndex][paneIndex])
  await xtermRefs.value[groupIndex][paneIndex].Destroy();

  // Remove the pane
  groupPanes.value[groupIndex].panes.splice(paneIndex, 1);

  // If this group becomes empty after deletion, remove the group
  if (groupPanes.value[groupIndex].panes.length === 0) {
    groupPanes.value.splice(groupIndex, 1);

    // Set currentGroupId to previous group
    const newGroupIndex = Math.max(0, groupIndex - 1);
    const newGroup = groupPanes.value[newGroupIndex];
    currentGroupId.value = newGroup.groupId;
    currentName.value = newGroup.panes[0].name;
    currentSessionID.value = newGroup.panes[0].sessionId
  } else {
    currentName.value = groupPanes.value[groupIndex].panes[0].name;
    currentSessionID.value = groupPanes.value[groupIndex].panes[0].sessionId
  }

  localStorage.setItem("GroupPanes", JSON.stringify(groupPanes.value));
  localStorage.setItem("currentGroupId", currentGroupId.value);
  localStorage.setItem("currentName", currentName.value);
  localStorage.setItem("currentSessionID", currentSessionID.value);

}

const xtermRefs = ref([]); // 存储 IXterm 的引用

// 更新 xtermRefs 引用列表
const setXtermRef = async (el, groupIndex, index) => {
  //await nextTick()
  if (el) {
    if (!xtermRefs.value[groupIndex]) {
      xtermRefs.value[groupIndex] = [];
    }
    xtermRefs.value[groupIndex][index] = el;
  } else {
    console.log("el is null")
    xtermRefs.value[groupIndex].splice(index, 1);
  }
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


const saved = ref("");
const monacoeditor=ref(null);
interface TabLabel {
  name:string,
  path:string,
  text:string,
  modified:boolean

}
const headerTabs=ref<Array<TabLabel>>([])
const currentTab=ref(0)
provide("headerTabs", headerTabs)
provide("currentTab", currentTab)
const deleteTab=function(index:number){
  console.log("deleteTab",index,currentTab.value)
  if(index==0 && headerTabs.value.length==1){
    currentTab.value=0;
    headerTabs.value.splice(index,1)
    text.value="";
    //是否需要修改selectedPath.value

  }else if(index<currentTab.value){

    headerTabs.value.splice(index,1)
    currentTab.value=currentTab.value-1
    selectedPath.value=headerTabs.value[currentTab.value].path
    //getTextFromServer(selectedPath.value)
  }else if(index>currentTab.value){
    headerTabs.value.splice(index,1)
    selectedPath.value=headerTabs.value[currentTab.value].path
    //getTextFromServer(selectedPath.value)
  }else{
    headerTabs.value.splice(index,1)
    if(currentTab.value>headerTabs.value.length-1){
      currentTab.value=currentTab.value-1
    }
    selectedPath.value=headerTabs.value[currentTab.value].path
    //getTextFromServer(selectedPath.value)
  }
}
provide("selectedPath", selectedPath)
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

watchEffect(() => {
  document.documentElement.style.setProperty("--header-height", layoutStore.headerHeight);
  document.documentElement.style.setProperty("--tab-fontsize", layoutStore.tabFontSize);
  document.documentElement.style.setProperty("--split-zone", layoutStore.touchZone);

});



const addTouchListeners=function() {
      const splitters = document.querySelectorAll('.splitpanes__splitter')
      splitters.forEach(splitter => {
        splitter.addEventListener('touchstart', handleTouchStart, { passive: false })
        splitter.addEventListener('touchmove', handleTouchMove, { passive: false })
        splitter.addEventListener('touchend', handleTouchEnd)
      })
    }
const handleTouchStart=function(e) {
      e.preventDefault()
      const touch = e.touches[0]
      simulateMouseEvent('mousedown', touch)
    }
const handleTouchMove=function(e) {
      e.preventDefault()
      const touch = e.touches[0]
      simulateMouseEvent('mousemove', touch)
    }
const handleTouchEnd=function(e) {
      simulateMouseEvent('mouseup', e.changedTouches[0])
    }
const simulateMouseEvent=function(type, touch) {
      const evt = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY
      })
      const target = document.elementFromPoint(touch.clientX, touch.clientY)
      if (target) target.dispatchEvent(evt)
    }
const simplebarRef=ref(null);
const addFontSize=function(){
  layoutStore.AddEditorFontSize()
}
const reduceFontSize=function(){
  layoutStore.SubEditorFontSize()
}
const switchHeaderTab=function(index){
  currentTab.value = index;
  selectedPath.value = headerTabs.value[index].path;
  isBinary.value=false;

}
const VscodeSliderRef = ref(null);
const openVscode=function(){
  //getOpenVscode({path:selectedPath.value})
  getOpenVscode({path:VscodeSliderRef.value.currentFolder})
}
</script>

<template>
  <div class="container">
    <splitpanes class="Panel">
      <pane size="20" min-size="10">
        <div class="folder">
          <VsCodeSlider class="file" theme="dark" @get-text-from-path="getTextFromServer" @delete-file="deleteFile" ref="VscodeSliderRef"> </VsCodeSlider>
        </div>
      </pane>
      <pane>
        <splitpanes horizontal>

          <pane min-size="20" :size="100-TerminalSize">
            <div class="header" :style="{ height: layoutStore.headerHeight }">
              <div class="header-left" :style="{ fontSize: layoutStore.headerFontSize }">
                <i class="icon iconfont2 icon2-baocun" title="保存文件" @click="saveTextToServer" :class="{ disabled: isBinary || headerTabs.length==0 }"></i>
                <i class="icon iconfont2 icon2-yunhang" title="运行" @click="RunJKS" :class="{ disabled: isBinary || headerTabs.length==0 }"></i>
                <i class="icon iconfont2 icon2-tingzhi" title="停止" @click="Stop" :class="{ disabled: isBinary || headerTabs.length==0 }"></i>
                <i class="icon iconfont2 icon2-zitifangda" title="字体放大" @click="addFontSize" :class="{ disabled: isBinary || headerTabs.length==0 }"></i>
                <i class="icon iconfont2 icon2-zitisuoxiao" title="字体放大" @click="reduceFontSize" :class="{ disabled: isBinary || headerTabs.length==0 }"></i>


                <span class="mark-saved" >{{ saved }}</span>
              </div>
              <simplebar data-simplebar-auto-hide="true" class="header-tabs" ref="simplebarRef">

                <div class="header-tabs-item" v-for="(item,index) in headerTabs" :key="index"
                  :class="{ 'Tabselected': item.path == selectedPath }" @click="switchHeaderTab(index)" >

                    <span class="header-tabs-item-name">{{ item.name }}</span>
                    <i class="iconfont2 icon2-weibaocun unsaved" title="未保存" v-if="item.modified"></i>
                    <i class="iconfont2 icon2-guanbi1 close" @click.stop="deleteTab(index)" title="Close"></i>
                </div>

                </simplebar>
              <div class="header-right">
                <span class="jks-lib" :title="jksLibPath"  :style="{ fontSize: layoutStore.headerFontSize }">{{ jksLibPath }}</span>
                <JKSLibButton @select-lib="getLibPath" :fontsize="layoutStore.headerFontSize"></JKSLibButton>
                <i class="icon iconfont2 icon2-vscode1" title="打开vscode" @click="openVscode"></i>

              </div>
            </div>

            <MonacoEditor class="editor" :is-binary="isBinary" :path="selectedPath" @save="saveTextToServer"
            ref="monacoeditor" :no-data="headerTabs.length==0" />
          </pane>

          <pane  :size="TerminalSize">
            <div class="header-bar" :style="{ height: layoutStore.terminalHeaderHeight,fontSize:layoutStore.headerFontSize }">
              <i v-if="layoutStore.showTerminal" class="iconfont2 icon2-plus" title="New terminal" @click="addGroupPane"></i>
              <i class="icon iconfont2 " :class="layoutStore.showTerminal
                    ? 'icon2-ego-close'
                    : 'icon2-bottom_panel_open'
                  " title="终端" @click="layoutStore.toggleShell()"></i>
            </div>
            <splitpanes>
              <pane min-size="70" size="80">

                <splitpanes v-for="(group, groupIndex) in groupPanes" :key="group.groupId"
                  v-show="group.groupId == currentGroupId">
                  <pane v-for="(item, index) in group.panes" :key="item.sessionId" min-size="20">
                    <IXterm class="terminal" :session-i-d="item.sessionId" :index="index" :name="item.name"
                      :group-i-d="group.groupId" @select-index="toggleTerm"
                      :ref="(el) => setXtermRef(el, groupIndex, index)"
                     >
                    </IXterm>
                  </pane>
                </splitpanes>

              </pane>

              <pane size="20" min-size="10">
                <div class="tab-nav">
                  <div class="tab-nav-group" v-for="(group, groupIndex) in groupPanes" :key="group.groupId">
                    <div class="tab-nav-item" :class="{ 'selected': item.sessionId == currentSessionID }"
                      v-for="(item, index) in group.panes" :key="item.sessionId"
                      @click="setCurrentGroupId(group.groupId, item.name, item.sessionId)">
                      <div class="tab-nav-item-left">
                        <i v-if="index == 0 && group.panes.length > 1" class="iconfont2 icon2-lianjiexian1"></i>
                        <i v-if="index != 0 && index != group.panes.length - 1" class="iconfont2 icon2-lianjiexian"></i>
                        <i v-if="index == group.panes.length - 1 && group.panes.length > 1"
                          class="iconfont2 icon2-lianjiexian2"></i>

                        <div class="codicon codicon-terminal-powershell"></div>
                        <div class="termname">{{ item.name }}

                        </div>

                      </div>
                      <div class="tab-nav-item-right">
                        <i class="iconfont2 icon2-square_split_x"
                          @click.stop="addSplitPane(group.groupId, item.sessionId)" title="Split"></i>
                        <i class="iconfont2 icon2-delete" @click.stop="deletePane(group.groupId, item.sessionId)"
                          title="Kill"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </pane>
            </splitpanes>
          </pane>
        </splitpanes>

      </pane>
    </splitpanes>
  </div>
</template>

<style scoped >
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
  flex-direction: column;
  /* 设置为垂直排列 */
}

.Left {
  width: 100%;
}

.editor,
.terminal {

  flex-grow: 0;
  /* 不允许组件扩展 */
  overflow: hidden;

  margin: 0;
  /* 去除间隙 */
}

.editor {
  width: 100%;
  word-wrap: break-word;
  height: 100%;
}

.terminal {
  width: 100%;
  height: calc(100% - var(--header-height));
}


:deep(.el-button){
  background-color: #dcdcdc;
  --el-button-border-color : #dcdcdc;
}


</style>
