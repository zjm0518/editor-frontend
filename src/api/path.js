import http from "./http.js"


// 获取桌面文件
export function getDesktopPath(params = {}, headers = {}, config = {}) {
  return http.get("/GetDesktopPath", params, headers, config);
}
// 获取文件系统
export function getDisk(params = {}, headers = {}, config = {}) {
  return http.get("/GetDisk", params, headers, config);
}
// 获取文件
export function getPath(data = {}, headers = {}, config = {}) {
  return http.post("/getPath", data, headers, config);
}
export function getDir(params = {}, headers = {}, config = {}) {
  return http.get("/GetDirStructure", params, headers, config);
}

// 获取文件以及文件夹
export function getPathAndFile(data = {}, headers = {}, config = {}) {
  return http.get("/GetPathAndFile", data, headers, config);
}

export function getTextFromPath(data = {}, headers = {}, config = {}) {
  return http.get("/getTextFromPath", data, headers, config);
}
// 运行文件
export function runFile(data = {}, headers = {}, config = {}) {
  return http.post("/runFile", data, headers, config);
}

export function postFile(data = {}, headers = {}, config = {}){
  return http.post("/api/AddFile", data, headers, config);
}
export function deleteFile(data = {}, headers = {}, config = {}){
  return http.post("/api/DeleteFile", data, headers, config);
}

export function renameFile(data = {}, headers = {}, config = {}){
  return http.post("/api/RenameFile", data, headers, config);
}
export function getJKSScriptPath(data = {}, headers = {}, config = {}){
  return http.get("/GetJKSPath", data, headers, config);
}
export function setJKSScriptPath(data = {}, headers = {}, config = {}){
  return http.post("/api/SetJKSPath", data, headers, config);
}
export function getLogtPath_(data = {}, headers = {}, config = {}){
  return http.get("/GetLogPath", data, headers, config);
}
export function setLogPath_(data = {}, headers = {}, config = {}){
  return http.post("/api/SetLogPath", data, headers, config);
}
export function getBatteryInfo(data = {}, headers = {}, config = {}){
  return http.get("/GetBatteryInfo", data, headers, config);
}

export function getCameraParams(data = {}, headers = {}, config = {}){
  return http.get("/GetParams", data, headers, config);
}
export function setCameraParam(data = {}, headers = {}, config = {}){
  return http.post("/api/SetParams", data, headers, config);
}
export function getCameraSNList_(data = {}, headers = {}, config = {}){
  return http.get("/GetCameraSNList", data, headers, config);
}
export function openCameraBySN(data = {}, headers = {}, config = {}){
  return http.get("/OpenCameraBySN", data, headers, config);
}
export function closeCamera_(data = {}, headers = {}, config = {}){
  return http.get("/CloseCamera", data, headers, config);
}
export function stopGrabImage(data = {}, headers = {}, config = {}){
  return http.get("/StopGrabImage", data, headers, config);
}
export function getImage(data = {}, headers = {}, config = {}){
  return http.get("/GetImage", data, headers, config);
}

export function getResources(data = {}, headers = {}, config = {}){
  return http.get("/GetResources", data, headers, config);
}
// 获取文件系统
export function getDiskResources(params = {}, headers = {}, config = {}) {
  return http.get("/GetDiskResources", params, headers, config);
}
export function getUserResources(params = {}, headers = {}, config = {}) {
  return http.get("/GetUserResources", params, headers, config);
}

export function getUserHomePath(params = {}, headers = {}, config = {}) {
  return http.get("/GetUserHomePath", params, headers, config);
}

export function uploadFiles(data = {}, headers = {}, config = {}) {
  return http.post("/api/UploadFiles", data, headers, config);
}
export function uploadDir(data = {}, headers = {}, config = {}) {
  return http.post("/api/UploadDir", data, headers, config);
}

export function downloadFile(data = {}, headers = {}, config = {}) {
  return http.get("/DownloadFile", data, headers, config);
}
export function getMachineCode(params = {}, headers = {}, config = {}) {
  return http.get("/GetMachineCode", params, headers, config);
}
export function postInitConfig(data = {}, headers = {}, config = {}) {
  return http.post("/api/HandleInitConfig", data, headers, config);
}
export function getSearchText(params = {}, headers = {}, config = {}) {
  return http.get("/SearchText", params, headers, config);
}
export function getSearchByTime(params = {}, headers = {}, config = {}) {
  return http.get("/SearchByTime", params, headers, config);
}
export function startSaveImage(data = {}, headers = {}, config = {}) {
  return http.post("/api/StartSaveImage", data, headers, config);
}

export function stopSaveImage(data = {}, headers = {}, config = {}) {
  return http.post("/api/StopSaveImage", data, headers, config);
}
export function getOpenVscode(params = {}, headers = {}, config = {}) {
  return http.get("/OpenVscode", params, headers, config);
}

export function getReConnectCamera(params = {}, headers = {}, config = {}) {
  return http.get("/ReConnectCamera", params, headers, config);
}
export function postReplaceText(data = {}, headers = {}, config = {}) {
  return http.get("/ReplaceText", data, headers, config);
}
export function openSoftware(data = {}, headers = {}, config = {}) {
  return http.get("/OpenSoftware", data, headers, config);
}
