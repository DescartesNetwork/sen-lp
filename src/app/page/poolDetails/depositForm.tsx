import { Card, Tabs } from 'antd'
import Deposit from 'app/components/deposit'
import Withdraw from 'app/components/withdraw'

const DepositForm = ({
  poolAddress,
  lpt,
}: {
  poolAddress: string
  lpt?: number
}) => {
  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <Tabs>
        <Tabs.TabPane tab="Deposit" key="deposit">
          <Deposit poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Withdraw" key="withdraw">
          <Withdraw poolAddress={poolAddress} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default DepositForm
