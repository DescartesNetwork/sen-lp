import { Button, Card, Modal, Tabs } from 'antd'
import Deposit from 'app/components/deposit'
import Withdraw from 'app/components/withdraw'
import { useState } from 'react'
import IonIcon from 'shared/antd/ionicon'
import DepositHistory from './history/deposit'
import WithDrawHistory from './history/withdraw'

const DepositForm = ({
  poolAddress,
  lpt,
}: {
  poolAddress: string
  lpt?: number
}) => {
  const [visible, setVisible] = useState(false)
  const [selectedTab, setSelectedTab] = useState('deposit')

  const isDeposit = selectedTab === 'deposit'

  return (
    <Card bordered={false} style={{ height: isDeposit ? '100%' : 'auto' }}>
      <Tabs
        tabBarExtraContent={
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<IonIcon name="document-outline" />}
            onClick={() => setVisible(true)}
          />
        }
        activeKey={selectedTab}
        onChange={setSelectedTab}
      >
        <Tabs.TabPane tab="Deposit" key="deposit">
          <Deposit poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Withdraw" key="withdraw">
          <Withdraw poolAddress={poolAddress} />
        </Tabs.TabPane>
      </Tabs>
      <Modal
        closeIcon={<IonIcon name="close-outline" />}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
      >
        <Tabs>
          <Tabs.TabPane tab="Deposit" key="deposit-history">
            <DepositHistory />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Withdraw" key="withdraw-history">
            <WithDrawHistory />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </Card>
  )
}

export default DepositForm
