import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import base58 from 'bs58'

import {
  PROGRAM_DATA_CODE_SCHEMA,
  PROGRAM_DATA_DELTA_A_SCHEMA,
  PROGRAM_DATA_DELTA_B_SCHEMA,
} from 'app/stat/constants/schema'
import { ActionTransfer } from 'app/stat/entities/trans-log'
import { DateHelper } from 'app/stat/helpers/date'
import PoolTransLogService from 'app/stat/logic/pool/poolTranslog'

/**
 * Store constructor
 */

export type HistoryWithdrawType = {
  time: number
  mint_a: string
  amount_a: bigint
  amount_b: bigint
  mint_b: string
}

export type HistoryDepositType = {
  time: number
  amount_a: bigint
  amount_b: bigint
}

export type State = {
  depositHistories: HistoryDepositType[]
  withdrawHistories: HistoryWithdrawType[]
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
  const {
    sentre: { splt },
  } = window
  const transLogs = await getTransLogs(days, walletAddress)

  const withdrawHistories: HistoryWithdrawType[] = []

  for (const transLog of transLogs) {
    if (transLog.actionType !== 'REMOVE_LIQUIDITY') continue

    const history = {} as HistoryWithdrawType
    const actionTransfers: ActionTransfer[] = []

    for (const actionTransfer of transLog.actionTransfers) {
      if (!actionTransfer.destination) continue

      const accountAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        actionTransfer.destination.mint,
      )
      if (accountAddress === actionTransfer.destination.address)
        actionTransfers.push(actionTransfer)
    }

    const actionTransfer_a = actionTransfers[0]
    const actionTransfer_b = actionTransfers[1]
    if (!actionTransfer_a.destination || !actionTransfer_b.destination) continue

    history.time = transLog.blockTime
    history.mint_a = actionTransfer_a.destination.mint
    history.amount_a = BigInt(actionTransfer_a.amount)
    history.mint_b = actionTransfer_b.destination.mint
    history.amount_b = BigInt(actionTransfer_b.amount)

    withdrawHistories.push(history)
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
  const depositHistories: HistoryDepositType[] = []

  for (const transLog of transLogs) {
    if (transLog.actionType !== 'ADD_LIQUIDITY') continue

    const programDataEncode = transLog.programInfo?.data
    if (!programDataEncode) continue
    const dataBuffer = base58.decode(programDataEncode)
    const actionLayout = new struct([
      PROGRAM_DATA_CODE_SCHEMA,
      PROGRAM_DATA_DELTA_A_SCHEMA,
      PROGRAM_DATA_DELTA_B_SCHEMA,
    ])

    const programDataDecode: { delta_a: bigint; delta_b: bigint } =
      actionLayout.fromBuffer(Buffer.from(dataBuffer))

    const history = {} as HistoryDepositType

    history.time = transLog.blockTime
    history.amount_a = programDataDecode.delta_a
    history.amount_b = programDataDecode.delta_b

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
