<script setup lang="ts">
import MonacoEditor from "./components/MonacoEditor.vue";
import { onMounted } from "vue";
import FolderTree from "./components/FolderTree.vue";
import { ref } from "vue";
import axios from "axios";

import TerminalComponent from "./components/TerminalComponent.vue";
import RemoteTreeFile from "./components/RemoteTreeFile.vue";

import { LaySplitPanel, LaySplitPanelItem } from "@layui/layui-vue";
import "@layui/layui-vue/es/splitPanel/index.css";
interface Tree {
  label: string;
  children?: Tree[];
  path?: string;
  isDir?: boolean;
}
const treeData = ref<Tree[]>([
  {
    label: "src",
    children: [
      {
        label: "components",
        children: [
          {
            label: "FileTree.vue",
            path: "src/components/FileTree.vue",
          },
          {
            label: "FileTree2.vue",
            path: "src/components/FileTree2.vue",
          },
        ],
      },
    ],
  },
]);

const text = ref("");
const selectedPath = ref("");
const term = ref(null);

// 转换目录结构为树形数据
const convertToTreeData = (data: any) => {
  return data.map((item: any) => {
    const path = item.path.replace(/\\$/, ""); // 去掉末尾的 \\
    const treeNode: Tree = {
      label: path.split("\\").pop() || "", // 仅取文件或目录的名称作为 label
      path: item.path,
    };

    if (item.is_directory && item.children && item.children.length > 0) {
      treeNode.children = convertToTreeData(item.children); // 递归处理子目录
    } else if (item.is_directory) {
      //空目录
      treeNode.children = [];
    }
    treeNode.isDir = item.is_directory;
    //treeNode.isLeaf=item.is_directory?"leaf":""
    return treeNode;
  });
};
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
  /*  axios({
  method: 'get',
  url: '/RunJKS',
  baseURL:'api/',
  params:{
    "path":selectedPath.value
  }
}).then(res => {
    console.log(res.data)

}).catch(err => {
    console.log(err)
}) */
  term.value.Run(selectedPath.value);
};
const Stop = function () {
  term.value.Stop();
};
const getDirStructure = function (path: string) {
  axios({
    method: "get",
    url: "/getDirStructure",
    baseURL: "api/",
    params: {
      path: path,
    },
  })
    .then((res) => {
      console.log(res);
      treeData.value = convertToTreeData(res.data.data);
      console.log(convertToTreeData(res.data.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
const StartTTYD = function () {
  axios({
    method: "get",
    url: "/StartTTYD",
    baseURL: "api/",
    params: {
      path: "C:\\Users\\wy156\\Desktop\\Go\\jk_robot_app_windows\\example_script\\Thread",
    },
  })
    .then((res) => {
      console.log(res.data);
      treeData.value = convertToTreeData(res.data.data);
      console.log(convertToTreeData(res.data.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  getDirStructure(
    "C:\\Users\\wy156\\Desktop\\Go\\jk_robot_app_windows\\example_script\\Thread"
  );
  //StartTTYD()
});
</script>

<template>
  <!-- <div class="container">
    <div class="folder">
      <div class="nav">
        <RemoteTreeFile @selectDir="getDirStructure"/>
      </div>
      <FolderTree
        class="file"
        :data="treeData"
        @get-text-from-path="getTextFromServer"
      />
    </div>
    <div class="Right">
      <MonacoEditor
        class="editor"
        :text-value="text"
        :path="selectedPath"
        @save="saveTextToServer"
        @run="RunJKS"
        @stop="Stop"
      />

      <TerminalComponent class="terminal" ref="term" />
    </div>
  </div> -->
  <div class="container">
    <lay-split-panel class="Panel" :min-size="200">
      <lay-split-panel-item :space="300">
        <div class="folder">
          <div class="nav">
            <RemoteTreeFile @selectDir="getDirStructure" />
          </div>
          <FolderTree
            class="file"
            :data="treeData"
            @get-text-from-path="getTextFromServer"
          />
        </div>
      </lay-split-panel-item>
      <lay-split-panel-item>
        <lay-split-panel :vertical="true" :min-size="150">
          <lay-split-panel-item :space="500">
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
            <TerminalComponent class="terminal" ref="term" />
          </lay-split-panel-item>
        </lay-split-panel>
      </lay-split-panel-item>
    </lay-split-panel>
  </div>
</template>

<style scoped>
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
  overflow-y: auto;
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
  margin:0;
  border:0;

}
</style>
