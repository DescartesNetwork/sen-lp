import { Col, Row } from 'antd'
import LiquidityPosition from './liquidityPosition'
import PoolManagement from './management'
import TotalValueLocked from './totalValueLocked'
import Volume24h from './volume24h'

const PoolDetails = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <TotalValueLocked />
      </Col>
      <Col xs={24} lg={12}>
        <LiquidityPosition />
      </Col>
      <Col xs={24} md={12}>
        <Volume24h />
      </Col>
      <PoolManagement address={'h73Yd9mAzNsvfGDSYk1kPVmkKhSWcuscte44Knn4iJQ'} />
    </Row>
  )
}

export default PoolDetails
