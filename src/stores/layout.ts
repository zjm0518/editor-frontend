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
      this.showTerminal = !this.showTerminal;
    },
  },
});
