const _my = require("./api/index.js")(my);
export const getDpr = () => {
  let ratio = 1;
  let info = _my.getSystemInfoSync();
  ratio = info.pixelRatio || 2;
  return ratio;
};
export function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
      const touch = event.touches[i];
      touch.offsetX = touch.x;
      touch.offsetY = touch.y;
  }
  return event;
}
