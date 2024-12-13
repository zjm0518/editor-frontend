export enum StorageName {
  ACTIVE_TAB = 'active-tab',
  EDITOR_STATE = 'editor-state',
  EDITOR_VALUE = 'editor-value',
}


export interface FileData {
  label: string;
  path: string;
  isNew?: boolean;
  isDir: boolean;
  children?: Array<FileData>;
};
