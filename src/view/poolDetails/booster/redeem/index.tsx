import { useSelector } from 'react-redux'
import LazyLoad from '@sentre/react-lazyload'
import { usePool, useWallet } from '@sentre/senhub'

import { Col, Empty, Row } from 'antd'
import Order from './order'

import { AppState } from 'model'

const Redeem = ({ poolAddress }: { poolAddress: string }) => {
  const { orders, retailers } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const { mint_lpt } = pools[poolAddress] || {}
  const orderAddresses = Object.keys(orders).filter((orderAddress) => {
    const { retailer, owner } = orders[orderAddress] || {}
    const { mint_bid } = retailers[retailer] || {}
    return mint_bid === mint_lpt && owner === walletAddress
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
