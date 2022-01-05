import { useEffect, useState } from 'react'

import { Card, Col, Row, Typography, Spin, Space, Button } from 'antd'
import SenChart from 'app/components/chart'

import { numeric } from 'shared/util'
import IonIcon from 'shared/antd/ionicon'
import { useUI } from 'senhub/providers'
import { useFetchChart } from 'app/hooks/useFetchChart'

const CHART_CONFIGS = {
  color: '#40A9FF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}

const TotalValueLocked = () => {
  const [visible, setVisible] = useState(true)
  const {
    ui: { width },
  } = useUI()
  const { chartData, isLoading } = useFetchChart()

  const tvlChartConfigs = {
    borderColor: CHART_CONFIGS.transparent,
    borderRadius: CHART_CONFIGS.radius,
    pointRadius: CHART_CONFIGS.radius,
    tooltip: CHART_CONFIGS.tooltip,
    pointHitRadius: CHART_CONFIGS.hitRadius,
    pointHoverRadius: CHART_CONFIGS.radius,
    backgroundColor: CHART_CONFIGS.color,
  }

  const iconName = visible ? 'chevron-down-outline' : 'chevron-forward-outline'
  const isMobile = width < 768

  useEffect(() => {
    if (!isMobile) return setVisible(true)
    return setVisible(false)
  }, [isMobile])

  return (
    <Card bordered={false} style={{ height: 'auto' }}>
      <Spin tip="Loading..." spinning={isLoading}>
        <Row gutter={[24, 24]}>
          <Col flex="auto">
            <Typography.Title level={4}>Total Value Locked</Typography.Title>
          </Col>
          <Col>
            <Space>
              <Typography.Title level={2}>
                $
                {numeric(chartData[chartData.length - 1]?.data).format(
                  '0,0.[0]a',
                )}
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
                chartData={chartData.map((e) => e.data)}
                labels={chartData.map((e) => e.label)}
                configs={tvlChartConfigs}
              />
            </Col>
          )}
        </Row>
      </Spin>
    </Card>
  )
}

export default TotalValueLocked
