import { Col, Card, Tabs } from 'antd'
import { usePool, useWallet } from 'senhub/providers'

import Fee from './fee'
import Freeze from './freeze'
import TransferOwner from './transferOwner'

export default function PoolManagement({
  poolAddress,
}: {
  poolAddress: string
}) {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()
  const poolData = pools?.[poolAddress]
  if (!poolData || walletAddress !== poolData?.owner) return null
  return (
    <Col xs={24} lg={12}>
      <Card
        style={{ minHeight: 285 }}
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        <Tabs style={{ padding: 24 }}>
          <Tabs.TabPane key="freeze-thaw" tab="Freeze/Thaw">
            <Freeze address={poolAddress} />
          </Tabs.TabPane>
          <Tabs.TabPane key="fee" tab="Fee">
            <Fee address={poolAddress}></Fee>
          </Tabs.TabPane>
          <Tabs.TabPane key="transfer-owner" tab="Transfer Owner">
            <TransferOwner address={poolAddress} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Col>
  )
}
