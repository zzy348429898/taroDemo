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
    }
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
