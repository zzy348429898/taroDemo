import React, { PropsWithChildren, useEffect } from 'react'
import store from './store'
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import '@nutui/nutui-react-taro/dist/style.css'
import '@/styles/custom-theme.scss'
import '@/assets/iconcool/iconcool.css'
import '@/styles/common.scss'
// 全局样式
import './app.scss'
import './styles/demoStyles/common.scss';
import './styles/demoStyles/mixins.scss';
import './styles/demoStyles/variables.scss';
import useCheckWeappNewVersion from './hooks/useCheckWeappNewVersion'
import { initShowToast } from './components/ui/ShowToast'
import { Provider } from 'react-redux'


initShowToast()

export function App(props: PropsWithChildren) {
  // 检测版本更新
  useCheckWeappNewVersion()

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  return <Provider store={store}>{props.children}</Provider>
}

export default App
