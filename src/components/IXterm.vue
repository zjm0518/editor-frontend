<template>
  <div ref="terminalRef" class="terminal-container"></div>
</template>
<script setup lang="ts">
import { Terminal } from "@xterm/xterm";
import type { IDisposable, ITerminalOptions } from "@xterm/xterm";
import { WebLinksAddon } from "xterm-addon-web-links";
import { FitAddon } from "xterm-addon-fit";
import { getJKSScriptPath } from "@/api/path";
import { termOptions, flowControl, Command } from "@/utils/xtermConfigs";
import { onMounted, ref,onBeforeUnmount, onUnmounted,defineEmits,getCurrentInstance, inject  } from "vue";
import "@xterm/xterm/css/xterm.css";
const props = defineProps<{
  sessionID: string,
  index:number,
  name:string

}>()
const emits=defineEmits<{
  (e:"selectIndex",index:number):void
}>()
const instance=getCurrentInstance()
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const path = window.location.pathname.replace(/[/]+$/, "");
const wsUrl = [
  protocol,
  "//",
  window.location.host,
  path,
  "/ws",
  window.location.search,
].join("");
const tokenUrl = [
  window.location.protocol,
  "//",
  window.location.host,
  path,
  "/token",
].join("");

const options = {
  wsUrl: "ws://localhost:3669/ws?session_id="+props.sessionID,
  //wsUrl: "ws://localhost:7681",
  tokenUrl : tokenUrl,
  flowControl: flowControl,
  termOptions: termOptions,
};
function toDisposable(f: () => void): IDisposable {
  return { dispose: f };
}

function addEventListener(
  target: EventTarget,
  type: string,
  listener: EventListener
): IDisposable {
  target.addEventListener(type, listener);
  return toDisposable(() => target.removeEventListener(type, listener));
}

let terminal: Terminal;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();
let socket: WebSocket;
let token: string;
let disposables: IDisposable[] = [];
let opened = false;
let reconnect = true;
let doReconnect = true;
let written = 0;
let pending = 0;
//const writeFunc = (data: ArrayBuffer) => writeData(new Uint8Array(data));
const writeFunc = (data: string) => writeData(data);
const writeData = function (data: string | Uint8Array) {
  const { limit, highWater, lowWater } = options.flowControl;

  written += data.length;
  if (written > limit) {
    terminal.write(data, () => {
      pending = Math.max(pending - 1, 0);
      if (pending < lowWater) {
        socket?.send(textEncoder.encode(Command.RESUME));
      }
    });
    pending++;
    written = 0;
    if (pending > highWater) {
      socket?.send(textEncoder.encode(Command.PAUSE));
    }
  } else {
    terminal.write(data);
  }
};
const sendData = function (data: string | Uint8Array) {
  if (socket?.readyState !== WebSocket.OPEN) return;

  if (typeof data === "string") {
    const payload = new Uint8Array(data.length * 3 + 1);
    payload[0] = Command.INPUT.charCodeAt(0);
    const stats = textEncoder.encodeInto(data, payload.subarray(1));
    socket.send(payload.subarray(0, (stats.written as number) + 1));
  } else {
    const payload = new Uint8Array(data.length + 1);
    payload[0] = Command.INPUT.charCodeAt(0);
    payload.set(data, 1);
    socket.send(payload);
  }
};
const register = function <T extends IDisposable>(d: T): T {
  disposables.push(d);
  return d;
};
const dispose=function() {
        for (const d of disposables) {
            d.dispose();
        }
        disposables.length = 0;
    }
const initListeners = function () {
  register(terminal.onData((data) => sendData(data)));
  register(
    terminal.onBinary((data) =>
      sendData(Uint8Array.from(data, (v) => v.charCodeAt(0)))
    )
  );
 register(
    terminal.onResize(({ cols, rows }) => {
      console.log("resize:",props.name,currentName.value)
      if(currentName.value ==props.name) {
         const msg = JSON.stringify({ columns: cols, rows: rows });
      socket?.send(textEncoder.encode(Command.RESIZE_TERMINAL + msg));
      //terminal.focus()
      fitAddon.fit();
      }

    })
  );
    addEventListener(instance?.refs.terminalRef,"click",select)
  const resizeObserver = new ResizeObserver(() => {
      //console.log("resize");
      fitAddon.fit();
      terminal.focus();
    });
   resizeObserver.observe(terminalRef.value);
  register(
    terminal.onSelectionChange(() => {
      if (terminal.getSelection() === "") return;
      try {
        document.execCommand("copy");
      } catch (e) {
        return;
      }
    })
  );
  register(addEventListener(window, "resize", () => fitAddon.fit()));
  //register(addEventListener(window, "beforeunload", onWindowUnload));
};
const onWindowUnload=function(event: BeforeUnloadEvent) {
        event.preventDefault();
        if (socket?.readyState === WebSocket.OPEN) {
            const message = 'Close terminal? this will also terminate the command.';
            event.returnValue = message;
            return message;
        }
        return undefined;
    }
const onSocketOpen = function () {
  console.log("[ttyd] websocket connection opened");

  const msg = JSON.stringify({
    AuthToken: token,
    columns: terminal.cols,
    rows: terminal.rows,
  });
  //socket?.send(textEncoder.encode(msg));
  //socket?.send(textEncoder.encode("0\r\n"));
  if (opened) {
    terminal.reset();
    terminal.options.disableStdin = false;
    //overlayAddon.showOverlay('Reconnected', 300);
  } else {
    opened = true;
  }

  doReconnect = reconnect;
  initListeners();
  terminal.focus();
};
const onSocketData = function (event: MessageEvent) {
  // console.log(event.data)
  const rawData = event.data as string;
  //const cmd = String.fromCharCode(new Uint8Array(rawData)[0]);
  const cmd = rawData[0];
  //console.log(`[ttyd] received command: ${cmd}`);
  const data = rawData.slice(1);
  switch (cmd) {
    case Command.OUTPUT:
      writeFunc(data);
      break;
    case Command.SET_WINDOW_TITLE:
      break;
    case Command.SET_PREFERENCES:
      break;
    default:
      console.warn(`[ttyd] unknown command: ${cmd}`);
      //writeFunc(data);
      break;
  }
};
const onSocketClose=function(event: CloseEvent) {
        console.log(`[ttyd] websocket connection closed with code: ${event.code}`);

        //overlayAddon.showOverlay('Connection Closed');
        dispose();

        // 1000: CLOSE_NORMAL
        if (event.code !== 1000 && doReconnect) {
            //overlayAddon.showOverlay('Reconnecting...');
            refreshToken().then(connect);
        } else {
            const keyDispose = terminal.onKey(e => {
                const event = e.domEvent;
                if (event.key === 'Enter') {
                    keyDispose.dispose();
                    //overlayAddon.showOverlay('Reconnecting...');
                    refreshToken().then(connect);
                }
            });
            //overlayAddon.showOverlay('Press ⏎ to Reconnect');
        }
    }

  const closeConnection = function () {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log("WebSocket connection closed.");
  }
};
const refreshToken = async function () {
  try {
    const resp = await fetch(options.tokenUrl);
    if (resp.ok) {
      const json = await resp.json();
      token = json.token;
    }
  } catch (e) {
    console.error(`[ttyd] fetch ${options.tokenUrl}: `, e);
  }
};
const open = function (parent: HTMLElement) {
  terminal = new Terminal(options.termOptions);
  terminal.loadAddon(fitAddon);

  terminal.loadAddon(webLinksAddon);

  terminal.open(parent);
  fitAddon.fit();
};
const connect = function () {
  socket = new WebSocket(options.wsUrl);
  socket.binaryType = "arraybuffer";
  register(addEventListener(socket, "open", onSocketOpen));
  register(addEventListener(socket, "message", onSocketData as EventListener));
  register(addEventListener(socket, "close", onSocketClose as EventListener));
  register(addEventListener(socket, "error", () => (doReconnect = false)));
};
const terminalRef=ref<HTMLElement|null>(null)
const select=function(){
  emits("selectIndex",props.index)

}
onMounted(()=>{
  //await refreshToken();
  open(terminalRef.value);
  connect();
  console.log("props:",props)

});

onUnmounted(()=>{
  closeConnection();
  dispose();
})
onBeforeUnmount(()=>{
  dispose();
});
const currentName=inject("currentName")
const Run=async function(filepath:string) {
  const ext=getExtension(filepath)
  console.log("ext:",ext)
  const workdir=filepath.substring(0,filepath.lastIndexOf("\\")) // remove filename
  let data=""
  if(ext==".jks"){
    let jks_script_app_path;
      await getJKSScriptPath().then((res) => {
        jks_script_app_path = res["jks_script_path"];
      });
      //console.log(jks_script_app_path)

      data="cd"+" "+workdir+"\r\n"
      data += jks_script_app_path + " " + filepath + "\r\n";
  }else if(ext==".exe" || ext == ".bat"){
     data="cd"+" "+workdir+"\r\n"
    data+=filepath+"\r\n"
  }
  if(data.length==0) return

      for (let j = 0; j < data.length; j++) {
        const commandPrefix = "0"; // Command.INPUT 对应 '0'
        const modifiedData = commandPrefix + data[j];

        // 转换修改后的数据为字节数组并发送到服务器
        const payload = new Uint8Array(modifiedData.length);
        for (let i = 0; i < modifiedData.length; i++) {
          payload[i] = modifiedData.charCodeAt(i);
        }
        socket.send(payload); // 发送数据到 WebSocket
      }
    };
const Stop=function() {
      // 模拟 Ctrl+C
      const ctrlC = String.fromCharCode(3); // \x03 是 Ctrl+C
      const commandPrefix = "0"; // Command.INPUT 对应 '0'
      const modifiedData = commandPrefix + ctrlC;

      // 转换修改后的数据为字节数组并发送到服务器
      const payload = new Uint8Array(modifiedData.length);
      for (let i = 0; i < modifiedData.length; i++) {
        payload[i] = modifiedData.charCodeAt(i);
      }
      socket.send(payload); // 发送数据到 WebSocket
    };
const getExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(lastDotIndex);
};
defineExpose({
  Run,
  Stop
})
</script>
<style>
#terminal-container {
  width: auto;
  height: 100%;
  margin: 0 auto;
  padding: 0;
}
.xterm {
  padding: 5px;
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
