<template>
  <el-tree
    style="max-width: 600px"
    :data="props.data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus';
interface Tree {
  label: string
  children?: Tree[]
  value?:string
}
const emit
  = defineEmits<(e: 'tchange', payload: string | undefined,node ) => void>()

const handleNodeClick = (data: Tree,node) => {
  console.log(data.value)
  emit('tchange',data.value,node)

}
const props = defineProps<{
  data: Tree[]
}>()


const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>
