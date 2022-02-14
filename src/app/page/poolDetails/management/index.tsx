import { Modal, Tabs } from 'antd'
import Fee from './fee'
import Freeze from './freeze'
import TransferOwner from './transferOwner'

type PropsType = {
  poolAddress: string
  visible?: boolean
  onClose?: () => void
}

const PoolManagement = ({
  poolAddress,
  visible = false,
  onClose = () => {},
}: PropsType) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      centered
      closable={false}
      footer={false}
      style={{ minHeight: 285 }}
      bodyStyle={{ padding: 0 }}
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
    </Modal>
  )
}

export default PoolManagement
