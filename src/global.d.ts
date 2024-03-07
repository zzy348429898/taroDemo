interface IWx {
  [key: string]: any
}

declare const wx: IWx
declare var APP_ENV: string

declare var __starGlobal: {
  uploadServer: string
}

declare module '@tarojs/components' {
  //修改的Props
  import { ComponentType } from 'react'
  import { ViewProps as OldViewProps } from '@tarojs/components/types/View'

  interface ViewProps extends OldViewProps {
    dataTitle?: string
    dataStarTrack?: string
    dataEventKey?: string
    dataEventVars?: string
    dataStExp?: string
  }

  const View: ComponentType<ViewProps>

  // 暂时关闭eslint 以解决 Multiple exports of name 'View'报错
  /* eslint-disable  */
  export * from '@tarojs/components/types/index'
  export { View }
  /* eslint-enable */
}
