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
import { useFileStore } from "@/stores/file";
import "@/css/_variables.css"
import "@/css/fonts.css"
const filestore=useFileStore()

const props = defineProps<{
  base: string;
  noLink?: boolean;
}>();
interface BreadCrumb {
    name: string;
    url: string;
    path:string,
  }
const jump=function(path:string){
  filestore.getRequest(path)

}
const toHome=function(){
  filestore.fetchDiskFile()
}
const items = computed(() => {
  //const relativePath = route.path.replace(props.base, "");
  const parts = filestore.path.split("/");

  if (parts[0] === "") {
    parts.shift();
  }

  if (parts[parts.length - 1] === "") {
    parts.pop();
  }

  const breadcrumbs: BreadCrumb[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i === 0) {
      breadcrumbs.push({
        name: decodeURIComponent(parts[i]),
        url: props.base + "/" + parts[i] + "/",
        path:parts[0]+"/"
      });
    } else {
      breadcrumbs.push({
        name: decodeURIComponent(parts[i]),
        url: breadcrumbs[i - 1].url + parts[i] + "/",
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
