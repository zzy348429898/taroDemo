import { createSlice } from '@reduxjs/toolkit'
import { apiGetSystemParams, apiGetUnitGroup } from '@/apis/assets'
import GlobalData from '@/utils/globalData'
import { refreshHomeTodoMessage, refreshTodoSetting } from './homeTodoSlice'
import { isProd } from '@/config'
import Taro from '@tarojs/taro'

export interface ShareInfo {
  title: string //分享的标题
  path: string //分享的页面路径
  imageUrl: string //分享的图片
}
export interface AppState {
  appName: string
  appType: '1' | '2' // 1 表示语音模式， 2 表示传统模式
  systemInitData: any
  filesDomain: string //商品图片地址
  unitGroupInfo: Array<any>
  hideChart: boolean
  homeChatMask: boolean // 对话的蒙层
  selectedRecommendGoods: Array<any> // 已选推荐商品
  selectedRecommendGoodsInfo: Record<string, any> // 已选推荐商品汇总信息
  dbId: number | string //账套dbid
  shareInfo: ShareInfo //保存全局的分享信息
}

const initialState: AppState = {
  appName: '小蝶会计',
  appType: '1',
  hideChart: false,
  homeChatMask: false,
  selectedRecommendGoods: [],
  selectedRecommendGoodsInfo: {},
  dbId: '',
  systemInitData: {}, //FilesDomain: "https://fdfs-bj-1252177366.cos.ap-beijing.myqcloud.com/"
  filesDomain: isProd
    ? 'https://fdfs-bj-1252177366.cos.ap-beijing.myqcloud.com/'
    : 'https://fdfs-dev-1307755952.cos.ap-beijing.myqcloud.com/',
  unitGroupInfo: [],
  shareInfo: {
    title: '',
    path: '',
    imageUrl: 'https://images.youshang.com/saas/v3/xdkj/images/share-logo.jpg'
  }
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setAppName(state, action) {
      state.appName = action.payload
    },
    setSystemInitData(state, action) {
      const systemInitData = action.payload
      state.systemInitData = systemInitData
      state.dbId = systemInitData.DBID

      state.filesDomain = systemInitData.FilesDomain //取后台返回的商品图片地址
      Taro.setStorageSync('filesDomain', systemInitData.FilesDomain) //存本地缓存
      // const FilesDomain = isProd
      //   ? 'https://fdfs-bj-1252177366.cos.ap-beijing.myqcloud.com/'
      //   : 'https://fdfs-dev-1307755952.cos.ap-beijing.myqcloud.com/'
      // state.filesDomain = FilesDomain
      // Taro.setStorageSync('filesDomain', FilesDomain)
    },
    setUnitGroupInfoData(state, action) {
      state.unitGroupInfo = action.payload
    },
    setAppType(state, action) {
      state.appType = action.payload
    },
    setHideChart(state, action) {
      state.hideChart = action.payload
    },
    // 已选推荐商品
    setSelectedRecommendGoods(state, action) {
      state.selectedRecommendGoods = [...action.payload]
    },
    // 已选推荐商品汇总信息
    setSelectedRecommendGoodsInfo(state, action) {
      state.selectedRecommendGoodsInfo = {
        ...(action.payload || {})
      }
    },
    //设置分享信息，以便点击分享时获取数据
    setShareInfo(state, action) {
      state.shareInfo = {
        ...(action.payload || {})
      }
    },
    setHomeChatMsgMask: (state, action) => {
      state.homeChatMask = action.payload
    }
  }
})

// 基础数据
export function getSystemInitDataAsync() {
  return async function (dispatch) {
    const { status, data = {} } = await apiGetSystemParams()
    if (status !== 200) {
      return null
    }
    const systemInitData: any = data || {}
    dispatch(setSystemInitData(systemInitData))
    GlobalData.setSysParam(systemInitData)

    setTimeout(async () => {
      await dispatch(refreshTodoSetting())
    }, 60)

    return systemInitData
  }
}

// 单位数据
export function getSystemUnitGroupAsync() {
  return async function (dispatch, getState) {
    let systemInitData = getState().app.systemInitData
    const { status, data = {} } = await apiGetUnitGroup()
    if (status !== 200) {
      return null
    }
    const { items = [] } = data
    if (systemInitData.isAdmin || (systemInitData.rights && systemInitData.rights.UNIT_QUERY)) {
      dispatch(setUnitGroupInfoData(items))
    }
  }
}

export const {
  setHideChart,
  setAppName,
  setAppType,
  setSystemInitData,
  setUnitGroupInfoData,
  setSelectedRecommendGoods,
  setSelectedRecommendGoodsInfo,
  setShareInfo,
  setHomeChatMsgMask
} = appSlice.actions

export default appSlice.reducer
