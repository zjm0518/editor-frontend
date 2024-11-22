<template>
  <ul>
    <li
      v-for="(value, key) in treeData"
      :key="key"
    >
      <!-- 可折叠的文件夹或文件 -->
      <div
        class="tree-item"
        :class="{ folder: typeof value === 'object', file: typeof value.file !== 'undefined', selected: selectedPath === fullPath(key) }"
        @click="handleClick(key, value, $event)"
      >
        <span class="icon" :class="typeof value === 'object' ? (expanded[key] ? 'folder-open' : 'folder-closed') : 'file-icon'"></span>
        <span>{{ key }}</span>
      </div>

      <!-- 子树 -->
      <file-tree
        v-if="expanded[key] && typeof value === 'object'"
        :treeData="value"
        :basePath="fullPath(key)"
        @select="selectNode"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FileTree',
  props: {
    treeData: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '', // 当前层的基础路径
    },
  },
  data() {
    return {
      expanded: {}, // 文件夹的展开状态
      selectedPath: '', // 当前选中的路径
    };
  },
  methods: {
    handleClick(key, value, event) {
      event.stopPropagation(); // 阻止事件冒泡

      if (typeof value === 'object') {
        // 点击文件夹时切换展开状态
        this.$set(this.expanded, key, !this.expanded[key]);
      }

      // 始终返回选中的路径
      const fullPath = this.fullPath(key);
      this.selectNode(fullPath);
    },
    fullPath(key) {
      return this.basePath ? `${this.basePath}/${key}` : key;
    },
    selectNode(path) {
      this.selectedPath = path; // 更新当前选中路径
      this.$emit('select', path); // 通知父组件选中的路径
    },
  },
};
</script>

<style scoped>
/* 树基础样式 */
ul {
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
}

li {
  margin: 5px 0;
  cursor: pointer;
  position: relative;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.tree-item .icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

/* 文件和文件夹图标 */
.file-icon {
  content: '📄';
}

.folder-closed::before {
  content: '📁'; /* 未展开的文件夹图标 */
}

.folder-open::before {
  content: '📂'; /* 展开的文件夹图标 */
}

/* Hover 样式 */
.tree-item:hover {
  background-color: #2c313a;
  color: #abb2bf;
}

/* 选中样式 */
li.selected .tree-item {
  background-color: #3e4451;
  color: #ffffff;
}
</style>
