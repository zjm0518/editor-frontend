<template>
  <div class="breadcrumbs">
    <span  @click="toHome" aria-label="Home" title="Home">
      <i class="material-icons breadpath">home</i>
    </span>

    <span v-for="(link, index) in items" :key="index" class="breadpath-container">
      <span class="chevron"
        ><i class="material-icons">keyboard_arrow_right</i></span
      >
      <span class="breadpath" @click="jump(link.path)">{{ link.name }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFileStore2 } from "@/stores/file";
import "@/css/_variables.css"
import "@/css/fonts.css"
const filestore=useFileStore2()

interface BreadCrumb {
    name: string;
    path:string,
  }
const jump=function(path:string){
  filestore.getRequest(path)

}
const toHome=function(){
  filestore.fetchUserHomeFile()
}
const items = computed(() => {
  const breadcrumbs: BreadCrumb[] = [];
  let filepath=filestore.path
  const basepath=filestore.userHomeDir
   // 去掉前面的根目录路径部分
   if (filepath.startsWith(basepath)) {
    filepath = filepath.replace(basepath, ''); // 删除前缀部分
  }else{
    return breadcrumbs;
  }
  if (filepath.startsWith("/")) {
    filepath = filepath.slice(1);  // 删除前导的斜杠
  }
  //const relativePath = route.path.replace(props.base, "");
  const parts = filepath.split("/");


  if (parts[0] === "") {
    parts.shift();
  }

  if (parts[parts.length - 1] === "") {
    parts.pop();
  }



  for (let i = 0; i < parts.length; i++) {
    if (i === 0) {
      breadcrumbs.push({
        name: decodeURIComponent(parts[i]),
        path:basepath+"/"+parts[0]+"/"
      });
    } else {
      breadcrumbs.push({
        name: decodeURIComponent(parts[i]),
        path:breadcrumbs[i-1].path+parts[i]+ "/",
      });
    }
  }

  if (breadcrumbs.length > 3) {
    while (breadcrumbs.length !== 4) {
      breadcrumbs.shift();
    }

    breadcrumbs[0].name = "...";
  }

  return breadcrumbs;
});

</script>

<style>
.breadpath-container {
  display: inline-flex; /* 使用 inline-flex 布局来处理内容对齐 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */

}
.breadpath{
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.breadpath:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
