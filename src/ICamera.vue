<template>
  <div class="camera-container">
    <div class="camera-video">
      <camera-card
        v-for="index in cameraNum"
        :key="index"
        :camera-index="index"
        :ref="(el) => getCameraCardRef(el, index)"
        :camera-type="cameraParamsList[index - 1].cameraType"
        :camera-s-n="cameraParamsList[index - 1].cameraSN"
      ></camera-card>
    </div>

      <el-card class="camera-col">
        <div class="cameraList">


        <div class="cameraList1">

          <div>
        相机类型：
        <el-select
          v-model="cameraParamsList[selectedIndex - 1].cameraType"
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
        <el-button plain style="margin-left: 5px" @click="addCamera"
          >添加相机</el-button
        >
</div>
        <div >
          <span>当前可用相机：</span>
          <el-select
            v-model="cameraParamsList[selectedIndex - 1].cameraSN"
            placeholder="请选择"
            class="cameraSelect"
          >
            <el-option
              v-for="item in cameraParamsList[selectedIndex - 1]
                .cameraSNOptions"
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
      </div>
      <div style="width: 40vw;">
        <div class="slider">
          <span style="margin-right: 10px">曝光：</span>
          <el-slider
            v-model="cameraParamsList[selectedIndex - 1].exposureTime"
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
            v-model="cameraParamsList[selectedIndex - 1].gain"
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
      </div>
    </div>
      </el-card>
    </div>

</template>
<script setup lang="ts">
import { computed, provide, ref } from "vue";
import CameraCard from "./components/CameraCard.vue";
import { ElCard, ElSlider, ElSelect, ElOption } from "element-plus";
import {
  getCameraParams,
  setCameraParam,
  getCameraSNList_,
  openCameraBySN,
  closeCamera_,
} from "@/api/path";

const cameraNum = ref(1);
const cameraCardRefs = ref<HTMLElement[]>([]); // 存储所有 camera-card 的引用
const cameraTypePick = computed(() => {
  return cameraParamsList.value[selectedIndex.value - 1].cameraType;
});
const cameraSNPick = computed(() => {
  return cameraParamsList.value[selectedIndex.value - 1].cameraSN;
});
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
const selectedIndex = ref(1);
provide("selectedIndex", selectedIndex);
const getCameraCardRef = (el: any, index: number) => {
  if (el) cameraCardRefs.value[index - 1] = el;

  return `cameraCard${index}`; // 通过不同的索引来生成唯一的 ref 名
};

interface CameraParams {
  cameraType: string;
  cameraSN: string;
  exposureTime: number;
  gain: number;
  precameraType: string;
  precameraSN: string;
  isOpened: boolean;
  cameraSNOptions: Array<object>;
}
const cameraParamsList = ref<Array<CameraParams>>([
  {
    cameraType: "",
    cameraSN: "",
    exposureTime: 0,
    gain: 0,
    precameraType: "",
    precameraSN: "",
    isOpened: false,
    cameraSNOptions: [],
  },
]);
const addCamera = () => {
  cameraNum.value++;
  cameraParamsList.value.push({
    cameraType: "",
    cameraSN: "",
    exposureTime: 0,
    gain: 0,
    precameraType: "",
    precameraSN: "",
    isOpened: false,
    cameraSNOptions: [],
  });
};
const editCameraText = computed(() => {
  return cameraParamsList.value[selectedIndex.value - 1].isOpened
    ? "关闭设备"
    : "打开设备";
});

const editCamera = function () {
  if (editCameraText.value == "打开设备") {
    openCamera();
  } else {
    closeCamera();
    /* editCameraText.value = "打开设备";
    exposureTime.value = 0;
    gain.value = 0; */
  }
};
const openCamera = function () {
  openCameraBySN({
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
  })
    .then((res) => {
      console.log("res", res);
      //editCameraText.value = "关闭设备";
      cameraParamsList.value[selectedIndex.value - 1].isOpened = true;
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
  }).then((res) => {
    cameraParamsList.value[selectedIndex.value - 1].isOpened = false;
    cameraParamsList.value[selectedIndex.value - 1].exposureTime = 0;
    cameraParamsList.value[selectedIndex.value - 1].gain = 0;
  });
};

const getCamerap = function () {
  getCameraParams({
    cameraType: cameraTypePick.value,
    cameraSN: cameraSNPick.value,
  })
    .then((res) => {
      console.log(res);
      //exposureTime.value = res.ExposureTime;
      //gain.value = res.Gain;
      cameraParamsList.value[selectedIndex.value - 1].exposureTime =
        res.ExposureTime;
      cameraParamsList.value[selectedIndex.value - 1].gain = res.Gain;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getCameraSNList = function (value) {
  //cameraSNOptions.value = [];
  cameraParamsList.value[selectedIndex.value - 1].cameraSNOptions = [];
  cameraParamsList.value[selectedIndex.value - 1].cameraSN = "";
  if (cameraParamsList.value[selectedIndex.value - 1].precameraType != "") {
    closeCamera_({
      cameraType: cameraParamsList.value[selectedIndex.value - 1].precameraType,
      cameraSN: cameraParamsList.value[selectedIndex.value - 1].precameraSN,
    });
  }

  cameraParamsList.value[selectedIndex.value - 1].precameraType = value;
  //editCameraText.value = "打开设备";
  //exposureTime.value = 0;
  //gain.value = 0;
  getCameraSNList_({ cameraType: value }).then((res) => {
    console.log("res:", res);

    if (!res) {
      return;
    }
    const SNList = res.cameraSN;
    for (const sn of SNList) {
      cameraParamsList.value[selectedIndex.value - 1].cameraSNOptions.push({
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
const getSingleImage = function () {
  cameraCardRefs.value[selectedIndex.value - 1].getSingleImage();
};
const showVideo = function () {
  cameraCardRefs.value[selectedIndex.value - 1].showVideo();
};
const closeConnection = function () {
  cameraCardRefs.value[selectedIndex.value - 1].closeConnection();
};

</script>
<style scoped>
.camera-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* position: relative; */
  flex-direction: column;
  height: 100vh;
}
.camera-video {
  display: flex;
  overflow-y: auto;

  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}
.camera-col {
  display: flex;

  justify-content: center;
  align-items: center;

  margin-top: auto;

  width:90%;
  flex-shrink: 0;

}
.cameraList {
  width: 100%;
  display: flex;

}
.cameraList1{
  width: 40vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

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
</style>
