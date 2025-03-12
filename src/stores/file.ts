import { defineStore } from "pinia";
import type { Resource } from "./types";
import {getResources,getUserResources,getDiskResources,getLogtPath_} from "@/api/path"
export const useFileStore = defineStore("file", {
  // convert to a function
  state: (): {
    req: Resource | null;
    oldReq: Resource | null;
    reload: boolean;
    selected: number | null;
    multiple: boolean;
    isFiles: boolean;
    path:string;
    userHomeDir:string;
  } => ({
    req: null,
    oldReq: null,
    reload: false,
    selected: null,
    multiple: false,
    isFiles: false,
    path:"",
    userHomeDir:""
  }),
  getters: {
    isListing: (state) => {
      return state.isFiles && state?.req?.isDir;
    },
  },
  actions: {
    updateRequest(value: Resource | null,paths:string) {
      //const selectedItems = this.selected.map((i) => this.req?.items[i]);
      this.oldReq = this.req;
      this.req = value;
      this.path=paths
      this.selected = null;

      if (!this.req?.items) return;
    },
    getRequest(path:string){
      getResources({path: path} ).then((res) => {
        const data = res as Resource;

        if (data.isDir) {
          // Perhaps change the any
          data.items = data.items.map((item: any, index: any) => {
            item.index = index;
            //  item.url = `${data.url}${encodeURIComponent(item.name)}`;

            return item;
          });
        }

        this.updateRequest(data as Resource,res.path);
      });
    },
    fetchUserHomeFile(){
      this.selected=null

      getUserResources().then((res) => {
        this.userHomeDir=res.userHome

        const data = res as Resource;


        data.isDir=true
        if (data.isDir) {

          // Perhaps change the any
          data.items = data.items.map((item: any, index: any) => {
            item.index = index;

            return item;
          });
        }
        this.updateRequest(data as Resource,res.path);
      });
    },

    removeSelected() {
      this.selected= null
    },
    // easily reset state using `$reset`
    clearFile() {
      this.$reset();
    },
  },
});
export const useFileStore2 = defineStore("file2", {
  // convert to a function
  state: (): {
    req: Resource | null;
    oldReq: Resource | null;
    reload: boolean;
    selected: number | null;
    multiple: boolean;
    isFiles: boolean;
    path:string;
    userHomeDir:string;
  } => ({
    req: null,
    oldReq: null,
    reload: false,
    selected: null,
    multiple: false,
    isFiles: false,
    path:"",
    userHomeDir:""
  }),
  getters: {

    isListing: (state) => {
      return state.isFiles && state?.req?.isDir;
    },
  },
  actions: {
    updateRequest(value: Resource | null,paths:string) {
      //const selectedItems = this.selected.map((i) => this.req?.items[i]);
      this.oldReq = this.req;
      this.req = value;
      this.path=paths
      this.selected = null;

      if (!this.req?.items) return;
    },
    getRequest(path:string){
      getResources({path: path} ).then((res) => {
        const data = res as Resource;

        if (data.isDir) {
          // Perhaps change the any
          data.items = data.items.map((item: any, index: any) => {
            item.index = index;
            //  item.url = `${data.url}${encodeURIComponent(item.name)}`;

            return item;
          });
        }

        this.updateRequest(data as Resource,res.path);
      });
    },
    fetchDiskFile(){
      this.selected=null

      getDiskResources().then((res) => {
        this.userHomeDir=res.userHome
        const data = res as Resource;


        data.isDir=true
        if (data.isDir) {

          // Perhaps change the any
          data.items = data.items.map((item: any, index: any) => {
            item.index = index;

            return item;
          });
        }
        this.updateRequest(data as Resource,"/");
      });
    },

    removeSelected() {
      this.selected= null
    },
    // easily reset state using `$reset`
    clearFile() {
      this.$reset();
    }
  },
});
export const useFileStore3 = defineStore("file3", {
  state: (): {
    req: Resource | null;
    oldReq: Resource | null;
    reload: boolean;
    selected: number | null;
    multiple: boolean;
    isFiles: boolean;
    path:string;
    userHomeDir:string;
    logPath:string;
  } => ({
    req: null,
    oldReq: null,
    reload: false,
    selected: null,
    multiple: false,
    isFiles: false,
    path:"",
    userHomeDir:"",logPath:""
  }),
  getters: {
    isListing: (state) => {
      return state.isFiles && state?.req?.isDir;
    },
  },
  actions: {
    updateRequest(value: Resource | null,paths:string) {
      //const selectedItems = this.selected.map((i) => this.req?.items[i]);
      this.oldReq = this.req;
      this.req = value;
      this.path=paths
      this.selected = null;

      if (!this.req?.items) return;
    },
    getRequest(path:string){
      getResources({path: path} ).then((res) => {
        const data = res as Resource;

        if (data.isDir) {
          // Perhaps change the any
          data.items = data.items.map((item: any, index: any) => {
            item.index = index;
            //  item.url = `${data.url}${encodeURIComponent(item.name)}`;

            return item;
          });
        }

        this.updateRequest(data as Resource,res.path);
      });
    },
    fetchLogFile(){
      this.selected=null
      getLogtPath_().then(res=>{
        this.getRequest(res.log_path)
        this.logPath=res.log_path
      })

    },
    fetchUserHomeFile(){
      this.selected=null

      getUserResources().then((res) => {
        this.userHomeDir=res.userHome

        const data = res as Resource;


        data.isDir=true
        if (data.isDir) {

          // Perhaps change the any
          data.items = data.items.map((item: any, index: any) => {
            item.index = index;

            return item;
          });
        }
        this.updateRequest(data as Resource,res.path);
      });
    },

    removeSelected() {
      this.selected= null
    },
    // easily reset state using `$reset`
    clearFile() {
      this.$reset();
    },
  },
});
