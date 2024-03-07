// 是否debugger模式
export const debuggerMode = APP_ENV === 'development' || APP_ENV == 'test'
export const isDev = APP_ENV === 'development'
export const isTest = APP_ENV == 'test'
export const isProd = APP_ENV === 'production'
// 静态资源路径
export const staticResourcesUrl = 'https://images.youshang.com/saas/v3/xdkj'

// 用户协议url
export const userAgreementUrl = '/pages/webview/index?url=https://www.jdy.com/agreement/'
// 隐私协议url
export const privacyAgreementUrl = '/pages/webview/index?url=https://static.jdy.com/scm-policy-agree/policy-agree-assistant/index.html'
// 第三方数据共享清单
export const dataShareList = '/pages/webview/index?url=https://static.jdy.com/scm-policy-agree/data-share-list/index.html'
