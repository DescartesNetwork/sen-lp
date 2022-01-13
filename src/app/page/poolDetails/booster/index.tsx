import { usePool, useWallet } from '@senhub/providers'

import { Card, Tabs } from 'antd'
import Redeem from './redeem'
import Reinvestment from './reinvestment'
import Admin from './admin'

const Booster = ({ poolAddress }: { poolAddress: string }) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()

  const isOwner = walletAddress === pools[poolAddress]?.owner

  return (
    <Card bordered={false} bodyStyle={{ padding: 0, minHeight: 384 }}>
      <Tabs style={{ padding: '16px 24px 24px 24px' }}>
        <Tabs.TabPane key="reinvestmnet" tab="Reinvestment">
          <Reinvestment poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="redeem" tab="Redeem">
          <Redeem poolAddress={poolAddress} />
        </Tabs.TabPane>
        {isOwner ? (
          <Tabs.TabPane key="admin" tab="Admin">
            <Admin poolAddress={poolAddress} />
          </Tabs.TabPane>
        ) : null}
      </Tabs>
    </Card>
  )
}

export default Booster
