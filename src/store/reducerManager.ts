import { combineReducers, Reducer, ReducersMapObject, AnyAction } from 'redux'

export interface IReducerManager<S> {
  reduce: (state: S, action: AnyAction) => S
  getReducerMap: () => ReducersMapObject<S>
  add: <ReducerState>(key: string, reducer: Reducer<ReducerState>) => void
  remove: (key: string) => void
}

/**
 * Create a combined reducer as in the fashion of Redux's combineReducers() function,
 * but allows for the dynamic registration of additional reducers
 * @param initialReducers The initial set of reducers
 * @returns An object with three functions: the reducer, an addReducer function, and a removeReducer function
 */
export function getReducerManager<S extends {}>(
  initialReducers: ReducersMapObject<S>,
  reducerCombiner: (reducers: ReducersMapObject<S, any>) => Reducer<S> = combineReducers
): IReducerManager<S> {
  let combinedReducer = reducerCombiner(initialReducers)
  const reducers: ReducersMapObject<S> = {
    ...(initialReducers as object)
  } as ReducersMapObject<S>
  let keysToRemove: any[] = []

  const reduce = (state: S, action: AnyAction) => {
    if (keysToRemove.length > 0) {
      state = { ...(state as any) }
      // eslint-disable-next-line no-restricted-syntax
      for (const key of keysToRemove) {
        delete state[key]
      }
      keysToRemove = []
    }

    if (state === undefined) {
      state = {} as S
    }
    const fs = combinedReducer(state, action)
    return fs
  }

  return {
    getReducerMap: () => reducers,
    reduce,
    add: (key: string, reducer: Reducer) => {
      if (!key || reducers[key]) {
        return
      }

      reducers[key] = reducer
      combinedReducer = getCombinedReducer(reducers, reducerCombiner)
    },
    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return
      }

      delete reducers[key]
      keysToRemove.push(key)
      combinedReducer = getCombinedReducer(reducers, reducerCombiner)
    }
  }
}

function getCombinedReducer<S extends {}>(
  reducerMap: ReducersMapObject<any>,
  reducerCombiner: (reducers: ReducersMapObject<S, any>) => Reducer<S> = combineReducers
) {
  if (!reducerMap || Object.keys(reducerMap).length === 0) {
    return (state, action) => state || null
  }
  return reducerCombiner(reducerMap)
}
