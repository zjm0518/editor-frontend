<template>
  <div class="rgv-page-content">

  <div>a、用网线连接控制器的网口1或2 </div>
	 <div>b、将电脑的以太网 IP 设置为 192.168.192.xxx( 注：必须为192网段 )，子网掩码 255.255.255.0，网关可省略</div>
	 <div>c、打开 Roboshop Pro 在【首页】点击【刷新】按钮或手动【输入 IP】地址为【192.168.192.5】进行机器人添加,如下图所示。</div>
    <img loading="lazy" :src="imageUrl" />
 <div>  d、在【首页】的机器人列表中找到 IP 地址为【192.168.192.5】的机器人点击【开始连接】按钮进行连接。 </div>

 <div>	无线网络配置如下： </div>
	 <div>注意：无线网卡连接设置需要机器人处于网线接入机器人的状态下配置。 </div>
	 <div>a、点击机器人标签页中的【高级配置】按钮，进入高级配置页面。 </div>
    <img loading="lazy" :src="imageUrl2" />

    <div>	b、在【无线网卡配置】栏，点击【刷新】按钮，获取该区域覆盖的Wi-Fi，选择合适的Wi-Fi，输入密码，并点击【连接】按钮。</div>

<img loading="lazy" :src="imageUrl3" />
<div>c、连接成功后，点击【无线IP】，界面显示已连接网络名称与当前机器人所分配的IP</div>
<img loading="lazy" :src="imageUrl4" />
<div>d、回到【首页】，断开网线连接，选择与上述步骤无线IP相同的机器人，并点击【开始连接】</div>
<img loading="lazy" :src="imageUrl5" />
  </div>
</template>
<script lang="ts" setup>
import "/src/css/rgvconfig.css"
import img1 from '/rgv4/connect-c.png';
import img2 from '/rgv4/connect-c2.png';
import img3 from '/rgv4/connect-c3.png';
import img4 from '/rgv4/connect-c4.png';
import img5 from '/rgv4/connect-c5.png';

const imageUrl = img1;
const imageUrl2 = img2;
const imageUrl3 = img3;
const imageUrl4 = img4;
const imageUrl5 = img5;
</script>
<style scoped>


</style>
