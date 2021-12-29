import { useSelector } from 'react-redux'

import { Col, Row, Typography } from 'antd'
import Order from './order'

import { AppState } from 'app/model'
import { usePool } from 'senhub/providers'

const Redeem = ({ poolAddress }: { poolAddress: string }) => {
  const { orders, retailers } = useSelector((state: AppState) => state)
  const { pools } = usePool()

  const { mint_lpt } = pools[poolAddress] || {}
  const orderAddresses = Object.keys(orders).filter((orderAddress) => {
    const { retailer } = orders[orderAddress] || {}
    const { mint_bid } = retailers[retailer] || {}
    return mint_bid === mint_lpt
  })

  return (
    <Row gutter={[16, 16]} style={{ maxHeight: 282 }} className="scrollbar">
      {!orderAddresses.length && (
        <Typography.Text type="secondary">No available order</Typography.Text>
      )}
      {orderAddresses.map((orderAddress) => (
        <Col span={24} key={orderAddress}>
          <Order orderAddress={orderAddress} />
        </Col>
      ))}
    </Row>
  )
}

export default Redeem
