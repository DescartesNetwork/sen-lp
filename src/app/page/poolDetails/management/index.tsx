import { Card, Tabs } from 'antd'
import Fee from './fee'
import Freeze from './freeze'
import TransferOwner from './transferOwner'

import { usePool, useWallet } from 'senhub/providers'

const PoolManagement = ({ poolAddress }: { poolAddress: string }) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()
  const poolData = pools[poolAddress]

  if (!poolData || walletAddress !== poolData.owner) return null
  return (
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
  )
}

export default PoolManagement
