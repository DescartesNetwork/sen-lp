import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'model/devTools'

import main from 'model/main.controller'
import stat from 'model/stat.controller'
import lpts from 'model/lpts.controller'
import retailers from 'model/retailers.controller'
import orders from 'model/orders.controller'
import settings from 'model/settings.controller'
import history from 'model/history.controller'
import pools from 'model/pools.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools(process.env.REACT_APP_ID as string),
  reducer: {
    main,
    stat,
    lpts,
    retailers,
    orders,
    settings,
    history,
    pools,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch

export default model
