import { Card, Col, Row, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import SenChart from 'app/components/chart'

import PoolService from 'app/stat/logic/pool/pool'
import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { DataLoader } from 'shared/dataloader'

const CHART_CONFIGS = {
  color: '#40A9FF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}

const TotalValueLocked = () => {
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const [chartData, setChartData] = useState<{ data: number; label: string }[]>(
    [],
  )
  const tvlChartConfigs = {
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
    const poolService = new PoolService(selectedPoolAddress)
    const poolStat = await DataLoader.load(
      'getDailyInfo' + selectedPoolAddress,
      poolService.getDailyInfo,
    )
    const chartData = Object.keys(poolStat).map((time) => {
      return {
        data: poolStat[time].tvl,
        label: moment(time, 'YYYYMMDD').format('DD/MM'),
      }
    })
    return setChartData(chartData)
  }, [selectedPoolAddress])
  useEffect(() => {
    fetchChart()
  }, [fetchChart])

  return (
    <Card bordered={false} style={{ height: 'auto' }}>
      <Row gutter={[24, 24]}>
        <Col flex="auto">
          <Typography.Title level={4}>Total Value Locked</Typography.Title>
        </Col>
        <Col>
          <Typography.Title level={2}>
            {numeric(chartData.at(-1)?.data).format('0,0.[0]m')}
          </Typography.Title>
        </Col>
        <Col span={24}>
          <SenChart
            chartData={chartData.map((e) => e.data)}
            labels={chartData.map((e) => e.label)}
            configs={tvlChartConfigs}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default TotalValueLocked
