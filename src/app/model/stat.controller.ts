import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import config from 'app/configs'

import api from 'app/helper/api'

export enum StatPool {
  endpointDetail = 'public/api/v1/detail/pools',
  endpointDaily = 'public/api/v1/daily/pools',
}

type StatDetails = {
  tvl: number
  tvl24h: number
  volume: number
  volume24h: number
  fee: number
  fee24h: number
  roi: number
}
type StatDaily = {
  time: number
  volume: number
  tvl: number
  fee: number
}

type StatData = {
  details: StatDetails
  daily: StatDaily[]
}

const {
  stat: { baseURL },
} = config

export type State = Record<string, StatData>

const NAME = 'stat'
const initialState: State = {}

/**
 * Actions
 */

export const fetchStatPoolData = createAsyncThunk<
  State,
  { address: string },
  { state: any }
>(`${NAME}/fetchStatPoolData`, async ({ address }, { getState }) => {
  try {
    const state = getState()
    const cacheData = state.stat[address]
    if (cacheData) return { [address]: cacheData }

    const fetchDetails = api.get(
      `${baseURL}/${StatPool.endpointDetail}/${address}`,
    )
    const fetchDaily = api.get(
      `${baseURL}/${StatPool.endpointDaily}/${address}`,
    )
    const [details, daily] = await Promise.all([fetchDetails, fetchDaily])
    return { [address]: { details, daily } }
  } catch (error) {
    return {}
  }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      fetchStatPoolData.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
