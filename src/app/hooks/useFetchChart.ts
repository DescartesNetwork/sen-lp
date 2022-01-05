import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { AppState } from 'app/model'
import PoolService from 'app/stat/logic/pool/pool'
import { DataLoader } from 'shared/dataloader'

const TTL_5_MIN = 300000
export const useFetchChart = () => {
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const [chartData, setChartData] = useState<{ data: number; label: string }[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(false)

  const fetchChart = useCallback(async () => {
    if (!selectedPoolAddress) return
    try {
      setIsLoading(true)
      const poolService = new PoolService(selectedPoolAddress)
      const poolStat = await DataLoader.load(
        'getDailyInfo' + selectedPoolAddress,
        poolService.getDailyInfo,
        { cache: { ttl: TTL_5_MIN } },
      )
      const chartData = Object.keys(poolStat).map((time) => {
        return {
          data: poolStat[time].tvl,
          label: moment(time, 'YYYYMMDD').format('MM/DD'),
        }
      })
      setChartData(chartData)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }, [selectedPoolAddress])
  useEffect(() => {
    fetchChart()
  }, [fetchChart])

  return {
    chartData,
    isLoading,
  }
}
