import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type State = {
  selectedPoolAddress: string
  visible: boolean
}

const NAME = 'main'
const initialState: State = {
  selectedPoolAddress: '',
  visible: false,
}

/**
 * Actions
 */

export const selectPool = createAsyncThunk(
  `${NAME}/selectPool`,
  async (poolAddress: string) => {
    return { selectedPoolAddress: poolAddress, selectedLptAddress: '' }
  },
)
export const handleOpenDrawer = createAsyncThunk(
  `${NAME}/handleOpenDrawer`,
  async (condition: boolean) => {
    return { visible: condition }
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
      ),
})

export default slice.reducer
