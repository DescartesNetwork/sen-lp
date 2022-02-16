import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type State = {
  selectedPoolAddress: string
  visible: boolean
  search: string
  tvl: number
}

const NAME = 'main'
const initialState: State = {
  selectedPoolAddress: '',
  visible: false,
  search: '',
  tvl: 0,
}

/**
 * Actions
 */

export const selectPool = createAsyncThunk(
  `${NAME}/selectPool`,
  async (poolAddress: string) => {
    return { selectedPoolAddress: poolAddress }
  },
)
export const handleOpenDrawer = createAsyncThunk(
  `${NAME}/handleOpenDrawer`,
  async (condition: boolean) => {
    return { visible: condition }
  },
)

export const onSearch = createAsyncThunk(
  `${NAME}/onSearch`,
  async (search: string) => {
    return { search }
  },
)
export const onSetTotalTvl = createAsyncThunk(
  `${NAME}/onSetTotalTvl`,
  async (tvl: number) => {
    return { tvl }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        selectPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        handleOpenDrawer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSearch.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSetTotalTvl.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
