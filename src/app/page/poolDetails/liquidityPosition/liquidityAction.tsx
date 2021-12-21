import { useState } from 'react'

import { Button, Col, Modal, Row } from 'antd'
import Deposit from 'app/components/deposit'
import Withdraw from 'app/components/withdraw'
import IonIcon from 'shared/antd/ionicon'

const LiquidityAction = ({ poolAddress }: { poolAddress: string }) => {
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)

  return (
    <Row gutter={[12, 12]}>
      <Col span={12}>
        <Button
          onClick={() => setWithdrawVisible(true)}
          icon={<IonIcon name="log-out-outline" />}
          block
        >
          Withdraw
        </Button>
      </Col>
      <Col span={12}>
        <Button
          onClick={() => setDepositVisible(true)}
          type="primary"
          icon={<IonIcon name="log-in-outline" />}
          block
        >
          Deposit
        </Button>
      </Col>
      <Modal
        visible={depositVisible}
        onCancel={() => setDepositVisible(false)}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Deposit
          poolAddress={poolAddress}
          onClose={() => setDepositVisible(false)}
        />
      </Modal>
      <Modal
        visible={withdrawVisible}
        onCancel={() => setWithdrawVisible(false)}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Withdraw lptAddress={''} onClose={() => setWithdrawVisible(false)} />
      </Modal>
    </Row>
  )
}

export default LiquidityAction
