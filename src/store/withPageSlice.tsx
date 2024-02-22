import React, { FC, useEffect, useState, useRef } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch, add, remove } from './index'

export const PageContext = React.createContext({}) //* 创建一个context */

const usePageSlice = (sliceFun: () => { sliceName: string; reducer: any } | { sliceName: string; reducer: any }) => {
  const dispatch = useDispatch()
  const [slice] = useState(() => {
    const store = typeof sliceFun === 'function' ? sliceFun() : sliceFun
    add(store.sliceName, store.reducer)
    dispatch({
      type: '@@Internal/ModuleManager/ModuleAdded',
      payload: store.sliceName
    })
    return store
  })
  useEffect(() => {
    return () => {
      remove(slice.sliceName)
      setTimeout(() => {
        dispatch({
          type: '@@Internal/ModuleManager/ModuleRemoved',
          payload: slice.sliceName
        })
      }, 0)
    }
  }, [slice.sliceName, dispatch])
  return slice
}

export const withPageSlice = (Component, slice) => (props: any) => {
  const sliceObj = usePageSlice(slice)
  return (
    <PageContext.Provider value={sliceObj}>
      <Component {...props} />
    </PageContext.Provider>
  )
}
