import { defineStore } from "pinia";
import type { Resource } from "./types";
import {getResources} from "@/api/path"
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
  } => ({
    req: null,
    oldReq: null,
    reload: false,
    selected: null,
    multiple: false,
    isFiles: false,
    path:""
  }),
  getters: {
   // selectedCount: (state) => state.selected.length,
    // route: () => {
    //   const routerStore = useRouterStore();
    //   return routerStore.router.currentRoute;
    // },
    // isFiles: (state) => {
    //   const layoutStore = useLayoutStore();
    //   return !layoutStore.loading && state.route._value.name === "Files";
    // },
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

    removeSelected() {
      this.selected= null
    },
    // easily reset state using `$reset`
    clearFile() {
      this.$reset();
    },
  },
});
