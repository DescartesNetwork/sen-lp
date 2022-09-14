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
  const items = [
    {
      label: 'Freeze/Thaw',
      key: 'freeze-thaw',
      children: <Freeze address={poolAddress} />,
    },
    { label: 'Fee', key: 'fee', children: <Fee address={poolAddress} /> },
    {
      label: 'Transfer Owner',
      key: 'transfer-owner',
      children: <TransferOwner address={poolAddress} />,
    },
  ]

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      centered
      closable={false}
      footer={false}
      style={{ minHeight: 285 }}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs style={{ padding: 24 }} items={items} />
    </Modal>
  )
}

export default PoolManagement
