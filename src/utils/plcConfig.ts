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


export const motor_position_config = [
  {
  status:[720,],
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
]}
]
