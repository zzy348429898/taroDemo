export default defineAppConfig({
  pages: ["pages/index/index"],
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
      pages: ["index"],
    }
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
