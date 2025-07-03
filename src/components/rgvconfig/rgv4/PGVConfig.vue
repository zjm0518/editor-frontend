<template>
  <div class="rgv-page-content">

    <div>a、在模型中找到pgv，启用</div>
    <img :src="imageUrl" />
    <div>b、pgv基本参数配置</div>
    <img :src="imageUrl2" />
    <div>除了yaw外，华睿或大华相机均按上面参数配置,
yaw根据相机实际安装角度填写，分以下两种情况：
1)正常安装状态，如下图所示，此时yaw填写180°</div>
    <img :src="imageUrl3" />
    <div>2)	调试状态下，如下图所示，此时yaw填写90°（因现场调试时二维码贴于地面，更改相机安装位置满足对焦要求）</div>
    <img :src="imageUrl4" />
    <div>c、func必须选localization,
	brand选DaHua-R3051-485,
	devName填实际连接的485端口名称</div>
    <img :src="imageUrl5" />
    <div>保存模型后，点击推送，之后点击地图与控制中的运行状态，点击PGV，将二维码置于扫码相机视野内，若看到有数据，则正常连接。</div>
    <img :src="imageUrl6" />
    <div>当识别到二维码时，如图</div>
    <img :src="imageUrl7" />
    <div>注意：只有在无二维码时tag_diff_x和tag_diff_y才会完全等于0；
	若有二维码且为0，注意is_DMT_detected是不是为false，为false时，检查PGV是否正常</div>

  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/public/rgv4/pgv-config.png';
import img2 from '/public/rgv4/pgv-config2.png';

import img3 from '/public/rgv4/pgv-config3.png';
import img4 from '/public/rgv4/pgv-config4.png';
import img5 from '/public/rgv4/pgv-config5.png';
import img6 from '/public/rgv4/pgv-config6.png';
import img7 from '/public/rgv4/pgv-config7.png';


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
