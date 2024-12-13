<template>
  <div ref="terminal" class="terminal-container"></div>
</template>

<script>
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { WebLinksAddon } from "xterm-addon-web-links";
import { FitAddon } from "xterm-addon-fit";
export default {
  name: "TerminalComponent",
  mounted() {
    this.termOptions = {
      fontSize: 15,
      fontFamily: "Consolas,Liberation Mono,Menlo,Courier,monospace",
      theme: {
        foreground: "#d2d2d2",
        background: "#222222",
        cursor: "#adadad",
        black: "#000000",
        red: "#d81e00",
        green: "#5ea702",
        yellow: "#cfae00",
        blue: "#427ab3",
        magenta: "#89658e",
        cyan: "#00a7aa",
        white: "#dbded8",
        brightBlack: "#686a66",
        brightRed: "#f54235",
        brightGreen: "#99e343",
        brightYellow: "#fdeb61",
        brightBlue: "#84b0d8",
        brightMagenta: "#bc94b7",
        brightCyan: "#37e6e8",
        brightWhite: "#f1f1f0",
      },
      allowProposedApi: true,

    };
    // 创建一个新的终端实例
    this.term = new Terminal(this.termOptions);

    // 初始化终端并将其附加到页面元素上
    this.term.open(this.$refs.terminal);

    // 启用链接点击支持
    this.term.loadAddon(new WebLinksAddon());
    const fitaddon=new FitAddon()
    this.term.loadAddon(fitaddon)
    fitaddon.fit()
    window.addEventListener('resize',()=>
    {

      fitaddon.fit()
  })
   const resizeObserver = new ResizeObserver(() => {
    console.log("resize")
    fitaddon.fit()
    });
    resizeObserver.observe(this.$refs.terminal)
    // 创建 WebSocket 连接到 ttyd 后端
    this.socket = new WebSocket("ws://192.168.1.107:7681", ["tty"]);

    this.socket.binaryType = "arraybuffer"; // 设置 WebSocket 使用二进制数据格式

    this.socket.onopen = () => {
      console.log("WebSocket connected");

      const msg = JSON.stringify({
        AuthToken: ""
      });

      // 将消息编码为字节数组并发送给 WebSocket 服务器
      this.socket.send(new TextEncoder().encode(msg));

      // 将 WebSocket 输入输出与终端连接
      this.term.onData((data) => {
        // 确保数据以 Command.INPUT 头发送
        const commandPrefix = "0"; // Command.INPUT 对应 '0'
        const modifiedData = commandPrefix + data;

        // 转换修改后的数据为字节数组并发送到服务器
        const payload = new Uint8Array(modifiedData.length);
        for (let i = 0; i < modifiedData.length; i++) {
          payload[i] = modifiedData.charCodeAt(i);
        }
        this.socket.send(payload); // 发送数据到 WebSocket
      });

      this.socket.onmessage = (event) => {
        // 解码接收到的二进制数据
        const rawData = event.data;

        // 将数据转换为 Uint8Array 以便处理
        const dataArray = new Uint8Array(rawData);

        // 去掉前缀 "0" (即 Command.OUTPUT 的前缀)
        // 我们假设第一个字节是 "0" (Command.OUTPUT)，因此从索引 1 开始
        const outputData = dataArray.slice(1); // 去掉第一个字节

        // 使用去掉前缀的数据更新终端
        const decodedData = new TextDecoder().decode(outputData);
        this.term.write(decodedData);
      };
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  },
  beforeUnmount() {
    // 清理终端实例
    if (this.term) {
      this.term.dispose();
    }
  },
  sendData(data) {
    // 确保数据以 Command.INPUT 头发送
    const commandPrefix = "0"; // Command.INPUT 对应 '0'
    const modifiedData = commandPrefix + data;

    // 转换修改后的数据为字节数组并发送到服务器
    const payload = new Uint8Array(modifiedData.length);
    for (let i = 0; i < modifiedData.length; i++) {
      payload[i] = modifiedData.charCodeAt(i);
    }
    this.socket.send(payload); // 发送数据到 WebSocket
  },

  methods: {
    Run(jkspath) {

      const data = "C:\\Users\\wy156\\Desktop\\Go\\jk_robot_app_windows\\jk_script_app.exe" + " " + jkspath+"\r\n";

      for (let j = 0; j < data.length; j++) {
        const commandPrefix = "0"; // Command.INPUT 对应 '0'
      const modifiedData = commandPrefix + data[j];

      // 转换修改后的数据为字节数组并发送到服务器
      const payload = new Uint8Array(modifiedData.length);
      for (let i = 0; i < modifiedData.length; i++) {
        payload[i] = modifiedData.charCodeAt(i);
      }
      this.socket.send(payload); // 发送数据到 WebSocket
      }

    },
    Stop(){
          // 模拟 Ctrl+C
      const ctrlC = String.fromCharCode(3); // \x03 是 Ctrl+C
      const commandPrefix = "0"; // Command.INPUT 对应 '0'
      const modifiedData = commandPrefix + ctrlC;

      // 转换修改后的数据为字节数组并发送到服务器
      const payload = new Uint8Array(modifiedData.length);
      for (let i = 0; i < modifiedData.length; i++) {
        payload[i] = modifiedData.charCodeAt(i);
      }
      this.socket.send(payload); // 发送数据到 WebSocket
    }
  },
};
</script>

<style>
.xterm {
  height: 100%;
}
/* 滚动条css chrome/safari */
::-webkit-scrollbar {
	width: 15px;

}

::-webkit-scrollbar-thumb {
	background-color: rgba(111, 113, 117, 0.4);

}
</style>
