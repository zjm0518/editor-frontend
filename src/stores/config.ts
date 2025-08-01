
import { defineStore } from 'pinia';
interface ConfigRecord{
  ip:string,
  model:string,
  load:Array<string>,
  agvip:string,
  agvname:string,
  webpath:string,

  hinsonPath?: string;
  kincoservoPath?: string;
  svstudioPath?: string;
  roboshopProPath?: string;
  plcip: string; // PLC IP 地址
  plcport:string; // PLC 端口
  modbusip:string; // Modbus IP 地址
  modbusport:string; // Modbus 端口
  restart: boolean; // 是否重启
}
export const useConfigStore = defineStore('config', {
  state: () => ({
    formData: {
      ip:'',
      model:'',
      load:Array(13).fill(""),
      agvip:'',
      agvname:'robot',
      webpath:"",
      hinsonPath: '',
      kincoservoPath: '',
      svstudioPath: '',
      roboshopProPath: '',
      plcip:'',
      restart: false, // 是否重启
      plcport: '',
      modbusip: '',
      modbusport: '',
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
  async getFromServer() {
  try {
    const response = await fetch("/api/GetConfig", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    this.formData = data;
    console.log("Response:", data);

    // 将 load 扩展为 13 个元素
    if (this.formData.load.length < 13) {
      this.formData.load = this.formData.load.concat(
        Array(13 - this.formData.load.length).fill("")
      );
    }

    return true; // 成功返回
  } catch (error) {
    console.error("Error:", error);
    return false; // 错误返回
  }
}

  },
});
