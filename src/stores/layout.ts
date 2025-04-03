
import { defineStore } from "pinia";
export const useLayoutStore = defineStore("layout", {
  // convert to a function
  state: (): {
    showTerminal: boolean | null;
    TerminalSize:number;
    screenWidth:number;
    screenHeight:number;
    headerHeight:string;
    headerFontSize:string;
    tabFontSize:string;
    touchZone:string;
  } => ({
    showTerminal: true,
    TerminalSize:30,
    screenWidth:window.innerWidth,
    screenHeight:window.innerHeight,
    headerHeight:"30px",
    headerFontSize:"16px",
    tabFontSize:"10px",
    touchZone:"-2px"
  }),
  actions: {
    // no context as first argument, use `this` instead
    toggleShell() {
      const headerHeight = this.headerHeight=="30px"?30:50; // 你的 header-bar 高度
    const viewportHeight = window.innerHeight; // 获取视口高度（100vh）

    const percentage = (headerHeight / viewportHeight) * 100; // 计算百分比
    console.log(viewportHeight,percentage);
    //this.TerminalSize = percentage; // 更新 size，让 pane 变小
      this.showTerminal = !this.showTerminal;
      this.TerminalSize = this.showTerminal?30:percentage;
    },
    updateSize() {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight

      this.headerHeight=this.screenHeight>650?"30px":"50px";
      this.headerFontSize=this.screenHeight>650?"16px":"26px";
      this.tabFontSize=this.screenHeight>650?"16px":"26px";
      this.touchZone=this.screenHeight>650?"-2px":"-15px";
    }
  },
});
