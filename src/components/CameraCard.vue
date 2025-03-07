<template>
  <el-card
    id="videoCard"
    :class="{ 'selected-card': isSelected, 'zoom-in': isZoomed }"
    @click="selectThisCamera"
  >
    <div class="cameraText">预览窗口</div>
    <canvas id="videoCanvas" ref="videoRef"></canvas>
    <div>
      <i
        class="iconfont2 icon2-zoomin"
        @click.stop="toggleZoom"
        style="font-size: x-large; cursor: pointer"
      ></i>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { ElCard } from "element-plus";
import { onMounted, ref, inject, computed, onUnmounted } from "vue";
import { stopGrabImage, getImage, closeCamera_ } from "@/api/path";
import "../assets/iconfont2/iconfont.css";
const props = defineProps<{
  cameraIndex: number;
  cameraType: string;
  cameraSN: string;
}>();
const selectedIndex = inject("selectedIndex");
const isSelected = computed(() => {
  return selectedIndex.value == props.cameraIndex;
});
const selectThisCamera = function () {
  selectedIndex.value = props.cameraIndex;
};
const videoRef = ref(null);
let ctx;
const dpr = window.devicePixelRatio || 1;
const isZoomed = ref(false);
let socket: WebSocket;
const image = new Image(); // 创建一个 Image 对象

const showVideo = function () {
  openConnection();
};

const openConnection = function () {
  socket = new WebSocket(
    "ws://localhost:3669/GetVideoStream?cameraType=" +
      props.cameraType +
      "&cameraSN=" +
      props.cameraSN
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
  stopGrabImage({ cameraType: props.cameraType, cameraSN: props.cameraSN });
};

const getSingleImage = function () {
  getImage({
    cameraType: props.cameraType,
    cameraSN: props.cameraSN,
  }).then((res) => {
    image.src = "data:image/jpeg;base64," + res.image;
  });
};
const toggleZoom = function () {
  isZoomed.value = !isZoomed.value;
  if (isZoomed.value) {
    videoRef.value.style.width = `60vw`;
    videoRef.value.style.height = `70vh`;
  } else {
    videoRef.value.style.width = `400px`;
    videoRef.value.style.height = `250px`;
  }
};
onMounted(() => {
  ctx = videoRef.value.getContext("2d");

  //videoRef.value.width = 400*ratio;
  //videoRef.value.height = 250*ratio;
  videoRef.value.style.width = `400px`;
  videoRef.value.style.height = `250px`;
  // ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  image.onload = drawImage;
  image.src = "/preview.png";
  ctx.imageSmoothingEnabled = false;
  window.addEventListener("beforeunload", sendRequestBeforeRefresh);
});

const drawImage = function () {
  // videoRef.value.width=image.naturalWidth*dpr;
  //videoRef.value.height=image.naturalHeight*dpr;
  //ctx.scale(dpr, dpr);
  //ctx.drawImage(image, 0, 0, image.naturalWidth*dpr, image.naturalHeight*dpr);

  videoRef.value.width = image.naturalWidth;
  videoRef.value.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
};
onUnmounted(() => {
  window.removeEventListener("beforeunload", sendRequestBeforeRefresh);
});
const sendRequestBeforeRefresh = function (event) {
  //event.preventDefault();
  //closeConnection();
  closeCamera_({
    cameraType: props.cameraType,
    cameraSN: props.cameraSN,
  });
};
defineExpose({
  getSingleImage,
  closeConnection,
  showVideo,
});
</script>
<style scoped>
.cameraText {
  font-size: large;
  align-items: center;
  margin-bottom: 2%;
}
#videoCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.5%;
}
#videoCanvas {
  /* width: 100%;
  height: 60%; */
  flex: 1;
  border: 2px #e8e6e6 solid;
}
.selected-card {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5); /* 蓝色外框阴影 */
}

.zoom-in {
  transition: transform 0.1s ease-in-out, width 0.1s ease-in-out,
    height 0.1s ease-in-out;
  position: fixed; /* 固定在屏幕上 */

  width: 70vw; /* 让它填满整个屏幕 */
  height: 90vh;
  z-index: 1000; /* 提高层级，确保在最上面 */
}
.zoom-in #videoCanvas {
  border: none;
}
</style>
