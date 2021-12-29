import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col } from 'antd'
import NewRetailer from './newRetailer'
import State from './state'

import { AppState } from 'app/model'
import { usePool, useWallet } from 'senhub/providers'

const Admin = ({ poolAddress }: { poolAddress: string }) => {
  const { retailers } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const poolData = pools[poolAddress]
  const retailerIndex = Object.values(retailers).findIndex(
    ({ mint_bid, owner }) =>
      owner === walletAddress && mint_bid === poolData?.mint_lpt,
  )
  const retailerAddress = Object.keys(retailers)[retailerIndex]

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {!account.isAddress(retailerAddress) ? (
          <NewRetailer poolAddress={poolAddress} />
        ) : (
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <State retailerAddress={retailerAddress} />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default Admin
