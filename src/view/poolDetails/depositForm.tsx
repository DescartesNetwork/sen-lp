import { useState } from 'react'
import { useWalletAddress } from '@sentre/senhub'

import { Button, Card, Modal, Tabs } from 'antd'
import Deposit from 'components/deposit'
import Withdraw from 'components/withdraw'
import IonIcon from '@sentre/antd-ionicon'
import DepositHistory from './history/deposit'
import WithDrawHistory from './history/withdraw'
import Reinvestment from './booster/reinvestment'
import Redeem from './booster/redeem'
import Admin from './booster/admin'

import { usePool } from 'hooks/pools/usePool'

const DepositForm = ({
  poolAddress,
  lpt,
}: {
  poolAddress: string
  lpt?: number
}) => {
  const [visible, setVisible] = useState(false)
  const [selectedTab, setSelectedTab] = useState('deposit')
  const walletAddress = useWalletAddress()
  const { pools } = usePool()

  const isOwner = walletAddress === pools[poolAddress]?.owner
  const isDeposit = selectedTab === 'deposit'
  const actionItems = [
    {
      label: 'Deposit',
      key: 'deposit',
      children: <Deposit poolAddress={poolAddress} />,
    },
    {
      label: 'Withdraw',
      key: 'withdraw',
      children: <Withdraw poolAddress={poolAddress} />,
    },
    {
      label: 'Reinvestmnet',
      key: 'reinvestmnet',
      children: <Reinvestment poolAddress={poolAddress} />,
    },
    {
      label: 'Redeem',
      key: 'redeem',
      children: <Redeem poolAddress={poolAddress} />,
    },
  ]

  const historyItems = [
    {
      label: 'Deposit',
      key: 'deposit-history',
      children: <DepositHistory />,
    },
    {
      label: 'Withdraw',
      key: 'withdraw-history',
      children: <WithDrawHistory />,
    },
  ]

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
        items={
          isOwner
            ? actionItems
            : [
                ...actionItems,
                {
                  label: 'Admin',
                  key: 'admin',
                  children: <Admin poolAddress={poolAddress} />,
                },
              ]
        }
      />
      <Modal
        closeIcon={<IonIcon name="close-outline" />}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={false}
      >
        <Tabs items={historyItems} />
      </Modal>
    </Card>
  )
}

export default DepositForm
