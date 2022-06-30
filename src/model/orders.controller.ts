import { AccountInfo, PublicKey } from '@solana/web3.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account, OrderData } from '@senswap/sen-js'
import configs from 'configs'

/**
 * Store constructor
 */

export type State = Record<string, OrderData>

const NAME = 'orders'
const initialState: State = {}

/**
 * Actions
 */

export const getOrders = createAsyncThunk(
  `${NAME}/getOrders`,
  async ({ owner, retailer }: { owner?: string; retailer?: string }) => {
    const {
      sol: { purchasing },
    } = configs
    // Get all retailers with specific owner
    let bulk: State = {}
    let opts = []
    if (account.isAddress(owner))
      opts.push({ memcmp: { bytes: owner, offset: 0 } })
    if (account.isAddress(retailer))
      opts.push({ memcmp: { bytes: retailer, offset: 33 } })
    const value: Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }> =
      await purchasing.connection.getProgramAccounts(
        purchasing.purchasingProgramId,
        {
          filters: [{ dataSize: 105 }, ...opts],
        },
      )
    value.forEach(({ pubkey, account: { data: buf } }) => {
      const address = pubkey.toBase58()
      const data = purchasing.parseOrderData(buf)
      bulk[address] = data
    })
    return bulk
  },
)

export const getOrder = createAsyncThunk<
  State,
  { address: string },
  { state: any }
>(`${NAME}/getOrder`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid order address')
  const {
    sol: { purchasing },
  } = configs
  const {
    retailers: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const raw = await purchasing.getOrderData(address)
  return { [address]: raw }
})

export const upsetOrder = createAsyncThunk<
  State,
  { address: string; data: OrderData },
  { state: any }
>(`${NAME}/upsetOrder`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid order address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const deleteOrder = createAsyncThunk(
  `${NAME}/deleteOrder`,
  async ({ address }: { address: string }) => {
    if (!account.isAddress(address)) throw new Error('Invalid order address')
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
      .addCase(
        getOrders.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getOrder.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetOrder.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteOrder.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
