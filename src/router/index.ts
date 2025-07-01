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
  { path: '/rgv', component: () => import('@/RGVConfig.vue'),
    redirect:'/rgv/r1',
    children:[
      { path: 'r1', name: 'r1', component: () => import('@/components/rgvconfig/RGV1.vue'),
        redirect: '/rgv/r1/pre-soft',
        children: [
          { path: 'pre-soft', name: 'pre-soft', component: () => import('@/components/rgvconfig/rgv1/PreSoft.vue') },
          { path: 'pre-hard', name: 'pre-hard', component: () => import('@/components/rgvconfig/rgv1/PreHard.vue') },
          { path: 'pre-test', name: 'pre-test', component: () => import('@/components/rgvconfig/rgv1/PreTest.vue') },
        ]
       },
      { path: 'r2', name: 'r2', component: () => import('@/components/rgvconfig/RGV2.vue'),
        redirect: '/rgv/r2/connect-camera',
        children: [
          { path: 'connect-camera', name: 'connect-camera', component: () => import('@/components/rgvconfig/rgv2/ConnectCamera.vue') },
          { path: 'reset', name: 'reset', component: () => import('@/components/rgvconfig/rgv2/Reset.vue') },

        ]
       },
      { path: 'r3', name: 'r3', component: () => import('@/components/rgvconfig/RGV3.vue') },
      { path: 'r4', name: 'r4', component: () => import('@/components/rgvconfig/RGV4.vue') },
      { path: 'r5', name: 'r5', component: () => import('@/components/rgvconfig/RGV5.vue') },
    ]
   },
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
