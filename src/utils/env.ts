/* ---------------------------------------------------------------------------------------
 * about:所有的关于环境的判断，包括域名、APP、小程序等
 * ---------------------------------------------------------------------------------------- */
import Taro, { getSystemInfoSync } from '@tarojs/taro';
import get from 'lodash/get';

// 环境判断类函数的统一格式
type EnvChecker = () => boolean;

/**
 * 判断代理字符串是否包含特定标识
 * @param reg
 */
function checkIfUserAgentMatch(reg: RegExp): boolean {
  const { userAgent = '' } = navigator as Navigator;
  return !!userAgent.match(reg);
}

// 仅 h5，构建后node会在window下增加一个__kd_cdnPath__字段，区分内外网（是否生产环境）
export const isProductEnv: EnvChecker = () =>
  get(window, '__kd_cdnPath__', '').includes('cdn.jdy.com');

/**
 * 网页
 */
const isH5: EnvChecker = () => Taro.getEnv() === Taro.ENV_TYPE.WEB;

/**
 * 微信小程序
 */
const isWeApp: EnvChecker = () => Taro.getEnv() === Taro.ENV_TYPE.WEAPP;
/**
 * 支付宝小程序
 */
const isAlipay: EnvChecker = () => Taro.getEnv() === Taro.ENV_TYPE.ALIPAY;
/**
 * 抖音小程序
 */
const isTT: EnvChecker = () => Taro.getEnv() === Taro.ENV_TYPE.TT;
/**
 * 企业微信
 */
const isWeCom: EnvChecker = () => isH5() && checkIfUserAgentMatch(/wxwork/);

/**
 * 钉钉
 */
const isDingDing: EnvChecker = () => isH5() && checkIfUserAgentMatch(/DingTalk/);

/**
 * APP-金蝶云
 */
const isCloudApp: EnvChecker = () => isH5() && checkIfUserAgentMatch(/kdcloud/);

/**
 * APP-精斗云
 */
const isJdyApp: EnvChecker = () => isH5() && checkIfUserAgentMatch(/oem:jdy/);

/**
 * APP。若增加了兼容的 APP，请扩张此函数
 */
const isApp: EnvChecker = () => isCloudApp() || isJdyApp();


/**
 * 安卓、ios判断
 */
const isIphone: EnvChecker = () => {
  const { model } = getSystemInfoSync();
  if (!model) {
    return false;
  }
  return model.includes('iPhone');
};


export {
  isH5,
  isWeCom,
  isDingDing,
  isCloudApp,
  isJdyApp,
  isWeApp,
  isAlipay,
  isTT,
  isApp,
  isIphone,
};
