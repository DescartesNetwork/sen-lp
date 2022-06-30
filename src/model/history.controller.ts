import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import base58 from 'bs58'
import { PoolData } from '@senswap/sen-js'

import { DateHelper } from 'stat/helpers/date'
import PoolTransLogService, {
  SwapActionType,
} from 'stat/logic/pool/poolTranslog'
import { ActionTransfer } from 'stat/entities/trans-log'

/**
 * Store constructor
 */
export const PROGRAM_DATA_SCHEMA = [
  { key: 'code', type: 'u8' },
  { key: 'delta_a', type: 'u64' },
  { key: 'delta_b', type: 'u64' },
]

export type HistoryWithdraw = {
  time: number
  actions: { mint: string; amount: bigint; decimals: number }[]
}

export type HistoryDeposit = {
  time: number
  amount_a: bigint
  amount_b: bigint
}

export type State = {
  depositHistories: HistoryDeposit[]
  withdrawHistories: HistoryWithdraw[]
}

const NAME = 'history'
const initialState: State = {
  depositHistories: [],
  withdrawHistories: [],
}

/**
 * Actions
 */

const getTransLogs = async (days: number, walletAddress: string) => {
  const poolTransLogService = new PoolTransLogService()
  const timeTo = new DateHelper()
  const timeFrom = new DateHelper().subtractDay(days)
  const transLogs = await poolTransLogService.collect(walletAddress, {
    secondFrom: timeFrom.seconds(),
    secondTo: timeTo.seconds(),
  })
  return transLogs
}

const validatedHistory = (
  actionType: string,
  actionTransfers: ActionTransfer[],
  poolData: PoolData,
) => {
  const { treasury_a, treasury_b } = poolData
  const treasuries = [treasury_a, treasury_b]

  for (const action of actionTransfers) {
    const { source, destination } = action
    if (!source || !destination) continue

    if (actionType === SwapActionType.AddLiquidity)
      return treasuries.includes(destination.address)

    if (actionType === SwapActionType.RemoveLiquidity)
      return treasuries.includes(source.address)
  }
  return false
}

export const fetchWithdrawHistories = createAsyncThunk<
  Partial<State>,
  { days: number; poolData: PoolData }
>(`${NAME}/fetchWithdrawHistories`, async ({ days, poolData }) => {
  const {
    sentre: { splt },
  } = window
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Wallet is not connected')

  const transLogs = await getTransLogs(days, walletAddress)
  const withdrawHistories: HistoryWithdraw[] = []

  for (const transLog of transLogs) {
    const { actionType, actionTransfers, blockTime } = transLog
    if (actionType !== SwapActionType.RemoveLiquidity) continue
    if (!validatedHistory(actionType, actionTransfers, poolData)) continue

    const withdrawData: HistoryWithdraw = {
      time: blockTime,
      actions: [],
    }
    for (const action of actionTransfers) {
      const { amount, source, destination } = action
      if (!source || !destination) continue
      const { mint, address, decimals } = destination
      const mintAccount = await splt.deriveAssociatedAddress(
        walletAddress,
        mint,
      )
      if (address !== mintAccount) continue
      withdrawData.actions.push({
        mint,
        amount: BigInt(amount),
        decimals,
      })
    }
    withdrawHistories.push(withdrawData)
  }

  return { withdrawHistories }
})

export const fetchDepositHistory = createAsyncThunk<
  Partial<State>,
  { days: number; poolData: PoolData }
>(`${NAME}/fetchDepositHistory`, async ({ days, poolData }) => {
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Wallet is not connected')
  const { struct } = require('soprox-abi')

  const transLogs = await getTransLogs(days, walletAddress)
  const depositHistories: HistoryDeposit[] = []

  for (const transLog of transLogs) {
    const { blockTime, actionType, programInfo, actionTransfers } = transLog
    if (actionType !== SwapActionType.AddLiquidity) continue
    if (!validatedHistory(actionType, actionTransfers, poolData)) continue

    /** Parse delta_a, delta_b from programData */
    const programDataEncode = programInfo?.data
    if (!programDataEncode) continue
    const dataBuffer = base58.decode(programDataEncode)
    const actionLayout = new struct(PROGRAM_DATA_SCHEMA)

    const programDataDecode: { delta_a: bigint; delta_b: bigint } =
      actionLayout.fromBuffer(Buffer.from(dataBuffer))

    const history: HistoryDeposit = {
      time: blockTime,
      amount_a: programDataDecode.delta_a,
      amount_b: programDataDecode.delta_b,
    }

    depositHistories.push(history)
  }

  return { depositHistories }
})

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
        fetchWithdrawHistories.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        fetchDepositHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
