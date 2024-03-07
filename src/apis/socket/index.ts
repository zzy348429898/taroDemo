/* eslint-disable no-unused-vars */

import socketFactory, { SocketTask, CallbackFunc, OnErrorCallbackResult, OnCloseCallbackResult } from './socketFactory'
import { getSocketUrl } from './api'

/**
 *  0 客户端-登录
    1 客户端-心跳
    2 客户端-数据发送(目前服务端对客户发送数据不做处理)
    3 客户端-登出
    4 客户端-消息应答
    50 服务端-响应登陆
    51 服务端-响应心跳包
    52 服务端-数据发送
    53 服务端-踢出客户端
    53 服务端-消息应答
 */
export enum MsgType {
  ClientLogin = 0,
  ClientHeartBeat = 1,
  ClientSendMsg = 2,
  ClientLogOut = 3,
  ClientResponse = 4,
  ServerLogin = 50,
  ServerHeartBeat = 51,
  ServerSendMsg = 52,
  ServerLogOut = 53,
  ServerResopnse = 53
}

/**
 * socket消息格式
 */
export type SocketMsg = any

type SendParam = {
  type: MsgType,
  content?: string,
  success?: CallbackFunc,
  fail?: CallbackFunc,
  complete?: CallbackFunc
}


type CommonCallbackFunc = () => void

type OnMessageCallback = (data: SocketMsg) => void

type OnErrorCallbackFunc = (res: OnErrorCallbackResult) => void

type OnCloseCallbackFunc = (res: OnCloseCallbackResult) => void

enum closeCode {
  FORCE = 9999, // 主动关闭
  Else = 9998
}

/**
 * socketTask业务封装
 */
class IMSocketTask {
  private socketTask: SocketTask | null = null
  private reconnect = true // 是否重连
  private reconnectInterval = 1000 // 重连时间间隔
  private maxReconnectInterval = 5000 // 最大重连时间间隔
  private reconnectDecay = 1.5 // 重连时间计算基数
  private maxReconnect = 100 // 最大重连次数
  private forceClose = false // 是否主动关闭连接
  private reConnectTimes = 0 // 重连接次数
  private heartBeatTimer
  private reconnectTimer
  private openTimer
  private messageCallbackList: OnMessageCallback[] = []
  private errorCallbackList: OnErrorCallbackFunc[] = []
  private closeCallbackList: OnCloseCallbackFunc[] = []
  private openCallbackList: CommonCallbackFunc[] = []
  private opened = false // 记录open状态
  private heartBeatTime = 20000 // socket心跳间隔
  /**
   * 创建socketTask对象
   * @returns
   */
  public async createSocketTask() {
    const socketUrl = await getSocketUrl() // socket连接地址
    const task = await socketFactory.createTask({ url: socketUrl })
    if (task !== false) {
      this.socketTask = task
      this.openTimer = setTimeout(() => {
        this.close()
      }, 3000)
      task.onOpen(() => {
        console.log('onOpen')
        this.opened = true
        this.reConnectTimes = 0 // 重连次数清零
        this.openTimer && clearTimeout(this.openTimer)
        this.listenMessage(task).listenClose(task).listenError(task)
        this.openCallbackList.forEach(f => f())
        this.heartBeat() // 发送心跳
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
      // this.ack(msg.fp) 消息确认机制暂无
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
   * 心跳
   */
  private heartBeat() {
    this.heartBeatTimer && clearInterval(this.heartBeatTimer)
    this.heartBeatTimer = setInterval(() => {
      this.socketTaskSend({
        type: MsgType.ClientHeartBeat,
        content: 'heartBeat'
      })
    }, this.heartBeatTime)
  }

  /**
   * 重连操作
   */
  private reCreateSocketTask() {
    this.reConnectTimes++
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
    const timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reConnectTimes)
    this.reconnectTimer = setTimeout(() => {
      this.createSocketTask()
    }, timeout > this.maxReconnectInterval ? this.maxReconnectInterval : timeout)
  }

  /**
   * 重新登录
   */
  private reLogin() {

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
    const msg: SocketMsg = {
      type: param.type,
      dataContent: param.content!, // 消息内容，如为对象，转化为json字符串
      fp: new Date().getTime() + ''// 消息指纹，每条消息都不一样，同条消息需要相同
    }
    const params = {
      data: JSON.stringify(msg),
      success: param.success,
      fail: param.fail,
      complete: param.complete
    }
    this.socketTask?.send(params)
  }

  /**
   * 收到数据后响应
   * @param fp 消息指纹
   */
  private ack(fp: string) {
    this.socketTaskSend({ type: MsgType.ClientResponse, content: fp, fail: (res) => { console.log(res.errMsg) } })
  }

  /**
   * 发消息
   */
  public send(content: string, success?: CallbackFunc, fail?: CallbackFunc, complete?: CallbackFunc) {
    this.socketTaskSend({ type: MsgType.ClientSendMsg, content, success, fail, complete })
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
export class IMSocketClient {
  private instance: IMSocketTask | null = null

  /**
    * 单例
    * @returns
    */
  public getInstance(): IMSocketTask {
    if (this.instance === null) {
      const task = new IMSocketTask()
      task.createSocketTask()
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

export default new IMSocketClient().getInstance()
