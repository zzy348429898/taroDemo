import Taro from '@tarojs/taro'

const scopeNameMap: any = {
  'scope.userLocation': '位置信息',
  'scope.record': '麦克风',
  'scope.bluetooth': '蓝牙',
  'scope.writePhotosAlbum': '相册',
  'scope.camera': '摄像头'
}

/**
 *
 * @param {*} scopeStr // 'scope.record' // 权限列表 https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 * @returns
 */
export function checkDevicePermisson(scopeStr) {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success: async res => {
        const authSettingObj = res.authSetting
        if (authSettingObj[scopeStr] === true) {
          // 当前已经有权限了
          return resolve(true)
        } else if (authSettingObj[scopeStr] === false) {
          // 之前问过权限，但是拒绝了
          // 打开setting
          Taro.showModal({
            title: '提示',
            content: `需要${scopeNameMap[scopeStr]}权限！如需继续操作，请点击确定前往开启授权。`,
            success: function (res) {
              if (res.confirm) {
                //点击确定后前往授权设置页面
                Taro.openSetting()
              }
            }
          })
          return reject(false)
        } else {
          // 还没问过权限 去请求授权
          Taro.authorize({
            scope: scopeStr,
            success: res => {
              return resolve(true)
            },
            fail: async err => {
              // 拒绝授权了
              return reject(false)
            }
          })
        }
      }
    })
  })
}

const noFn = () => {}

// 是否有获取位置信息权限
export function checkTaroScopeUserLocation(fn = noFn) {
  checkDevicePermisson('scope.userLocation').then(() => {
    fn()
  })
}
// 是否有蓝牙权限
export function checkTaroScopeBluetooth(fn = noFn) {
  checkDevicePermisson('scope.bluetooth').then(() => {
    fn()
  })
}

// 是否有麦克风权限
export function checkTaroScopeRecord(fn = noFn) {
  checkDevicePermisson('scope.record').then(() => {
    fn()
  })
}

// 是否有相册权限
export function checkTaroScopeWritePhotosAlbum(fn = noFn) {
  checkDevicePermisson('scope.writePhotosAlbum').then(() => {
    fn()
  })
}
// 是否有摄像头权限
export function checkTaroScopeCamera(fn = noFn) {
  checkDevicePermisson('scope.camera').then(() => {
    fn()
  })
}

// 调用设备失败
export function scopeAuthorizeErrorHandler(scopeStr: string | string[], error) {
  if (!error?.errMsg?.includes('fail auth deny')) {
    return
  }
  Taro.getSetting({
    success: res => {
      const authSettingObj = res.authSetting
      scopeStr = typeof scopeStr === 'string' ? [scopeStr] : scopeStr
      let scopeStrTips: any = [] // 拒绝授权提示
      let needAskauthorizeScope: any = [] // 未询问授权,需要再次弹窗提示的授权
      for (let i = 0, len = scopeStr.length; i < len; i++) {
        if (authSettingObj[scopeStr[i]] === false) {
        } else if (!authSettingObj[scopeStr[i]]) {
        }
        if (authSettingObj[scopeStr[i]] === true) {
          // 当前已经有权限了
          continue
        } else if (authSettingObj[scopeStr[i]] === false) {
          // 之前问过权限，但是拒绝了
          scopeStrTips.push(scopeNameMap[scopeStr[i]] || '')
        } else {
          // 还没问过权限 去请求授权
          needAskauthorizeScope.push(scopeStr[i])
        }
      }
      // 拒绝过授权弹出提示弹窗
      if (scopeStrTips.join().length > 0) {
        Taro.showModal({
          title: '提示',
          content: `页面功能需要${scopeStrTips.join(',') || '设备'}权限！如需继续操作，请点击确定前往开启授权。`,
          success: function (res) {
            if (res.confirm) {
              //点击确定后前往授权设置页面
              Taro.openSetting()
            }
          }
        })
        return
      }
      if (needAskauthorizeScope.length > 0) {
        Taro.authorize({
          scope: needAskauthorizeScope[0], // 每次询问一个
          success: res => {},
          fail: async err => {}
        })
        return
      }
    }
  })
}
