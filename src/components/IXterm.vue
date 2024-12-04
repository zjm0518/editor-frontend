<template>
  <div ref="xtermRef" class="xterm"></div>
</template>

<script lang="ts" setup>
import { onActivated, onDeactivated, ref ,onMounted} from 'vue'

import 'xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from 'xterm-addon-fit'

defineOptions({
  name: 'IXterm'
})
const props = withDefaults(
  defineProps<{
    socketUrl: string
    prefix?: string
    xtermOption?: Object
    commands?: Object
  }>(),
  {
    socketUrl: '',
    prefix: '$',
    commands: () => {
      return {}
    }
  }
)

const xtermRef = ref<HTMLElement|null>(null)
const xterm = ref<any>()
const socket = ref<any>()
const command = ref<string>('')

const initScoket = () => {
  socket.value = new WebSocket(props.socketUrl)
  socketOnClose()
  socketOnOpen()

  socketOnMessage()
  socketOnError()
}
onMounted(
  ()=>{
    initXterm()
  }
)
const socketOnOpen = () => {
  socket.value.onopen = () => {
    // 链接成功后
    initXterm()
  }
}

const socketOnMessage = () => {
  socket.value.onmessage = (e: any) => {
    // console.log('socket 收到消息', e.data)
    const data = e.data
    // const term = unref(term)
    if (xterm.value) {
      xterm.value.write(data)

      setTimeout(() => {
        prompt()
      }, 1000 * 2)
    }
  }
}

const socketOnClose = () => {
  socket.value.onclose = () => {
    // console.log('close socket')
  }
}

const socketOnError = () => {
  socket.value.onerror = () => {
    // console.log('socket 链接失败')
  }
}

// 发送消息
const onSend = (text: string) => {
  text = text.replace(/\\\\/, '\\')
  socket.value?.send(text)
  // 失去焦点
  xterm.value.blur()
}
let fitAddon: any
// 初始化xterm
const initXterm = () => {
  const options = {
    fontSize: 14,

    // rendererType: 'canvas', //渲染类型
    // rows: _this.rows, //行数
    // cols: _this.cols, // 不指定行数，自动回车后光标从下一行开始
    convertEol: true, //启用时，光标将设置为下一行的开头
    // scrollback: 50, //终端中的回滚量
    disableStdin: false, //是否应禁用输入
    // cursorStyle: "underline", //光标样式
    cursorBlink: true, //光标闪烁
    theme: {
      foreground: '#ECECEC', //字体
      background: '#000000', //背景色
      cursor: 'help' //设置光标
    }
  }

  const xtermOptions = Object.assign(options, props.xtermOption)
  xterm.value = new Terminal(xtermOptions)

  xtermData()

  fitAddon = new FitAddon()
  xterm.value.loadAddon(fitAddon)
  xterm.value.open(xtermRef.value!)
  fitAddon.fit()
  xterm.value.focus()
}

// 输入内容
const xtermData = () => {
  xterm.value.onData((e: any) => {
    console.log(e)

    switch (e) {
      case '\u0003': // Ctrl+C
        xterm.value.write('^C')
        prompt()
        break
      case '\r': // Enter
        if (command.value === '') {
          prompt()
          break
        }
        runCommand(command.value)
        xterm.value.write('\r\n')
        command.value = ''
        break
      case '\u007F': // Backspace (DEL)
        // Do not delete the prompt
        if (xterm.value._core.buffer.x > 2) {
          xterm.value.write('\b \b')
          if (command.value.length > 0) {
            command.value = command.value.substr(0, command.value.length - 1)
          }
        }
        break
      default: // Print all other characters for demo
        if ((e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) || e >= '\u00a0') {
          command.value += e
          xterm.value.write(e)
        }
    }
  })
}

const prompt = () => {
  command.value = ''
  // 换行
  xterm.value.write(`\r\n${props.prefix} `)
  // 获取焦点
  xterm.value.focus()
}

const defaultCommand = {
  clear: {
    f: () => {
      xterm.value?.clear()
      prompt()
    }
  }
}

// 执行命令 发送消息
const runCommand = (text: string) => {
  const commandStr = text.trim().split(' ')[0]
  if (commandStr.length > 0) {
    const commandsObj = { ...defaultCommand, ...props.commands }
    if (commandStr in commandsObj) {
      ;(commandsObj as any)[commandStr].f()
      return
    }
  }
  onSend(commandStr)
}

const resize = () => {
  // 适应父容器的大小
  fitAddon.fit()

  // console.log(xterm.value)
  // // 如果需要，可以获取终端的宽度和高度
  // const { cols, rows } = xterm.value
  // console.log(`Terminal size: cols = ${cols}, rows = ${rows}`)
}

onActivated(() => {
  initScoket()
  window.addEventListener('resize', resize)
})

onDeactivated(() => {
  socket.value?.close()
  window.removeEventListener('resize', resize)
})

defineExpose({
  resize
})
</script>

<style lang="css">

</style>
