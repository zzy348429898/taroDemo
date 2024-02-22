import type { UserConfigExport } from "@tarojs/cli";
export default {
  env: {
    NODE_ENV: `"${process.env.NODE_ENV}"`,
  },
  defineConstants: {
    APP_ENV: JSON.stringify(process.env.APP_ENV),
  },
  mini: {},
  h5: {},
} satisfies UserConfigExport;
