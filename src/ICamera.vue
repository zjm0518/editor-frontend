<template>
  <div class="camera-container">
    <div class="camera-col">
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
          <el-button plain style="margin-left: 5px" @click="addCamera">添加相机</el-button>

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
        </el-card></div
      >
      <div class="camera-video">
        <camera-card
      v-for="index in cameraNum"
      :key="index"
      :camera-index="index"
    ></camera-card>
      </div>

  </div>
</template>
<script setup lang="ts">
import { provide, ref } from "vue";
import CameraCard from "./components/CameraCard.vue";
import {
  ElCard,
  ElSlider,
  ElSelect,
  ElOption,
} from "element-plus";
import {
  getCameraParams,
  setCameraParam,
  getCameraSNList_,
  openCameraBySN,
  closeCamera_,
  stopGrabImage,
  getImage,
} from "@/api/path";
const cameraNum = ref(1);
const cameraTypePick = ref("");
const precameraTypePick = ref("");
const cameraSNOptions = ref<Array<object>>([]);
const cameraSNPick = ref("");
//const exposureTime = ref(0);
//const gain = ref(0);
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
const selectedIndex=ref(1)
provide("selectedIndex",selectedIndex)
const cameraParams = ref({
  cameraTypePick: "",
  cameraSNPick: "",
  exposureTime: 0,
  gain: 0,
});
const addCamera = () => {
  cameraNum.value++;
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

</script>
<style scoped>
.camera-container {
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: auto;
}
.camera-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
  width: 40%;
}
.cameraList {
  width: 100%;
}
.cameraSelect {
  width: 35%;
}
.slider {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.camera-video {
  display: flex;
  flex-direction: column;

  height: 100%;
}
</style>
