<template>

    <el-card id="videoCard" :class="{'selected-card':isSelected}" @click="selectThisCamera">
      <div class="cameraText">预览窗口</div>
      <canvas id="videoCanvas" ref="videoRef"></canvas>
    </el-card>

</template>
<script setup lang="ts">

import { ElCard} from "element-plus";
import { onMounted, ref, inject, computed, onUnmounted} from "vue";
import {
  stopGrabImage,
  getImage,closeCamera_
} from "@/api/path";

const props = defineProps<{
  cameraIndex:number,
  cameraType:string,
  cameraSN:string,
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
onMounted(() => {
  ctx = videoRef.value.getContext("2d");
  const ratio = window.devicePixelRatio || 1;

  //videoRef.value.width = 400*ratio;
  //videoRef.value.height = 250*ratio;
  videoRef.value.style.width=`400px`
  videoRef.value.style.height=`250px`
 // ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
 image.onload = drawImage
  image.src = "/preview.png";

  ctx.scale(ratio, ratio);
  window.addEventListener('beforeunload', sendRequestBeforeRefresh);

});

const drawImage=function(){
  videoRef.value.width=image.naturalWidth;
  videoRef.value.height=image.naturalHeight;
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

}
onUnmounted(()=>{
  window.removeEventListener('beforeunload', sendRequestBeforeRefresh);

})
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
  font-size: 1vw;
  align-items: center;
  margin-bottom: 2vh;
}
#videoCard {
  display: flex;
  flex-direction: column;
  margin: 2px;
  padding: 2px;
  height: 350px;

}
#videoCanvas {
  /* width: 100%;
  height: 60%; */
  flex:1;
  border: 2px #e8e6e6 solid;
}
.selected-card{

  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);  /* 蓝色外框阴影 */
}
</style>
