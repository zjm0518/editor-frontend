
import { defineStore } from 'pinia';
interface ConfigRecord{
  ip:string,
  model:string,
  load:Array<string>,
  agvip:string,
  agvname:string,

}
export const useConfigStore = defineStore('config', {
  state: () => ({
    formData: {
      ip:'',
      model:'',
      load:Array(13).fill(""),
      agvip:'',
      agvname:'robot',
    } as ConfigRecord, // 存储表单数据
  }),
  actions: {
    updateFormData(data: Record<string, any>) {
      this.formData = { ...this.formData, ...data };
    },
    updateToServer(){
      fetch("/api/InitConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData)
      })
        .then((response) => response.json())
        .then((data) => console.log("Response:", data))
        .catch((error) => console.error("Error:", error));
    },
    getFromServer(){
      fetch("/api/GetConfig", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
         
          this.formData = data;
        })
        .catch((error) => console.error("Error:", error));
    }

  },
});
