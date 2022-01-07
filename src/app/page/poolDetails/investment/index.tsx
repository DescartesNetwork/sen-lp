import { Card, Tabs } from 'antd'
import Redeem from './redeem'
import ReInvestment from './reinvestment'
import Admin from './admin'

import { usePool, useWallet } from 'senhub/providers'

const Investment = ({ poolAddress }: { poolAddress: string }) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()

  const poolData = pools[poolAddress]
  const isOwner = walletAddress === poolData?.owner

  return (
    <Card
      bordered={false}
      style={{ height: '100%' }}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs style={{ padding: '16px 24px 24px 24px' }}>
        <Tabs.TabPane key="investmnet" tab="Reinvestment">
          <ReInvestment poolAddress={poolAddress} />
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

export default Investment
