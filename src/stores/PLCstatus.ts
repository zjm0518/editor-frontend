
import { defineStore } from "pinia";
export const usePLCStore = defineStore("plc-status", {
  // convert to a function
  state: (): {
    M: number[];
    D: number[];
     ws: WebSocket | null; // 保存 WebSocket 实例
  } => ({
    M: [],
    D: [],
    ws: null
  }),
  actions: {
     connectWebSocket() {
      if (this.ws) {
        console.warn("WebSocket 已连接");
        return;
      }

      // 创建连接
      const url = "ws://192.168.10.112:3669/ReadPLCStatus"; // 改成你的后端 WS 地址
      this.ws = new WebSocket(url);

      // 连接成功
      this.ws.onopen = () => {
        console.log("WebSocket 已连接");
      };

      // 接收消息
      this.ws.onmessage = (event) => {
        try {

          const data = JSON.parse(event.data);
          // console.log("收到消息:", data);
          if (Array.isArray(data.M)) {
            this.M = data.M;
          }
          if (Array.isArray(data.D)) {
            this.D = data.D;
          }
        } catch (err) {
          console.error("解析 WebSocket 消息失败", err);
        }
      };

      // 连接关闭
      this.ws.onclose = () => {
        console.log("WebSocket 已关闭");
        this.ws = null;
        // 可选：重连机制
        setTimeout(() => this.connectWebSocket(), 3000);
      };

      // 出错处理
      this.ws.onerror = (err) => {
        console.error("WebSocket 错误", err);
      };
    },

  },
});
