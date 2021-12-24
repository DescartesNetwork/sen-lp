import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { Card, Col, Row, Spin, Typography } from 'antd'
import SenChart from 'app/components/chart'

import PoolService from 'app/stat/logic/pool/pool'
import { AppState } from 'app/model'
import { DataLoader } from 'shared/dataloader'
import { numeric } from 'shared/util'

const CHART_CONFIGS = {
  color: '#40A9FF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}
const TTL_5_MIN = 300000

const Volume24h = () => {
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const [chartData, setChartData] = useState<{ data: number; label: string }[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(false)

  const volumeChartConfigs = {
    borderColor: CHART_CONFIGS.transparent,
    borderRadius: CHART_CONFIGS.radius,
    pointRadius: CHART_CONFIGS.radius,
    tooltip: CHART_CONFIGS.tooltip,
    pointHitRadius: CHART_CONFIGS.hitRadius,
    pointHoverRadius: CHART_CONFIGS.radius,
    backgroundColor: CHART_CONFIGS.color,
  }

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
          data: poolStat[time].volume,
          label: moment(time, 'YYYYMMDD').format('DD/MM'),
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

  const vol24h = useMemo(() => {
    const today = chartData.at(-1)?.data || 0
    const yesterday = chartData.at(-2)?.data || 0
    const house = new Date().getHours()
    return today + (house * yesterday) / 24
  }, [chartData])

  return (
    <Card bordered={false} style={{ height: 384 }}>
      <Spin tip="Loading..." spinning={isLoading}>
        <Row gutter={[24, 24]}>
          <Col flex="auto">
            <Typography.Title level={4}>24h Volume</Typography.Title>
          </Col>
          <Col>
            <Typography.Title level={2}>
              {numeric(vol24h).format('0,0.[0]a')}
            </Typography.Title>
          </Col>
          <Col span={24}>
            <SenChart
              type="bar"
              chartData={chartData.map((e) => e.data)}
              labels={chartData.map((e) => e.label)}
              configs={volumeChartConfigs}
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  )
}

export default Volume24h
