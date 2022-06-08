import { useState } from 'react'

import { usePool, useWallet } from '@senhub/providers'
import { Button, Card, Modal, Tabs } from 'antd'
import Deposit from 'app/components/deposit'
import Withdraw from 'app/components/withdraw'
import IonIcon from '@sentre/antd-ionicon'
import DepositHistory from './history/deposit'
import WithDrawHistory from './history/withdraw'
import Reinvestment from './booster/reinvestment'
import Redeem from './booster/redeem'
import Admin from './booster/admin'

const DepositForm = ({
  poolAddress,
  lpt,
}: {
  poolAddress: string
  lpt?: number
}) => {
  const [visible, setVisible] = useState(false)
  const [selectedTab, setSelectedTab] = useState('deposit')
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()

  const isOwner = walletAddress === pools[poolAddress]?.owner
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
