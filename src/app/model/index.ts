import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import main from 'app/model/main.controller'
import stat from 'app/model/stat.controller'
import lpts from 'app/model/lpts.controller'
import retailers from 'app/model/retailers.controller'
import orders from 'app/model/orders.controller'
import settings from 'app/model/settings.controller'
import history from 'app/model/history.controller'

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
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
