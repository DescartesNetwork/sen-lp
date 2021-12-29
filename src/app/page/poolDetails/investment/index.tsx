import { Card, Tabs } from 'antd'
import Redeem from './redeem'
import ReInvestment from './reinvestment'

const Investment = ({ poolAddress }: { poolAddress: string }) => {
  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: 0 }}
      style={{ minHeight: 384 }}
    >
      <Tabs style={{ padding: '16px 24px 24px 24px' }}>
        <Tabs.TabPane key="investmnet" tab="Reinvestment">
          <ReInvestment poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="redeem" tab="Redeem">
          <Redeem />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Investment
