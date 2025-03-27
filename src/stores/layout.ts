import { defineStore } from "pinia";
export const useLayoutStore = defineStore("layout", {
  // convert to a function
  state: (): {
    showTerminal: boolean | null;
    TerminalSize:number;
  } => ({
    showTerminal: true,
    TerminalSize:30,
  }),
  actions: {
    // no context as first argument, use `this` instead
    toggleShell() {
      const headerHeight = 20; // 你的 header-bar 高度
    const viewportHeight = window.innerHeight; // 获取视口高度（100vh）

    const percentage = (headerHeight / viewportHeight) * 100; // 计算百分比
    console.log(viewportHeight,percentage);
    //this.TerminalSize = percentage; // 更新 size，让 pane 变小
      this.showTerminal = !this.showTerminal;
      this.TerminalSize = this.showTerminal?30:percentage;
    },
  },
});
