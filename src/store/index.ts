import { configureStore, ThunkAction, combineReducers, Action, Reducer } from '@reduxjs/toolkit'
import { getReducerManager } from './reducerManager'
// import * as configObj from '@/config'
// 模块
// import appSlice from './modules/appSlice'


const reducerManager = getReducerManager({
  // app: appSlice,
})
const store = configureStore({
  reducer: reducerManager.reduce,
  // devTools: configObj.debuggerMode,
  devTools: true,
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
