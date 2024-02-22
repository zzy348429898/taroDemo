import { configureStore, ThunkAction, combineReducers, Action, Reducer } from '@reduxjs/toolkit'
import { getReducerManager } from './reducerManager'
import * as configObj from '@/config'
// 模块
import appSlice from './modules/appSlice'
import accountSlice from './modules/accountSlice'
import feeSlice from './modules/feeSlice'
import uploadSlice from './modules/uploadSlice'
import aiMessageSlice from './modules/aiMessageSlice'
import todoSlice from './modules/todoSlice'
import originBillListSlice from './modules/originBillListSlice'
import companySlice from './modules/companySlice'
import storeSkillOrderRecord from './modules/skillOrderRecord'
import sfaSlice from './modules/sfaSlice'
import linkManPage from './pages/linkManPage'
import homeTodoSlice from './modules/homeTodoSlice'
import bluetoothSlice from '@/shared/src/store/bluetoothSlice'

const reducerManager = getReducerManager({
  app: appSlice,
  account: accountSlice,
  fee: feeSlice,
  uploadFile: uploadSlice,
  aiMessage: aiMessageSlice,
  homeTodo: homeTodoSlice,
  bluetooth: bluetoothSlice,
  company: companySlice,
  originBillList: originBillListSlice,
  sfa: sfaSlice,
  linkManPage: linkManPage,
  storeSkillOrderRecord
})
const store = configureStore({
  reducer: reducerManager.reduce,
  devTools: configObj.debuggerMode,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})

export const { add, remove } = reducerManager
export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
