<template>
  <div
    class="item"
    role="button"
    tabindex="0"
    @click="itemClick"
    @dblclick="doubleclick"
    :data-dir="isDir"
    :data-type="type"
    :aria-label="name"
    :aria-selected="isSelected"
    :data-ext="getExtension(name).toLowerCase()"
    :title="name"
  >
    <div>
      <img v-if="type === 'image' && isThumbsEnabled" />
      <i v-else class="material-icons"></i>
    </div>

    <div>
      <p class="name">{{ name }}</p>

      <p v-if="isDir" class="size" data-order="-1">&mdash;</p>
      <p v-else class="size" :data-order="humanSize()">{{ humanSize() }}</p>

      <p class="modified">
        <time :datetime="modified">{{ humanTime() }}</time>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFileStore } from "@/stores/file";

//import { enableThumbs } from "@/utils/constants";

import dayjs from "dayjs";

import { computed } from "vue";
import { storeToRefs } from "pinia";
import { partial } from "filesize";
import "@/css/_variables.css";
import "@/css/fonts.css";
import "@/css/listing-icons.css";
import "@/css/listing.css";
import { getResources } from "@/api/path";
import type { Resource } from "@/stores/types";
/**
 * Formats filesize as KiB/MiB/...
 */
const filesize = partial({ base: 2 });

const props = defineProps<{
  name: string;
  isDir: boolean;

  type: string;
  size: number;
  modified: string;
  index: number;
  path?: string;
}>();

const fileStore = useFileStore();

const isSelected = computed(() => selected.value == props.index);

const { selected } = storeToRefs(fileStore);
/* const thumbnailUrl = computed(() => {
  const file = {
    path: props.path,
    modified: props.modified,
  };

  return api.getPreviewURL(file as Resource, "thumb");
}); */

const isThumbsEnabled = computed(() => {
  return true;
});

const humanSize = () => {
  return props.type == "invalid_link" ? "invalid link" : filesize(props.size);
};

const humanTime = () => {
  return dayjs(props.modified).format("YYYY-MM-DD HH:mm");
};

const itemClick = () => {
  //单击
  console.log("click");
  console.log(props);
  selected.value = props.index;
};

const doubleclick = () => {
  if (!props.isDir) return;
  console.log("dbclick");
  open();
};

const open = () => {
  getResources({ path: props.path }).then((res) => {
    const data = res as Resource;

    if (data.isDir) {
      // Perhaps change the any
      data.items = data.items.map((item: any, index: any) => {
        item.index = index;
        //  item.url = `${data.url}${encodeURIComponent(item.name)}`;

        return item;
      });
    }

    fileStore.updateRequest(data as Resource,res.path);
  });
};

const getExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(lastDotIndex);
};
</script>
