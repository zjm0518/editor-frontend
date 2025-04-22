<template>
  <div class="configure-container">
    <div class="first-row">
      <div class="parameters border">
        <div class="title">
          <span>参数设置</span>
        </div>
        <SimpleKeyBoard></SimpleKeyBoard>
        <SimpleKeyBoard></SimpleKeyBoard>
      </div>
      <div class="IOs">
        <div class="Joint-Enable border">
          <div class="title">
            <span>关节使能</span>
          </div>
        </div>
        <div class="IO-Output border">
          <div class="title">
            <span>IO输出</span>
          </div>
        </div>
        <div class="Digit-Input border">
          <div class="title">
            <span>数字输入</span>
          </div>
        </div>
      </div>
      <div class="Coord border">
        <div class="title">
          <span>工具坐标系设置</span>
        </div>
      </div>
      <div class="Coord border">
        <div class="title">
          <span>工件坐标系设置</span>
        </div>
      </div>
    </div>
    <div class="second-row border">
      <div class="title">
        <span>负载设置</span>
      </div>
    </div>
    <div class="third-row">
      <div class="Brake border">
        <div class="title">
          <span>解抱闸</span>
        </div>
      </div>
      <div class="Protection border">
        <div class="title">
          <span>碰撞保护</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "./css/io-configure.css";
import SimpleKeyBoard from "./components/SimpleKeyBoard.vue";
</script>
