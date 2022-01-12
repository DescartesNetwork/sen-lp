import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { RootContext } from 'react-redux-context'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import ui from './ui.reducer'
import flags from './flags.reducer'
import page from './page.reducer'
import wallet from './wallet.reducer'
import accounts from './accounts.reducer'
import mints from './mints.reducer'
import pools from './pools.reducer'
import search from './search.reducer'
import walkthrough from './walkthrough.reducer'

/**
 * Root types
 */
export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch

/**
 * Root hooks
 */
export const useRootStore: typeof useStore = createStoreHook(RootContext as any)
export const useRootDispatch: typeof useDispatch =
  createDispatchHook(RootContext)
export const useRootSelector: typeof useSelector =
  createSelectorHook(RootContext)

/**
 * Root store
 */
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('sentre'),
  reducer: {
    ui,
    flags,
    page,
    wallet,
    accounts,
    mints,
    pools,
    search,
    walkthrough,
  },
})

export default store
