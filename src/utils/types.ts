export enum StorageName {
  ACTIVE_TAB = 'active-tab',
  EDITOR_STATE = 'editor-state',
  EDITOR_VALUE = 'editor-value',
}


export interface FileData {
  label: string;
  path: string;
  isNew?: boolean;
  isRename?:boolean;
  isDir: boolean;
  children?: Array<FileData>;
};
export interface TreeNode {
  label: string;
  children?: TreeNode[];
  path?: string;
  isDir?: boolean;
  key?: string;
  isNew?:boolean
}
