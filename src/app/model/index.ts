import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import main from 'app/model/main.controller'
import stat from 'app/model/stat.controller'
import lpts from 'app/model/lpts.controller'
import retailers from 'app/model/retailers.controller'
import orders from 'app/model/orders.controller'
import settings from 'app/model/settings.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('myapp'),
  reducer: {
    main,
    stat,
    lpts,
    retailers,
    orders,
    settings,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
