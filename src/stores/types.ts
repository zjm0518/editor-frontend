export interface ResourceBase {
  path: string;
  name: string;
  size: number;
  extension: string;
  modified: string; // ISO 8601 datetime
  mode: number;
  isDir: boolean;
  isSymlink: boolean;
  type: ResourceType;
  url: string;
}

export interface Resource extends ResourceBase {
  items: ResourceItem[];
  numDirs: number;
  numFiles: number;
  sorting: Sorting;
  hash?: string;
  token?: string;
  index: number;
  subtitles?: string[];
  content?: string;
}

export interface ResourceItem extends ResourceBase {
  index: number;
  subtitles?: string[];
}

export type ResourceType =
  | "video"
  | "audio"
  | "image"
  | "pdf"
  | "text"
  | "blob"
  | "textImmutable";

export type DownloadFormat =
  | "zip"
  | "tar"
  | "targz"
  | "tarbz2"
  | "tarxz"
  | "tarlz4"
  | "tarsz"
  | null;

export interface ClipItem {
  from: string;
  name: string;
}

export interface BreadCrumb {
  name: string;
  url: string;
}

export class StatusError extends Error {
  constructor(
    message: any,
    public status?: number
  ) {
    super(message);
    this.name = "StatusError";
  }
}
type PopupAction = (e: Event) => void;
export interface PopupProps {
  prompt: string;
  confirm?: any;
  action?: PopupAction;
  props?: any;
}


