<template>
  <div>
    <el-input
      v-model="input"
      style="width: 200px"
      ref="elInputRef"
      @blur="onInputBlur"
      @focus="(e) => showKeyboard(e)"
    />
    <teleport to="body">
    <div
      :class="keyboardClass"
      @mousedown.prevent
      :style="{
        top: keyboardPosition.top + 'px',
        left: keyboardPosition.left + 'px',
      }"
      v-show="keyboardVisible"
    ></div>
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import { onMounted, ref, watch, nextTick } from "vue";
import { v4 as uuidv4 } from "uuid";
let myKeyBoard: Keyboard;
const input = ref("0");
const lastInput = ref("0");
const elInputRef = ref(null);
const keyboardPosition = ref({ top: 0, left: 0 });
const keyboardVisible = ref(false);
const keyboardClass="simple-"+uuidv4();

const layout = {
  default: ["1 2 3", "4 5 6", "7 8 9", "0 . {backspace}", "-","{cancel} {enter}"],
  default2: [
    "1 2 3 4 5 6 7 8 9 0",
    "q w e r t y u i o p",
    "a s d f g h j k l {backspace}",
    "z x c v b n m , .",
  ],
};
const display = {
  "{backspace}": "⌫",
  "{enter}": "confirm",
  "{cancel}": "cancel",
 /*  "{enter}": "⏎", */
};
const buttonTheme = [
  {
    class: "hg-red",
    buttons: "{cancel}",
  },{
    class: "hg-green",
    buttons: "{enter}",
  },
];
const onChange = function (val: string) {
  console.log("onChange", val);
  input.value = val;

  elInputRef.value.focus();
};
const onKeyPress = function (button) {
  //console.log("onKeyPress", button);
  if(button === "{enter}") {
    console.log("enter", button,lastInput.value);

    lastInput.value = input.value;
    keyboardVisible.value = false;
    elInputRef.value.blur();
  } else if (button === "{cancel}") {


    console.log("cancel", button,lastInput.value);
    input.value = lastInput.value;

    keyboardVisible.value = false;
    elInputRef.value.blur();
  }
};
const onInputBlur = function () {
  console.log("onInputBlur");
  keyboardVisible.value = false;
  lastInput.value = input.value;
};
watch(lastInput, (val) => {
  console.log("lastInput", val);
});
const showKeyboard = async (event) => {
  await nextTick();

  const el = event.target;
  if (el) {
    const rect = el.getBoundingClientRect();
    keyboardPosition.value.top = rect.bottom +5;
    keyboardPosition.value.left = rect.left -10;
    keyboardVisible.value = true;
    console.log("keyboardPosition", keyboardPosition.value);
  }
  elInputRef.value.select();
};

watch(input, (val) => {
  myKeyBoard.setInput(val);
});

onMounted(() => {
  myKeyBoard = new Keyboard(keyboardClass, {
    onChange: onChange,
    onKeyPress: onKeyPress,
    layout: layout,
    display: display,
    buttonTheme: buttonTheme,
    theme: "hg-theme-default hg-layout-default myTheme",
  });
});
</script>
<style>
[class^="simple-"] {
  position: fixed;
  z-index: 999;
  transition: all 0.2s ease;
  width: 200px;
}

.hg-layout-default .hg-rows .hg-row .hg-red {
  background: rgb(255, 0, 0, 0.7);
  color: white;
}
.hg-layout-default .hg-rows .hg-row .hg-green {
  background: rgba(6, 237, 25, 0.7);
  color: white;
}

.el-input__wrapper.is-focus{
  box-shadow: 0 0 0 2px #409eff;
}
</style>
