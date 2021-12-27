import { PoolData, utils } from '@senswap/sen-js'

import { fetchCGK } from 'shared/helper'
import TokenProvider from 'os/providers/tokenProvider'
import { TotalSummary } from 'app/stat/constants/summary'
import { DailyReport } from 'app/stat/entities/daily-report'
import { DateHelper } from 'app/stat/helpers/date'

import DailyReportService from '../daily-report'
import PoolTransLogService, { SwapActionType } from './poolTranslog'

const DATE_RANGE = 11

export default class PoolService {
  poolAddress: string
  poolData: PoolData | undefined
  poolTransLogService = new PoolTransLogService()
  dailyReportService = new DailyReportService()
  tokenProvider = new TokenProvider()

  constructor(poolAddress: string) {
    this.poolAddress = poolAddress
  }

  getPoolData = async (): Promise<PoolData> => {
    if (!this.poolData) {
      const swap = window.sentre.swap
      this.poolData = await swap.getPoolData(this.poolAddress)
    }
    return this.poolData
  }

  getUsd = async (mint: string, amountBigint: bigint) => {
    const mintInfo = await this.tokenProvider.findByAddress(mint)
    if (!mintInfo) return 0
    const { decimals, extensions } = mintInfo
    try {
      const cgkData = await fetchCGK(extensions?.coingeckoId)
      if (!cgkData?.price) return 0
      const amount = utils.undecimalize(amountBigint, decimals)
      return Number(amount) * cgkData.price
    } catch (error) {
      return 0
    }
  }
  getDailyInfo = async () => {
    let timeTo = new DateHelper()
    const timeFrom = new DateHelper().subtractDay(DATE_RANGE)
    const {
      mint_a,
      mint_b,
      treasury_a,
      treasury_b,
      reserve_a,
      reserve_b,
      fee_ratio,
      tax_ratio,
    } = await this.getPoolData()

    // fetch transLog
    const transLogs = await this.poolTransLogService.collect(this.poolAddress, {
      secondFrom: timeFrom.seconds(),
      secondTo: timeTo.seconds(),
    })
    // parse daily + create map time
    const dailyReports = this.dailyReportService.parserDailyReport(transLogs)
    const mapTimeDailyReport: Record<number, DailyReport[]> = {}
    for (const report of dailyReports) {
      const { time, address } = report
      // filter daily report
      if (address !== treasury_a && address !== treasury_b) continue
      if (!mapTimeDailyReport[time]) mapTimeDailyReport[time] = []
      mapTimeDailyReport[time].push(report)
    }
    // parse summary
    const tvlA = await this.getUsd(mint_a, reserve_a)
    const tvlB = await this.getUsd(mint_b, reserve_b)

    const mapTimeTotal: Record<string, TotalSummary> = {}

    mapTimeTotal[timeTo.ymd()] = {
      tvl: tvlA + tvlB,
      fee: 0,
      volume: 0,
    }

    while (timeTo.ymd() > timeFrom.ymd()) {
      const reports = mapTimeDailyReport[timeTo.ymd()] || []
      const currentReport = mapTimeTotal[timeTo.ymd()]
      const prevDate = timeTo.subtractDay(1)
      if (!mapTimeTotal[prevDate.ymd()] && prevDate.ymd() >= timeFrom.ymd()) {
        mapTimeTotal[prevDate.ymd()] = {
          tvl: currentReport.tvl,
          fee: 0,
          volume: 0,
        }
      }
      for (const report of reports) {
        const amountOut = await this.getUsd(report.mint, report.amountOut)
        const amountIn = await this.getUsd(report.mint, report.amountIn)
        if (mapTimeTotal[prevDate.ymd()]) {
          mapTimeTotal[prevDate.ymd()].tvl += amountOut - amountIn
          if (mapTimeTotal[prevDate.ymd()].tvl < 0)
            mapTimeTotal[prevDate.ymd()].tvl = 0
        }
        if (report.actionType === SwapActionType.Swap) {
          mapTimeTotal[timeTo.ymd()].volume += amountIn + amountOut
          const fee =
            Number(utils.undecimalize(fee_ratio + tax_ratio, 9)) * amountOut
          mapTimeTotal[timeTo.ymd()].fee += fee
        }
      }
      timeTo = timeTo.subtractDay(1)
    }

    return mapTimeTotal
  }
}
