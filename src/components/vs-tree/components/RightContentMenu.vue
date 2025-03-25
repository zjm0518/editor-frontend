<script lang="ts" setup>
import { ref, reactive, computed, nextTick,inject } from "vue";

const menuList = [
  {
    label: "重命名",
    key: "RENAME",
  },
  {
    label: "删除",
    key: "DELETE",
  },
  ];

const inputRef = ref(null);
const showMenuStatus = ref(false);
const position = reactive({
  top: 0,
  left: 0,
});
const isDir = ref(false);
const emits = defineEmits(["handleMenu"]);
const rightTarget=inject("rightTarget");
function showMenu(event, data, node, TreeNode) {
  showMenuStatus.value = true;
  isDir.value = data.isDir || false;
  position.top = event.clientY;
  position.left = event.clientX;
  nextTick(() => {
    if (inputRef && inputRef.value) {
      inputRef.value.focus();
    }
  });
  console.log("showMenuStatus", showMenuStatus.value);
}

/* function hiddenMenuStatus() {
  setTimeout(() => {
    console.log("hiddenMenuStatus");
    showMenuStatus.value = false;
    const el_node = rightTarget.value.closest(".el-tree-node");
    el_node.classList.remove("is-right-click");
  }, 200);
} */
function hiddenMenuStatus(event) {
  if (!showMenuStatus.value) return;

  // 确保点击的是菜单外部
  const menuElement = document.querySelector(".right-menu");
  if (menuElement && menuElement.contains(event.target)) {
    return;
  }
  if (rightTarget.value && rightTarget.value.contains(event.target) && event.button!=0) {
    return;

  }

  console.log("hiddenMenuStatus 执行");
  showMenuStatus.value = false;

  if (rightTarget.value) {
    const el_node = rightTarget.value.closest(".el-tree-node");
    el_node?.classList.remove("is-right-click");console.log("bbb");
    rightTarget.value = null;
  }
}
const positionX = computed(() => {
  return position.left;
});

const positionY = computed(() => {
  return position.top;
});

const currentMenuList = computed(() => {
  if (isDir.value) {
    return menuList;
  } else {
    return menuList.filter(
      (item) => !["CREATE_FOLDER", "CREATE_FILE", "PASTE"].includes(item.key)
    );
  }
});

function clickMenu(item) {

  emits("handleMenu", item.key);
  showMenuStatus.value = false;

if (rightTarget.value) {
  const el_node = rightTarget.value.closest(".el-tree-node");
  el_node?.classList.remove("is-right-click");console.log("ccc");
}


}

defineExpose({
  showMenu,
  hiddenMenuStatus
});
</script>
<template>
  <div
    v-show="showMenuStatus"
    class="right-menu"
    :style="{
      top: positionY + 'px',
      left: positionX + 'px',
    }"
  >
    <div
      v-for="(item, index) in currentMenuList"
      :key="index"
      class="right-menu-item"
      @click="clickMenu(item)"
    >
      {{ item.label }}
    </div>
    <input ref="inputRef" class="menu_input" />
  </div>
</template>



<style lang="scss" scoped>
.right-menu {
  position: fixed;
  width: 200px;
  border-radius: 2px;
  border: 1px solid #c4c9cb;
  background-color: #dbe3e5;
  padding: 4px 10px;
  display: flex;
  flex-direction: column;
  background-color: #8f8d8d;
  font-family: Consolas, "Courier New";
  z-index:1;
  .menu_input {
    width: 0;
    height: 0;
    padding: 0;
    border: none;
  }
  .right-menu-item {
    padding: 0 15px;
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    color: #222221;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #c5c7c8;
      color: white;
    }
  }
}
</style>
