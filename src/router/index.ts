import {  createRouter, createWebHistory } from 'vue-router'
import Editor from '@/Editor.vue';
import AGVInfo from '@/AGVInfo.vue';
import ICamera from '@/ICamera.vue';
const routes = [
  { path: '/', component: Editor },
  { path: '/agv', component: AGVInfo },
  { path: '/camera', component: ICamera },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
