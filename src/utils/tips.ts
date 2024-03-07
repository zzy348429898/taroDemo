import Taro from '@tarojs/taro'
const DURATION_TOAST = 3000
const DURATION_SUCCESS = 1500
const DURATION_ERROR = 5000
const WAIT_HIDE = 500

/**
 * 提示与加载工具类
 */

export const showLoading = (title = '', mask = false) => {
  Taro.showLoading({
    title,
    mask
  })
}

export const hideLoading = () => {
  Taro.hideLoading()
}

export default class Tips {
  static isLoading = false
  static errorModelOpen = false

  /**
   * 信息提示
   */
  static toast(title: string, onHide?: () => void, duration?: number): void {
    Taro.showToast({
      title,
      icon: 'none',
      mask: false,
      duration: duration || DURATION_TOAST
    })
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, WAIT_HIDE)
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = '加载中', force = false) {
    if (this.isLoading && !force) {
      return
    }
    this.isLoading = true
    if (Taro.showLoading) {
      Taro.showLoading({
        title,
        mask: true
      })
    } else {
      Taro.showNavigationBarLoading()
    }
  }

  /**
   * 加载完毕
   */
  static loaded() {
    let duration = 0
    if (this.isLoading) {
      this.isLoading = false
      if (Taro.hideLoading) {
        Taro.hideLoading()
      } else {
        Taro.hideNavigationBarLoading()
      }
      duration = WAIT_HIDE
    }
    // 隐藏动画大约500ms，避免后面直接toast时的显示bug
    return new Promise(resolve => setTimeout(resolve, duration))
  }

  /**
   * 弹出提示框
   */
  static success(title: string, duration = DURATION_SUCCESS) {
    Taro.showToast({
      title,
      icon: 'success',
      mask: true,
      duration
    })
    if (duration > 0) {
      return new Promise(resolve => setTimeout(resolve, duration))
    }
  }

  /**
   * 错误提示模态框
   * @param content
   * @param callback
   */
  static errorModel(content: string, callback?: () => void, confirmText?: string): Promise<any> {
    const CONTENT_MAX_LENGTH = 500 // 最大字数，避免消息全屏
    if (this.errorModelOpen) return Promise.reject()
    this.errorModelOpen = true

    if (content.length > CONTENT_MAX_LENGTH) {
      content = `${content.slice(0, CONTENT_MAX_LENGTH)}...`
    }

    // 一分钟后自动设置为false, 解决错误框弹出后不手动点关闭，直接返回的情况
    setTimeout(() => {
      this.errorModelOpen = false
    }, DURATION_ERROR)
    return Taro.showModal({
      title: '提示',
      content,
      showCancel: false,
      confirmText: confirmText || '我知道了',
      confirmColor: '#2386EE',
      success: (result: any) => {
        this.errorModelOpen = false
        result.confirm && callback && callback()
      }
    })
  }
  /**
   * 确认提示模态框
   * @param content 提示内容
   * @param confirmText 确认按钮
   * @param confirmCallBack 确认回调
   * @param cancelCallBack 取消回调
   */
  static confirmModel(
    content: string,
    confirmText?: string,
    confirmCallBack?: () => void,
    cancelCallBack?: () => void,
    cancelText?: string
  ) {
    return Taro.showModal({
      title: '操作确认',
      content,
      showCancel: true,
      confirmText: confirmText || '确定',
      cancelText: cancelText || '取消',
      confirmColor: '#2386EE',
      success: res => {
        if (res.confirm) {
          confirmCallBack && confirmCallBack()
        } else {
          cancelCallBack && cancelCallBack()
        }
      }
    })
  }
}
