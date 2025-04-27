<template>
  <div style="display: inline;">
    <i
      class="icon iconfont2 icon2-a-Openfolder"
      style="cursor: pointer; align-items: center"
      title="选择日志路径"
      :style="{ fontSize: fontsize }"
      @click="handleTree"
    ></i>
    <el-dialog title="选择日志路径" v-model="visible" width="70%" height="70%" align-center>

      <div v-if="false">
        <h2 class="message delayed">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
          <span>loading</span>
        </h2>
      </div>
      <template v-else >
        <div>
          <bread-crumbs3 class="bread-crumbs"></bread-crumbs3>
        <div
          v-if="
            (fileStore.req?.numDirs ?? 0) + (fileStore.req?.numFiles ?? 0) == 0
          "
        >
          <h2 class="message">
            <i class="material-icons">sentiment_dissatisfied</i>
            <span>No data</span>
          </h2>
        </div>
        <div v-else id="listing" ref="listing" class="file-icons list">

          <div>
            <div class="item header">
              <div></div>
              <div>
                <p
                  :class="{ active: nameSorted }"
                  class="name"
                  role="button"
                  tabindex="0"
                  @click="sort('name')"
                  title="sortByName"
                  aria-label="sortByName"
                >
                  <span>name</span>
                  <i class="material-icons">{{ nameIcon }}</i>
                </p>

                <p
                  :class="{ active: sizeSorted }"
                  class="size"
                  role="button"
                  tabindex="0"
                  @click="sort('size')"
                  title="sortBySize"
                  aria-label="sortBySize"
                >
                  <span>size</span>
                  <i class="material-icons">{{ sizeIcon }}</i>
                </p>
                <p
                  :class="{ active: modifiedSorted }"
                  class="modified"
                  role="button"
                  tabindex="0"
                  @click="sort('modified')"
                  title="sortByLastModified"
                  aria-label="sortByLastModified"
                >
                  <span>lastModified</span>
                  <i class="material-icons">{{ modifiedIcon }}</i>
                </p>
              </div>
            </div>
          </div>

          <h2 v-if="fileStore.req?.numDirs ?? false">folders</h2>
          <div v-if="fileStore.req?.numDirs ?? false">
            <item
              v-for="item in dirs"
              :key="base64(item.name)"
              v-bind:index="item.index"
              v-bind:name="item.name"
              v-bind:isDir="item.isDir"
              v-bind:url="item.url"
              v-bind:modified="item.modified"
              v-bind:type="item.type"
              v-bind:size="item.size"
              v-bind:path="item.path"
            >
            </item>
          </div>

          <h2 v-if="fileStore.req?.numFiles ?? false">files</h2>
          <div v-if="fileStore.req?.numFiles ?? false">
            <item
              v-for="item in files"
              :key="base64(item.name)"
              v-bind:index="item.index"
              v-bind:name="item.name"
              v-bind:isDir="item.isDir"
              v-bind:url="item.url"
              v-bind:modified="item.modified"
              v-bind:type="item.type"
              v-bind:size="item.size"
              v-bind:path="item.path"
            >
            </item>
          </div>

        </div>
        </div>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElDialog, ElButton } from "element-plus";
import { ref, watch, computed, onMounted,nextTick } from "vue";
import { useFileStore3 } from "@/stores/file";
import {  type Resource } from "@/stores/types";
import { Base64 } from "js-base64";
import { storeToRefs } from "pinia";
import Item from "@/components/ListingItem3.vue";

import BreadCrumbs3 from "./Breadcrumbs3.vue";
import "@/css/_variables.css"
import "@/css/fonts.css"
import "@/css/listing-icons.css"
import "@/css/listing.css"

import css from "@/utils/css";
defineProps<{
  fontsize: string;

}>();
const fileStore = useFileStore3();
const visible = ref(false);
const selectPath = ref("");

  const columnWidth = ref<number>(280);
  const { req } = storeToRefs(fileStore);
const itemWeight = ref<number>(0);
  const listing = ref<HTMLElement | null>(null);

  const emit = defineEmits<{
  (e: "selectLogPath", libPath: string): void;
}>();
const showLimit = ref<number>(10000);
const base64 = (name: string) => Base64.encodeURI(name);
const handleTree = function () {
  visible.value = true;
 // selectNode.value = "";
  selectPath.value = "";
  fetchUserHomeData()
};

watch(req, () => {
  // Reset the show value
  if (
    window.sessionStorage.getItem("listFrozen") !== "true" &&
    window.sessionStorage.getItem("modified") !== "true"
  ) {
    showLimit.value = 50;

    nextTick(() => {
      // Ensures that the listing is displayed
      // How much every listing item affects the window height
      setItemWeight();

      // Fill and fit the window with listing items
      fillWindow(true);
    });
  }
  if (req.value?.isDir) {
    window.sessionStorage.setItem("listFrozen", "false");
    window.sessionStorage.setItem("modified", "false");
  }
});
const dirs = computed(() => items.value.dirs.slice(0, showLimit.value));

const items = computed(() => {
  const dirs: any[] = [];
  const files: any[] = [];

  fileStore.req?.items.forEach((item) => {
    if (item.isDir) {
      dirs.push(item);
    } else {
      files.push(item);
    }
  });

  return { dirs, files };
});

const files = computed((): Resource[] => {
  let _showLimit = showLimit.value - items.value.dirs.length;

  if (_showLimit < 0) _showLimit = 0;

  return items.value.files.slice(0, _showLimit);
});
const sort = async (by: string) => {
  console.log("sort:",by)
}
const nameSorted = computed(() =>
  fileStore.req ? fileStore.req.sorting.by === "name" : false
);

const sizeSorted = computed(() =>
  fileStore.req ? fileStore.req.sorting.by === "size" : false
);

const modifiedSorted = computed(() =>
  fileStore.req ? fileStore.req.sorting.by === "modified" : false
);

const ascOrdered = computed(() =>
  fileStore.req ? fileStore.req.sorting.asc : false
);

const nameIcon = computed(() => {
  if (nameSorted.value && !ascOrdered.value) {
    return "arrow_upward";
  }

  return "arrow_downward";
});

const sizeIcon = computed(() => {
  if (sizeSorted.value && ascOrdered.value) {
    return "arrow_downward";
  }

  return "arrow_upward";
});

const modifiedIcon = computed(() => {
  if (modifiedSorted.value && ascOrdered.value) {
    return "arrow_downward";
  }

  return "arrow_upward";
});
const setItemWeight = () => {
  // Listing element is not displayed
  if (listing.value === null || fileStore.req === null) return;

  let itemQuantity = fileStore.req.numDirs + fileStore.req.numFiles;
  if (itemQuantity > showLimit.value) itemQuantity = showLimit.value;

  // How much every listing item affects the window height
  itemWeight.value = listing.value.offsetHeight / itemQuantity;
};

const fillWindow = (fit = false) => {
  if (fileStore.req === null) return;

  const totalItems = fileStore.req.numDirs + fileStore.req.numFiles;

  // More items are displayed than the total
  if (showLimit.value >= totalItems && !fit) return;

  const windowHeight = window.innerHeight;

  // Quantity of items needed to fill 2x of the window height
  const showQuantity = Math.ceil(
    (windowHeight + windowHeight * 2) / itemWeight.value
  );

  // Less items to display than current
  if (showLimit.value > showQuantity && !fit) return;

  // Set the number of displayed items
  showLimit.value = showQuantity > totalItems ? totalItems : showQuantity;
};

const colunmsResize = () => {
  // Update the columns size based on the window width.
  const items_ = css(["#listing.mosaic .item", ".mosaic#listing .item"]);
  if (items_ === null) return;

  let columns = Math.floor(
    (document.querySelector("main")?.offsetWidth ?? 0) / columnWidth.value
  );
  if (columns === 0) columns = 1;

  items_.style.width = `calc(${100 / columns}% - 1em)`;
};

const fetchUserHomeData = () => {
  fileStore.fetchUserHomeFile()
};
const handleConfirm = function () {
  if(fileStore.selected == null || fileStore.req==null) return
  if(!fileStore.req.items[fileStore.selected].isDir) return
  selectPath.value=fileStore.req.items[fileStore.selected].path
  emit("selectLogPath", selectPath.value);
  visible.value = false;
};
onMounted( async ()=>{
  //fetchDiskData()
  //selectPath.value="C:/Users/wy156/Documents/WeChat Files/wxid_scq1chz7v4ax21/FileStorage/File/2025-01"
  //await fetchData()
  await fetchUserHomeData()
  // Check the columns size for the first time.
  colunmsResize();

  // How much every listing item affects the window height
  setItemWeight();

  // Fill and fit the window with listing items
  fillWindow(true);
})
</script>

<style lang="css" scoped>
.bread-crumbs{
  height: 5%;

}
.filelist {
  height: 95%;
  overflow-y: auto;
}
.filelist::-webkit-scrollbar {
  width: 5px;
  height: 3px;
}
.filelist::-webkit-scrollbar-track {
  background: rgba(255, 255, 255);
}
.filelist::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 3px;
}
:deep(.el-dialog) {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  margin-top: 0 !important;
  height: 80vh;
  overflow: hidden;
}
:deep(.el-dialog__body) {
  height: 90%;
  overflow-y: auto;
  padding: 10px 2px ;    /* 可选，增加左右内边距 */
}
:deep(.el-dialog__header){
  height: 5%;
  padding-bottom: 0;
}
:deep(.el-dialog__footer){
  height: 5%;
  padding: 0;
}

</style>
