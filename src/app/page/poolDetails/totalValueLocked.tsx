import { Card, Col, Row, Typography } from 'antd'
import ApexChart from 'app/components/apexChart'
import SenChart from 'app/components/chart'

const CHART_CONFIGS = {
  color: '#40A9FF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}

const TotalValueLocked = () => {
  const tvlChartConfigs = {
    borderColor: CHART_CONFIGS.transparent,
    borderRadius: CHART_CONFIGS.radius,
    pointRadius: CHART_CONFIGS.radius,
    tooltip: CHART_CONFIGS.tooltip,
    pointHitRadius: CHART_CONFIGS.hitRadius,
    pointHoverRadius: CHART_CONFIGS.radius,
    backgroundColor: CHART_CONFIGS.color,
  }

  return (
    <Card bordered={false} style={{ height: 'auto' }}>
      <Row gutter={[24, 24]}>
        <Col flex="auto">
          <Typography.Title level={4}>Total Value Locked</Typography.Title>
        </Col>
        <Col>
          <Typography.Title level={2}>$123.5M</Typography.Title>
        </Col>
        <Col span={24}>
          <SenChart
            chartData={[12, 3, 4, 12, 51, 2]}
            labels={['20/10', '21/10', '22/10', '23/10', '24/10', '25/10']}
            configs={tvlChartConfigs}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default TotalValueLocked
