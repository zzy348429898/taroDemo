/* eslint-disable no-unused-vars */
import socketFactory, { SocketTask, CallbackFunc, OnErrorCallbackResult, OnCloseCallbackResult } from './socketFactory'

/**
 * socket消息格式
 */
export type SocketMsg = any

type SendParam = {
  /** 需要发送的内容 */
  data: string | ArrayBuffer
  success?: CallbackFunc
  fail?: CallbackFunc
  complete?: CallbackFunc
}

type CommonCallbackFunc = () => void

type OnMessageCallback = (data: SocketMsg) => void

type OnErrorCallbackFunc = (res: OnErrorCallbackResult) => void

type OnCloseCallbackFunc = (res: OnCloseCallbackResult) => void

enum closeCode {
  FORCE = 1000, // 主动关闭
  Else = 1000
}

/**
 * socketTask业务封装
 */
export class ShortSocketTask {
  private socketTask: SocketTask | null = null
  private reconnect = true // 是否重连
  private reconnectInterval = 1000 // 重连时间间隔
  private maxReconnectInterval = 5000 // 最大重连时间间隔
  private reconnectDecay = 1.5 // 重连时间计算基数
  private maxReconnect = 100 // 最大重连次数
  private forceClose = false // 是否主动关闭连接
  private reConnectTimes = 0 // 重连接次数
  private reconnectTimer
  private openTimer
  private messageCallbackList: OnMessageCallback[] = []
  private errorCallbackList: OnErrorCallbackFunc[] = []
  private closeCallbackList: OnCloseCallbackFunc[] = []
  private openCallbackList: CommonCallbackFunc[] = []
  private opened = false // 记录open状态
  private socketUrl: string = ''

  /**
   * 创建socketTask对象
   * @returns
   */
  public async createSocketTask(url) {
    this.socketUrl = url // socket连接地址
    const task = await socketFactory.createTask({ url: this.socketUrl })
    if (task !== false) {
      this.socketTask = task
      this.openTimer = setTimeout(() => {
        this.close()
      }, 3000)
      task.onOpen(() => {
        console.log('ShortSocket onOpen')
        this.opened = true
        this.reConnectTimes = 0 // 重连次数清零
        this.openTimer && clearTimeout(this.openTimer)
        this.listenMessage(task).listenClose(task).listenError(task)
        this.openCallbackList.forEach(f => f())
      })
    } else {
      this.close()
    }
  }

  /**
   * 内部方法，监听消息
   * @param task
   */
  private listenMessage(task: SocketTask) {
    task.onMessage(res => {
      const msg: SocketMsg = res
      this.messageCallbackList.forEach(f => {
        f(msg)
      })
    })
    return this
  }

  /**
   * 内部方法，监听错误
   * @param task
   */
  private listenError(task: SocketTask) {
    task.onError(res => {
      this.errorCallbackList.forEach(f => {
        f(res)
      })
    })
    return this
  }

  /**
   * 内部方法，监听关闭
   * @param task
   */
  private listenClose(task: SocketTask) {
    task.onClose(res => {
      this.opened = false
      if (!this.forceClose && this.reconnect && this.reConnectTimes <= this.maxReconnect) {
        // 发起重连
        this.reCreateSocketTask()
      }
      this.closeCallbackList.forEach(f => {
        f(res)
      })
    })
    return this
  }

  /**
   * 重连操作
   */
  private reCreateSocketTask() {
    this.reConnectTimes++
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
    const timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reConnectTimes)
    this.reconnectTimer = setTimeout(
      () => {
        this.createSocketTask(this.socketUrl)
      },
      timeout > this.maxReconnectInterval ? this.maxReconnectInterval : timeout
    )
  }

  /**
   * 关闭socket
   */
  public close(force: boolean = false) {
    this.forceClose = force
    this.socketTask?.close({ code: force ? closeCode.FORCE : closeCode.Else })
    this.socketTask = null
  }

  /**
   * 封装socketTask发送消息
   */
  private socketTaskSend(param: SendParam) {
    this.socketTask?.send(param)
  }

  /**
   * 发消息
   */
  public send(param: SendParam) {
    this.socketTaskSend(param)
  }

  public onOpen(callback: CommonCallbackFunc) {
    if (!this.openCallbackList.includes(callback)) {
      this.openCallbackList.push(callback)
    }
    if (this.opened) {
      // 已经是open状态，直接执行回调方法
      callback()
    }
  }

  /**
   * 接收消息
   */
  public onMessage(callback: OnMessageCallback) {
    if (!this.messageCallbackList.includes(callback)) {
      this.messageCallbackList.push(callback)
    }
  }

  /**
   * 移除onMessage回调
   * @param callback
   */
  public removeOnMessage(callback: OnMessageCallback) {
    const index = this.messageCallbackList.findIndex(f => f === callback)
    if (index > -1) {
      this.messageCallbackList.splice(index, 1)
    }
  }

  /**
   * 监听报错
   */
  public onError(callback: CommonCallbackFunc) {
    if (!this.errorCallbackList.includes(callback)) {
      this.errorCallbackList.push(callback)
    }
  }

  /**
   * 移除onError回调
   * @param callback
   */
  public removeOnError(callback: OnErrorCallbackFunc) {
    const index = this.errorCallbackList.findIndex(f => f === callback)
    if (index > -1) {
      this.errorCallbackList.splice(index, 1)
    }
  }

  /**
   * 监听关闭事件
   */
  public onClose(callback: OnCloseCallbackFunc) {
    console.log('执行 onClose')
    if (!this.closeCallbackList.includes(callback)) {
      this.closeCallbackList.push(callback)
    }
  }

  /**
   * 移除onClose回调
   * @param callback
   */
  public removeOnClose(callback: OnCloseCallbackFunc) {
    const index = this.closeCallbackList.findIndex(f => f === callback)
    if (index > -1) {
      this.closeCallbackList.splice(index, 1)
    }
  }
}

/**
 * 通讯服务socket客户端封装
 */
export class ShortSocket {
  private instance: ShortSocketTask | null = null

  /**
   * 单例
   * @returns
   */
  public getInstance(url: string): ShortSocketTask {
    if (this.instance === null) {
      const task = new ShortSocketTask()
      task.createSocketTask(url)
      this.instance = task
      task.onClose(({ code }) => {
        if (code === closeCode.FORCE) {
          // 如果是强制关闭socket
          this.instance = null
        }
      })
    }
    return this.instance
  }
}
