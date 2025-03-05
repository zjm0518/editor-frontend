import { defineStore } from 'pinia';
interface ConfigRecord{
  ip:string,
  model:string,
  load:Array<string>,

}
export const useConfigStore = defineStore('config', {
  state: () => ({
    formData: {
      ip:'',
      model:'',
      load:Array(5).fill("")
    } as ConfigRecord, // 存储表单数据
  }),
  actions: {
    updateFormData(data: Record<string, any>) {
      this.formData = { ...this.formData, ...data };
    },
    updateToServer(){
      fetch("/api/HandleInitConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData)
      })
        .then((response) => response.json())
        .then((data) => console.log("Response:", data))
        .catch((error) => console.error("Error:", error));
    },

  },
});
