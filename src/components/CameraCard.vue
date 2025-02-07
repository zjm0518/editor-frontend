<template>

    <el-card id="videoCard" :class="{'selected-card':isSelected}" @click="selectThisCamera">
      <div class="cameraText">预览窗口</div>
      <canvas id="videoCanvas" ref="videoRef" width="400" height="200"></canvas>
    </el-card>

</template>
<script setup lang="ts">
import { ElCard} from "element-plus";
import { onMounted, ref, defineEmits, inject, computed} from "vue";
import {
  getCameraParams,
  setCameraParam,
  getCameraSNList_,
  openCameraBySN,
  closeCamera_,
  stopGrabImage,
  getImage,
} from "@/api/path";

const emit = defineEmits<{
  (e: "selectCamera"): void;
}>();
const props = defineProps<{
  cameraIndex:number
}>();
const selectedIndex=inject("selectedIndex")
const isSelected = computed(()=>{
  return selectedIndex.value==props.cameraIndex
})
const selectThisCamera=function(){
  selectedIndex.value=props.cameraIndex
}
const videoRef = ref(null);
let ctx;
let socket: WebSocket;
const image = new Image(); // 创建一个 Image 对象
const exposureTime = ref(0);
const gain = ref(0);

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
onMounted(() => {
  ctx = videoRef.value.getContext("2d");
  videoRef.value.width = 400;
  videoRef.value.height = 200;
  image.src = "/preview.png";
  image.onload = function () {
    ctx.drawImage(image, 0, 0, videoRef.value.width, videoRef.value.height);
  };
  console.log("selectedIndex",selectedIndex.value)
  console.log("props.cameraIndex",props.cameraIndex)
});
</script>
<style scoped>

.cameraText {
  font-size: 1vw;
  align-items: center;
  margin-bottom: 2vh;
}
#videoCard {
  display: flex;
  flex-direction: column;
  margin: 2px;
  padding: 2px;
  height: 100%;
}
#videoCanvas {
  width: 100%;
  height: 60%;
  border: 2px #e8e6e6 solid;
}
.selected-card{

  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);  /* 蓝色外框阴影 */
}
</style>
