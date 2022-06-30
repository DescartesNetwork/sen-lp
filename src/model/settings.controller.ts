import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type State = {
  showArchived: boolean
}

const NAME = 'settings'
const initialState: State = {
  showArchived: false,
}

/**
 * Actions
 */

export const setShowArchived = createAsyncThunk(
  `${NAME}/setShowArchived`,
  async (showArchived: boolean) => {
    return { showArchived }
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
    void builder.addCase(
      setShowArchived.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
