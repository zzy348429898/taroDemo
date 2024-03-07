


import HTTPREQUEST from '../../services/index'
export const SUCCESS_CODE = 200 // 成功码
import { getDomain } from '@/services/index'

export interface Response<T> {
    status: number // 200-成功
    message: string // 接口提示消息
    data: T // 业务数据
}

export interface SocketResult {
    wsSrvConnUrl: string // websocket连接地址
}
// 获取websocket连接地址
export async function getSocketUrl(): Promise<string> {
    const url = `${getDomain()}/app/api/basedata/systemProfile.do?action=getWebsocketToKen`
    try {
        const { status, message, data } = await HTTPREQUEST.get<Response<SocketResult>, any>(url)
        if (status !== SUCCESS_CODE) {
            console.log('获取socket连接地址失败：', message)
            return ''
        }
        return data.wsSrvConnUrl
    } catch (err) {
        console.error(err)
        return ''
    }
}