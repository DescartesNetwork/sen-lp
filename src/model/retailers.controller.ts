import { AccountInfo, PublicKey } from '@solana/web3.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account, RetailerData } from '@senswap/sen-js'
import configs from 'configs'

/**
 * Store constructor
 */

export type State = Record<string, RetailerData>

const NAME = 'retailers'
const initialState: State = {}

/**
 * Actions
 */

export const getRetailers = createAsyncThunk(
  `${NAME}/getRetailers`,
  async () => {
    const {
      sol: { purchasing },
    } = configs
    // Get all retailers with specific owner
    const value: Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }> =
      await purchasing.connection.getProgramAccounts(
        purchasing.purchasingProgramId,
        {
          filters: [{ dataSize: 161 }],
        },
      )
    let bulk: State = {}
    value.forEach(({ pubkey, account: { data: buf } }) => {
      const address = pubkey.toBase58()
      const data = purchasing.parseRetailerData(buf)
      bulk[address] = data
    })
    return bulk
  },
)

export const getRetailer = createAsyncThunk<
  State,
  { address: string },
  { state: any }
>(`${NAME}/getRetailer`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid retailer address')
  const {
    sol: { purchasing },
  } = configs
  const {
    retailers: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const raw = await purchasing.getRetailerData(address)
  return { [address]: raw }
})

export const upsetRetailer = createAsyncThunk<
  State,
  { address: string; data: RetailerData },
  { state: any }
>(`${NAME}/upsetRetailer`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid retailer address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const deleteRetailer = createAsyncThunk(
  `${NAME}/deleteRetailer`,
  async ({ address }: { address: string }) => {
    if (!account.isAddress(address)) throw new Error('Invalid retailer address')
    return { address }
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
      .addCase(getRetailers.fulfilled, (state, { payload }) => payload)
      .addCase(
        getRetailer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetRetailer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteRetailer.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
