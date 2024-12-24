import {  createRouter, createWebHistory } from 'vue-router'
import Editor from '@/Editor.vue';
import BatteryInfo from '@/BatteryInfo.vue';
const routes = [
  { path: '/', component: Editor },
  { path: '/battery', component: BatteryInfo },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
