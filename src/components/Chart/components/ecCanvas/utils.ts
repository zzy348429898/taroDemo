import { isAlipay, isWeApp } from "@/utils/env";
import Taro from "@tarojs/taro";

export function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}
export function canUseNewCanvasFn(){
  const compare = compareVersion(Taro.getSystemInfoSync().SDKVersion, "2.9.0");
  return compare > 0;
}
export function compareVersion(v1, v2) {
  if(isAlipay()){
    return 1
  } else if(isWeApp()){
    return (compareVersionWx(v1, v2))
  } else {
    return 1
  }
}
function compareVersionWx(v1params, v2params) {
  let v1 = v1params.split(".");
  let v2 = v2params.split(".");
  const len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}