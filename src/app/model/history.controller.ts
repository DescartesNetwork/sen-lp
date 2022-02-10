import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import base58 from 'bs58'

import { ActionTransfer } from 'app/stat/entities/trans-log'
import { DateHelper } from 'app/stat/helpers/date'
import PoolTransLogService from 'app/stat/logic/pool/poolTranslog'

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
  mint_a: string
  amount_a: bigint
  amount_b: bigint
  mint_b: string
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

export const fetchWithdrawHistories = createAsyncThunk<
  Partial<State>,
  { days: number }
>(`${NAME}/fetchWithdrawHistories`, async ({ days }) => {
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Wallet is not connected')

  const transLogs = await getTransLogs(days, walletAddress)

  const withdrawHistories: HistoryWithdraw[] = []

  for (const transLog of transLogs) {
    if (transLog.actionType !== 'REMOVE_LIQUIDITY') continue

    const actionTransfers: ActionTransfer[] = [...transLog.actionTransfers]

    for (let i = 0; i < actionTransfers.length; i += 2) {
      if (
        !actionTransfers[i].destination ||
        !actionTransfers[i + 1].destination
      )
        continue

      const history: HistoryWithdraw = {
        time: transLog.blockTime,
        mint_a: actionTransfers[i].destination?.mint || '',
        amount_a: BigInt(actionTransfers[i].amount),
        mint_b: actionTransfers[i + 1].destination?.mint || '',
        amount_b: BigInt(actionTransfers[i + 1].amount),
      }

      withdrawHistories.push(history)
    }
  }

  return { withdrawHistories }
})

export const fetchDepositHistory = createAsyncThunk<
  Partial<State>,
  { days: number }
>(`${NAME}/fetchDepositHistory`, async ({ days }) => {
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Wallet is not connected')
  const { struct } = require('soprox-abi')

  const transLogs = await getTransLogs(days, walletAddress)
  const depositHistories: HistoryDeposit[] = []

  for (const transLog of transLogs) {
    if (transLog.actionType !== 'ADD_LIQUIDITY') continue

    const programDataEncode = transLog.programInfo?.data
    if (!programDataEncode) continue
    const dataBuffer = base58.decode(programDataEncode)
    const actionLayout = new struct(PROGRAM_DATA_SCHEMA)

    const programDataDecode: { delta_a: bigint; delta_b: bigint } =
      actionLayout.fromBuffer(Buffer.from(dataBuffer))

    const history: HistoryDeposit = {
      time: transLog.blockTime,
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
