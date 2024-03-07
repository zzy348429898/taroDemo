# web socket连接
用于小程序socket通讯
## 使用
    import React, { useCallback }from 'react'
    import { useDidShow, useDidHide } from '@tarojs/taro'
    import socket from '@/apis/socket'

    // 把消息回调抽出一个方法
    const onMessageCallback = useCallback((msg:any) => {
        // 接收消息
        console.log('收到socket消息：', msg)
    },[])

    useDidShow(()=>{
        // 页面显示时
        socket.onMessage(onMessageCallback) // 注册监听事件
    })

    useDidHide(()=>{
        // 页面隐藏时
        socket.removeOnMessage(onMessageCallback) // 移除监听事件
    })
## 特别注意
    1.用 useDidShow 和 useDidHide取代 useEffect, 因为小程序有页面栈，从当前页面跳转新页面时，当前页面的 useEffect 里的 return 语句不一定会执行
    2.用useCallback声明 onMessageCallback 方法，来保证onMessageCallback函数总是同一个引用