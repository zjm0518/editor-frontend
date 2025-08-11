import { ref } from 'vue';

export const useConfig = () => {
  const config = ref<any>(null);

  async function initConfig() {
    const local = localStorage.getItem('plc-config');
    const localConfig = local ? JSON.parse(local) : null;
    console.log('本地配置:', localConfig);
    if (localConfig) {
      // 秒开
      config.value = localConfig;
    }

    try {
      // 后台异步检查版本
      const res = await fetch('/api/GetVersion'); // 只返回 { version: 3 }
      const { version } = await res.json();
      console.log('当前版本:', version);

      if (!localConfig || localConfig.version !== version) {
        // 后端有新版本 → 拉取全量配置
        const res2 = await fetch('/api/GetPLCConfig');
        const newConfig = await res2.json();
        config.value = newConfig;
        localStorage.setItem('plc-config', JSON.stringify(newConfig));
      }
    } catch (err) {
      console.error('检查配置更新失败:', err);
    }
  }

  return { config, initConfig };
};
export const cylinder_config = [
  {
    name: "料盘搬移",

    cylinders: [
      {
        name: "料盘夹紧",
        address: 800,
        status: [
          { name: "松开", address: 850 },
          { name: "夹紧", address: 851 },
        ],
      },
      {
        name: "料盘横移",
        address: 807,
        status: [
          { name: "右位", address: 864 },
          { name: "左位", address: 865 },
        ],
      },
    ],
  },
  {
    name: "料框整形",
    cylinders: [
      {
        name: "料盘规整",
        address: 801,
        status: [
          { name: "松开", address: 852 },
          { name: "夹紧", address: 853 },
        ],
      },
      {
        name: "料盘隔断",
        address: 802,
        status: [
          { name: "缩位", address: 854 },
          { name: "伸位", address: 855 },
        ],
      },
    ],
  },
  {
    name: "料盘支撑",
    cylinders: [
      {
        name: "料盘左支撑",
        address: 803,
        status: [
          { name: "伸位", address: 856 },
          { name: "缩位", address: 857 },
        ],
      },
      {
        name: "料盘右支撑",
        address: 804,
        status: [
          { name: "伸位", address: 858 },
          { name: "缩位", address: 859 },
        ],
      },
      {
        name: "料盘分盘",
        address: 810,
        status: [
          { name: "缩位", address: 870 },
          { name: "伸位", address: 871 },
        ],
      },
    ],
  },
  {
    name: "料盘阻挡",
    cylinders: [
      {
        name: "料盘左阻挡",
        address: 805,
        status: [
          { name: "下位", address: 860 },
          { name: "上位", address: 861 },
        ],
      },
      {
        name: "料盘右阻挡",
        address: 806,
        status: [
          { name: "下位", address: 862 },
          { name: "上位", address: 863 },
        ],
      },
    ],
  },
  {
    name: "二次定位",
    cylinders: [
      {
        name: "二次定位长边",
        address: 808,
        status: [
          { name: "伸位", address: 866 },
          { name: "缩位", address: 867 },
        ],
      },
      {
        name: "二次定位短边",
        address: 809,
        status: [
          { name: "缩位", address: 868 },
          { name: "伸位", address: 869 },
        ],
      },
    ],
  },
];

export const cylinder_config2 = [
  {
    name: "料盘搬移",

    cylinders: [
      {
        name: "上层前后卡盘气缸",
        address: 800,
        status: [
          { name: "上层前卡盘气缸伸位", register: 1502,index:0 },
          { name: "上层后卡盘气缸伸位", register: 1503,index:0 },
          { name: "上层前卡盘气缸缩位", register: 1502,index:1 },
          { name: "上层后卡盘气缸缩位", register: 1503,index:1 },
        ],
      },
      {
        name: "料盘横移",
        address: 807,
        status: [
          { name: "右位", address: 864 },
          { name: "左位", address: 865 },
        ],
      },
    ],
  },
  {
    name: "料框整形",
    cylinders: [
      {
        name: "料盘规整",
        address: 801,
        status: [
          { name: "松开", address: 852 },
          { name: "夹紧", address: 853 },
        ],
      },
      {
        name: "料盘隔断",
        address: 802,
        status: [
          { name: "缩位", address: 854 },
          { name: "伸位", address: 855 },
        ],
      },
    ],
  },
  {
    name: "料盘支撑",
    cylinders: [
      {
        name: "料盘左支撑",
        address: 803,
        status: [
          { name: "伸位", address: 856 },
          { name: "缩位", address: 857 },
        ],
      },
      {
        name: "料盘右支撑",
        address: 804,
        status: [
          { name: "伸位", address: 858 },
          { name: "缩位", address: 859 },
        ],
      },
      {
        name: "料盘分盘",
        address: 810,
        status: [
          { name: "缩位", address: 870 },
          { name: "伸位", address: 871 },
        ],
      },
    ],
  },
  {
    name: "料盘阻挡",
    cylinders: [
      {
        name: "料盘左阻挡",
        address: 805,
        status: [
          { name: "下位", address: 860 },
          { name: "上位", address: 861 },
        ],
      },
      {
        name: "料盘右阻挡",
        address: 806,
        status: [
          { name: "下位", address: 862 },
          { name: "上位", address: 863 },
        ],
      },
    ],
  },
  {
    name: "二次定位",
    cylinders: [
      {
        name: "二次定位长边",
        address: 808,
        status: [
          { name: "伸位", address: 866 },
          { name: "缩位", address: 867 },
        ],
      },
      {
        name: "二次定位短边",
        address: 809,
        status: [
          { name: "缩位", address: 868 },
          { name: "伸位", address: 869 },
        ],
      },
    ],
  },
];
export const motor_position_config = [
  {
  status:[720],//到位
  current_position:20006,
  move_value:20028,
  speed:[20000,20004],
  button:[120,121,122,123],
  points:[
  {
    name:"最高位",
    teach:113,
    track:103,
    point:20014
  },
  {
    name:"卡盘位(第三低位)",
    teach:112,
    track:102,
    point:20012
  },
  {
    name:"支撑位(第二低位)",
    teach:111,
    track:101,
    point:20010
  },
  {
    name:"流盘位(最低位)",
    teach:110,
    track:100,
    point:20008
  },
  {
    name:"备用位",
    teach:115,
    track:105,
    point:20018
  }
]},
{//右电机
  status:[721],//到位
  current_position:20106,//当前位置
  move_value:20128,//步进量
  speed:[20100,20104],//手动/自动速度
  button:[220,221,222,223],
  points:[
  {
    name:"最高位",
    teach:213,
    track:203,
    point:20114
  },
  {
    name:"卡盘位(第三低位)",
    teach:212,
    track:202,
    point:20112
  },
  {
    name:"支撑位(第二低位)",
    teach:211,
    track:201,
    point:20110
  },
  {
    name:"流盘位(最低位)",
    teach:210,
    track:200,
    point:20108
  },
  {
    name:"备用位",
    teach:215,
    track:205,
    point:20118
  }
]}
]
