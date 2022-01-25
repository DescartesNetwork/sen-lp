import { Modal, Tabs } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import DepositHistory from './depositHistory'
import WithDrawHistory from './withdrawHistory'

import './index.less'

const History = ({
  visible,
  setVisible,
}: {
  visible: boolean
  setVisible: (isVisible: boolean) => void
}) => {
  return (
    <Modal
      footer={null}
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => setVisible(false)}
    >
      <Tabs>
        <Tabs.TabPane tab="Deposit history" key="deposit">
          <DepositHistory />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Withdraw history" key="withdraw">
          <WithDrawHistory />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

export default History
