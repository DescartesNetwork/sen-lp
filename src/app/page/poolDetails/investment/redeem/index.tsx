import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Col, Empty, Row } from 'antd'
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
    <Row
      gutter={[16, 16]}
      style={{ height: 282 }}
      className="scrollbar"
      justify="center"
      align="top"
    >
      {!orderAddresses.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {orderAddresses.map((orderAddress) => (
        <Col span={24} key={orderAddress}>
          <LazyLoad height={125} overflow>
            <Order orderAddress={orderAddress} />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default Redeem
