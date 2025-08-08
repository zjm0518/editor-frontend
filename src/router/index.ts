import {  createRouter, createWebHistory } from 'vue-router'
import Editor from '@/Editor.vue';
import AGVInfo from '@/AGVInfo.vue';
import ICamera from '@/ICamera.vue';
import ILog from '@/ILog.vue';
import PLCControl from '@/PLCControl.vue';
import DebugControl from '@/DebugControl.vue';
const routes = [
  { path: '/', component: Editor },
  { path: '/agv', component: AGVInfo },
  { path: '/camera', component: ICamera },
  { path: '/log', component: ILog },
  { path: '/plc', component: PLCControl },
  { path: '/debug', component: DebugControl },
   {path: '/rgv/main', name: 'main', component: () => import('@/RGVConfigMain.vue')},
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
          { path: 'set-params', name: 'set-params', component: () => import('@/components/rgvconfig/rgv2/SetParams.vue') },
          { path: 'com-set', name: 'com-set', component: () => import('@/components/rgvconfig/rgv2/ComSet.vue') },
          { path: 'edit-expo', name: 'edit-expo', component: () => import('@/components/rgvconfig/rgv2/EditExpo.vue') },
          { path: 'save-params2', name: 'save-params2', component: () => import('@/components/rgvconfig/rgv2/SaveParam.vue') },

        ]
       },
      { path: 'r3', name: 'r3', component: () => import('@/components/rgvconfig/RGV3.vue'),
       redirect: '/rgv/r3/connect-s',
        children:[
          { path: 'connect-s', name: 'connect-s', component: () => import('@/components/rgvconfig/rgv3/ConnectS.vue') },
          { path: 'init-params', name: 'init-params', component: () => import('@/components/rgvconfig/rgv3/InitParams.vue') },
          { path: 'can-comm', name: 'can-comm', component: () => import('@/components/rgvconfig/rgv3/CanComm.vue') },
          { path: 'clear-io', name: 'clear-io', component: () => import('@/components/rgvconfig/rgv3/ClearIO.vue') },
          { path: 'stable-set', name: 'stable-set', component: () => import('@/components/rgvconfig/rgv3/StableSet.vue') },
          { path: 'work-mode', name: 'work-mode', component: () => import('@/components/rgvconfig/rgv3/WorkMode.vue') },
          { path: 'save-params', name: 'save-params', component: () => import('@/components/rgvconfig/rgv3/SaveParams.vue') }
        ]
       },
      { path: 'r4', name: 'r4', component: () => import('@/components/rgvconfig/RGV4.vue'),
        redirect: '/rgv/r4/connect-c',
        children:[
          { path: 'connect-c', name: 'connect-c', component: () => import('@/components/rgvconfig/rgv4/ConnectC.vue') },
          { path: 'model-config', name: 'model-config', component: () => import('@/components/rgvconfig/rgv4/ModelConfig.vue') },
          { path: 'motor-config', name: 'motor-config', component: () => import('@/components/rgvconfig/rgv4/MotorConfig.vue') },
          { path: 'pgv-config', name: 'pgv-config', component: () => import('@/components/rgvconfig/rgv4/PGVConfig.vue') },
          { path: 'battery-config', name: 'battery-config', component: () => import('@/components/rgvconfig/rgv4/BatteryConfig.vue') },
          { path: 'vehicle-config', name: 'vehicle-config', component: () => import('@/components/rgvconfig/rgv4/VehicleConfig.vue') },
          { path: 'stop-config', name: 'stop-config', component: () => import('@/components/rgvconfig/rgv4/StopConfig.vue') },
          { path: 'radar-config', name: 'radar-config', component: () => import('@/components/rgvconfig/rgv4/RadarConfig.vue') },
          { path: 'trigger-config', name: 'trigger-config', component: () => import('@/components/rgvconfig/rgv4/TriggerConfig.vue') },
          { path: 'di-nav', name: 'di-nav', component: () => import('@/components/rgvconfig/rgv4/DINav.vue') },
          { path: 'voice-b', name: 'voice-b', component: () => import('@/components/rgvconfig/rgv4/VoiceB.vue') },
          { path: 'control-config', name: 'control-config', component: () => import('@/components/rgvconfig/rgv4/ControlConfig.vue') },
          { path: 'save-config', name: 'save-config', component: () => import('@/components/rgvconfig/rgv4/SaveConfig.vue') },
        ]
       },
      { path: 'r5', name: 'r5', component: () => import('@/components/rgvconfig/RGV5.vue'),
        redirect: '/rgv/r5/connect-radar',
        children:[
          { path: 'connect-radar', name: 'connect-radar', component: () => import('@/components/rgvconfig/rgv5/ConnectRadar.vue') },
          { path: 'modify-radar', name: 'modify-radar', component: () => import('@/components/rgvconfig/rgv5/ModifyRadar.vue') },
          { path: 'radar-range', name: 'radar-range', component: () => import('@/components/rgvconfig/rgv5/RadarRange.vue') },
          { path: 'test-o', name: 'test-o', component: () => import('@/components/rgvconfig/rgv5/TestO.vue') }
        ]
       },
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
