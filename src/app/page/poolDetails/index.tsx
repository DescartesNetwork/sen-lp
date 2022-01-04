import { useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import PoolDetailsHeader from './poolDetailsHeader'
import LiquidityPosition from './liquidityPosition'
import PoolManagement from './management'
import TotalValueLocked from './totalValueLocked'
import Volume24h from './volume24h'
import Investment from './investment'

import { AppState } from 'app/model'

const PoolDetails = () => {
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <PoolDetailsHeader poolAddress={selectedPoolAddress} />
      </Col>
      <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 1 }}>
        <TotalValueLocked />
      </Col>
      <Col xs={{ span: 24, order: 3 }} md={{ span: 12, order: 2 }}>
        <LiquidityPosition poolAddress={selectedPoolAddress} />
      </Col>
      <Col xs={{ span: 24, order: 2 }} md={{ span: 12, order: 3 }}>
        <Volume24h />
      </Col>
      <Col xs={{ span: 24, order: 4 }} md={12}>
        <Investment poolAddress={selectedPoolAddress} />
      </Col>
      <Col xs={{ span: 24, order: 5 }} md={12}>
        <PoolManagement poolAddress={selectedPoolAddress} />
      </Col>
    </Row>
  )
}

export default PoolDetails
