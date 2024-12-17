import type { ITerminalOptions,ITheme } from "@xterm/xterm";
export enum Command {
  // server side
  OUTPUT = '0',
  SET_WINDOW_TITLE = '1',
  SET_PREFERENCES = '2',

  // client side
  INPUT = '0',
  RESIZE_TERMINAL = '1',
  PAUSE = '2',
  RESUME = '3',
}
export interface FlowControl {
  limit: number;
  highWater: number;
  lowWater: number;
}

export interface XtermOptions {
  wsUrl: string;
  tokenUrl: string;
  flowControl: FlowControl;
  termOptions: ITerminalOptions;
}

export const termOptions = {
  fontSize: 13,
  fontFamily: 'Consolas,Liberation Mono,Menlo,Courier,monospace',
  theme: {
      foreground: '#d2d2d2',
      background: '#222222',
      cursor: '#adadad',
      black: '#000000',
      red: '#d81e00',
      green: '#5ea702',
      yellow: '#cfae00',
      blue: '#427ab3',
      magenta: '#89658e',
      cyan: '#00a7aa',
      white: '#dbded8',
      brightBlack: '#686a66',
      brightRed: '#f54235',
      brightGreen: '#99e343',
      brightYellow: '#fdeb61',
      brightBlue: '#84b0d8',
      brightMagenta: '#bc94b7',
      brightCyan: '#37e6e8',
      brightWhite: '#f1f1f0',
  } as ITheme,
  allowProposedApi: true,
} as ITerminalOptions;

export const flowControl={
  limit:100000,
  highWater:10,
  lowWater:4
} as FlowControl;
