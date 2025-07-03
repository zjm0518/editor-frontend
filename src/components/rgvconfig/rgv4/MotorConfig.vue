<template>
  <div class="rgv-page-content">

    <div>a、启用CAN，在模型名称下方点击全部，找到CAN</div>
    <img :src="imageUrl" />
    <div>在右边属性窗口勾选启用设备，其他参数如图所示</div>
    <img :src="imageUrl2" />
    <div>b、motor相关配置参数解释，通常车头方向为x正，motor为左轮电机，motor1为右轮电机</div>
    <img :src="imageUrl3" />
    <div>c、motor配置，basic配置如下</div>
    <img :src="imageUrl4" />
    <div>上面的y为两轮中心距的一半，左边为y+.
	func必须选walk，车轮半径和减速比配置如图</div>
    <img :src="imageUrl5" />
    <div>步科一体轮的半径为0.082，减速比为9
	其他参数如图配置</div>
    <img :src="imageUrl6" />
    <div>d、motor1配置.
	y的坐标必须是负值，canID为2，勾选inverse（反向），其他与motor一致</div>
    <img :src="imageUrl7" />
    <div>	注意：若前进方向反了，则勾选motor的inserse，取消motor1的inserse
	修改完成后，点击保存模型并推送，使用地图与控制中的虚拟方向或平动转动，测试车轮是否转动。</div>



  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/motor-config.png';
import img2 from '/public/rgv4/motor-config2.png';
import img3 from '/public/rgv4/motor-config3.png';
import img4 from '/public/rgv4/motor-config4.png';
import img5 from '/public/rgv4/motor-config5.png';
import img6 from '/public/rgv4/motor-config6.png';
import img7 from '/public/rgv4/motor-config7.png';

const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;
const imageUrl5 = img5;
const imageUrl6 = img6;
const imageUrl7 = img7;


</script>
<style scoped>


</style>
