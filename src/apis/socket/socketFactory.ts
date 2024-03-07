// 处理socket连接
import Taro from '@tarojs/taro'

type Option = Taro.connectSocket.Option
export type SocketTask = Taro.SocketTask
export type CallbackFunc = (res: TaroGeneral.CallbackResult) => void
export type OnErrorCallbackResult = Taro.SocketTask.OnErrorCallbackResult
export type OnCloseCallbackResult = Taro.SocketTask.OnCloseCallbackResult

class SocketFactory {
    private socketTaskList:SocketTask[] = [] // task列表
    private maxConnect = 5 // 最大连接数
    private instance:SocketFactory | null = null
    constructor () {
      if (this.instance !== null) {
        // 单例
        return this.instance
      }
      this.instance = this
    }

    // 存储连接
    private addTask (task:SocketTask) {
      this.socketTaskList.push(task)
    }

    // 删除连接
    private removeTask (task:SocketTask) {
      const index = this.socketTaskList.findIndex(item => item === task)
      this.socketTaskList.splice(index, 1)
    }

    // 新建连接
    async createTask (param:string | Option):Promise<false|SocketTask> {
      if (this.socketTaskList.length >= this.maxConnect) {
        console.log(`最多只能创建${this.maxConnect}个连接`)
        return false
      }
      let option : Option = { url: '' }
      if (typeof param === 'string') {
        // 传入的是url
        option.url = param
      } else {
        option = param
      }
      let socketTask:SocketTask
      try {
        console.log('创建socket连接：', option)
        socketTask = await Taro.connectSocket(option)
        socketTask.onClose(res => {
          console.log('释放连接 ', res)
          this.removeTask(socketTask)
        })
        this.addTask(socketTask)
      } catch (e) {
        console.log('连接socket失败:', e)
        return false
      }
      return socketTask
    }
}

export default new SocketFactory()
