export default defineAppConfig({
  pages: [
    "pages/index/index", // 全局相关 start
    // "pages/global/index",
    // "pages/global/pages/hooks/page",
    // "pages/global/pages/lifecycle/page",
    // "pages/global/pages/router/index",
    // "pages/global/pages/styles/size",
    // "pages/global/pages/styles/platform",
    // 全局相关 end
  ],
  subpackages: [
    {
      root: "pages/charts",
      pages: ["index"],
    },
    {
      root: "pages/qrCode",
      pages: ["index"],
    },
    {
      root: "pages/taroUI",
      pages: ["index"],
    },
    {
      root: "pages/nutUI",
      pages: ["index"],
    },
    {
      root: "pages/pageParams",
      pages: ["index"],
    },
    {
      root: "pages/soundInput",
      pages: ["index"],
    },
    {
      root: "pages/components",
      pages: [
        "index", // 组件相关 start
        "pages/view/view",
        "pages/scroll-view/scroll-view",
        "pages/icon/icon",
        "pages/progress/progress",
        "pages/image/image",
        // 'pages/audio/audio',
        "pages/camera/camera",
        "pages/video/video",
        "pages/swiper/swiper",
        "pages/form/form",
        "pages/input/input",
        "pages/checkbox/checkbox",
        "pages/radio/radio",
        "pages/button/button",
        "pages/text/text",
        "pages/label/label",
        "pages/page-container/page-container",
        "pages/picker/picker",
        "pages/picker-view/picker-view",
        "pages/rich-text/rich-text",
        "pages/slider/slider",
        "pages/switch/switch",
        "pages/textarea/textarea",
        // 'pages/canvas/canvas',
        // 'pages/map/map',
        "pages/navigator/navigator",
        "pages/virtual-list/virtual-list",
        "pages/movable-view/movable-view",
        // 组件相关 end
      ],
    },
    {
      root: "pages/apis/pages/index",
      pages: [
        // api 相关 start
        "index",        // api 相关 end
      ],
    },
    {
      root: "pages/apis/pages/surface",
      pages: [
        // api 相关 start
        "interactive/index",
        "navigationBar/index",
        "background/index",
        "refresh/index",
        "scroll/index",
        "tabBar/index",
        "window/index",
        "keyboard/index",
        // api 相关 end
      ],
    },
    {
      root: "pages/apis/pages/basic",
      pages: [
        // api 相关 start
        "system/index",
      ],
    },
    {
      root: "pages/apis/pages/network",
      pages: [
        "request/index",
      ],
    },
    {
      root: "pages/apis/pages/storage",
      pages: [
        "index/index",
      ],
    },
    {
      root: "pages/apis/pages/media",
      pages: [
        "image/index",
        "video/index",
        "camera/index",
      ],
    },
    {
      root: "pages/apis/pages/location",
      pages: [
        "index/index",
      ],
    },
    {
      root: "pages/apis/pages/device",
      pages: [
        "network/index",
        "screen/index",
        "phone/index",
        "accelerometer/index",
        "deviceMotion/index",
        "gyroscope/index",
        "scanCode/index",
        "vibrate/index",
      ],
    },
    {
      root: "pages/apis/pages/open-api",
      pages: [
        "settings/index",
      ],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
