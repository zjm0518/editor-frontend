<template>
  <el-card
    id="videoCard"
    :class="{ 'selected-card': isSelected, 'zoom-in':  isZoomed }"
    @click="selectThisCamera"
  >
    <div class="camera-header">
      <div class="cameraText">预览窗口</div>
      <i
        class="iconfont2 icon2-guanbi1 close"
        style="font-size: x-large; cursor: pointer"
        v-if="cameraNum > 1"
        @click.stop="closeCamera"
      ></i>
    </div>

    <canvas id="videoCanvas" ref="videoRef"></canvas>

    <div style="display:flex;justify-content:flex-end;">
      <el-button @click="openDialog">存图设置</el-button>
      <el-button @click="startSaving" :disabled="saving">开始保存</el-button>
      <el-button @click="stopSaving" :disabled="!saving">停止保存</el-button>
      <i
        class="iconfont2 icon2-zoomin"
        @click.stop="toggleZoom"
        style="font-size: x-large; cursor: pointer"
        v-if="!isZoomed"
      ></i>
      <i
        class="iconfont2 icon2-zoom-in"
        @click.stop="toggleZoom"
        style="font-size: x-large; cursor: pointer"
        v-if="isZoomed"
      ></i>
    </div>
  </el-card>
  <el-dialog
    v-model="savedialogVisible"
    title="存图设置"
    width="500"
  >
  <div class="saveDialog">
  <div>
      <el-button @click="selectDirectory">选择保存路径</el-button>
      <span style="margin-left: 2%;">{{    filename }}</span>
    </div>
    <div>
      <span style="margin-right: 2%;">时间间隔</span>
      <el-input-number v-model="saveInterval" :precision="1" :step="0.1" :min="0.1" />
      <span style="margin-left: 2%;">秒</span>
    </div></div>
    <template #footer>
      <div class="dialog-footer">
        
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </div>

    </template>

  </el-dialog>
</template>
<script setup lang="ts">
import { ElCard,ElButton } from "element-plus";
import { onMounted, ref, inject, computed, onUnmounted } from "vue";
import { stopGrabImage, getImage, closeCamera_ } from "@/api/path";
import "../assets/iconfont2/iconfont.css";

const props = defineProps<{
  cameraIndex: number;
  cameraType: string;
  cameraSN: string;
}>();
const selectedIndex = inject("selectedIndex");
const cameraNum = inject("cameraNum");
const zoomedCardIndex:number|null|undefined=inject("zoomedCardIndex")
const savedialogVisible=ref(false)
const isSelected = computed(() => {
  return selectedIndex.value == props.cameraIndex;
});
const selectThisCamera = function () {
  //console.log(zoomedCardIndex.value,props.cameraIndex,isZoomed.value)
  selectedIndex.value = props.cameraIndex;
};
const videoRef = ref(null);
let ctx;
const dpr = window.devicePixelRatio || 1;
const isZoomed = computed(() => zoomedCardIndex.value === props.cameraIndex);
let socket: WebSocket;
const image = new Image(); // 创建一个 Image 对象
const emits = defineEmits<{
  (e: "closeByIndex", cameraIndex: number): void;
  (e:"connectionSuccess",isGrabbing:boolean):void;
}>();
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
    emits("connectionSuccess", true);

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
  image.src = "";
  if(props.cameraType == "" || props.cameraSN == ""){
    return;
  }
  stopGrabImage({ cameraType: props.cameraType, cameraSN: props.cameraSN }).then(res=>{
    emits("connectionSuccess", false);
  });

};
const closeCamera = function () {
  if (zoomedCardIndex.value === props.cameraIndex) {
    zoomedCardIndex.value =  null;// 关闭时取消放大状态
    videoRef.value.style.width = "400px"; // 恢复宽度
    videoRef.value.style.height = "250px"; // 恢复高度
  }
   // **清除 Canvas 内容**
   if (ctx) {
    ctx.clearRect(0, 0, videoRef.value.width, videoRef.value.height);
  }
  console.log("zoomedCardIndex.value",zoomedCardIndex.value)
  if (props.cameraType == "" || props.cameraSN == "") {
    emits("closeByIndex", props.cameraIndex);
    return;
  }
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log("WebSocket connection closed.");
  }
  closeCamera_({
    cameraType: props.cameraType,
    cameraSN: props.cameraSN,
  });
  emits("closeByIndex", props.cameraIndex);
};

const getSingleImage = function () {
  getImage({
    cameraType: props.cameraType,
    cameraSN: props.cameraSN,
  }).then((res) => {
    image.src = "data:image/jpeg;base64," + res.image;
    emits("connectionSuccess", false);
  });
};
const toggleZoom = function () {
  console.log("toggle",props.cameraIndex)
  if (zoomedCardIndex.value === props.cameraIndex) {
    zoomedCardIndex.value = null; // 取消放大
    videoRef.value.style.width = `400px`;
    videoRef.value.style.height = `250px`;
  } else {
    zoomedCardIndex.value = props.cameraIndex; // 只放大当前卡片
    videoRef.value.style.width = `60vw`;
    videoRef.value.style.height = `70vh`;
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
  closeConnection();
});
const sendRequestBeforeRefresh = function (event) {
  //event.preventDefault();
  //closeConnection();
  if (props.cameraType == "" || props.cameraSN == "") {
    return;
  }
  closeCamera_({
    cameraType: props.cameraType,
    cameraSN: props.cameraSN,
  });
};
let dirHandle = null;
const filename=ref("")
const saving=ref(false)
let saveIntervalId:number|undefined;
const saveInterval = ref(1.0)
async function selectDirectory() {
  dirHandle = await window.showDirectoryPicker();
  filename.value=dirHandle.name;
  //saveCanvasToDir(1)
}
async function saveCanvasToDir() {
  //if (!dirHandle) return alert("请先选择保存文件夹");

  const blob = await new Promise(resolve => videoRef.value.toBlob(resolve, 'image/jpeg'));

  const fileHandle = await dirHandle.getFileHandle(`${getFormattedTimestamp()}.jpg`, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}
function startSaving(canvas) {
  if (!dirHandle) {
    alert("请先选择保存文件夹");
    return;
  }

  saving.value = true;

   saveIntervalId = setInterval(async () => {
    if (!saving.value) {
      clearInterval(saveIntervalId);
      return;
    }

    await saveCanvasToDir();
  }, saveInterval.value*1000);
}

function stopSaving() {
  if (saveIntervalId !== undefined) {
    clearInterval(saveIntervalId);
    saveIntervalId = undefined;
    saving.value=false;
    console.log("已停止保存图像");
  }
}
function getFormattedTimestamp() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  const millisecond=pad(now.getMilliseconds());

  return `${year}-${month}-${day}_${hour}-${minute}-${second}-${millisecond}`;
}
const handleConfirm=function(){
  savedialogVisible.value=false;
  saving.value=false;
}
const openDialog=function(){
  savedialogVisible.value=true;
  saving.value=false;
}
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
  position: fixed; /* 固定在屏幕上 */
  width: 70vw; /* 让它填满整个屏幕 */
  height: 90vh;
  z-index: 1000; /* 提高层级，确保在最上面 */
}

.camera-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.close:hover {
  background-color: #f0f0f0;
  border: none;
  outline: none;
  box-shadow: none;
}
.saveDialog{
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
