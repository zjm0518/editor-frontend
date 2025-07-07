import { defineStore } from "pinia";
import { reactive, ref } from "vue";


export const useConfigStepsStore = defineStore('configSteps', () => {
  const steps = reactive({
    data1: [
      { name: '软件',url:'/rgv/r1/pre-soft',status:'' },
      { name: '硬件',url:'/rgv/r1/pre-hard',status:'' },
      { name: '开始配置',url:'/rgv/r1/pre-test',status:'' },
    ] ,
    data2: [
      { name: '连接相机',url:'/rgv/r2/connect-camera',status:'' },
      { name: '恢复出厂设置',url:'/rgv/r2/reset',status:'' },
      { name: '配置设备属性',url:'/rgv/r2/set-params',status:'' },
      { name: '通讯设置',url:'/rgv/r2/com-set',status:'' },
      { name: '修改曝光',url:'/rgv/r2/edit-expo',status:'' },
      { name: '保存参数',url:'/rgv/r2/save-params2',status:'' },
    ],
    data3: [
      { name: '连接上位机',url:'/rgv/r3/connect-s',status:'' },
      { name: '初始化驱动器参数',url:'/rgv/r3/init-params',status:'' },
      { name: 'can通讯配置',url:'/rgv/r3/can-comm',status:'' },
      { name: '清理IO配置',url:'/rgv/r3/clear-io',status:'' },
      { name: '稳定工作配置',url:'/rgv/r3/stable-set',status:'' },
      { name: '工作模式配置',url:'/rgv/r3/work-mode',status:'' },
      { name: '保存配置参数',url:'/rgv/r3/save-params',status:'' },
    ],
    data4: [
      { name: '连接控制器',url:'/rgv/r4/connect-c',status:'' },
      { name: '模型配置',url:'/rgv/r4/model-config',status:'' },
      { name: '电机配置',url:'/rgv/r4/motor-config',status:'' },
      { name: 'PGV配置',url:'/rgv/r4/pgv-config',status:'' },
      { name: '电池配置',url:'/rgv/r4/battery-config',status:'' },
      { name: '车体参数配置',url:'/rgv/r4/vehicle-config',status:'' },
      { name: '急停参数',url:'/rgv/r4/stop-config',status:'' },
      { name: '避障雷达',url:'/rgv/r4/radar-config',status:'' },
      { name: '触发配置' ,url:'/rgv/r4/trigger-config',status:'' },
      { name: 'DI控制导航',url:'/rgv/r4/di-nav',status:'' },
      { name: '语音播报器',url:'/rgv/r4/voice-b',status:'' },
      { name: '控制器配置',url:'/rgv/r4/control-config',status:'' },
      { name: '保存推送',url:'/rgv/r4/save-config',status:'' },
    ],
    data5: [
      { name: '连接雷达',url:'/rgv/r5/connect-radar',status:'' },
      { name: '修改雷达输出逻辑',url:'/rgv/r5/modify-radar',status:'' },
      { name: '调整雷达扫描范围',url:'/rgv/r5/radar-range',status:'' },
      { name: '避障测试',url:'/rgv/r5/test-o',status:'' },
    ]
  })

  const second = ref(false)
  const lastStepToMainPage = {
  '/rgv/r1/pre-test': '/rgv/r1',
  '/rgv/r2/save-params2': '/rgv/r2',
  '/rgv/r3/save-params': '/rgv/r3',
  '/rgv/r4/save-config': '/rgv/r4',
  '/rgv/r5/test-o': '/rgv/r5',
}
function updateStatusByUrl(targetUrl: string, newStatus: string) {
    for (const module of Object.keys(steps) as (keyof typeof steps)[]) {
      const item = steps[module].find(i => i.url === targetUrl)
      if (item) {
        if(item.status === 'done' ){
        return  
        }
        item.status = newStatus
        return
      }
    }
    console.warn(`未找到 URL 为 "${targetUrl}" 的项`)
  }

  function extractAllUrls() {
  const urls: string[] = []
  const stepGroups = Object.values(steps)
   stepGroups.forEach((module, index) => {
    for (const item of module) {
      urls.push(item.url)
    }
    // 使用 index 来构造 groupNumber，从 0 开始 +1 → r1, r2, ...
    const groupNumber = index + 2
    urls.push(`/rgv/r${groupNumber}`)
  })
  return urls
}

  return {
    steps,
    second,
    lastStepToMainPage,
    updateStatusByUrl,
    extractAllUrls
  }
})