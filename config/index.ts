const path = require("path");
// 示例, 如果你使用 `vs code` 作为开发工具， 你还可以使用注释的语法引入插件包含的声明文件，可获得类似于typescript的友好提示
/**
 * @typedef { import("@tarojs/plugin-mini-ci").CIOptions } CIOptions
 * @type {CIOptions}
 */
const CIPluginOpt = {
  weapp: {
    appid: "微信小程序appid",
    privateKeyPath:
      "密钥文件相对项目根目录的相对路径，例如 key/private.appid.key",
  },
  tt: {
    email: "348429898@qq.com",
    password: "xiaodie@2024",
    // appid: "ttb53cc3812a0d4dd401",
    // privateKeyPath:
    //   "../key/private.tt.key",
  },
  alipay: {
    appid: "支付宝小程序appid",
    toolId: "工具id",
    privateKeyPath:
      "密钥文件相对项目根目录的相对路径，例如 key/pkcs8-private-pem",
  },
  dd: {
    appid: "钉钉小程序appid,即钉钉开放平台后台应用管理的 MiniAppId 选项",
    token: "令牌，从钉钉后台获取",
  },
  swan: {
    token: "鉴权需要的token令牌",
  },
  // 版本号
  version: "1.0.0",
  // 版本发布描述
  desc: "版本描述",
};
const config = {
  projectName: "jdy-xdkj-miniprogram",
  date: "2023-7-11",
  designWidth(input) {
    // 配置 NutUI 375 尺寸
    if (input?.file?.replace(/\\+/g, "/").indexOf("@nutui") > -1) {
      return 375;
    }
    // 全局使用 Taro 默认的 750 尺寸
    return 750;
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: "src",
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [
    "@tarojs/plugin-html",
    [
      "@tarojs/plugin-inject",
      {
        components: {
          // 为 Text 组件新增埋点相关属性
          View: {
            "data-title": "''",
            "data-star-track": "''",
            "data-event-key": "''",
            "data-event-vars": "''",
            "data-st-exp": "''",
          },
          Button: {
            bindagreeprivacyauthorization: "",
          },
        },
      },
    ],
    ["@tarojs/plugin-mini-ci", CIPluginOpt],
  ],
  defineConstants: {},
  alias: {
    "@": path.resolve(__dirname, "..", "src"),
  },
  framework: "react",
  compiler: {
    type: "webpack5",
    // 仅 webpack5 支持依赖预编译配置
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    // esnextModules: ['nutui-react'],
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        },
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
};

export default function (merge) {
  if (process.env.APP_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  if (process.env.APP_ENV === "test") {
    return merge({}, config, require("./test"));
  }
  return merge({}, config, require("./prod"));
}
