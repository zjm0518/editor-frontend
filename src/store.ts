import { defineStore } from 'pinia'

export const useFileStore = defineStore('files', {
  state: () => {
    return {
      data:[
        {
          label: 'src',
          children: [
            {
              label: 'components',
              children: [
                {
                  label: 'FileTree.vue',
                  value: '<script setup lang="ts">'
                },
                {
                  label: 'FileTree2.vue',
                  value: '\ninterface Tree {\nlabel: string\nchildren?: Tree[]\nvalue?:string\n}'
                }
              ],
            },
          ],
        },
        {
          label: 'Level one 2',
          children: [
            {
              label: 'Level two 2-1',
              children: [
                {
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              label: 'Level two 2-2',
              children: [
                {
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
        {
          label: 'Level one 3',
          children: [
            {
              label: 'Level two 3-1',
              children: [
                {
                  label: 'Level three 3-1-1',
                },
              ],
            },
            {
              label: 'Level two 3-2',
              children: [
                {
                  label: 'Level three 3-2-1',
                },
              ],
            },
          ],
        },
      ]

     }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      
    },
  },
})
