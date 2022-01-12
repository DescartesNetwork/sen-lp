import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type State = {
  selectedPoolAddress: string
  visible: boolean
  selectedCategoryPool: string
  search: string
  prevSelectedPool: boolean
}

const NAME = 'main'
const initialState: State = {
  selectedPoolAddress: '',
  visible: false,
  selectedCategoryPool: '',
  search: '',
  prevSelectedPool: false,
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
export const selectCategoryPool = createAsyncThunk(
  `${NAME}/selectCategoryPool`,
  async (category: string) => {
    return { selectedCategoryPool: category }
  },
)
export const handleOpenDrawer = createAsyncThunk(
  `${NAME}/handleOpenDrawer`,
  async (condition: boolean) => {
    return { visible: condition }
  },
)

export const checkPrevSelectedPool = createAsyncThunk(
  `${NAME}/checkPrevSelectedPool`,
  async (condition: boolean) => {
    return { prevSelectedPool: condition }
  },
)

export const onSearch = createAsyncThunk(
  `${NAME}/onSearch`,
  async (search: string) => {
    return { search }
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
        selectCategoryPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSearch.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        checkPrevSelectedPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
