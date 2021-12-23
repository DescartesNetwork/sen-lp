import { useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import { AppState } from 'app/model'
import Investment from './investment'
import LiquidityPosition from './liquidityPosition'
import PoolManagement from './management'
import TotalValueLocked from './totalValueLocked'
import Volume24h from './volume24h'
import PoolDetailsHeader from './poolDetailsHeader'

const PoolDetails = () => {
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <PoolDetailsHeader poolAddress={selectedPoolAddress} />
      </Col>
      <Col xs={24} lg={12}>
        <TotalValueLocked />
      </Col>
      <Col xs={24} lg={12}>
        <Volume24h />
      </Col>
      <Col xs={24} lg={12}>
        <LiquidityPosition poolAddress={selectedPoolAddress} />
      </Col>
      <Col xs={24} lg={12}>
        <Investment />
      </Col>
      <PoolManagement poolAddress={selectedPoolAddress} />
    </Row>
  )
}

export default PoolDetails
