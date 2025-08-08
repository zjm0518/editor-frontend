<template>
  <div class="editable-button-wrapper" :style="{flex: flexStyle}">
    <el-button
      type="primary"
      class="robots-button"
      :disabled="editing"
      @mousedown.prevent="onDown"
      @mouseup.prevent="onUp"
    >
      <template v-if="!editing">
        <span class="label-text" :title="label">{{ label }}</span>
      </template>

      <template v-else>
        <input
          ref="inputRef"
          class="inline-input"
          v-model="editValue"
          @keydown="onKeydown"
          @blur="onBlur"
        />
      </template>
    </el-button>

    <!-- 悬浮编辑图标（使用 .stop 防冒泡到按钮） -->
    <span class="edit-icon" @click.stop="startEdit" title="编辑名称">✎</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';

interface SavePayload {
  address: number;
  label: string;
}

const props = defineProps<{
  label: string;
  address: number;
  flexStyle?: string;
}>();

const emit = defineEmits<{
  (e: 'press', address: number): void;
  (e: 'release', address: number): void;
  (e: 'save', payload: SavePayload): void;
}>();

const editing = ref(false);
const editValue = ref(props.label);
const inputRef = ref<HTMLInputElement | null>(null);

// 当父组件更新 label 时同步 editValue
watch(() => props.label, (v) => { editValue.value = v; });

function onDown() {
  if (!editing.value) emit('press', props.address);
}
function onUp() {
  if (!editing.value) emit('release', props.address);
}
function startEdit() {
  editing.value = true;
  nextTick(() => inputRef.value?.select());
}
function stopEdit(save: boolean) {
  if (save) {
    const newLabel = (editValue.value || '').trim() || props.label;
    emit('save', { address: props.address, label: newLabel });
  } else {
    editValue.value = props.label;
  }
  editing.value = false;
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') stopEdit(true);
  else if (e.key === 'Escape') stopEdit(false);
}
function onBlur() {
  // 延迟 1 秒恢复可点击状态
  setTimeout(() => {
    stopEdit(true);
  }, 1000);
}
</script>

<style scoped>
.editable-button-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0;
  width: 100%;
}

/* 按钮样式与你原来一致，右侧留足够内边距给编辑图标 */
.robots-button {
  flex: 0 1 275px; /* 固定每个按钮宽度为 100px */
  padding: 8px 30px 8px 20px; /* 右侧多出空间给 edit icon */
  min-width: 200px;
  height: 55px;
  border-radius: 15px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  &.is-disabled,
  &[disabled] {
    /* 禁用状态样式，覆盖背景和阴影 */
    background: rgba(160, 226, 255, 0.9) !important; /* Element Plus默认禁用色 */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* 阴影 */
    cursor: not-allowed !important;
  }
}

/* 文本居中、超长省略 */
.label-text {
  display: block;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 悬浮编辑图标，默认隐藏，hover 时显示，更细腻 */
.edit-icon {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  line-height: 1;
  background: rgba(255,255,255,0.85);
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity .12s;
  user-select: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}
.editable-button-wrapper:hover .edit-icon { opacity: 1; }

/* 编辑时的 input，视觉靠近按钮文本（无边框透明背景） */
.inline-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  text-align: center;
  height: 100%;
  padding: 0;
}
</style>
