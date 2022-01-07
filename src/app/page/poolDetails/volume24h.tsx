import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Spin, Typography } from 'antd'
import SenChart from 'app/components/chart'

import PoolService from 'app/stat/logic/pool/pool'
import { AppState } from 'app/model'
import { DataLoader } from 'shared/dataloader'
import { numeric } from 'shared/util'
import { useUI } from 'senhub/providers'
import IonIcon from 'shared/antd/ionicon'

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
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(true)
  const {
    ui: { width },
  } = useUI()

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
      setLoading(true)
      const poolService = new PoolService(selectedPoolAddress)
      const poolStat = await DataLoader.load(
        'getDailyInfo' + selectedPoolAddress,
        poolService.getDailyInfo,
        { cache: { ttl: TTL_5_MIN } },
      )
      const chartData = Object.keys(poolStat).map((time) => {
        return {
          data: poolStat[time].volume,
          label: moment(time, 'YYYYMMDD').format('MM/DD'),
        }
      })
      setChartData(chartData)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [selectedPoolAddress])

  useEffect(() => {
    fetchChart()
  }, [fetchChart])

  const iconName = visible ? 'chevron-down-outline' : 'chevron-forward-outline'
  const isMobile = width < 768

  useEffect(() => {
    if (!isMobile) return setVisible(true)
    return setVisible(false)
  }, [isMobile])

  const vol24h = useMemo(() => {
    const today = chartData[chartData.length - 1]?.data || 0
    const yesterday = chartData[chartData.length - 2]?.data || 0
    const house = new Date().getHours()
    return today + (house * yesterday) / 24
  }, [chartData])

  return (
    <Card bordered={false}>
      <Spin tip="Loading..." spinning={loading}>
        <Row gutter={[24, 24]}>
          <Col flex="auto">
            <Typography.Title level={4}>24h Volume</Typography.Title>
          </Col>
          <Col>
            <Space>
              <Typography.Title level={2}>
                ${numeric(vol24h).format('0,0.[0]a')}
              </Typography.Title>
              {isMobile && (
                <Button
                  type="text"
                  shape="circle"
                  icon={<IonIcon name={iconName} />}
                  onClick={() => setVisible(!visible)}
                />
              )}
            </Space>
          </Col>
          {visible && (
            <Col span={24}>
              <SenChart
                type="bar"
                chartData={chartData.map((e) => e.data)}
                labels={chartData.map((e) => e.label)}
                configs={volumeChartConfigs}
              />
            </Col>
          )}
        </Row>
      </Spin>
    </Card>
  )
}

export default Volume24h
