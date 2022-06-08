import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account, AccountData, utils } from '@senswap/sen-js'

/**
 * Store constructor
 */
export type LPTData = AccountData & {
  pool: string
  selectedPoolAddress?: string
}
export type State = Record<string, LPTData>

const NAME = 'lpts'
const initialState: State = {}

/**
 * Actions
 */

export const getLPTs = createAsyncThunk(
  `${NAME}/getLPTs`,
  async ({
    accounts,
  }: {
    accounts: Array<AccountData & { address: string }>
  }) => {
    const { splt, swap } = window.sentre
    // Get the corresponding mint list
    const mintAddresses = accounts.map(({ mint: mintAddress }) => mintAddress)
    const mintPublicKeys = mintAddresses.map((mintAddress) =>
      account.fromAddress(mintAddress),
    )
    // Validate whether lp mint or normal mint
    const mintData = (
      await utils.wrappedGetMultipleAccountsInfo(
        splt.connection,
        mintPublicKeys,
      )
    ).map((re) => {

      if (!re?.data) return null
      // @ts-ignore           
      return splt.parseMintData(re.data)
    })
    if (!mintData?.length) return {}
    const poolAddresses = await Promise.all(
      mintData.map(async (re) => {
        try {
          const { mint_authority, freeze_authority } = re || {}
          if (
            !account.isAddress(mint_authority) ||
            !account.isAddress(freeze_authority)
          )
            return undefined
          return await swap.derivePoolAddress(mint_authority, freeze_authority)
        } catch (er) {
          return undefined
        }
      }),
    )
    // Filter lpt accounts
    let bulk: State = {}
    accounts.forEach(({ address, ...data }, index) => {
      const poolAddress = poolAddresses[index]
      if (account.isAddress(poolAddress))
        bulk[address] = { ...data, pool: poolAddress }
    })
    return bulk
  },
)

export const getLPT = createAsyncThunk<
  State,
  { address: string },
  { state: any }
>(`${NAME}/getLPT`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid account address')
  const {
    lpts: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const { swap } = window.sentre
  const raw = await swap.getLPTData(address)
  return { [address]: raw }
})

export const upsetLPT = createAsyncThunk<
  State,
  { address: string; data: AccountData },
  { state: any }
>(`${NAME}/upsetLPT`, async ({ address, data }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid address')
  if (!data) throw new Error('Data is empty')
  const {
    lpts: { [address]: lptData },
  } = getState()
  const { pool } = lptData || {}
  if (account.isAddress(pool)) return { [address]: { ...data, pool } }
  // To make sure the new account is an lpt account
  const { swap } = window.sentre
  const raw = await swap.getLPTData(address)
  return { [address]: raw }
})

export const deleteLPT = createAsyncThunk(
  `${NAME}/deleteLPT`,
  async ({ address }: { address: string }) => {
    if (!account.isAddress(address)) throw new Error('Invalid address')
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
      .addCase(getLPTs.fulfilled, (state, { payload }) => payload)
      .addCase(
        getLPT.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetLPT.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteLPT.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
