import {  createRouter, createWebHistory } from 'vue-router'
import Editor from '@/Editor.vue';
import AGVInfo from '@/AGVInfo.vue';
import ICamera from '@/ICamera.vue';
import ILog from '@/ILog.vue';
const routes = [
  { path: '/', component: Editor },
  { path: '/agv', component: AGVInfo },
  { path: '/camera', component: ICamera },
  { path: '/log', component: ILog },
  { path: '/init' , component: ()=>import('@/InitConfig.vue'),
    redirect:'/init/1',
    children:[
      {path:'',name:'1',component:()=>import('@/components/config/ConfigPage1.vue')},
      {path:'1',name:'1',component:()=>import('@/components/config/ConfigPage1.vue')},
      {path:'2',name:'2',component:()=>import('@/components/config/ConfigPage2.vue')},
      {path:'3',name:'3',component:()=>import('@/components/config/ConfigPage3.vue')},
      {path:'4',name:'4',component:()=>import('@/components/config/ConfigPage4.vue')},
      {path:'5',name:'5',component:()=>import('@/components/config/ConfigPage5.vue')},
    ]
  },
  {path:'/machinecode',component:()=>import('@/MachineCode.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
