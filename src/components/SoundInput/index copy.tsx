import React, { FC, useState, useRef } from 'react'
import { View } from '@tarojs/components'
import { useAppSelector } from '@/store/redux-hooks'
import './index.scss'
import Taro from '@tarojs/taro'
import { Overlay, Popup, Input } from '@nutui/nutui-react-taro'

interface IProps {
  onChange: (str: string) => void
  onStart?: () => void
  onStop?: () => void
  child?: React.ReactNode
}

let WechatSI = {} as any
let manager = {
  start: () => {
    console.log('WechatSI: start')
  },
  stop: () => {
    console.log('WechatSI: stop')
  },
  onRecognize: () => { }
} as any
if (process.env.TARO_ENV === 'weapp') {
  WechatSI = Taro.requirePlugin('WechatSI')
  manager = WechatSI.getRecordRecognitionManager()
}

const Component: FC<IProps> = props => {
  const [visible, setVisible] = useState(false)
  const [txt, setTxt] = useState('')
  const [showBottom, setShowBottom] = useState(false)
  const [direction, setDirection] = useState('mid')
  const slipFlag = useRef(false)
  const startPoint = useRef<any>()
  const [touching, setTouching] = useState(false)
  const intervalRef = useRef<any>()

  const onClose = () => {
    setVisible(false)
  }

  const send = () => {
    props.onChange && txt && props.onChange(txt)
  }

  const reset = () => {
    setDirection('mid')
    setShowBottom(false)
    slipFlag.current = false
    setTouching(false)
    setTxt('')
    props.onStop && props.onStop()
  }
  manager.onRecognize = function (res) {
    console.log('recognize result', res.result)
    setTxt(res.result)
  }
  manager.onStop = function (res) {
    setTxt(txt + res.result)
    // console.log('record file path', res.tempFilePath)
    // console.log('result', res.result)
    // setTxt(txt + res.result)
    // if (touching) {
    //   setTimeout(() => {
    //     manager.start()
    //   }, 500)
    // }
  }
  // manager.onRecognize = function (res) {
  //   setTxt(res.result as any)
  // }
  // manager.onStop = function (res) {
  //   // console.log('record file path', res.tempFilePath)
  //   // console.log('result', res.result)
  // }
  // manager.onStart = function (res) {
  //   console.log('成功开始录音识别', res)
  // }
  // manager.onError = function (res) {
  //   console.error('error msg', res.msg)
  // }

  return (
    <View className="sound-input-component">
      <View
        onClick={() => {
          // Taro.startRecord({
          //   success: function (res) {
          //     const tempFilePath = res.tempFilePath
          //     console.log('qqq')
          //     console.log(tempFilePath)
          //   }
          // })
          // setTimeout(function () {
          //   Taro.stopRecord() // 结束录音
          // }, 3000)
        }}
        onTouchStart={e => {
          manager.start()
          intervalRef.current = setInterval(() => {
            manager.stop()
            setTimeout(() => {
              manager.start()
            }, 100)
          }, 5000)

          slipFlag.current = true
          startPoint.current = (e as any).touches[0]
          setShowBottom(true)
          setTouching(true)
          setVisible(true)
          props.onStart && props.onStart()
        }}
        onTouchMove={event => {
          let e = event as any
          if (startPoint.current.clientX - e.touches[e.touches.length - 1].clientX > 80 && slipFlag) {
            setDirection('left')
            slipFlag.current = false
            return
          } else if (startPoint.current.clientX - e.touches[e.touches.length - 1].clientX < -80 && slipFlag) {
            setDirection('right')
            slipFlag.current = false
            return
          } else if (
            startPoint.current.clientX - e.touches[e.touches.length - 1].clientX >= -80 &&
            startPoint.current.clientX - e.touches[e.touches.length - 1].clientX <= 80 &&
            slipFlag
          ) {
            setDirection('mid')
            slipFlag.current = false
          }
        }}
        onTouchEnd={() => {
          manager.stop()
          clearInterval(intervalRef.current)
          setTouching(false)
          if (direction == 'left') {
            reset()
          }
          if (direction == 'mid') {
            send()
            reset()
          }
          if (direction == 'right') {
          }
        }}
      >
        <View className="voice-input-icon"></View>
        <View className="voice-input-txt">按住说话</View>
      </View>
      <Popup
        visible={showBottom}
        style={{ height: Taro.pxTransform(250) }}
        position="bottom"
        className="voice-rec-popup"
        round
        closeOnOverlayClick={false}
        onClose={() => {
          setShowBottom(false)
        }}
      >
        <View className="voice-control-wrapper">
          <View className="iconcool guanbi"></View>
          <View className="voice-mid-icon"></View>
          <View className="iconcool shoulu"></View>

          {direction == 'left' && (
            <View className="left-wave-wrapper">
              <View className="left-wave1"></View>
              <View className="left-wave2"></View>
              <View className="left-wave3"></View>
            </View>
          )}
          {direction == 'mid' && (
            <View className="mid-wave-wrapper">
              <View className="mid-wave1"></View>
              <View className="mid-wave2"></View>
              <View className="mid-wave3"></View>
            </View>
          )}
          {direction == 'right' && (
            <View className="right-wave-wrapper">
              <View className="right-wave1"></View>
              <View className="right-wave2"></View>
              <View className="right-wave3"></View>
            </View>
          )}
        </View>
        <View className="voice-rec-content-wrapper">
          <View className="top-line"></View>
          <View className="top-text-wrapper">
            <Input
              value={txt}
              placeholder=" "
              onChange={val => {
                setTxt(val)
              }}
            />
          </View>
          <View className="bottom-voice-logo-wrapper">
            <View className="bottom-voice-logo"></View>
          </View>
          <View className="voice-action-tip">
            {direction == 'left' && (
              <View className="voice-action-tip-text" style={{ paddingLeft: Taro.pxTransform(64) }}>
                取消
              </View>
            )}
            {direction == 'mid' && <View className="voice-action-tip-text">松开发送</View>}
            {direction == 'right' && touching && (
              <View className="voice-action-tip-text" style={{ paddingLeft: Taro.pxTransform(64) }}>
                编辑
              </View>
            )}

            {direction == 'right' && !touching && (
              <>
                <View
                  className="voice-action-tip-text"
                  style={{ marginLeft: Taro.pxTransform(-36) }}
                  onClick={() => {
                    reset()
                  }}
                >
                  取消
                </View>
                <View
                  onClick={() => {
                    send()
                    reset()
                  }}
                >
                  <View className="voice-action-tip-text" style={{ paddingLeft: Taro.pxTransform(128) }}>
                    发送
                  </View>
                  <View
                    className="voice-action-tip-icon voice-action-tip-icon1"
                    style={{ verticalAlign: Taro.pxTransform(-12) }}
                  ></View>
                </View>
              </>
            )}

            {direction == 'mid' && <View className="voice-action-tip-icon voice-action-tip-icon1"></View>}
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default Component
