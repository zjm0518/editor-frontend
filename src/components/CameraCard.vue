<template>
  <div class="camera">
    <el-row :gutter="20" class="camera-row">
      <el-col :span="10" class="camera-col">
        <el-card class="cameraList">
          相机类型：
          <el-select
            v-model="cameraTypePick"
            placeholder="请选择"
            class="cameraSelect"
            @change="getCameraSNList"
          >
            <el-option
              v-for="item in cameraTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button plain style="margin-left: 5px">添加相机</el-button>
          <div >
            <span>当前可用相机：</span>
            <el-select
              v-model="cameraSNPick"
              placeholder="请选择"
              class="cameraSelect"
            >
              <el-option
                v-for="item in cameraSNOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button plain @click="editCamera" style="margin-left: 5px">{{
              editCameraText
            }}</el-button>
          </div>
        </el-card>
        <el-card class="cameraList">
          <div class="slider">
            <span style="margin-right: 10px">曝光：</span>
            <el-slider
              v-model="exposureTime"
              show-input
              :min="0"
              :max="20000"
              @change="changeExposure"
              style="flex: 1"
            ></el-slider>
          </div>
          <div class="slider">
            <span style="margin-right: 10px">增益：</span
            ><el-slider
              v-model="gain"
              show-input
              :min="0"
              :max="10"
              @change="changeGain"
              style="flex: 1"
            ></el-slider>
          </div>
          <el-button plain @click="getSingleImage">单次采集</el-button>
          <el-button plain @click="showVideo">实时采集</el-button>
          <el-button plain @click="closeConnection">停止实时采集</el-button>
        </el-card></el-col
      >
      <el-col :span="10">
        <el-card id="videoCard">
          <div class="cameraText">预览窗口</div>
          <canvas id="videoCanvas" ref="videoRef"></canvas>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElCard,
  ElSlider,
  ElSelect,
  ElOption,
} from "element-plus";
import { onMounted, ref } from "vue";
import {
  getCameraParams,
  setCameraParam,
  getCameraSNList_,
  openCameraBySN,
  closeCamera_,
  stopGrabImage,
  getImage,
} from "@/api/path";

const videoRef = ref(null);
let ctx;
let socket: WebSocket;
const image = new Image(); // 创建一个 Image 对象
const exposureTime = ref(0);
const gain = ref(0);
const cameraTypeOptions = ref([
  {
    value: "DaHeng",
    label: "大恒相机",
  },
  {
    value: "Hik",
    label: "海康相机",
  },
  {
    value: "Endoscope",
    label: "内窥镜",
  },
]);
const cameraTypePick = ref("");
const precameraTypePick = ref("");
const cameraSNOptions = ref<Array<object>>([]);
const cameraSNPick = ref("");
const showVideo = function () {
  openConnection();
};

const openConnection = function () {
  socket = new WebSocket(
    "ws://localhost:8080/GetVideoStream?cameraType=" +
      cameraTypePick.value +
      "&cameraSN=" +
      cameraSNPick.value
  );
  // WebSocket 连接成功
  socket.onopen = () => {
    console.log("WebSocket connection established.");
  };

  // 接收来自服务器的消息（图像数据）
  socket.onmessage = (event) => {
    image.src = "data:image/jpeg;base64," + event.data; // 将接收到的 Base64 数据设置为图像源
  };

  // WebSocket 出现错误
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // WebSocket 连接关闭
  socket.onclose = () => {
    console.log("WebSocket connection closed.");
  };
};
const closeConnection = function () {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log("WebSocket connection closed.");
  }
  stopGrabImage({ cameraType: cameraTypePick.value });
};

const getSingleImage = function () {
  getImage({
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
  }).then((res) => {
    image.src = "data:image/jpeg;base64," + res.image;
  });
};
const getCamerap = function () {
  getCameraParams({
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
  })
    .then((res) => {
      console.log(res);
      exposureTime.value = res.ExposureTime;
      gain.value = res.Gain;
    })
    .catch((err) => {
      console.log(err);
    });
};
const changeExposure = function (newvalue) {
  const postData = {
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
    key: "ExposureTime",
    value: newvalue,
  };

  setCameraParam(postData, {
    "Content-Type": "application/x-www-form-urlencoded",
  }).then((res) => {
    console.log(res);
  });
};
const changeGain = function (newvalue) {
  const postData = {
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
    key: "Gain",
    value: newvalue,
  };

  setCameraParam(postData, {
    "Content-Type": "application/x-www-form-urlencoded",
  }).then((res) => {
    console.log(res);
  });
};
const getCameraSNList = function (value) {
  cameraSNOptions.value = [];
  cameraSNPick.value = "";
  if (precameraTypePick.value != "") {
    closeCamera_({ cameraType: precameraTypePick.value });
  }

  precameraTypePick.value = value;
  editCameraText.value = "打开设备";
  exposureTime.value = 0;
  gain.value = 0;
  getCameraSNList_({ cameraType: value }).then((res) => {
    console.log(res);
    const SNList = res.cameraSN;
    for (const sn of SNList) {
      cameraSNOptions.value.push({
        value: sn,
        label: sn,
      });
    }
  });
};
const editCameraText = ref("打开设备");
const editCamera = function () {
  if (editCameraText.value == "打开设备") {
    openCamera();
  } else {
    closeCamera();
    editCameraText.value = "打开设备";
    exposureTime.value = 0;
    gain.value = 0;
  }
};
const openCamera = function () {
  openCameraBySN({
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
  })
    .then((res) => {
      console.log("res", res);
      editCameraText.value = "关闭设备";
      getCamerap();
    })
    .catch((err) => {
      console.log(err);
    });
};
const closeCamera = function () {
  closeCamera_({
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
  });
};
onMounted(() => {
  ctx = videoRef.value.getContext("2d");

  image.src = "/preview.png";
  image.onload = function () {
    ctx.drawImage(image, 0, 0, videoRef.value.width, videoRef.value.height);
  };
});
</script>
<style scoped>
.camera {
  height: 300px;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

}
el-row {
  margin-left: 10px;
  margin-right: 20px;
}
el-col {
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 20px;
}
.camera-row {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.camera-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.cameraList {
  width: 100%;
  margin-top: 10px;
}
.cameraSelect {
  width: 35%;
}
.cameraText {
  font-size: 1vw;
  align-items: center;
  margin-bottom: 2vh;
}
#videoCard {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; 保证内容有间距，避免内容拥挤 */
  height: 100%;
  margin-top: 10px;

}
#videoCanvas {
  width: 100%;
  height: 60%;
  border: 2px #e8e6e6 solid;
}
.slider {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
