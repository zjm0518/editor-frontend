import http from "./http.js"

// 获取文件系统
export function getDisk(params = {}, headers = {}, config = {}) {
  return http.get("/GetDisk", params, headers, config);
}

// 获取桌面文件
export function getDesktopPath(params = {}, headers = {}, config = {}) {
  return http.get("/GetDesktopPath", params, headers, config);
}

// 获取文件
export function getPath(data = {}, headers = {}, config = {}) {
  return http.post("/getPath", data, headers, config);
}

// 获取文件以及文件夹
export function getPathAndFile(data = {}, headers = {}, config = {}) {
  return http.get("/GetPathAndFile", data, headers, config);
}

// 运行文件
export function runFile(data = {}, headers = {}, config = {}) {
  return http.post("/runFile", data, headers, config);
}
