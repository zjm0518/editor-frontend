import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont2/iconfont.css';
import VsCodeSlider from "./VsCodeSlider.vue";
// import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
VsCodeSlider.install = (app) => {
    app.component('vs-code-slider', VsCodeSlider);
}
export default VsCodeSlider;
